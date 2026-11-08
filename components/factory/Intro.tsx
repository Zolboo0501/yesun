"use client";
import StaggeredText from "@/components/react-bits/staggered-text";
import { rise, stagger } from "@/lib/reveal";
import { motion } from "motion/react";
import Image from "next/image";

// The factory's facts approved on 2026-11-08 (as on the about page): in use since 2021, 1 800 м² on two floors,
// 12 modern machines, a 216 м² warehouse.
const facts = [
  { value: "2021", label: "Ашиглалтад орсон" },
  { value: "1 800 м²", label: "Үйлдвэрийн талбай" },
  { value: "12", label: "Орчин үеийн тоног төхөөрөмж" },
  { value: "216 м²", label: "Агуулах" },
];

/** The factory page's opening, on white: the statement and one line on what the plant makes, its hall wide across the
 *  page, and its four figures under it. It replaces the old page's two photo carousels. */
export function Intro() {
  return (
    <section aria-labelledby="factory-title" className="bg-white text-ink">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20"
      >
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          {/* an h2: the product run above it opens the page and carries the h1 */}
          <h2
            id="factory-title"
            className="text-balance text-[clamp(2.5rem,1.3rem+3.4vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] lg:col-span-7"
          >
            <StaggeredText
              as="span"
              text="Агаар сэлгэлт, хөргөлтийн үйлдвэрлэл"
              delay={60}
              duration={0.8}
              easing={[0.16, 1, 0.3, 1]}
              from={{ opacity: 0, y: 14 }}
              to={{ opacity: 1, y: 0 }}
              className="block"
            />
          </h2>
          <motion.p
            variants={rise}
            className="max-w-[40ch] text-pretty text-step-body leading-[1.65] text-ink/70 lg:col-span-4 lg:col-start-9"
          >
            Суваг, фасон эдлэл, агаар сэлгэлтийн тоног төхөөрөмжийг өөрийн үйлдвэрт, төслийн хэмжээгээр хийнэ.
          </motion.p>
        </div>

        <motion.figure
          variants={rise}
          className="relative mt-12 aspect-[4/3] overflow-hidden rounded-[24px] bg-ink/5 sm:aspect-[21/9] lg:mt-16"
        >
          <Image
            src="/images/factory4.jpg"
            alt="Есөн Бэлчирийн хоёр давхар үйлдвэрийн цех"
            fill
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover object-[50%_60%]"
          />
        </motion.figure>

        <motion.dl variants={rise} className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col-reverse justify-end gap-1 border-t border-ink/10 pt-4">
              <dt className="text-sm text-ink/60">{fact.label}</dt>
              <dd className="text-[clamp(1.75rem,1.3rem+1.2vw,2.5rem)] font-semibold tracking-[-0.03em] tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
