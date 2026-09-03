/**
 * Splits a headline into masked lines at its own sentence breaks, so the
 * staggered rise in TextReveal lands on the writer's punctuation rather than
 * on wherever the viewport happened to wrap the text. Returns a single line
 * when there is nothing to split on.
 *
 * Lives outside the "use client" motion module on purpose: Server Components
 * call it while composing props, and a function exported from a client module
 * cannot be invoked on the server.
 */
export function toLines(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]*\s*/g);
  if (!parts || parts.length < 2) return [text];
  return parts.map((p) => p.trim()).filter(Boolean);
}
