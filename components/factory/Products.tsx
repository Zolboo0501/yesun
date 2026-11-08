"use client";
import { StepCopy } from "@/components/home/Step";
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
/** The fifteen products, in the GLB's order; the about page's product tile names them too. */
export const products = steps.slice(1, -1);
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
        {/* Shade over the run, as on the home page's stages: dark under the copy, open where the product is. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,var(--color-graphite)_18%,rgb(31_34_38/0.6)_42%,transparent_62%)] lg:bg-[linear-gradient(90deg,rgb(31_34_38/0.85)_4%,rgb(31_34_38/0.55)_24%,rgb(31_34_38/0.15)_36%,transparent_44%)]"
        />

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

        {/* Each step's copy as on the home page's stages (components/home/Step.tsx): the name in two lines with the
            second set in, a rule with one sentence beside it; low on the left on desktop, clear of the product list and
            of the product, and at the foot on phones. */}
        {steps.map((s, i) => {
          const isProduct = i > 0 && i < last;
          return (
            <StepCopy
              key={s.tag}
              title={s.name}
              text={s.text}
              index={i}
              progress={step}
              heading={i === 0 ? "h1" : "h3"}
              large={i === 0}
              className={
                i === 0
                  ? "lg:left-[5vw] lg:top-auto lg:bottom-[12%] lg:translate-y-0"
                  : "text-[clamp(2.25rem,0.75rem+2.4vw,2.875rem)] lg:left-[5vw] lg:top-auto lg:bottom-[12%] lg:w-[min(28rem,36vw)] lg:translate-y-0"
              }
            >
              {isProduct && s.points && <p className="text-sm text-white/55">{s.points.join(" · ")}</p>}
              {s.cta && (
                <>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-3 text-xs font-semibold text-graphite transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Инженертэй холбогдох
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                  </Link>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-sm text-white/75 underline decoration-1 underline-offset-[6px] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {contact.phone}
                  </a>
                </>
              )}
            </StepCopy>
          );
        })}
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
