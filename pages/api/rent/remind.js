// pages/api/rent/remind.js
import { read, toRent, toTenant } from "../../../lib/sheets";
import { requireAuth } from "../../../lib/auth";
import { sendWA, msgs } from "../../../lib/whatsapp";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const user = requireAuth(req, res); if (!user) return;
  if (user.role !== "owner") return res.status(403).json({ error:"Forbidden" });
  const [rentRows, tenantRows] = await Promise.all([read("Rent!A:L"), read("Tenants!A:P")]);
  const tenants = tenantRows.slice(1).map(toTenant);
  const pending = rentRows.slice(1).map(toRent).filter(r => r.status === "pending");
  const today = new Date();
  let sent = 0;
  for (const r of pending) {
    const t = tenants.find(x => x.id === r.tenantId); if (!t) continue;
    const due = new Date(r.dueDate);
    const days = Math.floor((today - due) / 86400000);
    const ok = await sendWA(t.phone, days > 0
      ? msgs.rentOverdue(t.name, t.roomNumber, r.month, r.amount, days)
      : msgs.rentDue(t.name, t.roomNumber, r.month, r.amount, r.dueDate));
    if (ok) sent++;
    await new Promise(x => setTimeout(x, 300));
  }
  res.json({ success:true, sent, total: pending.length });
}
