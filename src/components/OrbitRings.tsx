/**
 * Decorative concentric rings that slowly rotate behind hero copy, the way
 * salo.uk's radar motif signals "this is a living system" before any copy
 * loads. Pure CSS animation (transform only), respects reduced-motion via
 * the .orbit-ring keyframe being gated in globals.css.
 */
export function OrbitRings({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 600" className="h-full w-full opacity-[0.14]">
        <circle cx="300" cy="300" r="120" fill="none" stroke="white" strokeWidth="1" className="orbit-ring orbit-ring-1" />
        <circle cx="300" cy="300" r="200" fill="none" stroke="white" strokeWidth="1" className="orbit-ring orbit-ring-2" />
        <circle cx="300" cy="300" r="280" fill="none" stroke="white" strokeWidth="1" className="orbit-ring orbit-ring-3" />
        <circle cx="300" cy="180" r="4" fill="var(--brand-accent)" className="orbit-ring orbit-ring-1" />
        <circle cx="420" cy="300" r="3" fill="white" className="orbit-ring orbit-ring-2" />
      </svg>
    </div>
  );
}
