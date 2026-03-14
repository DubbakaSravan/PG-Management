"use strict";(()=>{var e={};e.id=496,e.ids=[496],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6555:e=>{e.exports=import("uuid")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},3548:(e,t,a)=>{a.a(e,async(e,o)=>{try{a.r(t),a.d(t,{config:()=>d,default:()=>l,routeModule:()=>m});var r=a(1802),n=a(7153),i=a(6249),s=a(1674),u=e([s]);s=(u.then?(await u)():u)[0];let l=(0,i.l)(s,"default"),d=(0,i.l)(s,"config"),m=new r.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/tenants",pathname:"/api/tenants",bundlePath:"",filename:""},userland:s});o()}catch(e){o(e)}})},6044:(e,t,a)=>{function o(e){return Buffer.from(JSON.stringify({id:e.id,email:e.email,role:e.role,name:e.name,phone:e.phone})).toString("base64")}function r(e,t){let a=e.headers.authorization||"",o=a.startsWith("Bearer ")?a.slice(7):null;return o?function(e){try{return JSON.parse(Buffer.from(e,"base64").toString("utf8"))}catch{return null}}(o)||(t.status(401).json({error:"Invalid token"}),null):(t.status(401).json({error:"Unauthorized"}),null)}a.d(t,{V3:()=>o,mk:()=>r})},3427:(e,t,a)=>{a.d(t,{R3:()=>u,K5:()=>d,ij:()=>s,Xi:()=>h,Z0:()=>v,fB:()=>w,Bm:()=>y,us:()=>f,kr:()=>$,ZW:()=>p,Vx:()=>l});let o=require("googleapis"),r=require("google-auth-library");async function n(){return o.google.sheets({version:"v4",auth:function(){let e=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;if(!e)throw Error("GOOGLE_SERVICE_ACCOUNT_JSON missing from .env.local");let t=JSON.parse(e);return new r.JWT({email:t.client_email,key:t.private_key,scopes:["https://www.googleapis.com/auth/spreadsheets"]})}()})}let i=()=>process.env.GOOGLE_SHEET_ID;async function s(e){let t=await n();return(await t.spreadsheets.values.get({spreadsheetId:i(),range:e})).data.values||[]}async function u(e,t){let a=await n();await a.spreadsheets.values.append({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:[t]}})}async function l(e,t){let a=await n();await a.spreadsheets.values.update({spreadsheetId:i(),range:e,valueInputOption:"USER_ENTERED",requestBody:{values:Array.isArray(t[0])?t:[t]}})}async function d(e,t,a){let o=await s(`${e}!A:Z`);for(let e=0;e<o.length;e++)if((o[e][t]||"")===String(a))return{row:o[e],rowNum:e+1};return null}let m=(e,t)=>e&&null!=e[t]?String(e[t]):"",c=(e,t)=>parseFloat(m(e,t))||0,p=e=>({id:m(e,0),email:m(e,1),password:m(e,2),role:m(e,3),name:m(e,4),phone:m(e,5),avatar:m(e,6)}),f=e=>({id:m(e,0),number:m(e,1),type:m(e,2),floor:m(e,3),capacity:c(e,4),occupied:c(e,5),rent:c(e,6),amenities:m(e,7),status:m(e,8),description:m(e,9)}),$=e=>({id:m(e,0),name:m(e,1),phone:m(e,2),email:m(e,3),roomId:m(e,4),roomNumber:m(e,5),joinDate:m(e,6),leaveDate:m(e,7),deposit:c(e,8),monthlyRent:c(e,9),status:m(e,10),aadhaar:m(e,11),emergency:m(e,12),occupation:m(e,13),gender:m(e,14),age:m(e,15)}),y=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),month:m(e,4),amount:c(e,5),dueDate:m(e,6),paidDate:m(e,7),status:m(e,8),paymentId:m(e,9),mode:m(e,10),lateFee:c(e,11)}),h=e=>({id:m(e,0),tenantId:m(e,1),tenantName:m(e,2),roomNumber:m(e,3),category:m(e,4),desc:m(e,5),priority:m(e,6),status:m(e,7),createdAt:m(e,8),resolvedAt:m(e,9),assignedTo:m(e,10)}),w=e=>({id:m(e,0),title:m(e,1),message:m(e,2),createdAt:m(e,3),type:m(e,4),pinned:m(e,5)}),v=e=>({id:m(e,0),roomNumber:m(e,1),month:m(e,2),prev:c(e,3),curr:c(e,4),units:c(e,5),rate:c(e,6),amount:c(e,7),status:m(e,8),paidDate:m(e,9)})},2601:(e,t,a)=>{a.d(t,{n:()=>d,u:()=>l});let o=require("twilio");var r=a.n(o);let n=()=>r()(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN),i=()=>`whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,s=()=>"http://localhost:3000",u=()=>"NestIQ PG";async function l(e,t){try{return await n().messages.create({body:t,from:i(),to:`whatsapp:+91${e}`}),!0}catch(e){return console.error("WA Error:",e.message),!1}}let d={welcome:(e,t,a,o,r)=>`🏠 *Welcome to ${u()}!*
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
Contact us: ${s()}`}},1674:(e,t,a)=>{a.a(e,async(e,o)=>{try{a.r(t),a.d(t,{default:()=>l});var r=a(3427),n=a(6044),i=a(2601),s=a(6555),u=e([s]);async function l(e,t){let a=(0,n.mk)(e,t);if(a)try{if("GET"===e.method){let e=(await (0,r.ij)("Tenants!A:P")).slice(1).filter(e=>e[0]).map(r.kr);return"tenant"===a.role&&(e=e.filter(e=>e.email===a.email)),t.json(e)}if("POST"===e.method){if("owner"!==a.role)return t.status(403).json({error:"Forbidden"});let{name:o,phone:n,email:u,roomId:l,roomNumber:d,joinDate:m,deposit:c,monthlyRent:p,aadhaar:f,emergency:$,occupation:y,gender:h,age:w}=e.body,v="T"+(0,s.v4)().slice(0,6).toUpperCase(),P=n.slice(-4);await (0,r.R3)("Tenants!A:P",[v,o,n,u,l,d,m,"",+c||0,+p,"active",f||"",$||"",y||"",h||"",w||""]);let g=await (0,r.K5)("Rooms",0,l);if(g){let e=parseInt(g.row[5]||0)+1,t=parseInt(g.row[4]||1);await (0,r.Vx)(`Rooms!F${g.rowNum}`,[e]),e>=t&&await (0,r.Vx)(`Rooms!I${g.rowNum}`,["full"])}if(!(await (0,r.ij)("Users!A:G")).slice(1).find(e=>e[1]===u)){let e="U"+(0,s.v4)().slice(0,7).toUpperCase();await (0,r.R3)("Users!A:G",[e,u,P,"tenant",o,n,""])}return await (0,i.u)(n,i.n.welcome(o,d,p,m,P)),t.json({success:!0,id:v,password:P})}if("PUT"===e.method){let{id:a,...o}=e.body,n=await (0,r.K5)("Tenants",0,a);if(!n)return t.status(404).json({error:"Not found"});let s=(0,r.kr)(n.row);if(o.status&&await (0,r.Vx)(`Tenants!K${n.rowNum}`,[o.status]),o.leaveDate){await (0,r.Vx)(`Tenants!H${n.rowNum}`,[o.leaveDate]);let e=await (0,r.K5)("Rooms",0,s.roomId);if(e){let t=Math.max(0,parseInt(e.row[5]||1)-1);await (0,r.Vx)(`Rooms!F${e.rowNum}`,[t]),await (0,r.Vx)(`Rooms!I${e.rowNum}`,["available"])}await (0,i.u)(s.phone,i.n.moveOut(s.name,s.roomNumber,o.leaveDate,s.deposit))}return t.json({success:!0})}}catch(e){t.status(500).json({error:e.message})}}s=(u.then?(await u)():u)[0],o()}catch(e){o(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var a=t(t.s=3548);module.exports=a})();