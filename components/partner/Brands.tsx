"use client";
import StaggeredText from "@/components/react-bits/staggered-text";
import { brands, type Brand } from "@/constants/brands";
import { rise, stagger } from "@/lib/reveal";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

/** One brand: two product photos on white tiles, then its logo as the heading with where it is from, what it makes,
 *  one line, three facts as pills and a link to its own site. */
function BrandCard({ brand }: { brand: Brand }) {
  return (
    <motion.article
      id={brand.slug}
      variants={rise}
      // a card reached by its #slug (the jump row, the footer's orbit) is still 24px low from its entrance when the page
      // scrolls to it, so the margin is 24px over the header's clearance
      className="group flex scroll-mt-32 flex-col rounded-[24px] bg-ink/[0.035] p-2"
    >
      <div className="grid grid-cols-2 gap-2">
        {brand.photos.map((photo) => (
          <div key={photo.src} className="relative aspect-square overflow-hidden rounded-[18px] bg-white">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 200px, (min-width: 768px) 25vw, 50vw"
              className="object-contain p-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none sm:p-5"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-6 sm:px-5 sm:pb-5">
        <div className="flex items-center justify-between gap-4">
          {/* the logo is the heading; its white ground melts into the card */}
          <h2 className="relative h-9 w-32 shrink-0">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              sizes="160px"
              className="origin-left object-contain object-left mix-blend-multiply"
              style={{ transform: `scale(${brand.logoScale})` }}
            />
          </h2>
          <span className="text-right text-sm text-ink/55">
            {brand.country}
            {brand.since && ` · ${brand.since} оноос`}
          </span>
        </div>
        <p className="mt-5 font-semibold leading-snug text-ink">{brand.category}</p>
        <p className="mt-1.5 text-pretty text-base leading-[1.6] text-ink/70">{brand.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {brand.points.map((point) => (
            <li key={point} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/75">
              {point}
            </li>
          ))}
        </ul>
        <a
          href={brand.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${brand.name} брэндийн сайт (шинэ цонхонд нээгдэнэ)`}
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-6 text-sm font-semibold text-ink transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          {brand.domain}
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </div>
    </motion.article>
  );
}

/** The partner page: the statement with the six logos as a row that jumps to each brand, the brands as cards (three
 *  across on desktop, two on a tablet, one on a phone), and a closing panel that sends the reader to an engineer. */
export function Brands() {
  return (
    <section aria-labelledby="partners-page-title" className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-32 lg:pt-20">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1
            id="partners-page-title"
            className="text-balance text-[clamp(2.5rem,1.3rem+3.4vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] lg:col-span-7"
          >
            <StaggeredText
              as="span"
              text="Албан ёсны түншүүд"
              delay={60}
              duration={0.8}
              easing={[0.16, 1, 0.3, 1]}
              from={{ opacity: 0, y: 14 }}
              to={{ opacity: 1, y: 0 }}
              className="block"
            />
          </h1>
          <p className="max-w-[42ch] text-pretty text-step-body leading-[1.65] text-ink/70 lg:col-span-4 lg:col-start-9">
            Дэлхийд танигдсан {brands.length} брэндийн агаар сэлгэлт, хөргөлтийн тоног төхөөрөмжийг албан ёсоор нийлүүлж,
            угсарна.
          </p>
        </div>

        {/* the six logos, each a jump to its brand */}
        <nav aria-label="Брэндүүд" className="mt-12 lg:mt-16">
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {brands.map((brand) => (
              <li key={brand.slug}>
                <a
                  href={`#${brand.slug}`}
                  aria-label={brand.name}
                  className="group relative flex h-20 items-center justify-center overflow-hidden rounded-[16px] bg-ink/[0.035] transition-colors hover:bg-ink/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="relative h-8 w-[70%]">
                    <Image
                      src={brand.logo}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-contain opacity-70 mix-blend-multiply grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                      style={{ transform: `scale(${brand.logoScale})` }}
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="mt-16 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </motion.div>

        {/* the next step: which brand fits the project is an engineer's call */}
        <div className="mt-16 flex flex-col gap-6 rounded-[24px] bg-ink p-8 text-white sm:p-10 lg:mt-20 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <div>
            <h2 className="text-balance text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
              Аль брэнд таны төсөлд тохирох вэ?
            </h2>
            <p className="mt-3 max-w-[48ch] text-pretty text-step-body leading-[1.6] text-white/70">
              Инженер маань төслийн шаардлагад тохирох тоног төхөөрөмжийг санал болгоно.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:self-auto"
          >
            Инженертэй холбогдох
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </Link>
        </div>
      </div>
    </section>
  );
}
