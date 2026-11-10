"use client";
import { ArrowUpRight } from "@/components/icons";
import StaggeredText from "@/components/react-bits/staggered-text";
import { engineers } from "@/constants/data";
import { rise, stagger } from "@/lib/reveal";
import { MotionConfig, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const FROM = { opacity: 0, y: 14 };
const SHOWN = { opacity: 1, y: 0 };

// the four with photographs; the two safety engineers without one are on the team page
const pictured = engineers.flatMap((person) => (person.image ? [{ ...person, image: person.image }] : []));

/** The engineering team on the home page, after the projects: the heading set like the services' (two lines, the
 *  second set in, a rule with the line beside it) and the link to the whole team, then the four engineers with
 *  photographs as portrait cards, rising in one after another. Two up on phones. */
export function EngineerTeam() {
  return (
    // the cards keep their fade but drop the rise for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
      <section id="engineers" aria-labelledby="engineers-title" className="bg-white py-24 text-ink lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="text-[clamp(2rem,1.3rem+2.6vw,3.75rem)] lg:col-span-8">
              <h2 id="engineers-title" className="font-semibold leading-[0.98] tracking-[-0.04em]">
                <StaggeredText
                  as="span"
                  text={"Инженерийн\nбаг."}
                  delay={60}
                  duration={0.7}
                  easing={EASE_OUT}
                  from={FROM}
                  to={SHOWN}
                  className="block pl-[0.9em] indent-[-0.9em] *:indent-0"
                />
              </h2>
              <div className="mt-[0.45em] flex items-start gap-5 pl-[0.9em]">
                <span aria-hidden className="mt-[0.8rem] h-px w-12 shrink-0 bg-ink/60 sm:w-16" />
                <p className="max-w-[38ch] text-pretty text-step-body leading-[1.55] text-ink/80">
                  Зураг төсөл, тооцоо, угсралт, ашиглалтыг нэг дор хариуцдаг мэргэшсэн баг.
                </p>
              </div>
            </div>
            <Link
              href="/ourTeam#engineers"
              className="group inline-flex min-h-11 items-center gap-1.5 justify-self-start text-sm font-medium text-ink underline decoration-ink/30 decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand lg:col-span-4 lg:justify-self-end"
            >
              Бүх инженер
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          </div>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:mt-20 lg:grid-cols-4 lg:gap-x-8"
          >
            {pictured.map((person) => (
              <motion.li key={person.name} variants={rise}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-panel">
                  <Image
                    src={person.image}
                    alt={`${person.name}, ${person.role}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] sm:text-xl">{person.name}</h3>
                <p className="mt-1 text-pretty text-sm leading-snug text-ink/80 sm:text-base">{person.role}</p>
                {person.text && <p className="mt-1 text-sm text-ink/60">{person.text}</p>}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </MotionConfig>
  );
}
