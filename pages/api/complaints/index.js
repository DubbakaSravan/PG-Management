// pages/api/complaints/index.js
import { read, append, update, findRow, toComp, toTenant } from "../../../lib/sheets";
import { requireAuth } from "../../../lib/auth";
import { sendWA, msgs } from "../../../lib/whatsapp";
import { v4 as uuid } from "uuid";
export default async function handler(req, res) {
  const user = requireAuth(req, res); if (!user) return;
  try {
    if (req.method === "GET") {
      const rows = await read("Complaints!A:K");
      let comps = rows.slice(1).filter(r=>r[0]).map(toComp);
      if (user.role === "tenant") {
        const tenantRows = await read("Tenants!A:P");
        const me = tenantRows.slice(1).map(toTenant).find(t => t.email === user.email);
        if (me) comps = comps.filter(c => c.tenantId === me.id);
      }
      return res.json(comps);
    }
    if (req.method === "POST") {
      const { tenantId, tenantName, roomNumber, category, desc, priority } = req.body;
      const id = uuid().slice(0,6).toUpperCase();
      const createdAt = new Date().toISOString().split("T")[0];
      await append("Complaints!A:K", [id, tenantId||user.id, tenantName||user.name, roomNumber||"", category, desc, priority||"medium", "open", createdAt, "", ""]);
      await sendWA(user.phone, msgs.complaintRaised(tenantName||user.name, roomNumber, category, id));
      return res.json({ success:true, id });
    }
    if (req.method === "PUT") {
      const { id, status, assignedTo } = req.body;
      const found = await findRow("Complaints", 0, id);
      if (!found) return res.status(404).json({ error:"Not found" });
      const c = toComp(found.row);
      const resolvedAt = status === "resolved" ? new Date().toISOString().split("T")[0] : c.resolvedAt;
      await update(`Complaints!H${found.rowNum}:K${found.rowNum}`, [[status, c.createdAt, resolvedAt, assignedTo||c.assignedTo]]);
      if (status === "resolved") {
        const tenantRows = await read("Tenants!A:P");
        const t = tenantRows.slice(1).map(toTenant).find(x => x.id === c.tenantId);
        if (t) await sendWA(t.phone, msgs.complaintResolved(t.name, t.roomNumber, c.category, id));
      }
      return res.json({ success:true });
    }
  } catch(e) { res.status(500).json({ error:e.message }); }
}
