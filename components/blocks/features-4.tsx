"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent } from "react";

export interface Features4Item {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  /** one or two lines under the title, on the tab and in the panel */
  description: string;
  /** the panel's checked list */
  points: string[];
}

interface Features4Props {
  items: Features4Item[];
  /** names the tab list for screen readers */
  label: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
}

/**
 * Tabs down the left, the chosen one's panel on the right (stacked on phones, the panel under the tabs): a large icon,
 * the title, its lines and a checked list. It moves on by itself every few seconds while it is in view, with a thin
 * bar on the tab filling up to the change, until the visitor picks a tab; it holds while the pointer or the keyboard
 * is on it and stays put under reduced motion. The tabs follow the WAI-ARIA pattern: arrow keys, Home and End.
 */
export function Features4({ items, label, autoPlay = true, autoPlayDelay = 5000, className }: Features4Props) {
  const reduced = useReducedMotion() ?? false;
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(autoPlay);
  const [held, setHeld] = useState(false);
  const running = auto && !held && !reduced && inView;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % items.length), autoPlayDelay);
    return () => clearInterval(timer);
  }, [running, autoPlayDelay, items.length]);

  // a pick by the visitor stops the rotation for good
  const pick = (index: number) => {
    setAuto(false);
    setActive(index);
  };

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = items.length - 1;
    const moves: Partial<Record<string, number>> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const to = moves[event.key];
    if (to === undefined) return;
    event.preventDefault();
    pick(to);
    document.getElementById(`feature-tab-${to}`)?.focus();
  }

  const current = items[active];
  const Icon = current.Icon;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={root}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false);
        }}
        className={cn("grid gap-4 lg:grid-cols-12", className)}
      >
        <div role="tablist" aria-label={label} aria-orientation="vertical" className="flex flex-col gap-3 lg:col-span-4">
          {items.map((item, index) => {
            const on = index === active;
            const TabIcon = item.Icon;
            return (
              <motion.button
                key={item.title}
                id={`feature-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="feature-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => pick(index)}
                onKeyDown={onKeyDown}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={cn(
                  "relative flex flex-1 cursor-pointer items-start gap-4 overflow-hidden rounded-[20px] p-5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:p-6",
                  on ? "bg-ink/[0.06]" : "bg-ink/[0.025] hover:bg-ink/[0.045]",
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-200",
                    on ? "bg-ink text-white" : "bg-ink/[0.06] text-ink",
                  )}
                >
                  <TabIcon aria-hidden className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-base font-semibold md:text-lg", on ? "text-ink" : "text-ink/75")}>
                    {item.title}
                  </span>
                  <span className={cn("mt-1 line-clamp-2 block text-sm", on ? "text-ink/70" : "text-ink/55")}>
                    {item.description}
                  </span>
                </span>
                {/* fills up to the next change while the tabs move on by themselves */}
                {on && running && (
                  <motion.span
                    key={active}
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: autoPlayDelay / 1000, ease: "linear" }}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-ink/30"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="flex lg:col-span-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              id="feature-panel"
              role="tabpanel"
              aria-labelledby={`feature-tab-${active}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 rounded-[28px] border border-ink/10 bg-white p-6 md:p-8 lg:p-10"
            >
              <span className="mb-6 grid size-16 place-items-center rounded-2xl bg-ink/[0.05]">
                <Icon aria-hidden className="size-8 text-ink" />
              </span>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">{current.title}</h3>
              <p className="mt-3 max-w-[56ch] text-pretty text-step-body leading-relaxed text-ink/70">
                {current.description}
              </p>
              <ul className="mt-8 space-y-3">
                {current.points.map((point, index) => (
                  <motion.li
                    key={point}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    className="flex items-start gap-3 rounded-xl bg-ink/[0.03] p-4"
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ink text-white">
                      <svg aria-hidden className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-ink/85 md:text-base">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}

export default Features4;
