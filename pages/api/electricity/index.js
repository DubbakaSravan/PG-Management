// pages/api/electricity/index.js
import { read, append, update, findRow, toElec, toTenant } from "../../../lib/sheets";
import { requireAuth } from "../../../lib/auth";
import { sendWA, msgs } from "../../../lib/whatsapp";
import { v4 as uuid } from "uuid";
export default async function handler(req, res) {
  const user = requireAuth(req, res); if (!user) return;
  try {
    if (req.method === "GET") {
      const rows = await read("Electricity!A:J");
      let bills = rows.slice(1).filter(r=>r[0]).map(toElec);
      if (user.role === "tenant") {
        const tenantRows = await read("Tenants!A:P");
        const me = tenantRows.slice(1).map(toTenant).find(t=>t.email===user.email);
        if (me) bills = bills.filter(b=>b.roomNumber===me.roomNumber);
      }
      return res.json(bills);
    }
    if (req.method === "POST") {
      if (user.role !== "owner") return res.status(403).json({ error:"Forbidden" });
      const { roomNumber, month, prev, curr, rate } = req.body;
      const units = +curr - +prev;
      const amount = units * (+rate||7);
      const id = "EL" + uuid().slice(0,5).toUpperCase();
      await append("Electricity!A:J", [id, roomNumber, month, +prev, +curr, units, +rate||7, amount, "pending", ""]);
      const tenantRows = await read("Tenants!A:P");
      const t = tenantRows.slice(1).map(toTenant).find(x=>x.roomNumber===roomNumber&&x.status==="active");
      if (t) await sendWA(t.phone, msgs.electricityBill(t.name, roomNumber, month, units, amount));
      return res.json({ success:true, units, amount });
    }
    if (req.method === "PUT") {
      const { id } = req.body;
      const found = await findRow("Electricity", 0, id);
      if (!found) return res.status(404).json({ error:"Not found" });
      await update(`Electricity!I${found.rowNum}:J${found.rowNum}`, [["paid", new Date().toISOString().split("T")[0]]]);
      return res.json({ success:true });
    }
  } catch(e) { res.status(500).json({ error:e.message }); }
}
