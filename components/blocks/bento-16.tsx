"use client";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Database, Layers, LayoutTemplate, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
const SIZE = 240;
const C = SIZE / 2;
const W = 128;
const H = 64;
const STEP = 26;
export type Bento16Layer = {
  label: string;
  icon: LucideIcon;
  meta: string;
};
const LAYERS: Bento16Layer[] = [
  { label: "Data", icon: Database, meta: "Postgres · 3 replicas" },
  { label: "API", icon: Server, meta: "Edge · 18 routes" },
  { label: "Interface", icon: LayoutTemplate, meta: "React · live preview" },
];
/** The card's words. Layers run from the bottom slab up; the defaults are the block's own demo copy. */
export interface Bento16Props {
  layers?: Bento16Layer[];
  chip?: string;
  asideTitle?: string;
  asideText?: string;
  status?: string;
  title?: string;
  text?: string;
  className?: string;
}
const slab = (cx: number, cy: number) =>
  `M${cx} ${cy - H / 2} L${cx + W / 2} ${cy} L${cx} ${cy + H / 2} L${cx - W / 2} ${cy} Z`;
const slabSide = (cx: number, cy: number, depth: number) =>
  `M${cx - W / 2} ${cy} L${cx} ${cy + H / 2} V${cy + H / 2 + depth} L${cx - W / 2} ${cy + depth} Z`;
const slabSideR = (cx: number, cy: number, depth: number) =>
  `M${cx} ${cy + H / 2} L${cx + W / 2} ${cy} V${cy + depth} L${cx} ${cy + H / 2 + depth} Z`;
const ease = [0.22, 1, 0.36, 1] as const;
export default function Bento16({
  layers = LAYERS,
  chip = "One deploy",
  asideTitle = "One connected stack",
  asideText = "From the database to the interface, every layer shares one release.",
  status = "All layers in sync",
  title = "Every layer, one platform",
  text = "Interface, API and data ship together from a single repo, with the same preview link for all three.",
  className,
}: Bento16Props = {}) {
  const reduce = !!useReducedMotion();
  const [spread, setSpread] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), {
    stiffness: 160,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), {
    stiffness: 160,
    damping: 18,
  });
  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || locked) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const release = () => {
    setLocked(false);
    px.set(0);
    py.set(0);
    setSpread(false);
    setHot(null);
  };
  const gap = spread ? STEP + 22 : STEP;
  const baseY = C + 34;
  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[380px] w-full flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-ink/10",
        className,
      )}
    >
      <div className="@container relative min-h-[220px] flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(11_16_32/0.08)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]"
        />

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
          onPointerMove={track}
          onPointerEnter={() => setSpread(true)}
          onPointerLeave={release}
          className="absolute inset-0 flex items-center justify-center p-4 [perspective:900px]"
        >
          <motion.div
            style={{ rotateX, rotateY, width: SIZE, height: SIZE }}
            className="relative shrink-0 scale-[0.85] [transform-style:preserve-3d] @sm:scale-100 @2xl:scale-[1.12]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-[14px] rounded-full border border-dashed border-ink/20 motion-safe:animate-[spin_60s_linear_infinite]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-[34px] rounded-full bg-brand/[0.06] blur-2xl"
            />

            <svg
              aria-hidden="true"
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              {layers.map((layer, index) => {
                const cy = baseY - index * gap;
                const lit = (hot ?? layers.length - 1) === index;
                return (
                  <motion.g
                    key={layer.label}
                    initial={false}
                    animate={{ y: cy - baseY }}
                    transition={{ duration: 0.55, ease }}
                    onMouseEnter={() => setHot(index)}
                    onPointerEnter={() => setLocked(true)}
                    onPointerLeave={() => setLocked(false)}
                  >
                    <path
                      d={slabSide(C, baseY, 10)}
                      className={lit ? "fill-ink/75" : "fill-ink/15"}
                    />
                    <path
                      d={slabSideR(C, baseY, 10)}
                      className={lit ? "fill-ink/90" : "fill-ink/10"}
                    />
                    <path
                      d={slab(C, baseY)}
                      strokeWidth={1}
                      className={`transition-colors duration-300 ${
                        lit ? "fill-ink stroke-ink" : "fill-white stroke-ink/20"
                      }`}
                    />

                    {[-1, 0, 1].map((k) => (
                      <line
                        key={k}
                        x1={C - W / 2 + (W / 4) * (k + 1)}
                        y1={baseY - (H / 4) * (k + 1)}
                        x2={C + (W / 4) * (k + 1)}
                        y2={baseY + H / 2 - (H / 4) * (k + 1)}
                        stroke="currentColor"
                        strokeWidth={0.75}
                        className={lit ? "text-white/20" : "text-ink/10"}
                      />
                    ))}
                    <layer.icon
                      x={C - 7}
                      y={baseY - 7}
                      width={14}
                      height={14}
                      strokeWidth={2}
                      className={lit ? "text-white" : "text-ink/50"}
                    />
                  </motion.g>
                );
              })}
            </svg>

            {layers.map((layer, index) => {
              const lit = hot === index;
              const cy = baseY - index * gap;
              return (
                <motion.span
                  key={layer.label}
                  initial={false}
                  animate={{ top: cy - 10, opacity: spread || lit ? 1 : 0.55 }}
                  transition={{ duration: 0.55, ease }}
                  style={{ translateZ: 22 }}
                  className={`pointer-events-none absolute -right-8 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-sm transition-colors duration-200 ${
                    lit ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/75"
                  }`}
                >
                  {layer.label}
                </motion.span>
              );
            })}

            <motion.span
              initial={false}
              animate={{
                opacity: hot === null ? 0 : 1,
                y: hot === null ? 4 : 0,
              }}
              transition={{ duration: 0.2 }}
              style={{ translateZ: 30 }}
              className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[10px] font-medium text-white shadow-sm"
            >
              {hot === null ? "" : layers[hot].meta}
            </motion.span>

            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ translateZ: 22 }}
              className="absolute left-[2%] top-[10%] inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/10 bg-white px-2.5 py-1 text-[11px] font-medium text-ink/75 shadow-sm will-change-transform"
            >
              <Layers className="h-3 w-3 text-ink/50" />
              {chip}
            </motion.span>
          </motion.div>
        </motion.div>
        <div className="absolute left-6 top-1/2 hidden w-[148px] -translate-y-1/2 @2xl:block">
          <p className="text-[11px] font-medium text-ink/55">{asideTitle}</p>
          <p className="mt-2 text-xs leading-relaxed text-ink/75">{asideText}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-ink/55">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {status}
          </span>
        </div>
        <div className="absolute right-6 top-1/2 hidden w-[148px] -translate-y-1/2 @2xl:block">
          {layers.map((layer, index) => (
            <button
              key={layer.label}
              type="button"
              onPointerEnter={() => {
                setHot(index);
                setSpread(true);
              }}
              onPointerLeave={() => {
                setHot(null);
                setSpread(false);
              }}
              onFocus={() => {
                setHot(index);
                setSpread(true);
              }}
              onBlur={() => {
                setHot(null);
                setSpread(false);
              }}
              onClick={() => {
                setHot(index);
                setSpread(true);
              }}
              className="flex w-full cursor-pointer items-start gap-2 rounded-md p-2 text-left transition-colors hover:bg-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <layer.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/50" />
              <span>
                <span className="block text-[11px] font-medium text-ink/80">{layer.label}</span>
                <span className="mt-0.5 block text-[10px] text-ink/55">{layer.meta}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">{title}</h3>
        <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-ink/65">{text}</p>
      </div>
    </article>
  );
}
