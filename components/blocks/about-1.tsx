"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

export interface About1Member {
  name: string;
  role: string;
  /** a photo in public/; a member without one gets their initials on a tinted tile */
  image?: string;
  /** a line or two about them, shown on the card at the front */
  text?: string;
}

interface About1Props {
  members: About1Member[];
  /** the heading and lead over the carousel */
  header: ReactNode;
  displayProgressIndicators?: boolean;
  className?: string;
}

const CAROUSEL_CONFIG = {
  autoPlayInterval: 5000,
  animationDuration: 0.4,
  layoutDuration: 2,
  paddingDuration: 0.75,
  easing: [0.32, 0.72, 0, 1] as const,
};

const CAROUSEL_HEIGHT = 450;

/** "Н.Энхмэнд" → "НЭ": the family initial and the first letter of the given name. */
const initials = (name: string) =>
  name
    .split(/[.\s]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

/** A roster beside a carousel of portrait cards: the card at the front is whole and carries the person's lines, the
 *  next two wait inset behind it. It moves on by itself every five seconds until the visitor picks someone, holds
 *  while the pointer or the keyboard is on it, and stays put under reduced motion. */
export default function About1({ members, header, displayProgressIndicators = true, className }: About1Props) {
  const reduced = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [held, setHeld] = useState(false);
  const running = auto && !held && !reduced;

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % members.length);
    }, CAROUSEL_CONFIG.autoPlayInterval);
    return () => clearInterval(interval);
  }, [running, members.length]);

  const handleIndexChange = (index: number) => {
    setActiveIndex(index);
    setAuto(false);
  };

  const visibleMembers = [0, 1, 2].map((k) => members[(activeIndex + k) % members.length]);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn("grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12", className)}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
        }}
      >
        <TeamMemberList members={members} activeIndex={activeIndex} onIndexChange={handleIndexChange} />

        <div className="order-1 min-w-0 lg:order-2 lg:col-span-9">
          <div className="mb-10">{header}</div>
          <Carousel visibleMembers={visibleMembers} />
          {displayProgressIndicators && (
            <ProgressIndicators
              members={members}
              activeIndex={activeIndex}
              running={running}
              onIndexChange={handleIndexChange}
            />
          )}
        </div>
      </div>
    </MotionConfig>
  );
}

function TeamMemberList({
  members,
  activeIndex,
  onIndexChange,
}: {
  members: About1Member[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}) {
  return (
    <ul className="order-2 space-y-1 lg:order-1 lg:col-span-3">
      {members.map((member, index) => {
        const isActive = index === activeIndex;

        return (
          <li key={member.name}>
            <button
              type="button"
              onClick={() => onIndexChange(index)}
              aria-current={isActive ? "true" : undefined}
              className="group flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-md py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2 shrink-0 rounded-full transition-[transform,background-color] duration-300",
                  isActive ? "scale-100 bg-brand" : "scale-75 bg-ink/20 group-hover:bg-ink/40",
                )}
              />
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-base transition-colors duration-200",
                    isActive ? "font-medium text-ink" : "text-ink/55 group-hover:text-ink/80",
                  )}
                >
                  {member.name}
                </span>
                <span className="block text-xs text-ink/45">{member.role}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Carousel({ visibleMembers }: { visibleMembers: About1Member[] }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: CAROUSEL_HEIGHT }}>
      <div className="flex h-full gap-6">
        <AnimatePresence mode="sync" initial={false}>
          {visibleMembers.map((member, position) => (
            <CarouselCard key={member.name} member={member} position={position} />
          ))}
        </AnimatePresence>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[200px] bg-linear-to-l from-white to-transparent lg:block"
      />
    </div>
  );
}

function CarouselCard({ member, position }: { member: About1Member; position: number }) {
  const isActive = position === 0;
  const isNext = position === 1;

  return (
    <motion.div
      layout
      aria-hidden={!isActive}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: -100,
        transition: { duration: CAROUSEL_CONFIG.animationDuration },
      }}
      transition={{
        duration: CAROUSEL_CONFIG.animationDuration,
        ease: CAROUSEL_CONFIG.easing,
        layout: {
          duration: CAROUSEL_CONFIG.layoutDuration,
          ease: CAROUSEL_CONFIG.easing,
        },
      }}
      className="h-full w-[280px] shrink-0 sm:w-[320px] md:w-[400px]"
    >
      <motion.div
        className="relative h-full w-full overflow-hidden rounded-[24px] bg-ink/[0.04]"
        animate={{ padding: isActive ? "0px" : "4rem" }}
        transition={{ duration: CAROUSEL_CONFIG.paddingDuration }}
      >
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-[16px]"
          layout
          transition={{ duration: 0.6, ease: CAROUSEL_CONFIG.easing }}
        >
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(min-width: 768px) 400px, 320px"
              className="object-cover object-[50%_20%]"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-full w-full items-start justify-center bg-ink/[0.06] pt-[24%] text-[clamp(3rem,2rem+4vw,5.5rem)] font-semibold tracking-[-0.04em] text-ink/25"
            >
              {initials(member.name)}
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-white/90 via-white/30 to-transparent" />

          <CardContent member={member} isActive={isActive} isNext={isNext} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function CardContent({ member, isActive, isNext }: { member: About1Member; isActive: boolean; isNext: boolean }) {
  const paddingClasses = isActive ? "p-5 sm:p-6 md:p-8" : isNext ? "p-4 sm:p-5" : "p-3 sm:p-4";

  const titleClasses = isActive
    ? "text-xl sm:text-2xl md:text-3xl"
    : isNext
      ? "text-base sm:text-lg md:text-xl"
      : "text-sm sm:text-base md:text-lg";

  const roleClasses = isActive ? "text-sm sm:text-base" : isNext ? "text-xs sm:text-sm" : "text-xs";

  return (
    <div className={`absolute inset-x-0 bottom-0 ${paddingClasses}`}>
      <h3 className={`mb-1 font-semibold tracking-[-0.02em] text-ink ${titleClasses}`}>{member.name}</h3>
      <p className={`text-ink/70 ${roleClasses}`}>{member.role}</p>
      {isActive && member.text && (
        <p className="mt-3 max-w-[34ch] text-pretty text-sm leading-relaxed text-ink/75">{member.text}</p>
      )}
    </div>
  );
}

function ProgressIndicators({
  members,
  activeIndex,
  running,
  onIndexChange,
}: {
  members: About1Member[];
  activeIndex: number;
  running: boolean;
  onIndexChange: (index: number) => void;
}) {
  // A pointer shortcut only: the roster is the control for keyboards and assistive tech.
  return (
    <div aria-hidden className="mt-4 flex items-center gap-2">
      {members.map((member, index) => {
        const isActive = index === activeIndex;
        const filling = isActive && running;

        return (
          <button
            key={member.name}
            type="button"
            tabIndex={-1}
            onClick={() => onIndexChange(index)}
            className="group relative flex-1 cursor-pointer py-3"
          >
            <span className="relative block h-1 overflow-hidden rounded-full bg-ink/10 transition-colors group-hover:bg-ink/20">
              <motion.span
                key={filling ? `fill-${activeIndex}` : "still"}
                className="absolute inset-0 origin-left bg-ink"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isActive ? 1 : 0 }}
                transition={{
                  duration: filling ? CAROUSEL_CONFIG.autoPlayInterval / 1000 : 0.3,
                  ease: filling ? "linear" : "easeOut",
                }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
