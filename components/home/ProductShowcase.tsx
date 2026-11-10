"use client";
import { Showcase2 } from "@/components/blocks/showcase-2";
import { ArrowUpRight } from "@/components/icons";
import StaggeredText from "@/components/react-bits/staggered-text";
import type { HomeProduct, ProductMenu } from "@/constants/products";
import { MotionConfig, motion } from "motion/react";
import Link from "next/link";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const FROM = { opacity: 0, y: 14 };
const SHOWN = { opacity: 1, y: 0 };

/** The equipment the company supplies, last before the partners' brands that make it, through the repo's showcase-2
 *  block: the heading set like the services' (two lines, the second set in, a rule with the line beside it) and the
 *  button to the whole catalog, then the eight products as a run of tall cards drifting across the page (each opens
 *  its page). The data comes from the server (constants/products.ts), so the catalog stays out of the page's script. */
export function ProductShowcase({ items, menu }: { items: HomeProduct[]; menu: ProductMenu }) {
  return (
    <MotionConfig reducedMotion="user">
      <section id="products" aria-labelledby="products-title" className="bg-white pt-24 text-ink lg:pt-32">
        <Showcase2
          label="Бүтээгдэхүүнүүд"
          items={items.map((product) => ({
            id: product.slug,
            href: `/products/${product.slug}`,
            image: product.image,
            eyebrow: product.brand,
            title: product.title,
            meta: product.name,
          }))}
          header={
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-[clamp(2rem,1.3rem+2.6vw,3.75rem)]">
                <h2 id="products-title" className="font-semibold leading-[0.98] tracking-[-0.04em]">
                  <StaggeredText
                    as="span"
                    text={"Манай\nбүтээгдэхүүн."}
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
                    Хөргөлт, агаар сэлгэлтийн тоног төхөөрөмжийг үйлдвэрлэгчээс нь шууд нийлүүлдэг.
                  </p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-10 inline-flex">
                <Link
                  href="/products"
                  className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Бүх бүтээгдэхүүн ({menu.total})
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                </Link>
              </motion.div>
            </div>
          }
        />
      </section>
    </MotionConfig>
  );
}
