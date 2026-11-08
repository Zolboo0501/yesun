"use client";
import { Heading } from "@/components/about/Heading";
import { rise, stagger } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

// The plant's building (72 × 24 м, two floors, 7,35 м high: the facts approved on 2026-11-08) and four photos of it,
// in place of the old page's last carousel.
const photos = [
  {
    src: "/images/factory9.jpg",
    alt: "Есөн Бэлчирийн үйлдвэрийн барилга гаднаас",
    className: "col-span-2 row-span-2",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  {
    src: "/images/factory14.jpg",
    alt: "Суваг үйлдвэрлэх шугам",
    className: "col-span-2",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  { src: "/images/factory.jpg", alt: "Металл хуудасны ороомог тайлагч", className: "", sizes: "(min-width: 1024px) 25vw, 50vw" },
  { src: "/images/factory18.jpg", alt: "Урт хуудас нугалах машин", className: "", sizes: "(min-width: 1024px) 25vw, 50vw" },
];

/** The plant itself, last: its name and size over a hairline, and four photos as a bento (the building large on the
 *  left, the line and two machines on the right; the building across the top on a phone). Each photo closes in a
 *  little under the pointer. */
export function Plant() {
  return (
    <section aria-labelledby="plant-title" className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-t border-ink/10 py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <Heading id="plant-title" text="Манай үйлдвэр" />
            </div>
            <p className="max-w-[44ch] text-pretty text-step-body leading-[1.65] text-ink/70 lg:col-span-5 lg:col-start-8 lg:self-end">
              72 × 24 м хэмжээтэй, 7,35 м өндөртэй, хоёр давхар барилгад байрладаг.
            </p>
          </div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14 grid auto-rows-[160px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:mt-16 lg:auto-rows-[260px] lg:grid-cols-4"
          >
            {photos.map((photo) => (
              <motion.li
                key={photo.src}
                variants={rise}
                className={cn("group relative overflow-hidden rounded-[24px] bg-ink/5", photo.className)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={photo.sizes}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
