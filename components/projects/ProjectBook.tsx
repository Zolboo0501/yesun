"use client";
import { Heading } from "@/components/about/Heading";
import PageFlip, { type PageFlipLeaf } from "@/components/react-bits/page-flip";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type Kind = "home" | "public" | "industry";

type Project = {
  title: string;
  /** what the building is, when the title does not say */
  scope?: string;
  /** the work done, as short tags */
  work: string[];
  year: number;
  engineer: string;
  /** what kind of building, for the list's filter */
  kind: Kind;
  image: string;
};

// The client's projects from the old projects page, in the order they were built, their copy cut short. The old
// page's five-star ratings are gone: they were not real reviews.
const projects: Project[] = [
  {
    title: "Монгол банкны үндэсний цахим гүйлгээний төв",
    work: ["Агаар сэлгэлт"],
    year: 2019,
    engineer: "Ц.Хосбаяр",
    kind: "public",
    image: "/images/project3.webp",
  },
  {
    title: "Хүннү 2222, 2-р ээлж",
    scope: "Орон сууцны нэгдсэн граж",
    work: ["Агаар сэлгэлт", "Хөргөлт", "Угсралт"],
    year: 2020,
    engineer: "Ц.Хосбаяр",
    kind: "home",
    image: "/images/project6.webp",
  },
  {
    title: "Хүннү 2222, 2-р ээлж",
    scope: "Орон сууц",
    work: ["Агаар сэлгэлт"],
    year: 2020,
    engineer: "Ц.Хосбаяр",
    kind: "home",
    image: "/images/project4.webp",
  },
  {
    title: "Чингис хаан музей",
    work: ["Агаар сэлгэлт", "Хөргөлт", "Тоног төхөөрөмж", "Угсралт"],
    year: 2021,
    engineer: "Д.Хангай",
    kind: "public",
    image: "/images/project2.webp",
  },
  {
    title: "Нисэх гарден хотхон",
    scope: "Орон сууц",
    work: ["Агаар сэлгэлт"],
    year: 2022,
    engineer: "М.Далайсайхан",
    kind: "home",
    image: "/images/project10.webp",
  },
  {
    title: "Хүннү 2222, 3-р ээлж",
    scope: "Канад сургууль, спорт цогцолбор",
    work: ["Агаар сэлгэлт", "Хөргөлт", "Тоног төхөөрөмж", "Угсралт"],
    year: 2022,
    engineer: "Д.Хангай",
    kind: "public",
    image: "/images/project9.webp",
  },
  {
    title: "Одод хотхон",
    scope: "2 блок орон сууц, нэгдсэн граж",
    work: ["Агаар сэлгэлт", "Хөргөлт"],
    year: 2022,
    engineer: "Д.Хангай",
    kind: "home",
    image: "/images/project7.webp",
  },
  {
    title: "Platinum Tower",
    scope: "2 блок орон сууц, нэгдсэн граж",
    work: ["Агаар сэлгэлт", "Хөргөлт"],
    year: 2023,
    engineer: "Ц.Хосбаяр",
    kind: "home",
    image: "/images/project8.webp",
  },
  {
    title: "Эрдэнэс Таван Толгой",
    scope: "Нүүрс баяжуулах үйлдвэр",
    work: ["Агаар сэлгэлт"],
    year: 2024,
    engineer: "Д.Хангай",
    kind: "industry",
    image: "/images/project.webp",
  },
  {
    title: "Сансар Гарден",
    scope: "2 блок орон сууц",
    work: ["Агаар сэлгэлт", "Хөргөлт"],
    year: 2024,
    engineer: "Ц.Хосбаяр",
    kind: "home",
    image: "/images/project13.webp",
  },
  {
    title: "Нийслэлийн захиргааны төв",
    scope: "Цогцолбор",
    work: ["Агаар сэлгэлт"],
    year: 2024,
    engineer: "Ц.Хосбаяр",
    kind: "public",
    image: "/images/project11.webp",
  },
  {
    title: "Эрдэнэс Таван Толгой",
    scope: "Ажилчдын байр, оффис",
    work: ["Агаар сэлгэлт", "Хөргөлт"],
    year: 2024,
    engineer: "Д.Хангай",
    kind: "industry",
    image: "/images/project12.webp",
  },
];

// The team page's portraits of the engineers who led them; one has no photo yet and shows her initials.
const portraits: Record<string, string> = {
  "Ц.Хосбаяр": "/images/member3.jpg",
  "Д.Хангай": "/images/member4.jpg",
};

const FILTERS = [
  { id: "all", label: "Бүгд" },
  { id: "home", label: "Орон сууц" },
  { id: "public", label: "Олон нийтийн" },
  { id: "industry", label: "Үйлдвэр, уурхай" },
] as const;

