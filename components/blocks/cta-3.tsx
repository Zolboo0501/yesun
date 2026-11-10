"use client";

import { ArrowUpRight } from "@/components/icons";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

/** what the tiles' content needs to move: drawn in once seen, moving while in view, still under reduced motion */
export type CTA3TileState = { seen: boolean; active: boolean; reduced: boolean };

interface CTA3Props {
  /** the heading; a line break ("\n") splits it into its two lines */
  title: string;
  text: string;
  action: { label: string; href: string };
  /** the three tiles' content over the rings (left, centre, right), given whether they are seen and in view */
  tiles: (state: CTA3TileState) => [ReactNode, ReactNode, ReactNode];
  /** under the button (the people who answer, the phones and the email) */
  children?: ReactNode;
  className?: string;
}

// three dashed rings, each turning its own way and pace
const rings = [
  { r: 290.5, opacity: 0.5, spin: "animate-[spin_20s_linear_infinite]", delay: 0.1 },
  { r: 236.5, opacity: 0.8, spin: "animate-[spin_15s_linear_infinite_reverse]", delay: 0.2 },
  { r: 182.5, opacity: 1, spin: "animate-[spin_25s_linear_infinite]", delay: 0.3 },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const tile =
  "flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-sm light:border-ink/10 light:bg-ink/[0.04]";

/**
 * A centred call to action, night by default and white under the `light` variant: three wide glassy tiles with the
 * subject's animated icons over slowly turning dashed rings that fade into the ground, the heading in two lines, one line of
 * text and the button, then whatever it is given. Everything comes in once as it scrolls into view; under reduced
 * motion the rings stand still and the entrances only fade.
 */
export default function CTA3({ title, text, action, tiles, children, className }: CTA3Props) {
  const [lineA, lineB] = title.split("\n");
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { once: true, amount: 0.4 });
  const active = useInView(stage, { amount: 0.2 });
  const reduced = useReducedMotion() ?? false;
  const [left, centre, right] = tiles({ seen, active, reduced });
  const enter = (delay: number, from: { x?: number; y?: number; scale?: number } = { y: 20 }) => ({
    initial: { opacity: 0, ...from },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      <div ref={stage} className="relative mb-10 flex h-44 items-center justify-center sm:h-52">
        <div aria-hidden className="pointer-events-none absolute inset-0 -top-24 flex items-center justify-center">
          <div className="relative size-[320px] sm:size-[420px]">
            <svg viewBox="0 0 586 586" fill="none" className="size-full opacity-30">
              {rings.map((ring) => (
                <motion.g key={ring.r} {...enter(ring.delay, { scale: 0.8 })} style={{ originX: "50%", originY: "50%" }}>
                  <circle
                    cx="293"
                    cy="293"
                    r={ring.r}
                    strokeOpacity={ring.opacity}
                    strokeWidth="5"
                    strokeDasharray="25 25"
                    className={cn(
                      "origin-center stroke-white [transform-box:fill-box] motion-reduce:animate-none light:stroke-ink",
                      ring.spin,
                    )}
                  />
                </motion.g>
              ))}
            </svg>
            <div className="absolute inset-0 bg-linear-to-b from-transparent from-30% via-night/50 via-60% to-night light:via-white/50 light:to-white" />
          </div>
        </div>

        {/* the side tiles stand a little lower, partly behind the wider centre one */}
        <motion.div
          aria-hidden
          {...enter(0.2, { x: 20, scale: 0.9 })}
          className={cn(tile, "absolute left-1/2 top-6 h-28 w-36 -translate-x-[calc(100%+3rem)] p-3 text-white/60 sm:h-36 sm:w-48 sm:-translate-x-[calc(100%+5rem)] sm:p-4 light:text-ink/60")}
        >
          {left}
        </motion.div>
        <motion.div
          aria-hidden
          {...enter(0.3, { y: -20 })}
          className={cn(tile, "relative z-10 h-40 w-52 bg-white/10 p-4 text-white/90 sm:h-48 sm:w-64 sm:p-5 light:bg-ink/[0.07] light:text-ink/85")}
        >
          {centre}
        </motion.div>
        <motion.div
          aria-hidden
          {...enter(0.2, { x: -20, scale: 0.9 })}
          className={cn(tile, "absolute left-1/2 top-6 h-28 w-36 translate-x-12 p-3 text-white/60 sm:h-36 sm:w-48 sm:translate-x-20 sm:p-4 light:text-ink/60")}
        >
          {right}
        </motion.div>
      </div>

      <motion.h2
        {...enter(0.4)}
        // above the rings, whose white fade reaches into the heading's top: once its entrance ends the heading has no
        // transform left, and a plain element would paint under the positioned rings
        className="relative z-10 text-balance text-[clamp(2.5rem,1.2rem+3.4vw,5rem)] font-semibold leading-[0.98] tracking-[-0.035em]"
      >
        {lineA}
        {lineB && (
          <>
            <br />
            {lineB}
          </>
        )}
      </motion.h2>

      <motion.p
        {...enter(0.5)}
        className="relative z-10 mx-auto mt-6 max-w-[46ch] text-pretty text-step-body leading-[1.55] text-white/75 light:text-ink/70"
      >
        {text}
      </motion.p>

      <motion.div {...enter(0.6)} className="relative z-10 mt-9 flex justify-center">
        <Link
          href={action.href}
          className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-night transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white light:bg-ink light:text-white light:hover:bg-ink/85 light:focus-visible:outline-brand"
        >
          {action.label}
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </motion.div>

      {children}
    </div>
  );
}
