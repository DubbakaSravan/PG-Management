// pages/api/analytics/index.js
import { read, toRent, toTenant, toRoom, toComp, toElec } from "../../../lib/sheets";
import { requireAuth } from "../../../lib/auth";
export default async function handler(req, res) {
  const user = requireAuth(req, res); if (!user) return;
  if (user.role !== "owner") return res.status(403).json({ error:"Forbidden" });
  try {
    const [rentRows, tenantRows, roomRows, compRows, elecRows] = await Promise.all([
      read("Rent!A:L"), read("Tenants!A:P"), read("Rooms!A:J"), read("Complaints!A:K"), read("Electricity!A:J")
    ]);
    const rents    = rentRows.slice(1).filter(r=>r[0]).map(toRent);
    const tenants  = tenantRows.slice(1).filter(r=>r[0]).map(toTenant);
    const rooms    = roomRows.slice(1).filter(r=>r[0] && r[8]!=="deleted").map(toRoom);
    const comps    = compRows.slice(1).filter(r=>r[0]).map(toComp);
    const elec     = elecRows.slice(1).filter(r=>r[0]).map(toElec);
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    const paid = rents.filter(r=>r.status==="paid");
    const pending = rents.filter(r=>r.status==="pending");
    const thisMonthPaid = paid.filter(r=>r.month===thisMonth);
    const thisMonthPending = pending.filter(r=>r.month===thisMonth);
    // Revenue last 6 months
    const byMonth = {};
    const months6 = [];
    for (let i=5;i>=0;i--) { const d=new Date(now.getFullYear(),now.getMonth()-i,1); const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; months6.push(k); byMonth[k]=0; }
    paid.forEach(r=>{ if(byMonth[r.month]!==undefined) byMonth[r.month]+=r.amount; });
    // Room type distribution
    const byType = {};
    rooms.forEach(r=>{ if(!byType[r.type]) byType[r.type]={total:0,occupied:0,revenue:0}; byType[r.type].total++; if(r.occupied>0){byType[r.type].occupied++;byType[r.type].revenue+=r.rent;} });
    // Complaint stats
    const compByCategory = {};
    comps.forEach(c=>{ compByCategory[c.category]=(compByCategory[c.category]||0)+1; });
    // Tenant stats
    const maleCount = tenants.filter(t=>t.gender==="Male"&&t.status==="active").length;
    const femaleCount = tenants.filter(t=>t.gender==="Female"&&t.status==="active").length;
    // Upcoming move-outs (next 30 days)
    const upcomingMoveOuts = tenants.filter(t=>{
      if(!t.leaveDate||t.status!=="active") return false;
      const diff = (new Date(t.leaveDate)-now)/86400000;
      return diff>=0 && diff<=30;
    });
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r=>r.occupied>0).length;
    const activeTenants = tenants.filter(t=>t.status==="active").length;
    const totalRevenue = paid.reduce((s,r)=>s+r.amount,0);
    const thisMonthRev = thisMonthPaid.reduce((s,r)=>s+r.amount,0);
    const pendingAmount = pending.reduce((s,r)=>s+r.amount,0);
    const openComplaints = comps.filter(c=>c.status==="open").length;
    const pendingElec = elec.filter(e=>e.status==="pending").reduce((s,e)=>s+e.amount,0);
    res.json({
      totalRooms, occupiedRooms, activeTenants, totalRevenue, thisMonthRev,
      pendingAmount, openComplaints, pendingElec,
      occupancyRate: totalRooms ? Math.round((occupiedRooms/totalRooms)*100) : 0,
      collectionRate: (thisMonthPaid.length+thisMonthPending.length) > 0
        ? Math.round((thisMonthPaid.length/(thisMonthPaid.length+thisMonthPending.length))*100) : 0,
      maleCount, femaleCount,
      byMonth, months6, byType, compByCategory,
      upcomingMoveOuts,
      recentActivity: [
        ...paid.slice(-5).map(r=>({type:"rent_paid",text:`${r.tenantName} paid ₹${r.amount}`,time:r.paidDate,color:"#22c55e"})),
        ...comps.filter(c=>c.status==="open").slice(-5).map(c=>({type:"complaint",text:`Room ${c.roomNumber}: ${c.category}`,time:c.createdAt,color:"#f59e0b"})),
      ].sort((a,b)=>b.time?.localeCompare(a.time||"")),
      tenantList: tenants.filter(t=>t.status==="active"),
      pendingRents: pending.slice(0,10),
      openComplaintList: comps.filter(c=>c.status==="open"),
    });
  } catch(e) { res.status(500).json({ error:e.message }); }
}
