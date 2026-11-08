"use client";
import { Heading } from "@/components/about/Heading";
import { Part } from "@/components/about/Part";
import { rise, stagger } from "@/lib/reveal";
import { motion } from "motion/react";
import Image from "next/image";

// The engineering lead's greeting, from the old engineering greeting page; its last sentence leads it as the quote.
const quote =
  "Бид өнөөдрийн гүйцэтгэлээс гадна ирээдүйн ашиглалт, засвар үйлчилгээний үр ашгийг урьдчилан тооцож ажилладаг.";
// Cut to one paragraph at the user's request (2026-11-09).
const words = [
  "Манай баг Монгол орны уур амьсгал, барилгын онцлогт нийцсэн агаар сэлгэлт, хөргөлтийн системийг судалгаа, зураг төслөөс эхлээд суурилуулалт, тохируулга хүртэл бүрэн хариуцаж хийдэг.",
];

/** The engineering lead's greeting, the director's mirrored: the words on the left (his name and years under the
 *  heading, the quote, the paragraphs) and his photo on the right. */
export function LeadGreeting() {
  return (
    <Part labelledBy="lead-title">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-12 lg:grid-cols-12 lg:gap-8"
      >
        <div className="lg:col-span-6 lg:self-center">
          <Heading id="lead-title" text="Инженерийн багийн ахлагч" />
          <motion.p variants={rise} className="mt-4 text-step-body text-ink/60">
            <span className="font-semibold text-ink">Б.Бэхбат</span> · 17 жилийн туршлагатай инженер
          </motion.p>
          <motion.blockquote
            variants={rise}
            className="mt-8 text-pretty text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.02em]"
          >
            <p>“{quote}”</p>
          </motion.blockquote>
          <motion.div variants={rise} className="mt-8 max-w-[62ch] space-y-5 text-pretty text-step-body leading-[1.7] text-ink/75">
            {words.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </motion.div>
        </div>

        <motion.figure variants={rise} className="lg:col-span-5 lg:col-start-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-ink/5">
            <Image
              src="/images/engineering5.JPG"
              alt="Инженерийн багийн ахлагч Б.Бэхбат ажлын байрандаа"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[55%_45%]"
            />
          </div>
        </motion.figure>
      </motion.div>
    </Part>
  );
}
