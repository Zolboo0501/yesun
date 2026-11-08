"use client";
import ElasticSticker, { type ElasticStickerHandle } from "@/components/react-bits/elastic-sticker";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { getImageProps } from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Heading } from "./Heading";
import { Part } from "./Part";

// Confirmed facts only (PRODUCT.md and the projects list). The lines are the ones approved on 2026-11-08, with the name
// moved up into the title where a title now carries it; the titles, drawn from the same facts, were approved that day too.
const years = [
  {
    year: "2011",
    title: "Эхлэл",
    text: "БХБЯ-ны тусгай зөвшөөрөлтэйгөөр байгуулагдсан.",
    src: "/images/engineering.JPG",
    alt: "Есөн Бэлчирийн инженерүүд оффист",
  },
  {
    year: "2019",
    title: "Монголбанк",
    text: "Үндэсний цахим гүйлгээний төв.",
    src: "/images/project3.webp",
    alt: "Монголбанкны үндэсний цахим гүйлгээний төв",
  },
  {
    year: "2020",
    title: "Хүннү 2222",
    text: "Олон ээлжийн хамтын ажиллагаа эхэлсэн.",
    src: "/images/project4.webp",
    alt: "Хүннү 2222 хотхоны орон сууцны барилгууд",
  },
  {
    year: "2021",
    title: "Өөрийн үйлдвэр",
    text: "Үйлдвэр ашиглалтад орсон. Чингис хаан музей.",
    src: "/images/factory4.jpg",
    alt: "Агаар сэлгэлтийн сувгийн үйлдвэрийн цех",
  },
  {
    year: "2022",
    title: "Хотхон ба сургууль",
    text: "Нисэх гарден хотхон, Одод хотхон, Хүннү 2222 Канад сургууль.",
    src: "/images/project10.webp",
    alt: "Нисэх гарден хотхон",
  },
  {
    year: "2023",
    title: "Platinum Tower",
    text: "Хоёр блок барилга, нэгдсэн гаражийн агаар сэлгэлт, хөргөлтийн систем.",
    src: "/images/project8.webp",
    alt: "Platinum Tower орон сууц",
  },
  {
    year: "2024",
    title: "Орон сууц, төр, уул уурхай",
    text: "Сансар Гарден, Нийслэлийн захиргааны төв, Эрдэнэс Таван Толгой.",
    src: "/images/project11.webp",
    alt: "Нийслэлийн нутгийн захиргааны төв цогцолбор",
  },
  {
    year: "Өнөөдөр",
    title: "150 гаруй объект",
    text: "Нийслэл, орон нутагт. Зураг төслөөс угсралт, засвар үйлчилгээ хүртэл нэг дор.",
    src: "/images/banner2.webp",
    alt: "Барилгын дээвэр дээрх агаар сэлгэлтийн суваг",
  },
];

// The ribbon's top runs from the brand blue at 2011 to an azure today, and each year takes the colour of the ribbon
// where it stands; both ends keep 3:1 on white at the years' size.
const FROM = "#0100fd";
const TO = "#0a8cf0";

function mix(from: string, to: string, t: number) {
  const a = parseInt(from.slice(1), 16);
  const b = parseInt(to.slice(1), 16);
  const channel = (shift: number) => {
    const c = (a >> shift) & 255;
    return Math.round(c + (((b >> shift) & 255) - c) * t);
  };
  return `rgb(${channel(16)} ${channel(8)} ${channel(0)})`;
}

// The ribbon's side, lit from above: white under the coloured top, a pale blue-grey lower down, a darker foot.
const WALL_TOP = "#f4f7fc";
const WALL_LOW = "#c9d3e6";
const WALL_FOOT = "#b4c0d8";

const READ = 0.64; // the ribbon is laid down to this height of the viewport
const SWING = 20; // under lg: how far the ribbon swings out between two years, one side then the other
const STEPS = 48; // samples a segment, to measure its length

