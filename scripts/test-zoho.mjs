#!/usr/bin/env node

/**
 * Zoho CRM Connection & Lead Push Tester
 *
 * Reads .env.local and attempts to:
 * 1. Authenticate with Zoho CRM using the refresh token
 * 2. Push a sample test lead into your Zoho CRM "Leads" module
 * 3. Report the result and the created Lead ID
 *
 * Run with:
 *   node scripts/test-zoho.mjs
 *   or:
 *   npm run zoho:test
 */

import fs from "node:fs";
import path from "node:path";

// 1. Manually parse .env.local if present
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  }
}

const accountsDomain = (process.env.ZOHO_ACCOUNTS_DOMAIN || "https://accounts.zoho.com").replace(/\/+$/, "");
const defaultApiDomain = (process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.com").replace(/\/+$/, "");
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

async function testZoho() {
  console.log("\n=======================================================");
  console.log("  Zoho CRM Connection Verification");
  console.log("=======================================================\n");

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("❌ Error: Missing credentials in .env.local.");
    console.error("Make sure ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN are set.");
    process.exit(1);
  }

  console.log(`Accounts Domain: ${accountsDomain}`);
  console.log(`API Domain:      ${defaultApiDomain}`);
  console.log(`Client ID:       ${clientId.slice(0, 10)}...`);
  console.log("\n1. Testing OAuth Token Refresh...");

  const tokenUrl = `${accountsDomain}/oauth/v2/token?refresh_token=${encodeURIComponent(
    refreshToken
  )}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(
    clientSecret
  )}&grant_type=refresh_token`;

  let accessToken = "";
  let apiDomain = defaultApiDomain;

  try {
    const tokenRes = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      console.error("❌ Token refresh failed!");
      console.error("Zoho response:", tokenData);
      process.exit(1);
    }

    accessToken = tokenData.access_token;
    apiDomain = (tokenData.api_domain || defaultApiDomain).replace(/\/+$/, "");
    console.log("✅ OAuth token refresh succeeded! Access token obtained.");
  } catch (err) {
    console.error("❌ Network error connecting to Zoho Accounts:", err.message);
    process.exit(1);
  }

  console.log("\n2. Pushing sample test lead to Zoho CRM Leads module...");
  const leadEndpoint = `${apiDomain}/crm/v2/Leads`;

  const testPayload = {
    data: [
      {
        First_Name: "CampusOS",
        Last_Name: "Test Lead",
        Email: "test.lead@msm-campusos-studio.local",
        Company: "MSM Studio Integration Verification",
        Lead_Source: "Website Integration Test",
        Description: `Automated test lead generated on ${new Date().toISOString()} to verify Zoho CRM integration is fully working.`,
      },
    ],
    trigger: ["approval", "workflow", "blueprint"],
  };

  try {
    const leadRes = await fetch(leadEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    const leadData = await leadRes.json();

    if (!leadRes.ok) {
      console.error(`❌ Zoho API returned HTTP ${leadRes.status}:`, leadData);
      process.exit(1);
    }

    const first = leadData?.data?.[0];
    if (first?.status === "success" || first?.code === "SUCCESS") {
      console.log("\n=======================================================");
      console.log("  🎉 SUCCESS! Zoho CRM is connected and working perfectly!");
      console.log("=======================================================\n");
      console.log(`Lead Name:  CampusOS Test Lead`);
      console.log(`Lead ID:    ${first.details?.id || "N/A"}`);
      console.log(`Status:     ${first.message}`);
      console.log(`\n👉 Open Zoho CRM in your browser:`);
      console.log(`   Go to the "Leads" tab and you will see "CampusOS Test Lead" listed there!`);
      console.log(`   (You can safely delete this test lead from Zoho CRM whenever you like.)\n`);
    } else {
      console.error("❌ Zoho rejected the lead:", first);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Error sending lead to Zoho API:", err.message);
    process.exit(1);
  }
}

testZoho();
