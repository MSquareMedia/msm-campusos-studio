"use client";

import { useEffect, useRef } from "react";
import gsap, { usePrefersReducedMotion } from "@/lib/motion";

const NODES = [
  { x: 300, y: 60, label: "Strategy" },
  { x: 452, y: 171, label: "Brand and creative" },
  { x: 394, y: 349, label: "Media and distribution" },
  { x: 206, y: 349, label: "Digital experience" },
  { x: 148, y: 171, label: "Data and measurement" },
];

const HUB = { x: 300, y: 220 };

/**
 * Illustrates the operating model, not a data claim: every discipline
 * routes through one connected engagement rather than sitting in a
 * separate workstream. No numbers, so nothing here can go stale or
 * misrepresent results.
 *
 * Lines draw in and nodes pop in on scroll-into-view (same technique as
 * ServiceOrbitDiagram on the homepage): plain GSAP + ScrollTrigger, no
 * pin, fully static under reduced motion.
 */
export function SystemDiagram({ className = "" }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const hubRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (reducedMotion || !svgRef.current) return;
    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter(Boolean) as SVGLineElement[];
      const nodes = nodeRefs.current.filter(Boolean) as SVGGElement[];

      lines.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(nodes, { transformOrigin: "center", scale: 0.5, opacity: 0 });
      gsap.set(hubRef.current, { transformOrigin: "center", scale: 0.6, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(hubRef.current, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2)" });
      tl.to(lines, { strokeDashoffset: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }, "-=0.15");
      tl.to(nodes, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.07, ease: "back.out(2.2)" }, "-=0.4");
    }, svgRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 420"
      className={className}
      role="img"
      aria-label="Diagram showing strategy, brand and creative, media and distribution, digital experience, and data and measurement all connected through one SOTAPO engagement."
    >
      <g stroke="var(--border)" strokeWidth="1.5">
        {NODES.map((node, i) => (
          <line
            key={node.label}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            x1={HUB.x}
            y1={HUB.y}
            x2={node.x}
            y2={node.y}
          />
        ))}
      </g>

      {NODES.map((node, i) => (
        <g
          key={node.label}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
        >
          <circle cx={node.x} cy={node.y} r="40" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <foreignObject x={node.x - 52} y={node.y - 40} width="104" height="80">
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: 1.25,
                color: "var(--text)",
                padding: "0 4px",
              }}
            >
              {node.label}
            </div>
          </foreignObject>
        </g>
      ))}

      <g ref={hubRef}>
        <circle cx={HUB.x} cy={HUB.y} r="58" fill="var(--brand-accent)" />
        <foreignObject x={HUB.x - 52} y={HUB.y - 40} width="104" height="80">
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#ffffff",
            }}
          >
            SOTAPO
          </div>
        </foreignObject>
      </g>
    </svg>
  );
}
