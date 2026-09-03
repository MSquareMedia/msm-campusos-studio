import Anthropic from "@anthropic-ai/sdk";
import { OSIQ_SYSTEM_PROMPT } from "@/lib/osiq-prompt";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 40;
const MAX_CHARS = 4000;

/** Answers given away free before OSiQ hands over to the humans. */
const FREE_ANSWERS = 2;

/**
 * The handover, enforced on the server rather than left to the prompt.
 *
 * The model is also told the rule, but a prompt is a preference, not a
 * control: anyone can POST a trimmed message array and get unlimited answers,
 * which is both a cost problem and defeats the point of the gate. Counting the
 * turns here is the part that actually holds.
 *
 * Varied so a visitor who keeps pushing does not get the same sentence back
 * every time.
 */
const HANDOVER = [
  "That is the point where I stop being useful and the humans start. This needs Nikhil Sharda's creative read and Mudit Kalia's analytical one on it properly. Leave your name and email and the team will come back to you, and they don't come empty handed.",
  "I could keep going, but you'd be getting my version of an answer when there is a much better one available. This is Nikhil Sharda and Mudit Kalia territory now: one creative, one analytical, both worth your time. Drop your details and they'll pick it up, with something in hand.",
  "Genuinely, the next answer is worth more coming from the team than from me. Nikhil Sharda on the creative side, Mudit Kalia on the numbers. Name and email, and they'll be in touch, and they never turn up empty handed.",
];

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const ip = clientIp(request);
  // 12 messages/minute is far above conversational pace and far below what a
  // script would want. Shared across instances via Redis when configured.
  const limited = await rateLimit("osiq", ip, 12, 60);
  if (!limited.success) {
    return Response.json(
      { error: "Give me a second to catch up, try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const { messages } = (body ?? {}) as { messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages supplied." }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Conversation too long." }, { status: 400 });
  }

  const clean: ChatMessage[] = [];
  for (const m of messages) {
    const msg = m as { role?: unknown; content?: unknown };
    if (msg.role !== "user" && msg.role !== "assistant") {
      return Response.json({ error: "Bad message role." }, { status: 400 });
    }
    if (typeof msg.content !== "string" || msg.content.length > MAX_CHARS) {
      return Response.json({ error: "Bad message content." }, { status: 400 });
    }
    clean.push({ role: msg.role, content: msg.content });
  }

  // Turn gate. Counted from the transcript the client sends, so trimming the
  // array to dodge it just means OSiQ has no context and answers worse.
  // The client strips its static greeting before posting, so only real
  // answers are counted here.
  const answersGiven = clean.filter((m) => m.role === "assistant").length;
  if (answersGiven >= FREE_ANSWERS) {
    const line = HANDOVER[Math.floor(Math.random() * HANDOVER.length)];
    return new Response(line, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        // Tells the client OSiQ has met its objective, so it can offer the
        // hand-off choice rather than leaving the visitor at a dead end with
        // a composer that will only ever repeat the same line back.
        "X-OSiQ-Handover": "1",
      },
    });
  }

  // Config is checked after validation so a malformed request is rejected as
  // malformed whether or not a key happens to be set. Same principle as the
  // submissions route otherwise: admit it is not wired up rather than serve a
  // canned reply the visitor would mistake for OSiQ thinking.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Visitor-facing copy stays human: an env var name means nothing to them
    // and reads as a broken site. `code` carries the diagnosis for whoever is
    // actually configuring this, and the server log spells it out.
    console.error("OSiQ chat called with no ANTHROPIC_API_KEY set.");
    return Response.json(
      {
        error:
          "I'm not plugged into my brain yet, someone still has to flip that switch. Meanwhile the free audit is a good way to get real answers from the team.",
        code: "not_configured",
      },
      { status: 503 }
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const stream = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 900,
      system: OSIQ_SYSTEM_PROMPT,
      messages: clean,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (error) {
          console.error("osiq stream failed", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("osiq request failed", error);
    return Response.json({ error: "OSiQ could not answer that one." }, { status: 502 });
  }
}
