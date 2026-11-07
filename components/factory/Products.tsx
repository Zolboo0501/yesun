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

const ProductsScene = dynamic(() => import("./ProductsScene"), {
  ssr: false,
  loading: () => null,
});

type Step = {
  /** small label above the heading: the section, or the product's trade name */
  tag: string;
  name: string;
  lead?: string;
  text: string;
  points?: string[];
  cta?: boolean;
};

// One step per camera shot in ProductsScene, same order: the run, the fifteen products, the run again.
const steps: Step[] = [
  {
    tag: "Бүтээгдэхүүн",
    name: "Агаарын суваг, фасон эдлэл",
    text: "Агаар сэлгэлт, хөргөлтийн системийн суваг, фасон эдлэлийг үйлдвэрлэж, нийлүүлнэ. Гүйлгээд хэсэг бүртэй танилцаарай.",
  },
  {
    tag: "Rectangular duct",
    name: "Тэгш өнцөгт суваг",
    lead: "Нам таазанд их агаар дамжуулна.",
    text: "Хавтгай хэлбэр нь таазны нарийн зайд ч их хэмжээний агаар дамжуулж, гол шугамд тохирно.",
    points: ["Цайрдсан ган хуудас", "Фланцан холболт", "Хэмжээг төслөөр"],
  },
  {
    tag: "Bend duct",
    name: "Тэгш өнцөгт тохой",
    lead: "Чиглэлийг жигд солино.",
    text: "Радиустай тохой агаарыг огцом эргүүлэхгүй тул даралтын алдагдал, шуугиан бага.",
    points: ["90°, 45° болон бусад өнцөг", "Радиустай дотоод хана", "Фланцан холболт"],
  },
  {
    tag: "Special shape duct",
    name: "Тусгай хэлбэрийн суваг",
    lead: "Саадыг тойрч гарна.",
    text: "Дам нуруу, хоолой, бүтээцийг шилжилт, ташуу хэсгээр тойрч, шугамыг тасалдуулахгүй.",
    points: ["Барилгын зургаар", "Шилжилт, офсет", "Захиалгат хэмжээ"],
  },
  {
    tag: "Square and round duct",
    name: "Дөрвөлжин–дугуй шилжилт",
    lead: "Хоёр хэлбэрийг холбоно.",
    text: "Тэгш өнцөгт сувгийг дугуй хоолой, төхөөрөмжийн амсартай жигд холбож, урсгалыг тогтвортой байлгана.",
    points: ["Жигд шилжилт", "Сэнс, төхөөрөмжид", "Захиалгат хэмжээ"],
  },
  {
    tag: "Spiral air duct",
    name: "Спираль хоолой",
    lead: "Бат бөх, битүүмжлэл сайтай.",
    text: "Спираль түгжээт оёдол хоолойг хөшүүн болгож, агаар алдагдлыг багасгана. Урт хэсгээр хийгддэг тул холбоос цөөн.",
    points: ["Спираль түгжээт оёдол", "Агаар алдагдал бага", "Хурдан угсралт"],
  },
  {
    tag: "Lateral tee",
    name: "Ташуу салаа",
    lead: "Урсгалыг зөөлөн салаална.",
    text: "45° өнцгөөр салаалдаг тул агаарыг огцом эргүүлэхгүй, даралтын алдагдал, шуугиан бага.",
    points: ["45° салаалалт", "Даралтын алдагдал бага", "Диаметр захиалгаар"],
  },
  {
    tag: "Spiral insulation duct",
    name: "Дулаалгатай спираль хоолой",
    lead: "Хүйтэн, дулааныг алдахгүй.",
    text: "Давхар ханын хоорондох дулаалга хөргөсөн, халаасан агаарыг алдагдал багатай дамжуулж, конденсацаас хамгаална.",
    points: ["Давхар хана", "Конденсацаас хамгаална", "Чимээ бууруулна"],
  },
  {
    tag: "45° bend duct",
    name: "45° тохой",
    lead: "Салааг шугамтай жигд нийлүүлнэ.",
    text: "Сегмент хэсгүүдээс угсарсан 45° тохой ташуу салааг гол шугамтай зэрэгцүүлж, урсгалыг огцом эргүүлэхгүй.",
    points: ["Сегмент хэсгүүд", "Ташуу салаатай хослоно", "Диаметр захиалгаар"],
  },
  {
    tag: "Reducer",
    name: "Нарийсгагч",
    lead: "Диаметрийг жигд багасгана.",
    text: "Агаарын хэмжээ багасах хэсэгт хоолойн диаметрийг конусаар жигд нарийсгаж, урсгалын хурдыг тогтвортой барина.",
    points: ["Конус хэлбэр", "Хоёр талдаа холбох хошуу", "Диаметр захиалгаар"],
  },
  {
    tag: "Straight tee",
    name: "Шулуун салаа",
    lead: "90° өнцгөөр салаална.",
    text: "Гол шугамаас 90° өнцгөөр салаа гаргаж, сараалж, төхөөрөмж рүү агаар хуваарилна.",
    points: ["90° салаалалт", "Өөр диаметртэй салаа", "Хурдан угсралт"],
  },
  {
    tag: "Aluminum foil flexible duct",
    name: "Уян хоолой",
    lead: "Хаана ч нугалж холбоно.",
    text: "Хөнгөн цагаан тугалган уян хоолой сараалж, төхөөрөмжийг гол шугамтай ойрхон зайд хурдан холбоно.",
    points: ["Хөнгөн, уян", "Хурдан холболт", "Богино зайд"],
  },
  {
    tag: "90° bend duct",
    name: "Сегментэн 90° тохой",
    lead: "Дугуй шугамыг эргүүлнэ.",
    text: "Сегмент хэсгүүдээс угсарсан тохой дугуй хоолойг радиустай, жигд эргүүлж, даралтын алдагдлыг бага байлгана.",
    points: ["Сегмент хэсгүүд", "Радиустай эргэлт", "Диаметр захиалгаар"],
  },
  {
    tag: "90° stamping duct",
    name: "Шахмал 90° тохой",
    lead: "Гөлгөр, оёдолгүй.",
    text: "Нэг хэсгээр дарж хэвлэсэн тул дотор тал нь гөлгөр, оёдолгүй, агаар алдагдал бага.",
    points: ["Оёдолгүй", "Гөлгөр дотор тал", "Авсаархан радиус"],
  },
  {
    tag: "Flexible insulation duct",
    name: "Дулаалгатай уян хоолой",
    lead: "Уян бас дулаалгатай.",
    text: "Хөргөсөн, халаасан агаарыг сараалж хүртэл алдагдал багатай хүргэж, конденсац, чимээг бууруулна.",
    points: ["Дулаалгатай", "Уян холболт", "Чимээ бууруулна"],
  },
  {
    tag: "Oval duct",
    name: "Зууван суваг",
    lead: "Нам таазанд дугуйн давуу тал.",
    text: "Зууван хэлбэр нь дугуй хоолойн битүүмжлэлийг хадгалж, тэгш өнцөгт суваг шиг нам таазанд багтана.",
    points: ["Нам өндөр", "Битүүмжлэл сайн", "Хэмжээ захиалгаар"],
  },
  {
    tag: "Захиалга",
    name: "Төслийн хэмжээгээр хийнэ",
    text: "Зураг, хэмжээгээ илгээвэл инженер маань тохирох суваг, фасон эдлэлийг тооцоолж санал болгоно.",
    cta: true,
  },
];

