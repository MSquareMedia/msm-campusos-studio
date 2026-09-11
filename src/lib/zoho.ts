import "server-only";
import type { SubmissionKind } from "./db";

/**
 * Zoho CRM & Zoho Flow Integration
 *
 * Supports two operating modes:
 * 1. Direct Zoho CRM REST API (OAuth 2.0 via Refresh Token)
 *    - Pushes directly into Zoho CRM "Leads" module
 *    - Requires: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN
 *    - Optional: ZOHO_ACCOUNTS_DOMAIN (default: https://accounts.zoho.com)
 *    - Optional: ZOHO_API_DOMAIN (default: https://www.zohoapis.com)
 *
 * 2. Zoho Flow / Incoming Webhook Mode
 *    - Pushes JSON payload directly to a Zoho Flow or third-party webhook URL
 *    - Requires: ZOHO_WEBHOOK_URL
 */

type ZohoLeadPayload = {
  First_Name?: string;
  Last_Name: string;
  Email?: string;
  Phone?: string;
  Company: string;
  Lead_Source?: string;
  Website?: string;
  Description?: string;
  [key: string]: unknown;
};

// In-memory token cache to avoid refreshing on every single request
let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

export function isZohoConfigured(): boolean {
  const hasDirectApi = Boolean(
    process.env.ZOHO_CLIENT_ID &&
    process.env.ZOHO_CLIENT_SECRET &&
    process.env.ZOHO_REFRESH_TOKEN
  );
  const hasWebhook = Boolean(process.env.ZOHO_WEBHOOK_URL);
  return hasDirectApi || hasWebhook;
}

/**
 * Splits a full name into First Name and Last Name.
 * Zoho CRM strictly requires Last_Name.
 */
function splitName(fullName: string | undefined): { firstName: string; lastName: string } {
  if (!fullName || !fullName.trim()) {
    return { firstName: "", lastName: "Website Lead" };
  }
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: "", lastName: parts[0] };
  }
  const lastName = parts.pop() || "Lead";
  const firstName = parts.join(" ");
  return { firstName, lastName };
}

/**
 * Generates intelligent tags for the Zoho CRM Leads module.
 * Zoho CRM renders these as colorful badges and enables 1-click filtering.
 */
function buildZohoTags(
  kind: SubmissionKind,
  payload: Record<string, string>
): Array<{ name: string }> {
  const tags = new Set<string>();

  // 1. Source & Brand Tag
  tags.add("CampusOS Studio");
  tags.add("Website Inbound");

  // 2. Specific Funnel / Intent Tag
  if (kind === "contact") {
    tags.add("Contact Us");
    tags.add("High Intent");
  } else if (kind === "audit") {
    tags.add("Free Audit");
    tags.add("Assessment");
    tags.add("High Intent");
  } else if (kind === "careers") {
    tags.add("Careers");
    if (payload.role) {
      tags.add(`Role: ${payload.role.slice(0, 35)}`);
    }
  } else if (kind === "osiq") {
    tags.add("OSiQ AI Assistant");
    tags.add("AI Qualified");
  }

  // 3. Industry Tag
  const rawIndustry = payload.industry?.toLowerCase()?.trim();
  if (rawIndustry) {
    if (rawIndustry.includes("edu")) tags.add("Education");
    else if (rawIndustry.includes("auto")) tags.add("Automotive");
    else if (rawIndustry.includes("health")) tags.add("Healthcare");
    else if (rawIndustry.includes("real")) tags.add("Real Estate");
    else tags.add(payload.industry.slice(0, 30));
  }

  // 4. Budget Tier Tag
  const rawBudget = payload.budget?.trim();
  if (rawBudget) {
    if (rawBudget.includes("100") || rawBudget.toLowerCase().includes("over")) {
      tags.add("Budget: $100k+");
      tags.add("Enterprise Tier");
    } else if (rawBudget.includes("50")) {
      tags.add("Budget: $50k-$100k");
    } else if (rawBudget.includes("25")) {
      tags.add("Budget: $25k-$50k");
    } else if (rawBudget.toLowerCase().includes("under")) {
      tags.add("Budget: <$25k");
    } else {
      tags.add(`Budget: ${rawBudget.slice(0, 30)}`);
    }
  }

  // 5. Primary Goal Tag
  const rawGoal = payload.goal?.trim();
  if (rawGoal && rawGoal.length < 30) {
    tags.add(`Goal: ${rawGoal}`);
  }

  return Array.from(tags)
    .filter((t) => t.length > 0)
    .slice(0, 10)
    .map((name) => ({ name }));
}

