# 🏠 NestIQ — Smart PG Management System

**Stack:** Next.js 14 · Google Sheets · Razorpay · Twilio WhatsApp · Vercel

---

## 🚀 Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local (copy from .env.example and fill values)

# 3. Setup Google Sheet — run ONCE
node scripts/setup-sheets.js

# 4. Start app
npm run dev

# 5. Open browser
http://localhost:3000
```

---

## 🔑 Demo Logins

| Role | Email | Password |
|------|-------|----------|
| 👑 Owner | owner@nestiq.com | owner123 |
| 🏠 Tenant | rahul@email.com | 7890 |
| 🏠 Tenant | priya@email.com | 6543 |

*Tenant password = last 4 digits of phone number*

---

## ✅ Features

### Owner Portal
- 📊 **Dashboard** — Revenue chart, occupancy donut, KPI cards, pending actions
- 🏢 **3D Building View** — Interactive floor-wise room allocation map, click any room for details
- 🚪 **Room Management** — Add rooms, track occupancy, amenities, floor-wise
- 👤 **Tenant Management** — Add tenant → auto WhatsApp welcome + portal login created
- 💰 **Rent Collection** — Generate monthly rent, cash/online, bulk WhatsApp reminders
- 🔧 **Complaints** — Category-wise, priority, resolve with tenant notification
- ⚡ **Electricity Bills** — Reading entry, auto calculation, tenant notification
- 📣 **Notices** — Post + blast to all tenants via WhatsApp, pin important ones
- 📊 **Reports** — Monthly revenue table, room type analysis, complaint breakdown, upcoming move-outs

### Tenant Portal
- 🏠 **My Home** — Room details, rent history, deposit info, emergency contact
- 💳 **Pay Rent** — Online UPI/Card/NetBanking via Razorpay
- 🔧 **My Complaints** — Raise + track complaints
- 📣 **Notices** — View all PG notices
- ⚡ **Electricity Bills** — View monthly bills

### WhatsApp Automations (10 triggers)
1. Welcome message when tenant joins (with portal login details)
2. Monthly rent due reminder (1st of month)
3. Rent paid receipt with transaction ID
4. Overdue rent alert (with days overdue)
5. Complaint registered confirmation
6. Complaint resolved notification
7. Electricity bill notification
8. Notice broadcast to all tenants
9. Move-out confirmation (with deposit info)
10. Notice period reminder

---

## 🗂 Google Sheets Structure (7 tabs)

| Sheet | Key Columns |
|-------|-------------|
| Users | id, email, password, role, name, phone |
| Rooms | id, number, type, floor, capacity, occupied, rent, amenities, status |
| Tenants | id, name, phone, email, roomId, roomNumber, joinDate, deposit, monthlyRent, status, gender |
| Rent | id, tenantId, month, amount, dueDate, paidDate, status, paymentId, mode |
| Complaints | id, tenantId, roomNumber, category, desc, priority, status |
| Notices | id, title, message, createdAt, type, pinned |
| Electricity | id, roomNumber, month, prev, curr, units, rate, amount, status |

---

## 🌐 Deploy to Vercel (Free)

### Step 1 — Google Sheets
1. Create sheet → copy Sheet ID from URL
2. Google Cloud Console → Enable Sheets API → Service Account → Download JSON key
3. Share sheet with service account email (Editor)
4. Minify JSON at jsonminify.com (single line)

### Step 2 — Push to GitHub
```bash
git init && git add . && git commit -m "NestIQ init"
git remote add origin https://github.com/YOUR/nestiq.git
git push -u origin main
```

### Step 3 — Vercel
1. vercel.com → Import repo
2. Add all environment variables from .env.example
3. Deploy → live in 2 minutes!

### Environment Variables
```
GOOGLE_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_JSON    ← single line minified JSON
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER
NEXT_PUBLIC_APP_URL            ← your Vercel URL
NEXT_PUBLIC_PG_NAME            ← "Your PG Name"
```

---

## 💰 Monthly Cost

| Service | Cost |
|---------|------|
| Vercel | ₹0 |
| Google Sheets | ₹0 |
| Razorpay | 2% per transaction |
| Twilio WhatsApp | ~₹0.40 per message |
| **Total Fixed** | **₹0** |

---

## 📱 How Tenant Login Works

When you add a tenant:
1. System creates login: email = their email, password = last 4 digits of phone
2. WhatsApp is sent with portal URL + credentials
3. Tenant can login to pay rent, raise complaints, view notices

---

## 🔧 Local Development Tips

- Hot reload: changes reflect instantly, no restart needed
- If you change .env.local: restart with Ctrl+C then `npm run dev`
- To reset all data: run `node scripts/setup-sheets.js` again (overwrites seed data)
- API endpoints are in `pages/api/` folder — easy to modify
