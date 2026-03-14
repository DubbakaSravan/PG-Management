// lib/auth.js
export function createToken(user) {
  return Buffer.from(JSON.stringify({ id:user.id, email:user.email, role:user.role, name:user.name, phone:user.phone })).toString("base64");
}
export function verifyToken(token) {
  try { return JSON.parse(Buffer.from(token, "base64").toString("utf8")); }
  catch { return null; }
}
export function requireAuth(req, res) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) { res.status(401).json({ error: "Unauthorized" }); return null; }
  const user = verifyToken(token);
  if (!user) { res.status(401).json({ error: "Invalid token" }); return null; }
  return user;
}
