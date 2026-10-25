# Califnco Round 1 Technical Assignment — Deployment & Hosting Guide

This guide covers deployment procedures for all components of the Califnco Water Ecosystem:
1. **Next.js Web Admin Panel** to **Vercel**
2. **Android Mobile App** via **Expo / EAS Build**
3. **Cloud Firestore Backend** security rules and emulator
4. **n8n AI Instagram & WAHA Automations**

---

## 1. Deploying Next.js Admin Panel to Vercel

The Admin panel is built with Next.js 14 (App Router) and is optimized for zero-configuration deployment on Vercel.

### Method A: One-Click Git Deployment (Recommended)
1. Push this repository to GitHub or GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Califnco water ecosystem"
   git remote add origin https://github.com/your-username/califnco-water.git
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import the repository.
4. In the configuration screen:
   - **Root Directory:** Edit and set to `admin`.
   - **Framework Preset:** Next.js.
   - **Build Command:** `next build` (default).
   - **Output Directory:** `.next` (default).
5. Add Environment Variables under **Settings -> Environment Variables**:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=califnco-water.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=califnco-water
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=califnco-water.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:...
   RAZORPAY_KEY_SECRET=rzp_test_secret_here
   ```
6. Click **Deploy**. Vercel will build and assign an active production URL:
   `https://califnco-admin.vercel.app`

### Method B: Vercel CLI Deployment
```bash
cd admin
npx vercel
# Follow prompts to link project and deploy preview
npx vercel --prod
```

---

## 2. Running & Building the Android Mobile App

The mobile application is built with Expo SDK 51 and React Native for Android.

### Running Locally on Physical Android Device or Android Emulator
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. To run on your Android device:
   - Install **Expo Go** from the Google Play Store.
   - Scan the QR code displayed in your terminal.
4. To run on an Android Studio Emulator:
   - Press `a` in the terminal to launch on the active Android Virtual Device (AVD).

### Building Standalone Android APK (EAS Build)
1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure build credentials:
   ```bash
   eas build:configure
   ```
4. Build a standalone installable APK (`preview` profile):
   ```bash
   eas build -p android --profile preview
   ```
5. When the build finishes, download the `.apk` file directly onto any Android device.

---

## 3. Deploying Firebase Security Rules & Backend

### Setting up Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Deploying Firestore Rules & Indexes
```bash
cd firebase
firebase deploy --only firestore:rules,firestore:indexes --project califnco-water
```

### Running the Local Firebase Emulator Suite
If testing offline without modifying live cloud databases:
```bash
firebase emulators:start
```
The Firebase Emulator Suite UI opens at `http://localhost:4000` with live Firestore, Auth, and Security Rules debuggers.

---

## 4. Importing & Activating the n8n AI Instagram Workflow

### Running n8n Locally or via Docker
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```
Open `http://localhost:5678` in your browser.

### Importing the Workflow
1. In the n8n dashboard, click **"Workflows" -> "Import from File"**.
2. Select `automation/instagram_daily_product_workflow.json`.
3. Set the required credentials:
   - **OpenAI / Gemini Credential:** API Key for LLM & Image synthesis.
   - **Google Sheets OAuth2:** Connected to your Google account with access to `sample_catalog_google_sheets.csv`.
   - **Meta Instagram Graph API:** Long-lived Page Access Token and Instagram Business Account ID.
4. Toggle the workflow to **Active**. It will now trigger every day at 10:00 AM IST.

### Dry-Run Verification without Live Accounts
```bash
node automation/dry_run_test.js
```
Validates the entire schema, zero-hallucination compliance, and payloads autonomously.
