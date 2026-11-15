"use client";

import { ArrowUpRight } from "@/components/icons";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

/** what the services' icons need to move: drawn in once seen, moving while in view, still under reduced motion */
export type CTA3TileState = { seen: boolean; active: boolean; reduced: boolean };

interface CTA3Props {
  /** the heading; a line break ("\n") splits it into its two lines */
  title: string;
  text: string;
  action: { label: string; href: string };
  /** the three services at the ends of the air line (left, centre, right), given whether they are seen and in view */
  points: (state: CTA3TileState) => { label: string; icon: ReactNode }[];
  /** under the button (the people who answer, the phones and the email) */
  children?: ReactNode;
  className?: string;
}

// The air line in a 480 × 120 sheet: a riser comes down from above and splits at a manifold into three drops, one to
// the centre of each column below, its bends rounded like a duct's.
const RISER = "M240 0V40";
const DROPS = ["M240 40H96Q80 40 80 56V120", "M240 40V120", "M240 40H384Q400 40 400 56V120"];

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A centred call to action, night by default and white under the `light` variant: the company's subject drawn as an
 * air line (air coming down a riser, splitting at a manifold and running to its three services, each a round node with
 * its icon and name), the heading in two lines, one line of text and the button, then whatever it is given. The line
 * draws in once seen and the air runs along it while in view; under reduced motion it is drawn at once and holds
 * still.
 */
export default function CTA3({ title, text, action, points, children, className }: CTA3Props) {
  const [lineA, lineB] = title.split("\n");
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { once: true, amount: 0.4 });
  const active = useInView(stage, { amount: 0.2 });
  const reduced = useReducedMotion() ?? false;
  const services = points({ seen, active, reduced });
  const enter = (delay: number, from: { x?: number; y?: number; scale?: number } = { y: 20 }) => ({
    initial: { opacity: 0, ...from },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.6, delay, ease: EASE },
  });
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: seen ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: reduced
      ? { duration: 0 }
      : { pathLength: { duration: 0.9, delay, ease: EASE }, opacity: { duration: 0.2, delay } },
  });

  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      <div ref={stage} className="mx-auto mb-12 w-[20rem] sm:w-[30rem]">
        <svg
          aria-hidden
          viewBox="0 0 480 120"
          fill="none"
          strokeLinecap="round"
          className={cn("block w-full overflow-visible", !active && "[&_.air]:[animation-play-state:paused]")}
        >
          <defs>
            {/* the riser comes out of the ground above */}
            <linearGradient id="cta-air-riser" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="currentColor" stopOpacity="0" />
              <stop offset="1" stopColor="currentColor" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* the duct: a soft band the air runs inside, faded as one so its joins do not darken */}
          <g opacity={0.08}>
            <motion.path d={RISER} stroke="url(#cta-air-riser)" strokeWidth={10} {...draw(0)} />
            {DROPS.map((d, i) => (
              <motion.path key={d} d={d} stroke="currentColor" strokeWidth={10} {...draw(0.3 + i * 0.1)} />
            ))}
          </g>
          {/* the air: short dashes running down the riser and out along each drop, once the line is drawn */}
          <motion.g
            className="text-white/80 light:text-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: seen ? 1 : 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 1.1 }}
          >
            {[RISER, ...DROPS].map((d) => (
              <path
                key={d}
                d={d}
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="3 13"
                className="air animate-[air-run_0.8s_linear_infinite] motion-reduce:animate-none"
              />
            ))}
          </motion.g>
        </svg>

        <ul className="grid grid-cols-3">
          {services.map(({ label, icon }, i) => (
            <motion.li key={label} {...enter(0.6 + i * 0.1, { y: 12 })} className="flex flex-col items-center">
              <span
                aria-hidden
                className="grid size-16 place-items-center rounded-full border border-white/10 bg-white/[0.06] p-3 text-white/85 sm:size-20 sm:p-3.5 light:border-ink/10 light:bg-white light:text-brand light:shadow-[0_12px_28px_-16px_rgb(11_16_32/0.35)]"
              >
                {icon}
              </span>
              <span className="mt-3 px-1 font-mono text-[11px] uppercase leading-snug tracking-[0.16em] text-white/60 light:text-ink/55">
                {label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.h2
        {...enter(0.4)}
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
          className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-brand/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white light:bg-brand light:text-white light:hover:bg-brand/85 light:focus-visible:outline-brand"
        >
          {action.label}
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </motion.div>

      {children}
    </div>
  );
}
