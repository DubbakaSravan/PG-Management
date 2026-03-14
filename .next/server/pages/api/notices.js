"use strict";(()=>{var e={};e.id=340,e.ids=[340],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6555:e=>{e.exports=import("uuid")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},4830:(e,t,a)=>{a.a(e,async(e,o)=>{try{a.r(t),a.d(t,{config:()=>d,default:()=>l,routeModule:()=>c});var r=a(1802),n=a(7153),i=a(6249),s=a(5940),u=e([s]);s=(u.then?(await u)():u)[0];let l=(0,i.l)(s,"default"),d=(0,i.l)(s,"config"),c=new r.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/notices",pathname:"/api/notices",bundlePath:"",filename:""},userland:s});o()}catch(e){o(e)}})},6044:(e,t,a)=>{function o(e){return Buffer.from(JSON.stringify({id:e.id,email:e.email,role:e.role,name:e.name,phone:e.phone})).toString("base64")}function r(e,t){let a=e.headers.authorization||"",o=a.startsWith("Bearer ")?a.slice(7):null;return o?function(e){try{return JSON.parse(Buffer.from(e,"base64").toString("utf8"))}catch{return null}}(o)||(t.status(401).json({error:"Invalid token"}),null):(t.status(401).json({error:"Unauthorized"}),null)}a.d(t,{V3:()=>o,mk:()=>r})},3427:(e,t,a)=>{a.d(t,{R3:()=>u,K5:()=>d,ij:()=>s,Xi:()=>h,Z0:()=>P,fB:()=>v,Bm:()=>y,us:()=>f,kr:()=>$,ZW:()=>p,Vx:()=>l});let o=require("googleapis"),r=require("google-auth-library");async function n(){return o.google.sheets({version:"v4",auth:function(){let e=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;if(!e)throw Error("GOOGLE_SERVICE_ACCOUNT_JSON missing from .env.local");let t=JSON.parse(e);return new r.JWT({email:t.client_email,key:t.private_key,scopes:["https://www.googleapis.com/auth/spreadsheets"]})}()})}let i=()=>process.env.GOOGLE_SHEET_ID;async function s(e){let t=await n();return(await t.spreadsheets.values.get({spreadsheetId:i(),range:e})).data.values||[]}async function u(e,t){let a=await n();await a.spreadsheets.values.append({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:[t]}})}async function l(e,t){let a=await n();await a.spreadsheets.values.update({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:Array.isArray(t[0])?t:[t]}})}async function d(e,t,a){let o=await s(`${e}!A:Z`);for(let e=0;e<o.length;e++)if((o[e][t]||"")===String(a))return{row:o[e],rowNum:e+1};return null}let c=(e,t)=>e&&null!=e[t]?String(e[t]):"",m=(e,t)=>parseFloat(c(e,t))||0,p=e=>({id:c(e,0),email:c(e,1),password:c(e,2),role:c(e,3),name:c(e,4),phone:c(e,5),avatar:c(e,6)}),f=e=>({id:c(e,0),number:c(e,1),type:c(e,2),floor:c(e,3),capacity:m(e,4),occupied:m(e,5),rent:m(e,6),amenities:c(e,7),status:c(e,8),description:c(e,9)}),$=e=>({id:c(e,0),name:c(e,1),phone:c(e,2),email:c(e,3),roomId:c(e,4),roomNumber:c(e,5),joinDate:c(e,6),leaveDate:c(e,7),deposit:m(e,8),monthlyRent:m(e,9),status:c(e,10),aadhaar:c(e,11),emergency:c(e,12),occupation:c(e,13),gender:c(e,14),age:c(e,15)}),y=e=>({id:c(e,0),tenantId:c(e,1),tenantName:c(e,2),roomNumber:c(e,3),month:c(e,4),amount:m(e,5),dueDate:c(e,6),paidDate:c(e,7),status:c(e,8),paymentId:c(e,9),mode:c(e,10),lateFee:m(e,11)}),h=e=>({id:c(e,0),tenantId:c(e,1),tenantName:c(e,2),roomNumber:c(e,3),category:c(e,4),desc:c(e,5),priority:c(e,6),status:c(e,7),createdAt:c(e,8),resolvedAt:c(e,9),assignedTo:c(e,10)}),v=e=>({id:c(e,0),title:c(e,1),message:c(e,2),createdAt:c(e,3),type:c(e,4),pinned:c(e,5)}),P=e=>({id:c(e,0),roomNumber:c(e,1),month:c(e,2),prev:m(e,3),curr:m(e,4),units:m(e,5),rate:m(e,6),amount:m(e,7),status:c(e,8),paidDate:c(e,9)})},2601:(e,t,a)=>{a.d(t,{n:()=>d,u:()=>l});let o=require("twilio");var r=a.n(o);let n=()=>r()(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),i=()=>`whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,s=()=>"http://localhost:3000",u=()=>"NestIQ PG";async function l(e,t){try{return await n().messages.create({body:t,from:i(),to:`whatsapp:+91${e}`}),!0}catch(e){return console.error("WA Error:",e.message),!1}}let d={welcome:(e,t,a,o,r)=>`🏠 *Welcome to ${u()}!*
━━━━━━━━━━━━━━━━━━━━
👤 Name: *${e}*
🚪 Room: *${t}*
💰 Monthly Rent: *₹${a}*
📅 Move-in: *${o}*
━━━━━━━━━━━━━━━━━━━━
🔐 *Your Portal Login:*
🌐 ${s()}
📧 Use your email
🔑 Password: *${r}*
━━━━━━━━━━━━━━━━━━━━
Pay rent & raise complaints online 📱
Welcome to your new home! 🎉`,rentDue:(e,t,a,o,r)=>`📢 *Rent Due — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi *${e}*! 👋
🚪 Room: *${t}*
📅 Month: *${a}*
💰 Amount: *₹${o}*
⏰ Due by: *${r}*
━━━━━━━━━━━━━━━━━━━━
💳 Pay online (UPI/Card/NetBanking):
${s()}
━━━━━━━━━━━━━━━━━━━━
Pay before due date to avoid late fees 🙏`,rentPaid:(e,t,a,o,r,n)=>`✅ *Rent Paid — ${u()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${a}
💰 Amount: *₹${o}*
💳 Mode: ${r}
🧾 Txn: ${n}
━━━━━━━━━━━━━━━━━━━━
Thank you for paying on time! 🙏
Download receipt: ${s()}`,rentOverdue:(e,t,a,o,r)=>`⚠️ *Overdue Rent — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your rent is *${r} days overdue*.
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
View all notices: ${s()}`,electricityBill:(e,t,a,o,r)=>`⚡ *Electricity Bill — ${u()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${a}
🔌 Units: ${o} \xd7 ₹7 = *₹${r}*
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
Contact us: ${s()}`}},5940:(e,t,a)=>{a.a(e,async(e,o)=>{try{a.r(t),a.d(t,{default:()=>l});var r=a(3427),n=a(6044),i=a(2601),s=a(6555),u=e([s]);async function l(e,t){let a=(0,n.mk)(e,t);if(a)try{if("GET"===e.method){let e=await (0,r.ij)("Notices!A:F");return t.json(e.slice(1).filter(e=>e[0]).map(r.fB).reverse())}if("POST"===e.method){if("owner"!==a.role)return t.status(403).json({error:"Forbidden"});let{title:o,message:n,type:u,blast:l,pinned:d}=e.body,c="N"+(0,s.v4)().slice(0,5).toUpperCase();await (0,r.R3)("Notices!A:F",[c,o,n,new Date().toISOString().split("T")[0],u||"general",d?"yes":"no"]);let m=0;if(l)for(let e of(await (0,r.ij)("Tenants!A:P")).slice(1).map(r.kr).filter(e=>"active"===e.status))await (0,i.u)(e.phone,i.n.notice(e.name,o,n))&&m++,await new Promise(e=>setTimeout(e,300));return t.json({success:!0,id:c,sent:m})}}catch(e){t.status(500).json({error:e.message})}}s=(u.then?(await u)():u)[0],o()}catch(e){o(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=4830);module.exports=a})();