/**
 * Formats a submission payload into Zoho CRM Leads schema.
 */
function buildZohoLead(
  kind: SubmissionKind,
  payload: Record<string, string>
): ZohoLeadPayload {
  const { firstName, lastName } = splitName(payload.name);

  const email = payload.email?.trim();
  const phone = payload.phone?.trim();
  const company =
    payload.company?.trim() ||
    payload.organisation?.trim() ||
    payload.organization?.trim() ||
    "Not specified (Website Lead)";

  let website = payload.website?.trim() || "";
  if (website && !website.startsWith("http://") && !website.startsWith("https://")) {
    website = `https://${website}`;
  }

  // Determine human-readable lead source
  let leadSource = "MSM CampusOS Studio";
  if (kind === "contact") leadSource = "Website Contact Form";
  if (kind === "audit") leadSource = "Website Free Audit Flow";
  if (kind === "careers") leadSource = "Website Careers Application";
  if (kind === "osiq") leadSource = "Website OSiQ AI Assistant";

  // Build clean description summarizing all provided details
  const descriptionLines: string[] = [
    `Submission Type: ${kind.toUpperCase()}`,
    `Date/Time: ${new Date().toISOString()}`,
    "--- Form Fields ---",
  ];

  for (const [key, value] of Object.entries(payload)) {
    if (value && value.trim()) {
      descriptionLines.push(`${key}: ${value.trim()}`);
    }
  }

  // Determine Lead Rating & Status
  const rating =
    kind === "contact" || kind === "audit" ? "Hot" : kind === "osiq" ? "Warm" : "Active";

  const lead: ZohoLeadPayload = {
    First_Name: firstName,
    Last_Name: lastName,
    Company: company,
    Lead_Source: leadSource,
    Lead_Status: "Not Contacted",
    Rating: rating,
    Tag: buildZohoTags(kind, payload),
    Description: descriptionLines.join("\n"),
  };

  // Map standard Zoho CRM Industry field if present
  if (payload.industry) {
    const indMap: Record<string, string> = {
      education: "Education",
      automotive: "Automotive",
      healthcare: "Healthcare",
      "real-estate": "Real Estate",
    };
    lead.Industry = indMap[payload.industry.toLowerCase()] || payload.industry;
  }

  if (email) lead.Email = email;
  if (phone) {
    lead.Phone = phone;
    lead.Mobile = phone;
  }
  if (website) {
    lead.Website = website;
    lead.Web_Site_Url = website;
  }

  // Map Institution / University Name
  const institution = payload.organisation || payload.organization || payload.company;
  if (institution) {
    lead.Institution_Name = institution;
  }

  // Map Career Designation / Position
  if (payload.role) {
    lead.Designation = payload.role;
    lead.Position = payload.role;
    lead.Job_Title = payload.role;
  }

  // Map Selected Services & Goals from Audit Assessment
  if (payload.services) {
    lead.Services_of_interest = payload.services;
  }
  if (payload.goal || payload.services) {
    lead.Area_of_Interest = payload.goal || payload.services;
  }

  // Map Marketing Campaign Tracking (UTMs & Google Click ID)
  if (payload.utm_source) lead.UTM_Source = payload.utm_source;
  if (payload.utm_medium) lead.UTM_Medium = payload.utm_medium;
  if (payload.utm_campaign) lead.UTM_Campaign = payload.utm_campaign;
  if (payload.utm_term) lead.UTM_Term = payload.utm_term;
  if (payload.utm_content) lead.UTM_Content = payload.utm_content;
  if (payload.gclid) lead.GCLID = payload.gclid;

  return lead;
}

