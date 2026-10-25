# Califnco Round 1 Technical Assignment — Implementation Plan

**Author:** Senior Full-Stack & Mobile Architecture Team  
**Date:** 24 October 2026  
**Target Completion:** Prior to 25 October 2026, 11:59 PM IST  

---

## 1. System Architecture & Tech Stack

```
                                    +-----------------------------------------+
                                    |         Califnco Water Ecosystem        |
                                    +-----------------------------------------+
                                                         |
         +-----------------------------------------------+-----------------------------------------------+
         |                                               |                                               |
         v                                               v                                               v
+-----------------------+                    +-----------------------+                    +-----------------------+
|  Expo Android Mobile  |                    |  Next.js Admin Panel  |                    |  n8n AI Automation    |
|   (Customer & Dealer) |                    |  (Web / Responsive)   |                    | (Instagram & WAHA)    |
| - React Native / TS   |                    | - Next.js 14 / TS     |                    | - Scheduled Cron Node |
| - NativeWind / CSS    |                    | - Tailwind CSS        |                    | - Google Sheets API   |
| - OpenStreetMap Map   |                    | - Lucide React        |                    | - Gemini/OpenAI API   |
| - Razorpay Test SDK   |                    | - Vercel Deployable   |                    | - Meta Graph API      |
| - Light / Dark Mode   |                    | - Real-time Firestore |                    | - WAHA Status API     |
+-----------------------+                    +-----------------------+                    +-----------------------+
         |                                               |                                               |
         +-----------------------+-----------------------+-----------------------------------------------+
                                 |
                                 v
               +-----------------------------------+
               |    Firebase Backend Services      |
               | - Firebase Authentication         |
               | - Cloud Firestore (Atomic Txns)   |
               | - Cloud Storage (Images/Docs)     |
               | - Security Rules & Indexes        |
               +-----------------------------------+
```

---

## 2. Directory Structure

```text
/
├── .env.example                       # Root environment variable blueprint
├── README.md                          # Comprehensive project overview and runbook
├── docs/
│   ├── REQUIREMENTS.md               # Complete requirements specification
│   ├── IMPLEMENTATION_PLAN.md        # This architectural blueprint
│   ├── PROGRESS.md                   # Real-time task checklist & milestones
│   ├── TESTING.md                    # Verification instructions & test logs
│   ├── DEPLOYMENT.md                 # Vercel & Expo build guides
│   └── DEMO_SCRIPT.md                # Step-by-step evaluation walkthrough
├── mobile/                            # Android E-Commerce App (React Native + Expo)
│   ├── src/
│   │   ├── api/                      # Firebase & external service clients
│   │   ├── components/               # UI components (ProductCard, Lightbox, etc.)
│   │   ├── context/                  # AuthContext, CartContext, ThemeContext
│   │   ├── navigation/               # RootNavigator, CustomerNav, DealerNav
│   │   ├── screens/                  # Home, Catalog, Details, Cart, Checkout, etc.
│   │   ├── services/                 # Payment, OpenStreetMap geocoding, Push
│   │   ├── types/                    # TypeScript interfaces & domain models
│   │   └── utils/                    # Price formatters, referral generator, validators
│   ├── assets/                       # App icons, splash, fallback graphics
│   ├── app.json                      # Expo application manifest
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── admin/                             # Web Admin Portal (Next.js 14 + Tailwind)
│   ├── src/
│   │   ├── app/                      # Next.js App Router (dashboard, orders, etc.)
│   │   ├── components/               # Sidebar, StatsCard, StatusBadge, DataTables
│   │   ├── lib/                      # Firebase Admin/Client initialization
│   │   └── types/                    # Shared Admin domain types
│   ├── public/                       # Static branding assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.example
├── firebase/                          # Backend Security & Data Seeding
│   ├── firestore.rules               # Enterprise-grade RBAC rules
│   ├── firestore.indexes.json        # Query indexes
│   ├── firebase.json                 # Firebase CLI & emulator configuration
│   └── seeds/
│       ├── products.json             # 50+ realistic water purification items
│       └── seed.ts                   # Automated database populator script
└── automation/                        # Scheduled AI Publishing Workflows
    ├── instagram_daily_product_workflow.json  # Importable n8n workflow
    ├── waha_whatsapp_status_workflow.json     # WAHA bonus workflow
    ├── sample_catalog_google_sheets.csv      # Sample catalog dataset
    ├── dry_run_test.js                       # Autonomous runner for verification
    ├── .env.example
    └── README.md                             # Setup guide for Meta & WAHA APIs
```

---

## 3. Data Schema (Cloud Firestore)

### 3.1 `users` Collection
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: 'customer' | 'dealer' | 'admin';
  dealerStatus?: 'pending' | 'approved' | 'rejected';
  dealerDetails?: {
    companyName: string;
    gstin: string;
    tradeLicense: string;
    yearsInBusiness: number;
    billingAddress: string;
    appliedAt: number;
    approvedAt?: number;
  };
  referralCode: string;
  referredBy?: string;
  walletBalance: number; // in INR for referral credits
  createdAt: number;
  updatedAt: number;
}
```

### 3.2 `products` Collection (>= 50 Products)
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'purifier_domestic' | 'purifier_commercial' | 'dispenser' | 'pumps' | 'cartridges' | 'membranes' | 'spare_parts' | 'testing_kits';
  categoryLabel: string;
  brand: string;
  description: string;
  retailPrice: number;       // Customer MRP (INR)
  wholesalePrice: number;    // Approved Dealer Price (INR, ~25-45% off)
  minOrderQuantity: number;  // 1 for customer, bulk minimum for dealer
  stockQuantity: number;
  images: string[];
  thumbnail: string;
  specifications: Record<string, string>; // e.g. "Purification Capacity": "15 L/hr"
  rating: number;
  reviewCount: number;
  featured: boolean;
  isActive: boolean;
  createdAt: number;
}
```

