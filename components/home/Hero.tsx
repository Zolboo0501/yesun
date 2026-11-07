"use client";
import { contact } from "@/constants/data";
import { ArrowUpRight } from "lucide-react";
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

const last = 5; // six steps per scene
const SPAN = last + 1; // scroll screens per scene: five between its steps, one to slide to the next
const count = heroScenes.length;
const UNITS = count * SPAN - 1; // the last scene does not slide on
const pad = (n: number) => String(n).padStart(2, "0");
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

/** A scene's own progress, 0..5: each step holds still for the first and last fifth of its scroll, then travels. */
const stepAt = (local: number) => {
  const x = Math.min(Math.max(local, 0), last);
  const i = Math.min(Math.floor(x), last - 1);
  return i + clamp01((x - i - 0.2) / 0.6);
};
/** 0..count-1: which scene fills the stage; fractions are the slide from one scene to the next. */
const trackAt = (x: number) => {
  const k = Math.min(Math.floor(x / SPAN), count - 1);
  return k + (k < count - 1 ? smooth(clamp01(x - k * SPAN - last)) : 0);
};

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
  const counter = useTransform(scrollYProgress, (v) => {
    const k = Math.min(Math.floor((v * UNITS) / SPAN), count - 1);
    return `${heroScenes[k].name}  ${pad(Math.round(stepAt(v * UNITS - k * SPAN)) + 1)} / ${pad(SPAN)}`;
  });

  // Mount the scene on stage and its neighbours (so the next model loads while this one plays); draw only what shows.
  const [base, setBase] = useState(0);
  const [sliding, setSliding] = useState(false);
  useMotionValueEvent(track, "change", (t) => {
    setBase(Math.floor(t + 1e-4));
    setSliding(t - Math.floor(t + 1e-4) > 1e-3);
  });

  const go = (k: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + ((el.offsetHeight - window.innerHeight) * k * SPAN) / UNITS,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="home"
      ref={section}
      aria-label="Есөн Бэлчир: оффис, цэцэрлэг, сургууль, барилгын агаар сэлгэлт, хөргөлтийн систем"
      className="relative bg-panel text-ink"
      style={{ height: `${(UNITS + 1) * 100}svh` }}
    >
      <div className="sticky top-[11vh] h-[calc(100svh-11vh)] overflow-hidden">
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

        {/* Technical frame around the stage, as on a spec sheet. */}
        <p
          aria-hidden
          className="pointer-events-none absolute left-4 top-6 rotate-180 font-mono text-[11px] uppercase tracking-[0.2em] text-soft [writing-mode:vertical-rl] max-lg:hidden"
        >
          ЕБ / 2011
        </p>
        <p
          aria-hidden
          className="pointer-events-none absolute right-5 top-5 font-mono text-[11px] tracking-[0.12em] text-soft max-lg:hidden"
        >
          47.9184° N&nbsp;&nbsp;106.9177° E
        </p>
        {/* The four buildings: where you are, and a jump to any of them. */}
        <nav aria-label="Объектууд" className="absolute left-12 top-4 max-lg:left-4">
          <ol className="flex gap-5 font-mono text-[11px] uppercase tracking-[0.16em]">
            {heroScenes.map((scene, k) => (
              <SceneTab key={scene.id} label={scene.name} index={k} track={track} onSelect={() => go(k)} />
            ))}
          </ol>
        </nav>
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-soft"
        >
          Гүйлгэж танилцана
          <span className="relative h-px w-16 bg-ink/15">
            <motion.span
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 origin-left bg-brand"
            />
          </span>
        </div>
        <p
          aria-hidden
          className="pointer-events-none absolute bottom-5 right-5 whitespace-pre font-mono text-[11px] uppercase tracking-[0.16em] text-soft"
        >
          <motion.span>{counter}</motion.span>
        </p>
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-1/2 h-40 w-px -translate-y-1/2 bg-ink/15 max-lg:hidden"
        >
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute -left-px top-0 h-full w-[3px] origin-top bg-brand"
          />
        </div>
      </div>
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
  const step = useTransform(scroll, (v) => stepAt(v * UNITS - index * SPAN));
  return (
    <div className="relative h-full shrink-0" style={{ width: `${100 / count}%` }}>
      <div className="absolute inset-0" style={scene.backdrop ? { background: scene.backdrop } : undefined}>
        {mounted && <HeroScene config={scene} progress={step} active={drawing} reducedMotion={reducedMotion} />}
      </div>
      {scene.steps.map((s, i) => (
        <StepCopy key={s.tag} step={s} index={i} progress={step} first={index === 0 && i === 0} />
      ))}
    </div>
  );
}

function SceneTab({
  label,
  index,
  track,
  onSelect,
}: {
  label: string;
  index: number;
  track: MotionValue<number>;
  onSelect: () => void;
}) {
  const color = useTransform(track, (t) => (Math.round(t) === index ? "var(--color-brand)" : "var(--color-soft)"));
  return (
    <li>
      <motion.button
        type="button"
        style={{ color }}
        onClick={onSelect}
        className="uppercase transition-colors hover:!text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {label}
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
  const opacity = useTransform(progress, (s) =>
    Math.max(0, 1 - Math.abs(s - index) * 2.5),
  );
  const y = useTransform(progress, (s) => (index - s) * 60);
  const visibility = useTransform(opacity, (o) =>
    o > 0.02 ? "visible" : "hidden",
  );
  const Heading = first ? "h1" : "h2";

  return (
    <motion.div
      style={{ opacity, y, visibility }}
      className="absolute inset-x-0 bottom-12 bg-panel px-4 pt-5 sm:px-6 lg:bottom-[16%] lg:left-[5vw] lg:right-auto lg:w-[46vw] lg:bg-transparent lg:p-0"
    >
      <div className="relative lg:bg-panel/85 lg:p-10">
        {/* Corner brackets */}
        <span aria-hidden className="pointer-events-none absolute left-0 top-0 size-3.5 border-l-2 border-t-2 border-brand max-lg:hidden" />
        <span aria-hidden className="pointer-events-none absolute right-0 top-0 size-3.5 border-r-2 border-t-2 border-brand max-lg:hidden" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 size-3.5 border-b-2 border-l-2 border-brand max-lg:hidden" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 size-3.5 border-b-2 border-r-2 border-brand max-lg:hidden" />

        <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">
          {pad(index + 1)} / {step.tag}
        </p>
        <Heading className="mt-4 text-balance text-[clamp(2.25rem,1.4rem+3vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
          {step.title}
        </Heading>
        <p className="mt-5 max-w-[44ch] text-step-body leading-relaxed text-ink/80">
          {step.text}
        </p>
        {step.cta && (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              Инженертэй холбогдох
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={`tel:${contact.phone}`}
              className="font-mono text-xs uppercase tracking-[0.16em] underline decoration-1 underline-offset-[6px] transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              {contact.phone}
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
