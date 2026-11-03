"use client";
import { ConcaveCarousel, type ConcaveCarouselItem } from "@/components/react-bits/concave-carousel";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

// The carousel sizes its panels in JS, so the breakpoint is read here; the server renders the desktop size.
const wideQuery = "(min-width: 1024px)";
const subscribe = (change: () => void) => {
  const query = window.matchMedia(wideQuery);
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
};

// Photos are the project photos resized to 1280px for the carousel (public/images/carousel).
// The wall runs from the museum to the mine, with repeat clients spaced apart.
const projects: ConcaveCarouselItem[] = [
  {
    src: "/images/carousel/project2.webp",
    title: "Чингис хаан музей",
    subtitle: "Сэлгэлт, хөргөлт, тоног төхөөрөмж · 2021",
    alt: "Чингис хаан үндэсний музей",
  },
  {
    src: "/images/carousel/project8.webp",
    title: "Platinum Tower",
    subtitle: "Сэлгэлт, хөргөлт, нэгдсэн граж · 2023",
    alt: "Platinum Tower орон сууц",
  },
  {
    src: "/images/carousel/project9.webp",
    title: "Хүннү 2222",
    subtitle: "Канад сургууль, спорт цогцолбор · 2022",
    alt: "Хүннү 2222 төслийн Канад сургууль, спорт цогцолбор",
  },
  {
    src: "/images/carousel/project11.webp",
    title: "Нийслэлийн захиргааны төв",
    subtitle: "Цогцолборын агаар сэлгэлт · 2024",
    alt: "Нийслэлийн нутгийн захиргааны төв цогцолбор",
  },
  {
    src: "/images/carousel/project12.webp",
    title: "Эрдэнэс Таван Толгой",
    subtitle: "Ажилчдын байр, оффис, хөргөлт · 2024",
    alt: "Эрдэнэс Таван Толгойн ажилчдын байр, оффис барилга",
  },
  {
    src: "/images/carousel/project7.webp",
    title: "Одод хотхон",
    subtitle: "Сэлгэлт, хөргөлт, нэгдсэн граж · 2022",
    alt: "Одод хотхон орон сууцны хотхон",
  },
  {
    src: "/images/carousel/project13.webp",
    title: "Сансар Гарден",
    subtitle: "2 блокийн сэлгэлт, хөргөлт · 2024",
    alt: "Сансар Гарден орон сууцны хотхон",
  },
  {
    src: "/images/carousel/project4.webp",
    title: "Хүннү 2222",
    subtitle: "2-р ээлжийн орон сууц · 2020",
    alt: "Хүннү 2222 төслийн 2-р ээлжийн орон сууц",
  },
  {
    src: "/images/carousel/project10.webp",
    title: "Нисэх гарден хотхон",
    subtitle: "Орон сууцны агаар сэлгэлт · 2022",
    alt: "Нисэх гарден хотхон",
  },
  {
    src: "/images/carousel/project.webp",
    title: "Эрдэнэс Таван Толгой",
    subtitle: "Нүүрс баяжуулах үйлдвэр, агаар сэлгэлт · 2024",
    alt: "Эрдэнэс Таван Толгойн нүүрс баяжуулах үйлдвэр",
  },
];

export function Projects() {
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia(wideQuery).matches, () => true);
  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-graphite pt-24 text-white lg:pt-32">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h2
            id="projects-title"
            className="text-balance text-[clamp(2rem,1.3rem+2.6vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
          >
            Музейгээс уурхай хүртэл.
          </h2>
          <p className="mt-5 max-w-[54ch] text-step-body leading-relaxed text-white/70">
            Төрийн байгууллага, орон сууц, үйлдвэр, музейд агаар сэлгэлт, хөргөлтийн систем угсарсан 150 гаруй
            объектоос заримыг нь энд харуулав. Чирж эргүүлээд төсөл бүртэй танилцаарай.
          </p>
        </div>
        <Link
          href="/projects"
          className="group inline-flex items-center gap-3 bg-white px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-ink transition-colors hover:bg-brand hover:text-white active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Бүх төсөл
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* The wall of projects: drag or use the arrow keys; the page wheel stays the page's.
          Phones step instead of drifting, so the slide the counter names rests centred with its caption whole. */}
      <div className="mt-6 h-[min(64svh,560px)] w-full lg:mt-10 lg:h-[min(80svh,780px)]">
        <ConcaveCarousel
          items={projects}
          aspect={1.45}
          size={wide ? 0.6 : 0.52}
          autoplay={wide ? "drift" : "step"}
          speed={0.1}
          wheel={false}
          dpr={1.5}
          className="text-white"
          ariaLabel="Хэрэгжүүлсэн төслүүд. Чирж эсвэл сумны товчоор эргүүлнэ, Space товч хөдөлгөөнийг зогсооно."
        />
      </div>
    </section>
  );
}
