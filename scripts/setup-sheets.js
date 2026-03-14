// scripts/setup-sheets.js  — CommonJS, run with: node scripts/setup-sheets.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
const { google } = require("googleapis");
const { JWT } = require("google-auth-library");

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const TABS = [
  { name: "Users",       headers: ["id","email","password","role","name","phone","avatar"] },
  { name: "Rooms",       headers: ["id","number","type","floor","capacity","occupied","rent","amenities","status","description"] },
  { name: "Tenants",     headers: ["id","name","phone","email","roomId","roomNumber","joinDate","leaveDate","deposit","monthlyRent","status","aadhaar","emergency","occupation","gender","age"] },
  { name: "Rent",        headers: ["id","tenantId","tenantName","roomNumber","month","amount","dueDate","paidDate","status","paymentId","mode","lateFee"] },
  { name: "Complaints",  headers: ["id","tenantId","tenantName","roomNumber","category","desc","priority","status","createdAt","resolvedAt","assignedTo"] },
  { name: "Notices",     headers: ["id","title","message","createdAt","type","pinned"] },
  { name: "Electricity", headers: ["id","roomNumber","month","prev","curr","units","rate","amount","status","paidDate"] },
];

const SEED = {
  Users: [
    ["USR001","owner@nestiq.com","owner123","owner","Rajesh Kumar","9876500001",""],
    ["USR002","rahul@email.com","7890","tenant","Rahul Sharma","9876547890",""],
    ["USR003","priya@email.com","6543","tenant","Priya Singh","9876546543",""],
    ["USR004","amit@email.com","3210","tenant","Amit Patel","9876543210",""],
  ],
  Rooms: [
    ["RM001","101","Single","Ground",1,1,7000,"AC,WiFi,Attached Bathroom","available","Corner room with natural light"],
    ["RM002","102","Double","Ground",2,2,6000,"WiFi,Geyser","full","Spacious double sharing"],
    ["RM003","201","Double","1st",2,0,6500,"AC,WiFi,Attached Bathroom","available",""],
    ["RM004","202","Triple","1st",3,1,5000,"WiFi","available",""],
    ["RM005","301","Studio","2nd",1,0,9500,"AC,WiFi,Attached Bathroom,Balcony","available","Premium studio with city view"],
    ["RM006","302","Deluxe","2nd",1,0,11000,"AC,WiFi,Attached Bathroom,Balcony,TV,Refrigerator","available","Fully furnished deluxe room"],
  ],
  Tenants: [
    ["T001","Rahul Sharma","9876547890","rahul@email.com","RM001","101","2024-11-01","",15000,7000,"active","7890","Ravi Sharma 9988776655","Software Engineer","Male","26"],
    ["T002","Priya Singh","9876546543","priya@email.com","RM002","102","2024-12-01","",12000,6000,"active","6543","Meena Singh 9977665544","MBA Student","Female","23"],
    ["T003","Amit Patel","9876543210","amit@email.com","RM002","102","2025-01-15","",12000,6000,"active","3210","Suresh Patel 9966554433","Data Analyst","Male","25"],
  ],
  Rent: [
    ["RNT001","T001","Rahul Sharma","101","2025-02",7000,"2025-02-05","2025-02-03","paid","PAY001","online",0],
    ["RNT002","T002","Priya Singh","102","2025-02",6000,"2025-02-05","2025-02-04","paid","PAY002","online",0],
    ["RNT003","T003","Amit Patel","102","2025-02",6000,"2025-02-05","2025-02-07","paid","CASH","cash",0],
    ["RNT004","T001","Rahul Sharma","101","2025-03",7000,"2025-03-05","","pending","","",0],
    ["RNT005","T002","Priya Singh","102","2025-03",6000,"2025-03-05","","pending","","",0],
    ["RNT006","T003","Amit Patel","102","2025-03",6000,"2025-03-05","","pending","","",0],
  ],
  Complaints: [
    ["ABCD12","T001","Rahul Sharma","101","Plumbing","Bathroom tap is leaking since 2 days. Water is wasting.","high","open","2025-03-01","",""],
    ["EF5678","T002","Priya Singh","102","WiFi","Internet speed is very slow. Not able to work from room.","medium","open","2025-03-03","",""],
    ["GH9012","T003","Amit Patel","102","Electrical","One plug point in room is not working.","medium","resolved","2025-02-20","2025-02-22","Electrician Ramu"],
  ],
  Notices: [
    ["N001","Water Supply Interruption","Water supply will be off on 10th March from 10 AM to 2 PM for overhead tank cleaning. Please store water in advance.","2025-03-05","maintenance","yes"],
    ["N002","March Rent Due Reminder","Kindly pay March rent before 5th March to avoid late fees. Pay online via the portal for instant receipt.","2025-03-01","payment","no"],
    ["N003","New WiFi Password","WiFi password has been updated. New password: NestIQ@2025. Contact caretaker if any issues.","2025-02-28","general","no"],
  ],
  Electricity: [
    ["EL001","101","2025-02",1100,1245,145,7,1015,"paid","2025-02-28"],
    ["EL002","102","2025-02",2200,2398,198,7,1386,"paid","2025-02-28"],
    ["EL003","101","2025-03",1245,1380,135,7,945,"pending",""],
    ["EL004","102","2025-03",2398,2560,162,7,1134,"pending",""],
  ],
};

