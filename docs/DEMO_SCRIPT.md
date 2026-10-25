# Califnco Round 1 Technical Assignment — Live Demonstration Script

This demo script provides an evaluator with an exact 5-minute walkthrough covering:
1. **Customer E-Commerce Experience**
2. **Dealer Wholesale Experience & Verification Gate**
3. **Web Admin Console & Status Dispatch**
4. **AI Instagram & WAHA Automations**

---

## Act 1: The Retail Customer Journey (1.5 Minutes)

### 1.1 Home & 52-Product Catalog Exploration
- **Action:** Open the Califnco Android App.
- **Highlight:** Clean water purification theme (cyan/emerald palette), dark mode support, promotional banner, and quick service shortcuts.
- **Action:** Tap the **Catalog** tab.
- **Highlight:** Scroll through 52 realistic water purifiers, commercial RO skids, dispensers, booster pumps, cartridges, and spare parts.
- **Action:** Type `"Copper"` in search, then filter by category `"Domestic RO"`.
- **Result:** Instant real-time filtering to *Aquaflow Copper Prime RO 12L*.

### 1.2 Interactive Lightbox & Persistent Cart
- **Action:** Tap *Aquaflow Copper Prime RO 12L*.
- **Action:** Tap the primary photo.
- **Highlight:** The **Image Lightbox** opens with pinch/zoom support and multi-angle photo slides.
- **Action:** Review the specifications sheet (Purification capacity, food-grade ABS tank, wattage).
- **Action:** Tap **Add to Cart**.
- **Action:** Go to **Cart**, input referral code `CALIF500` and tap **Apply**.
- **Result:** Price breakdown shows Subtotal ₹14,999, GST 18% (₹2,699.82), FREE delivery, and -₹500 referral discount -> Total: ₹17,198.82.

### 1.3 Free OpenStreetMap Location & Razorpay Test Checkout
- **Action:** Tap **Proceed to Checkout**.
- **Action:** Tap **Change (OSM)** on the address card.
- **Highlight:** Free OpenStreetMap Nominatim lookup resolves area coordinates without paid Google Maps billing.
- **Action:** Tap **Save Address**.
- **Action:** On Checkout, select **Razorpay (Test Mode)** and tap **Pay via Razorpay**.
- **Result:** Razorpay test transaction executes with HMAC signature verification, redirecting to **OrderSuccessScreen** displaying confirmed order ID (`ORD-2026-XXXXX`).

---

## Act 2: The Dealer Wholesale Experience (1 Minute)

### 2.1 The Pending Approval Gate
- **Action:** In the mobile app, navigate to **Account** -> **Apply as Authorized Wholesale Dealer**.
- **Action:** View the business form requesting Company Name, GSTIN, Trade License, and billing address.
- **Highlight:** Account state is set to `pending`. Wholesale prices remain locked until authorized by Admin, preventing unauthorized discounts.

### 2.2 Tier-1 Wholesale Catalog & Bulk MOQ Enforcement
- **Action:** In Account -> **Evaluator Role Switcher**, tap **"Wholesale Dealer"** (Apex Water Solutions).
- **Highlight:** The top banner switches to green: **APPROVED WHOLESALE DEALER ACTIVE**.
- **Action:** Browse the Catalog:
  - *Filmtec Dow 75 GPD Membrane:* Retail ₹1,950 -> **Dealer Wholesale Price: ₹1,280 (34% OFF)**
  - *5 Micron Sediment Filter (Pack of 4):* Retail ₹599 -> **Dealer Wholesale Price: ₹280 (53% OFF)**
- **Action:** Open *5 Micron Sediment Filter*.
- **Highlight:** Wholesale Minimum Order Quantity (MOQ) of `5 packs` is enforced. Bulk orders calculate dynamic GST breakdown for B2B input tax credits.

---

## Act 3: Web Admin Operations Console (1.5 Minutes)

### 3.1 Overview Dashboard & Live Metrics
- **Action:** Open the Admin web panel at `http://localhost:3000` (or the deployed Vercel URL).
- **Highlight:**
  - Net Revenue in INR
  - Total Orders (Customer vs Dealer)
  - Pending Dealer Applications alert
  - Active Service Tickets count
  - Inventory Replenishment Alert (highlighting items with stock < 15 units).

### 3.2 Real-Time Order Dispatch Lifecycle
- **Action:** Navigate to **Orders** (`/orders`).
- **Action:** Locate the newly placed customer order (`ORD-2026-XXXXX`).
- **Action:** Tap **Inspect**.
- **Action:** Progress status from `pending` -> `confirmed` -> `processing` -> `shipped`.
- **Result:** Status updates in the database, audit trail logs the change, and an instant in-app notification is sent to the customer app.

### 3.3 Dealer Application Review & Approval
- **Action:** Navigate to **Dealer Applications** (`/dealers`).
- **Action:** Review *Shree Aqua Enterprises* (GSTIN: `24AAECS9876Q1Z2`).
- **Action:** Tap **Approve & Unlock Wholesale**.
- **Result:** Status changes to `approved`, dealer's account is promoted, and an approval notification is dispatched.

### 3.4 Product Catalog Management & Service Dispatch
- **Action:** Navigate to **Products & Inventory** (`/products`).
- **Action:** Tap **Add New Product** and adjust wholesale vs. retail margins.
- **Action:** Navigate to **Service Bookings** (`/services`).
- **Action:** Assign a certified field engineer to an installation ticket. Customer mobile app receives technician details immediately.

---

## Act 4: Scheduled AI Instagram & WAHA Automations (1 Minute)

### 4.1 Autonomous Dry-Run Test
- **Action:** Run the command in terminal:
  ```bash
  node automation/dry_run_test.js
  ```
- **Result:**
  1. Reads next pending water purifier from Google Sheets (`sample_catalog_google_sheets.csv`).
  2. Synthesizes high-converting Instagram caption strictly enforcing zero hallucinated claims.
  3. Synthesizes AI commercial studio photography prompt with lighting specs.
  4. Formats valid Meta Graph API container payload.
  5. Updates row state to `PUBLISHED` with post ID and timestamp.
  6. Reports **100% PASS RATE**.

### 4.2 n8n Workflow Architecture
- **Highlight:** Open `automation/instagram_daily_product_workflow.json` and `automation/waha_whatsapp_status_workflow.json` demonstrating automated daily scheduling, public image staging, and Meta Graph API publication nodes.