const last = steps.length - 1;
const products = steps.slice(1, -1);
const pad = (n: number) => String(n).padStart(2, "0");

export function Products() {
  const section = useRef<HTMLElement>(null);
  // Load the scene a screen early, draw it only while the section is on screen.
  const near = useInView(section, { once: true, margin: "100% 0px" });
  const active = useInView(section);
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

  const go = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + ((el.offsetHeight - window.innerHeight) * i) / last,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="products"
      ref={section}
      aria-label="Бүтээгдэхүүн: агаарын суваг, фасон эдлэл"
      className="relative bg-graphite text-white"
      style={{ height: `${steps.length * 70}svh` }}
    >
      <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden">
        <div className="absolute inset-0">
          {near && <ProductsScene progress={step} active={active} reducedMotion={reducedMotion} />}
        </div>

        {/* Technical frame around the stage, as in the hero. */}
        <p
          aria-hidden
          className="pointer-events-none absolute left-4 top-6 rotate-180 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 [writing-mode:vertical-rl] max-lg:hidden"
        >
          Бүтээгдэхүүн / 15
        </p>
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50"
        >
          Гүйлгэж танилцана
          <span className="relative h-px w-16 bg-white/15">
            <motion.span
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 origin-left bg-white"
            />
          </span>
        </div>
        <p
          aria-hidden
          className="pointer-events-none absolute bottom-5 right-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50"
        >
          <motion.span>{counter}</motion.span> / {pad(steps.length)}
        </p>

        {/* What the run is made of, above the copy: jump to any product. */}
        <nav
          aria-label="Бүтээгдэхүүний жагсаалт"
          className="absolute left-[5vw] top-6 w-[40vw] bg-graphite/80 px-5 py-4 max-lg:hidden"
        >
          <ol className="grid grid-flow-col grid-rows-8 gap-x-6 gap-y-1.5">
            {products.map((p, n) => (
              <IndexItem key={p.tag} index={n + 1} label={p.name} progress={step} onSelect={() => go(n + 1)} />
            ))}
          </ol>
        </nav>

        {steps.map((s, i) => (
          <StepCopy key={s.tag} step={s} index={i} progress={step} />
        ))}
      </div>
    </section>
  );
}

