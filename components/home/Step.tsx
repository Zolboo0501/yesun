"use client";
import StaggeredText from "@/components/react-bits/staggered-text";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

// The copy and the step lines of the home page's scroll stages (the hero's scenes and the projects), so both read
// and move alike.

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

/** A heading in two lines, broken at the word nearest its middle; the second line is set in. */
const twoLines = (title: string) => {
  const words = title.split(" ");
  let best = 0;
  let gap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const d = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (d < gap) [gap, best] = [d, i];
  }
  return best ? [words.slice(0, best).join(" "), words.slice(best).join(" ")] : [title, ""];
};

// Words rise a short way into place and stop there: opacity and a small lift, no blur, no overshoot.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const HEADING_FROM = { opacity: 0, y: 14 };
const TEXT_FROM = { opacity: 0, y: 8 };
const SHOWN = { opacity: 1, y: 0 };

/** One step's copy on a stage: a two-line heading set in on its second line, a rule with the text beside it, and any
 *  actions below. It fades and slides with its step, and its words run in again each time the step comes on. */
export function StepCopy({
  title,
  text,
  index,
  progress,
  heading = "h2",
  large = false,
  reveal,
  className,
  children,
}: {
  title: string;
  text: string;
  index: number;
  /** the stage's step, travelling between whole numbers */
  progress: MotionValue<number>;
  heading?: "h1" | "h2" | "h3";
  /** the text a size up, for a stage whose copy carries the section on its own (the projects) */
  large?: boolean;
  /** the hero's first-load curtain, 0 closed to 1 open: the words run once more as it reaches them */
  reveal?: MotionValue<number>;
  /** overrides for the block, such as a narrower column or a smaller heading beside a large picture */
  className?: string;
  /** actions under the text */
  children?: ReactNode;
}) {
  const opacity = useTransform(progress, (s) => Math.max(0, 1 - Math.abs(s - index) * 2.5));
  const y = useTransform(progress, (s) => (index - s) * 60);
  const visibility = useTransform(opacity, (o) => (o > 0.02 ? "visible" : "hidden"));
  // Each time this step comes on (its opacity leaves 0), its words run in again: a new key mounts them at the start.
  const [run, setRun] = useState(0);
  const on = useRef(Math.abs(progress.get() - index) < 0.4);
  useMotionValueEvent(progress, "change", (s) => {
    const now = Math.abs(s - index) < 0.4;
    if (now && !on.current) setRun((r) => r + 1);
    on.current = now;
  });
  // Under the hero's curtain the words run once more as its iris reaches them, so the stagger is seen, not covered.
  const open = useMotionValue(1); // stands in on a stage without a curtain
  const uncovered = useRef(false);
  useMotionValueEvent(reveal ?? open, "change", (p) => {
    if (p < 0.45 || uncovered.current) return;
    uncovered.current = true;
    if (on.current) setRun((r) => r + 1);
  });
  const [lineA, lineB] = twoLines(title);

  // The block's font size is the heading's, so the set-in second line, the rule and the text all align on 0.9em.
  return (
    <motion.div
      style={{ opacity, y, visibility }}
      className={cn(
        "absolute inset-x-0 bottom-16 px-4 text-[clamp(2.5rem,1.1rem+4.2vw,6rem)] sm:px-6 lg:inset-x-auto lg:bottom-auto lg:left-[max(2rem,calc(50vw-38rem))] lg:top-1/2 lg:w-[min(48rem,58vw)] lg:-translate-y-1/2 lg:px-0",
        className,
      )}
    >
      {/* The words are inline blocks, so the second line is set in by a hanging indent (reset inside each word, as
          text-indent inherits). A stage sliding in runs its words the first time it comes into view. */}
      <StaggeredText
        key={run}
        as={heading}
        text={lineB ? `${lineA}\n${lineB}` : lineA}
        delay={60}
        duration={0.7}
        easing={EASE_OUT}
        from={HEADING_FROM}
        to={SHOWN}
        className={`font-semibold leading-[0.95] tracking-[-0.035em] text-white ${lineB ? "pl-[0.9em] indent-[-0.9em] *:indent-0" : ""}`}
      />
      <div className="mt-[0.4em] flex items-start gap-5 pl-[0.9em]">
        <span
          aria-hidden
          className={`h-px w-12 shrink-0 bg-white/60 sm:w-16 ${large ? "mt-[0.85rem] sm:mt-[0.95rem]" : "mt-[0.7rem]"}`}
        />
        <StaggeredText
          key={run}
          text={text}
          delay={15}
          duration={0.6}
          easing={EASE_OUT}
          from={TEXT_FROM}
          to={SHOWN}
          className={
            large
              ? "max-w-[38ch] text-step-body leading-[1.55] text-white/80"
              : "max-w-[34ch] text-base leading-[1.55] text-white/75"
          }
        />
      </div>
      {children && <div className="mt-[0.45em] flex flex-wrap items-center gap-x-6 gap-y-3 pl-[0.9em]">{children}</div>}
    </motion.div>
  );
}

/** A step's line down the right edge of a stage: long and bright on its own step, short and dim a step away. A click
 *  jumps to the step. */
export function StepLine({
  index,
  label,
  step,
  onSelect,
}: {
  index: number;
  label: string;
  /** the stage's step, travelling between whole numbers */
  step: MotionValue<number>;
  onSelect: () => void;
}) {
  // 1 on its own step, easing to 0 a step away: the long, bright line travels down with the scroll
  const near = useTransform(step, (s) => clamp01(1 - Math.abs(s - index)));
  const scaleX = useTransform(near, (n) => 0.38 + 0.62 * n);
  const opacity = useTransform(near, (n) => 0.45 + 0.55 * n);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Алхам ${index + 1}: ${label}`}
      data-cursor-label={label}
      className="group flex h-4 w-10 items-center justify-end focus-visible:outline-2 focus-visible:outline-white"
    >
      <motion.span
        style={{ scaleX, opacity }}
        className="block h-0.5 w-full origin-right bg-white shadow-[0_0_0_0.5px_rgb(0_0_0/0.25)] group-hover:!opacity-100"
      />
    </button>
  );
}
