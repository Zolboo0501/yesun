"use client";
import { contact } from "@/constants/data";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

type Step = { tag: string; title: string; text: string; cta?: boolean };

// One step per camera shot in HeroScene, same order.
const steps: Step[] = [
  {
    tag: "Есөн Бэлчир",
    title: "Цэвэр агаарыг инженерчилнэ.",
    text: "Агаар сэлгэлт, хөргөлтийн системийг тооцоолж, үйлдвэрлэж, угсардаг инженерийн компани.",
  },
  {
    tag: "Тооцоолол",
    title: "Өрөө бүрээр тооцоолно.",
    text: "Агаарын солилцоо, хөргөлтийн ачааллыг тооцоолж, зураг төслийг өөрсдөө боловсруулдаг. 2011 оноос хойш Барилга, хот байгуулалтын яамны тусгай зөвшөөрөлтэй.",
  },
  {
    tag: "Үйлдвэрлэл",
    title: "Сувгаа өөрсдөө хийнэ.",
    text: "Агаарын суваг, бөөлгийг 1 800 м² талбайтай, 12 тоног төхөөрөмжтэй өөрсдийн үйлдвэрт хийдэг.",
  },
  {
    tag: "Төхөөрөмж",
    title: "Дэлхийн 6 брэнд.",
    text: "KANION, AUX, BALLU, SHUFT, AIRONN, LAVFILL брэндийн хөргөлт, агаар сэлгэлтийн төхөөрөмжийг албан ёсоор нийлүүлнэ.",
  },
  {
    tag: "Угсралт",
    title: "150 гаруй объект.",
    text: "Оффис, үйлдвэр, зочид буудал, худалдааны төвд нийслэл болон орон нутагт угсралт хийсэн.",
  },
  {
    tag: "Үйлчилгээ",
    title: "Баталгаатай ажиллуулна.",
    text: "Угсралтдаа 1–3 жилийн чанарын баталгаа гаргаж, яаралтай үед 24/7 засвар үйлчилгээ үзүүлнэ.",
    cta: true,
  },
];

const last = steps.length - 1;
const pad = (n: number) => String(n).padStart(2, "0");

export function Hero() {
  const section = useRef<HTMLElement>(null);
  // Start drawing straight away; the observer only pauses it once the hero is scrolled past.
  const active = useInView(section, { initial: true });
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  // Each step holds still for the first and last fifth of its scroll, then travels.
  const step = useTransform(scrollYProgress, (v) => {
    const x = v * last;
    const i = Math.min(Math.floor(x), last - 1);
    const f = Math.min(Math.max((x - i - 0.2) / 0.6, 0), 1);
    return i + f;
  });
  const counter = useTransform(step, (s) => pad(Math.round(s) + 1));

  return (
    <section
      id="home"
      ref={section}
      aria-label="Есөн Бэлчир: агаар сэлгэлт, хөргөлтийн систем"
      className="relative bg-panel text-ink"
      style={{ height: `${steps.length * 100}svh` }}
    >
      <div className="sticky top-[11vh] h-[calc(100svh-11vh)] overflow-hidden">
        <div className="absolute inset-0">
          <HeroScene
            progress={step}
            active={active}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Technical frame around the stage, as on a spec sheet. */}
        <p
          aria-hidden
          className="pointer-events-none absolute left-4 top-6 rotate-180 font-mono text-[11px] uppercase tracking-[0.2em] text-soft [writing-mode:vertical-rl] max-lg:hidden"
        >
          ЕБ / 2011
        </p>
        <p
          aria-hidden
          className="pointer-events-none absolute right-5 top-5 font-mono text-[11px] tracking-[0.12em] text-soft"
        >
          47.9184° N&nbsp;&nbsp;106.9177° E
        </p>
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
          className="pointer-events-none absolute bottom-5 right-5 font-mono text-[11px] uppercase tracking-[0.16em] text-soft"
        >
          <span className="max-sm:hidden">Систем бэлэн&nbsp;&nbsp;&nbsp;</span>
          <motion.span>{counter}</motion.span> / {pad(steps.length)}
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

        {steps.map((s, i) => (
          <StepCopy key={s.tag} step={s} index={i} progress={step} />
        ))}
      </div>
    </section>
  );
}

function StepCopy({
  step,
  index,
  progress,
}: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, (s) =>
    Math.max(0, 1 - Math.abs(s - index) * 2.5),
  );
  const y = useTransform(progress, (s) => (index - s) * 60);
  const visibility = useTransform(opacity, (o) =>
    o > 0.02 ? "visible" : "hidden",
  );
  const Heading = index === 0 ? "h1" : "h2";

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
