// pages/api/rent/index.js
import { read, append, update, findRow, toRent, toTenant } from "../../../lib/sheets";
import { requireAuth } from "../../../lib/auth";
import { sendWA, msgs } from "../../../lib/whatsapp";
import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
  const user = requireAuth(req, res); if (!user) return;
  try {
    if (req.method === "GET") {
      const rows = await read("Rent!A:L");
      let rents = rows.slice(1).filter(r => r[0]).map(toRent);
      if (user.role === "tenant") {
        const tenantRows = await read("Tenants!A:P");
        const me = tenantRows.slice(1).map(toTenant).find(t => t.email === user.email);
        if (me) rents = rents.filter(r => r.tenantId === me.id);
      }
      return res.json(rents);
    }
    if (req.method === "POST") {
      if (req.body.action === "generate") {
        if (user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
        const { month } = req.body;
        const tenantRows = await read("Tenants!A:P");
        const rentRows = await read("Rent!A:L");
        const tenants = tenantRows.slice(1).filter(r=>r[0]).map(toTenant).filter(t=>t.status==="active");
        const existing = rentRows.slice(1).map(toRent);
        let generated = 0;
        for (const t of tenants) {
          if (existing.find(r => r.tenantId === t.id && r.month === month)) continue;
          const id = "RNT" + uuid().slice(0,5).toUpperCase();
          const dueDate = `${month}-05`;
          await append("Rent!A:L", [id, t.id, t.name, t.roomNumber, month, t.monthlyRent, dueDate, "", "pending", "", "online", 0]);
          await sendWA(t.phone, msgs.rentDue(t.name, t.roomNumber, month, t.monthlyRent, dueDate));
          generated++;
        }
        return res.json({ success: true, generated });
      }
    }
    if (req.method === "PUT") {
      const { id, status, paymentId, mode, paidDate, lateFee } = req.body;
      const found = await findRow("Rent", 0, id);
      if (!found) return res.status(404).json({ error: "Not found" });
      const r = toRent(found.row);
      const pd = paidDate || new Date().toISOString().split("T")[0];
      await update(`Rent!H${found.rowNum}:L${found.rowNum}`, [[pd, "paid", paymentId||"CASH", mode||"cash", lateFee||0]]);
      const tenantRows = await read("Tenants!A:P");
      const t = tenantRows.slice(1).map(toTenant).find(x => x.id === r.tenantId);
      if (t) await sendWA(t.phone, msgs.rentPaid(t.name, t.roomNumber, r.month, r.amount, mode||"cash", paymentId||"CASH"));
      return res.json({ success: true });
    }
  } catch(e) { res.status(500).json({ error: e.message }); }
}
