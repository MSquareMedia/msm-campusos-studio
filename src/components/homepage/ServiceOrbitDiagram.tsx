"use client";

import { useEffect, useRef } from "react";
import gsap, { usePrefersReducedMotion } from "@/lib/motion";

const CENTER = { x: 450, y: 410 };
const RADIUS = 270;
const NODE_R = 66;

const NODES = [
  { label: ["Strategy"] },
  { label: ["Brand &", "Creative"] },
  { label: ["Demand &", "Media"] },
  { label: ["Digital", "Experience"] },
  { label: ["Data &", "AI"] },
].map((node, i) => {
  const angle = (-90 + i * 72) * (Math.PI / 180);
  return {
    ...node,
    x: CENTER.x + RADIUS * Math.cos(angle),
    y: CENTER.y + RADIUS * Math.sin(angle),
  };
});

/**
 * Radial hub-and-spoke map of the five service pillars, orbiting the
 * SOTAPO mark. Lines draw in and nodes scale up on scroll-into-view;
 * everything renders fully static (no GSAP) under reduced motion, since
 * this is decorative reinforcement of the detailed list rendered below it,
 * not the only place the information lives.
 */
export function ServiceOrbitDiagram() {
  const reducedMotion = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const centerRef = useRef<SVGGElement>(null);

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
      gsap.set(centerRef.current, { transformOrigin: "center", scale: 0.6, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(centerRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" });
      tl.to(lines, { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, "-=0.2");
      tl.to(nodes, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(2.2)" }, "-=0.5");
    }, svgRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 900 820"
      className="mx-auto w-full max-w-2xl"
      role="img"
      aria-label="SOTAPO at the center of five service pillars: Strategy, Brand and Creative, Demand and Media, Digital Experience, and Data and AI"
    >
      {NODES.map((node, i) => (
        <line
          key={`line-${i}`}
          ref={(el) => {
            lineRefs.current[i] = el;
          }}
          x1={CENTER.x}
          y1={CENTER.y}
          x2={node.x}
          y2={node.y}
          stroke="var(--border-inverse)"
          strokeWidth={1.5}
        />
      ))}

      {NODES.map((node, i) => (
        <g
          key={`node-${i}`}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
        >
          <circle cx={node.x} cy={node.y} r={NODE_R} fill="var(--surface-inverse-2)" stroke="var(--border-inverse)" strokeWidth={1.5} />
          <text x={node.x} y={node.y} textAnchor="middle" fill="var(--text-inverse)" className="font-display" fontSize={26} fontWeight={600}>
            {node.label.map((line, li) => (
              <tspan key={li} x={node.x} dy={li === 0 ? (node.label.length > 1 ? -8 : 8) : 30}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}

      <g ref={centerRef}>
        <circle cx={CENTER.x} cy={CENTER.y} r={100} fill="var(--brand-accent)" />
        <text x={CENTER.x} y={CENTER.y - 10} textAnchor="middle" fill="#fff" className="font-display" fontSize={30} fontWeight={800}>
          <tspan x={CENTER.x} dy={0}>MSM</tspan>
          <tspan x={CENTER.x} dy={34}>CampusOS</tspan>
        </text>
      </g>
    </svg>
  );
}
