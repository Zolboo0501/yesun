"use client";
import { Heading } from "@/components/about/Heading";
import { Part } from "@/components/about/Part";
import { rise, stagger } from "@/lib/reveal";
import { motion } from "motion/react";
import Image from "next/image";

// The team page's own words about the company and its people, cut to two short sentences (2026-11-09).
const story = [
  "2011 оноос хойш Барилга, хот байгуулалтын яамны тусгай зөвшөөрөлтэйгөөр нийслэл, орон нутгийн 150 гаруй объектод ажилласан.",
  "Мэргэжлээрээ өндөр түвшинд бэлтгэгдсэн, туршлагатай хамт олон.",
];

const photos = [
  { src: "/images/person.jpg", alt: "Агаарын сувгийг босоо шахтад угсарч буй инженерүүд" },
  { src: "/images/person2.jpg", alt: "Агаарын суваг зүсэж буй ажилтан" },
  { src: "/images/person4.jpg", alt: "Ширээн дээр хэмжилт хийж буй баг" },
];

/** The crew last: the company in three sentences beside three photos of the work (one tall, two stacked), then the
 *  whole team wide across the page. */
export function Crew() {
  return (
    <Part labelledBy="crew-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Heading id="crew-title" text="Манай хамт олон" />
          <div className="mt-8 max-w-[48ch] space-y-5 text-pretty text-step-body leading-[1.7] text-ink/75">
            {story.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 grid-rows-2 gap-4 lg:col-span-6 lg:col-start-7"
        >
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              variants={rise}
              className={
                i === 0
                  ? "relative row-span-2 overflow-hidden rounded-[24px] bg-ink/5"
                  : "relative aspect-[4/3] overflow-hidden rounded-[24px] bg-ink/5"
              }
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.figure
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 lg:mt-24"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-ink/5 sm:aspect-[21/9]">
          <Image
            src="/images/person3.jpg"
            alt="Есөн Бэлчирийн хамт олон барилгын талбай дээр"
            fill
            sizes="100vw"
            className="object-cover object-[50%_45%]"
          />
        </div>
        <figcaption className="mt-4 text-sm text-ink/60">Есөн Бэлчирийн хамт олон</figcaption>
      </motion.figure>
    </Part>
  );
}
