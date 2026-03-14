// pages/api/payments/verify.js
import crypto from "crypto";
import { findRow, update, read, toRent, toTenant } from "../../../lib/sheets";
import { sendWA, msgs } from "../../../lib/whatsapp";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rentId } = req.body;
  const sig = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (sig !== razorpay_signature) return res.status(400).json({ error:"Invalid signature" });
  const found = await findRow("Rent", 0, rentId);
  if (!found) return res.status(404).json({ error:"Not found" });
  const r = toRent(found.row);
  await update(`Rent!H${found.rowNum}:L${found.rowNum}`, [[new Date().toISOString().split("T")[0], "paid", razorpay_payment_id, "online", 0]]);
  const tenantRows = await read("Tenants!A:P");
  const t = tenantRows.slice(1).map(toTenant).find(x => x.id === r.tenantId);
  if (t) await sendWA(t.phone, msgs.rentPaid(t.name, t.roomNumber, r.month, r.amount, "Online (Razorpay)", razorpay_payment_id));
  res.json({ success:true });
}
