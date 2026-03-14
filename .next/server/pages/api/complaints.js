"use strict";(()=>{var e={};e.id=530,e.ids=[530],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6555:e=>{e.exports=import("uuid")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},3711:(e,t,a)=>{a.a(e,async(e,o)=>{try{a.r(t),a.d(t,{config:()=>d,default:()=>u,routeModule:()=>m});var n=a(1802),r=a(7153),i=a(6249),s=a(4074),l=e([s]);s=(l.then?(await l)():l)[0];let u=(0,i.l)(s,"default"),d=(0,i.l)(s,"config"),m=new n.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/complaints",pathname:"/api/complaints",bundlePath:"",filename:""},userland:s});o()}catch(e){o(e)}})},6044:(e,t,a)=>{function o(e){return Buffer.from(JSON.stringify({id:e.id,email:e.email,role:e.role,name:e.name,phone:e.phone})).toString("base64")}function n(e,t){let a=e.headers.authorization||"",o=a.startsWith("Bearer ")?a.slice(7):null;return o?function(e){try{return JSON.parse(Buffer.from(e,"base64").toString("utf8"))}catch{return null}}(o)||(t.status(401).json({error:"Invalid token"}),null):(t.status(401).json({error:"Unauthorized"}),null)}a.d(t,{V3:()=>o,mk:()=>n})},3427:(e,t,a)=>{a.d(t,{R3:()=>l,K5:()=>d,ij:()=>s,Xi:()=>h,Z0:()=>P,fB:()=>v,Bm:()=>y,us:()=>f,kr:()=>$,ZW:()=>p,Vx:()=>u});let o=require("googleapis"),n=require("google-auth-library");async function r(){return o.google.sheets({version:"v4",auth:function(){let e=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;if(!e)throw Error("GOOGLE_SERVICE_ACCOUNT_JSON missing from .env.local");let t=JSON.parse(e);return new n.JWT({email:t.client_email,key:t.private_key,scopes:["https://www.googleapis.com/auth/spreadsheets"]})}()})}let i=()=>process.env.GOOGLE_SHEET_ID;async function s(e){let t=await r();return(await t.spreadsheets.values.get({spreadsheetId:i(),range:e})).data.values||[]}async function l(e,t){let a=await r();await a.spreadsheets.values.append({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:[t]}})}async function u(e,t){let a=await r();await a.spreadsheets.values.update({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:Array.isArray(t[0])?t:[t]}})}async function d(e,t,a){let o=await s(`${e}!A:Z`);for(let e=0;e<o.length;e++)if((o[e][t]||"")===String(a))return{row:o[e],rowNum:e+1};return null}let m=(e,t)=>e&&null!=e[t]?String(e[t]):"",c=(e,t)=>parseFloat(m(e,t))||0,p=e=>({id:m(e,0),email:m(e,1),password:m(e,2),role:m(e,3),name:m(e,4),phone:m(e,5),avatar:m(e,6)}),f=e=>({id:m(e,0),number:m(e,1),type:m(e,2),floor:m(e,3),capacity:c(e,4),occupied:c(e,5),rent:c(e,6),amenities:m(e,7),status:m(e,8),description:m(e,9)}),$=e=>({id:m(e,0),name:m(e,1),phone:m(e,2),email:m(e,3),roomId:m(e,4),roomNumber:m(e,5),joinDate:m(e,6),leaveDate:m(e,7),deposit:c(e,8),monthlyRent:c(e,9),status:m(e,10),aadhaar:m(e,11),emergency:m(e,12),occupation:m(e,13),gender:m(e,14),age:m(e,15)}),y=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),month:m(e,4),amount:c(e,5),dueDate:m(e,6),paidDate:m(e,7),status:m(e,8),paymentId:m(e,9),mode:m(e,10),lateFee:c(e,11)}),h=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),category:m(e,4),desc:m(e,5),priority:m(e,6),status:m(e,7),createdAt:m(e,8),resolvedAt:m(e,9),assignedTo:m(e,10)}),v=e=>({id:m(e,0),title:m(e,1),message:m(e,2),createdAt:m(e,3),type:m(e,4),pinned:m(e,5)}),P=e=>({id:m(e,0),roomNumber:m(e,1),month:m(e,2),prev:c(e,3),curr:c(e,4),units:c(e,5),rate:c(e,6),amount:c(e,7),status:m(e,8),paidDate:m(e,9)})},2601:(e,t,a)=>{a.d(t,{n:()=>d,u:()=>u});let o=require("twilio");var n=a.n(o);let r=()=>n()(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),i=()=>`whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,s=()=>"http://localhost:3000",l=()=>"NestIQ PG";async function u(e,t){try{return await r().messages.create({body:t,from:i(),to:`whatsapp:+91${e}`}),!0}catch(e){return console.error("WA Error:",e.message),!1}}let d={welcome:(e,t,a,o,n)=>`🏠 *Welcome to ${l()}!*
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
Welcome to your new home! 🎉`,rentDue:(e,t,a,o,n)=>`📢 *Rent Due — ${l()}*
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
Pay before due date to avoid late fees 🙏`,rentPaid:(e,t,a,o,n,r)=>`✅ *Rent Paid — ${l()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${a}
💰 Amount: *₹${o}*
💳 Mode: ${n}
🧾 Txn: ${r}
━━━━━━━━━━━━━━━━━━━━
Thank you for paying on time! 🙏
Download receipt: ${s()}`,rentOverdue:(e,t,a,o,n)=>`⚠️ *Overdue Rent — ${l()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your rent is *${n} days overdue*.
🚪 Room: ${t} | 📅 ${a}
💰 Due: *₹${o}*
Please pay immediately. Late fees may apply.
💳 ${s()}`,complaintRaised:(e,t,a,o)=>`🔧 *Complaint Registered — ${l()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}!
🎫 Ticket: *#${o}*
🚪 Room: ${t} | 📋 ${a}
━━━━━━━━━━━━━━━━━━━━
We'll fix this ASAP! ⚡
Track status: ${s()}`,complaintResolved:(e,t,a,o)=>`✅ *Issue Resolved — ${l()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}! Your complaint has been resolved ✅
🎫 Ticket: #${o} | 🚪 Room ${t}
📋 Category: ${a}
━━━━━━━━━━━━━━━━━━━━
Satisfied? Rate us: ${s()} 🌟`,notice:(e,t,a)=>`📣 *Notice from ${l()}*
━━━━━━━━━━━━━━━━━━━━
📌 *${t}*
━━━━━━━━━━━━━━━━━━━━
${a}
━━━━━━━━━━━━━━━━━━━━
View all notices: ${s()}`,electricityBill:(e,t,a,o,n)=>`⚡ *Electricity Bill — ${l()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${a}
🔌 Units: ${o} \xd7 ₹7 = *₹${n}*
━━━━━━━━━━━━━━━━━━━━
Pay online: ${s()}`,moveOut:(e,t,a,o)=>`👋 *Move-Out Confirmed — ${l()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, move-out confirmed.
🚪 Room: ${t} | 📅 Date: ${a}
💰 Deposit ₹${o} refunded in 7 days.
━━━━━━━━━━━━━━━━━━━━
It was great having you! 🌟
Safe travels ahead 🙏`,noticePeriod:(e,t,a)=>`⏰ *Notice Period Reminder — ${l()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your notice period ends in *${a} days*.
🚪 Room: ${t}
Please confirm your move-out date.
Contact us: ${s()}`}},4074:(e,t,a)=>{a.a(e,async(e,o)=>{try{a.r(t),a.d(t,{default:()=>u});var n=a(3427),r=a(6044),i=a(2601),s=a(6555),l=e([s]);async function u(e,t){let a=(0,r.mk)(e,t);if(a)try{if("GET"===e.method){let e=(await (0,n.ij)("Complaints!A:K")).slice(1).filter(e=>e[0]).map(n.Xi);if("tenant"===a.role){let t=(await (0,n.ij)("Tenants!A:P")).slice(1).map(n.kr).find(e=>e.email===a.email);t&&(e=e.filter(e=>e.tenantId===t.id))}return t.json(e)}if("POST"===e.method){let{tenantId:o,tenantName:r,roomNumber:l,category:u,desc:d,priority:m}=e.body,c=(0,s.v4)().slice(0,6).toUpperCase(),p=new Date().toISOString().split("T")[0];return await (0,n.R3)("Complaints!A:K",[c,o||a.id,r||a.name,l||"",u,d,m||"medium","open",p,"",""]),await (0,i.u)(a.phone,i.n.complaintRaised(r||a.name,l,u,c)),t.json({success:!0,id:c})}if("PUT"===e.method){let{id:a,status:o,assignedTo:r}=e.body,s=await (0,n.K5)("Complaints",0,a);if(!s)return t.status(404).json({error:"Not found"});let l=(0,n.Xi)(s.row),u="resolved"===o?new Date().toISOString().split("T")[0]:l.resolvedAt;if(await (0,n.Vx)(`Complaints!H${s.rowNum}:K${s.rowNum}`,[[o,l.createdAt,u,r||l.assignedTo]]),"resolved"===o){let e=(await (0,n.ij)("Tenants!A:P")).slice(1).map(n.kr).find(e=>e.id===l.tenantId);e&&await (0,i.u)(e.phone,i.n.complaintResolved(e.name,e.roomNumber,l.category,a))}return t.json({success:!0})}}catch(e){t.status(500).json({error:e.message})}}s=(l.then?(await l)():l)[0],o()}catch(e){o(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=3711);module.exports=a})();