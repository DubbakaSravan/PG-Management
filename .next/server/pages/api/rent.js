"use strict";(()=>{var e={};e.id=594,e.ids=[594],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6555:e=>{e.exports=import("uuid")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},3606:(e,t,a)=>{a.a(e,async(e,n)=>{try{a.r(t),a.d(t,{config:()=>d,default:()=>l,routeModule:()=>m});var o=a(1802),r=a(7153),i=a(6249),s=a(9232),u=e([s]);s=(u.then?(await u)():u)[0];let l=(0,i.l)(s,"default"),d=(0,i.l)(s,"config"),m=new o.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/rent",pathname:"/api/rent",bundlePath:"",filename:""},userland:s});n()}catch(e){n(e)}})},6044:(e,t,a)=>{function n(e){return Buffer.from(JSON.stringify({id:e.id,email:e.email,role:e.role,name:e.name,phone:e.phone})).toString("base64")}function o(e,t){let a=e.headers.authorization||"",n=a.startsWith("Bearer ")?a.slice(7):null;return n?function(e){try{return JSON.parse(Buffer.from(e,"base64").toString("utf8"))}catch{return null}}(n)||(t.status(401).json({error:"Invalid token"}),null):(t.status(401).json({error:"Unauthorized"}),null)}a.d(t,{V3:()=>n,mk:()=>o})},3427:(e,t,a)=>{a.d(t,{R3:()=>u,K5:()=>d,ij:()=>s,Xi:()=>h,Z0:()=>P,fB:()=>v,Bm:()=>y,us:()=>f,kr:()=>$,ZW:()=>p,Vx:()=>l});let n=require("googleapis"),o=require("google-auth-library");async function r(){return n.google.sheets({version:"v4",auth:function(){let e=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;if(!e)throw Error("GOOGLE_SERVICE_ACCOUNT_JSON missing from .env.local");let t=JSON.parse(e);return new o.JWT({email:t.client_email,key:t.private_key,scopes:["https://www.googleapis.com/auth/spreadsheets"]})}()})}let i=()=>process.env.GOOGLE_SHEET_ID;async function s(e){let t=await r();return(await t.spreadsheets.values.get({spreadsheetId:i(),range:e})).data.values||[]}async function u(e,t){let a=await r();await a.spreadsheets.values.append({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:[t]}})}async function l(e,t){let a=await r();await a.spreadsheets.values.update({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:Array.isArray(t[0])?t:[t]}})}async function d(e,t,a){let n=await s(`${e}!A:Z`);for(let e=0;e<n.length;e++)if((n[e][t]||"")===String(a))return{row:n[e],rowNum:e+1};return null}let m=(e,t)=>e&&null!=e[t]?String(e[t]):"",c=(e,t)=>parseFloat(m(e,t))||0,p=e=>({id:m(e,0),email:m(e,1),password:m(e,2),role:m(e,3),name:m(e,4),phone:m(e,5),avatar:m(e,6)}),f=e=>({id:m(e,0),number:m(e,1),type:m(e,2),floor:m(e,3),capacity:c(e,4),occupied:c(e,5),rent:c(e,6),amenities:m(e,7),status:m(e,8),description:m(e,9)}),$=e=>({id:m(e,0),name:m(e,1),phone:m(e,2),email:m(e,3),roomId:m(e,4),roomNumber:m(e,5),joinDate:m(e,6),leaveDate:m(e,7),deposit:c(e,8),monthlyRent:c(e,9),status:m(e,10),aadhaar:m(e,11),emergency:m(e,12),occupation:m(e,13),gender:m(e,14),age:m(e,15)}),y=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),month:m(e,4),amount:c(e,5),dueDate:m(e,6),paidDate:m(e,7),status:m(e,8),paymentId:m(e,9),mode:m(e,10),lateFee:c(e,11)}),h=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),category:m(e,4),desc:m(e,5),priority:m(e,6),status:m(e,7),createdAt:m(e,8),resolvedAt:m(e,9),assignedTo:m(e,10)}),v=e=>({id:m(e,0),title:m(e,1),message:m(e,2),createdAt:m(e,3),type:m(e,4),pinned:m(e,5)}),P=e=>({id:m(e,0),roomNumber:m(e,1),month:m(e,2),prev:c(e,3),curr:c(e,4),units:c(e,5),rate:c(e,6),amount:c(e,7),status:m(e,8),paidDate:m(e,9)})},2601:(e,t,a)=>{a.d(t,{n:()=>d,u:()=>l});let n=require("twilio");var o=a.n(n);let r=()=>o()(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),i=()=>`whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,s=()=>"http://localhost:3000",u=()=>"NestIQ PG";async function l(e,t){try{return await r().messages.create({body:t,from:i(),to:`whatsapp:+91${e}`}),!0}catch(e){return console.error("WA Error:",e.message),!1}}let d={welcome:(e,t,a,n,o)=>`🏠 *Welcome to ${u()}!*
━━━━━━━━━━━━━━━━━━━━
👤 Name: *${e}*
🚪 Room: *${t}*
💰 Monthly Rent: *₹${a}*
📅 Move-in: *${n}*
━━━━━━━━━━━━━━━━━━━━
🔐 *Your Portal Login:*
🌐 ${s()}
📧 Use your email
🔑 Password: *${o}*
━━━━━━━━━━━━━━━━━━━━
Pay rent & raise complaints online 📱
Welcome to your new home! 🎉`,rentDue:(e,t,a,n,o)=>`📢 *Rent Due — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi *${e}*! 👋
🚪 Room: *${t}*
📅 Month: *${a}*
💰 Amount: *₹${n}*
⏰ Due by: *${o}*
━━━━━━━━━━━━━━━━━━━━
💳 Pay online (UPI/Card/NetBanking):
${s()}
━━━━━━━━━━━━━━━━━━━━
Pay before due date to avoid late fees 🙏`,rentPaid:(e,t,a,n,o,r)=>`✅ *Rent Paid — ${u()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${a}
💰 Amount: *₹${n}*
💳 Mode: ${o}
🧾 Txn: ${r}
━━━━━━━━━━━━━━━━━━━━
Thank you for paying on time! 🙏
Download receipt: ${s()}`,rentOverdue:(e,t,a,n,o)=>`⚠️ *Overdue Rent — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your rent is *${o} days overdue*.
🚪 Room: ${t} | 📅 ${a}
💰 Due: *₹${n}*
Please pay immediately. Late fees may apply.
💳 ${s()}`,complaintRaised:(e,t,a,n)=>`🔧 *Complaint Registered — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}!
🎫 Ticket: *#${n}*
🚪 Room: ${t} | 📋 ${a}
━━━━━━━━━━━━━━━━━━━━
We'll fix this ASAP! ⚡
Track status: ${s()}`,complaintResolved:(e,t,a,n)=>`✅ *Issue Resolved — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}! Your complaint has been resolved ✅
🎫 Ticket: #${n} | 🚪 Room ${t}
📋 Category: ${a}
━━━━━━━━━━━━━━━━━━━━
Satisfied? Rate us: ${s()} 🌟`,notice:(e,t,a)=>`📣 *Notice from ${u()}*
━━━━━━━━━━━━━━━━━━━━
📌 *${t}*
━━━━━━━━━━━━━━━━━━━━
${a}
━━━━━━━━━━━━━━━━━━━━
View all notices: ${s()}`,electricityBill:(e,t,a,n,o)=>`⚡ *Electricity Bill — ${u()}*
━━━━━━━━━━━━━━━━━━━━
👤 ${e} | 🚪 Room ${t}
📅 Month: ${a}
🔌 Units: ${n} \xd7 ₹7 = *₹${o}*
━━━━━━━━━━━━━━━━━━━━
Pay online: ${s()}`,moveOut:(e,t,a,n)=>`👋 *Move-Out Confirmed — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, move-out confirmed.
🚪 Room: ${t} | 📅 Date: ${a}
💰 Deposit ₹${n} refunded in 7 days.
━━━━━━━━━━━━━━━━━━━━
It was great having you! 🌟
Safe travels ahead 🙏`,noticePeriod:(e,t,a)=>`⏰ *Notice Period Reminder — ${u()}*
━━━━━━━━━━━━━━━━━━━━
Hi ${e}, your notice period ends in *${a} days*.
🚪 Room: ${t}
Please confirm your move-out date.
Contact us: ${s()}`}},9232:(e,t,a)=>{a.a(e,async(e,n)=>{try{a.r(t),a.d(t,{default:()=>l});var o=a(3427),r=a(6044),i=a(2601),s=a(6555),u=e([s]);async function l(e,t){let a=(0,r.mk)(e,t);if(a)try{if("GET"===e.method){let e=(await (0,o.ij)("Rent!A:L")).slice(1).filter(e=>e[0]).map(o.Bm);if("tenant"===a.role){let t=(await (0,o.ij)("Tenants!A:P")).slice(1).map(o.kr).find(e=>e.email===a.email);t&&(e=e.filter(e=>e.tenantId===t.id))}return t.json(e)}if("POST"===e.method&&"generate"===e.body.action){if("owner"!==a.role)return t.status(403).json({error:"Forbidden"});let{month:n}=e.body,r=await (0,o.ij)("Tenants!A:P"),u=await (0,o.ij)("Rent!A:L"),l=r.slice(1).filter(e=>e[0]).map(o.kr).filter(e=>"active"===e.status),d=u.slice(1).map(o.Bm),m=0;for(let e of l){if(d.find(t=>t.tenantId===e.id&&t.month===n))continue;let t="RNT"+(0,s.v4)().slice(0,5).toUpperCase(),a=`${n}-05`;await (0,o.R3)("Rent!A:L",[t,e.id,e.name,e.roomNumber,n,e.monthlyRent,a,"","pending","","online",0]),await (0,i.u)(e.phone,i.n.rentDue(e.name,e.roomNumber,n,e.monthlyRent,a)),m++}return t.json({success:!0,generated:m})}if("PUT"===e.method){let{id:a,status:n,paymentId:r,mode:s,paidDate:u,lateFee:l}=e.body,d=await (0,o.K5)("Rent",0,a);if(!d)return t.status(404).json({error:"Not found"});let m=(0,o.Bm)(d.row),c=u||new Date().toISOString().split("T")[0];await (0,o.Vx)(`Rent!H${d.rowNum}:L${d.rowNum}`,[[c,"paid",r||"CASH",s||"cash",l||0]]);let p=(await (0,o.ij)("Tenants!A:P")).slice(1).map(o.kr).find(e=>e.id===m.tenantId);return p&&await (0,i.u)(p.phone,i.n.rentPaid(p.name,p.roomNumber,m.month,m.amount,s||"cash",r||"CASH")),t.json({success:!0})}}catch(e){t.status(500).json({error:e.message})}}s=(u.then?(await u)():u)[0],n()}catch(e){n(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=3606);module.exports=a})();