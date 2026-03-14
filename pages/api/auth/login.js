// pages/api/auth/login.js
import { read, toUser } from "../../../lib/sheets";
import { createToken } from "../../../lib/auth";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password, role } = req.body;
  try {
    const rows = await read("Users!A:G");
    const user = rows.slice(1).map(toUser).find(u => u.email === email && u.password === password && u.role === role);
    if (!user) return res.status(401).json({ error: "Invalid credentials. Check email, password and role." });
    res.json({ success: true, token: createToken(user), user: { id:user.id, email:user.email, role:user.role, name:user.name, phone:user.phone } });
  } catch(e) { res.status(500).json({ error: e.message }); }
}
