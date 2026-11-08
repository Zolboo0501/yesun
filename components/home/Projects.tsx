"use client";
import { DollyGallery, type DollyGalleryDrive } from "@/components/react-bits/dolly-gallery";
import { ArrowUpRight } from "lucide-react";
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { StepCopy, StepLine } from "./Step";

type Project = { src: string; width: number; height: number; title: string; subtitle: string; alt: string };

// The client's original photos (public/images), with their pixel sizes.
// The run goes from the museum to the mine, with repeat clients spaced apart.
const projects: Project[] = [
  {
    src: "/images/project2.webp",
    width: 1430,
    height: 805,
    title: "Чингис хаан музей",
    subtitle: "Агаар сэлгэлт, хөргөлт, тоног төхөөрөмж · 2021",
    alt: "Чингис хаан үндэсний музей",
  },
  {
    src: "/images/project8.webp",
    width: 2048,
    height: 1152,
    title: "Platinum Tower",
    subtitle: "Агаар сэлгэлт, хөргөлт, нэгдсэн гараж · 2023",
    alt: "Platinum Tower орон сууц",
  },
  {
    src: "/images/project9.webp",
    width: 3072,
    height: 1364,
    title: "Хүннү 2222",
    subtitle: "Канад сургууль, спорт цогцолбор · 2022",
    alt: "Хүннү 2222 төслийн Канад сургууль, спорт цогцолбор",
  },
  {
    src: "/images/project11.webp",
    width: 1600,
    height: 1067,
    title: "Нийслэлийн захиргааны төв",
    subtitle: "Цогцолборын агаар сэлгэлт · 2024",
    alt: "Нийслэлийн нутгийн захиргааны төв цогцолбор",
  },
  {
    src: "/images/project12.webp",
    width: 760,
    height: 428,
    title: "Эрдэнэс Таван Толгой",
    subtitle: "Ажилчдын байр, оффис, хөргөлт · 2024",
    alt: "Эрдэнэс Таван Толгойн ажилчдын байр, оффис барилга",
  },
  {
    src: "/images/project7.webp",
    width: 1536,
    height: 2048,
    title: "Одод хотхон",
    subtitle: "Агаар сэлгэлт, хөргөлт, нэгдсэн гараж · 2022",
    alt: "Одод хотхоны орон сууц",
  },
  {
    src: "/images/project13.webp",
    width: 762,
    height: 764,
    title: "Сансар Гарден",
    subtitle: "2 блокийн агаар сэлгэлт, хөргөлт · 2024",
    alt: "Сансар Гарден орон сууцны хотхон",
  },
  {
    src: "/images/project4.webp",
    width: 966,
    height: 680,
    title: "Хүннү 2222",
    subtitle: "2-р ээлжийн орон сууц · 2020",
    alt: "Хүннү 2222 төслийн 2-р ээлжийн орон сууц",
  },
  {
    src: "/images/project10.webp",
    width: 3840,
    height: 2160,
    title: "Нисэх гарден хотхон",
    subtitle: "Орон сууцны агаар сэлгэлт · 2022",
    alt: "Нисэх гарден хотхон",
  },
  {
    src: "/images/project.webp",
    width: 1140,
    height: 570,
    title: "Эрдэнэс Таван Толгой",
    subtitle: "Нүүрс баяжуулах үйлдвэр, агаар сэлгэлт · 2024",
    alt: "Эрдэнэс Таван Толгойн нүүрс баяжуулах үйлдвэр",
  },
];

// Next's image optimizer serves each photo at the width the screen needs (never past the original). A tile is at most
// 820 × 566 (the gallery's box caps it below that: the full width less 32px on phones and tablets) and crops its photo
// to 1.45:1, so a photo wider than that is asked for at the width its height needs. A stable list, so the gallery
// builds its tiles once.
const images = projects.map(({ src, width, height, alt }) => {
  const crop = Math.max(1, width / height / 1.45); // how much wider than its tile the covering photo is
  const { props } = getImageProps({
    src,
    alt,
    width,
    height,
    quality: 90,
    sizes: `(min-width: 1024px) ${Math.round(820 * crop)}px, calc(min(820px, 100vw - 32px) * ${crop.toFixed(2)})`,
  });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes, alt };
});

