// pages/api/notices/index.js
import { read, append, toNotice, toTenant } from "../../../lib/sheets";
import { requireAuth } from "../../../lib/auth";
import { sendWA, msgs } from "../../../lib/whatsapp";
import { v4 as uuid } from "uuid";
export default async function handler(req, res) {
  const user = requireAuth(req, res); if (!user) return;
  try {
    if (req.method === "GET") {
      const rows = await read("Notices!A:F");
      return res.json(rows.slice(1).filter(r=>r[0]).map(toNotice).reverse());
    }
    if (req.method === "POST") {
      if (user.role !== "owner") return res.status(403).json({ error:"Forbidden" });
      const { title, message, type, blast, pinned } = req.body;
      const id = "N" + uuid().slice(0,5).toUpperCase();
      await append("Notices!A:F", [id, title, message, new Date().toISOString().split("T")[0], type||"general", pinned?"yes":"no"]);
      let sent = 0;
      if (blast) {
        const rows = await read("Tenants!A:P");
        const tenants = rows.slice(1).map(toTenant).filter(t=>t.status==="active");
        for (const t of tenants) { if (await sendWA(t.phone, msgs.notice(t.name, title, message))) sent++; await new Promise(x=>setTimeout(x,300)); }
      }
      return res.json({ success:true, id, sent });
    }
  } catch(e) { res.status(500).json({ error:e.message }); }
}
