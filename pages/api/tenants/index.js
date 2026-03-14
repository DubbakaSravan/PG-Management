// pages/api/tenants/index.js
import { read, append, update, findRow, toTenant } from "../../../lib/sheets";
import { requireAuth, createToken } from "../../../lib/auth";
import { sendWA, msgs } from "../../../lib/whatsapp";
import { v4 as uuid } from "uuid";
export default async function handler(req, res) {
  const user = requireAuth(req, res); if (!user) return;
  try {
    if (req.method === "GET") {
      const rows = await read("Tenants!A:P");
      let tenants = rows.slice(1).filter(r => r[0]).map(toTenant);
      if (user.role === "tenant") tenants = tenants.filter(t => t.email === user.email);
      return res.json(tenants);
    }
    if (req.method === "POST") {
      if (user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
      const { name, phone, email, roomId, roomNumber, joinDate, deposit, monthlyRent, aadhaar, emergency, occupation, gender, age } = req.body;
      const id = "T" + uuid().slice(0,6).toUpperCase();
      const password = phone.slice(-4);
      await append("Tenants!A:P", [id, name, phone, email, roomId, roomNumber, joinDate, "", +deposit||0, +monthlyRent, "active", aadhaar||"", emergency||"", occupation||"", gender||"", age||""]);
      // Update room
      const roomFound = await findRow("Rooms", 0, roomId);
      if (roomFound) {
        const occ = parseInt(roomFound.row[5]||0) + 1;
        const cap = parseInt(roomFound.row[4]||1);
        await update(`Rooms!F${roomFound.rowNum}`, [occ]);
        if (occ >= cap) await update(`Rooms!I${roomFound.rowNum}`, ["full"]);
      }
      // Create user account
      const existingUsers = await read("Users!A:G");
      if (!existingUsers.slice(1).find(r => r[1] === email)) {
        const uid = "U" + uuid().slice(0,7).toUpperCase();
        await append("Users!A:G", [uid, email, password, "tenant", name, phone, ""]);
      }
      await sendWA(phone, msgs.welcome(name, roomNumber, monthlyRent, joinDate, password));
      return res.json({ success: true, id, password });
    }
    if (req.method === "PUT") {
      const { id, ...fields } = req.body;
      const found = await findRow("Tenants", 0, id);
      if (!found) return res.status(404).json({ error: "Not found" });
      const t = toTenant(found.row);
      if (fields.status) await update(`Tenants!K${found.rowNum}`, [fields.status]);
      if (fields.leaveDate) {
        await update(`Tenants!H${found.rowNum}`, [fields.leaveDate]);
        const roomFound = await findRow("Rooms", 0, t.roomId);
        if (roomFound) {
          const occ = Math.max(0, parseInt(roomFound.row[5]||1) - 1);
          await update(`Rooms!F${roomFound.rowNum}`, [occ]);
          await update(`Rooms!I${roomFound.rowNum}`, [occ === 0 ? "available" : "available"]);
        }
        await sendWA(t.phone, msgs.moveOut(t.name, t.roomNumber, fields.leaveDate, t.deposit));
      }
      return res.json({ success: true });
    }
  } catch(e) { res.status(500).json({ error: e.message }); }
}
