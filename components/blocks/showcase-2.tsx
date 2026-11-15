"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface Showcase2Item {
  id: string;
  href: string;
  image: string;
  /** a small line over the title (the brand) */
  eyebrow: string;
  title: string;
  /** a grey line under the title (the model) */
  meta?: string;
}

interface Showcase2Props {
  items: Showcase2Item[];
  /** the heading block over the run (heading, lead, button) */
  header: ReactNode;
  /** names the run for assistive tech */
  label: string;
  className?: string;
}

// the cards' heights take turns along the run
const HEIGHTS = ["h-[300px] sm:h-[400px]", "h-[340px] sm:h-[450px]", "h-[320px] sm:h-[420px]", "h-[290px] sm:h-[380px]"];
const COPIES = 6;
const GAP = 24;
const SPEED = -20; // px a second, leftwards

/**
 * A heading, then a run of tall cards in varied heights across the page that drifts slowly left without end and can
 * be dragged; the card under the pointer lifts and tips back. The run holds still while the pointer or the keyboard
 * is on it, while it is off screen, and for visitors who ask for less motion. The cards repeat for the loop, but only
 * one copy is in the tab order and read out; focusing a card brings it into view. A drag never opens a card.
 */
export function Showcase2({ items, header, label, className }: Showcase2Props) {
  const reduced = useReducedMotion() ?? false;
  const run = useRef<HTMLDivElement>(null);
  const inView = useInView(run, { margin: "100px" });
  const [hovered, setHovered] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [setWidth, setSetWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const baseX = useMotionValue(0);
  const velocity = useRef(SPEED);
  const dragged = useRef(false);

  // one copy's width, and the run starts on the second copy (the one in the tab order)
  useEffect(() => {
    const measure = () => {
      const width = window.innerWidth < 640 ? 240 : 320;
      const total = (width + GAP) * items.length;
      setCardWidth(width);
      setSetWidth(total);
      baseX.set(-total);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [baseX, items.length]);

  const moving = inView && !held && !dragging && !reduced;
  useAnimationFrame((_, delta) => {
    if (!setWidth || !moving) return;
    velocity.current = velocity.current * 0.9 + SPEED * 0.1;
    let x = baseX.get() + velocity.current * (delta / 1000);
    // keep the run within the middle copies, so it never runs out
    if (x <= -setWidth * 2) x += setWidth;
    else if (x > 0) x -= setWidth;
    baseX.set(x);
  });

  const cards = Array.from({ length: COPIES }, () => items).flat();

  return (
    <div className={className}>
      {header}
      <div
        ref={run}
        role="region"
        aria-label={label}
        className="relative overflow-clip py-16 sm:py-20"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => {
          setHeld(false);
          setHovered(null);
        }}
        onFocus={() => setHeld(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setHeld(false);
        }}
      >
        <motion.ul
          className="flex cursor-grab items-end active:cursor-grabbing"
          style={{ x: baseX, gap: GAP }}
          drag={reduced ? false : "x"}
          dragElastic={0.05}
          dragMomentum={false}
          onDragStart={() => {
            setDragging(true);
            dragged.current = true;
          }}
          onDragEnd={(_, info) => {
            setDragging(false);
            velocity.current = info.velocity.x;
          }}
          // a drag that ends over a card is not a click on it
          onClickCapture={(event) => {
            if (!dragged.current) return;
            event.preventDefault();
            event.stopPropagation();
            dragged.current = false;
          }}
          onPointerDown={() => {
            dragged.current = false;
          }}
        >
          {cards.map((item, index) => {
            const k = index % items.length;
            const copy = Math.floor(index / items.length);
            const reachable = copy === 1;
            const lifted = hovered === index && !reduced;
            return (
              <motion.li
                key={`${item.id}-${copy}`}
                aria-hidden={reachable ? undefined : true}
                className={cn("relative shrink-0 select-none", HEIGHTS[k % HEIGHTS.length])}
                style={{ width: cardWidth, transformPerspective: 1000 }}
                animate={lifted ? { scale: 1.05, rotateX: -15, y: -25, zIndex: 50 } : { scale: 1, rotateX: 0, y: 0, zIndex: 1 }}
                transition={{ duration: 0.3, ease: "backOut", zIndex: { delay: lifted ? 0 : 0.4 } }}
                onPointerEnter={() => setHovered(index)}
                onPointerLeave={() => setHovered(null)}
              >
                <Link
                  href={item.href}
                  tabIndex={reachable ? undefined : -1}
                  draggable={false}
                  // a card that takes focus comes into view at the start of the run
                  onFocus={() => {
                    if (reachable) baseX.set(-(setWidth + k * (cardWidth + GAP)) + 24);
                  }}
                  // white, set off by a soft shadow only
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(11_16_32/0.06),0_14px_34px_-14px_rgb(11_16_32/0.22)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="relative min-h-0 flex-1">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="320px"
                      draggable={false}
                      className="pointer-events-none object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04] sm:p-8"
                    />
                  </span>
                  <span className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">{item.eyebrow}</span>
                    <span className="mt-1.5 block text-pretty text-base font-semibold leading-snug text-ink sm:text-lg">
                      {item.title}
                    </span>
                    {item.meta && <span className="mt-1 block truncate text-sm text-ink/55">{item.meta}</span>}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
}

export default Showcase2;
