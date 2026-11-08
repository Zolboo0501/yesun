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
 *  taking turns under a night veil, each closing in slowly while it shows; over them the statement, one line on what
 *  the company does, and the four figures that say the most. The photos sink a little as the reader scrolls on; they
 *  change only while the opening is in view, and not at all under reduced motion. */
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

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto flex min-h-[min(88svh,58rem)] max-w-7xl flex-col justify-end px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20"
      >
        <StaggeredText
          as="h1"
          text="2011 оноос хойш барилга бүрийн агаарыг хариуцаж байна."
          delay={60}
          duration={0.8}
          easing={EASE_OUT}
          from={{ opacity: 0, y: 14 }}
          to={{ opacity: 1, y: 0 }}
          className="block! max-w-[13em] pl-[0.9em] indent-[-0.9em] text-[clamp(2.5rem,1.2rem+3.8vw,5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white *:indent-0"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8"
        >
          <motion.p
            variants={rise}
            className="max-w-[44ch] text-pretty text-step-body leading-[1.6] text-white/80 lg:col-span-5"
          >
            БХБЯ-ны тусгай зөвшөөрөлтэй. Агаар сэлгэлт, хөргөлтийн системийг зураг төслөөс угсралт, засвар үйлчилгээ
            хүртэл нэг дор хийнэ.
          </motion.p>
          <motion.dl
            variants={rise}
            className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/20 pt-6 sm:grid-cols-4 lg:col-span-6 lg:col-start-7"
          >
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse justify-end gap-1">
                <dt className="text-sm text-white/65">{fact.label}</dt>
                <dd className="text-[clamp(1.5rem,1.2rem+0.9vw,2rem)] font-semibold tracking-[-0.03em] tabular-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </motion.div>
    </section>
  );
}
