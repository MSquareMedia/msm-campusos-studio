import Anthropic from "@anthropic-ai/sdk";
import { OSIQ_EXTRACT_PROMPT } from "@/lib/osiq-prompt";
import { insertSubmission, isConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS = ["name", "email", "organisation", "industry", "goal", "budget"] as const;

/**
 * Pulls whatever qualification detail the conversation has surfaced and files
 * it against the same submissions table as the forms.
 *
 * Separate from the chat route on purpose: extraction must never delay a reply
 * the visitor is waiting on, and it runs on a much cheaper model. It is called
 * opportunistically by the client, so it has to be safe to call repeatedly and
 * safe to fail silently.
 */
export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  // No key or no database means there is nothing useful to do. Return quietly
  // rather than erroring: this is a background nicety, and a visitor mid-chat
  // should never see a failure from it.
  if (!apiKey || !isConfigured()) {
    return Response.json({ ok: false, stored: false });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { messages } = (body ?? {}) as { messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const transcript = messages
    .slice(-24)
    .map((m) => {
      const msg = m as { role?: string; content?: string };
      if (typeof msg.content !== "string") return "";
      return `${msg.role === "assistant" ? "OSiQ" : "User"}: ${msg.content.slice(0, 2000)}`;
    })
    .filter(Boolean)
    .join("\n");

  if (!transcript) return Response.json({ ok: false }, { status: 400 });

  try {
    const client = new Anthropic({ apiKey });
    const result = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: OSIQ_EXTRACT_PROMPT,
      messages: [{ role: "user", content: transcript }],
    });

    const text = result.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();

    // The model is told to return raw JSON, but a stray code fence should
    // degrade to "captured nothing", never to a 500 in the visitor's console.
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return Response.json({ ok: true, stored: false });

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return Response.json({ ok: true, stored: false });
    }

    const payload: Record<string, string> = {};
    for (const field of FIELDS) {
      const value = parsed[field];
      if (typeof value === "string" && value.trim()) {
        payload[field] = value.trim().slice(0, 500);
      }
    }

    // Only file a row once there is a way to reach them, or a stated goal.
    // Otherwise every idle "what is CPC" question becomes a lead row.
    if (!payload.email && !payload.goal) {
      return Response.json({ ok: true, stored: false });
    }

    payload.transcript = transcript.slice(0, 4500);
    await insertSubmission("osiq", payload);
    return Response.json({ ok: true, stored: true });
  } catch (error) {
    console.error("osiq capture failed", error);
    return Response.json({ ok: false, stored: false });
  }
}
