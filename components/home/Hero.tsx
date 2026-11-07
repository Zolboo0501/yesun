"use client";
import { mono } from "@/app/fonts";
import { ArrowUpRight, FacebookIcon, MailIcon, PhoneIcon } from "@/components/icons";
import DraftingCursor from "@/components/react-bits/drafting-cursor";
import StaggeredText from "@/components/react-bits/staggered-text";
import { contact } from "@/constants/data";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import { heroScenes, type HeroSceneConfig, type Step } from "./heroScenes";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

// Scenes may have different numbers of steps (the building walks down its floors). Each scene takes one scroll
// screen per step: one between each pair of its steps and one to slide to the next scene.
const count = heroScenes.length;
const steps = heroScenes.map((s) => s.steps.length);
const starts = steps.map((_, k) => steps.slice(0, k).reduce((a, n) => a + n, 0)); // where each scene begins
const UNITS = starts[count - 1] + steps[count - 1] - 1; // the last scene does not slide on
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

/** A scene's own progress, 0..last: each step holds still for the first and last fifth of its scroll, then travels. */
const stepAt = (local: number, last: number) => {
  const x = Math.min(Math.max(local, 0), last);
  const i = Math.min(Math.floor(x), last - 1);
  return i + clamp01((x - i - 0.2) / 0.6);
};
/** The scene whose scroll (its steps and its slide out) holds x. */
const sceneAt = (x: number) => {
  let k = 0;
  while (k < count - 1 && x >= starts[k + 1]) k++;
  return k;
};
/** 0..count-1: which scene fills the stage; fractions are the slide from one scene to the next. */
const trackAt = (x: number) => {
  const k = sceneAt(x);
  return k + (k < count - 1 ? smooth(clamp01(x - starts[k] - (steps[k] - 1))) : 0);
};
/** The step of the scene on stage at scroll progress v, travelling between steps. */
const stepNow = (v: number) => {
  const k = sceneAt(v * UNITS);
  return stepAt(v * UNITS - starts[k], steps[k] - 1);
};
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

