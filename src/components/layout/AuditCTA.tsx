import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { auditCta } from "@/lib/site-config";

/**
 * The free-assessment CTA, carried in the header beside the contact link and
 * again in the footer.
 *
 * This is the highlighted one of the two: it asks for less (six questions, no
 * call) and it is the offer worth interrupting for, so it takes the accent
 * fill and the contact link steps down to a quieter treatment. Two filled red
 * buttons side by side would cancel each other out and the visitor would read
 * neither as the priority.
 *
 * The motion is a slow sheen that crosses the button on a long loop, plus a
 * faster sweep on hover. It is a CSS animation rather than JS so it runs off
 * the main thread, and it is deliberately unhurried: this element sits on
 * every page of the site, and anything insistent at that frequency becomes
 * irritating by the third page. Reduced motion drops the loop entirely and
 * keeps the static button.
 */
export function AuditCTA({ className = "" }: { className?: string }) {
  return (
    <Link
      href={auditCta.href}
      className={`audit-cta group relative isolate inline-flex shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap bg-[var(--brand-accent)] px-5 py-3 font-display text-sm font-semibold text-white transition-[background-color,transform] duration-200 [transition-timing-function:var(--ease-out-strong)] hover:bg-[var(--brand-accent-dark)] active:scale-[0.97] ${className}`}
    >
      <span className="relative z-10">{auditCta.label}</span>
      <ArrowRight
        size={15}
        weight="bold"
        aria-hidden="true"
        className="relative z-10 transition-transform duration-200 [transition-timing-function:var(--ease-out-strong)] group-hover:translate-x-1"
      />
      <span className="audit-cta-sheen" aria-hidden="true" />
    </Link>
  );
}
