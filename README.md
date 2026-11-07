<div align="center">

<img src="public/next.svg" alt="Accel Business" width="60" />

# Accel Business — Udyam Digital

**India's first end-to-end digital acquisition platform for MSME telecom bundles.**

A full-stack Next.js application that takes an SMB owner from *"I need internet"* all the way to *"Service is live"* — entirely online, in minutes, with zero paperwork.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-12%2F12%20passing-brightgreen)](#)

</div>

---

## The Problem It Solves

India has **63 million MSMEs**. Most of them still:

- Call a helpline and wait 3 days for a quote.
- Submit physical KYC documents at a store.
- Track their order via phone call to a customer care agent.

**Accel Business Udyam Digital** collapses that entire journey — advisory, quotation, KYC verification, ordering, and installation tracking — into a single, bilingual, mobile-first web application.

---

## Application Pages & Features

### 1. 🏠 Landing Page — `/`

The storefront. Presents the product proposition clearly to an MSME owner who lands from a campaign link or QR code.

> **Screenshot placeholder** — `docs/screenshots/homepage.png`

**Key elements:**
- **Hero section** with a primary CTA routing to the AI Advisor.
- **Industry Sector Grid** — 6 pre-configured bundle categories with starting prices:

  | Sector | Bundle Name | Starting From |
  |:---|:---|---:|
  | Retail & Kirana | Retail Connect | ₹1,598/mo |
  | Clinics & Healthcare | Clinic Connect | ₹4,897/mo |
  | Education & Coaching | Education Connect | ₹3,498/mo |
  | Restaurants & Cafes | Restaurant Connect | ₹2,697/mo |
  | Small Manufacturing | Manufacturer Connect | ₹11,998/mo |
  | Professional Offices | Professional Connect | ₹3,897/mo |

- **Traditional vs Digital** comparison section showing time, cost, and effort saved.
- **Language switcher** — full English / हिन्दी toggle, persisted across the session.
- Sticky responsive header with navigation to all app sections.

---

### 2. 🤖 AI Business Advisor — `/advisor`

The heart of the application. A **6-step guided wizard** that understands the customer's business and builds a customized product bundle — entirely on the local deterministic engine, with optional Gemini AI enhancements.

> **Screenshot placeholder** — `docs/screenshots/advisor-wizard.png`

> **Screenshot placeholder** — `docs/screenshots/advisor-result.png`

**Step-by-step flow:**

| Step | What it asks |
|:---|:---|
| 1 | Business type (Retail, Clinic, Restaurant, Factory, Office…) |
| 2 | City & location tier (Metro / Tier-2) |
| 3 | Employee headcount & number of office branches |
| 4 | Internet need (Basic / High-speed / Dedicated SLA / No Fibre available) |
| 5 | Required digital tools (POS, CCTV, Cloud Email, Backup, Endpoint Security) |
| 6 | Communication needs (Postpaid SIMs, SIP IVR, WhatsApp API, SMS Marketing) |

**What the engine does behind the scenes:**

- Selects the right connectivity tier (Biz Fibre 100 / 300 / 1G / AirFiber 5G / Leased Line) based on employees + SLA requirements.
- Adds SD-WAN orchestration for multi-site businesses.
- Triggers cellular failover for manufacturers and multi-branch setups.
- Recommends POS terminals for retail, SIP trunks for clinics, IoT machine monitoring for factories.
- Calculates exact monthly recurring charges, one-time setup fees, installation SLA timelines, and minimum contract terms.
- Presents a **named, branded bundle** (e.g., *"Clinic Connect"*) with a primary products list and opt-in add-ons.

**AI Features (optional, requires `GEMINI_API_KEY`):**

- **✨ AI Smart Fill** — Type a natural language description of your business in the Step 1 search box (e.g., *"3-floor diagnostic lab in Lucknow, 10 staff, need CCTV, fast Wi-Fi and WhatsApp billing"*). Gemini parses it and auto-fills all 6 form steps instantly.
- **✨ Explain with Gemini AI** — On the result screen, a button requests a Gemini-generated 2-paragraph executive sales pitch tailored to that specific business, replacing the local template rationale.
- Without a key, both features degrade gracefully — the app functions identically using the local engine.

**Bundle result screen shows:**
- Bundle name, tagline, and segment classification.
- Primary products (mandatory core) with individual pricing and engineer-written rationale per product.
- Recommended add-ons the customer can enable.
- Total monthly recurring, one-time setup cost, estimated installation days, and contract term.
- Rationale badge showing `Local Engine` or `Gemini AI` depending on how the explanation was generated.

---

### 3. 📋 Quote Studio — `/quote`

A live, interactive commercial configuration tool. Think of it as a shopping cart built specifically for telecom bundles — with business-grade commercial rules.

> **Screenshot placeholder** — `docs/screenshots/quote-studio.png`

**Features:**
- **Auto-loads** the bundle from the Advisor via `localStorage` — the customer never re-enters data.
- **Customer & service location fields** — Business name, authorized contact, mobile, city, state, PIN code.
- **Line-item management** — Each product shows category, unit, monthly price, setup fee, and quantity controls (+/−). Mandatory core products are locked from deletion.
- **Quick add-on toggles** — Cloud CCTV, Cloud Backup, Static IP, Endpoint Security shown as one-click additions.
- **Live price recalculation** on every change:
  - Monthly recurring subtotal
  - Bundle commitment discount (10% for 12-month / 15% for 24-month contract)
  - 18% GST (fully input-credit eligible for GSTIN holders)
  - One-time setup charges
  - **Net total monthly bill (incl. GST)**
- **Contract term selector** — 12-month vs 24-month with real-time discount switching.
- Saves the finalized quote to the SQLite database (`SavedQuote` model) and redirects to KYC with the `quoteId`.

---

### 4. 🛡️ Smart Digital KYC — `/kyc`

A **4-step paperless onboarding engine** that replaces the traditional physical document submission process for telecom activations.

> **Screenshot placeholder** — `docs/screenshots/kyc-consent.png`

> **Screenshot placeholder** — `docs/screenshots/kyc-result.png`

**Step 1 — Privacy & Consent Notice (DOT-compliant)**

Presents a structured, legally accurate notice covering:
- Purpose of data collection (identity verification, OCR processing, order fulfillment, marketing — opt-in only).
- Data retention policy (90-day purge for inactive applicants).
- Right to withdraw consent at any time.

Three mandatory consents (identity, document processing, fulfillment) and one optional (marketing). Cannot proceed without the mandatory three.

**Step 2 — KYC Dossier / Document Selection**

A **12-specimen test dataset** (K01–K12) for demonstration and hackathon testing, covering intentionally varied scenarios:

- ✅ Clean, fully verified businesses
- ⚠️ GSTIN suspended / address proof expired / name mismatch
- ❌ Completely invalid documents (rejected outcome)

Each specimen card shows business name, expected outcome badge (Verified / Manual Review / Rejected), and partial GSTIN for identification.

**Step 3 — OCR Field Review**

Simulates Tesseract.js-powered document OCR extraction. Fields auto-populated from the specimen (or real uploaded file):
- Legal Business Name
- 15-digit GSTIN
- Udyam Registration Number (`UDYAM-XX-00-XXXXXXX` format)
- Authorized Signatory Name
- Address Proof Utility Bill Date

Customer can edit any field before submitting for verification — matching how a real OCR correction flow works.

**Step 4 — Cross-Registry Verification Result**

Runs the extracted data through three independent checks simultaneously:

| Check | Data Source | What it validates |
|:---|:---|:---|
| GST Portal Match | `GstinRecord` DB table | GSTIN format, Active status, registered trade name |
| Udyam MSME Match | `UdyamRecord` DB table | Enterprise name, type (Micro/Small), NIC classification |
| Address Proof Recency | Date arithmetic | Utility bill issued within 90 days of reference date |

Outputs one of three final verdicts:
- **✅ Instant Digital KYC Verified** — Proceeds to order confirmation
- **⚠️ Manual Review Required** — Submits for field-assisted desk review
- **❌ Application Rejected** — Blocks automatic onboarding, shows specific flags

Flagged issues displayed clearly (e.g., *"GSTIN suspended by tax authority"*, *"Address proof older than 90 days"*, *"Signatory name does not match GSTIN records"*).

Saves a `KycVerification` record and a `ConsentRecord` with a unique consent reference ID to the database.

---

### 5. 📦 Order Tracker — `/tracker`

A real-time order status page that keeps the customer informed from submission to live service activation.

> **Screenshot placeholder** — `docs/screenshots/order-tracker.png`

**Features:**
- Loads order details from the database by `orderId` URL parameter.
- **7-stage visual progress pipeline** with timestamps and descriptions:
  1. Application Received
  2. KYC Processing
  3. KYC Verified
  4. Order Confirmed
  5. Installation Scheduled
  6. Installation in Progress
  7. **Activated** ✅

- Completed stages shown in emerald green with timestamps, current stage highlighted in rose, pending stages in slate.
- **Stage simulator button** — advances the order through stages live (for demo purposes), updating the database.
- Shows assigned field engineer name and scheduled installation date when available.
- Contact support section at the bottom.
- Fully bilingual — all stage labels and descriptions in English and Hindi.

---

### 6. 🤝 Partner Portal — `/partner`

A referral management console for Accel Business distribution partners (ISPs, IT resellers, Authorized retailers).

> **Screenshot placeholder** — `docs/screenshots/partner-portal.png`

**Features:**
- **Role switcher** — Partner / Sales Executive / Admin views.
- **Referral submission form** (modal) — Business name, contact, phone, city.
- **Referrals pipeline table** — All submitted leads with status badges:
  `REFERRED → CONTACTED → QUOTED → KYC_COMPLETE → ACTIVATED`
- **Commission tracking** — INR commission per activated referral shown per row.
- **Summary stats cards** — Total referrals, Activated count, Pending, Total commission earned.
- Saves new referrals to `PartnerReferral` database table.

---

### 7. 📊 Admin Analytics Dashboard — `/admin`

A data analytics view built on 5,000 synthetic-but-realistic MSME lead records from the Q1 2026 cohort.

> **Screenshot placeholder** — `docs/screenshots/admin-analytics.png`

**Metrics & Charts:**

| Widget | What it shows |
|:---|:---|
| KPI Cards | Total leads, Activated count, Conversion rate, Avg. monthly bundle value |
| Bar Chart | Leads by business segment (Retail, Clinic, Education, Restaurant, Manufacturing, Professional) |
| Pie Chart | Lead outcome distribution (Activated, Quoted, Dropped, KYC Review) |
| Bar Chart | Avg. days from lead to activation by segment |
| Data Table | Top 10 lead records with stage, bundle value, and churn flag |

Built using **Recharts** with responsive containers. Uses the `/api/analytics` route that aggregates the `SmbLead` table.

---

## Full User Journey

```
Landing Page (/)
    │
    ▼
AI Advisor (/advisor)         ← [AI Smart Fill — optional Gemini]
    │   6-step wizard
    │   Local recommendation engine runs
    │   [Explain with Gemini AI — optional]
    │
    ▼
Quote Studio (/quote)
    │   Bundle pre-loaded from advisor
    │   Customer adjusts items & contract term
    │   Live GST-aware pricing
    │
    ▼
Smart KYC (/kyc)
    │   Privacy consent (DOT-compliant)
    │   Document upload / specimen selection
    │   Local OCR extraction (Tesseract.js)
    │   Cross-registry verification (GSTIN + Udyam + Address proof)
    │
    ▼
Order Tracker (/tracker)
    │   7-stage pipeline visualization
    │   Live status updates
    │
    ▼
    🎉 Service Activated
```

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | Next.js 16.4.5 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Database ORM** | Prisma 5.22 (SQLite for local dev) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **OCR** | Tesseract.js (runs locally, no cloud) |
| **AI (optional)** | Google Gemini 2.5 Flash via `@google/genai` |
| **Testing** | Custom assertion suite via `tsx` |

---

## Project Structure

```
udyam-digital/
├── prisma/
│   ├── schema.prisma          # Database models
│   ├── seed.ts                # Seed 5,000 MSME leads + product catalogue
│   └── dev.db                 # SQLite database
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── advisor/           # AI Business Advisor wizard
│   │   ├── quote/             # Quote Studio
│   │   ├── kyc/               # Smart Digital KYC
│   │   ├── tracker/           # Order Tracker
│   │   ├── partner/           # Partner Portal
│   │   ├── admin/             # Analytics Dashboard
│   │   └── api/
│   │       ├── advisor/       # POST: Recommendation engine + optional AI
│   │       ├── quotes/        # POST: Save quote to DB
│   │       ├── orders/        # GET/POST: Order management
│   │       ├── kyc/
│   │       │   ├── ocr/       # POST: Document OCR extraction
│   │       │   └── verify/    # POST: Cross-registry KYC verification
│   │       └── analytics/     # GET: Aggregated MSME lead insights
│   └── lib/
│       ├── recommendation-engine.ts  # Deterministic bundle algorithm
│       ├── kyc-verification.ts       # GSTIN / Udyam / address-proof logic
│       ├── kyc-specimens.ts          # 12 test dossier specimens
│       ├── translations.ts           # EN / HI string table
│       └── prisma.ts                 # Prisma client singleton
├── tests/
│   └── unit-test.ts           # 12 automated assertions
├── .env                       # Environment variables (gitignored)
└── .vscode/
    └── settings.json          # Hides .next from explorer sidebar
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client and seed the database
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 3. Configure environment (optional — app works without it)
# Edit .env and add your free Gemini API key from https://aistudio.google.com/
GEMINI_API_KEY=AIzaSy...

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
npm test
# 🎉 Test Results: 12/12 assertions passed!
```

---

## Environment Variables

A single `.env` file at the project root (gitignored):

```env
DATABASE_URL="file:./prisma/dev.db"

# Optional — enables AI Smart Fill and AI Explanation features
# Get a free key at: https://aistudio.google.com/
GEMINI_API_KEY=
```

> The application runs fully with **no API key**. Gemini is used only when explicitly requested by the user via UI buttons.

---

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

Add `GEMINI_API_KEY` in Vercel → Project Settings → Environment Variables.

> **Note:** The SQLite database (`dev.db`) is a local file. For production, migrate the `DATABASE_URL` to a hosted PostgreSQL instance (e.g., Neon, Supabase, Prisma Postgres) and update the `datasource` provider in `prisma/schema.prisma`.

---

## Bilingual Support

Every page supports full **English / हिन्दी** switching. The language state is maintained per-page session via React state. All UI text, error messages, button labels, stage descriptions, and product rationale strings are translated.

---

## KYC Compliance Notes

The KYC flow is designed to mirror real Indian telecom regulatory requirements:
- **DOT CAF (Customer Acquisition Form)** fields captured: Business name, GSTIN, Udyam, Signatory details, Address proof.
- **Consent framework** follows India's Digital Personal Data Protection Act (DPDPA) 2023 principle of **purpose limitation** and **granular consent**.
- Marketing consent is explicitly **opt-in only** and separate from mandatory operational consents.
- Failed/inactive KYC records are tagged for 90-day automatic purge.

---

<div align="center">

Built for the **Airtel Accel Business Hackathon 2026**

*Connecting 63 million Indian MSMEs to enterprise-grade digital infrastructure — one bundle at a time.*

</div>
