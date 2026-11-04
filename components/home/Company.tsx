"use client";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";

const AirFlowScene = dynamic(() => import("./AirFlowScene"), {
  ssr: false,
  loading: () => null,
});

type Step = {
  title: string;
  text: string;
  facts?: { value: string; label: string }[];
  brands?: string[];
  cta?: boolean;
};

// The company in four parts: who we are, design and our own factory, supply and installation, service.
// Every figure is confirmed by the client (PRODUCT.md).
const steps: Step[] = [
  {
    title: "2011 оноос хойш 150 гаруй объектын агаарыг хариуцаж ирлээ.",
    text: "Барилга, хот байгуулалтын яамны тусгай зөвшөөрөлтэй. Агаар сэлгэлт, хөргөлтийн системийг зураг төслөөс эхлээд угсралт, засвар үйлчилгээ хүртэл нэг дор хийдэг.",
    facts: [
      { value: "2011", label: "Байгуулагдсан" },
      { value: "150+", label: "Угсралт хийсэн объект" },
    ],
  },
  {
    title: "Зураг төслөөс суваг хүртэл өөрсдөө хийнэ.",
    text: "Агаарын тооцоолол, зураг төслийг инженерүүд маань гаргаж, суваг, фасон эдлэлийг өөрийн үйлдвэрт төслийн хэмжээгээр хийнэ.",
    facts: [
      { value: "1 800 м²", label: "Үйлдвэрийн талбай" },
      { value: "12", label: "Үйлдвэрийн тоног төхөөрөмж" },
    ],
  },
  {
    title: "Зургаан брэндийн албан ёсны нийлүүлэгч.",
    text: "Агаар сэлгэлт, хөргөлтийн тоног төхөөрөмжийг нийлүүлж, нийслэл болон орон нутагт өөрсдөө угсарна.",
    brands: ["KANION", "AUX", "BALLU", "SHUFT", "AIRONN", "LAVFILL"],
  },
  {
    title: "Угсарсан системээ хариуцна.",
    text: "Угсралтад 1–3 жилийн чанарын баталгаа өгч, засвар үйлчилгээ хийнэ. Яаралтай дуудлагад 24/7 ажиллана.",
    facts: [
      { value: "1–3 жил", label: "Чанарын баталгаа" },
      { value: "24/7", label: "Яаралтай үйлчилгээ" },
    ],
    cta: true,
  },
];

const last = steps.length - 1;

export function Company() {
  const section = useRef<HTMLElement>(null);
  // Load the scene a screen early, draw it only while the section is on screen.
  const near = useInView(section, { once: true, margin: "100% 0px" });
  const active = useInView(section);
  const reducedMotion = useReducedMotion() ?? false;

  // 0 while the first part fills the stage under the 11vh header, `last` once the last one does.
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 0.11", "end end"],
  });
  const part = useTransform(scrollYProgress, (v) => v * last);

  return (
    <section
      id="about"
      ref={section}
      aria-label="Бидний тухай"
      className="relative bg-mist text-ink selection:bg-brand selection:text-white"
    >
      {/* The air stays on screen while the four parts scroll past: its streams wander between them and gather
          in the half each part leaves free (above the copy on phones). A soft light falls from the lower right. */}
      <div
        aria-hidden
        className="pointer-events-none sticky top-[11vh] h-[calc(100svh-11vh)] overflow-hidden bg-[radial-gradient(90%_80%_at_78%_82%,rgb(255_255_255/0.3),transparent_70%)]"
      >
        {near && <AirFlowScene part={part} last={last} active={active} reducedMotion={reducedMotion} />}
      </div>

      <div className="relative -mt-[calc(100svh-11vh)]">
        {steps.map((s, i) => (
          <PartCopy key={s.title} step={s} index={i} part={part} />
        ))}
      </div>
    </section>
  );
}

function PartCopy({ step, index, part }: { step: Step; index: number; part: MotionValue<number> }) {
  // fades in as its part reaches the stage and out as it scrolls on
  const opacity = useTransform(part, (p) => Math.min(1, Math.max(0, 1.25 - Math.abs(p - index) * 1.6)));
  const Heading = index === 0 ? "h2" : "h3";
  // the copy takes the other half (right while the air is left), its outer edge on the page container's edge
  const half =
    index % 2 === 0
      ? "lg:ml-auto lg:pl-[4vw] lg:pr-[max(2rem,calc(50vw-38rem))]"
      : "lg:pl-[max(2rem,calc(50vw-38rem))] lg:pr-[4vw]";

  return (
    <div className="flex min-h-[calc(100svh-11vh)] items-end px-4 pb-10 sm:px-6 lg:items-center lg:px-0 lg:pb-0">
      <motion.div style={{ opacity }} className={`w-full lg:w-1/2 ${half}`}>
        <div className="max-w-[36rem]">
          <Heading className="text-balance text-[clamp(2rem,1.3rem+2.6vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
            {step.title}
          </Heading>
          <p className="mt-5 max-w-[56ch] text-step-body leading-relaxed text-ink/80">{step.text}</p>

          {step.facts && (
            <dl className="mt-8 grid max-w-[26rem] grid-cols-2 gap-x-8">
              {step.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col-reverse justify-end border-t border-ink/15 py-4">
                  <dt className="mt-1 text-sm text-ink/80">{fact.label}</dt>
                  <dd className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">{fact.value}</dd>
                </div>
              ))}
            </dl>
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
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 whitespace-nowrap bg-ink px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Инженертэй холбогдох
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.16em] underline decoration-1 underline-offset-[6px] transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
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
