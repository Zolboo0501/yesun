"use client";
import { products } from "@/components/factory/Products";
import { ArrowUpRight, Rotate3d } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const ProductModel = dynamic(() => import("./ProductModel"), { ssr: false, loading: () => null });

/** How far a drag has turned the view (radians, either way), and whether a drag is under way. */
export type Turn = { yaw: number; dragging: boolean };
/** How far the view may turn either way, by a drag and its own drift together. */
export const TURN_LIMIT = 0.75;

const TOUR = 2800; // ms each product stays out while nobody points at one
const pad = (n: number) => String(n).padStart(2, "0");

/** The big tile of the factory bento: the products the factory makes, as the factory page's 3D run of ducts under a
 *  soffit. The run drifts slowly from side to side and a mouse drag turns it; one product after another slides out
 *  with its name at the foot, and the one under the mouse (or tapped) slides out instead. A link leads to all of
 *  them on the factory page. The scene loads half a screen early and draws only while the tile is on screen; under
 *  reduced motion it stands still and slides a product out only when pointed at. */
export function ProductTile() {
  const tile = useRef<HTMLDivElement>(null);
  const near = useInView(tile, { once: true, margin: "50% 0px" });
  const active = useInView(tile);
  const reduced = useReducedMotion() ?? false;
  const [featured, setFeatured] = useState(-1);
  const hold = useRef(0); // the tour waits until this time (performance.now), Infinity while the mouse is on one
  const turn = useRef<Turn>({ yaw: 0, dragging: false });
  const dragX = useRef(0);

  useEffect(() => {
    if (reduced || !active) return;
    const tour = setInterval(() => {
      if (performance.now() >= hold.current) setFeatured((f) => (f + 1) % products.length);
    }, TOUR);
    return () => clearInterval(tour);
  }, [reduced, active]);

  const onPoint = useCallback((index: number, sticky: boolean) => {
    if (index >= 0) {
      setFeatured(index);
      hold.current = sticky ? Infinity : performance.now() + 5000;
    } else if (hold.current === Infinity) {
      hold.current = performance.now() + 2000;
    }
  }, []);

  const product = featured >= 0 ? products[featured] : null;

  return (
    <div
      ref={tile}
      className="relative isolate h-full min-h-[28rem] overflow-hidden rounded-[24px] bg-graphite text-white sm:min-h-[30rem] lg:min-h-0"
    >
      {/* the run; a mouse turns it by dragging across */}
      <div
        className="absolute inset-0 pointer-fine:cursor-grab pointer-fine:active:cursor-grabbing"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          turn.current.dragging = true;
          dragX.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!turn.current.dragging) return;
          const yaw = turn.current.yaw - (e.clientX - dragX.current) * 0.005;
          turn.current.yaw = Math.min(TURN_LIMIT, Math.max(-TURN_LIMIT, yaw));
          dragX.current = e.clientX;
        }}
        onPointerUp={() => (turn.current.dragging = false)}
        onPointerCancel={() => (turn.current.dragging = false)}
      >
        {near && (
          <ProductModel active={active} reducedMotion={reduced} featured={featured} turn={turn} onPoint={onPoint} />
        )}
      </div>

      {/* shades that keep the words readable over the run */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-graphite/80 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-graphite via-graphite/70 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 sm:p-7">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">Бүтээгдэхүүн</h3>
        <p aria-hidden className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45 pointer-fine:flex">
          <Rotate3d className="size-3.5" strokeWidth={1.5} />
          Чирж эргүүлнэ
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
        {/* the product out of the run; the list below names all of them for assistive tech */}
        <div aria-hidden className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={featured}
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -6 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-white/55">
                {product ? `${pad(featured + 1)} / ${pad(products.length)}` : `${products.length} бүтээгдэхүүн`}
              </p>
              <p className="mt-2 text-balance text-[clamp(1.375rem,1.05rem+1vw,2rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
                {product?.name ?? "Агаарын суваг, фасон эдлэл"}
              </p>
              <p className="mt-1.5 text-sm text-white/70">{product?.lead ?? "Үйлдвэрлэж, нийлүүлнэ."}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <Link
          href="/factory#products"
          className="group pointer-events-auto inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/60 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:self-auto"
        >
          Бүх бүтээгдэхүүн
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </div>

      <ul className="sr-only">
        {products.map((p) => (
          <li key={p.tag}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
