import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getRecordBySlug } from "@/lib/case-studies-content";
import { upsertRecord, deleteRecord, getRecord, isConfigured } from "@/lib/case-studies-db";
import { validateRecord } from "@/lib/case-study-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function revalidateAll(slug: string) {
  for (const path of [
    "/",
    "/case-studies",
    "/work",
    `/work/${slug}`,
    "/campusos",
    "/automotive",
    "/healthcare",
    "/real-estate",
  ]) {
    revalidatePath(path);
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const record = await getRecordBySlug(slug);
  if (!record) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ record });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "No database attached yet, see ADMIN_SETUP.md." },
      { status: 503 }
    );
  }

  const { slug } = await params;

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
  if (result.record.slug !== slug) {
    return NextResponse.json({ error: "Slug in body must match the URL." }, { status: 400 });
  }

  const existing = await getRecord(slug);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await upsertRecord(result.record);
  revalidateAll(slug);

  return NextResponse.json({ ok: true, record: result.record });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "No database attached yet, see ADMIN_SETUP.md." },
      { status: 503 }
    );
  }

  const { slug } = await params;
  const existing = await getRecord(slug);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await deleteRecord(slug);
  revalidateAll(slug);

  return NextResponse.json({ ok: true });
}