type Point = { x: number; y: number };
type Segment = { d: string; start: number; length: number; fade?: { from: number; to: number; out: boolean } };
type Road = {
  segments: Segment[];
  ys: number[];
  nodes: number[];
  total: number;
  width: number;
  depth: number;
  slant: number;
  first: number;
  last: number;
};

const bez = (a: number, b: number, c: number, d: number, t: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

/** The ribbon through the years' nodes, one cubic segment between each pair, with a short straight lead into the first
 *  year and out of the last that fade, so the road seems to come from somewhere and go on. At lg the nodes sit on
 *  alternate edges of the page and the ribbon leaves each one straight down, so every year sits on a bend and the
 *  ribbon sweeps across the page between them. Below lg the nodes share a lane at the left and the ribbon swings out
 *  between them, one side then the other. */
function road(nodes: Point[], trackWidth: number): Road {
  const wide = nodes.some((p, i) => i > 0 && Math.abs(p.x - nodes[i - 1].x) > 4);
  const width = wide ? Math.round(Math.min(40, Math.max(26, trackWidth * 0.03))) : 18;
  const lead = wide ? 110 : 44;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const points = [{ x: first.x, y: first.y - lead }, ...nodes, { x: last.x, y: last.y + lead }];
  const r: Road = {
    segments: [],
    ys: points.map((p) => p.y),
    nodes: [],
    total: 0,
    width,
    depth: wide ? Math.round(width * 0.8) : 14,
    // In the lane the ribbon runs mostly upright, where a side straight below would hide under it; seen a little from
    // the right, its side shows along its length.
    slant: wide ? 0 : 0.4,
    first: first.y,
    last: last.y,
  };
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const dy = b.y - a.y;
    const edge = i === 0 || i === points.length - 2;
    const across = Math.abs(b.x - a.x) > 4;
    const swing = edge ? 0 : (i % 2 ? 1 : -1) * SWING;
    // Across, the handles reach past the middle, so the ribbon stays upright through each bend and keeps clear of the
    // year it arrives above before it sweeps over.
    const c1 = across ? { x: a.x, y: a.y + dy * 0.6 } : { x: a.x + swing, y: a.y + dy / 3 };
    const c2 = across ? { x: b.x, y: b.y - dy * 0.6 } : { x: b.x + swing, y: b.y - dy / 3 };
    let length = 0;
    let prev = a;
    for (let s = 1; s <= STEPS; s++) {
      const t = s / STEPS;
      const p = { x: bez(a.x, c1.x, c2.x, b.x, t), y: bez(a.y, c1.y, c2.y, b.y, t) };
      length += Math.hypot(p.x - prev.x, p.y - prev.y);
      prev = p;
    }
    r.segments.push({
      d: `M${a.x} ${a.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`,
      start: r.total,
      length,
      fade: edge ? { from: a.y, to: b.y, out: i > 0 } : undefined,
    });
    r.total += length;
    if (i < points.length - 2) r.nodes.push(r.total);
  }
  return r;
}

/** How much of the ribbon is laid when the reading height is `y` down the track: the share of the way from one point
 *  down to the next becomes the same share of the segment between them, so it grows at an even pace. */
function lengthAt(r: Road, y: number) {
  if (y <= r.ys[0]) return 0;
  for (let i = 0; i < r.segments.length; i++) {
    const s = r.segments[i];
    if (y < r.ys[i + 1]) return s.start + (s.length * (y - r.ys[i])) / (r.ys[i + 1] - r.ys[i]);
  }
  return r.total;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.5, 0, 0.75, 0] as const;
const instant = { duration: 0 };

// A year's title, line and photo come in when the ribbon reaches its node and go again, quicker, when it draws back.
const stop: Variants = {
  hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  show: (reduced: boolean) => ({ transition: reduced ? instant : { staggerChildren: 0.08, delayChildren: 0.05 } }),
};
const rise: Variants = {
  hidden: { opacity: 0, y: 14, transition: { duration: 0.3, ease: EASE_IN } },
  show: (reduced: boolean) => ({ opacity: 1, y: 0, transition: reduced ? instant : { duration: 0.8, ease: EASE_OUT } }),
};
// The sticker is put down on the page: it comes in a little large and above its place and settles onto it on a spring.
const drop: Variants = {
  hidden: { opacity: 0, scale: 1.1, y: -24, transition: { duration: 0.3, ease: EASE_IN } },
  show: (reduced: boolean) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: reduced ? instant : { type: "spring", stiffness: 260, damping: 22, mass: 0.9 },
  }),
};

