# Califnco Water Purifier E-Commerce Platform & Ecosystem

> **Califnco Round 1 Software Developer Technical Assignment**  
> **Role Architectures:** Customer, Dealer, Admin, AI Automation Engineer  

---

## 1. Overview & System Architecture

Califnco Water is a multi-tier e-commerce and field service platform engineered for the residential and commercial water purification sector. The solution features:

```
                                    +-----------------------------------------+
                                    |         Califnco Water Ecosystem        |
                                    +-----------------------------------------+
                                                         |
         +-----------------------------------------------+-----------------------------------------------+
         |                                               |                                               |
         v                                               v                                               v
+-----------------------+                    +-----------------------+                    +-----------------------+
|  Android Mobile App   |                    |  Next.js Admin Panel  |                    |   n8n AI Automations  |
|  (Expo / React Native)|                    |   (Web & Responsive)  |                    |  (Instagram & Status) |
| - 52 Realistic Prods  |                    | - Real-time Dashboard |                    | - Daily Cron Node     |
| - Wholesale Pricing   |                    | - Order Dispatch      |                    | - Zero-Hallucination  |
| - OSM Free Location   |                    | - Dealer Verification |                    | - Meta Graph API      |
| - Razorpay Test Mode  |                    | - Inventory CRUD      |                    | - WAHA Status API     |
| - Dark Mode & Zoom    |                    | - Service Operations  |                    | - Google Sheets Sync  |
+-----------------------+                    +-----------------------+                    +-----------------------+
         |                                               |                                               |
         +-----------------------+-----------------------+-----------------------------------------------+
                                 |
                                 v
               +-----------------------------------+
               |    Firebase Backend Services      |
               | - Firebase Authentication         |
               | - Cloud Firestore (Atomic Txns)   |
               | - Security Rules (Strict RBAC)    |
               +-----------------------------------+
```

---

## 2. Assignment Requirements & Compliance Matrix

| Requirement | Category | Califnco Implementation | Status |
| :--- | :--- | :--- | :---: |
| **Android Application** | Mobile | React Native via Expo SDK, TypeScript, functional components | **COMPLETE** |
| **User Roles** | Auth | Customer, Dealer, and Admin role segregation | **COMPLETE** |
| **Catalog Density** | Catalog | **52 authentic products** across Domestic RO, Commercial RO, Dispensers, Pumps, Membranes, Cartridges, Spares, and Testing kits | **COMPLETE** |
| **Wholesale Tier** | B2B Dealer | Dedicated wholesale pricing (~25-45% off) with Minimum Order Quantity (MOQ) enforcement | **COMPLETE** |
| **Dealer Approval Gate** | Security | Unapproved dealers locked until Admin reviews GSTIN and approves account | **COMPLETE** |
| **Shopping Cart** | Cart | Persistent cart, dynamic GST (18%), shipping calculation, referral discounts | **COMPLETE** |
| **Razorpay Test Mode** | Payments | Test mode checkout with HMAC-SHA256 signature verification & simulated failure toggle | **COMPLETE** |
| **Free Maps & Addresses**| Location | **OpenStreetMap & Nominatim** geocoding & location picker without paid Google billing | **COMPLETE** |
| **Field Service Booking**| Operations | Installation, Maintenance, and Breakdown Repair booking with date & time slot picker | **COMPLETE** |
| **Next.js Web Admin** | Web Admin | Responsive Next.js App Router panel deployable to Vercel with real-time database writes | **COMPLETE** |
| **Admin Operations** | Web Admin | Order status progression, Dealer approvals, Product inventory CRUD, Technician assignment | **COMPLETE** |
| **Firestore Security Rules**| Security | Role-based rules preventing client role tampering, customer data isolation, and admin protection | **COMPLETE** |
| **AI Instagram Post** | Automation | Scheduled n8n workflow, Google Sheets reader, zero-hallucination caption, studio image prompt, Meta Graph API | **COMPLETE** |
| **Bonus: WAHA Status** | Bonus (+10) | WhatsApp HTTP API daily status broadcast workflow and configuration guide | **COMPLETE** |
| **Bonus: App Polish** | Bonus (+5) | Dynamic Light/Dark mode, Fullscreen Image Lightbox Zoom, Referral code engine with ₹250 wallet bonus | **COMPLETE** |

---

## 3. Repository Structure

