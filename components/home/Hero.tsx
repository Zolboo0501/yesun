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
  const track = useTransform(scrollYProgress, (v) => trackAt(v * UNITS));
  const x = useTransform(track, (t) => `${(-t * 100) / count}%`);

  // Mount the scene on stage and its neighbours (so the next model loads while this one plays); draw only what shows.
  const [base, setBase] = useState(0);
  const [sliding, setSliding] = useState(false);
  useMotionValueEvent(track, "change", (t) => {
    setBase(Math.floor(t + 1e-4));
    setSliding(t - Math.floor(t + 1e-4) > 1e-3);
  });

  // the step of the scene on stage, for the step lines
  const onStage = useTransform(scrollYProgress, stepNow);

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
              reveal={reveal}
              ready={ready.includes(k)}
              onReady={() => markReady(k)}
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
              step={onStage}
              onSelect={() => go(base, i)}
            />
          ))}
        </nav>

        {/* The buildings, small at the bottom left, the one on stage in white. */}
        <nav aria-label="Объектууд" className="absolute bottom-5 left-4 sm:left-6 lg:left-8">
          <ul className="flex gap-3 text-[13px] font-medium sm:gap-5">
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


        {/* from sm up; on a phone the site's contact bar carries the same links and the scene names need the row */}
        <div className="absolute bottom-4 right-3 hidden items-center gap-1 text-white/70 sm:right-5 sm:flex lg:right-7">
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
  mounted,
  drawing,
  reducedMotion,
  reveal,
  ready,
  onReady,
}: {
  scene: HeroSceneConfig;
  index: number;
  scroll: MotionValue<number>;
  mounted: boolean;
  drawing: boolean;
  reducedMotion: boolean;
  /** the first-load curtain's iris, 0 closed to 1 open */
  reveal: MotionValue<number>;
  /** its model has drawn */
  ready: boolean;
  onReady: () => void;
}) {
  const step = useTransform(scroll, (v) => stepAt(v * UNITS - starts[index], steps[index] - 1));
  const zoomed = useRef<HTMLDivElement>(null);
  useMotionValueEvent(reveal, "change", (p) => {
    if (zoomed.current) paintZoom(zoomed.current, p);
  });
  return (
    <div className="relative h-full shrink-0" style={{ width: `${100 / count}%` }}>
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
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(22_23_27/0.82)_10%,rgb(22_23_27/0.4)_36%,transparent_58%)] lg:bg-[linear-gradient(90deg,rgb(22_23_27/0.72)_0%,rgb(22_23_27/0.45)_28%,rgb(22_23_27/0.1)_50%,transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-night/45 to-transparent" />
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
        >
          {s.cta && <ContactActions />}
        </StepCopy>
      ))}
    </div>
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

/** The last step's actions: talk to an engineer, or call. */
function ContactActions() {
  return (
    <>
      <Link
        href="/contact"
        className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-night transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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

/** The 3D's loading sign: a light running along a short line, and the words under it. It fades in after half a
 *  second, so a model that is already in never flashes it; under reduced motion the light holds still. */
function Loader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={`pointer-events-none flex flex-col items-center gap-3 animate-[loader-in_0.4s_ease-out_0.5s_both] ${className ?? ""}`}
    >
      <span aria-hidden className="relative block h-0.5 w-32 overflow-hidden rounded-full bg-white/15">
        <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/80 animate-[loader-sweep_1.2s_ease-in-out_infinite] motion-reduce:animate-none" />
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/65">3D загвар ачаалж байна</span>
    </div>
  );
}
