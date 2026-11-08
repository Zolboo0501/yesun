"use client";
import { Heading } from "@/components/about/Heading";
import { rise, stagger } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

// The factory's strengths, drawn from the old factory page's copy (cut short) and the facts approved on 2026-11-08,
// each beside a photo of the plant.
const features = [
  {
    title: "Бүх шат нэг дор",
    text: "Зураг төсөл, үйлдвэрлэл, угсралт, тохируулга, засвар үйлчилгээг нэг дороос, нэгдсэн удирдлагатай хийнэ.",
    points: ["Зураг төсөл", "Үйлдвэрлэл", "Угсралт", "Засвар үйлчилгээ"],
    image: "/images/factory2.jpg",
    alt: "Үйлдвэрийн цехэд хуудас зүсэж буй ажилчид",
  },
  {
    title: "Орчин үеийн тоног төхөөрөмж",
    text: "1 800 м² үйлдвэрт 12 орчин үеийн тоног төхөөрөмжөөр суваг, фасон эдлэлийг төслийн хэмжээгээр хийнэ.",
    points: ["1 800 м²", "12 тоног төхөөрөмж", "2021 оноос"],
    image: "/images/factory12.jpg",
    alt: "Металл хуудас зүсэх машин ба агаарын компрессор",
  },
  {
    title: "Стандарт, чанарын хяналт",
    text: "Олон улсын стандарт, норм дүрмийг мөрдөж, бүтээгдэхүүн бүрийн чанар, аюулгүй байдлыг шалгаж, туршиж баталгаажуулна.",
    points: ["Олон улсын стандарт", "Хяналт, туршилт"],
    image: "/images/factory7.jpg",
    alt: "Үйлдвэрт хийсэн спираль хоолойнууд",
  },
  {
    title: "Эрчим хүч хэмнэсэн шийдэл",
    text: "Эрчим хүч хэмнэдэг, байгальд ээлтэй материал, тоног төхөөрөмж ашиглалтын зардлыг бууруулна.",
    points: ["Эрчим хүчний хэмнэлт", "Ашиглалтын зардал бага"],
    image: "/images/factory6.jpg",
    alt: "Спираль хоолой хийх машин, бэлэн суваг, сараалж",
  },
  {
    title: "Барилга бүрт тохирсон",
    text: "Үйлдвэр, оффис, орон сууц, эмнэлэг, сургуульд тохирсон суваг, тоног төхөөрөмж, агаар шүүгч, дуу намсгагчийг захиалгаар хийнэ.",
    points: ["Захиалгат шийдэл", "Угсралт", "Баталгаат үйлчилгээ"],
    image: "/images/factory3.jpg",
    alt: "Нугалах машинууд, хийгдэж буй сувгууд бүхий цех",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** What sets the factory apart, as alternating rows: a photo of the plant on one side and, on the other, the
 *  strength's number, name, one sentence and a few short facts; the sides swap from row to row, and on a phone the
 *  photo comes first. */
export default function Advantage() {
  return (
    <section id="features" aria-labelledby="features-title" className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Heading id="features-title" text="Үйлдвэрийн онцлог" />
          </div>
          <p className="max-w-[44ch] text-pretty text-step-body leading-[1.65] text-ink/70 lg:col-span-5 lg:col-start-8 lg:self-end">
            Агаар сэлгэлт, хөргөлтийн системийг зураг төслөөс засвар үйлчилгээ хүртэл нэг дор хийдэг үндэсний үйлдвэрлэгч.
          </p>
        </div>

        <ol className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {features.map((feature, i) => (
            <motion.li
              key={feature.title}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20"
            >
              <motion.figure
                variants={rise}
                className={cn("relative aspect-[4/3] overflow-hidden rounded-[24px] bg-ink/5", i % 2 === 1 && "md:order-2")}
              >
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </motion.figure>
              <motion.div variants={rise} className="max-w-[34rem]">
                <p className="font-mono text-xs tabular-nums tracking-[0.18em] text-ink/45">{pad(i + 1)}</p>
                <h3 className="mt-4 text-balance text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-pretty text-step-body leading-[1.65] text-ink/70">{feature.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {feature.points.map((point) => (
                    <li key={point} className="rounded-full bg-ink/[0.05] px-3 py-1.5 text-sm font-medium text-ink/75">
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
