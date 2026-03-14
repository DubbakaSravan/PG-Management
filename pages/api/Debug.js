// pages/api/debug.js
// TEMPORARY FILE - delete after fixing login
import { read } from "../../lib/sheets";

export default async function handler(req, res) {
  try {
    const rows = await read("Users!A:G");
    res.json({
      success: true,
      message: "Sheet connected!",
      totalRows: rows.length,
      headers: rows[0] || "NO HEADERS",
      dataRows: rows.slice(1),
      env: {
        sheetId: process.env.GOOGLE_SHEET_ID || "MISSING",
        hasJson: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
        jsonLength: (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "").length,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "MISSING",
      }
    });
  } catch(e) {
    res.status(500).json({
      success: false,
      error: e.message,
      hint: e.message.includes("credentials") ? "JSON parse error - check .env.local" :
            e.message.includes("403") ? "Sheet not shared with service account" :
            e.message.includes("404") ? "Wrong GOOGLE_SHEET_ID" : "Unknown error"
    });
  }
}