// pages/api/payments/create-order.js
import Razorpay from "razorpay";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { amount, rentId } = req.body;
  const rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const order = await rz.orders.create({ amount: amount * 100, currency: "INR", receipt: rentId, notes: { rentId } });
  res.json({ orderId: order.id, amount: order.amount });
}
