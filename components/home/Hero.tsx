"use client";
import { mono } from "@/app/fonts";
import { ArrowUpRight, FacebookIcon, MailIcon, PhoneIcon } from "@/components/icons";
import DraftingCursor from "@/components/react-bits/drafting-cursor";
import { irisSheet } from "@/components/react-bits/scroll-mask";
import { contact } from "@/constants/data";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroScenes, type HeroSceneConfig } from "./heroScenes";
import { StepCopy, StepLine } from "./Step";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

// The visitor picks a scene from the names at the bottom left. The section is as tall as that scene's steps, one
// scroll screen each (the building walks down its floors, so it is taller), so scrolling walks only the scene on
// stage and then the page moves on; another scene slides in only when its name is picked.
const steps = heroScenes.map((s) => s.steps.length);
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const SLIDE = { duration: 0.8, ease: [0.65, 0, 0.35, 1] } as const;

/** A scene's own progress, 0..last: each step holds still for the first and last fifth of its scroll, then travels. */
const stepAt = (local: number, last: number) => {
  const x = Math.min(Math.max(local, 0), last);
  const i = Math.min(Math.floor(x), last - 1);
  return i + clamp01((x - i - 0.2) / 0.6);
};
// On first load the whole first screen, header included, opens through scroll-mask's iris: a night curtain lies over
// everything and the iris is cut out of it (the full layer XOR the iris), centred on the subject. The 3D settles from
// a slight zoom as it opens.
const IRIS = { x: 58, y: 52, feather: 14, zoom: 0.12 };
const FULL = "linear-gradient(#000, #000)";
const paintCurtain = (el: HTMLElement, p: number) => {
  if (p >= 1) {
    el.style.display = "none";
    return;
  }
  const image = `${FULL}, ${irisSheet(p, IRIS.feather, IRIS.x, IRIS.y).image}`;
  el.style.setProperty("mask-image", image);
  el.style.setProperty("-webkit-mask-image", image);
};
const paintZoom = (el: HTMLElement, p: number) => {
  el.style.transform = p >= 1 ? "" : `scale(${(1 + IRIS.zoom * (1 - p)).toFixed(4)})`;
};

