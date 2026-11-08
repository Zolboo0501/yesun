"use client";
import { Heading } from "@/components/about/Heading";
import { rise, stagger } from "@/lib/reveal";
import { motion } from "motion/react";
import Image from "next/image";

// The director's greeting from its old page (/greeting/director now leads here), in paragraphs; only its punctuation
// is tidied. Its last sentence leads it as the quote.
const quote = "Таны төсөлд итгэл даах түнш байж, урт хугацаанд хамтран ажиллахад бид үргэлж нээлттэй.";
// Cut to two short paragraphs at the user's request (2026-11-09).
const letter = [
  "Сайн байна уу, намайг Дамирангийн Цогтоо гэдэг. Есөн Бэлчир ХХК-ийг үүсгэн байгуулж, ерөнхий захирлаар нь ажиллаж байна.",
  "Бид агаар сэлгэлт, хөргөлтийн системийг зураг төслөөс угсралт, ашиглалт хүртэл бүрэн хариуцаж, Монгол орны нөхцөлд тохирсон шийдлийг дотооддоо үйлдвэрлэдэг. Хариуцлага, стандарт, урт хугацааны хамтын ажиллагааг нэн тэргүүнд тавьдаг.",
];

/** The page opens on the director: his portrait on the left, and on the right the greeting's heading, its closing
 *  promise set large as the quote, the letter in paragraphs at a reading measure, and his signature with his name. */
export function DirectorGreeting() {
  return (
    <section id="director" aria-labelledby="director-title" className="bg-white text-ink">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-32 lg:pt-20"
      >
        <motion.figure variants={rise} className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink/5">
            <Image
              src="/images/director2.jpg"
              alt="Есөн Бэлчир ХХК-ийн үүсгэн байгуулагч, ерөнхий захирал Д.Цогтоо"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[50%_35%]"
            />
          </div>
        </motion.figure>

        <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <Heading id="director-title" text="Захирлын мэндчилгээ" />
          <motion.blockquote
            variants={rise}
            className="mt-8 text-pretty text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em]"
          >
            <p>“{quote}”</p>
          </motion.blockquote>
          <motion.div variants={rise} className="mt-8 max-w-[62ch] space-y-5 text-pretty text-step-body leading-[1.7] text-ink/75">
            {letter.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </motion.div>
          <motion.div variants={rise} className="mt-10 flex items-center gap-6 border-t border-ink/10 pt-6">
            <Image src="/images/signatureee.png" alt="" width={1536} height={1024} sizes="144px" className="h-16 w-auto" />
            <p className="text-sm leading-snug">
              <span className="block font-semibold text-ink">Д.Цогтоо</span>
              <span className="block text-ink/60">Үүсгэн байгуулагч, ерөнхий захирал</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