export function Hero() {
  const section = useRef<HTMLElement>(null);
  // Start drawing straight away; the observer only pauses it once the hero is scrolled past.
  const active = useInView(section, { initial: true });
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const track = useTransform(scrollYProgress, (v) => trackAt(v * UNITS));
  const x = useTransform(track, (t) => `${(-t * 100) / count}%`);

  // Mount the scene on stage and its neighbours (so the next model loads while this one plays); draw only what shows.
  const [base, setBase] = useState(0);
  const [sliding, setSliding] = useState(false);
  useMotionValueEvent(track, "change", (t) => {
    setBase(Math.floor(t + 1e-4));
    setSliding(t - Math.floor(t + 1e-4) > 1e-3);
  });

  /** Scroll to scene k's step. */
  const go = (k: number, step = 0) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + ((el.offsetHeight - window.innerHeight) * (starts[k] + step)) / UNITS,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="home"
      ref={section}
      aria-label="Есөн Бэлчир: оффис, цэцэрлэг, сургууль, барилгын агаар сэлгэлт, хөргөлтийн систем"
      className="relative bg-night text-white"
      style={{ height: `${(UNITS + 1) * 100}svh` }}
    >
      {/* The stage. A drafting crosshair follows the mouse over it, with the point's coordinates beside it; a drag
          measures, a click pins a point. Phones and touch keep their own behaviour. overflow-clip, not hidden, so
          focusing or scrolling to an element in another scene cannot scroll the stage sideways. */}
      <DraftingCursor
        accentColor="currentColor"
        fontFamily={mono.style.fontFamily}
        className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-clip"
      >
        {/* The scenes stand side by side; scrolling past one scene's last step slides the next one in. */}
        <motion.div style={{ x, width: `${count * 100}%` }} className="flex h-full">
          {heroScenes.map((scene, k) => (
            <ScenePanel
              key={scene.id}
              scene={scene}
              index={k}
              scroll={scrollYProgress}
              mounted={Math.abs(k - base) <= 1}
              drawing={active && (k === base || (sliding && k === base + 1))}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>

        {/* The scene's steps, as short lines down the right edge (the current one long and bright);
            each one jumps to its step. */}
        <nav aria-label="Алхмууд" className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-1.5 sm:right-6 lg:right-8">
          {Array.from({ length: steps[base] }, (_, i) => (
            <StepLine
              key={i}
              index={i}
              label={heroScenes[base].steps[i].tag}
              scroll={scrollYProgress}
              onSelect={() => go(base, i)}
            />
          ))}
        </nav>

        {/* The four buildings, small at the bottom left, the one on stage in white. */}
        <nav aria-label="Объектууд" className="absolute bottom-5 left-4 sm:left-6 lg:left-8">
          <ul className="flex gap-4 text-[11px] font-medium sm:gap-5">
            {heroScenes.map((scene, k) => (
              <SceneLink
                key={scene.id}
                name={scene.name}
                index={k}
                track={track}
                current={base === k}
                onSelect={() => go(k)}
              />
            ))}
          </ul>
        </nav>

        <div
          aria-hidden
          className="pointer-events-none absolute bottom-5 right-[24%] hidden flex-col items-center gap-3 lg:flex"
        >
          <span className="rotate-180 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60 [writing-mode:vertical-rl]">
            Гүйлгэх
          </span>
          <span className="h-10 w-px bg-white/45" />
        </div>

        <div className="absolute bottom-4 right-3 flex items-center gap-1 text-white/70 sm:right-5 lg:right-7">
          <a
            href={contact.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="grid size-8 place-items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <FacebookIcon className="size-3.5" />
          </a>
          <a
            href={`mailto:${contact.email}`}
            aria-label="Имэйл"
            className="grid size-8 place-items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <MailIcon className="size-3.5" />
          </a>
          <a
            href={`tel:${contact.phone}`}
            aria-label="Утас"
            className="grid size-8 place-items-center transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            <PhoneIcon className="size-3.5" />
          </a>
        </div>
      </DraftingCursor>
    </section>
  );
}

function ScenePanel({
  scene,
  index,
  scroll,
  mounted,
  drawing,
  reducedMotion,
}: {
  scene: HeroSceneConfig;
  index: number;
  scroll: MotionValue<number>;
  mounted: boolean;
  drawing: boolean;
  reducedMotion: boolean;
}) {
  const step = useTransform(scroll, (v) => stepAt(v * UNITS - starts[index], steps[index] - 1));
  return (
    <div className="relative h-full shrink-0" style={{ width: `${100 / count}%` }}>
      <div className="absolute inset-0" style={scene.backdrop ? { background: scene.backdrop } : undefined}>
        {mounted && <HeroScene config={scene} progress={step} active={drawing} reducedMotion={reducedMotion} />}
      </div>
      {/* Shade over the scene, as over a photograph: dark under the copy and round the frame, open where the
          building stands (the right on desktop, the top on phones). */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-night/20" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-night)_20%,rgb(22_23_27/0.6)_48%,transparent_72%)] lg:bg-[linear-gradient(90deg,var(--color-night)_6%,rgb(22_23_27/0.82)_32%,rgb(22_23_27/0.2)_60%,transparent_76%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-night to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-night/85 to-transparent" />
      </div>
      {scene.steps.map((s, i) => (
        <StepCopy key={s.tag} step={s} index={i} progress={step} first={index === 0 && i === 0} />
      ))}
    </div>
  );
}

function StepLine({
  index,
  label,
  scroll,
  onSelect,
}: {
  index: number;
  label: string;
  scroll: MotionValue<number>;
  onSelect: () => void;
}) {
  // 1 on its own step, easing to 0 a step away: the long, bright line travels down with the scroll
  const near = useTransform(scroll, (v) => clamp01(1 - Math.abs(stepNow(v) - index)));
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

function SceneLink({
  name,
  index,
  track,
  current,
  onSelect,
}: {
  name: string;
  index: number;
  track: MotionValue<number>;
  current: boolean;
  onSelect: () => void;
}) {
  const color = useTransform(track, (t) => (Math.round(t) === index ? "rgb(255 255 255)" : "rgb(255 255 255 / 0.4)"));
  return (
    <li>
      <motion.button
        type="button"
        onClick={onSelect}
        aria-current={current ? "step" : undefined}
        style={{ color }}
        className="py-1 transition-colors hover:!text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {name}
      </motion.button>
    </li>
  );
}

function StepCopy({
  step,
  index,
  progress,
  first,
}: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
  /** the page's h1: the first scene's first step */
  first: boolean;
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
  const [lineA, lineB] = twoLines(step.title);

  // The block's font size is the heading's, so the set-in second line, the rule and the text all align on 0.9em.
  return (
    <motion.div
      style={{ opacity, y, visibility }}
      className="absolute inset-x-0 bottom-16 px-4 text-[clamp(2.5rem,1.1rem+4.2vw,6rem)] sm:px-6 lg:inset-x-auto lg:bottom-auto lg:left-[max(2rem,calc(50vw-38rem))] lg:top-1/2 lg:w-[min(48rem,58vw)] lg:-translate-y-1/2 lg:px-0"
    >
      {/* The words are inline blocks, so the second line is set in by a hanging indent (reset inside each word, as
          text-indent inherits). A scene sliding in runs its words the first time it comes into view. */}
      <StaggeredText
        key={run}
        as={first ? "h1" : "h2"}
        text={lineB ? `${lineA}\n${lineB}` : lineA}
        delay={60}
        duration={0.7}
        easing={EASE_OUT}
        from={HEADING_FROM}
        to={SHOWN}
        className={`font-semibold leading-[0.95] tracking-[-0.035em] text-white ${lineB ? "pl-[0.9em] indent-[-0.9em] *:indent-0" : ""}`}
      />
      <div className="mt-[0.4em] flex items-start gap-5 pl-[0.9em]">
        <span aria-hidden className="mt-[0.7rem] h-px w-12 shrink-0 bg-white/60 sm:w-16" />
        <StaggeredText
          key={run}
          text={step.text}
          delay={15}
          duration={0.6}
          easing={EASE_OUT}
          from={TEXT_FROM}
          to={SHOWN}
          className="max-w-[34ch] text-[15px] leading-[1.55] text-white/75 sm:text-base"
        />
      </div>
      {step.cta && (
        <div className="mt-[0.45em] flex flex-wrap items-center gap-x-6 gap-y-3 pl-[0.9em]">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-3 text-xs font-semibold text-night transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Инженертэй холбогдох
            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
          </Link>
          <a
            href={`tel:${contact.phone}`}
            className="text-xs font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {contact.phone}
          </a>
        </div>
      )}
    </motion.div>
  );
}
