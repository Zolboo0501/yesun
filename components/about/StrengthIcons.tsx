"use client";
import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";

// The advantages' icons: thin line icons on a 24 grid (1.5 lines, round ends, lucide's geometry where lucide has the
// object; ISC), each acting out its advantage once when its card comes into view and again under the pointer. With
// `play` off they stand still in their finished state (before they are seen, and under reduced motion).

const EASE = [0.16, 1, 0.3, 1] as const;

export type Play = { play: boolean };

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-full overflow-visible"
    >
      {children}
    </svg>
  );
}

/** A line drawing itself in from `delay`. */
const draw = (play: boolean, delay = 0, duration = 0.8) => ({
  initial: play ? { pathLength: 0, opacity: 0 } : false,
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { delay, duration, ease: EASE }, opacity: { delay, duration: 0.01 } } as Transition,
});

/** Kept informed: a speech bubble, someone typing in it. */
export function UpdatesIcon({ play }: Play) {
  return (
    <Svg>
      <motion.path
        d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"
        {...draw(play, 0, 0.9)}
      />
      {[8, 12, 16].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={12}
          r={1.1}
          fill="currentColor"
          stroke="none"
          initial={play ? { opacity: 0, y: 0 } : false}
          animate={play ? { opacity: 1, y: [0, -2.2, 0, -2.2, 0] } : { opacity: 1 }}
          transition={{
            opacity: { delay: 0.55 + i * 0.1, duration: 0.15 },
            y: { delay: 0.75 + i * 0.12, duration: 1.3, ease: "easeInOut" },
          }}
        />
      ))}
    </Svg>
  );
}

/** Drawn in-house: a ruler laid down, a pencil sketching along it. */
export function DraftIcon({ play }: Play) {
  return (
    <Svg>
      <motion.path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13" {...draw(play, 0, 0.7)} />
      <motion.path d="m8 6 2-2" {...draw(play, 0.3, 0.3)} />
      <motion.path d="m18 16 2-2" {...draw(play, 0.35, 0.3)} />
      <motion.path
        d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"
        {...draw(play, 0.1, 0.7)}
      />
      <motion.g
        initial={play ? { x: 0, y: 0 } : false}
        animate={play ? { x: [0, -1.1, 0.7, -0.7, 0], y: [0, 1.1, -0.7, 0.7, 0] } : { x: 0, y: 0 }}
        transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
      >
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </motion.g>
    </Svg>
  );
}

/** Years of installation: a wrench drawn in, then turning a bolt. */
export function InstallIcon({ play }: Play) {
  return (
    <Svg>
      <motion.path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"
        initial={play ? { pathLength: 0, rotate: 0 } : false}
        animate={play ? { pathLength: 1, rotate: [0, 0, -22, 8, -14, 0] } : { pathLength: 1, rotate: 0 }}
        transition={{
          pathLength: { duration: 0.8, ease: EASE },
          rotate: { delay: 0.6, duration: 1.2, times: [0, 0.05, 0.35, 0.6, 0.8, 1], ease: "easeInOut" },
        }}
        style={{ originX: 0.68, originY: 0.32 }}
      />
    </Svg>
  );
}

const PINS = ["M9 5V2", "M15 5V2", "M19 9h3", "M19 15h3", "M15 19v3", "M9 19v3", "M5 15H2", "M5 9H2"];

