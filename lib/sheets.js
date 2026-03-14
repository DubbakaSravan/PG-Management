// lib/sheets.js
import { google } from "googleapis";
import { JWT } from "google-auth-library";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON missing");

  let creds;
  try {
    creds = JSON.parse(raw);
  } catch(e) {
    throw new Error("Invalid JSON: " + e.message);
  }

  // PERMANENT FIX: Use separate GOOGLE_PRIVATE_KEY env var if set
  // This bypasses all Vercel JSON escaping issues completely
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || creds.private_key;
  
  // Handle all escaping variations Vercel might use
  privateKey = privateKey.replace(/\\n/g, '\n');
  privateKey = privateKey.replace(/\\r/g, '');
  // Remove surrounding quotes if Vercel added them
  privateKey = privateKey.replace(/^"/, '').replace(/"$/, '');

  return new JWT({
    email: creds.client_email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

const SID = () => process.env.GOOGLE_SHEET_ID;

export async function read(range) {
  const s = await getSheets();
  const r = await s.spreadsheets.values.get({ spreadsheetId: SID(), range });
  return r.data.values || [];
}
export async function append(range, values) {
  const s = await getSheets();
  await s.spreadsheets.values.append({ spreadsheetId: SID(), range, valueInputOption: "USER_ENTERED", requestBody: { values: [values] } });
}
export async function update(range, values) {
  const s = await getSheets();
  await s.spreadsheets.values.update({ spreadsheetId: SID(), range, valueInputOption: "USER_ENTERED", requestBody: { values: Array.isArray(values[0]) ? values : [values] } });
}
export async function findRow(tab, colIdx, val) {
  const rows = await read(`${tab}!A:Z`);
  for (let i = 0; i < rows.length; i++)
    if ((rows[i][colIdx] || "") === String(val)) return { row: rows[i], rowNum: i + 1 };
  return null;
}

// Mappers
export const col = (r, i) => (r && r[i] != null ? String(r[i]) : "");
export const num = (r, i) => parseFloat(col(r, i)) || 0;
export const toUser   = r => ({ id:col(r,0), email:col(r,1), password:col(r,2), role:col(r,3), name:col(r,4), phone:col(r,5), avatar:col(r,6) });
export const toRoom   = r => ({ id:col(r,0), number:col(r,1), type:col(r,2), floor:col(r,3), capacity:num(r,4), occupied:num(r,5), rent:num(r,6), amenities:col(r,7), status:col(r,8), description:col(r,9) });
export const toTenant = r => ({ id:col(r,0), name:col(r,1), phone:col(r,2), email:col(r,3), roomId:col(r,4), roomNumber:col(r,5), joinDate:col(r,6), leaveDate:col(r,7), deposit:num(r,8), monthlyRent:num(r,9), status:col(r,10), aadhaar:col(r,11), emergency:col(r,12), occupation:col(r,13), gender:col(r,14), age:col(r,15) });
export const toRent   = r => ({ id:col(r,0), tenantId:col(r,1), tenantName:col(r,2), roomNumber:col(r,3), month:col(r,4), amount:num(r,5), dueDate:col(r,6), paidDate:col(r,7), status:col(r,8), paymentId:col(r,9), mode:col(r,10), lateFee:num(r,11) });
export const toComp   = r => ({ id:col(r,0), tenantId:col(r,1), tenantName:col(r,2), roomNumber:col(r,3), category:col(r,4), desc:col(r,5), priority:col(r,6), status:col(r,7), createdAt:col(r,8), resolvedAt:col(r,9), assignedTo:col(r,10) });
export const toNotice = r => ({ id:col(r,0), title:col(r,1), message:col(r,2), createdAt:col(r,3), type:col(r,4), pinned:col(r,5) });
export const toElec   = r => ({ id:col(r,0), roomNumber:col(r,1), month:col(r,2), prev:num(r,3), curr:num(r,4), units:num(r,5), rate:num(r,6), amount:num(r,7), status:col(r,8), paidDate:col(r,9) });