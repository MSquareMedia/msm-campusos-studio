#!/usr/bin/env node

/**
 * Zoho CRM OAuth Refresh Token Helper
 *
 * This interactive CLI script takes your Zoho Self-Client Grant Token and
 * exchanges it for a permanent Refresh Token, printing the exact values to
 * put in your .env.local or GitHub Actions Secrets.
 *
 * Run with:
 *   node scripts/zoho-auth.mjs
 *   or:
 *   npm run zoho:token
 */

import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, (ans) => resolve(ans.trim())));

const DC_OPTIONS = {
  1: { accounts: "https://accounts.zoho.com", api: "https://www.zohoapis.com", name: "US / Global (.com)" },
  2: { accounts: "https://accounts.zoho.in", api: "https://www.zohoapis.in", name: "India (.in)" },
  3: { accounts: "https://accounts.zoho.eu", api: "https://www.zohoapis.eu", name: "Europe (.eu)" },
  4: { accounts: "https://accounts.zoho.com.au", api: "https://www.zohoapis.com.au", name: "Australia (.com.au)" },
  5: { accounts: "https://accounts.zoho.com.cn", api: "https://www.zohoapis.com.cn", name: "China (.com.cn)" },
};

async function main() {
  console.log("\n=======================================================");
  console.log("  Zoho CRM OAuth Token Generator");
  console.log("=======================================================\n");
  console.log("Step 1: Open https://api-console.zoho.com in your browser.");
  console.log("Step 2: Click 'Add Client' -> choose 'Self Client'.");
  console.log("Step 3: In the 'Generate Code' tab:");
  console.log("        Scope: ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.READ");
  console.log("        Time Duration: 10 minutes");
  console.log("        Scope Description: CampusOS Leads");
  console.log("Step 4: Click 'Create' and copy the generated grant code.\n");

  console.log("Select your Zoho Data Center region:");
  console.log("  [1] US / Global (.com) - default");
  console.log("  [2] India (.in)");
  console.log("  [3] Europe (.eu)");
  console.log("  [4] Australia (.com.au)");
  console.log("  [5] China (.com.cn)");
  const dcChoice = (await question("Enter region number (1-5) [default: 1]: ")) || "1";
  const dc = DC_OPTIONS[dcChoice] || DC_OPTIONS[1];

  console.log(`\nUsing: ${dc.name}`);
  const clientId = await question("\nEnter your Client ID: ");
  if (!clientId) {
    console.error("Error: Client ID is required.");
    rl.close();
    return;
  }

  const clientSecret = await question("Enter your Client Secret: ");
  if (!clientSecret) {
    console.error("Error: Client Secret is required.");
    rl.close();
    return;
  }

  const grantCode = await question("Enter the generated Grant Code (starts with 1000....): ");
  if (!grantCode) {
    console.error("Error: Grant Code is required.");
    rl.close();
    return;
  }

  rl.close();

  console.log("\nExchanging grant code for refresh token with Zoho...");

  try {
    const tokenUrl = `${dc.accounts}/oauth/v2/token`;
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code: grantCode,
    });

    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.error("\n❌ Failed to generate token!");
      console.error(`Zoho error: ${data.error || res.statusText}`);
      if (data.error === "invalid_code") {
        console.error("Note: Zoho grant codes expire in strictly 10 minutes. If expired, generate a new code in the console.");
      }
      return;
    }

    const refreshToken = data.refresh_token;
    const apiDomain = data.api_domain || dc.api;

    if (!refreshToken) {
      console.error("\n❌ No refresh token returned. Did you use the 'Self Client' flow with offline access?");
      console.log("Response:", JSON.stringify(data, null, 2));
      return;
    }

    console.log("\n=======================================================");
    console.log("  ✅ SUCCESS! Zoho CRM Refresh Token Generated");
    console.log("=======================================================\n");
    console.log("Add the following lines to your .env.local file (and GitHub Secrets for PROD):\n");
    console.log(`ZOHO_CLIENT_ID=${clientId}`);
    console.log(`ZOHO_CLIENT_SECRET=${clientSecret}`);
    console.log(`ZOHO_REFRESH_TOKEN=${refreshToken}`);
    console.log(`ZOHO_ACCOUNTS_DOMAIN=${dc.accounts}`);
    console.log(`ZOHO_API_DOMAIN=${apiDomain}\n`);
    console.log("Done! Your application will now automatically push leads to Zoho CRM.\n");
  } catch (err) {
    console.error("Network or script error:", err);
  }
}

main();