export function Hero() {
  const section = useRef<HTMLElement>(null);
  // Start drawing straight away; the observer only pauses it once the hero is scrolled past.
  const active = useInView(section, { initial: true });
  const reducedMotion = useReducedMotion() ?? false;

  // The iris opens once, when the first model has drawn (or after 3 s if none does). Reduced motion skips it, and so
  // does a page whose script arrived after the CSS safety had already lifted the curtain.
  const reveal = useMotionValue(0);
  const curtain = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const open = useCallback(() => {
    if (opened.current) return;
    opened.current = true;
    animate(reveal, 1, { duration: 1.6, ease: [0.65, 0, 0.35, 1] });
  }, [reveal]);
  useMotionValueEvent(reveal, "change", (p) => {
    if (curtain.current) paintCurtain(curtain.current, p);
  });
  // The scenes whose model has drawn; one on stage without it shows the loading sign.
  const [ready, setReady] = useState<number[]>([]);
  const markReady = useCallback(
    (k: number) => {
      setReady((r) => (r.includes(k) ? r : [...r, k]));
      open();
    },
    [open],
  );
  useEffect(() => {
    const el = curtain.current;
    const lifted = !el || Number(getComputedStyle(el).opacity) < 1;
    // a page that opens further down (a restored scroll, a link to #about) is not the first screen: no curtain there
    const deep = window.scrollY > window.innerHeight / 2 || window.location.hash !== "";
    if (el) el.style.animation = "none"; // the script holds the curtain from here
    if (reducedMotion || lifted || deep) {
      opened.current = true;
      reveal.jump(1);
      return;
    }
    const fallback = window.setTimeout(open, 3000);
    return () => window.clearTimeout(fallback);
  }, [reducedMotion, open, reveal]);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  // The scene on stage, and the one sliding out after a new name was picked (drawn until the new one is in). The
  // neighbours of the one on stage stay mounted too, so their models are in before they are picked.
  const [base, setBase] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const last = steps[base] - 1;

  // the step of the scene on stage, for the step lines
  const onStage = useTransform(scrollYProgress, (v) => stepAt(v * last, last));

  const sectionTop = () => (section.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
  /** Scroll to a step of the scene on stage. */
  const go = (step: number) => {
    const el = section.current;
    if (!el) return;
    window.scrollTo({
      top: sectionTop() + ((el.offsetHeight - window.innerHeight) * step) / last,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };
  /** Put scene k on stage at its first step; picking the one already on stage goes back to its start. */
  const pick = (k: number) => {
    if (k === base) return go(0);
    setLeaving(base);
    setBase(k);
    window.scrollTo({ top: sectionTop(), behavior: "auto" });
  };

  return (
    <section
      id="home"
      ref={section}
      aria-label="Есөн Бэлчир: оффис, цэцэрлэг, сургууль, дэлгүүр, барилгын агаар сэлгэлт, хөргөлтийн систем"
      className="relative bg-night text-white"
      style={{ height: `${steps[base] * 100}svh` }}
    >
      {/* The stage. A drafting crosshair follows the mouse over it, with the point's coordinates beside it; a drag
          measures, a click pins a point. Phones and touch keep their own behaviour. overflow-clip, not hidden, so
          focusing or scrolling to an element in another scene cannot scroll the stage sideways. */}
      <DraftingCursor
        accentColor="currentColor"
        fontFamily={mono.style.fontFamily}
        className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-clip"
      >
        {/* The scenes lie in the order of their names, the one on stage in view and the others beside it; a picked
            one slides in from its side while the one on stage slides out the other way. */}
        <div className="relative h-full">
          {heroScenes.map((scene, k) => (
            <ScenePanel
              key={scene.id}
              scene={scene}
              index={k}
              scroll={scrollYProgress}
              current={k === base}
              place={Math.sign(k - base)}
              moving={k === base || k === leaving}
              mounted={Math.abs(k - base) <= 1 || k === leaving}
              drawing={active && (k === base || k === leaving)}
              reducedMotion={reducedMotion}
              reveal={reveal}
              ready={ready.includes(k)}
              onReady={() => markReady(k)}
              onArrive={() => setLeaving(null)}
            />
          ))}
        </div>

        {/* The scene's steps, as short lines down the right edge (the current one long and bright);
            each one jumps to its step. */}
        <nav aria-label="Алхмууд" className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-1.5 sm:right-6 lg:right-8">
          {Array.from({ length: steps[base] }, (_, i) => (
            <StepLine
              key={i}
              index={i}
              label={heroScenes[base].steps[i].tag}
              step={onStage}
              onSelect={() => go(i)}
            />
          ))}
        </nav>

        {/* The foot row: the buildings as a tab bar on the left (a dark glass track, the one on stage a white pill that
            slides to the picked name; full width on phones, the five names sharing it evenly) and the contact icons on
            the right. It stands above the contact bar while that lies along the foot of the screen (below wide). */}
        <div className="pointer-events-none absolute inset-x-4 bottom-[calc(var(--bar-room)+0.75rem)] flex items-center justify-between gap-4 sm:inset-x-6 lg:inset-x-8 wide:bottom-5">
          <nav aria-label="Объектууд" className="pointer-events-auto w-full sm:w-auto">
            <ul className="flex rounded-full bg-night/60 p-1 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] ring-1 ring-white/15 backdrop-blur-md">
              {heroScenes.map((scene, k) => (
                <SceneLink
                  key={scene.id}
                  name={scene.name}
                  current={base === k}
                  reducedMotion={reducedMotion}
                  onSelect={() => pick(k)}
                />
              ))}
            </ul>
          </nav>

          {/* from sm up; on a phone the site's contact bar carries the same links and the scene names need the row */}
          <div className="pointer-events-auto hidden items-center gap-1 text-white/70 sm:flex">
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
        </div>
      </DraftingCursor>

      {/* The first-load curtain, in the server HTML so nothing shows before it. It sits over the header too; the iris
          is cut out of it as it opens. If the script never runs, globals.css lifts it after 4 s. */}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] bg-night [animation:curtain-safety_0.4s_ease-out_4s_forwards]"
        style={{ maskComposite: "exclude", WebkitMaskComposite: "xor", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}
      >
        <Loader className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </section>
  );
}

function ScenePanel({
  scene,
  index,
  scroll,
  current,
  place,
  moving,
  mounted,
  drawing,
  reducedMotion,
  reveal,
  ready,
  onReady,
  onArrive,
}: {
  scene: HeroSceneConfig;
  index: number;
  scroll: MotionValue<number>;
  /** on stage: its steps follow the scroll */
  current: boolean;
  /** -1 left of the stage, 0 on it, 1 right of it */
  place: number;
  /** sliding in or out, rather than jumping aside out of sight */
  moving: boolean;
  mounted: boolean;
  drawing: boolean;
  reducedMotion: boolean;
  /** the first-load curtain's iris, 0 closed to 1 open */
  reveal: MotionValue<number>;
  /** its model has drawn */
  ready: boolean;
  onReady: () => void;
  /** it has slid onto the stage */
  onArrive: () => void;
}) {
  // Its own step follows the scroll only while it is on stage, so one that slides out keeps the step it was on.
  const last = steps[index] - 1;
  const step = useMotionValue(0);
  useMotionValueEvent(scroll, "change", (v) => {
    if (current) step.set(stepAt(v * last, last));
  });
  useEffect(() => {
    if (current) step.set(stepAt(scroll.get() * last, last));
  }, [current, scroll, step, last]);
  const zoomed = useRef<HTMLDivElement>(null);
  useMotionValueEvent(reveal, "change", (p) => {
    if (zoomed.current) paintZoom(zoomed.current, p);
  });
  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ x: `${place * 100}%` }}
      transition={moving && !reducedMotion ? SLIDE : { duration: 0 }}
      onAnimationComplete={current ? onArrive : undefined}
    >
      {/* the 3D starts slightly zoomed and settles as the curtain opens */}
      <div
        ref={zoomed}
        className="absolute inset-0 origin-[58%_52%]"
        style={{ ...(scene.backdrop ? { background: scene.backdrop } : {}), transform: `scale(${1 + IRIS.zoom})` }}
      >
        {mounted && (
          <HeroScene config={scene} progress={step} active={drawing} reducedMotion={reducedMotion} onReady={onReady} />
        )}
      </div>
      {/* A light shade over the scene (since 2026-11-10, at the user's request, half what it was): enough under the
          copy for the white type to read (the left on desktop, the foot on phones), a touch at the foot for the
          building tabs, and the rest of the scene left clear. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(22_23_27/0.82)_calc(10%_+_var(--bar-room)),rgb(22_23_27/0.4)_calc(36%_+_var(--bar-room)),transparent_calc(58%_+_var(--bar-room)))] lg:bg-[linear-gradient(90deg,rgb(22_23_27/0.72)_0%,rgb(22_23_27/0.45)_28%,rgb(22_23_27/0.1)_50%,transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[calc(var(--bar-room)+6rem)] bg-linear-to-t lg:h-24 from-night/45 to-transparent" />
      </div>
      {/* on stage before its model has drawn: the loading sign where the building will stand */}
      {drawing && !ready && (
        <Loader className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 lg:left-[64%] lg:top-1/2" />
      )}
      {scene.steps.map((s, i) => (
        <StepCopy
          key={s.tag}
          title={s.title}
          text={s.text}
          index={i}
          progress={step}
          reveal={reveal}
          heading={index === 0 && i === 0 ? "h1" : "h2"}
          className="bottom-[calc(var(--bar-room)+5.5rem)]"
        >
          {s.cta && <ContactActions />}
        </StepCopy>
      ))}
    </motion.div>
  );
}

