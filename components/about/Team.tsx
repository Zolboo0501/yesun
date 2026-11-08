"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

/** The whole team, full-bleed straight under the opening, the two photos meeting with no gap: as tall as the screen
 *  under the header from md, 4:5 on phones (a screen-tall crop there would keep only the middle of the group). It
 *  settles from a slight zoom while its top travels up the screen; under reduced motion it stands still. */
export function Team() {
  const reduced = useReducedMotion() ?? false;
  const box = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.12, 1]);

  return (
    <figure
      ref={box}
      className="relative m-0 aspect-[4/5] overflow-hidden bg-night md:aspect-auto md:h-[calc(100svh-var(--header-h))]"
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src="/images/person3.jpg"
          alt="Есөн Бэлчирийн хамт олон барилгын талбай дээр"
          fill
          sizes="100vw"
          className="object-cover object-[50%_45%]"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-ink/55 to-transparent" />
      <figcaption className="absolute bottom-5 left-5 text-sm font-medium text-white/85 sm:bottom-7 sm:left-7">
        Есөн Бэлчирийн хамт олон
      </figcaption>
    </figure>
  );
}