async function main() {
  console.log("\n🏠 NestIQ PG — Google Sheets Setup\n" + "═".repeat(40));

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    console.error("❌ GOOGLE_SERVICE_ACCOUNT_JSON is missing from .env.local");
    process.exit(1);
  }
  if (!SHEET_ID) {
    console.error("❌ GOOGLE_SHEET_ID is missing from .env.local");
    process.exit(1);
  }

  let creds;
  try {
    creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    console.log("✅ Credentials parsed — Service account:", creds.client_email);
  } catch(e) {
    console.error("❌ GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON:", e.message);
    console.error("   Make sure it is on a SINGLE LINE with no line breaks in .env.local");
    process.exit(1);
  }

  const auth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  console.log("🔗 Connecting to Google Sheets...");

  let meta;
  try {
    meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  } catch(e) {
    console.error("\n❌ Cannot access sheet. Two possible reasons:");
    console.error("   1. Sheet not shared with service account.");
    console.error(`      → Open the sheet, click Share, add: ${creds.client_email} as Editor`);
    console.error("   2. GOOGLE_SHEET_ID is wrong.");
    console.error(`      → Your sheet ID: ${SHEET_ID}`);
    console.error("   Error:", e.message);
    process.exit(1);
  }

  const existing = meta.data.sheets.map(s => s.properties.title);
  console.log("✅ Connected! Existing tabs:", existing.join(", ") || "none");

  // Create missing tabs
  const toCreate = TABS.filter(t => !existing.includes(t.name));
  if (toCreate.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        requests: toCreate.map(t => ({ addSheet: { properties: { title: t.name } } }))
      }
    });
    console.log("✅ Created tabs:", toCreate.map(t => t.name).join(", "));
  } else {
    console.log("✅ All tabs already exist");
  }

  // Write headers + seed data to each tab
  console.log("\n📝 Writing data...");
  for (const tab of TABS) {
    const seed = SEED[tab.name] || [];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${tab.name}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [tab.headers, ...seed] }
    });
    console.log(`   ✅ ${tab.name.padEnd(15)} — ${seed.length} rows seeded`);
  }

  console.log(`
${"═".repeat(40)}
🎉 SETUP COMPLETE!

📋 Your Sheet:
   https://docs.google.com/spreadsheets/d/${SHEET_ID}

🔑 Demo Logins:
   👑 Owner:  owner@nestiq.com   /  owner123
   🏠 Tenant: rahul@email.com    /  7890
   🏠 Tenant: priya@email.com    /  6543
   🏠 Tenant: amit@email.com     /  3210

🏠 Rooms:   6 rooms set up (101, 102, 201, 202, 301, 302)
👤 Tenants: 3 active tenants seeded
💰 Rent:    6 rent records (3 paid, 3 pending)
🔧 Complaints: 3 records (2 open, 1 resolved)
📣 Notices: 3 notices
⚡ Electricity: 4 bills

▶ Now run: npm run dev
▶ Open: http://localhost:3000
${"═".repeat(40)}
`);
}

main().catch(e => {
  console.error("\n❌ Setup failed:", e.message);
  process.exit(1);
});