const N = projects.length;
const FIRST = projects[0].year;
const LAST = projects[N - 1].year;
const pad = (n: number) => String(n).padStart(2, "0");
const describe = (p: Project) => [p.title, p.scope].filter(Boolean).join(", ");
const initials = (name: string) =>
  name
    .split(/[.\s]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("");

/** The front cover: the catalogue's name, its years and how to open it. */
function Cover() {
  return (
    <div className="@container h-full">
      <div className="relative flex h-full flex-col justify-between bg-graphite p-[7cqw] text-white">
        <p className="font-mono text-[max(10px,2.2cqw)] uppercase tracking-[0.18em] text-white/55">Есөн Бэлчир ХХК</p>
        <div>
          <p className="text-balance text-[max(1.5rem,7cqw)] font-semibold leading-none tracking-[-0.03em]">
            Хэрэгжүүлсэн төслүүд
          </p>
          <p className="mt-[3cqw] text-[max(0.8125rem,2.8cqw)] text-white/65">
            150 гаруй объектоос онцлох {N} нь · {FIRST}–{LAST}
          </p>
        </div>
        <p className="flex items-center gap-2 self-end text-[max(11px,2.4cqw)] font-medium text-white/80">
          Нээх <ArrowRight aria-hidden className="size-[1.1em]" />
        </p>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[6cqw] bg-linear-to-r from-black/30 to-transparent" />
      </div>
    </div>
  );
}

/** The back cover, last page of the book. */
function BackCover() {
  return (
    <div className="@container h-full">
      <div className="flex h-full flex-col justify-end bg-graphite p-[7cqw] text-white">
        <p className="text-balance text-[max(1.25rem,5.4cqw)] font-semibold leading-[1.1] tracking-[-0.025em]">
          Дараагийн төсөл таных байж болно.
        </p>
        <p className="mt-[2.5cqw] text-[max(0.8125rem,2.6cqw)] text-white/65">Инженертэй холбогдож, төслөө ярилцаарай.</p>
      </div>
    </div>
  );
}

/** A left-hand page: the project's number and year, its name, what the building is, the work as tags, and the
 *  engineer who led it, with a shade toward the spine. */
function TextPage({ project, index }: { project: Project; index: number }) {
  const portrait = portraits[project.engineer];
  return (
    <div className="@container h-full">
      <div className="relative flex h-full flex-col bg-[#f5f6f8] p-[7cqw] text-ink">
        {/* the project's number, large and faint, holding the page's empty middle */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-[6cqw] top-[10cqw] text-[34cqw] font-semibold leading-none tracking-[-0.06em] text-ink/[0.05] tabular-nums"
        >
          {pad(index + 1)}
        </span>
        <div className="relative flex items-baseline justify-between font-mono text-[max(10px,2.2cqw)] tabular-nums tracking-[0.14em] text-ink/45">
          <span>
            {pad(index + 1)} / {pad(N)}
          </span>
          <span>{project.year}</span>
        </div>
        <p className="mt-auto text-balance text-[max(1.125rem,5.4cqw)] font-semibold leading-[1.08] tracking-[-0.025em]">
          {project.title}
        </p>
        {project.scope && <p className="mt-[1.5cqw] text-[max(0.8125rem,2.8cqw)] text-ink/60">{project.scope}</p>}
        <ul className="mt-[4cqw] flex flex-wrap gap-1.5">
          {project.work.map((work) => (
            <li
              key={work}
              className="rounded-full bg-ink/[0.06] px-2.5 py-1 text-[max(11px,2.2cqw)] font-medium text-ink/75"
            >
              {work}
            </li>
          ))}
        </ul>
        <div className="mt-[5cqw] flex items-center gap-3 border-t border-ink/10 pt-[4cqw]">
          <span className="relative size-[max(32px,7cqw)] shrink-0 overflow-hidden rounded-full bg-ink/[0.08]">
            {portrait ? (
              <Image src={portrait} alt="" fill sizes="48px" className="object-cover object-top" />
            ) : (
              <span className="flex size-full items-center justify-center text-[max(11px,2.2cqw)] font-semibold text-ink/50">
                {initials(project.engineer)}
              </span>
            )}
          </span>
          <p className="text-[max(12px,2.4cqw)] leading-tight">
            <span className="block text-ink/50">Гүйцэтгэсэн инженер</span>
            <span className="block font-semibold">{project.engineer}</span>
          </p>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[8cqw] bg-linear-to-l from-ink/[0.08] to-transparent" />
      </div>
    </div>
  );
}

/** A right-hand page: the project's photograph, with a shade toward the spine. */
function PhotoPage({ project, width }: { project: Project; width: number }) {
  return (
    <div className="relative h-full">
      <Image src={project.image} alt={describe(project)} fill sizes={`${width}px`} className="object-cover" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[8%] bg-linear-to-r from-black/25 to-transparent" />
    </div>
  );
}

/** A project in the list: its photo (4:3, 20px corners) with its year and number on it, then its name and what the
 *  building is. The photo closes in under the pointer and a book mark rises at its corner; the project open in the
 *  book is ringed in brand and says so. */
function ProjectCard({
  project,
  index,
  active,
  onOpen,
}: {
  project: Project;
  index: number;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-current={active ? "true" : undefined}
      className="group block w-full cursor-pointer rounded-[20px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <span
        className={cn(
          "relative block aspect-[4/3] overflow-hidden rounded-[20px] bg-ink/5 transition-shadow duration-300",
          active && "ring-2 ring-brand ring-offset-2",
        )}
      >
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <span aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/35 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold tabular-nums text-ink backdrop-blur-sm">
          {project.year}
        </span>
        <span aria-hidden className="absolute right-3.5 top-3.5 font-mono text-xs tabular-nums text-white/85">
          {pad(index + 1)}
        </span>
        {active ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white">
            Харж байна
          </span>
        ) : (
          <span
            aria-hidden
            className="absolute bottom-3 right-3 flex size-9 translate-y-1 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            <BookOpen className="size-4" />
          </span>
        )}
      </span>
      <span className="mt-3 block text-pretty font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
        {project.title}
      </span>
      {project.scope && <span className="mt-0.5 block text-sm text-ink/55">{project.scope}</span>}
    </button>
  );
}

/** The projects page as a catalogue to leaf through, on react-bits' PageFlip, filling the screen under the header on
 *  the night ground. On a wide screen the book opens into spreads as large as the screen allows, each project's
 *  details on the left and its photo on the right; on a phone it turns one photo at a time and the details sit under
 *  it. A click on a page, a swipe, the arrow keys or the buttons turn it, and the list of every project under it
 *  jumps straight to one. The book itself is hidden from assistive tech: the buttons, the list and the details line
 *  carry everything it shows. */
export function ProjectBook() {
  const frame = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  // the screen-filling section (sets the mode) and the room it leaves the book (sets the pages)
  const [screen, setScreen] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [open, setOpen] = useState(0);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(stage, { amount: 0.4 });
  const swipe = useRef<{ x: number; y: number; swiped: boolean }>({ x: 0, y: 0, swiped: false });

  useEffect(() => {
    const room = stage.current;
    const whole = frame.current;
    if (!room || !whole) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size = { w: Math.round(entry.contentRect.width), h: Math.round(entry.contentRect.height) };
        if (entry.target === room) setBox(size);
        else setScreen(size);
      }
    });
    observer.observe(room);
    observer.observe(whole);
    return () => observer.disconnect();
  }, []);

  // The pages fill the room the screen leaves. A landscape screen opens the book into spreads, two pages side by
  // side, each within 1.4:1 either way so a very wide or tall screen does not stretch them; a portrait screen (a
  // phone, a tablet held upright) turns one page at a time, as large as the room.
  const spread = screen.w >= 600 && screen.w >= screen.h * 1.05;
  const width = spread ? Math.min(Math.floor(box.w / 2), Math.round(box.h * 1.4)) : box.w;
  const height = spread ? Math.min(box.h, Math.round(width * 1.4)) : box.h;
  // A spread can turn past the last photo to the back cover; a single page stops on the last photo.
  const max = spread ? N + 1 : N;
  const shown = Math.min(open, max);
  const current = shown >= 1 && shown <= N ? shown - 1 : -1;

  const turn = useCallback((by: number) => setOpen((o) => Math.max(0, Math.min(Math.min(o, max) + by, max))), [max]);
  const goTo = (index: number) => {
    setOpen(Math.min(index + 1, max));
    // the book opens the page; bring it back into view
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (!inView) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      if (event.key === "ArrowRight") turn(1);
      else if (event.key === "ArrowLeft") turn(-1);
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, turn]);

  const leaves: PageFlipLeaf[] = useMemo(
    () =>
      Array.from({ length: N + 1 }, (_, k) => ({
        id: k === 0 ? "cover" : `project-${k}`,
        front: k === 0 ? <Cover /> : <PhotoPage project={projects[k - 1]} width={width} />,
        back: k < N ? <TextPage project={projects[k]} index={k} /> : <BackCover />,
      })),
    [width],
  );

  const onPointerDown = (event: PointerEvent) => {
    swipe.current = { x: event.clientX, y: event.clientY, swiped: false };
  };
  const onPointerUp = (event: PointerEvent) => {
    const dx = event.clientX - swipe.current.x;
    const dy = event.clientY - swipe.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      swipe.current.swiped = true;
      turn(dx < 0 ? 1 : -1);
    }
  };

  const counter = shown === 0 ? "Нүүр" : shown > N ? "Төгсгөл" : `${pad(shown)} / ${pad(N)}`;
  const project = current >= 0 ? projects[current] : null;
  const roundButton =
    "flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={frame}
        aria-labelledby="projects-title"
        className="flex h-[calc(100svh-var(--header-h))] min-h-[34rem] flex-col bg-night text-white"
      >
        <h1 id="projects-title" className="sr-only">
          Хэрэгжүүлсэн төслүүд
        </h1>

        {/* the book, as large as the screen allows */}
        <div
          ref={stage}
          aria-hidden
          className="min-h-0 flex-1 touch-pan-y select-none px-4 pt-5 sm:px-8 sm:pt-8 lg:px-12"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onClickCapture={(event) => {
            if (!swipe.current.swiped) return;
            swipe.current.swiped = false;
            event.stopPropagation();
          }}
        >
          {screen.w > 0 && box.w > 0 && box.h > 0 && (
            <PageFlip
              pages={leaves}
              pageWidth={width}
              pageHeight={height}
              pageRadius={6}
              pageColor="#f5f6f8"
              perspective={2800}
              spineShift={spread ? width / 2 : 0}
              peekAngle={spread ? 6 : 0}
              duration={0.75}
              shadow={0.35}
              closeOnLeave={false}
              closeOnBackground={false}
              keyboard={false}
              open={shown}
              onOpenChange={(next) => setOpen(Math.min(next, max))}
            />
          )}
        </div>

        <div className="px-4 pb-5 pt-4 sm:px-8 sm:pb-6 lg:px-12">
          {/* what the page shows, when only the photo turns (a portrait screen) and always for assistive tech */}
          <div aria-live="polite" className={spread ? "sr-only" : "mb-4 min-h-[6.25rem]"}>
            {project ? (
              <>
                <p className="font-mono text-xs tabular-nums tracking-[0.14em] text-white/45">
                  {pad(current + 1)} / {pad(N)} · {project.year}
                </p>
                <p className="mt-1.5 text-lg font-semibold leading-tight tracking-[-0.02em]">{project.title}</p>
                <p className="mt-1 text-sm text-white/60">
                  {[project.scope, project.work.join(", ")].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-0.5 text-sm text-white/60">Гүйцэтгэсэн инженер: {project.engineer}</p>
              </>
            ) : (
              <p className="text-sm text-white/60">
                {shown === 0 ? "Хуудсыг дарж эсвэл шударч нээнэ." : "Дараагийн төсөл таных байж болно."}
              </p>
            )}
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <p className="hidden text-sm text-white/55 sm:block">Хуудсан дээр дарж, эсвэл ← → товчоор эргүүлнэ.</p>
            <div className="col-start-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => turn(-1)}
                disabled={shown === 0}
                aria-label="Өмнөх хуудас"
                className={roundButton}
              >
                <ArrowLeft aria-hidden className="size-5" />
              </button>
              <span className="min-w-[5.5rem] text-center font-mono text-sm tabular-nums text-white/70">{counter}</span>
              <button
                type="button"
                onClick={() => turn(1)}
                disabled={shown === max}
                aria-label="Дараагийн хуудас"
                className={roundButton}
              >
                <ArrowRight aria-hidden className="size-5" />
              </button>
            </div>
            <div className="col-span-3 flex justify-center sm:col-span-1 sm:col-start-3 sm:justify-end">
              {shown === max && (
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Инженертэй холбогдох
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* every project at a glance, as photo cards a filter narrows; a click opens the book on it */}
      <section aria-labelledby="all-projects-title" className="bg-white text-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Heading id="all-projects-title" text="Бүх төсөл" />
              <p className="mt-4 max-w-[48ch] text-pretty text-step-body leading-[1.65] text-ink/65">
                150 гаруй объектоос онцлох {N} нь, {FIRST}–{LAST} он.
              </p>
            </div>
            <div role="group" aria-label="Төрлөөр шүүх" className="flex flex-wrap gap-2">
              {FILTERS.map((option) => {
                const on = filter === option.id;
                const count = option.id === "all" ? N : projects.filter((p) => p.kind === option.id).length;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(option.id)}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      on ? "bg-ink text-white" : "bg-ink/[0.05] text-ink/75 hover:bg-ink/10 hover:text-ink",
                    )}
                  >
                    {option.label}
                    <span className={cn("text-xs tabular-nums", on ? "text-white/55" : "text-ink/40")}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.ul layout className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 lg:mt-14 lg:grid-cols-3 lg:gap-y-10 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {projects.map((item, i) =>
                filter === "all" || item.kind === filter ? (
                  <motion.li
                    key={item.image}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProjectCard project={item} index={i} active={i === current} onOpen={() => goTo(i)} />
                  </motion.li>
                ) : null,
              )}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>
    </MotionConfig>
  );
}
