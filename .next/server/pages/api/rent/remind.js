"use strict";(()=>{var e={};e.id=316,e.ids=[316],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,n){return n in t?t[n]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,n)):"function"==typeof t&&"default"===n?t:void 0}}})},2983:(e,t,n)=>{n.r(t),n.d(t,{config:()=>c,default:()=>m,routeModule:()=>p});var o={};n.r(o),n.d(o,{default:()=>d});var a=n(1802),r=n(7153),i=n(6249),s=n(3427),u=n(6044),l=n(2601);async function d(e,t){if("POST"!==e.method)return t.status(405).end();let n=(0,u.mk)(e,t);if(!n)return;if("owner"!==n.role)return t.status(403).json({error:"Forbidden"});let[o,a]=await Promise.all([(0,s.ij)("Rent!A:L"),(0,s.ij)("Tenants!A:P")]),r=a.slice(1).map(s.kr),i=o.slice(1).map(s.Bm).filter(e=>"pending"===e.status),d=new Date,m=0;for(let e of i){let t=r.find(t=>t.id===e.tenantId);if(!t)continue;let n=Math.floor((d-new Date(e.dueDate))/864e5);await (0,l.u)(t.phone,n>0?l.n.rentOverdue(t.name,t.roomNumber,e.month,e.amount,n):l.n.rentDue(t.name,t.roomNumber,e.month,e.amount,e.dueDate))&&m++,await new Promise(e=>setTimeout(e,300))}t.json({success:!0,sent:m,total:i.length})}let m=(0,i.l)(o,"default"),c=(0,i.l)(o,"config"),p=new a.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/rent/remind",pathname:"/api/rent/remind",bundlePath:"",filename:""},userland:o})},6044:(e,t,n)=>{function o(e){return Buffer.from(JSON.stringify({id:e.id,email:e.email,role:e.role,name:e.name,phone:e.phone})).toString("base64")}function a(e,t){let n=e.headers.authorization||"",o=n.startsWith("Bearer ")?n.slice(7):null;return o?function(e){try{return JSON.parse(Buffer.from(e,"base64").toString("utf8"))}catch{return null}}(o)||(t.status(401).json({error:"Invalid token"}),null):(t.status(401).json({error:"Unauthorized"}),null)}n.d(t,{V3:()=>o,mk:()=>a})},3427:(e,t,n)=>{n.d(t,{R3:()=>u,K5:()=>d,ij:()=>s,Xi:()=>h,Z0:()=>P,fB:()=>v,Bm:()=>y,us:()=>f,kr:()=>$,ZW:()=>p,Vx:()=>l});let o=require("googleapis"),a=require("google-auth-library");async function r(){return o.google.sheets({version:"v4",auth:function(){let e=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;if(!e)throw Error("GOOGLE_SERVICE_ACCOUNT_JSON missing from .env.local");let t=JSON.parse(e);return new a.JWT({email:t.client_email,key:t.private_key,scopes:["https://www.googleapis.com/auth/spreadsheets"]})}()})}let i=()=>process.env.GOOGLE_SHEET_ID;async function s(e){let t=await r();return(await t.spreadsheets.values.get({spreadsheetId:i(),range:e})).data.values||[]}async function u(e,t){let n=await r();await n.spreadsheets.values.append({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:[t]}})}async function l(e,t){let n=await r();await n.spreadsheets.values.update({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:Array.isArray(t[0])?t:[t]}})}async function d(e,t,n){let o=await s(`${e}!A:Z`);for(let e=0;e<o.length;e++)if((o[e][t]||"")===String(n))return{row:o[e],rowNum:e+1};return null}let m=(e,t)=>e&&null!=e[t]?String(e[t]):"",c=(e,t)=>parseFloat(m(e,t))||0,p=e=>({id:m(e,0),email:m(e,1),password:m(e,2),role:m(e,3),name:m(e,4),phone:m(e,5),avatar:m(e,6)}),f=e=>({id:m(e,0),number:m(e,1),type:m(e,2),floor:m(e,3),capacity:c(e,4),occupied:c(e,5),rent:c(e,6),amenities:m(e,7),status:m(e,8),description:m(e,9)}),$=e=>({id:m(e,0),name:m(e,1),phone:m(e,2),email:m(e,3),roomId:m(e,4),roomNumber:m(e,5),joinDate:m(e,6),leaveDate:m(e,7),deposit:c(e,8),monthlyRent:c(e,9),status:m(e,10),aadhaar:m(e,11),emergency:m(e,12),occupation:m(e,13),gender:m(e,14),age:m(e,15)}),y=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),month:m(e,4),amount:c(e,5),dueDate:m(e,6),paidDate:m(e,7),status:m(e,8),paymentId:m(e,9),mode:m(e,10),lateFee:c(e,11)}),h=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),category:m(e,4),desc:m(e,5),priority:m(e,6),status:m(e,7),createdAt:m(e,8),resolvedAt:m(e,9),assignedTo:m(e,10)}),v=e=>({id:m(e,0),title:m(e,1),message:m(e,2),createdAt:m(e,3),type:m(e,4),pinned:m(e,5)}),P=e=>({id:m(e,0),roomNumber:m(e,1),month:m(e,2),prev:c(e,3),curr:c(e,4),units:c(e,5),rate:c(e,6),amount:c(e,7),status:m(e,8),paidDate:m(e,9)})},2601:(e,t,n)=>{n.d(t,{n:()=>d,u:()=>l});let o=require("twilio");var a=n.n(o);let r=()=>a()(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),i=()=>`whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,s=()=>"http://localhost:3000",u=()=>"NestIQ PG";async function l(e,t){try{return await r().messages.create({body:t,from:i(),to:`whatsapp:+91${e}`}),!0}catch(e){return console.error("WA Error:",e.message),!1}}let d={welcome:(e,t,n,o,a)=>`🏠 *Welcome to ${u()}!*
━━━━━━━━━━━━━━━━━━━━
👤 Name: *${e}*
🚪 Room: *${t}*
💰 Monthly Rent: *₹${n}*
📅 Move-in: *${o}*
━━━━━━━━━━━━━━━━━━━━
🔐 *Your Portal Login:*
🌐 ${s()}
📧 Use your email
🔑 Password: *${a}*
━━━━━━━━━━━━━━━━━━━━
Pay rent & raise complaints online 📱
Welcome to your new home! 🎉`,rentDue:(e,t,n,o,a)=>`📢 *Rent Due — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi *${e}*! 👋
🚪 Room: *${t}*
📅 Month: *${n}*
💰 Amount: *₹${o}*
⏰ Due by: *${a}*
━━━━━━━━━━━━━━━━━━━━
💳 Pay online (UPI/Card/NetBanking):
${s()}
━━━━━━━━━━━━━━━━━━━━
Pay before due date to avoid late fees 🙏`,rentPaid:(e,t,n,o,a,r)=>`✅ *Rent Paid — ${u()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${n}
💰 Amount: *₹${o}*
💳 Mode: ${a}
🧾 Txn: ${r}
━━━━━━━━━━━━━━━━━━━━
Thank you for paying on time! 🙏
Download receipt: ${s()}`,rentOverdue:(e,t,n,o,a)=>`⚠️ *Overdue Rent — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your rent is *${a} days overdue*.
🚪 Room: ${t} | 📅 ${n}
💰 Due: *₹${o}*
Please pay immediately. Late fees may apply.
💳 ${s()}`,complaintRaised:(e,t,n,o)=>`🔧 *Complaint Registered — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}!
🎫 Ticket: *#${o}*
🚪 Room: ${t} | 📋 ${n}
━━━━━━━━━━━━━━━━━━━━
We'll fix this ASAP! ⚡
Track status: ${s()}`,complaintResolved:(e,t,n,o)=>`✅ *Issue Resolved — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}! Your complaint has been resolved ✅
🎫 Ticket: #${o} | 🚪 Room ${t}
📋 Category: ${n}
━━━━━━━━━━━━━━━━━━━━
Satisfied? Rate us: ${s()} 🌟`,notice:(e,t,n)=>`📣 *Notice from ${u()}*
━━━━━━━━━━━━━━━━━━━━
📌 *${t}*
━━━━━━━━━━━━━━━━━━━━
${n}
━━━━━━━━━━━━━━━━━━━━
View all notices: ${s()}`,electricityBill:(e,t,n,o,a)=>`⚡ *Electricity Bill — ${u()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${n}
🔌 Units: ${o} \xd7 ₹7 = *₹${a}*
━━━━━━━━━━━━━━━━━━━━
Pay online: ${s()}`,moveOut:(e,t,n,o)=>`👋 *Move-Out Confirmed — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, move-out confirmed.
🚪 Room: ${t} | 📅 Date: ${n}
💰 Deposit ₹${o} refunded in 7 days.
━━━━━━━━━━━━━━━━━━━━
It was great having you! 🌟
Safe travels ahead 🙏`,noticePeriod:(e,t,n)=>`⏰ *Notice Period Reminder — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your notice period ends in *${n} days*.
🚪 Room: ${t}
Please confirm your move-out date.
Contact us: ${s()}`}},7153:(e,t)=>{var n;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return n}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(n||(n={}))},1802:(e,t,n)=>{e.exports=n(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var n=t(t.s=2983);module.exports=n})();