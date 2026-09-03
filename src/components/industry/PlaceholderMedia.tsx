const gradients: Record<string, string> = {
  automotive:
    "radial-gradient(120% 140% at 15% 10%, #3a3a3a 0%, #1a1a1a 45%, #0d0d0d 100%)",
  healthcare:
    "radial-gradient(120% 140% at 20% 15%, #33302c 0%, #1c1a17 45%, #100f0d 100%)",
  "real-estate":
    "radial-gradient(120% 140% at 25% 0%, #2e2a28 0%, #1a1a1a 50%, #0c0c0c 100%)",
  education:
    "radial-gradient(120% 140% at 20% 10%, #362222 0%, #1a1a1a 45%, #0d0d0d 100%)",
};

/**
 * Stand-in for licensed photography and film. Renders a labeled placeholder
 * so the layout, crop, and motion system can be reviewed before real assets
 * land. See the per-page asset manifest for shot direction and file names.
 */
export function PlaceholderMedia({
  variant,
  label,
  className = "",
}: {
  variant: "automotive" | "healthcare" | "real-estate" | "education";
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: gradients[variant] }}
      role="img"
      aria-label={label}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
        }}
        aria-hidden="true"
      />
      <span className="absolute bottom-3 right-3 rounded-[2px] bg-black/40 px-2 py-1 text-[10px] font-display uppercase tracking-[0.14em] text-white/70">
        Asset placeholder
      </span>
    </div>
  );
}