/**
 * Retrieves a valid OAuth access token using the configured Refresh Token.
 */
async function getZohoAccessToken(): Promise<{ accessToken: string; apiDomain: string }> {
  const now = Date.now();
  const accountsDomain = (process.env.ZOHO_ACCOUNTS_DOMAIN || "https://accounts.zoho.com").replace(/\/+$/, "");
  const defaultApiDomain = (process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.com").replace(/\/+$/, "");

  if (cachedAccessToken && tokenExpiresAt > now + 300000) {
    // Return cached token if valid for more than 5 more minutes
    return { accessToken: cachedAccessToken, apiDomain: defaultApiDomain };
  }

  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Zoho API credentials missing (CLIENT_ID, CLIENT_SECRET, or REFRESH_TOKEN).");
  }

  const tokenUrl = `${accountsDomain}/oauth/v2/token?refresh_token=${encodeURIComponent(
    refreshToken
  )}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(
    clientSecret
  )}&grant_type=refresh_token`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(`Zoho token refresh failed: ${data.error || response.statusText}`);
  }

  cachedAccessToken = data.access_token as string;
  const expiresInSeconds = (data.expires_in as number) || 3600;
  tokenExpiresAt = Date.now() + expiresInSeconds * 1000;

  const apiDomain = (data.api_domain as string) || defaultApiDomain;
  return { accessToken: cachedAccessToken, apiDomain };
}

/**
 * Pushes a lead via Zoho Flow / generic Webhook.
 */
async function pushViaWebhook(
  webhookUrl: string,
  kind: SubmissionKind,
  payload: Record<string, string>,
  lead: ZohoLeadPayload
): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind,
      lead,
      raw_payload: payload,
      submitted_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Zoho webhook returned HTTP ${res.status}: ${errText.slice(0, 300)}`);
  }
}

/**
 * Pushes a lead directly to Zoho CRM Leads module using REST API.
 */
async function pushViaDirectApi(lead: ZohoLeadPayload): Promise<void> {
  const { accessToken, apiDomain } = await getZohoAccessToken();
  const endpoint = `${apiDomain.replace(/\/+$/, "")}/crm/v2/Leads`;

  const body = {
    data: [lead],
    trigger: ["approval", "workflow", "blueprint"],
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      `Zoho CRM API returned HTTP ${res.status}: ${JSON.stringify(data || {})}`
    );
  }

  const firstResult = data?.data?.[0];
  if (firstResult?.status === "error") {
    throw new Error(
      `Zoho CRM rejected lead: ${firstResult.message} (code: ${firstResult.code})`
    );
  }
}

/**
 * Main entry point: push any submission to Zoho.
 *
 * Guaranteed not to throw: logs errors safely so user form submissions
 * never fail if Zoho is experiencing network or configuration issues.
 */
export async function pushLeadToZoho(
  kind: SubmissionKind,
  payload: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  if (!isZohoConfigured()) {
    return { success: false, error: "Zoho is not configured." };
  }

  const lead = buildZohoLead(kind, payload);

  try {
    // If webhook URL is set, prioritize webhook mode
    if (process.env.ZOHO_WEBHOOK_URL) {
      await pushViaWebhook(process.env.ZOHO_WEBHOOK_URL, kind, payload, lead);
      return { success: true };
    }

    // Otherwise use Direct Zoho CRM REST API
    await pushViaDirectApi(lead);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Zoho CRM Integration] Error pushing ${kind} lead:`, message);
    return { success: false, error: message };
  }
}