function SceneLink({
  name,
  current,
  reducedMotion,
  onSelect,
}: {
  name: string;
  current: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="flex-1 sm:flex-none">
      <button
        type="button"
        onClick={onSelect}
        aria-current={current ? "true" : undefined}
        data-cursor-label={current ? "Эхнээс нь үзэх" : `${name} үзэх`}
        className={`relative flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full px-1 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-10 sm:px-4 sm:text-sm ${current ? "text-night" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
      >
        {current && (
          <motion.span
            layoutId="scene-tab"
            aria-hidden
            className="absolute inset-0 rounded-full bg-white"
            transition={reducedMotion ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: 0.45 }}
          />
        )}
        <span className="relative">{name}</span>
      </button>
    </li>
  );
}

/** The last step's actions: talk to an engineer, or call. */
function ContactActions() {
  return (
    <>
      <Link
        href="/contact"
        className="group inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-brand/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Инженертэй холбогдох
        <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
      </Link>
      <a
        href={`tel:${contact.phone}`}
        className="text-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        {contact.phone}
      </a>
    </>
  );
}

/** The 3D's loading sign: a light running along a short line; its words are for screen readers only. It fades in
 *  after half a second, so a model that is already in never flashes it; under reduced motion the light holds still. */
function Loader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={`pointer-events-none flex flex-col items-center gap-3 animate-[loader-in_0.4s_ease-out_0.5s_both] ${className ?? ""}`}
    >
      <span aria-hidden className="relative block h-0.5 w-32 overflow-hidden rounded-full bg-white/15">
        <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/80 animate-[loader-sweep_1.2s_ease-in-out_infinite] motion-reduce:animate-none" />
      </span>
      <span className="sr-only">3D загвар ачаалж байна</span>
    </div>
  );
}
