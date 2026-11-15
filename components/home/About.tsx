"use client";
import { rise, stagger } from "@/lib/reveal";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const facts = [
  { label: "Байгуулагдсан", value: "2011" },
  { label: "Угсралт хийсэн объект", value: "150+" },
  { label: "Үйлдвэрийн талбай", value: "1 800 м²" },
  { label: "Үйлдвэрийн тоног төхөөрөмж", value: "12" },
  { label: "Чанарын баталгаа", value: "1–3 жил" },
];

// standalone: rendered on /about itself, so no step number and no link to /about.
export function About({ standalone }: { standalone?: boolean }) {
  return (
    <section id="about" className="bg-white py-24 text-ink lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p
            variants={rise}
            className="font-mono text-xs uppercase tracking-[0.18em] text-brand"
          >
            {standalone ? "" : "07 / "}Бидний тухай
          </motion.p>
          <motion.h2
            variants={rise}
            className="mt-5 max-w-[24ch] text-balance text-[clamp(2rem,1.2rem+3vw,4rem)] font-semibold leading-none tracking-[-0.04em]"
          >
            2011 оноос хойш барилга бүрийн агаарыг хариуцаж байна.
          </motion.h2>
        </motion.div>

        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-5"
          >
            <motion.p variants={rise} className="text-step-body leading-relaxed">
              Барилга, хот байгуулалтын яамнаас олгосон тусгай зөвшөөрлийн
              дагуу 2011 онд байгуулагдсан.
            </motion.p>
            <motion.p
              variants={rise}
              className="mt-5 text-step-body leading-relaxed"
            >
              Агаар сэлгэх болон хөргөлтийн системийн тооцоолол, зураг төсөл,
              зөвлөгөө, тоног төхөөрөмж нийлүүлэлт, угсралтын чиглэлээр нийслэл
              болон орон нутагт 150 гаруй объектод ажилласан.
            </motion.p>
            <motion.p
              variants={rise}
              className="mt-5 text-step-body leading-relaxed"
            >
              Мэргэжлийн өндөр түвшинд бэлтгэгдсэн, туршлагатай хамт олны ажлын
              үр дүн бүтээн байгуулалт бүрт харагддаг.
            </motion.p>

            <motion.dl variants={rise} className="mt-12">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-6 border-t border-ink/10 py-4 last:border-b"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-soft">
                    {fact.label}
                  </dt>
                  <dd className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            {!standalone && (
              <motion.div variants={rise} className="mt-10">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 border-b-2 border-ink pb-1 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  Компанийн танилцуулга
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-5 gap-3 lg:col-span-6 lg:col-start-7"
          >
            <motion.figure variants={rise} className="col-span-3">
              <div className="aspect-[4/5] overflow-hidden bg-panel">
                <Image
                  src="/images/person2.jpg"
                  alt="Есөн Бэлчирийн ажилтан агаарын суваг угсарч байна"
                  width={900}
                  height={1125}
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="size-full object-cover"
                />
              </div>
              <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-soft">
                Угсралтын ажил
              </figcaption>
            </motion.figure>
            <div className="col-span-2 flex flex-col gap-3 pt-16">
              <motion.figure variants={rise}>
                <div className="aspect-[3/4] overflow-hidden bg-panel">
                  <Image
                    src="/images/about3.jpg"
                    alt="Есөн Бэлчирийн үйлдвэрийн металл зүсэх машин"
                    width={600}
                    height={800}
                    sizes="(min-width: 1024px) 20vw, 40vw"
                    className="size-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-soft">
                  Үйлдвэр
                </figcaption>
              </motion.figure>
              <motion.figure variants={rise}>
                <div className="aspect-square overflow-hidden bg-panel">
                  <Image
                    src="/images/person6.jpg"
                    alt="Есөн Бэлчирийн техникч тоног төхөөрөмж засварлаж байна"
                    width={600}
                    height={600}
                    sizes="(min-width: 1024px) 20vw, 40vw"
                    className="size-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-soft">
                  Засвар үйлчилгээ
                </figcaption>
              </motion.figure>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
