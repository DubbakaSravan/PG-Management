// lib/whatsapp.js
import twilio from "twilio";
const client = () => twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM = () => `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
const APP = () => process.env.NEXT_PUBLIC_APP_URL || "";
const PG  = () => process.env.NEXT_PUBLIC_PG_NAME || "NestIQ PG";

export async function sendWA(phone, message) {
  try {
    await client().messages.create({ body: message, from: FROM(), to: `whatsapp:+91${phone}` });
    return true;
  } catch (e) { console.error("WA Error:", e.message); return false; }
}

export const msgs = {
  welcome: (name, room, rent, joinDate, password) =>
`🏠 *Welcome to ${PG()}!*
━━━━━━━━━━━━━━━━━━━━
👤 Name: *${name}*
🚪 Room: *${room}*
💰 Monthly Rent: *₹${rent}*
📅 Move-in: *${joinDate}*
━━━━━━━━━━━━━━━━━━━━
🔐 *Your Portal Login:*
🌐 ${APP()}
📧 Use your email
🔑 Password: *${password}*
━━━━━━━━━━━━━━━━━━━━
Pay rent & raise complaints online 📱
Welcome to your new home! 🎉`,

  rentDue: (name, room, month, amount, dueDate) =>
`📢 *Rent Due — ${PG()}*
━━━━━━━━━━━━━━━━━━━━
Hi *${name}*! 👋
🚪 Room: *${room}*
📅 Month: *${month}*
💰 Amount: *₹${amount}*
⏰ Due by: *${dueDate}*
━━━━━━━━━━━━━━━━━━━━
💳 Pay online (UPI/Card/NetBanking):
${APP()}
━━━━━━━━━━━━━━━━━━━━
Pay before due date to avoid late fees 🙏`,

  rentPaid: (name, room, month, amount, mode, txnId) =>
`✅ *Rent Paid — ${PG()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${name} | 🚪 Room ${room}
📅 Month: ${month}
💰 Amount: *₹${amount}*
💳 Mode: ${mode}
🧾 Txn: ${txnId}
━━━━━━━━━━━━━━━━━━━━
Thank you for paying on time! 🙏
Download receipt: ${APP()}`,

  rentOverdue: (name, room, month, amount, days) =>
`⚠️ *Overdue Rent — ${PG()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${name}, your rent is *${days} days overdue*.
🚪 Room: ${room} | 📅 ${month}
💰 Due: *₹${amount}*
Please pay immediately. Late fees may apply.
💳 ${APP()}`,

  complaintRaised: (name, room, cat, id) =>
`🔧 *Complaint Registered — ${PG()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${name}!
🎫 Ticket: *#${id}*
🚪 Room: ${room} | 📋 ${cat}
━━━━━━━━━━━━━━━━━━━━
We'll fix this ASAP! ⚡
Track status: ${APP()}`,

  complaintResolved: (name, room, cat, id) =>
`✅ *Issue Resolved — ${PG()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${name}! Your complaint has been resolved ✅
🎫 Ticket: #${id} | 🚪 Room ${room}
📋 Category: ${cat}
━━━━━━━━━━━━━━━━━━━━
Satisfied? Rate us: ${APP()} 🌟`,

  notice: (name, title, msg) =>
`📣 *Notice from ${PG()}*
━━━━━━━━━━━━━━━━━━━━
📌 *${title}*
━━━━━━━━━━━━━━━━━━━━
${msg}
━━━━━━━━━━━━━━━━━━━━
View all notices: ${APP()}`,

  electricityBill: (name, room, month, units, amount) =>
`⚡ *Electricity Bill — ${PG()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${name} | 🚪 Room ${room}
📅 Month: ${month}
🔌 Units: ${units} × ₹7 = *₹${amount}*
━━━━━━━━━━━━━━━━━━━━
Pay online: ${APP()}`,

  moveOut: (name, room, date, deposit) =>
`👋 *Move-Out Confirmed — ${PG()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${name}, move-out confirmed.
🚪 Room: ${room} | 📅 Date: ${date}
💰 Deposit ₹${deposit} refunded in 7 days.
━━━━━━━━━━━━━━━━━━━━
It was great having you! 🌟
Safe travels ahead 🙏`,

  noticePeriod: (name, room, days) =>
`⏰ *Notice Period Reminder — ${PG()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${name}, your notice period ends in *${days} days*.
🚪 Room: ${room}
Please confirm your move-out date.
Contact us: ${APP()}`,
};