/** One segment of the ribbon, after the client's reference: a coloured top with a white rim and pale stripes across it,
 *  standing on a side that the copies below draw, each a little darker and showing only under the one above it, with a
 *  soft shadow at its foot. A mask lays it down along its length; only the segment being laid repaints. */
function Piece({ seg, road: r, drawn, id, top }: { seg: Segment; road: Road; drawn: MotionValue<number>; id: string; top: string }) {
  const progress = useTransform(drawn, (l) => Math.min(1, Math.max(0, (l - seg.start) / seg.length)));
  const visibility = useTransform(progress, (p) => (p > 0 ? "visible" : "hidden"));
  const { width: w, depth: h, slant } = r;
  const step = w > 20 ? 3 : 4;
  const walls: { dy: number; color: string }[] = [{ dy: h, color: WALL_FOOT }];
  for (let dy = h - 2; dy > 0; dy -= step) walls.push({ dy, color: mix(WALL_TOP, WALL_LOW, dy / h) });
  const down = (dy: number) => `translate(${dy * slant} ${dy})`;

  const body = (
    <g mask={`url(#${id}-lay)`}>
      <path d={seg.d} transform={down(h + 7)} strokeWidth={w + 12} className="stroke-ink/[0.03]" />
      <path d={seg.d} transform={down(h + 2)} strokeWidth={w + 3} className="stroke-ink/[0.06]" />
      {walls.map(({ dy, color }) => (
        <path key={dy} d={seg.d} transform={down(dy)} strokeWidth={w} stroke={color} />
      ))}
      <path d={seg.d} strokeWidth={w} stroke="white" />
      <path d={seg.d} strokeWidth={w - 4} stroke={top} />
      <path d={seg.d} strokeWidth={w - 4} strokeDasharray="4 6 4 6 4 34" className="stroke-white/[0.14]" />
    </g>
  );

  return (
    <motion.g style={{ visibility }}>
      <mask id={`${id}-lay`} maskUnits="userSpaceOnUse" x="-10%" y="-10%" width="120%" height="120%">
        <motion.path d={seg.d} stroke="white" strokeWidth={w + 2 * h + 30} style={{ pathLength: progress }} />
      </mask>
      {seg.fade ? (
        <>
          <linearGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" x1="0" y1={seg.fade.from} x2="0" y2={seg.fade.to}>
            <stop offset={seg.fade.out ? 0.2 : 0} stopColor={seg.fade.out ? "white" : "black"} />
            <stop offset={seg.fade.out ? 1 : 0.8} stopColor={seg.fade.out ? "black" : "white"} />
          </linearGradient>
          <mask id={`${id}-edge`} maskUnits="userSpaceOnUse" x="-10%" y="-10%" width="120%" height="120%">
            <rect x="-10%" y="-10%" width="120%" height="120%" fill={`url(#${id}-fade)`} />
          </mask>
          <g mask={`url(#${id}-edge)`}>{body}</g>
        </>
      ) : (
        body
      )}
    </motion.g>
  );
}

type Year = (typeof years)[number];

/** Each year's photo through Next's optimizer, 1200 wide: the sticker draws it at up to two and a half times its size. */
const stickerSrc = (src: string) => getImageProps({ src, alt: "", width: 600, height: 450 }).props.src;

/** A year's photo as a react-bits ElasticSticker: a glossy photo sticker with a white edge, turned a little toward the
 *  ribbon's side, put down on the page when the ribbon arrives and pressed on with a short peel. Under a mouse its
 *  corner lifts after the pointer; when left alone a corner lifts now and then. Each sticker is a WebGL canvas, so it
 *  is mounted only within a screen of view (two or three at a time) and unmounted beyond. It does not drag here: a
 *  sticker that moved would leave its year, and on phones it would hold the page's scroll. */
