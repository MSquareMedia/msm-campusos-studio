import type { ReactNode } from "react";

/**
 * Minimal markdown renderer for OSiQ's replies.
 *
 * The model emits light markdown whatever the prompt says, and rendering it as
 * plain text put literal asterisks on screen and collapsed every list into one
 * run-on paragraph. A full markdown library is far more surface area than a
 * chat bubble needs, so this handles exactly what actually shows up: bold,
 * italic, inline code, bullets, and paragraph breaks.
 *
 * Everything is built as React elements. Nothing goes through
 * dangerouslySetInnerHTML, this text originates from a model that is quoting
 * whatever a visitor typed at it, so it is untrusted by definition and must
 * never be able to inject markup.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  return text.split(INLINE).filter(Boolean).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={key} className="rounded bg-black/[0.06] px-1 py-0.5 text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

export function RichText({ text }: { text: string }) {
  // Headings are stripped rather than rendered: a chat bubble has no room for
  // a hierarchy, and an <h3> inside the transcript would also pollute the
  // page's real heading outline for screen-reader users.
  const lines = text.replace(/^#{1,6}\s+/gm, "").split("\n");

  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    const key = `p-${blocks.length}`;
    blocks.push(
      <p key={key} className="whitespace-pre-wrap">
        {renderInline(paragraph.join(" "), key)}
      </p>
    );
    paragraph = [];
  }

  function flushBullets() {
    if (!bullets.length) return;
    const key = `ul-${blocks.length}`;
    blocks.push(
      <ul key={key} className="list-disc space-y-1 pl-5">
        {bullets.map((b, i) => (
          <li key={`${key}-${i}`}>{renderInline(b, `${key}-${i}`)}</li>
        ))}
      </ul>
    );
    bullets = [];
  }

  for (const raw of lines) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/) ?? line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      bullets.push(bullet[1]);
      continue;
    }
    if (!line) {
      flushParagraph();
      flushBullets();
      continue;
    }
    flushBullets();
    paragraph.push(line);
  }
  flushParagraph();
  flushBullets();

  return <div className="space-y-2.5">{blocks}</div>;
}
