# Califnco Round 1 Technical Assignment — Requirements Specification

**Project:** Android E-Commerce Water Purifier Application & Ecosystem  
**Target Roles:** Customer, Dealer, Admin  
**Deadline:** 25 October 2026, 11:59 PM IST  

---

## 1. Executive Summary
This project is an end-to-end, enterprise-grade e-commerce and field-service ecosystem built for the water purifier industry. It comprises:
1. **Android E-Commerce Mobile App** (React Native, Expo, TypeScript, Tailwind/NativeWind style, Firebase Auth & Firestore).
2. **Web Admin Panel** (Next.js 14/15, React, TypeScript, Tailwind CSS, Lucide icons, responsive for desktop and mobile browsers, deployed to Vercel).
3. **Firestore Backend & Security Rules** (Role-based access control, atomic transaction updates, inventory locking).
4. **Payment Gateway Integration** (Razorpay Test Mode with server-side HMAC-SHA256 signature verification).
5. **Location & Maps Integration** (Free OpenStreetMap / Nominatim geocoding & reverse geocoding without credit-card requirements).
6. **Multi-Channel Notifications** (In-app notification system, Firebase Cloud Messaging push structure, Email/SMS notification dispatch architectures).
7. **Scheduled AI Automation** (n8n workflow, Google Sheets catalog synchronization, AI marketing caption generator, AI image pipeline, Instagram Graph API publishing, deduplication, error handling, dry-run test mode).
8. **Bonus Features**:
   - WAHA WhatsApp Status publishing workflow (+10).
   - App Polish (+5): Light/Dark mode, Product Image Zoom / Lightbox modal, Smooth animations, Referral code engine with abuse prevention.

---

## 2. Mandatory Core Requirements

### 2.1 Android Mobile Application (Expo & React Native)
- **Framework & Language:** React Native via Expo SDK, TypeScript, functional components with typed hooks.
- **State Management & Persistence:** Context API / Zustand / AsyncStorage for persistent user session, cart, and theme preferences.
- **Design System:** Professional water purification theme (Clean cyan/blue, emerald accents, dark slate typography), supporting Dark Mode.

#### A. Authentication & User Onboarding
- Email/Password Registration with form validation (Name, Email, Phone, Password, Role).
- Secure Login & persistent auth token management via Firebase Authentication.
- Password Recovery / Reset flow via Firebase Auth.
- Role segregation: Customer vs. Dealer vs. Admin.
- Referral code input during registration with validation & bonus credits.

#### B. Customer Experience & Catalog
- **Catalog Density:** At least 50 realistic water purifier products spanning:
  1. Domestic RO / UV / UF Water Purifiers
  2. Commercial & Industrial RO Plants
  3. Alkaline & Copper Water Purifiers
  4. Hot & Cold Water Dispensers
  5. Booster Pumps & Diaphragm Pumps
  6. Sediment, Carbon, & Post-Carbon Filter Cartridges
  7. RO Membranes (75 GPD, 100 GPD, 300 GPD, 400 GPD)
  8. Mineral Cartridges & UV Lamps
  9. Tubing, Connectors, Valves, SMPS Power Adapters, & Float Switches
  10. TDS Meters, Electrolyzers, & Water Test Kits
- **Product Details:** High-resolution product images, realistic descriptions, key specifications (Capacity, Filtration stages, Membrane life, Power consumption), stock availability, customer retail price (INR), and rating.
- **Search, Filtering & Sorting:**
  - Real-time instant search by product title, brand, category, or spare part code.
  - Multi-category filter pills.
  - Price range, rating, and in-stock filters.
  - Sort by: Price (Low to High, High to Low), Popularity, Highest Rated, Newest.
- **Product Details Page:**
  - Multi-angle image gallery with interactive Image Lightbox / Zoom.
  - Product specifications sheet.
  - Live stock level indicator.
  - Quantity selector (1 to available stock).
  - Add to Cart with toast feedback.
  - Related product recommendations.

#### C. Shopping Cart & Checkout
- **Cart Management:**
  - Persistent cart state across app relaunches.
  - Increase / decrease quantity or remove items.
  - Price subtotal, GST calculation (18% standard for water treatment equipment), delivery charges (free tier above threshold), and final payable amount.