// A scroll stage like the hero's: the opening, then one step per project, a screen of scroll each. Each step holds
// still for the first and last fifth of its scroll, then travels to the next.
const STEPS = projects.length + 1;
const UNITS = STEPS - 1;
const SPACING = 900; // the gallery's depth from one project to the next
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const stepAt = (x: number) => {
  const c = Math.min(Math.max(x, 0), UNITS);
  const i = Math.min(Math.floor(c), UNITS - 1);
  return i + clamp01((c - i - 0.2) / 0.6);
};

export function Projects() {
  const section = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  const step = useTransform(scrollYProgress, (v) => stepAt(v * UNITS));

  // The gallery follows the scroll: the opening holds the first project a step away, and every later step brings the
  // next one to the front.
  const driveRef = useRef<DollyGalleryDrive | null>(null);
  useMotionValueEvent(step, "change", (s) => driveRef.current?.go((s - 1) * SPACING));
  useEffect(() => {
    driveRef.current?.go((step.get() - 1) * SPACING);
  }, [step]);

  /** Scroll to step i. */
  const go = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + ((el.offsetHeight - window.innerHeight) * i) / UNITS,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="projects"
      ref={section}
      aria-label="Хэрэгжүүлсэн төслүүд"
      className="relative bg-night text-white"
      style={{ height: `${STEPS * 100}svh` }}
    >
      <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-clip">
        {/* The projects stand one behind another down the stage's depth and come to the front one per step, large,
            in the right three fifths on desktop and above the copy on phones. The scroll drives them; the pointer only
            leans them, a little. Each photo stands centred, so it is whole inside the screen on every step. The photo
            leaving the front fades where it stands instead of flying at the camera, so scrolling back brings the last
            one in whole rather than huge and cut by the gallery's edge. */}
        <div className="absolute inset-x-0 top-0 h-[60%] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[60%]">
          <DollyGallery
            images={images}
            infinite={false}
            itemWidth={820}
            aspectRatio={1.45}
            borderRadius={0}
            grayscale={0.25}
            spacing={SPACING}
            spread={0}
            scatter={0}
            passRange={0.5}
            passDepth={0.1}
            parallaxX={0.02}
            parallaxY={0.03}
            autoScroll={0}
            wheel={false}
            dragSpeed={0}
            driveRef={driveRef}
            label="Хэрэгжүүлсэн төслүүдийн зургууд"
            className="touch-pan-y overflow-visible"
          />
        </div>

        {/* Shade over the stage, as on the hero: dark under the copy and round the frame, open where the photos are. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-night)_22%,rgb(22_23_27/0.6)_46%,transparent_64%)] lg:bg-[linear-gradient(90deg,var(--color-night)_8%,rgb(22_23_27/0.8)_24%,rgb(22_23_27/0.25)_34%,transparent_42%)]" />
          <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-night to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-night/85 to-transparent" />
        </div>

        <StepCopy
          title="Хэрэгжүүлсэн төслүүд."
          text="Музейгээс уурхай хүртэл 150 гаруй объектод агаар сэлгэлт, хөргөлт угсарсан."
          index={0}
          progress={step}
          large
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-3 text-xs font-semibold text-night transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Бүх төсөл
            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
          </Link>
        </StepCopy>
        {/* each project as a caption beside its photo: the name a size down in a column that ends before the photo,
            and one short line under it, its year kept with the last word */}
        {projects.map((p, i) => (
          <StepCopy
            key={i}
            title={p.title}
            text={p.subtitle.replace(" · ", "\u00a0·\u00a0")}
            index={i + 1}
            progress={step}
            heading="h3"
            className="text-[clamp(2.25rem,0.75rem+2.4vw,2.875rem)] lg:w-[min(25rem,32vw)]"
          />
        ))}

        {/* the opening and each project, as short lines down the right edge; each one jumps to its step */}
        <nav
          aria-label="Төслүүд"
          className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-1.5 sm:right-6 lg:right-8"
        >
          {Array.from({ length: STEPS }, (_, i) => (
            <StepLine
              key={i}
              index={i}
              label={i === 0 ? "Эхлэл" : projects[i - 1].title}
              step={step}
              onSelect={() => go(i)}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
