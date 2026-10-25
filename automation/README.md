# Califnco AI Automation Engine

This module provides scheduled, automated daily publishing of water purifier products to **Instagram** using n8n and the Meta Graph API, plus an automated broadcast workflow for **WhatsApp Status** via WAHA.

---

## 1. Architecture & Daily Publishing Pipeline

```
[ Daily Schedule Cron ]
          │
          ▼
[ Read Google Sheet (Filter: Status = PENDING, Limit: 1) ]
          │
          ▼
[ Check If Eligible Product Exists ]
    ├── (No) ──► Stop / Log "Catalog Fully Published"
    └── (Yes)
          │
          ▼
[ AI Caption Generation (Gemini / OpenAI API) ]
  • Enforces ZERO hallucination of unverified claims or warranties
  • Exact product name, retail INR price, key features, verified specs
          │
          ▼
[ AI Studio Image Generation (DALL-E 3 / Pollinations) ]
  • High-end commercial studio product photography aesthetic
          │
          ▼
[ Image Hosting / Public HTTPS Staging ]
          │
          ▼
[ Meta Instagram Graph API (Create Media Container) ]
  • POST https://graph.facebook.com/v19.0/{ig_user_id}/media
          │
          ▼
[ Wait for Media Ingest (5s) ]
          │
          ▼
[ Meta Instagram Graph API (Publish Media) ]
  • POST https://graph.facebook.com/v19.0/{ig_user_id}/media_publish
          │
          ▼
[ Update Google Sheets Row ]
  • Status = PUBLISHED
  • Last_Posted_Date = ISO Timestamp
  • Instagram_Post_ID = Publication ID
```

---

## 2. Meta Instagram Graph API Setup Guide

To publish directly to Instagram via the official Graph API:

1. **Prerequisites:**
   - A Facebook Developer Account at [developers.facebook.com](https://developers.facebook.com/).
   - An Instagram Professional Account (Business or Creator). Personal accounts are **not** supported by Meta for publishing.
   - A Facebook Page linked to the Instagram Professional Account.

2. **Facebook App Configuration:**
   - Create an App with type **Business**.
   - Add the **Instagram Graph API** product.
   - In App Roles, ensure your developer account is Admin.

3. **Required Permissions:**
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`

4. **Generating the Long-Lived Page Access Token:**
   - In the Graph API Explorer, select your App and User Token.
   - Request permissions: `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`.
   - Exchange the short-lived token for a 60-day long-lived User Token:
     ```bash
     curl -i -X GET "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
     ```
   - Query `GET /me/accounts` with the long-lived user token to retrieve your Page's permanent Page Access Token.

5. **Finding Your Instagram Business Account ID:**
   ```bash
   curl -i -X GET "https://graph.facebook.com/v19.0/{page-id}?fields=instagram_business_account&access_token={page-access-token}"
   ```

---

## 3. WAHA (WhatsApp HTTP API) Bonus Workflow

The bonus workflow (`waha_whatsapp_status_workflow.json`) publishes the daily product to WhatsApp Status.

### How to Run WAHA Locally:
```bash
docker run -d \
  --name waha \
  -p 3000:3000 \
  -e "WHATSAPP_HOOK_URL=http://localhost:5678/webhook/waha" \
  -e "WAHA_API_KEY=secret_waha_api_key_here" \
  devlikeapro/waha
```

1. Navigate to `http://localhost:3000/dashboard` in your browser.
2. Scan the displayed QR code using WhatsApp on a **dedicated secondary number**.
3. Once the session shows `WORKING`, n8n triggers the `POST /api/default/status/image` endpoint with the product photo and caption.
4. **Safety & Policy Note:** Always use an official corporate or secondary SIM. Automated broadcast messages from personal numbers without consent violate WhatsApp Terms of Service.

---

## 4. Autonomous Dry-Run Verification

Before connecting live credentials, run the local dry-run test to verify catalog parsing, compliance filtering, and payload construction:

```bash
node automation/dry_run_test.js
```

All 5 steps will execute and output formatted previews of captions, specs, and simulated API payloads.