- **OpenStreetMap Location & Address Selection:**
  - Add/Edit shipping addresses.
  - Interactive OpenStreetMap location picker / Nominatim address search without requiring paid Google Maps API keys.
  - Save multiple addresses (Home, Office, Factory) with default selection.
- **Razorpay Test Mode Integration:**
  - Standard test checkout flow.
  - Test credentials (`rzp_test_...`).
  - Handling of `payment.success` and `payment.failed`.
  - Signature verification using Razorpay Secret (`HMAC-SHA256`).
  - Idempotent order placement preventing duplicate charges.
- **Order Confirmation & Tracking:**
  - Instant order receipt display.
  - Order details screen showing item snapshots, pricing, delivery address, timestamp, payment method, and live status badge (`pending` -> `confirmed` -> `processing` -> `shipped` -> `delivered`).

#### D. Field Service Booking
- Water purifier installation, periodic preventive maintenance, filter replacement, and emergency breakdown repair.
- Date and time slot picker.
- Appliance brand/model input and issue description.
- Tracking service ticket lifecycle with assigned technician information.

#### E. Customer Profile & In-App Notifications
- Profile management (name, phone, default address).
- In-app notification center: notifications for order updates, service updates, promotional announcements.
- Firebase Cloud Messaging push token registration.

---

### 2.2 Dealer Role Requirements
- **Dealer Registration & Verification Flow:**
  - Dedicated Dealer application form requesting Company/Shop Name, GSTIN number, Trade License number, Years in business, and Address.
  - Account state initially set to `dealer_status: "pending"`.
  - Dealer cannot purchase at wholesale pricing until `dealer_status: "approved"` by Admin.
- **Tiered Wholesale Pricing:**
  - Catalog displays both Retail MRP and discounted Dealer Wholesale Price (e.g. 25-45% off retail).
  - Minimum Order Quantity (MOQ) enforcement per item (e.g. MOQ of 5 or 10 units for filter cartridges, membranes, and fittings).
  - Wholesale pricing automatically applied in cart, checkout, and order history for approved dealers.
  - Unapproved dealers see regular customer prices or pending approval notice.
- **Dealer Order Management:**
  - Bulk order placement with GST invoice breakdown.
  - Separate Dealer order history and re-order functionality.
- **Server-Side Authorization & Firestore Security:**
  - Dealer prices and discount permissions validated on the backend.
  - Firestore security rules strictly guarding dealer records.

---

### 2.3 Web Admin Panel (Next.js & TypeScript)
- **Framework:** Next.js (App Router), TypeScript, Tailwind CSS, Lucide React icons.
- **Authentication:** Dedicated Admin credentials verified against Firebase Auth and Firestore `users` collection (`role: "admin"`).
- **Dashboard:**
  - Key business metrics: Total Revenue, Total Orders, Active Products, Pending Dealer Applications, Active Service Tickets.
  - Quick access alerts and recent orders table.
- **Orders Management:**
  - Comprehensive listing of all Customer and Dealer orders.
  - Filter by order status (`all`, `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`), role, date.
  - Order details view with item breakdown, customer information, shipping address, payment status.
  - Status transition controls that write directly to Firestore and trigger customer notifications.
- **Dealer Management:**
  - View all dealer applications with GSTIN, business name, and submitted details.
  - One-click "Approve" or "Reject" actions updating Firestore.
- **Product & Inventory Management:**
  - Full CRUD: Add product, edit product, delete/archive product.
  - Fields: Title, Category, Description, Customer Price, Dealer Wholesale Price, Stock Quantity, Minimum Order Quantity, Image URL, Specifications.
  - Low stock visual indicators.
- **Field Service Booking Management:**
  - View all service requests (Installation, Maintenance, Repair).
  - Assign technician name and scheduled date.
  - Update status (`pending`, `assigned`, `in_progress`, `completed`, `cancelled`).
- **User & Customer Management:**
  - View registered customers, dealers, and staff.
  - View order histories per user.

---

