"use client";
import { rise, stagger } from "@/lib/reveal";
import { motion } from "motion/react";
import Image from "next/image";
import { Heading } from "./Heading";
import { Part } from "./Part";
import { ProductTile } from "./ProductTile";

// The client's facts, as approved on 2026-11-08: the factory (2021, 72 m × 24 m, 7,35 m high, 1 800 m², two floors),
// the warehouse (18 m × 12 m, 216 m², one floor, cold and freezer chambers) and the 12 modern machines.
const photos = {
  factory: {
    src: "/images/about1.jpg",
    alt: "Есөн Бэлчирийн үйлдвэрийн цех, дээр нь хоёрдугаар давхар",
    title: "Үйлдвэр",
    facts: ["72 м × 24 м", "7,35 м өндөр", "Хоёр давхар"],
  },
  warehouse: {
    src: "/images/factory10.jpg",
    alt: "Үйлдвэрт хийсэн агаарын сувгууд",
    title: "Агуулах",
    facts: ["18 м × 12 м", "216 м²", "Хөргөх, хөлдөөх камер"],
  },
  equipment: {
    src: "/images/about3.jpg",
    alt: "Металл хуудас зүсэх машин",
    title: "Тоног төхөөрөмж",
    facts: ["12 тоног төхөөрөмж", "Орчин үеийн"],
  },
};

/** A photo tile of the bento: the photo filling a rounded tile, slowly closing in under the pointer, with its name
 *  and its facts as small chips on a shade along the foot. */
function PhotoTile({ photo, sizes }: { photo: (typeof photos)[keyof typeof photos]; sizes: string }) {
  return (
    <figure className="group relative isolate h-full min-h-[16rem] overflow-hidden rounded-[24px] bg-ink/5">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        quality={90}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink/80 via-ink/35 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <span className="block text-lg font-semibold tracking-[-0.01em]">{photo.title}</span>
        <span className="mt-3 flex flex-wrap gap-1.5">
          {photo.facts.map((fact) => (
            <span
              key={fact}
              className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"
            >
              {fact}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

const figures = [
  { value: "2021", label: "Ашиглалтад орсон" },
  { value: "216 м²", label: "Агуулах" },
  { value: "12", label: "Тоног төхөөрөмж" },
];

/** The factory as a bento: what it makes in the big tile (the factory page's 3D run of fifteen duct products, which
 *  turns under a drag and slides one product out after another), the factory and the warehouse beside it, then the
 *  floor area with the other figures and the machines along the foot. */
export function Factory() {
  return (
    <Part labelledBy="factory-title">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Heading id="factory-title" text="Сувгаа өөрсдөө хийнэ." />
        </div>
        <p className="max-w-[44ch] text-pretty text-step-body leading-[1.65] text-ink/75 lg:col-span-5 lg:col-start-8 lg:self-end">
          Агаарын суваг, фасон эдлэлийг өөрийн үйлдвэрт төсөл бүрийн хэмжээгээр хийнэ.
        </p>
      </div>

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:grid-rows-[repeat(2,minmax(16rem,auto))_minmax(18rem,auto)]"
      >
        <motion.li variants={rise} className="md:col-span-2 lg:col-span-7 lg:row-span-2">
          <ProductTile />
        </motion.li>
        <motion.li variants={rise} className="aspect-[4/3] md:aspect-auto lg:col-span-5">
          <PhotoTile photo={photos.factory} sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw" />
        </motion.li>
        <motion.li variants={rise} className="aspect-[4/3] md:aspect-auto lg:col-span-5">
          <PhotoTile photo={photos.warehouse} sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw" />
        </motion.li>
        <motion.li variants={rise} className="lg:col-span-4">
          <div className="flex h-full flex-col justify-between gap-8 rounded-[24px] bg-ink/[0.035] p-6 sm:p-8">
            <div>
              <p className="text-[clamp(2.75rem,2rem+2.4vw,4rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                1 800 м²
              </p>
              <p className="mt-3 text-sm text-ink/65">Үйлдвэрийн талбай, хоёр давхар барилга</p>
            </div>
            <dl className="grid grid-cols-3 gap-4 border-t border-ink/10 pt-5">
              {figures.map((figure) => (
                <div key={figure.label}>
                  <dt className="text-[11px] leading-snug text-ink/55">{figure.label}</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-[-0.02em] tabular-nums">{figure.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.li>
        <motion.li variants={rise} className="aspect-[4/3] md:aspect-auto lg:col-span-8">
          <PhotoTile photo={photos.equipment} sizes="(min-width: 1024px) 60vw, (min-width: 768px) 50vw, 100vw" />
        </motion.li>
      </motion.ul>
    </Part>
  );
}
