# Califnco Round 1 Technical Assignment — Progress Tracker

**Current Date:** 24 October 2026  
**Status Legend:**
- [x] Completed
- [/] In Progress
- [ ] Pending

---

## Milestone Checklist

### 1. Planning & Setup
- [x] Inspect workspace and requirements.
- [x] Author `docs/REQUIREMENTS.md`.
- [x] Author `docs/IMPLEMENTATION_PLAN.md`.
- [x] Author `docs/PROGRESS.md`.
- [x] Setup project folder structure (`mobile`, `admin`, `automation`, `firebase`, `docs`).
- [x] Create root `.env.example`.
- [x] Create root `.gitignore`.

### 2. Backend & Firestore Security
- [x] Author `firebase/seeds/products.json` with 52 realistic water purifier products & accessories.
- [x] Author `firebase/seeds/categories.json` with 10 industry categories.
- [x] Implement database seeding script (`firebase/seeds/seed.js`). Tested & validated with 52 items loaded.
- [x] Author `firebase/firestore.rules` (Strict RBAC, atomic order placement, customer data isolation, dealer protection).
- [x] Author `firebase/firestore.indexes.json`.
- [x] Author `firebase/firebase.json` for emulator & CLI setup.

### 3. Android Mobile Application (Expo & React Native)
- [x] Initialize Expo project with TypeScript configuration (`mobile/package.json`, `mobile/tsconfig.json`, `mobile/app.json`).
- [x] Configure ThemeContext (Light & Dark mode support with persistence) [Bonus: App Polish].
- [x] Implement AuthContext with Customer, Approved Dealer, and Pending Dealer modes.
- [x] Implement CartContext with persistent storage, dynamic 18% GST, shipping logic, referral deduction, and wholesale MOQ enforcement.
- [x] Customer Screens:
  - [x] Home Screen (Hero banners, categories chips, featured purifiers, quick service booking banner, trust badges).
  - [x] Catalog Screen (52 items, instant keyword search, category filters, sorting by price/rating, stock filter).
  - [x] Product Details (Multi-image gallery, interactive Image Lightbox / Zoom, specs, quantity counter, Add-to-Cart) [Bonus: Lightbox Zoom].
  - [x] Cart Screen (Persistent storage, quantity adjustments, item removal, 18% GST calculation, shipping breakdown).
  - [x] Delivery Address & Free OpenStreetMap location integration (Nominatim geocoding & Indian hub presets).
  - [x] Checkout & Razorpay Test Mode integration (HMAC signature verification flow + Test Result Simulator for success & failure).
  - [x] Order Confirmation & Order Success receipt screen.
  - [x] Order History screen with real-time status tracking.
  - [x] Order Detail screen with 5-stage fulfillment stepper and audit history.
  - [x] Service Booking (Installation, Maintenance, Repair with date/slot picker & ticket generation).
  - [x] Service History screen with technician assignment display.
  - [x] Profile Screen (Account details, referral code sharing & wallet balance, evaluator role switcher).
  - [x] In-App Notification Center.
- [x] Dealer Experience:
  - [x] Pending approval gate for unapproved dealers.
  - [x] Wholesale pricing tier visible across catalog, details, cart, and checkout.
  - [x] Bulk Minimum Order Quantity (MOQ) validation.
  - [x] Dealer order history with GST invoice view.
- [x] Polish & Bonus Features:
  - [x] Dark Mode toggle & UI palette [Bonus].
  - [x] Product image lightbox zoom [Bonus].
  - [x] Referral code engine with ₹250 wallet bonus on registration and abuse prevention [Bonus].
- [x] Clean TypeScript check across mobile: `npx tsc --noEmit` **PASSED with 0 errors**.

### 4. Web Admin Panel (Next.js 14 + Tailwind CSS)
- [x] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS (`admin/package.json`, `admin/tailwind.config.ts`, `admin/next.config.mjs`).
- [x] Admin Login with Firebase role verification (`role === 'admin'`).
- [x] Dashboard View:
  - [x] Total Sales, Total Orders, Pending Dealer Applications, Active Service Requests.
  - [x] Low stock alert banner (< 15 units).
  - [x] Quick activity feeds and recent dispatches table.
- [x] Orders Management (`/orders`):
  - [x] Filterable & searchable order table.
  - [x] Detailed order drawer/modal (items snapshot, address, customer details, payment info).
  - [x] Status update actions (`pending` -> `confirmed` -> `processing` -> `shipped` -> `delivered` -> `cancelled`).
- [x] Dealer Applications (`/dealers`):
  - [x] Pending applications list with GSTIN, business profile.
  - [x] One-click Approve or Reject with instant dataStore & Firestore updates.
- [x] Products & Inventory Management (`/products`):
  - [x] Product list with search and category filters.
  - [x] Add/Edit product modal (names, retail price, wholesale price, stock, specs, images).
  - [x] On-the-fly stock quick editor.
- [x] Field Service Management (`/services`):
  - [x] Service ticket list with status filters.
  - [x] Assign technician dialog (engineer name, phone, notes) and update ticket status.
- [x] Users Directory (`/users`):
  - [x] Account directory of customers, dealers, and staff with role badges and wallet balances.
- [x] Production build validation: `next build` **PASSED (10/10 static pages compiled with zero errors)**.

### 5. AI Automation: Daily Instagram Publishing
- [x] Design and export complete n8n workflow (`automation/instagram_daily_product_workflow.json`).
- [x] Author sample Google Sheets catalog (`automation/sample_catalog_google_sheets.csv`).
- [x] Implement AI caption prompt ensuring zero hallucination of warranties/certifications.
- [x] Implement AI image generation pipeline & public HTTPS hosting integration.
- [x] Build Meta Instagram Graph API publishing node configuration.
- [x] Author autonomous dry-run verification script (`automation/dry_run_test.js`). **100% PASS RATE achieved**.
- [x] Provide comprehensive `.env.example` and step-by-step Meta setup instructions in `automation/README.md`.

### 6. WhatsApp Status Automation via WAHA (Bonus +10)
- [x] Investigate WAHA (WhatsApp HTTP API) Docker container capabilities.
- [x] Design n8n workflow (`automation/waha_whatsapp_status_workflow.json`).
- [x] Document endpoint support, QR session pairing, dedicated secondary number requirements, and anti-spam best practices.

### 7. Testing, Verification, & Documentation
- [x] Background package installation and build checks (`admin`, `mobile`) **PASSED**.
- [x] Author master `README.md`.
- [x] Author `docs/TESTING.md`.
- [x] Author `docs/DEPLOYMENT.md`.
- [x] Author `docs/DEMO_SCRIPT.md`.
- [x] Final submission readiness audit **COMPLETE**.