### 2.4 Firebase Backend Architecture & Security Rules
- **Data Collections:**
  - `users/{uid}`: Profile, role (`customer`, `dealer`, `admin`), dealerStatus (`pending`, `approved`, `rejected`), gstin, referralCode.
  - `products/{productId}`: Name, slug, category, description, retailPrice, wholesalePrice, stock, minOrderQuantity, imageUrl, images, specs.
  - `categories/{categoryId}`: Name, icon, description, sortOrder.
  - `orders/{orderId}`: OrderId, userId, role, items array, subtotal, gst, deliveryFee, total, shippingAddress, paymentDetails, status, timestamps.
  - `serviceBookings/{serviceId}`: UserId, serviceType, address, preferredDate, preferredSlot, purifierModel, issueDescription, status, assignedTechnician.
  - `notifications/{notificationId}`: RecipientUserId (or "all"), title, message, type, isRead, createdAt.
  - `dealerApplications/{appId}`: Application metadata, company, GSTIN, documents, review status.
- **Firestore Security Rules:**
  - Strict role-based read/write rules.
  - Customers can only read and write their own profile, cart, and orders.
  - Public can read published products and categories.
  - Only Admins can create/update/delete products, modify order statuses, and review dealer applications.
  - Atomic transactions for order placement ensuring inventory decrement.

---

### 2.5 Payments, Notifications, Maps & Images
- **Razorpay Test Mode:**
  - Test Key & Secret integration.
  - Signature validation endpoint using crypto HMAC SHA256.
  - Realistic handling of successful test payments and failed attempts.
- **Notification Services:**
  - In-app notification center stored in Firestore.
  - Push notification token registration via FCM.
  - Architectural hooks for Email (Nodemailer/Resend) and SMS (Twilio/Fast2SMS).
- **Free Maps (OpenStreetMap):**
  - Leaflet / Nominatim forward & reverse geocoding without credit cards or paid Google APIs.
- **Product Imagery:**
  - 50+ realistic product images from high-uptime CDN resources (Unsplash product collections / verified high-res water purifier imagery) with robust inline SVG fallback for broken URLs.

---

### 2.6 AI Automation: Daily Instagram Product Publishing
- **Schedule:** Automated daily execution (e.g. 10:00 AM IST) via n8n cron node.
- **Data Source:** Google Sheets product catalog with column schema: `Product_ID`, `Product_Name`, `Category`, `Price_INR`, `Key_Features`, `Verified_Facts`, `Status`, `Last_Posted_Date`, `Instagram_Post_ID`.
- **AI Marketing Copy:** Generation of high-converting, professional marketing captions using Gemini / OpenAI API with strict guidelines (no hallucinated warranties, only verified specs, relevant hashtags).
- **AI Image Pipeline:** Image generation via DALL-E 3 / Pollinations / Stability AI or high-res product composite.
- **Meta Instagram Graph API:**
  - Container creation endpoint: `POST https://graph.facebook.com/v19.0/{ig_user_id}/media`.
  - Publishing endpoint: `POST https://graph.facebook.com/v19.0/{ig_user_id}/media_publish`.
- **Deduplication & State Management:** Updating Google Sheets row status to `PUBLISHED` with post timestamp and Instagram media ID.
- **Error Handling & Dry-Run Mode:**
  - Standalone Node.js / TypeScript dry-run verification script.
  - Exported n8n workflow JSON (`automation/instagram_daily_product_workflow.json`).
  - Graceful fallback and error notifications.

---

## 3. Bonus Requirements

### 3.1 WhatsApp Status Automation via WAHA (+10 Points)
- Exploration of WAHA (WhatsApp HTTP API) Docker container.
- Investigating the `POST /api/{session}/status/text` and `POST /api/{session}/status/image` endpoints.
- Workflow export & Node.js test script for WAHA daily product status broadcasting.
- Documented session requirements, pairing process, dedicated secondary phone number best practices, and honest assessment of WhatsApp anti-spam policies.

### 3.2 Mobile App Polish (+5 Points)
- **Theme Toggle:** Dynamic Light & Dark Mode support with persistence.
- **Product Zoom:** Lightbox image modal with pinch-to-zoom / tap-to-expand.
- **Smooth Animations:** Native animations using React Native Reanimated / Animated API.
- **Referral System:** Generate referral codes for users, give discounts on checkout upon successful redemption, prevent self-referral and duplicate use.

---

## 4. Verification & Submission Criteria
- Complete source code for `mobile/`, `admin/`, `automation/`, `firebase/`, `docs/`.
- No hardcoded production secrets (`.env.example` provided for all packages).
- Comprehensive end-to-end documentation in `README.md`.
- Executable demo script covering Customer, Dealer, Admin, and Automation workflows.
- Clean build checks and zero critical TypeScript errors.