/** New technology: a chip whose core lights and whose pins run out one after another. */
export function TechIcon({ play }: Play) {
  return (
    <Svg>
      <motion.rect x={5} y={5} width={14} height={14} rx={2} {...draw(play, 0, 0.7)} />
      <motion.rect
        x={9}
        y={9}
        width={6}
        height={6}
        rx={1}
        fill="currentColor"
        fillOpacity={0.14}
        initial={play ? { scale: 0.4, opacity: 0 } : false}
        animate={play ? { scale: [0.4, 1.18, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      />
      {PINS.map((d, i) => (
        <motion.path key={d} d={d} {...draw(play, 0.65 + i * 0.06, 0.3)} />
      ))}
    </Svg>
  );
}

/** Our own factory: the works drawn in, its windows lit, smoke leaving the stack. */
export function FactoryIcon({ play }: Play) {
  return (
    <Svg>
      <motion.path
        d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"
        {...draw(play, 0, 0.9)}
      />
      {[8, 12, 16].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={16}
          r={0.9}
          fill="currentColor"
          stroke="none"
          initial={play ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 + i * 0.12, duration: 0.2 }}
        />
      ))}
      {play &&
        [0, 0.55].map((delay) => (
          <motion.circle
            key={delay}
            cx={6}
            cy={0.6}
            r={1}
            initial={{ opacity: 0, y: 1.6, x: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0], y: [1.6, -1, -3.6], x: [0, 0.6, 1.4], scale: [0.5, 1, 1.4] }}
            transition={{ delay: 0.9 + delay, duration: 1.4, ease: "easeOut" }}
          />
        ))}
    </Svg>
  );
}

const RAYS = ["M12 0.4v-1.8", "M17.4 2.6l1.3-1.3", "M19.6 8h1.8", "M6.6 2.6 5.3 1.3", "M4.4 8H2.6"];

/** Expert advice: a bulb drawn in that lights, its rays coming out. */
export function AdviceIcon({ play }: Play) {
  return (
    <Svg>
      <motion.circle
        cx={12}
        cy={8}
        r={4.2}
        fill="currentColor"
        stroke="none"
        initial={play ? { opacity: 0 } : false}
        animate={play ? { opacity: [0, 0.22, 0.1] } : { opacity: 0.1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      />
      <motion.path
        d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
        {...draw(play, 0, 0.8)}
      />
      <motion.path d="M9 18h6" {...draw(play, 0.5, 0.3)} />
      <motion.path d="M10 22h4" {...draw(play, 0.6, 0.3)} />
      {RAYS.map((d, i) => (
        <motion.path key={d} d={d} {...draw(play, 0.9 + i * 0.07, 0.3)} />
      ))}
    </Svg>
  );
}

/** Operating instructions: an open manual, a page turning over. */
export function ManualIcon({ play }: Play) {
  return (
    <Svg>
      <motion.path d="M12 5v16" {...draw(play, 0, 0.5)} />
      <motion.path
        d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"
        {...draw(play, 0.05, 0.9)}
      />
      {["M5.5 8h3", "M5.5 11h3", "M15.5 8h3", "M15.5 11h3"].map((d, i) => (
        <motion.path key={d} d={d} {...draw(play, 0.6 + i * 0.08, 0.3)} />
      ))}
      {play && (
        <motion.path
          d="M12 5c1-1.3 2.4-2 4-2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4c-1.6 0-3 .7-4 2z"
          initial={{ scaleX: 1, opacity: 0 }}
          animate={{ scaleX: [1, 1, -1], opacity: [0, 1, 1, 0] }}
          transition={{
            scaleX: { delay: 0.9, duration: 0.9, times: [0, 0.1, 1], ease: "easeInOut" },
            opacity: { delay: 0.9, duration: 1, times: [0, 0.1, 0.85, 1] },
          }}
          style={{ originX: 0, originY: 0.5 }}
        />
      )}
    </Svg>
  );
}

/** A long warranty: a shield drawn round, a tick put in it. */
export function WarrantyIcon({ play }: Play) {
  return (
    <Svg>
      <motion.g
        initial={play ? { scale: 1 } : false}
        animate={play ? { scale: [1, 1, 1.08, 1] } : { scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5, times: [0, 0.1, 0.5, 1] }}
      >
        <motion.path
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
          {...draw(play, 0, 0.9)}
        />
        <motion.path d="m9 12 2 2 4-4" {...draw(play, 0.7, 0.45)} />
      </motion.g>
    </Svg>
  );
}
