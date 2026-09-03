"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUp,
  Microphone,
  MicrophoneSlash,
  SpeakerHigh,
  SpeakerSlash,
  X,
} from "@phosphor-icons/react";
import { OrbAvatar, type OrbState } from "./OrbAvatar";
import { RichText } from "./RichText";
import { useVoice } from "./useVoice";

type Message = { role: "user" | "assistant"; content: string };

const OPENERS = [
  "Why are my leads expensive?",
  "Where should I put £5k a month?",
  "Is SEO still worth it?",
];

const GREETING =
  "I'm OSiQ. I know an unreasonable amount about digital marketing and I'm told I'm quite good company. What are you trying to fix?";

export function OSiQChat() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  // Seeded rather than pushed in on open: the greeting is always the first
  // message, so making it initial state avoids a render pass that shows an
  // empty transcript before it appears.
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const [insight, setInsight] = useState(false);
  /** Set once OSiQ has said its piece and pointed at the team. */
  const [handedOver, setHandedOver] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /* ------------------------------------------------------------- sending -- */

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      setError(null);
      setInput("");
      const next: Message[] = [...messagesRef.current, { role: "user", content: trimmed }];
      setMessages(next);
      setStreaming(true);
      // Empty assistant slot so tokens have somewhere to land as they arrive.
      setMessages([...next, { role: "assistant", content: "" }]);

      // The greeting is a static client-side line, not something OSiQ said.
      // Posting it back made the server count it as one of the two free
      // answers, so the visitor got one real answer and then the handover.
      // It also cost tokens on every turn for no benefit.
      const forServer = next.filter(
        (m, i) => !(i === 0 && m.role === "assistant" && m.content === GREETING)
      );

      try {
        const response = await fetch("/api/osiq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: forServer }),
        });

        if (!response.ok || !response.body) {
          const data = await response.json().catch(() => ({}));
          setMessages(next);
          setError(
            data?.error ??
              "I could not reach my brain just then. Try again in a moment."
          );
          setStreaming(false);
          return;
        }

        if (response.headers.get("X-OSiQ-Handover") === "1") setHandedOver(true);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assembled = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          assembled += decoder.decode(value, { stream: true });
          setMessages([...next, { role: "assistant", content: assembled }]);
        }

        setStreaming(false);

        // A brief red-point moment once an answer lands, then back to idle.
        if (assembled.trim()) {
          setInsight(true);
          window.setTimeout(() => setInsight(false), 1400);
          if (voiceReplies) speakRef.current?.(assembled);
        }

        // Fire-and-forget: never block the visitor on lead extraction, and
        // never surface its failures to them.
        const full = [...next, { role: "assistant" as const, content: assembled }];
        fetch("/api/osiq/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: full }),
        }).catch(() => {});
      } catch {
        setMessages(next);
        setError("Something broke on the way. Try that again.");
        setStreaming(false);
      }
    },
    [streaming, voiceReplies]
  );

  /* --------------------------------------------------------------- voice -- */

  const voice = useVoice({
    onFinalTranscript: (text) => {
      void send(text);
    },
  });
  const speakRef = useRef<((t: string) => void) | null>(null);
  useEffect(() => {
    speakRef.current = voice.speak;
  }, [voice.speak]);

  /* --------------------------------------------------------------- state -- */

  const orbState: OrbState = streaming
    ? "thinking"
    : voice.listening
      ? "listening"
      : voice.speaking
        ? "speaking"
        : insight
          ? "insight"
          : "idle";

  /* ------------------------------------------------------------- effects -- */

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Escape closes, and focus returns to the launcher so a keyboard user is not
  // dumped at the top of the document.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      voice.stopListening();
      voice.stopSpeaking();
    }
    // Only the open flag should drive this; the voice helpers are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ---------------------------------------------------------------- view -- */

  return (
    <>
      {/* Launcher */}
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close OSiQ" : "Open OSiQ, the marketing intelligence assistant"}
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full border bg-white/90 py-2 pl-2 pr-4 shadow-[0_10px_40px_rgba(0,0,0,0.16)] backdrop-blur transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)] hover:-translate-y-0.5 active:scale-[0.97]"
        style={{ borderColor: "rgba(26,26,26,0.12)" }}
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
      >
        <OrbAvatar state={open ? orbState : "idle"} size={40} />
        <span className="font-display text-sm font-semibold text-[#1a1a1a]">
          {open ? "Close" : "Ask OSiQ"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="OSiQ"
            aria-modal="false"
            className="fixed bottom-24 right-5 z-[70] flex w-[min(26rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            style={{ borderColor: "rgba(26,26,26,0.12)", maxHeight: "min(34rem, calc(100dvh - 8rem))" }}
            initial={reduced ? undefined : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 border-b px-4 py-3"
              style={{ borderColor: "rgba(26,26,26,0.1)" }}
            >
              <OrbAvatar state={orbState} size={34} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold leading-tight text-[#1a1a1a]">OSiQ</p>
                <p className="truncate text-[11px] text-[#6b6560]">
                  {streaming
                    ? "Thinking…"
                    : voice.listening
                      ? "Listening…"
                      : voice.speaking
                        ? "Speaking…"
                        : "Marketing operating intelligence"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVoiceReplies((v) => !v)}
                aria-pressed={voiceReplies}
                aria-label={voiceReplies ? "Turn spoken replies off" : "Turn spoken replies on"}
                className="rounded-full p-2 text-[#6b6560] transition-colors hover:bg-black/5 hover:text-[#1a1a1a]"
              >
                {voiceReplies ? <SpeakerHigh size={17} /> : <SpeakerSlash size={17} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                aria-label="Close OSiQ"
                className="rounded-full p-2 text-[#6b6560] transition-colors hover:bg-black/5 hover:text-[#1a1a1a]"
              >
                <X size={17} />
              </button>
            </div>

            {/* Transcript */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              data-lenis-prevent
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#1a1a1a] px-3.5 py-2.5 text-sm text-white"
                      : "max-w-[92%] text-sm leading-relaxed text-[#1a1a1a]"
                  }
                >
                  {m.content ? (
                    m.role === "assistant" ? (
                      <RichText text={m.content} />
                    ) : (
                      m.content
                    )
                  ) : (
                    <span className="inline-flex gap-1 py-1" aria-label="OSiQ is typing">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c8c5c0]"
                          style={{ animationDelay: `${d * 140}ms` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              ))}

              {voice.interim && (
                <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-black/5 px-3.5 py-2.5 text-sm italic text-[#6b6560]">
                  {voice.interim}
                </p>
              )}

              {messages.length <= 1 && !streaming && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {OPENERS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => void send(o)}
                      className="rounded-full border px-3 py-1.5 text-xs text-[#1a1a1a] transition-colors hover:bg-black/5 active:scale-[0.97]"
                      style={{ borderColor: "rgba(26,26,26,0.16)" }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}

              {/* OSiQ has met its objective. Rather than leaving the visitor
                  at a composer that will only repeat the hand-off line, give
                  them the two moves that actually exist: go and get the
                  assessment, or carry on talking. */}
              {handedOver && !streaming && (
                <div
                  className="mt-4 border-t pt-4"
                  style={{ borderColor: "rgba(26,26,26,0.1)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6b6560]">
                    Where next?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href="/audit"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#e8252a] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#c81e22] active:scale-[0.97]"
                    >
                      Leave my details
                      <ArrowUp size={13} weight="bold" className="rotate-45" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setHandedOver(false);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border px-3.5 py-2 text-xs font-semibold text-[#1a1a1a] transition-colors hover:bg-black/5 active:scale-[0.97]"
                      style={{ borderColor: "rgba(26,26,26,0.24)" }}
                    >
                      Keep chatting
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMessages([{ role: "assistant", content: GREETING }]);
                        setHandedOver(false);
                        setError(null);
                        voice.stopSpeaking();
                        setOpen(false);
                        launcherRef.current?.focus();
                      }}
                      className="rounded-full px-3.5 py-2 text-xs font-medium text-[#6b6560] transition-colors hover:bg-black/5 active:scale-[0.97]"
                    >
                      End chat
                    </button>
                  </div>
                </div>
              )}

              {(error || voice.error) && (
                <p role="alert" className="text-sm" style={{ color: "#c81e22" }}>
                  {error ?? voice.error}
                </p>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-end gap-2 border-t px-3 py-3"
              style={{ borderColor: "rgba(26,26,26,0.1)" }}
            >
              <label htmlFor="osiq-input" className="sr-only-focusable">
                Ask OSiQ a marketing question
              </label>
              <textarea
                id="osiq-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // Enter sends; Shift+Enter is a newline. Standard for chat,
                  // and the hint below says so rather than leaving it to luck.
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask about budgets, channels, funnels…"
                className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border bg-white px-3 py-2.5 text-sm text-[#1a1a1a] outline-none placeholder:text-[#9b958f] focus-visible:border-[#1a1a1a]"
                style={{ borderColor: "rgba(26,26,26,0.45)" }}
              />

              {voice.recognitionSupported && (
                <button
                  type="button"
                  onClick={voice.listening ? voice.stopListening : voice.startListening}
                  aria-pressed={voice.listening}
                  aria-label={voice.listening ? "Stop listening" : "Speak to OSiQ"}
                  className="shrink-0 rounded-full border p-2.5 transition-colors active:scale-[0.97]"
                  style={{
                    borderColor: voice.listening ? "#e8252a" : "rgba(26,26,26,0.45)",
                    color: voice.listening ? "#fff" : "#1a1a1a",
                    background: voice.listening ? "#e8252a" : "transparent",
                  }}
                >
                  {voice.listening ? <MicrophoneSlash size={17} /> : <Microphone size={17} />}
                </button>
              )}

              <button
                type="submit"
                disabled={!input.trim() || streaming}
                aria-label="Send"
                className="shrink-0 rounded-full p-2.5 text-white transition-[opacity,transform] active:scale-[0.97] disabled:opacity-35"
                style={{ background: "#e8252a" }}
              >
                <ArrowUp size={17} weight="bold" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
