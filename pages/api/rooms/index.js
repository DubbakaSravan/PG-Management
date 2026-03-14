// pages/api/rooms/index.js
import { read, append, update, findRow, toRoom } from "../../../lib/sheets";
import { requireAuth } from "../../../lib/auth";
import { v4 as uuid } from "uuid";
export default async function handler(req, res) {
  const user = requireAuth(req, res); if (!user) return;
  try {
    if (req.method === "GET") {
      const rows = await read("Rooms!A:J");
      return res.json(rows.slice(1).filter(r => r[0]).map(toRoom));
    }
    if (req.method === "POST") {
      if (user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
      const { number, type, floor, capacity, rent, amenities, description } = req.body;
      const id = "R" + uuid().slice(0,6).toUpperCase();
      await append("Rooms!A:J", [id, number, type, floor, +capacity, 0, +rent, amenities||"", "available", description||""]);
      return res.json({ success: true, id });
    }
    if (req.method === "PUT") {
      if (user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
      const { id, ...fields } = req.body;
      const found = await findRow("Rooms", 0, id);
      if (!found) return res.status(404).json({ error: "Not found" });
      const r = found.row;
      const updated = [
        id,
        fields.number  ?? r[1],
        fields.type    ?? r[2],
        fields.floor   ?? r[3],
        fields.capacity?? r[4],
        fields.occupied?? r[5],
        fields.rent    ?? r[6],
        fields.amenities??r[7],
        fields.status  ?? r[8],
        fields.description??r[9],
      ];
      await update(`Rooms!A${found.rowNum}:J${found.rowNum}`, [updated]);
      return res.json({ success: true });
    }
    if (req.method === "DELETE") {
      if (user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
      const { id } = req.body;
      const found = await findRow("Rooms", 0, id);
      if (!found) return res.status(404).json({ error: "Not found" });
      await update(`Rooms!I${found.rowNum}`, ["deleted"]);
      return res.json({ success: true });
    }
  } catch(e) { res.status(500).json({ error: e.message }); }
}
