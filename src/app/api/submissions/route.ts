import { NextResponse } from "next/server";
import { insertSubmission, isConfigured, type SubmissionKind } from "@/lib/db";
import { pushLeadToZoho, isZohoConfigured } from "@/lib/zoho";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
// This route writes; it must never be prerendered or cached.
export const dynamic = "force-dynamic";

const KINDS: SubmissionKind[] = ["audit", "contact", "careers", "osiq"];

/** Caps chosen well above any legitimate answer in the three flows. */
const MAX_FIELDS = 40;
const MAX_KEY = 64;
const MAX_VALUE = 5000;

export async function POST(request: Request) {
  const ip = clientIp(request);
  // Shared across instances when Redis is configured; see lib/rate-limit.ts.
  const limited = await rateLimit("submissions", ip, 8, 60);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many submissions." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { kind, payload } = (body ?? {}) as {
    kind?: unknown;
    payload?: unknown;
  };

  if (typeof kind !== "string" || !KINDS.includes(kind as SubmissionKind)) {
    return NextResponse.json({ error: "Unknown submission type." }, { status: 400 });
  }
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return NextResponse.json({ error: "Malformed payload." }, { status: 400 });
  }

  // Re-validate shape and size on the server. Client validation is a courtesy
  // to the user; it is not a control, because anything can POST here.
  const entries = Object.entries(payload as Record<string, unknown>);
  if (entries.length > MAX_FIELDS) {
    return NextResponse.json({ error: "Too many fields." }, { status: 400 });
  }
  const clean: Record<string, string> = {};
  for (const [key, value] of entries) {
    if (typeof key !== "string" || key.length > MAX_KEY) {
      return NextResponse.json({ error: "Malformed field name." }, { status: 400 });
    }
    if (typeof value !== "string") {
      return NextResponse.json({ error: "Malformed field value." }, { status: 400 });
    }
    if (value.length > MAX_VALUE) {
      return NextResponse.json({ error: "A field was too long." }, { status: 400 });
    }
    clean[key] = value;
  }

  const dbReady = isConfigured();
  const zohoReady = isZohoConfigured();

  if (!dbReady && !zohoReady) {
    // Neither database nor Zoho CRM is attached yet. Report this honestly
    // instead of returning a success the caller would show as "received".
    return NextResponse.json(
      { error: "Submission storage is not configured yet.", code: "not_configured" },
      { status: 503 }
    );
  }

  let dbSaved = false;
  if (dbReady) {
    try {
      await insertSubmission(kind as SubmissionKind, clean);
      dbSaved = true;
    } catch (error) {
      console.error("[submissions] Database insert failed:", error);
    }
  }

  let zohoPushed = false;
  if (zohoReady) {
    const zohoResult = await pushLeadToZoho(kind as SubmissionKind, clean);
    zohoPushed = zohoResult.success;
  }

  // If at least one destination received the submission, report success.
  if (dbSaved || zohoPushed) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  return NextResponse.json({ error: "Could not save submission." }, { status: 500 });
}