function Photo({ item, left, reached, reduced }: { item: Year; left: boolean; reached: boolean; reduced: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { margin: "60% 0px 60% 0px" });
  const sticker = useRef<ElasticStickerHandle>(null);

  useEffect(() => {
    if (!reached || !near || reduced) return;
    const press = setTimeout(() => sticker.current?.peel(), 700);
    return () => clearTimeout(press);
  }, [reached, near, reduced]);

  return (
    <div
      ref={box}
      role="img"
      aria-label={item.alt}
      className={`mt-2 w-full min-w-0 max-w-2xl lg:col-span-5 lg:row-start-1 lg:mt-0 lg:max-w-none ${
        left ? "lg:col-start-8" : "lg:col-start-1"
      }`}
    >
      <motion.div variants={drop} custom={reduced} aria-hidden className="aspect-[4/3]">
        {near && (
          <ElasticSticker
            ref={sticker}
            src={stickerSrc(item.src)}
            alt=""
            width={720}
            height={540}
            radius={20}
            border={10}
            rotation={left ? 2 : -2}
            lift={60}
            tilt={22}
            hoverPeel={0.55}
            draggable={false}
            className="touch-auto"
          />
        )}
      </motion.div>
    </div>
  );
}

function Stop({ item, index, reached, reduced, nodeRef }: {
  item: Year;
  index: number;
  reached: boolean;
  reduced: boolean;
  nodeRef: (node: HTMLSpanElement | null) => void;
}) {
  // At lg the ribbon turns at the left edge for 2011, 2020, 2022 and 2024, and at the right edge for the others; the
  // year sits on the bend, the title and line in the middle third, the photo in the far third.
  const left = index % 2 === 0;
  const tone = { "--node": mix(FROM, TO, index / (years.length - 1)) } as CSSProperties;
  return (
    <motion.li
      initial="hidden"
      animate={reached ? "show" : "hidden"}
      variants={stop}
      custom={reduced}
      data-reached={reached}
      style={tone}
      className="group relative grid grid-cols-1 gap-4 pl-[4.75rem] [--year:clamp(2.5rem,1.75rem+2.2vw,4rem)] lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:gap-y-0 lg:pl-0"
    >
      {/* The year's stop on the ribbon: a small ring on the route ahead, a disc in the ribbon's colour once it arrives. */}
      <span
        ref={nodeRef}
        aria-hidden
        className={`absolute left-7 top-[calc(var(--year)/2)] size-3.5 -translate-x-1/2 -translate-y-1/2 scale-[0.6] rounded-full border-2 border-ink/25 bg-white transition-[scale,background-color,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none group-data-[reached=true]:scale-100 group-data-[reached=true]:border-white group-data-[reached=true]:bg-[color-mix(in_oklab,var(--node)_72%,white)] group-data-[reached=true]:shadow-[0_1px_4px_rgb(11_16_32/0.3)] lg:top-1/2 lg:size-[22px] lg:border-[3px] ${
          left ? "lg:left-6" : "lg:left-[calc(100%-1.5rem)]"
        }`}
      />
      <p
        className={`text-(length:--year) font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink/20 transition-colors duration-700 group-data-[reached=true]:text-(--node) lg:col-span-4 lg:row-start-1 ${
          left ? "lg:col-start-1 lg:pl-20" : "lg:col-start-9 lg:pr-20 lg:text-right"
        }`}
      >
        {item.year}
      </p>
      <div className={`lg:col-span-3 lg:row-start-1 ${left ? "lg:col-start-5" : "lg:col-start-6"}`}>
        <motion.h3
          variants={rise}
          custom={reduced}
          className="text-balance text-[clamp(1.375rem,1.2rem+0.6vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.02em]"
        >
          {item.title}
        </motion.h3>
        <motion.p variants={rise} custom={reduced} className="mt-3 max-w-[36ch] text-pretty text-step-body leading-[1.6] text-ink/70">
          {item.text}
        </motion.p>
      </div>
      <Photo item={item} left={left} reached={reached} reduced={reduced} />
    </motion.li>
  );
}

