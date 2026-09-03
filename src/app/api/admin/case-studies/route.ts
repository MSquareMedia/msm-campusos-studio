import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllRecords } from "@/lib/case-studies-content";
import { upsertRecord, getRecord, isConfigured } from "@/lib/case-studies-db";
import { validateRecord } from "@/lib/case-study-validation";

// Auth for everything under here is enforced by middleware.ts (Basic auth,
// matcher covers /api/admin/:path*), these handlers assume that already ran.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function revalidateAll() {
  for (const path of [
    "/",
    "/case-studies",
    "/work",
    "/campusos",
    "/automotive",
    "/healthcare",
    "/real-estate",
  ]) {
    revalidatePath(path);
  }
}

export async function GET() {
  const records = await getAllRecords();
  return NextResponse.json({ records, configured: isConfigured() });
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "No database attached yet, see ADMIN_SETUP.md." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const result = validateRecord(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const existing = await getRecord(result.record.slug);
  if (existing) {
    return NextResponse.json(
      { error: "A case study with this slug already exists." },
      { status: 409 }
    );
  }

  await upsertRecord(result.record);
  revalidateAll();
  revalidatePath(`/work/${result.record.slug}`);

  return NextResponse.json({ ok: true, record: result.record }, { status: 201 });
}
