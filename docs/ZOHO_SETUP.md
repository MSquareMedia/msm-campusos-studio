# Zoho CRM Integration & Setup Guide

This guide walks you through connecting MSM CampusOS Studio to **Zoho CRM** so that all form submissions (Contact, Free Audit, Careers, and OSiQ AI chatbot) automatically land as new leads in your Zoho CRM **Leads** module.

---

## Quick Summary

- **Primary Destination**: Zoho CRM (`Leads` module).
- **Secondary / Backup Destination**: PostgreSQL (via Docker Compose or Neon).
- **Safety**: If Zoho is temporarily unreachable or rate-limited, the submission is still recorded in PostgreSQL, so no lead is ever lost.
- **Two integration paths**:
  - **Option 1 (Recommended)**: Direct Zoho CRM REST API via OAuth 2.0 (using our 1-click token script `npm run zoho:token`).
  - **Option 2 (Zero-code alternative)**: Zoho Flow / Webhook (simply paste a webhook URL).

---

## Option 1: Direct Zoho CRM REST API (Recommended)

Follow these 4 simple steps to connect directly to Zoho CRM:

### Step 1: Open Zoho API Console
1. Go to **[https://api-console.zoho.com](https://api-console.zoho.com)** and log in with your Zoho CRM admin account.
2. Click **Add Client** (or **Get Started** if this is your first time).
3. Hover over **Self Client** and click **Create**.
4. Click **OK** to confirm. You will see a screen with your **Client ID** and **Client Secret**.

### Step 2: Generate a Grant Code
1. In the same window, click on the **Generate Code** tab.
2. Fill in the following:
   - **Scope**: `ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.READ`
   - **Time Duration**: `10 minutes`
   - **Scope Description**: `CampusOS Leads`
3. Click **Create**.
4. Zoho will generate a grant code that looks like `1000.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`. **Copy this code**.

### Step 3: Run the Token Helper Script
In your terminal in the project directory, run:

```bash
npm run zoho:token
```

The script will ask you:
1. Your Zoho region (1 for Global/US, 2 for India, 3 for Europe, etc.).
2. Your **Client ID** (from Step 1).
3. Your **Client Secret** (from Step 1).
4. The **Grant Code** you just copied (from Step 2).

The script will instantly exchange this code for a permanent `refresh_token` and display the exact lines to add!

### Step 4: Add to Environment Variables
Copy the output from the script into your `.env.local` file (and add as GitHub Secrets for PROD):

```env
ZOHO_CLIENT_ID=1000.xxxx
ZOHO_CLIENT_SECRET=xxxx
ZOHO_REFRESH_TOKEN=1000.xxxx
ZOHO_ACCOUNTS_DOMAIN=https://accounts.zoho.com
ZOHO_API_DOMAIN=https://www.zohoapis.com
```

---

## Option 2: Zoho Flow / Webhook (Alternative)

If your company uses **Zoho One** or **Zoho Flow** and you prefer not to touch OAuth tokens:

1. Open **Zoho Flow** ([flow.zoho.com](https://flow.zoho.com)).
2. Click **Create Flow** → **Configure Trigger** → **Webhook**.
3. Copy the **Webhook URL** provided by Zoho Flow.
4. Add it to your `.env.local` or GitHub Secrets:
   ```env
   ZOHO_WEBHOOK_URL=https://flow.zoho.com/api/v1/webhook/...
   ```
5. In Zoho Flow, add a **Zoho CRM: Create Lead** action and map the incoming fields:
   - `lead.first_name` → First Name
   - `lead.last_name` → Last Name
   - `lead.email` → Email
   - `lead.company` → Company
   - `lead.lead_source` → Lead Source
   - `lead.description` → Description

---

## How Field Mapping Works

When a visitor submits any form on the site, the app maps the fields into Zoho CRM as follows:

| Field | Source in CampusOS Studio | Fallback if empty |
|---|---|---|
| **First Name** | Split from full name | Blank |
| **Last Name** | Split from full name | `"Website Lead"` (Zoho strictly requires Last_Name) |
| **Email** | `email` | Blank |
| **Company** | `company` or `organisation` | `"Not specified (Website Lead)"` (Zoho strictly requires Company) |
| **Phone** | `phone` | Blank |
| **Website** | `website` (from Audit flow) | Blank |
| **Lead Source** | Automatically set based on form: `"Website Contact Form"`, `"Website Free Audit Flow"`, `"Website Careers Application"`, or `"Website OSiQ AI Assistant"` | `"MSM CampusOS Studio"` |
| **Description** | Full formatted list of all answers, bottlenecks, goals, budgets, or conversation transcripts | — |

---

## Running with Docker Compose (PostgreSQL + App)

To run the Next.js app and PostgreSQL database together in Docker:

```bash
docker compose up -d
```

- **Postgres Database**: Running on `localhost:5432` (`campusos_db`).
- **Next.js Studio**: Running on `http://localhost:3000`.
- The database table `submissions` is automatically created on the first form submission.

---

## Production Deployment (GitHub Actions Secrets)

When deploying to production, add the following secrets in your GitHub repository (**Settings → Secrets and variables → Actions**):

| Secret Name | Description |
|---|---|
| `ZOHO_CLIENT_ID` | Your Zoho Client ID |
| `ZOHO_CLIENT_SECRET` | Your Zoho Client Secret |
| `ZOHO_REFRESH_TOKEN` | Generated via `npm run zoho:token` |
| `ZOHO_ACCOUNTS_DOMAIN` | e.g. `https://accounts.zoho.com` (or `.in`, `.eu`) |
| `ZOHO_API_DOMAIN` | e.g. `https://www.zohoapis.com` (or `.in`, `.eu`) |
| `ZOHO_WEBHOOK_URL` | (Only if using Option 2 instead of Direct API) |
| `DATABASE_URL` | PostgreSQL connection string |
