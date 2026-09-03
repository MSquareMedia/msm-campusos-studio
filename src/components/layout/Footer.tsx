import Link from "next/link";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { MSMLogo } from "./MSMLogo";
import { footerLinks, primaryCta } from "@/lib/site-config";
import { AuditCTA } from "./AuditCTA";

export function Footer() {
  return (
    <footer
      className="mt-auto border-t"
      style={{ background: "var(--surface-inverse)", borderColor: "var(--border-inverse)" }}
    >
      <div className="container-page py-16 text-[var(--text-inverse)]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <MSMLogo inverse />
            <p className="mt-4 max-w-xs text-sm text-[var(--text-inverse-muted)]">
              A growth agency for business. An operating system for education. One
              accountable team behind both.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <AuditCTA />
              <Link
                href={primaryCta.href}
                className="font-display text-sm font-medium text-[var(--text-inverse)] underline-offset-4 transition-colors hover:text-[var(--brand-accent)] hover:underline"
              >
                {primaryCta.label}
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/msm-campusos/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MSM CampusOS on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                style={{ borderColor: "var(--border-inverse)", color: "var(--text-inverse-muted)" }}
              >
                <LinkedinLogo size={18} weight="fill" aria-hidden="true" />
              </a>
            </div>
          </div>

          <FooterColumn title="Industries" links={footerLinks.industries} />
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
        </div>

        <div
          className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs text-[var(--text-inverse-muted)] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--border-inverse)" }}
        >
          <p>&copy; {new Date().getFullYear()} MSM Unify. All rights reserved.</p>
          <p>SOTAPO is an initiative of MSM Unify. In education, Sotapo Education is powered by MSM CampusOS.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow text-[var(--text-inverse-muted)]">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--text-inverse-muted)] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
