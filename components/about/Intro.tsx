"use client";
import StaggeredText from "@/components/react-bits/staggered-text";
import { rise, stagger } from "@/lib/reveal";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Every figure is confirmed by the client (PRODUCT.md). The four that say the most, briefly.
const facts = [
  { value: "2011", label: "Байгуулагдсан" },
  { value: "150+", label: "Объект" },
  { value: "1 800 м²", label: "Өөрийн үйлдвэр" },
  { value: "1–3 жил", label: "Чанарын баталгаа" },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// The photographs behind the opening, one after another: Ulaanbaatar at dusk from the air (duku. Fill), an office
// ceiling with its ducts and a diffuser (Adrien Olichon), a technician servicing an air conditioner (Joel Muniz), all
// Unsplash, free under the Unsplash License (2026-11-08).
const slides = [
  { src: "/images/about-city-night.jpg", position: "object-[55%_50%]" },
  { src: "/images/about-ceiling-ducts.jpg", position: "object-[78%_40%] sm:object-[50%_40%]" },
  { src: "/images/about-ac-service.jpg", position: "object-[35%_55%] sm:object-[50%_55%]" },
];
const HOLD = 6000; // each photo's time on screen, in ms
const FADE = 1.4; // the crossfade, in s

/** The opening, short and on photographs: the city at dusk, a ceiling's ducts and an air conditioner being serviced
 *  taking turns under a night veil, each closing in slowly while it shows; over them, at the foot, the statement and
 *  one line on what the company does on the left and the four figures that say the most on the right. The photos sink
 *  a little as the reader scrolls on; they change only while the opening is in view, and not under reduced motion. */
export function Intro() {
  const reduced = useReducedMotion() ?? false;
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const sink = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], reduced ? [1, 1] : [1, 0.35]);
  const inView = useInView(hero, { amount: 0.3 });
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (reduced || !inView) return;
    const turn = setInterval(() => setCurrent((c) => (c + 1) % slides.length), HOLD);
    return () => clearInterval(turn);
  }, [reduced, inView]);

  return (
    <section
      ref={hero}
      aria-label="Бидний тухай"
      className="relative isolate overflow-hidden bg-night text-white"
    >
      <motion.div aria-hidden style={{ y: sink }} className="absolute inset-0 -z-10">
        {slides.map((slide, i) => {
          const on = i === current;
          return (
            <motion.div
              key={slide.src}
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : FADE, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* closes in while it shows; once faded out it goes back, unseen, for its next turn */}
              <motion.div
                initial={reduced ? false : { scale: 1.12 }}
                animate={{ scale: on || reduced ? 1.02 : 1.12 }}
                transition={
                  on
                    ? { duration: reduced ? 0 : HOLD / 1000 + FADE, ease: "linear" }
                    : { duration: 0, delay: reduced ? 0 : FADE }
                }
                className="absolute inset-0"
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className={`object-cover ${slide.position}`}
                />
              </motion.div>
            </motion.div>
          );
        })}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(22_23_27/0.45)_0%,rgb(22_23_27/0.3)_35%,rgb(22_23_27/0.88)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(22_23_27/0.55)_0%,transparent_65%)]" />
      </motion.div>

      {/* the statement and one line at the foot on the left, the four figures beside them on the right */}
      <motion.div
        style={{ opacity: fade }}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto grid min-h-[calc(100svh-var(--header-h))] max-w-7xl content-end gap-10 px-4 pb-14 pt-32 sm:px-6 lg:grid-cols-12 lg:items-end lg:gap-8 lg:px-8 lg:pb-20"
      >
        <div className="lg:col-span-8">
          <StaggeredText
            as="h1"
            text="Барилга бүрийн агаарыг хариуцна."
            delay={60}
            duration={0.8}
            easing={EASE_OUT}
            from={{ opacity: 0, y: 14 }}
            to={{ opacity: 1, y: 0 }}
            className="block! max-w-[11em] pl-[0.9em] indent-[-0.9em] text-[clamp(2.5rem,1.3rem+3.4vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white *:indent-0"
          />
          <motion.p
            variants={rise}
            className="mt-6 max-w-[36ch] text-pretty text-step-body leading-[1.6] text-white/80 lg:mt-8"
          >
            Агаар сэлгэлт, хөргөлтийн системийн зураг төсөл, угсралт, засвар үйлчилгээ.
          </motion.p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:col-span-4 lg:col-start-9 lg:grid-cols-2">
          {facts.map((fact) => (
            <motion.div
              key={fact.label}
              variants={rise}
              className="flex flex-col-reverse justify-end gap-1 border-t border-white/20 pt-4"
            >
              <dt className="text-sm text-white/65">{fact.label}</dt>
              <dd className="text-[clamp(1.5rem,1.2rem+0.9vw,2rem)] font-semibold tracking-[-0.03em] tabular-nums">
                {fact.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
