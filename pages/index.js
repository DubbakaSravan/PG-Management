// pages/index.js
import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = n => `₹${Number(n||0).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().split("T")[0];
const thisMonth = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; };
const last6Months = () => { const arr=[],d=new Date(); for(let i=5;i>=0;i--){const m=new Date(d.getFullYear(),d.getMonth()-i,1);arr.push(`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}`);} return arr; };
const ROOM_TYPES=["Single","Double","Triple","Studio","Deluxe"];
const FLOORS=["Ground","1st","2nd","3rd","4th","5th"];
const AMENITIES=["AC","WiFi","Attached Bathroom","Balcony","Wardrobe","Geyser","Refrigerator","TV"];
const COMPLAINT_CATS=["Plumbing","Electrical","Carpentry","Cleaning","AC","WiFi","Furniture","Other"];
const PRIORITIES=["low","medium","high","urgent"];
const GENDERS=["Male","Female","Other"];
const SC={pending:"#f59e0b",paid:"#22c55e",overdue:"#ef4444",open:"#f59e0b","in-progress":"#3b82f6",resolved:"#22c55e",available:"#22c55e",full:"#ef4444",active:"#22c55e",inactive:"#6b7280"};
const CAT_IC={Plumbing:"🚿",Electrical:"⚡",Carpentry:"🪚",Cleaning:"🧹",AC:"❄️",WiFi:"📶",Furniture:"🪑",Other:"🔧"};

// ── API ────────────────────────────────────────────────────────────────────
function api(path,opts={}){
  const token=typeof window!=="undefined"?localStorage.getItem("nq_token"):null;
  return fetch(`/api/${path}`,{...opts,headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{}),...(opts.headers||{})},body:opts.body?JSON.stringify(opts.body):undefined}).then(r=>r.json());
}

// ── Toast ──────────────────────────────────────────────────────────────────
function useToast(){
  const [toasts,setToasts]=useState([]);
  const show=useCallback((msg,type="success")=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),4000);
  },[]);
  return{toasts,show};
}

// ── 3D Building Component ──────────────────────────────────────────────────
function Building3D({rooms,onRoomClick}){
  const floors=FLOORS.slice(0,4);
  const roomsByFloor={};
  floors.forEach(f=>{roomsByFloor[f]=rooms.filter(r=>r.floor===f);});
  return(
    <div style={{perspective:"1000px",perspectiveOrigin:"50% 40%",padding:"20px 0"}}>
      <div style={{transform:"rotateX(20deg) rotateY(-10deg)",transformStyle:"preserve-3d",display:"inline-block",width:"100%"}}>
        {[...floors].reverse().map((floor,fi)=>(
          <div key={floor} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,transformStyle:"preserve-3d"}}>
            <div style={{width:60,fontSize:10,color:"#475569",fontWeight:700,textAlign:"right",flexShrink:0}}>{floor} Fl.</div>
            <div style={{display:"flex",gap:6,flex:1,background:"linear-gradient(90deg,#0d1628,#0a1120)",border:"1px solid #1e3a5f",borderRadius:8,padding:"8px 12px",boxShadow:"0 4px 20px #00000060",transform:`translateZ(${fi*2}px)`}}>
              {roomsByFloor[floor]?.length>0 ? roomsByFloor[floor].map(room=>{
                const occ=room.occupied>=room.capacity;
                const partial=room.occupied>0&&!occ;
                return(
                  <button key={room.id} onClick={()=>onRoomClick(room)}
                    style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:60,height:52,borderRadius:6,border:`1px solid ${occ?"#ef444440":partial?"#f59e0b40":"#22c55e40"}`,background:occ?"linear-gradient(135deg,#1a0a0a,#2a1010)":partial?"linear-gradient(135deg,#1a140a,#2a200a)":"linear-gradient(135deg,#0a1a0a,#102010)",cursor:"pointer",transition:"all .2s",boxShadow:occ?"0 0 12px #ef444420":partial?"0 0 12px #f59e0b20":"0 0 12px #22c55e20",position:"relative"}}>
                    <div style={{fontSize:16}}>{occ?"🔴":partial?"🟡":"🟢"}</div>
                    <div style={{fontSize:9,fontWeight:800,color:"#e2e8f0",marginTop:2}}>{room.number}</div>
                    <div style={{fontSize:8,color:"#64748b"}}>{room.occupied}/{room.capacity}</div>
                  </button>
                );
              }) : <div style={{fontSize:11,color:"#334155",padding:"8px 4px"}}>No rooms on this floor</div>}
            </div>
          </div>
        ))}
        {/* Building base */}
        <div style={{height:12,background:"linear-gradient(90deg,#0d1628,#0a1120)",border:"1px solid #1e3a5f",borderRadius:"0 0 12px 12px",marginLeft:68,boxShadow:"0 8px 30px #00000080"}}/>
      </div>
      <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:16,fontSize:11,color:"#64748b"}}>
        {[["🟢","Available"],["🟡","Partial"],["🔴","Full"]].map(([ic,lb])=>(
          <div key={lb} style={{display:"flex",alignItems:"center",gap:4}}><span>{ic}</span><span>{lb}</span></div>
        ))}
      </div>
    </div>
  );
}

// ── Revenue Chart ──────────────────────────────────────────────────────────
function RevenueChart({byMonth,months}){
  const vals=months.map(m=>byMonth[m]||0);
  const max=Math.max(...vals,1);
  return(
    <div style={{display:"flex",gap:8,alignItems:"flex-end",height:120,padding:"0 4px"}}>
      {months.map((m,i)=>{
        const v=vals[i];
        const h=Math.max(6,Math.round((v/max)*100));
        const isCurrent=m===thisMonth();
        return(
          <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            {v>0&&<div style={{fontSize:9,color:"#64748b",fontWeight:700,writingMode:"vertical-rl",transform:"rotate(180deg)",height:28,overflow:"hidden"}}>{fmt(v).replace("₹","")}</div>}
            <div style={{width:"100%",flex:1,display:"flex",alignItems:"flex-end"}}>
              <div style={{width:"100%",height:`${h}%`,minHeight:6,background:isCurrent?"linear-gradient(180deg,#0ea5e9,#0284c7)":"linear-gradient(180deg,#1e3a5f,#162d4a)",borderRadius:"4px 4px 0 0",transition:"height .5s ease",boxShadow:isCurrent?"0 0 12px #0ea5e940":""}}/>
            </div>
            <div style={{fontSize:9,color:isCurrent?"#0ea5e9":"#334155",fontWeight:isCurrent?800:400}}>{m.slice(5)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Donut Chart ────────────────────────────────────────────────────────────
function DonutChart({value,max,color,label,sub}){
  const pct=max>0?Math.min(100,(value/max)*100):0;
  const r=40,c=2*Math.PI*r;
  const dash=c*(pct/100);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="12"/>
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${c}`} strokeDashoffset={c/4} strokeLinecap="round"
          style={{transition:"stroke-dasharray .8s ease"}}/>
        <text x="50" y="46" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="800">{Math.round(pct)}%</text>
        <text x="50" y="60" textAnchor="middle" fill="#64748b" fontSize="9">{sub}</text>
      </svg>
      <div style={{fontSize:11,color:"#64748b",textAlign:"center"}}>{label}</div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [loading,setLoading]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(true);
  const {toasts,show:toast}=useToast();

  // Data state
  const [analytics,setAnalytics]=useState(null);
  const [rooms,setRooms]=useState([]);
  const [tenants,setTenants]=useState([]);
  const [rents,setRents]=useState([]);
  const [complaints,setComps]=useState([]);
  const [notices,setNotices]=useState([]);
  const [electricity,setElec]=useState([]);
  const [selectedRoom,setSelectedRoom]=useState(null);

  // Login form
  const [lf,setLF]=useState({email:"",password:"",role:"owner"});
  const [le,setLE]=useState("");

  useEffect(()=>{
    const saved=localStorage.getItem("nq_user");
    if(saved) setUser(JSON.parse(saved));
  },[]);

  const loadData=useCallback(async(role)=>{
    const r=role||user?.role; if(!r) return;
    try {
      const [ro,te,re,co,no,el]=await Promise.all([api("rooms"),api("tenants"),api("rent"),api("complaints"),api("notices"),api("electricity")]);
      setRooms(Array.isArray(ro)?ro:[]); setTenants(Array.isArray(te)?te:[]);
      setRents(Array.isArray(re)?re:[]); setComps(Array.isArray(co)?co:[]);
      setNotices(Array.isArray(no)?no:[]); setElec(Array.isArray(el)?el:[]);
      if(r==="owner"){const an=await api("analytics"); setAnalytics(an);}
    } catch(e){console.error(e);}
  },[user]);

  useEffect(()=>{ if(user) loadData(); },[user]);

  const login=async()=>{
    setLoading(true); setLE("");
    try {
      const r=await api("auth/login",{method:"POST",body:lf});
      if(r.success){
        localStorage.setItem("nq_token",r.token);
        localStorage.setItem("nq_user",JSON.stringify(r.user));
        setUser(r.user); await loadData(r.user.role);
      } else setLE(r.error||"Invalid credentials");
    } catch { setLE("Connection error. Is the server running?"); }
    setLoading(false);
  };
  const logout=()=>{ localStorage.removeItem("nq_token"); localStorage.removeItem("nq_user"); setUser(null); setPage("dashboard"); };
  const openModal=(type,data={})=>{ setModal(type); setForm(data); };
  const closeModal=()=>{ setModal(null); setForm({}); };
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));

  // Derived
  const me=user?.role==="tenant"?tenants.find(t=>t.email===user?.email):null;
  const myRents=me?rents.filter(r=>r.tenantId===me.id):rents;
  const myComps=me?complaints.filter(c=>c.tenantId===me.id):complaints;
  const pendingRents=rents.filter(r=>r.status==="pending");
  const openComps=complaints.filter(c=>c.status==="open");

  // Actions
  const addRoom=async()=>{
    if(!form.number||!form.type||!form.rent) return toast("Fill all required fields","error");
    setLoading(true);
    await api("rooms",{method:"POST",body:{...form,rent:+form.rent,capacity:+form.capacity||1}});
    toast("Room added successfully! 🏠"); closeModal(); await loadData();
    setLoading(false);
  };
  const addTenant=async()=>{
    if(!form.name||!form.phone||!form.email||!form.roomId) return toast("Fill all required fields","error");
    setLoading(true);
    const r=await api("tenants",{method:"POST",body:{...form,deposit:+form.deposit||0,monthlyRent:+form.monthlyRent||0}});
    if(r.success) toast(`Tenant added! Welcome WhatsApp sent 📲\nPassword: ${r.password}`);
    else toast(r.error||"Failed","error");
    closeModal(); await loadData();
    setLoading(false);
  };
  const generateRent=async()=>{
    setLoading(true);
    const r=await api("rent",{method:"POST",body:{action:"generate",month:form.month||thisMonth()}});
    toast(`Generated ${r.generated||0} entries. WhatsApp reminders sent! 📲`);
    closeModal(); await loadData();
    setLoading(false);
  };
  const markCashPaid=async(rentId)=>{
    await api("rent",{method:"PUT",body:{id:rentId,mode:"cash"}});
    toast("Marked as cash paid ✅"); await loadData();
  };
  const resolveComplaint=async(id)=>{
    await api("complaints",{method:"PUT",body:{id,status:"resolved"}});
    toast("Complaint resolved. Tenant notified! ✅"); await loadData();
  };
  const raiseComplaint=async()=>{
    if(!form.category||!form.desc) return toast("Fill all fields","error");
    setLoading(true);
    await api("complaints",{method:"POST",body:{...form,tenantId:me?.id,tenantName:user?.name,roomNumber:me?.roomNumber}});
    toast("Complaint registered! We'll fix it ASAP 🔧"); closeModal(); await loadData();
    setLoading(false);
  };
  const sendNotice=async()=>{
    if(!form.title||!form.message) return toast("Fill all fields","error");
    setLoading(true);
    const r=await api("notices",{method:"POST",body:{...form,blast:true}});
    toast(`Notice sent to ${r.sent||0} tenants! 📣`); closeModal(); await loadData();
    setLoading(false);
  };
  const addElecBill=async()=>{
    if(!form.roomNumber||!form.month||form.prev==null||form.curr==null) return toast("Fill all fields","error");
    setLoading(true);
    const r=await api("electricity",{method:"POST",body:{...form,prev:+form.prev,curr:+form.curr,rate:+(form.rate||7)}});
    toast(`Bill added! ${r.units} units = ${fmt(r.amount)} ⚡`); closeModal(); await loadData();
    setLoading(false);
  };
  const sendReminders=async()=>{
    setLoading(true);
    const r=await api("rent/remind",{method:"POST",body:{}});
    toast(`Reminders sent to ${r.sent}/${r.total} tenants 📲`);
    setLoading(false);
  };
  const moveTenantOut=async()=>{
    setLoading(true);
    await api("tenants",{method:"PUT",body:{id:form.id,status:"inactive",leaveDate:form.leaveDate||today()}});
    toast("Move-out confirmed. Tenant notified 👋"); closeModal(); await loadData();
    setLoading(false);
  };
  const payRentOnline=async(rent)=>{
    const script=document.createElement("script"); script.src="https://checkout.razorpay.com/v1/checkout.js";
    document.head.appendChild(script);
    script.onload=async()=>{
      const order=await api("payments/create-order",{method:"POST",body:{amount:rent.amount,rentId:rent.id}});
      const rzp=new window.Razorpay({
        key:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:order.amount,currency:"INR",order_id:order.orderId,
        name:process.env.NEXT_PUBLIC_PG_NAME||"NestIQ PG",
        description:`Rent for ${rent.month}`,
        prefill:{name:user.name,contact:user.phone,email:user.email},
        theme:{color:"#0ea5e9"},
        handler:async(resp)=>{
          await api("payments/verify",{method:"POST",body:{...resp,rentId:rent.id}});
          toast("Payment successful! Receipt sent on WhatsApp ✅"); await loadData();
        }
      });
      rzp.open();
    };
  };

  // ── LOGIN SCREEN ─────────────────────────────────────────────────────────
  if(!user) return (
    <div style={S.loginWrap}>
      <Head><title>NestIQ — Smart PG Management</title></Head>
      {/* Animated background */}
      <div style={S.loginBg}>
        {[...Array(20)].map((_,i)=>(
          <div key={i} style={{...S.particle,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animationDelay:`${Math.random()*5}s`,animationDuration:`${4+Math.random()*6}s`}}/>
        ))}
      </div>
      <div style={S.loginLeft}>
        <div style={S.loginLogo}>
          <div style={S.logoIcon}>🏠</div>
          <div>
            <div style={S.logoText}>NestIQ</div>
            <div style={S.logoSub}>Smart PG Management</div>
          </div>
        </div>
        <h1 style={S.loginHero}>Manage your PG<br/><span style={{color:"#0ea5e9"}}>like never before</span></h1>
        <div style={S.featureGrid}>
          {[["💳","Online rent collection via UPI & Cards"],["📲","Auto WhatsApp reminders on 1st of month"],["🏢","3D building & room visualization"],["📊","Detailed reports & analytics"],["🔧","Complaint tracking with notifications"],["⚡","Electricity bill management per room"]].map(([ic,tx])=>(
            <div key={tx} style={S.featureCard}>
              <span style={{fontSize:22}}>{ic}</span>
              <span style={{fontSize:12,color:"#94a3b8",lineHeight:1.5}}>{tx}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={S.loginRight}>
        <div style={S.loginCard}>
          <h2 style={S.loginTitle}>Welcome back 👋</h2>
          <p style={{color:"#475569",fontSize:13,marginBottom:28}}>Sign in to your portal</p>
          <div style={{marginBottom:14}}>
            <label style={S.label}>I am a</label>
            <div style={{display:"flex",gap:8}}>
              {[{v:"owner",lb:"👑 PG Owner"},{v:"tenant",lb:"🏠 Tenant"}].map(opt=>(
                <button key={opt.v} style={{...S.roleBtn,...(lf.role===opt.v?S.roleBtnActive:{})}} onClick={()=>setLF(f=>({...f,role:opt.v}))}>
                  {opt.lb}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={S.label}>Email</label>
            <input style={S.inp} type="email" placeholder="you@email.com" value={lf.email} onChange={e=>setLF(f=>({...f,email:e.target.value}))}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={S.label}>Password</label>
            <input style={S.inp} type="password" placeholder="••••••••" value={lf.password} onChange={e=>setLF(f=>({...f,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()}/>
          </div>
          {le&&<div style={S.errBox}>{le}</div>}
          <button style={{...S.btnPrimary,width:"100%",padding:"14px",fontSize:15,borderRadius:12}} onClick={login} disabled={loading}>
            {loading?"⏳ Signing in...":"Sign In →"}
          </button>
          <div style={{marginTop:24,padding:"16px",background:"#080e1a",borderRadius:12,border:"1px solid #1e293b"}}>
            <div style={{fontSize:10,color:"#334155",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10,fontWeight:700}}>Demo Credentials</div>
            <div style={{display:"flex",gap:8}}>
              {[{r:"owner",e:"owner@nestiq.com",p:"owner123",l:"👑 Owner"},{r:"tenant",e:"rahul@email.com",p:"7890",l:"🏠 Tenant"}].map(d=>(
                <button key={d.r} style={{flex:1,background:"#0d1628",border:"1px solid #1e293b",color:"#94a3b8",borderRadius:8,padding:"10px 6px",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all .2s",textAlign:"center"}} onClick={()=>setLF({email:d.e,password:d.p,role:d.r})}>
                  <div style={{fontSize:18}}>{d.l.split(" ")[0]}</div>
                  <div style={{fontWeight:700,marginTop:2}}>{d.l.split(" ")[1]}</div>
                  <div style={{fontSize:9,color:"#334155",marginTop:2}}>{d.e}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{GLOBAL_CSS}</style>
    </div>
  );

  // ── NAV ──────────────────────────────────────────────────────────────────
  const ownerNav=[{id:"dashboard",ic:"◈",lb:"Dashboard"},{id:"building",ic:"🏢",lb:"Building View"},{id:"rooms",ic:"🚪",lb:"Rooms"},{id:"tenants",ic:"👤",lb:"Tenants"},{id:"rent",ic:"💰",lb:"Rent"},{id:"complaints",ic:"🔧",lb:"Complaints",badge:openComps.length},{id:"electricity",ic:"⚡",lb:"Electricity"},{id:"notices",ic:"📣",lb:"Notices"},{id:"reports",ic:"📊",lb:"Reports"}];
  const tenantNav=[{id:"my-home",ic:"🏠",lb:"My Home"},{id:"pay-rent",ic:"💳",lb:"Pay Rent"},{id:"complaints",ic:"🔧",lb:"My Complaints"},{id:"notices",ic:"📣",lb:"Notices"},{id:"electricity",ic:"⚡",lb:"Bills"}];
  const nav=user.role==="owner"?ownerNav:tenantNav;

  return (
    <div style={S.layout}>
      <Head><title>NestIQ PG</title></Head>

      {/* ── SIDEBAR ── */}
      <aside style={{...S.sidebar,...(!sidebarOpen?{width:64}:{})}}>
        <div style={{padding:"0 12px 16px",borderBottom:"1px solid #0f172a",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          {sidebarOpen&&<div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#e2e8f0",letterSpacing:".5px"}}>NestIQ</div>
            <div style={{fontSize:9,color:"#334155",letterSpacing:"2px",textTransform:"uppercase"}}>PG MANAGEMENT</div>
          </div>}
          <button style={{background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:18,padding:4,flexShrink:0}} onClick={()=>setSidebarOpen(s=>!s)}>{sidebarOpen?"◀":"▶"}</button>
        </div>
        {sidebarOpen&&<div style={{padding:"0 12px",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#0d1628",borderRadius:12,padding:"10px 12px"}}>
            <div style={{...S.avatar,width:36,height:36,fontSize:14,flexShrink:0}}>{user.name[0]}</div>
            <div style={{overflow:"hidden"}}>
              <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
              <div style={{fontSize:10,color:"#475569",textTransform:"capitalize"}}>{user.role}</div>
            </div>
          </div>
        </div>}
        <div style={{flex:1,overflowY:"auto",padding:"0 8px"}}>
          {nav.map(n=>(
            <button key={n.id} style={{...S.navBtn,...(page===n.id?S.navActive:{}),...(!sidebarOpen?{justifyContent:"center",padding:"12px 0"}:{})}} onClick={()=>setPage(n.id)} title={!sidebarOpen?n.lb:""}>
              <span style={{fontSize:16,flexShrink:0}}>{n.ic}</span>
              {sidebarOpen&&<><span style={{flex:1}}>{n.lb}</span>{n.badge>0&&<span style={S.badge}>{n.badge}</span>}</>}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 8px",borderTop:"1px solid #0f172a"}}>
          <button style={{...S.navBtn,color:"#ef4444",...(!sidebarOpen?{justifyContent:"center",padding:"12px 0"}:{})}} onClick={logout}>
            <span style={{fontSize:16}}>⬡</span>
            {sidebarOpen&&<span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={S.main}>

        {/* ── OWNER DASHBOARD ── */}
        {page==="dashboard"&&user.role==="owner"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}>
              <div>
                <h1 style={S.h1}>Dashboard</h1>
                <div style={S.sub}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button style={S.btnGhost} onClick={sendReminders} disabled={loading}>📲 Send Reminders</button>
                <button style={S.btnPrimary} onClick={()=>openModal("generate-rent")}>💰 Generate Rent</button>
              </div>
            </div>
            {/* KPI Cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
              {[
                {lb:"This Month",val:fmt(analytics?.thisMonthRev||0),sub:`${analytics?.collectionRate||0}% collected`,ic:"💰",g:"#22c55e,#16a34a"},
                {lb:"Occupancy",val:`${analytics?.occupancyRate||0}%`,sub:`${analytics?.occupiedRooms||0}/${analytics?.totalRooms||0} rooms`,ic:"🏢",g:"#0ea5e9,#0284c7"},
                {lb:"Tenants",val:analytics?.activeTenants||0,sub:`${tenants.filter(t=>t.gender==="Female"&&t.status==="active").length} female`,ic:"👥",g:"#a78bfa,#7c3aed"},
                {lb:"Complaints",val:openComps.length,sub:`need attention`,ic:"🔧",g:openComps.length>0?"#f59e0b,#d97706":"#22c55e,#16a34a"},
              ].map(k=>(
                <div key={k.lb} style={{background:`linear-gradient(135deg,#0a1120,#0d1628)`,border:"1px solid #0f172a",borderRadius:18,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:12,right:16,fontSize:28,opacity:.15}}>{k.ic}</div>
                  <div style={{fontSize:11,color:"#475569",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:10}}>{k.lb}</div>
                  <div style={{fontSize:28,fontWeight:900,fontFamily:"'DM Mono',monospace",background:`linear-gradient(135deg,${k.g})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{k.val}</div>
                  <div style={{fontSize:11,color:"#334155",marginTop:4}}>{k.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:20,marginBottom:20}}>
              {/* Revenue chart */}
              <div style={S.card}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <h3 style={S.ct}>Revenue — Last 6 Months</h3>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:900,fontSize:22,color:"#22c55e",fontFamily:"'DM Mono',monospace"}}>{fmt(analytics?.totalRevenue||0)}</div>
                    <div style={{fontSize:10,color:"#334155"}}>total collected</div>
                  </div>
                </div>
                <RevenueChart byMonth={analytics?.byMonth||{}} months={last6Months()}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:16,paddingTop:12,borderTop:"1px solid #0f172a"}}>
                  <div><div style={{fontSize:11,color:"#475569"}}>Pending This Month</div><div style={{fontWeight:800,color:"#f59e0b",fontFamily:"'DM Mono',monospace"}}>{fmt(analytics?.pendingAmount||0)}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#475569"}}>Elec. Pending</div><div style={{fontWeight:800,color:"#f59e0b",fontFamily:"'DM Mono',monospace"}}>{fmt(analytics?.pendingElec||0)}</div></div>
                </div>
              </div>
              {/* Donut charts */}
              <div style={S.card}>
                <h3 style={{...S.ct,marginBottom:20}}>Occupancy & Collection</h3>
                <div style={{display:"flex",justifyContent:"space-around"}}>
                  <DonutChart value={analytics?.occupiedRooms||0} max={analytics?.totalRooms||1} color="#0ea5e9" label="Room Occupancy" sub="rooms"/>
                  <DonutChart value={analytics?.collectionRate||0} max={100} color="#22c55e" label="Rent Collection" sub="this month"/>
                </div>
                <div style={{marginTop:20,display:"flex",justifyContent:"space-around"}}>
                  <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:"#3b82f6",fontFamily:"'DM Mono',monospace"}}>{analytics?.maleCount||0}</div><div style={{fontSize:11,color:"#475569"}}>👨 Male</div></div>
                  <div style={{width:1,background:"#1e293b"}}/>
                  <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:"#ec4899",fontFamily:"'DM Mono',monospace"}}>{analytics?.femaleCount||0}</div><div style={{fontSize:11,color:"#475569"}}>👩 Female</div></div>
                </div>
              </div>
            </div>
            {/* Pending actions */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={S.card}>
                <h3 style={S.ct}>Pending Rent ({pendingRents.length})</h3>
                {pendingRents.slice(0,5).map(r=>(
                  <div key={r.id} style={S.listRow}>
                    <div style={{...S.avatar,width:34,height:34,fontSize:12,flexShrink:0}}>{r.tenantName[0]}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.tenantName}</div>
                      <div style={{fontSize:11,color:"#475569"}}>Room {r.roomNumber} · {r.month}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontWeight:800,color:"#f59e0b",fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmt(r.amount)}</div>
                      <button style={{...S.btnGhost,padding:"3px 8px",fontSize:10,marginTop:2}} onClick={()=>markCashPaid(r.id)}>Cash ✓</button>
                    </div>
                  </div>
                ))}
                {pendingRents.length===0&&<div style={S.empty}>✅ All rents collected!</div>}
              </div>
              <div style={S.card}>
                <h3 style={S.ct}>Open Complaints ({openComps.length})</h3>
                {openComps.slice(0,5).map(c=>(
                  <div key={c.id} style={S.listRow}>
                    <span style={{fontSize:24,flexShrink:0}}>{CAT_IC[c.category]||"🔧"}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13}}>{c.category}</div>
                      <div style={{fontSize:11,color:"#475569"}}>Room {c.roomNumber} · {c.priority}</div>
                    </div>
                    <button style={{...S.btnPrimary,padding:"4px 10px",fontSize:11,flexShrink:0}} onClick={()=>resolveComplaint(c.id)}>Resolve ✓</button>
                  </div>
                ))}
                {openComps.length===0&&<div style={S.empty}>✅ No open complaints!</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── 3D BUILDING VIEW ── */}
        {page==="building"&&user.role==="owner"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}>
              <div><h1 style={S.h1}>Building View</h1><div style={S.sub}>Interactive 3D room allocation map</div></div>
              <button style={S.btnPrimary} onClick={()=>openModal("add-room")}>＋ Add Room</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20}}>
              <div style={S.card}>
                <Building3D rooms={rooms} onRoomClick={r=>{setSelectedRoom(r);}}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {selectedRoom?(
                  <div style={{...S.card,borderColor:"#0ea5e940",background:"linear-gradient(135deg,#0a1a2e,#0a1120)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                      <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700}}>Room {selectedRoom.number}</h3>
                      <span style={{...S.pill,background:selectedRoom.occupied>=selectedRoom.capacity?"#ef444418":"#22c55e18",color:selectedRoom.occupied>=selectedRoom.capacity?"#ef4444":"#22c55e"}}>{selectedRoom.occupied>=selectedRoom.capacity?"Full":"Available"}</span>
                    </div>
                    {[["Type",selectedRoom.type],["Floor",`${selectedRoom.floor} Floor`],["Capacity",`${selectedRoom.occupied}/${selectedRoom.capacity} occupied`],["Rent",fmt(selectedRoom.rent)+"/month"],["Amenities",selectedRoom.amenities||"Standard"]].map(([k,v])=>(
                      <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1e293b"}}>
                        <span style={{color:"#475569",fontSize:12}}>{k}</span>
                        <span style={{fontWeight:600,fontSize:12,textAlign:"right",maxWidth:160}}>{v}</span>
                      </div>
                    ))}
                    {/* Tenants in this room */}
                    <div style={{marginTop:14}}>
                      <div style={{fontSize:11,color:"#475569",marginBottom:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>Tenants</div>
                      {tenants.filter(t=>t.roomId===selectedRoom.id&&t.status==="active").map(t=>(
                        <div key={t.id} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:"1px solid #0f172a"}}>
                          <div style={{...S.avatar,width:28,height:28,fontSize:11}}>{t.name[0]}</div>
                          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{t.name}</div><div style={{fontSize:10,color:"#475569"}}>{t.phone}</div></div>
                          <div style={{fontSize:11,color:"#22c55e",fontWeight:700}}>{fmt(t.monthlyRent)}</div>
                        </div>
                      ))}
                      {tenants.filter(t=>t.roomId===selectedRoom.id&&t.status==="active").length===0&&<div style={{fontSize:12,color:"#334155"}}>No active tenants</div>}
                    </div>
                    <button style={{...S.btnGhost,width:"100%",marginTop:14}} onClick={()=>setSelectedRoom(null)}>Close ✕</button>
                  </div>
                ):(
                  <div style={{...S.card,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:200}}>
                    <div style={{fontSize:48,marginBottom:12}}>🏢</div>
                    <div style={{color:"#475569",fontSize:13,textAlign:"center"}}>Click on any room in the building to see details</div>
                  </div>
                )}
                {/* Summary */}
                <div style={S.card}>
                  <h3 style={S.ct}>Floor Summary</h3>
                  {FLOORS.slice(0,4).map(f=>{
                    const fr=rooms.filter(r=>r.floor===f);
                    const occ=fr.filter(r=>r.occupied>0).length;
                    const pct=fr.length?Math.round((occ/fr.length)*100):0;
                    return fr.length>0?(
                      <div key={f} style={{display:"flex",gap:10,alignItems:"center",padding:"6px 0"}}>
                        <div style={{width:60,fontSize:12,color:"#64748b",fontWeight:600,flexShrink:0}}>{f} Floor</div>
                        <div style={{flex:1,height:8,background:"#0d1628",borderRadius:4,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#0ea5e9,#22c55e)",borderRadius:4,transition:"width .5s"}}/>
                        </div>
                        <div style={{fontSize:11,color:"#475569",width:50,textAlign:"right"}}>{occ}/{fr.length}</div>
                      </div>
                    ):null;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ROOMS ── */}
        {page==="rooms"&&user.role==="owner"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}>
              <div><h1 style={S.h1}>Rooms</h1><div style={S.sub}>{rooms.length} total · {rooms.filter(r=>r.occupied<r.capacity&&r.status!=="deleted").length} available</div></div>
              <button style={S.btnPrimary} onClick={()=>openModal("add-room")}>＋ Add Room</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
              {rooms.filter(r=>r.status!=="deleted").map(r=>(
                <div key={r.id} style={{...S.card,padding:18,borderColor:r.occupied>=r.capacity?"#ef444420":r.occupied>0?"#f59e0b20":"#22c55e20",cursor:"pointer",transition:"all .2s"}} onClick={()=>{setSelectedRoom(r);setPage("building");}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <div><div style={{fontWeight:900,fontSize:24,color:"#e2e8f0"}}>Room {r.number}</div><div style={{fontSize:11,color:"#475569"}}>{r.floor} Floor · {r.type}</div></div>
                    <div style={{fontSize:28}}>{r.occupied>=r.capacity?"🔴":r.occupied>0?"🟡":"🟢"}</div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                    <div style={{background:"#0d1628",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontWeight:800,color:"#22c55e",fontSize:14}}>{fmt(r.rent)}</div><div style={{fontSize:9,color:"#334155"}}>per month</div></div>
                    <div style={{background:"#0d1628",borderRadius:8,padding:"8px",textAlign:"center"}}><div style={{fontWeight:800,color:"#0ea5e9",fontSize:14}}>{r.occupied}/{r.capacity}</div><div style={{fontSize:9,color:"#334155"}}>occupied</div></div>
                  </div>
                  {r.amenities&&<div style={{fontSize:10,color:"#475569",lineHeight:1.5}}>{r.amenities}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TENANTS ── */}
        {page==="tenants"&&user.role==="owner"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}>
              <div><h1 style={S.h1}>Tenants</h1><div style={S.sub}>{tenants.filter(t=>t.status==="active").length} active</div></div>
              <button style={S.btnPrimary} onClick={()=>openModal("add-tenant")}>＋ Add Tenant</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {tenants.filter(t=>t.status==="active").map(t=>(
                <div key={t.id} style={{...S.card,display:"flex",gap:16,alignItems:"center",padding:"16px 20px"}}>
                  <div style={{...S.avatar,width:48,height:48,fontSize:18,flexShrink:0,background:t.gender==="Female"?"linear-gradient(135deg,#ec4899,#be185d)":"linear-gradient(135deg,#0ea5e9,#0284c7)"}}>{t.name[0]}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:15}}>{t.name}</div>
                    <div style={{fontSize:12,color:"#475569",marginTop:2}}>📞 {t.phone} · ✉️ {t.email}</div>
                    <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{t.occupation} · Joined {t.joinDate}</div>
                  </div>
                  <div style={{textAlign:"center",flexShrink:0}}>
                    <div style={{fontWeight:800,color:"#0ea5e9",fontSize:16}}>Room {t.roomNumber}</div>
                    <div style={{fontSize:11,color:"#475569",marginTop:2}}>{t.gender||"—"}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:900,color:"#22c55e",fontFamily:"'DM Mono',monospace",fontSize:16}}>{fmt(t.monthlyRent)}/mo</div>
                    <div style={{fontSize:11,color:"#475569",marginTop:2}}>Deposit: {fmt(t.deposit)}</div>
                  </div>
                  <button style={{...S.btnGhost,color:"#ef4444",borderColor:"#ef444430",fontSize:11,padding:"6px 12px",flexShrink:0}} onClick={()=>openModal("move-out",t)}>Move Out</button>
                </div>
              ))}
              {tenants.filter(t=>t.status==="active").length===0&&<div style={{...S.card,textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:48}}>👤</div><h3 style={{marginTop:12,fontWeight:700}}>No active tenants</h3><p style={{color:"#475569",marginTop:6}}>Add your first tenant to get started</p><button style={{...S.btnPrimary,marginTop:16}} onClick={()=>openModal("add-tenant")}>＋ Add Tenant</button></div>}
            </div>
          </div>
        )}

        {/* ── RENT ── */}
        {page==="rent"&&user.role==="owner"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}>
              <div><h1 style={S.h1}>Rent Collection</h1><div style={S.sub}>{pendingRents.length} pending</div></div>
              <div style={{display:"flex",gap:10}}>
                <button style={S.btnGhost} onClick={sendReminders} disabled={loading}>📲 Remind All</button>
                <button style={S.btnPrimary} onClick={()=>openModal("generate-rent")}>⚡ Generate</button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:22}}>
              {[{lb:"This Month Collected",val:fmt(rents.filter(r=>r.month===thisMonth()&&r.status==="paid").reduce((s,r)=>s+r.amount,0)),c:"#22c55e"},{lb:"Pending Amount",val:fmt(pendingRents.reduce((s,r)=>s+r.amount,0)),c:"#f59e0b"},{lb:"Total Revenue",val:fmt(rents.filter(r=>r.status==="paid").reduce((s,r)=>s+r.amount,0)),c:"#0ea5e9"}].map(s=>(
                <div key={s.lb} style={{...S.card,padding:20}}><div style={{fontSize:11,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{s.lb}</div><div style={{fontWeight:900,fontSize:26,color:s.c,fontFamily:"'DM Mono',monospace"}}>{s.val}</div></div>
              ))}
            </div>
            <div style={{background:"#0a1120",border:"1px solid #0f172a",borderRadius:16,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid #0f172a",background:"#080d17"}}>
                  {["Tenant","Room","Month","Amount","Due","Paid","Mode","Status","Action"].map(h=>(
                    <th key={h} style={{padding:"13px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:"1px"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[...rents].sort((a,b)=>b.month.localeCompare(a.month)).map(r=>(
                    <tr key={r.id} style={{borderBottom:"1px solid #080d17",transition:"background .2s"}}>
                      <td style={S.td}><div style={{fontWeight:600,fontSize:13}}>{r.tenantName}</div></td>
                      <td style={{...S.td,color:"#0ea5e9",fontWeight:700}}>Room {r.roomNumber}</td>
                      <td style={{...S.td,color:"#a78bfa",fontWeight:600}}>{r.month}</td>
                      <td style={{...S.td,fontWeight:800,color:"#22c55e",fontFamily:"'DM Mono',monospace"}}>{fmt(r.amount)}</td>
                      <td style={{...S.td,fontSize:11,color:"#475569"}}>{r.dueDate}</td>
                      <td style={{...S.td,fontSize:11,color:"#475569"}}>{r.paidDate||"—"}</td>
                      <td style={{...S.td,fontSize:11}}>{r.mode||"—"}</td>
                      <td style={S.td}><span style={{...S.pill,background:(SC[r.status]||"#64748b")+"18",color:SC[r.status]||"#64748b"}}>{r.status}</span></td>
                      <td style={S.td}>
                        {r.status==="pending"&&<button style={{...S.btnGhost,padding:"4px 10px",fontSize:11}} onClick={()=>markCashPaid(r.id)}>💵 Cash</button>}
                        {r.status==="paid"&&<span style={{fontSize:12,color:"#22c55e"}}>✓</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── COMPLAINTS ── */}
        {page==="complaints"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}>
              <div><h1 style={S.h1}>Complaints</h1><div style={S.sub}>{openComps.length} open</div></div>
              {user.role==="tenant"&&<button style={S.btnPrimary} onClick={()=>openModal("raise-complaint")}>＋ New Complaint</button>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {(user.role==="owner"?complaints:myComps).map(c=>(
                <div key={c.id} style={{...S.card,borderColor:(SC[c.status]||"#64748b")+"20"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <div style={{display:"flex",gap:14,alignItems:"flex-start",flex:1,minWidth:0}}>
                      <span style={{fontSize:36,flexShrink:0}}>{CAT_IC[c.category]||"🔧"}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:15}}>{c.category}</div>
                        <div style={{fontSize:13,color:"#94a3b8",marginTop:3,lineHeight:1.5}}>{c.desc}</div>
                        <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,color:"#475569"}}>🚪 Room {c.roomNumber}</span>
                          <span style={{fontSize:11,color:"#475569"}}>👤 {c.tenantName}</span>
                          <span style={{fontSize:11,color:"#475569"}}>📅 {c.createdAt}</span>
                          <span style={{...S.pill,background:c.priority==="high"||c.priority==="urgent"?"#ef444418":"#f59e0b18",color:c.priority==="high"||c.priority==="urgent"?"#ef4444":"#f59e0b",fontSize:10}}>{c.priority}</span>
                          <span style={{...S.pill,background:"#64748b18",color:"#64748b",fontSize:10}}>#{c.id}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                      <span style={{...S.pill,background:(SC[c.status]||"#64748b")+"18",color:SC[c.status]||"#64748b"}}>{c.status}</span>
                      {user.role==="owner"&&c.status==="open"&&<button style={{...S.btnPrimary,padding:"6px 14px",fontSize:12}} onClick={()=>resolveComplaint(c.id)}>Resolve ✓</button>}
                    </div>
                  </div>
                  {c.resolvedAt&&<div style={{marginTop:10,fontSize:12,color:"#22c55e",paddingTop:10,borderTop:"1px solid #0f172a"}}>✅ Resolved on {c.resolvedAt}</div>}
                </div>
              ))}
              {(user.role==="owner"?complaints:myComps).length===0&&<div style={{...S.card,textAlign:"center",padding:"60px"}}><div style={{fontSize:48}}>🔧</div><h3 style={{marginTop:12,fontWeight:700}}>No complaints</h3><p style={{color:"#475569",marginTop:6}}>Everything running smoothly!</p></div>}
            </div>
          </div>
        )}

        {/* ── ELECTRICITY ── */}
        {page==="electricity"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}>
              <div><h1 style={S.h1}>Electricity Bills</h1></div>
              {user.role==="owner"&&<button style={S.btnPrimary} onClick={()=>openModal("add-elec")}>＋ Add Reading</button>}
            </div>
            <div style={{background:"#0a1120",border:"1px solid #0f172a",borderRadius:16,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid #0f172a",background:"#080d17"}}>
                  {["Room","Month","Prev","Curr","Units","Rate","Amount","Status","Action"].map(h=>(
                    <th key={h} style={{padding:"13px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:"1px"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {electricity.map(b=>(
                    <tr key={b.id} style={{borderBottom:"1px solid #080d17"}}>
                      <td style={{...S.td,fontWeight:700,color:"#0ea5e9"}}>Room {b.roomNumber}</td>
                      <td style={{...S.td,color:"#a78bfa"}}>{b.month}</td>
                      <td style={{...S.td,color:"#475569"}}>{b.prev}</td>
                      <td style={{...S.td,color:"#475569"}}>{b.curr}</td>
                      <td style={{...S.td,fontWeight:700,color:"#f59e0b"}}>{b.units} u</td>
                      <td style={{...S.td,color:"#475569"}}>₹{b.rate}/u</td>
                      <td style={{...S.td,fontWeight:800,color:"#22c55e",fontFamily:"'DM Mono',monospace"}}>{fmt(b.amount)}</td>
                      <td style={S.td}><span style={{...S.pill,background:(SC[b.status]||"#64748b")+"18",color:SC[b.status]||"#64748b"}}>{b.status}</span></td>
                      <td style={S.td}>{b.status==="pending"&&user.role==="owner"&&<button style={{...S.btnGhost,padding:"4px 10px",fontSize:11}} onClick={async()=>{await api("electricity",{method:"PUT",body:{id:b.id}});toast("Marked paid ✅");await loadData();}}>Paid ✓</button>}</td>
                    </tr>
                  ))}
                  {electricity.length===0&&<tr><td colSpan={9} style={{textAlign:"center",padding:"40px",color:"#334155",fontSize:13}}>No electricity bills yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── NOTICES ── */}
        {page==="notices"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}>
              <div><h1 style={S.h1}>Notices</h1></div>
              {user.role==="owner"&&<button style={S.btnPrimary} onClick={()=>openModal("send-notice")}>📣 Post Notice</button>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {notices.map(n=>(
                <div key={n.id} style={{...S.card,borderColor:n.pinned==="yes"?"#0ea5e940":"#0f172a",background:n.pinned==="yes"?"linear-gradient(135deg,#0a1a2e,#0a1120)":"#0a1120"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                        {n.pinned==="yes"&&<span style={{fontSize:14}}>📌</span>}
                        <span style={{fontWeight:700,fontSize:15}}>{n.title}</span>
                        <span style={{...S.pill,background:"#0ea5e918",color:"#0ea5e9",fontSize:10}}>{n.type}</span>
                      </div>
                      <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.6}}>{n.message}</div>
                    </div>
                    <div style={{fontSize:11,color:"#334155",flexShrink:0}}>{n.createdAt}</div>
                  </div>
                </div>
              ))}
              {notices.length===0&&<div style={{...S.card,textAlign:"center",padding:"60px"}}><div style={{fontSize:48}}>📣</div><h3 style={{marginTop:12,fontWeight:700}}>No notices yet</h3><p style={{color:"#475569",marginTop:6}}>Post your first notice to keep tenants informed</p></div>}
            </div>
          </div>
        )}

        {/* ── REPORTS ── */}
        {page==="reports"&&user.role==="owner"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}><div><h1 style={S.h1}>Reports & Analytics</h1><div style={S.sub}>Detailed insights for your PG</div></div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              {/* Revenue by month table */}
              <div style={S.card}>
                <h3 style={S.ct}>Monthly Revenue Breakdown</h3>
                <table style={{width:"100%",borderCollapse:"collapse",marginTop:8}}>
                  <thead><tr>{["Month","Collected","Tenants","Avg/Tenant"].map(h=><th key={h} style={{padding:"8px 0",textAlign:"left",fontSize:10,color:"#334155",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",borderBottom:"1px solid #0f172a"}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {last6Months().map(m=>{
                      const paid=rents.filter(r=>r.month===m&&r.status==="paid");
                      const rev=paid.reduce((s,r)=>s+r.amount,0);
                      const avg=paid.length?Math.round(rev/paid.length):0;
                      return(
                        <tr key={m} style={{borderBottom:"1px solid #080d17"}}>
                          <td style={{...S.td,color:"#a78bfa",fontWeight:600}}>{m}</td>
                          <td style={{...S.td,fontWeight:700,color:"#22c55e",fontFamily:"'DM Mono',monospace"}}>{fmt(rev)}</td>
                          <td style={{...S.td,color:"#64748b"}}>{paid.length}</td>
                          <td style={{...S.td,color:"#64748b",fontFamily:"'DM Mono',monospace"}}>{avg?fmt(avg):"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Room type analysis */}
              <div style={S.card}>
                <h3 style={S.ct}>Room Type Analysis</h3>
                {Object.entries(analytics?.byType||{}).map(([type,data])=>(
                  <div key={type} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:13,fontWeight:600}}>{type}</span>
                      <span style={{fontSize:12,color:"#475569"}}>{data.occupied}/{data.total} occupied · {fmt(data.revenue)}/mo</span>
                    </div>
                    <div style={{height:8,background:"#0d1628",borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${data.total?Math.round((data.occupied/data.total)*100):0}%`,background:"linear-gradient(90deg,#0ea5e9,#22c55e)",borderRadius:4}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Complaint analysis */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              <div style={S.card}>
                <h3 style={S.ct}>Complaints by Category</h3>
                {Object.entries(analytics?.compByCategory||{}).map(([cat,count])=>(
                  <div key={cat} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:"1px solid #080d17"}}>
                    <span style={{fontSize:20,width:30}}>{CAT_IC[cat]||"🔧"}</span>
                    <span style={{flex:1,fontSize:13,fontWeight:600}}>{cat}</span>
                    <div style={{width:100,height:8,background:"#0d1628",borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,(count/Math.max(...Object.values(analytics?.compByCategory||{1:1})))*100)}%`,background:"#f59e0b",borderRadius:4}}/>
                    </div>
                    <span style={{fontSize:12,color:"#f59e0b",fontWeight:700,width:20,textAlign:"right"}}>{count}</span>
                  </div>
                ))}
                {Object.keys(analytics?.compByCategory||{}).length===0&&<div style={S.empty}>No complaints yet ✅</div>}
              </div>
              {/* Upcoming move-outs */}
              <div style={S.card}>
                <h3 style={S.ct}>Upcoming Move-outs (30 days)</h3>
                {(analytics?.upcomingMoveOuts||[]).map(t=>(
                  <div key={t.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #080d17"}}>
                    <div style={{...S.avatar,width:34,height:34,fontSize:13,flexShrink:0}}>{t.name[0]}</div>
                    <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{t.name}</div><div style={{fontSize:11,color:"#475569"}}>Room {t.roomNumber}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:12,color:"#f59e0b",fontWeight:700}}>{t.leaveDate}</div><div style={{fontSize:10,color:"#334155"}}>Deposit: {fmt(t.deposit)}</div></div>
                  </div>
                ))}
                {(analytics?.upcomingMoveOuts||[]).length===0&&<div style={S.empty}>No upcoming move-outs ✅</div>}
              </div>
            </div>
            {/* All tenants table */}
            <div style={S.card}>
              <h3 style={{...S.ct,marginBottom:16}}>All Active Tenants</h3>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:"1px solid #0f172a"}}>
                  {["Name","Room","Phone","Rent","Deposit","Joined","Gender","Occupation"].map(h=>(
                    <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:"1px"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {tenants.filter(t=>t.status==="active").map(t=>(
                    <tr key={t.id} style={{borderBottom:"1px solid #080d17"}}>
                      <td style={S.td}><div style={{fontWeight:600}}>{t.name}</div></td>
                      <td style={{...S.td,color:"#0ea5e9",fontWeight:700}}>Room {t.roomNumber}</td>
                      <td style={{...S.td,color:"#64748b",fontSize:12}}>{t.phone}</td>
                      <td style={{...S.td,color:"#22c55e",fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{fmt(t.monthlyRent)}</td>
                      <td style={{...S.td,color:"#64748b",fontFamily:"'DM Mono',monospace"}}>{fmt(t.deposit)}</td>
                      <td style={{...S.td,color:"#64748b",fontSize:12}}>{t.joinDate}</td>
                      <td style={S.td}>{t.gender||"—"}</td>
                      <td style={{...S.td,color:"#64748b",fontSize:12}}>{t.occupation||"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TENANT: MY HOME ── */}
        {page==="my-home"&&user.role==="tenant"&&(
          <div style={S.pageIn}>
            <div style={{marginBottom:28}}>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:700}}>Hi {user.name.split(" ")[0]}! 👋</h1>
              <p style={{color:"#475569",fontSize:14,marginTop:4}}>Welcome to your NestIQ portal</p>
            </div>
            {me?(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18}}>
                <div style={{...S.card,borderColor:"#0ea5e920",gridColumn:"span 2"}}>
                  <h3 style={S.ct}>My Room Details</h3>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                    {[["Room Number",me.roomNumber,"#0ea5e9"],["Monthly Rent",fmt(me.monthlyRent),"#22c55e"],["Security Deposit",fmt(me.deposit),"#a78bfa"],["Joined On",me.joinDate,"#f59e0b"],["Status",me.status,"#22c55e"],["Occupation",me.occupation||"—","#64748b"]].map(([k,v,c])=>(
                      <div key={k} style={{padding:"14px 16px",borderBottom:"1px solid #0f172a",borderRight:"1px solid #0f172a"}}>
                        <div style={{fontSize:10,color:"#334155",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>{k}</div>
                        <div style={{fontWeight:700,fontSize:16,color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{...S.card,borderColor:"#22c55e20",flex:1}}>
                    <h3 style={S.ct}>Rent Status</h3>
                    {myRents.slice(-3).reverse().map(r=>(
                      <div key={r.id} style={{padding:"10px 0",borderBottom:"1px solid #0f172a"}}>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                          <div style={{fontWeight:600,fontSize:13}}>{r.month}</div>
                          <div style={{fontWeight:800,color:r.status==="paid"?"#22c55e":"#f59e0b",fontFamily:"'DM Mono',monospace"}}>{fmt(r.amount)}</div>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                          <div style={{fontSize:10,color:"#334155"}}>Due: {r.dueDate}</div>
                          <span style={{...S.pill,background:(SC[r.status]||"#64748b")+"18",color:SC[r.status]||"#64748b",fontSize:9}}>{r.status}</span>
                        </div>
                      </div>
                    ))}
                    {myRents.length===0&&<div style={S.empty}>No rent records yet</div>}
                  </div>
                  <div style={{...S.card,borderColor:"#f59e0b20"}}>
                    <h3 style={S.ct}>Emergency Contact</h3>
                    <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.6}}>{me.emergency||"Not set"}</div>
                    {me.aadhaar&&<div style={{fontSize:12,color:"#475569",marginTop:8}}>Aadhaar: ****{me.aadhaar.slice(-4)}</div>}
                  </div>
                </div>
              </div>
            ):(
              <div style={{...S.card,textAlign:"center",padding:"60px"}}><div style={{fontSize:48}}>🏠</div><p style={{color:"#475569",marginTop:12}}>Your room details will appear here after the owner adds you.</p></div>
            )}
          </div>
        )}

        {/* ── TENANT: PAY RENT ── */}
        {page==="pay-rent"&&user.role==="tenant"&&(
          <div style={S.pageIn}>
            <div style={S.hdr}><div><h1 style={S.h1}>Pay Rent</h1><div style={S.sub}>Secure online payment via UPI, Cards & NetBanking</div></div></div>
            <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:580}}>
              {myRents.map(r=>(
                <div key={r.id} style={{...S.card,borderColor:r.status==="pending"?"#f59e0b20":"#22c55e20"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:18}}>Rent — {r.month}</div>
                      <div style={{fontSize:13,color:"#475569",marginTop:3}}>Room {r.roomNumber} · Due: {r.dueDate}</div>
                      {r.paidDate&&<div style={{fontSize:12,color:"#22c55e",marginTop:4}}>✅ Paid {r.paidDate} via {r.mode}</div>}
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:900,fontSize:28,color:r.status==="paid"?"#22c55e":"#f59e0b",fontFamily:"'DM Mono',monospace"}}>{fmt(r.amount)}</div>
                      {r.status==="pending"
                        ?<button style={{...S.btnPrimary,marginTop:10,padding:"10px 24px"}} onClick={()=>payRentOnline(r)}>💳 Pay Online</button>
                        :<span style={{...S.pill,background:"#22c55e18",color:"#22c55e",marginTop:8,display:"inline-block"}}>✅ Paid</span>
                      }
                    </div>
                  </div>
                </div>
              ))}
              {myRents.length===0&&<div style={{...S.card,textAlign:"center",padding:"60px"}}><div style={{fontSize:48}}>💳</div><h3 style={{marginTop:12,fontWeight:700}}>No rent records</h3><p style={{color:"#475569",marginTop:6}}>Rent will appear here when generated by your PG owner</p></div>}
            </div>
          </div>
        )}

      </main>

      {/* ── MODALS ── */}
      {modal&&(
        <div style={S.mBg} onClick={closeModal}>
          <div style={S.mBox} onClick={e=>e.stopPropagation()}>

            {modal==="add-room"&&<>
              <h3 style={S.mTitle}>🚪 Add New Room</h3>
              <div style={S.mFields}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Room Number *</label><input style={S.inp} placeholder="101" onChange={e=>sf("number",e.target.value)}/></div>
                  <div><label style={S.label}>Floor</label><select style={S.inp} onChange={e=>sf("floor",e.target.value)}>{FLOORS.map(f=><option key={f}>{f}</option>)}</select></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Room Type *</label><select style={S.inp} onChange={e=>sf("type",e.target.value)}>{ROOM_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                  <div><label style={S.label}>Capacity</label><input style={S.inp} type="number" placeholder="2" defaultValue="1" onChange={e=>sf("capacity",e.target.value)}/></div>
                </div>
                <div><label style={S.label}>Monthly Rent (₹) *</label><input style={S.inp} type="number" placeholder="8000" onChange={e=>sf("rent",e.target.value)}/></div>
                <div><label style={S.label}>Amenities</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
                    {AMENITIES.map(a=>(
                      <label key={a} style={{display:"flex",gap:5,fontSize:12,color:"#94a3b8",cursor:"pointer",alignItems:"center"}}>
                        <input type="checkbox" onChange={e=>{const c=(form.amenities||"").split(",").filter(Boolean);sf("amenities",e.target.checked?[...c,a].join(","):c.filter(x=>x!==a).join(","));}}/>{a}
                      </label>
                    ))}
                  </div>
                </div>
                <div><label style={S.label}>Description</label><input style={S.inp} placeholder="e.g. Corner room with natural light" onChange={e=>sf("description",e.target.value)}/></div>
              </div>
              <div style={S.mAct}><button style={S.btnGhost} onClick={closeModal}>Cancel</button><button style={S.btnPrimary} onClick={addRoom} disabled={loading}>Add Room 🏠</button></div>
            </>}

            {modal==="add-tenant"&&<>
              <h3 style={S.mTitle}>👤 Add New Tenant</h3>
              <div style={S.mFields}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Full Name *</label><input style={S.inp} placeholder="Rahul Kumar" onChange={e=>sf("name",e.target.value)}/></div>
                  <div><label style={S.label}>Phone *</label><input style={S.inp} placeholder="9876543210" onChange={e=>sf("phone",e.target.value)}/></div>
                </div>
                <div><label style={S.label}>Email *</label><input style={S.inp} type="email" placeholder="rahul@email.com" onChange={e=>sf("email",e.target.value)}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Gender</label><select style={S.inp} onChange={e=>sf("gender",e.target.value)}><option value="">Select</option>{GENDERS.map(g=><option key={g}>{g}</option>)}</select></div>
                  <div><label style={S.label}>Age</label><input style={S.inp} type="number" placeholder="24" onChange={e=>sf("age",e.target.value)}/></div>
                </div>
                <div><label style={S.label}>Room *</label>
                  <select style={S.inp} onChange={e=>{const r=rooms.find(x=>x.id===e.target.value);sf("roomId",e.target.value);sf("roomNumber",r?.number||"");sf("monthlyRent",r?.rent||0);}}>
                    <option value="">Select available room</option>
                    {rooms.filter(r=>r.status!=="full"&&r.status!=="deleted").map(r=><option key={r.id} value={r.id}>Room {r.number} — {r.type} — {fmt(r.rent)}/mo</option>)}
                  </select>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Join Date *</label><input style={S.inp} type="date" defaultValue={today()} onChange={e=>sf("joinDate",e.target.value)}/></div>
                  <div><label style={S.label}>Security Deposit (₹)</label><input style={S.inp} type="number" placeholder="10000" onChange={e=>sf("deposit",e.target.value)}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Occupation</label><input style={S.inp} placeholder="Software Engineer" onChange={e=>sf("occupation",e.target.value)}/></div>
                  <div><label style={S.label}>Aadhaar (last 4)</label><input style={S.inp} placeholder="1234" maxLength={4} onChange={e=>sf("aadhaar",e.target.value)}/></div>
                </div>
                <div><label style={S.label}>Emergency Contact (Name & Phone)</label><input style={S.inp} placeholder="Ravi Kumar 9876500000" onChange={e=>sf("emergency",e.target.value)}/></div>
                {form.monthlyRent&&<div style={{background:"#0ea5e910",border:"1px solid #0ea5e930",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#38bdf8"}}>💡 Tenant portal password will be last 4 digits of phone. WhatsApp will be sent on add.</div>}
              </div>
              <div style={S.mAct}><button style={S.btnGhost} onClick={closeModal}>Cancel</button><button style={S.btnPrimary} onClick={addTenant} disabled={loading}>{loading?"Adding...":"Add & Send Welcome 📲"}</button></div>
            </>}

            {modal==="generate-rent"&&<>
              <h3 style={S.mTitle}>💰 Generate Monthly Rent</h3>
              <p style={{color:"#64748b",fontSize:13,marginBottom:20,lineHeight:1.6}}>Creates rent entries for all active tenants and sends WhatsApp reminders automatically.</p>
              <div style={{marginBottom:20}}><label style={S.label}>Month</label><input style={S.inp} type="month" defaultValue={thisMonth()} onChange={e=>sf("month",e.target.value)}/></div>
              <div style={{background:"#22c55e10",border:"1px solid #22c55e30",borderRadius:10,padding:"12px 14px",fontSize:13,color:"#4ade80",marginBottom:20}}>📲 WhatsApp reminders will be sent to {tenants.filter(t=>t.status==="active").length} active tenants</div>
              <div style={S.mAct}><button style={S.btnGhost} onClick={closeModal}>Cancel</button><button style={S.btnPrimary} onClick={generateRent} disabled={loading}>{loading?"Generating...":"Generate & Notify 📲"}</button></div>
            </>}

            {modal==="raise-complaint"&&<>
              <h3 style={S.mTitle}>🔧 Raise Complaint</h3>
              <div style={S.mFields}>
                <div><label style={S.label}>Category *</label><select style={S.inp} onChange={e=>sf("category",e.target.value)}><option value="">Select issue type</option>{COMPLAINT_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={S.label}>Priority</label><select style={S.inp} onChange={e=>sf("priority",e.target.value)}>{PRIORITIES.map(p=><option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}</select></div>
                <div><label style={S.label}>Describe the issue *</label><textarea style={{...S.inp,resize:"none",height:100}} placeholder="Please describe the problem in detail so we can fix it quickly..." onChange={e=>sf("desc",e.target.value)}/></div>
              </div>
              <div style={S.mAct}><button style={S.btnGhost} onClick={closeModal}>Cancel</button><button style={S.btnPrimary} onClick={raiseComplaint} disabled={loading}>Submit 🔧</button></div>
            </>}

            {modal==="send-notice"&&<>
              <h3 style={S.mTitle}>📣 Post Notice</h3>
              <div style={S.mFields}>
                <div><label style={S.label}>Title *</label><input style={S.inp} placeholder="e.g. Water Supply Interruption" onChange={e=>sf("title",e.target.value)}/></div>
                <div><label style={S.label}>Type</label><select style={S.inp} onChange={e=>sf("type",e.target.value)}><option value="general">General</option><option value="maintenance">Maintenance</option><option value="payment">Payment</option><option value="rules">Rules & Regulations</option><option value="event">Event</option></select></div>
                <div><label style={S.label}>Message *</label><textarea style={{...S.inp,resize:"none",height:110}} placeholder="Write your notice here..." onChange={e=>sf("message",e.target.value)}/></div>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <label style={{display:"flex",gap:8,fontSize:13,color:"#94a3b8",cursor:"pointer",alignItems:"center"}}>
                    <input type="checkbox" onChange={e=>sf("pinned",e.target.checked)}/> Pin this notice
                  </label>
                </div>
                <div style={{background:"#0ea5e910",border:"1px solid #0ea5e930",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#38bdf8"}}>📲 Will be sent via WhatsApp to all {tenants.filter(t=>t.status==="active").length} active tenants</div>
              </div>
              <div style={S.mAct}><button style={S.btnGhost} onClick={closeModal}>Cancel</button><button style={S.btnPrimary} onClick={sendNotice} disabled={loading}>{loading?"Sending...":"Post & Notify 📣"}</button></div>
            </>}

            {modal==="add-elec"&&<>
              <h3 style={S.mTitle}>⚡ Add Electricity Reading</h3>
              <div style={S.mFields}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Room *</label><select style={S.inp} onChange={e=>sf("roomNumber",e.target.value)}><option value="">Select room</option>{rooms.filter(r=>r.status!=="deleted").map(r=><option key={r.id} value={r.number}>Room {r.number}</option>)}</select></div>
                  <div><label style={S.label}>Month *</label><input style={S.inp} type="month" defaultValue={thisMonth()} onChange={e=>sf("month",e.target.value)}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                  <div><label style={S.label}>Previous Reading</label><input style={S.inp} type="number" placeholder="1200" onChange={e=>sf("prev",e.target.value)}/></div>
                  <div><label style={S.label}>Current Reading</label><input style={S.inp} type="number" placeholder="1350" onChange={e=>sf("curr",e.target.value)}/></div>
                  <div><label style={S.label}>Rate (₹/unit)</label><input style={S.inp} type="number" defaultValue="7" onChange={e=>sf("rate",e.target.value)}/></div>
                </div>
                {form.prev!=null&&form.curr!=null&&+form.curr>+form.prev&&(
                  <div style={{background:"#22c55e10",border:"1px solid #22c55e30",borderRadius:10,padding:"12px 16px",fontSize:14}}>
                    ⚡ {+form.curr-+form.prev} units × ₹{form.rate||7} = <strong style={{color:"#22c55e"}}>{fmt((+form.curr-+form.prev)*(+(form.rate||7)))}</strong>
                  </div>
                )}
              </div>
              <div style={S.mAct}><button style={S.btnGhost} onClick={closeModal}>Cancel</button><button style={S.btnPrimary} onClick={addElecBill} disabled={loading}>Add & Notify ⚡</button></div>
            </>}

            {modal==="move-out"&&<>
              <h3 style={S.mTitle}>👋 Move Out — {form.name}</h3>
              <div style={{background:"#0a1120",borderRadius:12,padding:"16px",marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#475569",fontSize:13}}>Room</span><span style={{fontWeight:700}}>Room {form.roomNumber}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:"#475569",fontSize:13}}>Deposit to Refund</span><span style={{fontWeight:700,color:"#22c55e"}}>{fmt(form.deposit)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#475569",fontSize:13}}>Joined</span><span style={{fontWeight:700}}>{form.joinDate}</span></div>
              </div>
              <div style={{marginBottom:20}}><label style={S.label}>Move Out Date</label><input style={S.inp} type="date" defaultValue={today()} onChange={e=>sf("leaveDate",e.target.value)}/></div>
              <div style={{background:"#ef444410",border:"1px solid #ef444430",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#fca5a5",marginBottom:20}}>⚠️ This will mark the tenant as inactive and free up the room. WhatsApp confirmation will be sent.</div>
              <div style={S.mAct}><button style={S.btnGhost} onClick={closeModal}>Cancel</button><button style={{...S.btnPrimary,background:"#ef4444"}} onClick={moveTenantOut} disabled={loading}>Confirm Move Out 👋</button></div>
            </>}

          </div>
        </div>
      )}

      {/* Toasts */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:999,display:"flex",flexDirection:"column",gap:8,maxWidth:340}}>
        {toasts.map(t=>(
          <div key={t.id} style={{background:"#0d1628",border:`1px solid ${t.type==="error"?"#ef444430":"#22c55e30"}`,borderRadius:14,padding:"13px 18px",fontSize:13,display:"flex",alignItems:"flex-start",gap:10,boxShadow:"0 8px 40px #000a",animation:"slideUp .3s ease",lineHeight:1.5}}>
            <span style={{fontSize:16,color:t.type==="error"?"#ef4444":"#22c55e",flexShrink:0,marginTop:1}}>{t.type==="error"?"✗":"✓"}</span>
            <span style={{whiteSpace:"pre-line"}}>{t.msg}</span>
          </div>
        ))}
      </div>

      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const S={
  layout:       {display:"flex",height:"100vh",overflow:"hidden",background:"#060b14"},
  sidebar:      {width:220,background:"#07101e",borderRight:"1px solid #0d1829",display:"flex",flexDirection:"column",padding:"20px 0",flexShrink:0,transition:"width .2s",overflowY:"auto",overflowX:"hidden"},
  main:         {flex:1,overflowY:"auto",padding:"28px 32px",background:"#060b14"},
  pageIn:       {animation:"slideUp .25s ease"},
  hdr:          {display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26,flexWrap:"wrap",gap:12},
  h1:           {fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:"#f1f5f9",lineHeight:1.1},
  sub:          {color:"#334155",fontSize:13,marginTop:4},
  card:         {background:"#0a1120",border:"1px solid #0f172a",borderRadius:16,padding:22},
  ct:           {fontWeight:700,fontSize:14,color:"#64748b",marginBottom:14,textTransform:"uppercase",letterSpacing:".8px"},
  listRow:      {display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #0a1120"},
  pill:         {display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700},
  avatar:       {borderRadius:"50%",background:"linear-gradient(135deg,#0ea5e9,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"white",flexShrink:0},
  td:           {padding:"12px 16px",fontSize:13,color:"#94a3b8"},
  empty:        {textAlign:"center",padding:"24px",color:"#334155",fontSize:13},
  badge:        {marginLeft:"auto",background:"#f59e0b",color:"#000",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:800},
  navBtn:       {display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 16px",borderRadius:10,border:"none",background:"transparent",color:"#334155",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",transition:"all .18s",fontFamily:"'Nunito',sans-serif",marginBottom:2},
  navActive:    {background:"linear-gradient(135deg,#0ea5e912,#06b6d40a)",color:"#38bdf8",borderLeft:"3px solid #0ea5e9"},
  btnPrimary:   {background:"linear-gradient(135deg,#0284c7,#0ea5e9)",color:"white",border:"none",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all .2s",whiteSpace:"nowrap"},
  btnGhost:     {background:"#0d1628",border:"1px solid #1e293b",color:"#64748b",padding:"8px 16px",borderRadius:8,fontSize:12,cursor:"pointer",fontFamily:"'Nunito',sans-serif",transition:"all .2s",whiteSpace:"nowrap"},
  label:        {display:"block",fontSize:10,color:"#334155",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontWeight:700},
  inp:          {width:"100%",background:"#0d1628",border:"1px solid #1e293b",color:"#e2e8f0",borderRadius:10,padding:"10px 14px",fontFamily:"'Nunito',sans-serif",fontSize:13,outline:"none",boxSizing:"border-box"},
  mBg:          {position:"fixed",inset:0,background:"#000000cc",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(10px)"},
  mBox:         {background:"#0a1120",border:"1px solid #1e293b",borderRadius:20,padding:32,width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto"},
  mTitle:       {fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:24,marginBottom:22,color:"#f1f5f9"},
  mFields:      {display:"flex",flexDirection:"column",gap:14,marginBottom:22},
  mAct:         {display:"flex",gap:10,justifyContent:"flex-end"},
  roleBtn:      {flex:1,background:"#0d1628",border:"1px solid #1e293b",color:"#64748b",borderRadius:10,padding:"10px 8px",fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:600,transition:"all .2s"},
  roleBtnActive:{background:"linear-gradient(135deg,#0284c7,#0ea5e9)",border:"1px solid #0ea5e9",color:"white"},
  // Login
  loginWrap:    {display:"flex",minHeight:"100vh",background:"#040810",overflow:"hidden",position:"relative"},
  loginBg:      {position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"},
  particle:     {position:"absolute",width:2,height:2,background:"#0ea5e9",borderRadius:"50%",animation:"float 6s infinite",opacity:.3},
  loginLeft:    {flex:1,padding:"60px 80px",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",zIndex:1},
  loginRight:   {width:480,background:"#07101e",borderLeft:"1px solid #0d1829",display:"flex",alignItems:"center",justifyContent:"center",padding:48,position:"relative",zIndex:1},
  loginCard:    {width:"100%"},
  loginLogo:    {display:"flex",gap:16,alignItems:"center",marginBottom:40},
  logoIcon:     {fontSize:40,background:"linear-gradient(135deg,#0d1e3a,#0a2040)",border:"1px solid #1e3a5f",borderRadius:16,width:60,height:60,display:"flex",alignItems:"center",justifyContent:"center"},
  logoText:     {fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:"#e2e8f0"},
  logoSub:      {fontSize:11,color:"#334155",letterSpacing:"2px",textTransform:"uppercase",marginTop:2},
  loginHero:    {fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:700,lineHeight:1.2,marginBottom:36,color:"#e2e8f0"},
  featureGrid:  {display:"grid",gridTemplateColumns:"1fr 1fr",gap:14},
  featureCard:  {display:"flex",gap:12,alignItems:"flex-start",background:"#07101e",border:"1px solid #0d1829",borderRadius:12,padding:"14px"},
  loginTitle:   {fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,marginBottom:6,color:"#f1f5f9"},
  errBox:       {background:"#1a0a0a",border:"1px solid #ef444440",color:"#fca5a5",borderRadius:10,padding:"10px 14px",fontSize:13,marginBottom:14},
};

const GLOBAL_CSS=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Mono:wght@400;500&family=Nunito:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#060b14;color:#e2e8f0;font-family:'Nunito',sans-serif}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
::-webkit-scrollbar-track{background:transparent}
input[type=date]::-webkit-calendar-picker-indicator,input[type=month]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:.5}
select option{background:#0d1628;color:#e2e8f0}
@keyframes slideUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes float{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(-20px);opacity:.6}}
button:hover{opacity:.85}
`;
