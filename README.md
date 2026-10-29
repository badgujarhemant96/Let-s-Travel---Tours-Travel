# Let's Travel — Custom Tours & Holidays

A full-featured tour and travel booking web application with real-time Firebase Firestore synchronization, multi-step booking workflows, Indian Rupee (₹) UPI payment receipts with QR verification, certified regional tour guide directory, and an executive Staff Administrator console.

---

## 📋 System Requirements
- **Node.js**: `v18.x` or `v20.x` (LTS recommended)
- **Package Manager**: `npm` (v9+) or `bun` / `pnpm`
- **Code Editor**: Visual Studio Code, Cursor, WebStorm, or any modern editor

---

## 🚀 Quick Start Guide (Run Locally in VS Code)

### 1. Install Dependencies
Open your terminal in the project root directory and execute:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the provided `.env.example` file to create your `.env` configuration:
```bash
cp .env.example .env
```
The `.env` file already contains pre-configured Firebase project settings:
```ini
VITE_FIREBASE_API_KEY="AIzaSyAPf6TPYyDOijMC3jUTAlDH_WXISSHcYY4"
VITE_FIREBASE_AUTH_DOMAIN="gen-lang-client-0453937262.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="gen-lang-client-0453937262"
VITE_FIREBASE_STORAGE_BUCKET="gen-lang-client-0453937262.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="671840861780"
VITE_FIREBASE_APP_ID="1:671840861780:web:a66ac746860bc1d7cdf7c1"
VITE_FIREBASE_DATABASE_ID="ai-studio-ba7c405e-fed0-47f5-b7db-cb7d0eddbb23"
APP_URL="http://localhost:3000"
```

### 3. Start Development Server
Run the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🛠️ Building for Production
To generate an optimized production bundle:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🔐 Staff Administrator Portal Access
To access the executive admin panel, click **Admin Portal** in the navigation header or footer.

### Authorized Staff Credentials:
| Staff Member | Username | Password | Role & Responsibility |
|---|---|---|---|
| **Badgujar hemant** | `Badgujar hemant` | `256128307001` | Super Administrator (Full Access) |
| **Mukesh Sharma** | `Mukesh Sharma` | `246120307068` | Senior Tour Director (Destinations & Packages) |
| **Riken Raval** | `Riken Raval` | `246120307066` | Operations & Logistics Manager (Bookings & SOS) |
| **Chandan Yadav** | `Chandan Yadav` | `246120307077` | Accounts & Billing Executive (Payments & Revenue) |

*A 1-click Preset Fill button is also available on the admin login screen for rapid testing.*

---

## 📊 Features & Architecture

### 1. Real-Time Admin Dashboard Metrics
- **Gross Booking Value (GBV)**: Sums total confirmed and paid customer bookings live via Firestore `onSnapshot`.
- **Net Revenue / Profit**: Calculated formulaically:
  $$\text{Net Profit} = \text{Gross Booking Value} - \sum(\text{Package Operational Cost}) - \sum(\text{Guide Fees})$$
- **Package Operational Cost**: Editable directly in the admin panel for each destination.
- **Synchronized Payments Ledger**: Every paid booking appears in real-time in the Payments & Revenue tab.

### 2. Professional Excel & Sheets CSV Export
- Clean CSV files with **UTF-8 BOM** (`\uFEFF`) to prevent corrupting the `₹` symbol and Indian regional text.
- Formatted `DD-MM-YYYY` dates, unformatted numeric currency fields, and RFC 4180 escaping.
- Available for:
  - **Bookings**: `lets-travel-bookings-YYYY-MM-DD.csv`
  - **Payments Ledger**: `lets-travel-payments-YYYY-MM-DD.csv`
  - **Travelers Directory**: `lets-travel-travelers-YYYY-MM-DD.csv`

### 3. Booking & Digital Receipts
- High-contrast interactive QR code with **LET'S TRAVEL** branding on payments and vouchers.
- **Download as PDF**: Targets the receipt or voucher directly with dedicated `@media print` stylesheets.

---

## 🔒 Firestore Security Rules
The database rules are defined in `firestore.rules`.
To deploy them with Firebase CLI:
```bash
firebase deploy --only firestore:rules
```