/** The company by year as one ribbon laid down the page: it reaches each year as the reader scrolls to it, the year's
 *  title, line and photo coming in as it does, and is taken up the same way when the reader scrolls back. */
export function Timeline() {
  const reduced = useReducedMotion() ?? false;
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const track = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);
  const geometry = useRef<Road | null>(null);
  const reachedRef = useRef(0);
  const [line, setLine] = useState<Road | null>(null);
  const [reached, setReached] = useState(0);

  const target = useMotionValue(0);
  const drawn = useSpring(target, { stiffness: 120, damping: 22, mass: 0.6, restDelta: 0.5 });
  const { scrollY } = useScroll();

  const place = useCallback((l: number) => {
    const r = geometry.current;
    if (!r) return;
    // A year counts as reached a hair before the ribbon gets to it, and lets go only once the ribbon is well back past
    // it, so a ribbon resting on a node cannot flicker its year in and out.
    let n = reachedRef.current;
    while (n < r.nodes.length && l >= r.nodes[n] - 2) n++;
    while (n > 0 && l < r.nodes[n - 1] - 24) n--;
    if (n !== reachedRef.current) {
      reachedRef.current = n;
      setReached(n);
    }
  }, []);

  const follow = useCallback(() => {
    const r = geometry.current;
    const box = track.current;
    if (!r || !box) return;
    if (reduced) {
      target.set(r.total);
      drawn.jump(r.total);
      return;
    }
    target.set(lengthAt(r, window.innerHeight * READ - box.getBoundingClientRect().top));
  }, [reduced, target, drawn]);

  const measure = useCallback(() => {
    const box = track.current;
    if (!box) return;
    const at = box.getBoundingClientRect();
    const points = nodes.current.map((node) => {
      const n = node!.getBoundingClientRect();
      return { x: n.left + n.width / 2 - at.left, y: n.top + n.height / 2 - at.top };
    });
    geometry.current = road(points, at.width);
    setLine(geometry.current);
    place(drawn.get());
    follow();
  }, [place, follow, drawn]);

  useEffect(() => {
    const box = track.current!;
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    window.addEventListener("resize", follow);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", follow);
    };
  }, [measure, follow]);

  useMotionValueEvent(scrollY, "change", follow);
  useMotionValueEvent(drawn, "change", place);

  return (
    <Part labelledBy="timeline-title" className="overflow-x-clip">
      <Heading id="timeline-title" text="Бидний түүх" />
      <div ref={track} className="relative mt-20 lg:mt-28">
        <svg aria-hidden fill="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {line && (
            <>
              <defs>
                <linearGradient id={`${uid}-top`} gradientUnits="userSpaceOnUse" x1="0" y1={line.first} x2="0" y2={line.last}>
                  <stop offset="0" stopColor={FROM} />
                  <stop offset="1" stopColor={TO} />
                </linearGradient>
              </defs>
              {/* The route ahead, which the ribbon covers as it is laid. */}
              <path
                d={line.segments.filter((s) => !s.fade).map((s) => s.d).join("")}
                strokeWidth={1.5}
                strokeDasharray="6 8"
                className="stroke-ink/20"
              />
              {line.segments.map((seg, i) => (
                <Piece key={i} seg={seg} road={line} drawn={drawn} id={`${uid}-${i}`} top={`url(#${uid}-top)`} />
              ))}
            </>
          )}
        </svg>
        <ol className="relative space-y-16 sm:space-y-20 lg:space-y-[clamp(9rem,12vw,11rem)]">
          {years.map((item, i) => (
            <Stop
              key={item.year}
              item={item}
              index={i}
              reached={i < reached}
              reduced={reduced}
              nodeRef={(node) => {
                nodes.current[i] = node;
              }}
            />
          ))}
        </ol>
      </div>
    </Part>
  );
}
