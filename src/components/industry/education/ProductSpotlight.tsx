import Image from "next/image";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { FadeUp } from "@/components/motion/TextReveal";
import type { ProductFeature } from "@/content/types";

/**
 * Spotlight for the platform named in the Infrastructure service line. The
 * logo sits on a white patch so its red and black artwork reads on the page
 * gradient, and the CTA leaves the site for the product's own home.
 */
export function ProductSpotlight({ product }: { product: ProductFeature }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <FadeUp>
          <div
            className="grid items-center gap-10 border p-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 md:p-14"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-center bg-white px-8 py-10 md:px-10 md:py-14">
              <Image
                src={product.logo.src}
                alt={product.logo.alt}
                width={product.logo.width}
                height={product.logo.height}
                sizes="(min-width: 768px) 360px, 260px"
                className="h-auto w-[260px] md:w-[360px]"
              />
            </div>
            <div>
              <span className="eyebrow text-[var(--brand-accent)]">{product.eyebrow}</span>
              <h2 className="font-display mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
                {product.heading}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
                {product.body}
              </p>
              <ul className="mt-6 flex flex-col gap-2">
                {product.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm font-medium md:text-base">
                    <Check size={18} weight="bold" color="var(--brand-accent)" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href={product.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display mt-8 inline-flex items-center gap-2 bg-[var(--brand-accent)] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                {product.cta.label}
                <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
