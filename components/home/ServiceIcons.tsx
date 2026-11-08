"use client";
import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

// The services' icons, drawn after the client's reference (a line icon on a 512 grid, 22-unit rounded lines inside a
// scanner's four corners), all in white on the card, each moving the way its service does. Lines draw in when the card
// is reached; the motion runs only while the card is in front.

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type Draw = { seen: boolean; reduced: boolean };

/** A turning or rocking part, about a point given in the icon's own units. */
const about = (x: number, y: number): CSSProperties => ({ transformBox: "view-box", transformOrigin: `${x}px ${y}px` });

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** A cog: `teeth` flat-topped teeth between two radii, the first centred on `phase` degrees. The teeth take half the
 *  root, so the gaps stay open under 22-unit lines. */
function cog(cx: number, cy: number, teeth: number, outer: number, inner: number, phase = 0) {
  const step = (Math.PI * 2) / teeth;
  const start = (phase * Math.PI) / 180;
  const points: string[] = [];
  for (let k = 0; k < teeth; k++) {
    const a = start + k * step;
    for (const [r, t] of [
      [inner, a - 0.25 * step],
      [outer, a - 0.12 * step],
      [outer, a + 0.12 * step],
      [inner, a + 0.25 * step],
    ]) {
      points.push(`${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`);
    }
  }
  return `M${points.join("L")}Z`;
}

/** A line that draws itself in once its card is reached and goes again when the reader scrolls back above it. */
function Line({
  d,
  seen,
  reduced,
  delay = 0,
  stroke,
  strokeWidth,
  className,
}: Draw & { d: string; delay?: number; stroke?: string; strokeWidth?: number; className?: string }) {
  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      className={className}
      initial={false}
      animate={seen ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { pathLength: { duration: 1.1, delay, ease: EASE_OUT }, opacity: { duration: 0.15, delay } }
      }
    />
  );
}

/** Air on the move: a dashed line whose dashes run along it, fading in with the drawing. */
function Air({ d, seen, reduced, delay = 0 }: Draw & { d: string; delay?: number }) {
  return (
    <motion.path
      d={d}
      strokeDasharray="56 34"
      initial={false}
      animate={{ opacity: seen ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.6, delay }}
      className="animate-[flow_1.5s_linear_infinite] motion-reduce:animate-none"
    />
  );
}

/** The reference's frame: four corners, as a scanner's. */
function Frame(p: Draw) {
  return (
    <g>
      {["M11 92V11H92", "M420 11H501V92", "M501 420V501H420", "M92 501H11V420"].map((d, i) => (
        <Line key={d} d={d} {...p} delay={i * 0.08} />
      ))}
    </g>
  );
}

/** The icon's sheet: a 512 grid of 22-unit rounded lines inside the frame. Off the front card its motion holds still. */
export function Glyph({ active, className, children, ...p }: Draw & { active: boolean; className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      stroke="white"
      strokeWidth={22}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`overflow-visible ${active ? "" : "[&_*]:[animation-play-state:paused]"} ${className ?? ""}`}
    >
      <Frame {...p} />
      {children}
    </svg>
  );
}

// a fan blade from the hub out to its tip, leaning with the turn
const BLADE = "M256 200C240 168 244 136 272 122C292 148 292 180 270 206Z";

/** Ventilation: a fan turning in its housing, air running out under it. */
export function VentIcon(p: Draw) {
  return (
    <>
      <Line d={circle(256, 222, 128)} {...p} delay={0.15} />
      <g className="animate-[orbit_2.4s_linear_infinite] motion-reduce:animate-none" style={about(256, 222)}>
        {[0, 90, 180, 270].map((a, i) => (
          <g key={a} transform={`rotate(${a} 256 222)`}>
            <Line d={BLADE} {...p} delay={0.3 + i * 0.06} />
          </g>
        ))}
      </g>
      <Line d={circle(256, 222, 18)} {...p} delay={0.5} />
      <Air d="M128 404Q192 372 256 404T384 404" {...p} delay={0.7} />
      <Air d="M176 452Q216 430 256 452T336 452" {...p} delay={0.8} />
    </>
  );
}

// a snowflake's arm, its two branches out near the tip so the 22-unit lines stay apart
const ARM = "M256 352V268M240 274L256 290L272 274";

/** Cooling: a wall unit, cold air falling either side of a turning snowflake. */
export function CoolIcon(p: Draw) {
  return (
    <>
      <Line
        d="M122 104H390A34 34 0 0 1 424 138V192A34 34 0 0 1 390 226H122A34 34 0 0 1 88 192V138A34 34 0 0 1 122 104Z"
        {...p}
        delay={0.15}
      />
      <Line d="M136 186H376" {...p} delay={0.4} />
      <Line d="M380 146h.01" {...p} delay={0.5} />
      <Air d="M128 266Q112 304 128 342T128 418" {...p} delay={0.7} />
      <Air d="M384 266Q400 304 384 342T384 418" {...p} delay={0.75} />
      <g className="animate-[orbit_22s_linear_infinite] motion-reduce:animate-none" style={about(256, 352)}>
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <g key={a} transform={`rotate(${a} 256 352)`}>
            <Line d={ARM} {...p} delay={0.45 + i * 0.05} />
          </g>
        ))}
      </g>
    </>
  );
}

/** Manufacturing: the works under a sawtooth roof, its windows lit one after another, smoke rings leaving the stack. */
export function FactoryIcon(p: Draw) {
  return (
    <>
      <Line d="M120 446V120H168V276L248 228V276L328 228V276L400 232V446Z" {...p} delay={0.15} />
      {["M196 360H232", "M266 360H302", "M336 360H372"].map((d, i) => (
        <g
          key={d}
          className="animate-[glow_2.4s_ease-in-out_infinite] motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.8}s` }}
        >
          <Line d={d} {...p} delay={0.55 + i * 0.08} />
        </g>
      ))}
      <motion.g
        initial={false}
        animate={{ opacity: p.seen ? 1 : 0 }}
        transition={p.reduced ? { duration: 0 } : { duration: 0.6, delay: 0.9 }}
        className="motion-reduce:hidden"
      >
        {["0s", "1s", "2s"].map((delay) => (
          <path
            key={delay}
            d={circle(150, 84, 16)}
            className="animate-[puff_3s_ease-out_infinite] opacity-0 [transform-box:fill-box] [transform-origin:center]"
            style={{ animationDelay: delay }}
          />
        ))}
      </motion.g>
    </>
  );
}

// lucide's wrench (ISC), on its 24 grid
const WRENCH =
  "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z";
const WRENCH_SCALE = 13;

/** Service: a cog turning slowly behind a wrench that works at it. The wrench is filled with the card, so it covers
 *  the cog where it lies across it. */
export function ServiceIcon(p: Draw) {
  return (
    <>
      <g className="animate-[orbit_14s_linear_infinite] motion-reduce:animate-none" style={about(214, 300)}>
        <Line d={cog(214, 300, 7, 118, 90)} {...p} delay={0.15} />
      </g>
      <Line d={circle(214, 300, 32)} {...p} delay={0.4} />
      <g className="animate-[rock_2.6s_ease-in-out_infinite] motion-reduce:animate-none" style={about(326, 172)}>
        <g transform={`translate(118 64) scale(${WRENCH_SCALE})`}>
          <Line d={WRENCH} {...p} strokeWidth={22 / WRENCH_SCALE} className="fill-graphite" delay={0.5} />
        </g>
      </g>
    </>
  );
}
