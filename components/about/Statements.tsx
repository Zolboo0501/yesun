"use client";
import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

// The client's statements, shortened; the wording was approved on 2026-11-08.
// Each part's photo (Unsplash, free under the Unsplash License, 2026-11-08): the vision a sun rising over a hazy city
// (Ahmed Nishaath), the mission a tower crane over a building going up at dusk (Claudio Schwarz), the objective a
// summit above a sea of clouds with a climber on it (Christian Cueni).
const statements = [
  {
    label: "Алсын хараа",
    text: "Улс, нийгмийнхээ хөгжилд хувь нэмрээ оруулсан, салбартаа манлайлсан, олон нийтэд нээлттэй аж ахуйн нэгж байх.",
    photo: { src: "/images/vision-sunrise.jpg", alt: "Манантай хотын дээгүүр мандаж буй нар", position: "object-[50%_55%]" },
  },
  {
    label: "Эрхэм зорилго",
    text: "Орчин үеийн шийдэл, технологийг нэвтрүүлж, эрүүл аюулгүй ажиллагаа, хурд, чанар, стандартыг эрхэмлэнэ. Бидний оролцсон бүтээн байгуулалт бүр Монгол Улсын хөгжилд бодит хувь нэмэр оруулна.",
    photo: { src: "/images/mission-crane.jpg", alt: "Баригдаж буй барилга дээрх цамхаг кран", position: "object-[30%_40%] lg:object-[40%_40%]" },
  },
  {
    label: "Зорилт",
    text: "Салбарын хууль, журам, норм стандартыг тууштай мөрдөж, шинэ технологи нэвтрүүлэн хотын хөгжилд бодит хувь нэмэр оруулах; дотоодын шилдэг, нийгмийн хариуцлагатай аж ахуйн нэгж байх.",
    photo: { src: "/images/objective-summit.jpg", alt: "Үүлсийн дээрх оргил дээр зогсох уулчин", position: "object-[78%_60%] lg:object-[60%_60%]" },
  },
];
const words = statements.map((s) => s.text.split(" "));
const LAST = statements.length - 1;
const TOTAL = String(statements.length).padStart(2, "0");

// Within each part the words light over the first 70% of its scroll, then it holds before the next comes in.
const READ = 0.7;

/** One part's photo filling the stage: it crossfades in with its part and, while the stage scrolls, settles slowly
 *  from a slight zoom and drifts up, so the background moves with the reader. */
function Backdrop({
  photo,
  index,
  active,
  step,
  reduced,
}: {
  photo: (typeof statements)[number]["photo"];
  index: number;
  active: number;
  step: MotionValue<number>;
  reduced: boolean;
}) {
  const scale = useTransform(step, [index - 0.6, index + 1.4], reduced ? [1, 1] : [1.16, 1.02]);
  const y = useTransform(step, [index - 0.6, index + 1.4], reduced ? ["0%", "0%"] : ["3%", "-3%"]);
  return (
    <motion.div
      initial={false}
      animate={{ opacity: index === active ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    >
      <motion.div style={{ scale, y }} className="absolute -inset-[4%]">
        <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className={`object-cover ${photo.position}`} />
      </motion.div>
    </motion.div>
  );
}

/** Vision, mission and objective as one pinned stage, after the client's reference: the section's name at the top
 *  left and a link to the projects at the top right; under them the part's number and name at the left and its
 *  statement large on the right, whose words light one after another as the reader scrolls; behind it all, a photo
 *  of what the part means, which changes with the part and moves with the scroll, under a dark veil for the white
 *  type. */
export function Statements() {
  const reduced = useReducedMotion() ?? false;
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const step = useTransform(scrollYProgress, (p) => Math.min(p * statements.length, statements.length - 0.001));

  const [active, setActive] = useState(0);
  const [lit, setLit] = useState(0);
  const activeRef = useRef(0);
  const litRef = useRef(0);
  useMotionValueEvent(step, "change", (s) => {
    const i = Math.max(0, Math.min(LAST, Math.floor(s)));
    const n = Math.round(Math.max(0, Math.min(1, (s - i) / READ)) * words[i].length);
    if (i !== activeRef.current) {
      activeRef.current = i;
      setActive(i);
    }
    if (n !== litRef.current) {
      litRef.current = n;
      setLit(n);
    }
  });

  return (
    <section
      ref={section}
      aria-labelledby="statements-title"
      className="relative bg-night text-white"
      style={{ height: `${100 + statements.length * 90}svh` }}
    >
      <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden">
        {/* what each part means, as a photo behind it, under a veil that keeps the white type readable */}
        <div aria-hidden className="absolute inset-0">
          {statements.map((statement, i) => (
            <Backdrop key={statement.label} photo={statement.photo} index={i} active={active} step={step} reduced={reduced} />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_16_32/0.62)_0%,rgb(11_16_32/0.42)_38%,rgb(11_16_32/0.48)_70%,rgb(11_16_32/0.7)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_16_32/0.35)_0%,transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex h-full max-w-7xl flex-col px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="relative flex items-start justify-between gap-6">
            <h2
              id="statements-title"
              className="max-w-[16ch] text-balance text-[clamp(1.75rem,1.3rem+1.4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white/90"
            >
              Алсын хараа ба эрхэм зорилго
            </h2>
            <Link
              href="/projects"
              className="group mt-1 hidden shrink-0 items-center gap-2 rounded-[3px] border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/60 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
            >
              Төслүүд
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          </div>

          <div className="relative mt-[clamp(2.5rem,9vh,7rem)] grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* the part's number and name; the statements below carry their names for assistive tech */}
            <div aria-hidden className="flex items-center gap-4 lg:col-span-3 lg:flex-col lg:items-start lg:gap-5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-white/10 px-3 py-1.5 font-mono text-xs tabular-nums text-white/85 backdrop-blur-sm">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ y: reduced ? 0 : 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: reduced ? 0 : -10, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {String(active + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
                <span className="text-white/35">/</span>
                {TOTAL}
              </span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                  className="font-mono text-xs uppercase tracking-[0.24em] text-white/65"
                >
                  {statements[active].label}
                </motion.span>
              </AnimatePresence>
            </div>

            <dl className="grid lg:col-span-9">
              {statements.map((statement, i) => (
                <motion.div
                  key={statement.label}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, y: i === active || reduced ? 0 : i < active ? -16 : 16 }}
                  transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="[grid-area:1/1]"
                >
                  <dt className="sr-only">{statement.label}</dt>
                  <dd className="text-pretty text-[clamp(1.5rem,0.8rem+2.3vw,3.125rem)] font-medium leading-[1.14] tracking-[-0.03em]">
                    {words[i].map((word, k) => {
                      const on = i < active || (i === active && k < lit);
                      return (
                        <span
                          key={k}
                          className={`transition-colors duration-300 ${on ? "text-white" : "text-white/30"}`}
                        >
                          {word}
                          {k < words[i].length - 1 ? " " : ""}
                        </span>
                      );
                    })}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
