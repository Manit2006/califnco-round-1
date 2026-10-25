# Califnco Round 1 Technical Assignment — Testing & Quality Assurance Runbook

**Test Target:** Califnco Water Purifier E-Commerce Platform & Automation Ecosystem  
**QA Level:** Enterprise Full-Stack & Mobile Validation  
**Date:** 24 October 2026  

---

## 1. Test Execution Summary

| Domain | Test Suite | Status | Verified Capabilities |
| :--- | :--- | :---: | :--- |
| **Mobile App (Android)** | Customer Journey | **PASSED** | Register, Login, Search 52+ items, Filters, Lightbox Zoom, Persistent Cart, OSM Geocoding, Razorpay Test Checkout |
| **Mobile App (Android)** | Dealer Experience | **PASSED** | Business registration, Pending approval lock, Tier-1 wholesale pricing, Bulk MOQ enforcement |
| **Mobile App (Android)** | Service Operations | **PASSED** | Installation, Maintenance, and Repair booking with date & time slots |
| **Mobile App (Android)** | Polish & Bonus | **PASSED** | Dynamic Dark/Light mode, Referral code validation & ₹250 wallet credits |
| **Web Admin Panel** | Next.js Console | **PASSED** | Dashboard metrics, Order status dispatch, Dealer Approve/Reject, Product CRUD, Technician assignment |
| **Backend & Security** | Cloud Firestore | **PASSED** | Strict RBAC rules, customer data isolation, dealer approval gate, product write lockdown |
| **AI Automation** | Daily Instagram Post | **PASSED** | n8n workflow, fact-checked caption synthesis (zero hallucination), AI studio image prompt, Meta Graph API payload |
| **AI Automation (Bonus)**| WAHA WhatsApp Status| **PASSED** | Status broadcast workflow, QR pairing guide, anti-spam policies |

---

## 2. Customer Journey Verification

### Test 2.1: Authentication & Referral Bonus
1. Launch the mobile application.
2. Navigate to **Customer Registration**.
3. Input name: `Rahul Sharma`, email: `rahul@example.com`, phone: `+91 98765 43210`, password: `Password123`.
4. In the Referral Code field, input `ANANYA77`.
5. Tap **Create Customer Account**.
6. **Expected Result:** Account is initialized in Firestore, and ₹250 referral welcome balance is credited to wallet.

### Test 2.2: Product Catalog & Instant Search
1. Open the **Catalog** tab.
2. Confirm at least 50 realistic products are loaded across all categories:
   - Domestic RO (e.g. *Aquaflow Copper Prime RO 12L*)
   - Commercial RO (e.g. *HydroMax 50 LPH Plant*)
   - Water Dispensers (e.g. *ArcticFlow Floor-Standing 14L*)
   - Booster Pumps (e.g. *Kemflo 75 GPD 24V Pump*)
   - RO Membranes (e.g. *Dow Filmtec 75 GPD Membrane*)
   - Cartridges & Spares (Sediment, Carbon, Solenoid valves, Tubing).
3. Type `"Membrane"` into the search box.
4. **Expected Result:** Instant filtering to 75 GPD, 100 GPD, and 300 GPD RO membrane items.
5. Tap category filter chip **"Booster Pumps"**.
6. **Expected Result:** Catalog dynamically filters to 24V/36V diaphragm pumps and SMPS power supplies.

### Test 2.3: Interactive Image Lightbox & Product Details
1. Tap on *Aquaflow Copper Prime RO+UV+UF+TDS Controller 12L*.
2. Tap the primary image or the **"Tap to Zoom"** button.
3. **Expected Result:** Fullscreen Image Lightbox opens with pinch/zoom support and multi-image carousel thumbnails.
4. Verify the **Verified Technical Specifications** table displaying Purification Capacity, Storage Tank, Max Input TDS, and Power Consumption.

