"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

export interface Features8Item {
  Icon: LucideIcon;
  /** a "\n" sets where the title breaks */
  title: string;
  points?: string[];
}

/** Three things side by side, each centred under a round icon badge: a title of two lines and the short points that
 *  back it up. They rise in one after another as the row comes into view. */
export default function Features8({ items, className }: { items: Features8Item[]; className?: string }) {
  return (
    <div className={cn("grid w-full grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8", className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 * i }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-radial from-white to-ink/[0.08] ring-1 ring-ink/[0.06]">
            <item.Icon aria-hidden className="size-6 text-ink" strokeWidth={1.5} />
          </div>
          <h3 className="whitespace-pre-line text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-ink sm:text-[1.625rem]">
            {item.title}
          </h3>
          {item.points && (
            <ul className="max-w-[30ch] space-y-2.5 text-pretty text-step-body leading-snug text-ink/70">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
    </div>
  );
}