```text
├── .env.example                               # Root template for environment credentials
├── .gitignore                                 # Production secret and node_modules exclusions
├── README.md                                  # This master runbook
├── docs/
│   ├── REQUIREMENTS.md                        # Exhaustive functional & technical requirements
│   ├── IMPLEMENTATION_PLAN.md                 # Architecture, schemas, and phased roadmap
│   ├── PROGRESS.md                            # Milestone tracking and completion status
│   ├── TESTING.md                             # Step-by-step verification and QA test logs
│   ├── DEPLOYMENT.md                          # Vercel, Expo APK, and Firebase deployment guides
│   └── DEMO_SCRIPT.md                         # 5-minute evaluation walkthrough script
├── mobile/                                    # Android E-Commerce App (React Native + Expo)
│   ├── src/
│   │   ├── components/                        # ProductCard, ImageLightbox, StatusBadge
│   │   ├── context/                           # ThemeContext (Dark Mode), AuthContext, CartContext
│   │   ├── navigation/                        # RootNavigator, BottomTabNavigator
│   │   ├── screens/                           # 16 Screens (Home, Catalog, Detail, Cart, OSM Address, Checkout, etc.)
│   │   ├── services/                          # Nominatim OpenStreetMap, Razorpay HMAC, Notifications
│   │   └── types/                             # TypeScript interfaces
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── admin/                                     # Web Admin Panel (Next.js 14 + Tailwind CSS)
│   ├── src/
│   │   ├── app/                               # Dashboard, Orders, Dealers, Products, Services, Users, Login
│   │   ├── components/                        # Sidebar, Header, StatsCard, StatusBadge, ProductModal
│   │   ├── lib/                               # Firebase Client, dataStore with local persistence & Firestore sync
│   │   └── types/                             # Shared administrative types
│   ├── tailwind.config.ts
│   ├── next.config.mjs
│   └── package.json
├── firebase/                                  # Backend Security & Data Seeder
│   ├── firestore.rules                        # Enterprise role-based access control
│   ├── firestore.indexes.json                 # Query performance compound indexes
│   ├── firebase.json                          # Emulator & deployment manifest
│   └── seeds/
│       ├── products.json                      # 52 realistic water purifier items & specs
│       ├── categories.json                    # 10 water purification categories
│       └── seed.js                            # Automated database population script
└── automation/                                # AI Social Media & Messaging Automations
    ├── instagram_daily_product_workflow.json  # Importable n8n workflow for daily Instagram post
    ├── waha_whatsapp_status_workflow.json     # Bonus WAHA workflow for WhatsApp Status broadcast
    ├── sample_catalog_google_sheets.csv       # Sample Google Sheets catalog with schema
    ├── dry_run_test.js                        # 100% autonomous verification script
    ├── .env.example
    └── README.md                              # Meta Graph API & WAHA Docker setup guide
```

---

## 4. Test Accounts & Demo Credentials

Pre-configured accounts for instant grading and evaluation:

| Role | Email | Password | Notable Attributes |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@califnco.com` | `Califnco@Admin2026` | Full administrative privileges, order status dispatch, dealer verification |
| **Approved Dealer** | `apex.purifiers@gmail.com` | `DealerPass@2026` | Apex Water Solutions Pvt Ltd (GSTIN: `27AADCA1234F1Z5`), active wholesale pricing |
| **Pending Dealer** | `shree.enterprises.ro@outlook.com`| `DealerPass@2026`| Shree Aqua Enterprises (GSTIN: `24AAECS9876Q1Z2`), wholesale prices locked |
| **Retail Customer**| `ananya.iyer@gmail.com` | `CustomerPass@2026`| Customer retail catalog pricing, referral code `ANANYA77`, ₹500 wallet balance |

---

## 5. Start & Local Execution

### 5.1 Prerequisites
- Node.js v18+ (tested on Node v22)
- npm v10+

### 5.2 Running the Web Admin Panel (Next.js)
```bash
cd admin
npm install
npm run dev
```
Open `http://localhost:3000` in your browser. Log in using `admin@califnco.com` / `Califnco@Admin2026`.

### 5.3 Running the Android Mobile App (Expo)
```bash
cd mobile
npm install
npx expo start
```
- Press `a` to open in Android Studio Emulator.
- Or scan the QR code using **Expo Go** on an Android phone.

### 5.4 Running Database Seeder
```bash
node firebase/seeds/seed.js
```
Loads 52 water purifier products and 10 categories.

