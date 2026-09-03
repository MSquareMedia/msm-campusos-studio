"use client";

import { useEffect, useRef } from "react";
import gsap, { usePrefersReducedMotion } from "@/lib/motion";

/**
 * A left-to-right connected sequence (not a radial hub, deliberately, * SystemDiagram already owns that visual language on the About page, and
 * showing the same shape on every industry page read as repetitive). The
 * connecting line draws in and each stop pops in as you scroll past it.
 * Static under reduced motion.
 */
export function CapabilityFlow({ steps, className = "" }: { steps: string[]; className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const stopRefs = useRef<Array<SVGGElement | null>>([]);

  const width = 900;
  const y = 60;
  const startX = 70;
  const endX = width - 70;
  const step = steps.length > 1 ? (endX - startX) / (steps.length - 1) : 0;
  const points = steps.map((label, i) => ({ x: startX + step * i, label }));

  useEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    const ctx = gsap.context(() => {
      const stops = stopRefs.current.filter(Boolean) as SVGGElement[];
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
      }
      gsap.set(stops, { transformOrigin: "center", scale: 0.4, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(lineRef.current, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" });
      tl.to(stops, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.9 / steps.length, ease: "back.out(2.4)" }, 0.05);
    }, svgRef);
    return () => ctx.revert();
  }, [reducedMotion, steps.length]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} 140`}
      className={className}
      role="img"
      aria-label={`Connected sequence: ${steps.join(", ")}, delivered as one engagement.`}
    >
      <line
        ref={lineRef}
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke="var(--brand-accent)"
        strokeWidth="2"
      />
      {points.map((pt, i) => (
        <g
          key={pt.label}
          ref={(el) => {
            stopRefs.current[i] = el;
          }}
        >
          <circle cx={pt.x} cy={y} r="7" fill="var(--brand-accent)" />
          <circle cx={pt.x} cy={y} r="16" fill="none" stroke="var(--border)" strokeWidth="1.5" />
          <foreignObject
            x={pt.x - 70}
            y={i % 2 === 0 ? y - 62 : y + 24}
            width="140"
            height="40"
          >
            <div
              style={{
                width: "100%",
                textAlign: "center",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1.3,
                color: "var(--text)",
              }}
            >
              {pt.label}
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
}