### Test 2.4: Persistent Cart & GST Calculations
1. Tap **Add to Cart** with quantity `1`.
2. Navigate to the **Cart** tab.
3. Verify calculations:
   - **Subtotal:** ₹14,999
   - **GST (18%):** ₹2,699.82
   - **Delivery Fee:** FREE (Subtotal > ₹1,500 threshold)
   - **Total Payable:** ₹17,698.82
4. In the referral code field, input `CALIF500` and tap **Apply**.
5. **Expected Result:** ₹500 discount is deducted, updating total payable to ₹17,198.82.
6. Close and relaunch the app.
7. **Expected Result:** Cart contents, quantities, and applied discount persist seamlessly via AsyncStorage.

### Test 2.5: Free OpenStreetMap Address Selection & Geocoding
1. From Cart, tap **Proceed to Checkout**.
2. Tap **Change (OSM)** on the delivery address card.
3. In the OpenStreetMap search bar, enter `"Indiranagar, Bengaluru"` or tap the quick preset hub **"Bengaluru"**.
4. **Expected Result:** Free Nominatim geocoding returns coordinates (Lat: `12.9716`, Lon: `77.5946`) and autofills city, state, and pincode without requesting paid Google Maps API keys.
5. Tap **Save Address & Select for Checkout**.

### Test 2.6: Razorpay Test Mode Payment & Verification
1. On Checkout, ensure **Razorpay (Test Mode)** is selected.
2. Select **"Simulate Success"** on the test result simulator.
3. Tap **Pay via Razorpay**.
4. **Expected Result:** Razorpay test order is generated, test transaction executes, backend validates HMAC signature (`sig_sha256_...`), and the app navigates to **OrderSuccessScreen** displaying confirmed order ID (`ORD-2026-XXXXX`).

### Test 2.7: Payment Failure Handling
1. Place an item in cart and proceed to Checkout.
2. Under Test Result Simulator, toggle **"Simulate Bank Decline (Failure)"**.
3. Tap **Pay via Razorpay**.
4. **Expected Result:** Payment failure dialog is shown with a clear explanation: *"Payment declined by test card issuing bank (Simulated failure)."* Cart remains intact so the customer can retry or choose Cash on Delivery.

---

## 3. Dealer Experience Verification

### Test 3.1: Dealer Registration & Pending Verification Gate
1. Navigate to Account -> **Apply as Authorized Wholesale Dealer**.
2. Enter business name: `Shree Aqua Enterprises`, GSTIN: `24AAECS9876Q1Z2`, Trade License: `GJ/LIC/2023/1109`, Years: `3`.
3. Tap **Submit Dealer Application for Approval**.
4. **Expected Result:** Application is saved with status `pending`. Wholesale pricing is **not** unlocked yet, strictly enforcing backend policy.

### Test 3.2: Wholesale Catalog Tiered Pricing
1. Switch user to **Approved Wholesale Dealer** (via Account -> Evaluator Role Switcher).
2. Browse the Catalog:
   - *Aquaflow Copper Prime RO:* Retail MRP ₹14,999 -> **Dealer Wholesale Price: ₹9,750 (35% OFF)**
   - *Filmtec Dow 75 GPD Membrane:* Retail ₹1,950 -> **Dealer Wholesale Price: ₹1,280 (34% OFF)**
   - *5 Micron Sediment Filter (Pack of 4):* Retail ₹599 -> **Dealer Wholesale Price: ₹280 (53% OFF)**
3. **Expected Result:** Wholesale discount tags and struck-out retail prices render consistently across Catalog, Product Details, Cart, and Checkout.

### Test 3.3: Minimum Order Quantity (MOQ) Validation
1. Open *5 Micron Sediment Filter (Pack of 4)* as an Approved Dealer.
2. Note the Wholesale MOQ requirement: `5 packs`.
3. Tap **Add to Cart**.
4. **Expected Result:** Cart automatically adds 5 units (the minimum bulk threshold). Decreasing quantity below 5 units is blocked.

---

## 4. Web Admin Panel Verification (Next.js)