### 3.3 `orders` Collection
```typescript
interface Order {
  id: string;
  orderNumber: string;        // e.g. "ORD-2026-98124"
  userId: string;
  userRole: 'customer' | 'dealer';
  userEmail: string;
  userName: string;
  userPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    productThumbnail: string;
    unitPrice: number;        // Captured historical price (retail or wholesale)
    quantity: number;
    totalPrice: number;
  }>;
  subtotal: number;
  gstAmount: number;          // 18% GST
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  paymentMethod: 'razorpay' | 'cod' | 'dealer_credit';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: Array<{
    status: string;
    timestamp: number;
    note?: string;
  }>;
  createdAt: number;
  updatedAt: number;
}
```

### 3.4 `serviceBookings` Collection
```typescript
interface ServiceBooking {
  id: string;
  ticketNumber: string;       // e.g. "SRV-2026-0045"
  userId: string;
  userName: string;
  userPhone: string;
  serviceType: 'installation' | 'maintenance' | 'repair' | 'filter_replacement';
  purifierBrand: string;
  purifierModel?: string;
  issueDescription: string;
  preferredDate: string;
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening';
  serviceAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    pincode: string;
  };
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTechnician?: {
    name: string;
    phone: string;
    assignedAt: number;
  };
  technicianNotes?: string;
  createdAt: number;
  updatedAt: number;
}
```

---

## 4. Phased Implementation Roadmap

### Phase 1: Workspace Initialization & Documentation
- Read and index all requirements.
- Create `docs/REQUIREMENTS.md`, `docs/IMPLEMENTATION_PLAN.md`, and `docs/PROGRESS.md`.
- Establish clean directory hierarchy (`mobile`, `admin`, `automation`, `firebase`, `docs`).

### Phase 2: Core Data Seeding & Firebase Backend
- Author `firebase/seeds/products.json` with 50+ authentic water purifier units, accessories, and replacement parts with realistic specs and pricing.
- Configure `firestore.rules` for strict role-based isolation.
- Build automated seeding script for local / emulator / live environments.

### Phase 3: Android Mobile App Development (React Native / Expo)
- Setup Expo TypeScript application with custom navigation.
- Implement ThemeContext (Light & Dark mode support).
- Build Auth screens (Login, Customer Register, Dealer Register with GSTIN, Forgot Password).
- Build Home Screen with categories, banner slider, featured items, and quick service links.
- Build Catalog Screen with search, multi-category chips, price/stock filters, and sorting.
- Build Product Details Screen with Lightbox Image Zoom, specification tables, and stock counter.
- Build Cart Screen with persistent storage, dynamic GST, and minimum order quantity enforcement for dealers.
- Build OpenStreetMap address selector using free Nominatim reverse-geocoding.
- Implement Razorpay Test Mode checkout with HMAC verification simulator.
- Build Order History & Order Details screens with live status badges.
- Build Service Booking module with slot selector and ticket tracker.
- Build Profile & In-App Notification Center.
- Implement referral code sharing and discount redemption logic.

### Phase 4: Web Admin Panel (Next.js 14 + Tailwind CSS)
- Setup Next.js App Router project with responsive dashboard layout.
- Secure Admin Authentication with Firestore role verification (`role === 'admin'`).
- Dashboard with key performance metrics (Orders, Revenue, Dealer Applications, Service Tickets).
- Orders Management: search, status filter, order inspector, and status updater.
- Dealer Applications: GSTIN review, business inspection, Approve & Reject triggers.
- Inventory & Product Management: Add, Edit, Delete, Stock update, Wholesale pricing configuration.
- Field Service Management: Ticket queue, technician assignment, status progression.
- Customer & Dealer database overview.

### Phase 5: AI Instagram Automation & WAHA Status Integration
- Construct n8n Workflow JSON:
  - Daily Schedule Cron trigger.
  - Google Sheets reader parsing next unposted product.
  - LLM Prompt template (verified specifications, zero hallucinations, engaging emojis & hashtags).
  - AI Image generation node (DALL-E 3 / Pollinations API).
  - Public HTTPS image staging.
  - Meta Instagram Graph API container creation & publishing nodes.
  - Google Sheets state update marking post ID and timestamp.
  - Error fallback and alerting.
- Build offline dry-run test script (`automation/dry_run_test.js`) verifying the entire generation and schema pipeline.
- Implement WAHA WhatsApp Status automation workflow and technical capability analysis.

### Phase 6: Testing, Polish, & Verification
- Compile and type-check `mobile` and `admin` codebases.
- Verify role switching: Customer retail vs. Dealer wholesale pricing.
- Validate Firestore Security Rules against unauthorized access.
- Test referral validation and abuse prevention.
- Check responsive layouts on both mobile and desktop screen sizes.

### Phase 7: Deployment & Documentation Finalization
- Prepare production build configs and deployment steps for Vercel.
- Write master `README.md`, `docs/TESTING.md`, `docs/DEPLOYMENT.md`, and `docs/DEMO_SCRIPT.md`.
- Final audit against all assignment criteria.
