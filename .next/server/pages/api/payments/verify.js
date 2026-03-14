"use strict";(()=>{var e={};e.id=446,e.ids=[446],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},7541:(e,t,a)=>{a.r(t),a.d(t,{config:()=>p,default:()=>c,routeModule:()=>$});var o={};a.r(o),a.d(o,{default:()=>m});var n=a(1802),r=a(7153),i=a(6249);let s=require("crypto");var u=a.n(s),d=a(3427),l=a(2601);async function m(e,t){if("POST"!==e.method)return t.status(405).end();let{razorpay_order_id:a,razorpay_payment_id:o,razorpay_signature:n,rentId:r}=e.body;if(u().createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(`${a}|${o}`).digest("hex")!==n)return t.status(400).json({error:"Invalid signature"});let i=await (0,d.K5)("Rent",0,r);if(!i)return t.status(404).json({error:"Not found"});let s=(0,d.Bm)(i.row);await (0,d.Vx)(`Rent!H${i.rowNum}:L${i.rowNum}`,[[new Date().toISOString().split("T")[0],"paid",o,"online",0]]);let m=(await (0,d.ij)("Tenants!A:P")).slice(1).map(d.kr).find(e=>e.id===s.tenantId);m&&await (0,l.u)(m.phone,l.n.rentPaid(m.name,m.roomNumber,s.month,s.amount,"Online (Razorpay)",o)),t.json({success:!0})}let c=(0,i.l)(o,"default"),p=(0,i.l)(o,"config"),$=new n.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/payments/verify",pathname:"/api/payments/verify",bundlePath:"",filename:""},userland:o})},3427:(e,t,a)=>{a.d(t,{R3:()=>u,K5:()=>l,ij:()=>s,Xi:()=>v,Z0:()=>P,fB:()=>h,Bm:()=>f,us:()=>$,kr:()=>y,ZW:()=>p,Vx:()=>d});let o=require("googleapis"),n=require("google-auth-library");async function r(){return o.google.sheets({version:"v4",auth:function(){let e=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;if(!e)throw Error("GOOGLE_SERVICE_ACCOUNT_JSON missing from .env.local");let t=JSON.parse(e);return new n.JWT({email:t.client_email,key:t.private_key,scopes:["https://www.googleapis.com/auth/spreadsheets"]})}()})}let i=()=>process.env.GOOGLE_SHEET_ID;async function s(e){let t=await r();return(await t.spreadsheets.values.get({spreadsheetId:i(),range:e})).data.values||[]}async function u(e,t){let a=await r();await a.spreadsheets.values.append({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:[t]}})}async function d(e,t){let a=await r();await a.spreadsheets.values.update({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:Array.isArray(t[0])?t:[t]}})}async function l(e,t,a){let o=await s(`${e}!A:Z`);for(let e=0;e<o.length;e++)if((o[e][t]||"")===String(a))return{row:o[e],rowNum:e+1};return null}let m=(e,t)=>e&&null!=e[t]?String(e[t]):"",c=(e,t)=>parseFloat(m(e,t))||0,p=e=>({id:m(e,0),email:m(e,1),password:m(e,2),role:m(e,3),name:m(e,4),phone:m(e,5),avatar:m(e,6)}),$=e=>({id:m(e,0),number:m(e,1),type:m(e,2),floor:m(e,3),capacity:c(e,4),occupied:c(e,5),rent:c(e,6),amenities:m(e,7),status:m(e,8),description:m(e,9)}),y=e=>({id:m(e,0),name:m(e,1),phone:m(e,2),email:m(e,3),roomId:m(e,4),roomNumber:m(e,5),joinDate:m(e,6),leaveDate:m(e,7),deposit:c(e,8),monthlyRent:c(e,9),status:m(e,10),aadhaar:m(e,11),emergency:m(e,12),occupation:m(e,13),gender:m(e,14),age:m(e,15)}),f=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),month:m(e,4),amount:c(e,5),dueDate:m(e,6),paidDate:m(e,7),status:m(e,8),paymentId:m(e,9),mode:m(e,10),lateFee:c(e,11)}),v=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),category:m(e,4),desc:m(e,5),priority:m(e,6),status:m(e,7),createdAt:m(e,8),resolvedAt:m(e,9),assignedTo:m(e,10)}),h=e=>({id:m(e,0),title:m(e,1),message:m(e,2),createdAt:m(e,3),type:m(e,4),pinned:m(e,5)}),P=e=>({id:m(e,0),roomNumber:m(e,1),month:m(e,2),prev:c(e,3),curr:c(e,4),units:c(e,5),rate:c(e,6),amount:c(e,7),status:m(e,8),paidDate:m(e,9)})},2601:(e,t,a)=>{a.d(t,{n:()=>l,u:()=>d});let o=require("twilio");var n=a.n(o);let r=()=>n()(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),i=()=>`whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,s=()=>"http://localhost:3000",u=()=>"NestIQ PG";async function d(e,t){try{return await r().messages.create({body:t,from:i(),to:`whatsapp:+91${e}`}),!0}catch(e){return console.error("WA Error:",e.message),!1}}let l={welcome:(e,t,a,o,n)=>`🏠 *Welcome to ${u()}!*
━━━━━━━━━━━━━━━━━━━━
👤 Name: *${e}*
🚪 Room: *${t}*
💰 Monthly Rent: *₹${a}*
📅 Move-in: *${o}*
━━━━━━━━━━━━━━━━━━━━
🔐 *Your Portal Login:*
🌐 ${s()}
📧 Use your email
🔑 Password: *${n}*
━━━━━━━━━━━━━━━━━━━━
Pay rent & raise complaints online 📱
Welcome to your new home! 🎉`,rentDue:(e,t,a,o,n)=>`📢 *Rent Due — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi *${e}*! 👋
🚪 Room: *${t}*
📅 Month: *${a}*
💰 Amount: *₹${o}*
⏰ Due by: *${n}*
━━━━━━━━━━━━━━━━━━━━
💳 Pay online (UPI/Card/NetBanking):
${s()}
━━━━━━━━━━━━━━━━━━━━
Pay before due date to avoid late fees 🙏`,rentPaid:(e,t,a,o,n,r)=>`✅ *Rent Paid — ${u()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${a}
💰 Amount: *₹${o}*
💳 Mode: ${n}
🧾 Txn: ${r}
━━━━━━━━━━━━━━━━━━━━
Thank you for paying on time! 🙏
Download receipt: ${s()}`,rentOverdue:(e,t,a,o,n)=>`⚠️ *Overdue Rent — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your rent is *${n} days overdue*.
🚪 Room: ${t} | 📅 ${a}
💰 Due: *₹${o}*
Please pay immediately. Late fees may apply.
💳 ${s()}`,complaintRaised:(e,t,a,o)=>`🔧 *Complaint Registered — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}!
🎫 Ticket: *#${o}*
🚪 Room: ${t} | 📋 ${a}
━━━━━━━━━━━━━━━━━━━━
We'll fix this ASAP! ⚡
Track status: ${s()}`,complaintResolved:(e,t,a,o)=>`✅ *Issue Resolved — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}! Your complaint has been resolved ✅
🎫 Ticket: #${o} | 🚪 Room ${t}
📋 Category: ${a}
━━━━━━━━━━━━━━━━━━━━
Satisfied? Rate us: ${s()} 🌟`,notice:(e,t,a)=>`📣 *Notice from ${u()}*
━━━━━━━━━━━━━━━━━━━━
📌 *${t}*
━━━━━━━━━━━━━━━━━━━━
${a}
━━━━━━━━━━━━━━━━━━━━
View all notices: ${s()}`,electricityBill:(e,t,a,o,n)=>`⚡ *Electricity Bill — ${u()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${a}
🔌 Units: ${o} \xd7 ₹7 = *₹${n}*
━━━━━━━━━━━━━━━━━━━━
Pay online: ${s()}`,moveOut:(e,t,a,o)=>`👋 *Move-Out Confirmed — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, move-out confirmed.
🚪 Room: ${t} | 📅 Date: ${a}
💰 Deposit ₹${o} refunded in 7 days.
━━━━━━━━━━━━━━━━━━━━
It was great having you! 🌟
Safe travels ahead 🙏`,noticePeriod:(e,t,a)=>`⏰ *Notice Period Reminder — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your notice period ends in *${a} days*.
🚪 Room: ${t}
Please confirm your move-out date.
Contact us: ${s()}`}},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var a=t(t.s=7541);module.exports=a})();