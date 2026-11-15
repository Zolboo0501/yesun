"use client";
import {
  AstralShell,
  type AstralShellLive,
} from "@/components/react-bits/astral-shell";
import { VaporType } from "@/components/react-bits/vapor-type";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Step = {
  title: string;
  text: string;
  brands?: string[];
  cta?: boolean;
};

// The company in four parts: who we are, our own factory, supply and installation, service. It installs to the
// project's design and does not design (CLAUDE.md).
// Every figure is confirmed by the client (PRODUCT.md).
const steps: Step[] = [
  {
    title: "Таны найдвартай түнш",
    text: "2011 оноос хойш Барилга, хот байгуулалтын яамны тусгай зөвшөөрөлтэйгөөр ажиллаж, нийслэл, орон нутгийн олон объектод угсралт хийсэн.",
  },
  {
    title: "Өөрийн үйлдвэртэй",
    text: "Олон улсын стандартын дагуу тоноглогдсон үйлдвэртээ агаарын суваг, холбох хэсгийг захиалгаар хийнэ.",
  },
  {
    title: "Зургаан брэндийн албан ёсны төлөөлөгч",
    text: "Дэлхийд танигдсан брэндүүдийн тоног төхөөрөмжийг нийлүүлж, өөрсдөө угсарна.",
    brands: ["KANION", "AUX", "BALLU", "SHUFT", "AIRONN", "LAVFILL"],
  },
  {
    title: "Чанарын баталгаа",
    text: "Угсралтад 1–3 жилийн баталгаа өгнө. Яаралтай дуудлагад 24/7 ажиллана.",
    cta: true,
  },
];

const last = steps.length - 1;

// The shell stands in the half the copy leaves free: the copy is right on even parts, left on odd ones. On phones
// it sits above the copy and only sways.
const SIDES = { wide: [0.27, 0.73], narrow: [0.4, 0.6] } as const;
const PHONE_Y = 0.75; // the shell's height on phones, above the copy
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
/** The shell at part p: it holds for the first and last fifth of the scroll between two parts, then crosses to the
 *  other half, breaking apart on the way and coming back together on the far side. */
const shellAt = (p: number, wide: boolean, still: boolean): AstralShellLive => {
  const i = Math.min(Math.floor(p), last - 1);
  const t = clamp01((p - i - 0.2) / 0.6);
  const e = t * t * (3 - 2 * t);
  const sides = wide ? SIDES.wide : SIDES.narrow;
  const from = sides[i % 2];
  const to = sides[(i + 1) % 2];
  return {
    originX: from + (to - from) * e,
    originY: wide ? 0.5 : PHONE_Y,
    scatter: still ? 0 : Math.sin(Math.PI * e),
  };
};

// The shell is placed and sized in JS, so the breakpoint is read here; the server renders the desktop layout.
const wideQuery = "(min-width: 1024px)";
const subscribe = (change: () => void) => {
  const query = window.matchMedia(wideQuery);
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
};

export function Company() {
  const section = useRef<HTMLElement>(null);
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(wideQuery).matches,
    () => true,
  );
  const reducedMotion = useReducedMotion() ?? false;

  // 0 while the first part fills the stage under the header (--header-h, 72px), `last` once the last one does.
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 64px", "end end"],
  });
  const part = useTransform(scrollYProgress, (v) => v * last);

  // The scroll drives the shell through a ref it reads every frame, so nothing re-renders as the page moves.
  const live = useRef<AstralShellLive>({});
  useMotionValueEvent(part, "change", (p) => {
    live.current = shellAt(p, wide, reducedMotion);
  });
  useEffect(() => {
    live.current = shellAt(part.get(), wide, reducedMotion);
  }, [part, wide, reducedMotion]);

  return (
    <section
      id="about"
      ref={section}
      aria-label="Бидний тухай"
      className="relative overflow-x-clip bg-white text-ink"
    >
      {/* One network of the company's sites, black on the white ground (a light ground puts the shell in its ink blending), held on screen while the four parts scroll past.
          Between parts it breaks apart and comes together again in the half the next part leaves free. The pointer
          lights the nodes near it and a click sends a pulse round it; dragging is off, so a swipe over it scrolls. */}
      <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))]">
        {/* A clean network rather than a tangle (2026-11-10): fewer, shorter links and almost no long chords across
            the sphere, a looser clustering, strong near-black lines with the sites as dots (so it reads on white), the
            far side a little lighter for depth, and the brand blue where the pointer is and where a click's pulse runs. */}
        <AstralShell
          className="size-full"
          colors={["#05070f", "#0a8cf0"]}
          backgroundColor="#ffffff"
          nodes={wide ? 2000 : 1100}
          connections={4}
          reach={0.18}
          clustering={0.6}
          chords={0.06}
          lineOpacity={0.95}
          nodeSize={1.6}
          depthFade={0.6}
          hoverRadius={0.26}
          hoverBoost={1.5}
          radius={wide ? 0.32 : 0.23}
          originX={SIDES.wide[0]}
          draggable={false}
          live={live}
        />
        {/* on phones the copy lies over the shell's lower half: a night shade keeps it readable */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,var(--color-white)_34%,rgb(255_255_255/0.72)_56%,transparent_76%)] lg:hidden"
        />
      </div>

      {/* the rows let the pointer through to the shell; only the copy itself takes it */}
      <div className="pointer-events-none relative -mt-[calc(100svh-var(--header-h))]">
        {steps.map((s, i) => (
          <PartCopy key={s.title} step={s} index={i} part={part} wide={wide} />
        ))}
      </div>
    </section>
  );
}