### Test 4.1: Secure Admin Login
1. Navigate to `http://localhost:3000/login`.
2. Input credentials: `admin@califnco.com` / `Califnco@Admin2026`.
3. Tap **Sign In to Admin Console**.
4. **Expected Result:** Administrator role verified; redirects to `/` Operations Dashboard.

### Test 4.2: Operations Dashboard Metrics
1. Confirm real-time metric cards:
   - Verified Net Revenue (₹)
   - Total Orders Placed
   - Pending Dealer Applications count
   - Active Service Tickets count
2. Check the **Inventory Replenishment Alert** highlighting items with stock below 15 units.

### Test 4.3: Order Lifecycle Status Progression
1. Navigate to `/orders`.
2. Locate a pending order (e.g. `ORD-2026-98216`).
3. Tap **Inspect**.
4. Tap **Confirm Order** -> status updates to `confirmed`.
5. Tap **Processing** -> packed status saved.
6. Tap **Mark Shipped** -> tracking note recorded.
7. **Expected Result:** Order status changes immediately in dataStore/Firestore, audit history is updated with timestamp, and a customer in-app notification is dispatched.

### Test 4.4: Dealer Application Approval
1. Navigate to `/dealers`.
2. Review pending application for *Shree Aqua Enterprises* (GSTIN: `24AAECS9876Q1Z2`).
3. Tap **Approve & Unlock Wholesale**.
4. **Expected Result:** Status updates to `approved`, dealer's user account is promoted, and an approval notification is dispatched.

### Test 4.5: Product & Inventory CRUD
1. Navigate to `/products`.
2. Tap **Add New Product**.
3. Enter title: `HydroShield Commercial 300 GPD Membrane`, Retail Price: `₹4,200`, Wholesale Price: `₹2,750`, Stock: `50`.
4. Tap **Save Product**.
5. **Expected Result:** New product is saved into the catalog and immediately visible in the Android mobile app.

### Test 4.6: Field Service Technician Assignment
1. Navigate to `/services`.
2. Locate ticket `SRV-2026-0083` (Preventive Maintenance).
3. Tap **Assign Technician**.
4. Enter engineer: `Suresh Sharma (+91 98112 34567)`.
5. Tap **Confirm & Notify Customer**.
6. **Expected Result:** Ticket status updates to `assigned`, and customer receives technician details on their mobile app.

---

## 5. AI Instagram Automation Dry-Run Verification

Run the autonomous test suite:
```bash
node automation/dry_run_test.js
```

### Verification Checklist:
- [x] **Catalog Parser:** Reads 10 product rows from `automation/sample_catalog_google_sheets.csv`.
- [x] **Zero-Hallucination Compliance:** Generated captions strictly feature verified specs (purification rate, tank ABS material, wattage) and contain zero unverified certifications (no NASA, no cure-all claims).
- [x] **AI Studio Photography Prompt:** High-conversion commercial studio prompt generated with lighting and aesthetic specs.
- [x] **Meta Graph API Payload:** Valid container schema prepared for `POST https://graph.facebook.com/v19.0/{ig_user_id}/media`.
- [x] **State Transition:** Row state marked as `PUBLISHED` with timestamp and simulated Instagram media ID.
- [x] **Pass Rate:** 100% (5 of 5 steps completed).

---

## 6. Firestore Security Rules Validation

| Rule Target | Action | Authorized Role | Result |
| :--- | :--- | :--- | :---: |
| `products` | Read | Public / Customer / Dealer | **ALLOW** |
| `products` | Create / Edit / Delete | Customer / Dealer | **DENY** |
| `products` | Create / Edit / Delete | Admin | **ALLOW** |
| `orders` | Read own order | Order Owner | **ALLOW** |
| `orders` | Read other customer's order | Other Customer | **DENY** |
| `orders` | Update status (shipped, delivered) | Customer / Dealer | **DENY** |
| `orders` | Update status | Admin | **ALLOW** |
| `dealerApplications` | Review & Approve | Dealer / Customer | **DENY** |
| `dealerApplications` | Review & Approve | Admin | **ALLOW** |
| `users` | Self-promote to Admin / Dealer | Client request | **DENY** |
