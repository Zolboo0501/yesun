"use client";
import { rise, stagger } from "@/lib/reveal";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const projects = [
  {
    year: "2024",
    title: "Эрдэнэс Таван Толгойн нүүрс баяжуулах үйлдвэр",
    work: "Үйлдвэрийн барилгын агаар сэлгэлт",
    location: "Өмнөговь",
    image: "/images/project.webp",
  },
  {
    year: "2024",
    title: "Нийслэлийн нутгийн захиргааны төв цогцолбор",
    work: "Барилгын агаар сэлгэлтийн систем",
    location: "Улаанбаатар",
    image: "/images/project11.webp",
  },
  {
    year: "2024",
    title: "Сансар Гарден",
    work: "2 блокийн агаар сэлгэлт, хөргөлтийн систем",
    location: "Улаанбаатар",
    image: "/images/project13.webp",
  },
  {
    year: "2023",
    title: "Platinum Tower",
    work: "Агаар сэлгэлт, хөргөлт, нэгдсэн гражын агаар сэлгэлт",
    location: "Улаанбаатар",
    image: "/images/project8.webp",
  },
  {
    year: "2022",
    title: "Одод хотхон",
    work: "Агаар сэлгэлт, хөргөлт, нэгдсэн гражын агаар сэлгэлт",
    location: "Улаанбаатар",
    image: "/images/project7.webp",
  },
  {
    year: "2022",
    title: "Нисэх гарден хотхон",
    work: "Орон сууцны агаар сэлгэлтийн систем",
    location: "Улаанбаатар",
    image: "/images/project10.webp",
  },
  {
    year: "2021",
    title: "Чингис хаан музей",
    work: "Агаар сэлгэлт, хөргөлтийн угсралт, тоног төхөөрөмж",
    location: "Улаанбаатар",
    image: "/images/project2.webp",
  },
  {
    year: "2020",
    title: "Хүннү 2222",
    work: "Орон сууцны агаар сэлгэлтийн систем",
    location: "Улаанбаатар",
    image: "/images/project4.webp",
  },
];

export function Projects() {
  // Desktop: hovering or focusing a row swaps the large picture beside the list.
  const [active, setActive] = useState(0);

  return (
    <section id="projects" className="bg-panel py-24 text-ink lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <motion.p
              variants={rise}
              className="font-mono text-xs uppercase tracking-[0.18em] text-brand"
            >
              08 / Төслүүд
            </motion.p>
            <motion.h2
              variants={rise}
              className="mt-5 text-[clamp(2rem,1.2rem+3vw,4rem)] font-semibold leading-none tracking-[-0.04em]"
            >
              Хэрэгжүүлсэн төслүүд
            </motion.h2>
          </div>
          <motion.div variants={rise}>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 border-b-2 border-ink pb-1 font-mono text-xs uppercase tracking-[0.16em] transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              Бүх төслүүд
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <motion.ol
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="border-b border-ink/10 lg:col-span-7"
          >
            {projects.map((project, i) => (
              <motion.li key={project.title} variants={rise}>
                <Link
                  href="/projects"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid grid-cols-[4rem_1fr] items-start gap-4 border-t border-ink/10 py-6 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand sm:grid-cols-[4.5rem_1fr_auto] sm:gap-6"
                >
                  <div className="size-16 overflow-hidden bg-white lg:hidden">
                    <Image
                      src={project.image}
                      alt=""
                      width={128}
                      height={128}
                      sizes="64px"
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="hidden pt-1.5 font-mono text-xs tracking-[0.14em] text-soft tabular-nums lg:block">
                    {project.year}
                  </span>
                  <span>
                    <span
                      className={`block text-xl font-semibold leading-tight tracking-[-0.02em] transition-colors sm:text-2xl ${
                        active === i ? "lg:text-brand" : ""
                      }`}
                    >
                      {project.title}
                    </span>
                    <span className="mt-2 block text-step-small leading-relaxed text-soft">
                      <span className="lg:hidden">{project.year} · </span>
                      {project.work}
                    </span>
                  </span>
                  <span className="hidden items-center gap-2 pt-1.5 font-mono text-xs uppercase tracking-[0.14em] text-soft sm:flex">
                    {project.location}
                    <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ol>

          <div className="hidden lg:col-span-5 lg:block">
            <figure className="sticky top-[calc(11vh+2rem)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-white">
                {projects.map((project, i) => (
                  <Image
                    key={project.image}
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="40vw"
                    className={`object-cover transition-[opacity,scale] duration-700 ${
                      active === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                    }`}
                  />
                ))}
              </div>
              <figcaption className="mt-3 flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-soft">
                <span>{projects[active].title}</span>
                <span className="tabular-nums">
                  {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