### 5.5 Running the AI Instagram Automation Dry-Run
```bash
node automation/dry_run_test.js
```
Executes all 5 verification steps (Google Sheets parser, zero-hallucination compliance check, AI studio image prompt generation, Meta Graph container formatting, and state update).

---

## 6. Detailed Feature Highlights

### 6.1 Catalog of 52 Realistic Water Purifier Products
The catalog in `firebase/seeds/products.json` features complete water purification items:
- **Domestic RO Systems:** Aquaflow Copper Prime RO 12L, HydroShield Alkaline Pro 10L, PureStream Smart IoT Under-Sink RO 15L, CrystalCompact Wall-Mount 8L, Non-electric Gravity UF 18L.
- **Commercial RO Plants:** HydroMax 50 LPH Twin Membrane, 100 LPH Fully Automatic FRP Skid, CafePure 25 LPH Direct Flow, Institutional 250 LPH Plant.
- **Water Dispensers:** ArcticFlow Floor-Standing Hot & Cold 14L, Tabletop Instant Heat Touch Dispenser 6L, Touchless Proximity Sensor Dispenser 10L.
- **Booster Pumps:** Kemflo 75 GPD 24V DC, BNQS 100 GPD 36V, E-Chen 300 GPD Commercial Diaphragm, 24V 2.5A SMPS Power Drivers.
- **RO Membranes:** Dow Filmtec 75 GPD TFC, Vontron 100 GPD High Recovery, Toray 300 GPD Commercial, CSM 80 GPD.
- **Filter Cartridges:** 5 Micron Spun Polypropylene (Pack of 4), 100% Coconut Shell GAC 10", Extruded CTO Block, Antibacterial Silver Post-Carbon, 0.01 Micron Capillary UF.
- **Minerals & UV:** Bio+ Alkaline Mineralizer (pH 8.5+), PureCopper Active Infusion, Philips 11W 4-Pin UV Lamp, SS304 UV Barrel, Electronic Ballast.
- **Spares & Fittings:** 24V Solenoid Cutoff Valves, 18-sec Auto-Flush FR Valves, NSF Food-grade LLDPE Tubing (100m Roll), Push-Fit Quick Connect Equal Elbows (Pack of 20), LPS & HPS switches, Float valves.
- **Testing Kits:** Digital Pocket TDS & Temperature Meter (0-9990 ppm), Water Electrolyzer Purity Rods, pH Colorimetric Liquid Indicator, Total Hardness Titration Drops.

### 6.2 Tiered Dealer Wholesale Engine
- **Wholesale Price Separation:** Every product stores customer `retailPrice` and dealer `wholesalePrice`.
- **Approval Gate:** Dealer registrations require Admin approval. Unapproved dealers see regular retail prices until reviewed.
- **Bulk MOQ:** Enforces Minimum Order Quantities (e.g. 5 or 10 units for filter cartridges and membranes) when purchasing wholesale.
- **Full Consistency:** Applied wholesale prices reflect consistently across catalog cards, image detail sheets, shopping cart, checkout receipts, and historical invoices.

### 6.3 Free OpenStreetMap Location Solution
- Replaces paid Google Maps APIs with OpenStreetMap Nominatim.
- Live forward and reverse geocoding with instant preset delivery hubs across Indian metropolitan areas (Bengaluru, Mumbai, Delhi, Surat, Hyderabad).

### 6.4 Razorpay Test Mode & Signature Verification
- Fully integrates test key `rzp_test_...` for test cards and UPI.
- Server-side HMAC-SHA256 signature verification simulates genuine backend validation.
- Interactive Simulator toggle on Checkout to test both **Payment Success** and **Payment Failure** states without altering production code.

### 6.5 Scheduled AI Instagram & WAHA Automations
- Importable n8n workflow `automation/instagram_daily_product_workflow.json`.
- Strict prompt rules: zero fabricated warranties or certifications; only verified specifications.
- WAHA workflow `automation/waha_whatsapp_status_workflow.json` for publishing daily product images and pricing to WhatsApp Status.

### 6.6 App Polish & Bonus Additions
- **Theme Engine:** Complete Dark Mode & Light Mode support with persistent AsyncStorage preference.
- **Image Lightbox:** Interactive modal zoom and multi-angle product carousel.
- **Referral System:** Generates unique user referral codes, awards ₹250 wallet credits on registration, and deducts discounts on checkout with abuse prevention.

---