const headingClass =
  "text-balance text-[clamp(2rem,1.3rem+2.6vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]";
const textClass =
  "max-w-[56ch] text-pretty text-step-body leading-relaxed text-ink/75";

/** Text that condenses out of white vapor (react-bits VaporType) while its part is at the stage, then holds. Away from
 *  the stage it stands as the same text, unseen, so nothing moves and readers already have it. The canvas is mounted
 *  only near the stage, so at most two parts hold WebGL at once, and each arrival condenses it again. */
function Vapor({
  live,
  as: Tag,
  text,
  className,
  sweep,
  wide,
}: {
  live: boolean;
  as: "h2" | "h3" | "p" | "span";
  text: string;
  className: string;
  sweep: "left" | "right";
  wide: boolean;
}) {
  if (!live) return <Tag className={`opacity-0 ${className}`}>{text}</Tag>;
  return (
    <VaporType
      as={Tag}
      words={[text]}
      align="start"
      vaporColor="#0b1020"
      sweep={sweep}
      condense={1.6}
      loop={false}
      clickAdvance={false}
      // the pointer never stirs it: no text moves under a reader's mouse (the user's call, 2026-11-15)
      interactive={false}
      dpr={wide ? 2 : 1.5}
      className={`block ${className}`}
    />
  );
}

function PartCopy({
  step,
  index,
  part,
  wide,
}: {
  step: Step;
  index: number;
  part: MotionValue<number>;
  wide: boolean;
}) {
  // fades in as its part reaches the stage and out as it scrolls on
  const opacity = useTransform(part, (p) =>
    Math.min(1, Math.max(0, 1.25 - Math.abs(p - index) * 1.6)),
  );
  const Heading = index === 0 ? "h2" : "h3";
  // The vapor is mounted as the part comes within 0.6 of the stage, so it condenses in view, and unmounted once it is a
  // whole part away, when its copy has faded out.
  const [live, setLive] = useState(() => Math.abs(part.get() - index) < 0.6);
  useMotionValueEvent(part, "change", (p) => {
    const away = Math.abs(p - index);
    if (!live && away < 0.6) setLive(true);
    else if (live && away > 1) setLive(false);
  });
  const sweep = index % 2 === 0 ? "right" : "left";
  // the copy takes one half, alternating right and left, its outer edge on the page container's edge
  const half =
    index % 2 === 0
      ? "lg:ml-auto lg:pl-[4vw] lg:pr-[max(2rem,calc(50vw-38rem))]"
      : "lg:pl-[max(2rem,calc(50vw-38rem))] lg:pr-[4vw]";

  return (
    <div className="flex min-h-[calc(100svh-var(--header-h))] items-end px-4 pb-10 sm:px-6 lg:items-center lg:px-0 lg:pb-0">
      <motion.div style={{ opacity }} className={`w-full lg:w-1/2 ${half}`}>
        <div className="pointer-events-auto max-w-[36rem]">
          {/* The heading and the line condense out of vapor as the part arrives. Phones keep the lite path:
              there only the heading does, and the rest fades in with the part. */}
          <Vapor
            live={live}
            as={Heading}
            text={step.title}
            className={headingClass}
            sweep={sweep}
            wide={wide}
          />
          {wide ? (
            <Vapor
              live={live}
              as="p"
              text={step.text}
              className={`mt-5 ${textClass}`}
              sweep={sweep}
              wide
            />
          ) : (
            <p className={`mt-5 ${textClass}`}>{step.text}</p>
          )}

          {step.brands && (
            <ul
              aria-label="Албан ёсны брэндүүд"
              className="mt-8 grid max-w-[26rem] grid-cols-3 gap-x-6 gap-y-3 border-t border-ink/15 pt-4 font-mono text-xs uppercase tracking-[0.16em]"
            >
              {step.brands.map((brand) => (
                <li key={brand}>{brand}</li>
              ))}
            </ul>
          )}

          {step.cta && (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-brand/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Инженертэй холбогдох
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
              </Link>
              <Link
                href="/about"
                className="whitespace-nowrap text-sm font-medium text-ink/85 underline decoration-ink/30 decoration-1 underline-offset-[5px] transition-[color,text-decoration-color] duration-200 hover:text-ink hover:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Компанийн танилцуулга
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
