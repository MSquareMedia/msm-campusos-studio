# Zoho CRM Leads Module: Data Dictionary & Field Reference

**Project:** MSM CampusOS Studio  
**Target Module:** Zoho CRM → **Leads**  
**Last Updated:** September 12, 2026  

---

## 1. Executive Summary

Every inbound submission on the MSM CampusOS Studio website is automatically pushed to the Zoho CRM **Leads** module in real time. 

Visitors do not have to fill out any extra or redundant questions: the integration maps their natural responses, role selections, and background marketing campaign tracking directly into your CRM’s specific layout columns and native visual tags.

---

## 2. Master Field Mapping Matrix

The table below shows exactly which columns in your Zoho CRM layout are populated by each website conversion point:

| Zoho CRM Field in Your Layout | Value / Content Populated | Source on Website |
|---|---|---|
| **Lead Name** | `First_Name` + `Last_Name` (automatically split) | Full name field |
| **Company** | Institution or Company Name (e.g. `Oxford Global`) | Organisation / Company field |
| **Institution Name** | Institution / University name | Organisation / Company field |
| **Email** | Visitor's work email address | Email field |
| **Phone Number** & **Mobile** | Phone number (if provided) | Phone field |
| **Website** & **Web Site Url** | Prospect's institution or company URL | Website question in Audit flow |
| **Lead Source** | Identifies the conversion funnel: <br>• `Website Contact Form`<br>• `Website Free Audit Flow`<br>• `Website Careers Application`<br>• `Website OSiQ AI Assistant` | Automatically detected |
| **Lead Status** | Set to **`Not Contacted`** | Default for all new incoming leads |
| **Rating** | Priority indicator: <br>• **`Hot`**: Contact forms and Free Audit requests<br>• **`Warm`**: OSiQ AI chat conversations<br>• **`Active`**: Careers applications | Automatically calculated based on commercial intent |
| **Industry** | Standard CRM vertical: <br>• `Education`<br>• `Automotive`<br>• `Healthcare`<br>• `Real Estate` | Selected in Audit / Chatbot |
| **Services of interest** | Specific services selected (e.g. `Strategy & Intelligence, Demand & Media, Brand & Creative`) | Selected in Assessment step 3 |
| **Area of Interest** | Primary objective or goal (e.g. `Student Enrolment`, `Brand Awareness`) | Selected in Assessment step 2 |
| **Position / Designation / Job Title** | Applied role (e.g. `Senior Growth Strategist`, `Art Director`) | Selected in Careers flow |
| **Description** | Full, comprehensive transcript of all answers, bottlenecks, goals, budgets, and AI chat transcripts | Compiled from all steps |
| **UTM Source** | e.g. `google`, `linkedin`, `meta`, `newsletter` | Captured silently from URL |
| **UTM Medium** | e.g. `cpc`, `paid_social`, `email` | Captured silently from URL |
| **UTM Campaign** | e.g. `admissions_growth_2026` | Captured silently from URL |
| **UTM Term** & **UTM Content** | Ad keyword and ad creative identifier | Captured silently from URL |
| **GCLID** | Google Click Identifier for Google Ads conversion tracking | Captured silently from URL |

---

## 3. Visual Tag Badges (Applied per Lead)

Each lead displays colorful, clickable tag badges in the Zoho CRM interface. Clicking any tag instantly filters your entire database:

| Tag Category | Tags Applied in CRM | When It Appears |
|---|---|---|
| **Origin & Platform** | `CampusOS Studio`, `Website Inbound` | Applied to **all** website leads |
| **Commercial Intent** | `High Intent` | Contact forms & Free Audit requests |
| **Funnel Type** | `Contact Us`, `Free Audit`, `Assessment`, `Careers`, `OSiQ AI Assistant` | Based on page converted |
| **Industry Verticals** | `Education`, `Automotive`, `Healthcare`, `Real Estate` | When the visitor chooses an industry |
| **Budget Ranges** | `Budget: $100k+`, `Enterprise Tier`<br>`Budget: $50k-$100k`<br>`Budget: $25k-$50k`<br>`Budget: <$25k` | When a budget tier is chosen in Audit or OSiQ chat |
| **Applicant Roles** | `Role: <Job Title>` | In Careers applications |

---

## 4. Breakdown by Form Type

### A. Free Growth Audit Assessment (`/audit`)
* **Lead Source**: `Website Free Audit Flow`
* **Rating**: `Hot`
* **Industry**: `Education`, `Healthcare`, `Automotive`, or `Real Estate`
* **Services of interest**: Comma-separated list of selected capabilities
* **Area of Interest**: Primary goal (e.g. enrolment growth, lead generation)
* **Website**: Prospect's site URL
* **Tags**: `[CampusOS Studio]`, `[Free Audit]`, `[High Intent]`, `[<Industry>]`, `[Budget: <Range>]`
* **Description**: Contains the single biggest bottleneck described by the prospect, full budget details, and target quarter timeline.

### B. Contact Us Form (`/contact` & Drawer)
* **Lead Source**: `Website Contact Form`
* **Rating**: `Hot`
* **Lead Status**: `Not Contacted`
* **Company**: Prospect's company or institution
* **Tags**: `[CampusOS Studio]`, `[Contact Us]`, `[High Intent]`
* **Description**: Contains the exact inquiry message typed by the prospect.

### C. OSiQ Marketing AI Assistant (Live Chat)
* **Lead Source**: `Website OSiQ AI Assistant`
* **Rating**: `Warm`
* **Industry**: Automatically extracted from conversation
* **Area of Interest**: Prospect's marketing challenge
* **Tags**: `[CampusOS Studio]`, `[OSiQ AI Assistant]`, `[AI Qualified]`, `[<Industry>]`
* **Description**: Contains the full transcript of the conversation between the visitor and the AI assistant.

### D. Careers Application (`/careers`)
* **Lead Source**: `Website Careers Application`
* **Rating**: `Active`
* **Position / Designation**: Specific job role chosen
* **Tags**: `[CampusOS Studio]`, `[Careers]`, `[Role: <Job Title>]`
* **Description**: Portfolio link, cover note, and qualifications.

---

## 5. Recommended Custom Views for Your Team

Your CRM administrator can set up these 1-click views in **Zoho CRM → Leads → New Custom View**:

### View 1: "Hot Website Leads" (For Sales Team)
* **Criteria**: `Rating` is `Hot` AND `Lead Status` is `Not Contacted`
* **Columns**: Lead Name, Company, Email, Phone, Services of interest, Created Time

### View 2: "Education Inquiries" (For Education Specialists)
* **Criteria**: `Industry` is `Education`
* **Columns**: Lead Name, Institution Name, Email, Services of interest, Website, Created Time

### View 3: "Paid Ad Conversions" (For Marketing Team)
* **Criteria**: `UTM Source` is not empty
* **Columns**: Lead Name, Company, UTM Source, UTM Campaign, Lead Source, Created Time
