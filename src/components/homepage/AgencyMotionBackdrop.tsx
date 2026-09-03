/**
 * Industry-neutral animated backdrop: slow-drifting blurred gradient blobs
 * over a dark base, pure CSS (see .agency-blob-* in globals.css). Used
 * anywhere the homepage needs motion but has no specific photo to show, * the homepage covers four industries at once, so it deliberately never
 * borrows a single industry's imagery (e.g. Education's brand-film still).
 */
export function AgencyMotionBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: "var(--surface-inverse)" }}
      aria-hidden="true"
    >
      <div
        className="agency-blob-a absolute -left-[10%] -top-[15%] h-[70%] w-[70%] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.55,
        }}
      />
      <div
        className="agency-blob-b absolute -right-[15%] top-[10%] h-[65%] w-[65%] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--brand-accent-dark) 0%, transparent 70%)",
          filter: "blur(70px)",
          opacity: 0.45,
        }}
      />
      <div
        className="agency-blob-c absolute bottom-[-20%] left-[20%] h-[60%] w-[60%] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--surface-inverse-2) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}