function IndexItem({
  index,
  label,
  progress,
  onSelect,
}: {
  index: number;
  label: string;
  progress: MotionValue<number>;
  onSelect: () => void;
}) {
  const opacity = useTransform(progress, (s) => (Math.round(s) === index ? 1 : 0.45));
  return (
    <li>
      <motion.button
        type="button"
        style={{ opacity }}
        onClick={onSelect}
        className="flex items-baseline gap-3 text-left font-mono text-[10px] uppercase tracking-[0.14em] transition-opacity hover:!opacity-100 focus-visible:!opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span className="tabular-nums text-white/60">{pad(index)}</span>
        {label}
      </motion.button>
    </li>
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
  const Heading = index === 0 ? "h2" : "h3";
  const isProduct = index > 0 && index < last;

  return (
    <motion.div
      style={{ opacity, y, visibility }}
      className="absolute inset-x-0 bottom-12 bg-graphite px-4 pt-5 sm:px-6 lg:bottom-[14%] lg:left-[5vw] lg:right-auto lg:w-[40vw] lg:bg-transparent lg:p-0"
    >
      <div className="relative lg:bg-graphite/85 lg:p-10">
        {/* Corner brackets */}
        <span aria-hidden className="pointer-events-none absolute left-0 top-0 size-3.5 border-l-2 border-t-2 border-brand max-lg:hidden" />
        <span aria-hidden className="pointer-events-none absolute right-0 top-0 size-3.5 border-r-2 border-t-2 border-brand max-lg:hidden" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 size-3.5 border-b-2 border-l-2 border-brand max-lg:hidden" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 size-3.5 border-b-2 border-r-2 border-brand max-lg:hidden" />

        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">
          {isProduct ? `${pad(index)} / ${pad(products.length)} · ${step.tag}` : step.tag}
        </p>
        <Heading className="mt-4 text-balance text-[clamp(2rem,1.3rem+2.6vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
          {step.name}
        </Heading>
        {step.lead && (
          <p className="mt-3 text-lg font-medium tracking-[-0.01em] text-white/90">{step.lead}</p>
        )}
        <p className="mt-4 max-w-[44ch] text-step-body leading-relaxed text-white/70">{step.text}</p>
        {step.points && (
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            {step.points.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 bg-brand" />
                {point}
              </li>
            ))}
          </ul>
        )}
        {step.cta && (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-white px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-ink transition-colors hover:bg-brand hover:text-white active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Инженертэй холбогдох
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={`tel:${contact.phone}`}
              className="font-mono text-xs uppercase tracking-[0.16em] underline decoration-1 underline-offset-[6px] transition-colors hover:text-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {contact.phone}
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
