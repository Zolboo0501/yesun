import { brands } from "@/constants/brands";
import { contact } from "@/constants/data";
import { categoryLabel, products, type Product } from "@/constants/products";
import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { Gallery } from "./Gallery";
import { ProductCard } from "./ProductCard";

/** One product on white: a trail back to the catalog, its photos beside its name, what it is, a short summary, its
 *  features and the two ways to ask for it; then its figures, and up to four more of its kind. */
export function ProductDetail({ product }: { product: Product }) {
  const brand = brands.find((b) => b.slug === product.brand);
  // more of the same kind first, then more from the same brand
  const related = [
    ...products.filter((p) => p.slug !== product.slug && p.category === product.category),
    ...products.filter((p) => p.slug !== product.slug && p.category !== product.category && p.brand === product.brand),
  ].slice(0, 4);

  return (
    <article className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32 lg:pt-12">
        <nav aria-label="Байршил" className="text-sm text-ink/55">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/products" className="underline-offset-4 hover:text-ink hover:underline">
                Бүтээгдэхүүн
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={`/products?brand=${product.brand}`}
                className="underline-offset-4 hover:text-ink hover:underline"
              >
                {brand?.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Gallery images={product.images} alt={`${brand?.name ?? ""} ${product.name}`.trim()} />
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">
              {brand?.name} · {categoryLabel(product.category)}
            </p>
            <h1 className="mt-3 text-balance text-[clamp(2rem,1.4rem+1.8vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-ink/70">{product.title}</p>
            {product.model && (
              <p className="mt-2 font-mono text-sm text-ink/55 [overflow-wrap:anywhere]">Загвар: {product.model}</p>
            )}
            <p className="mt-6 text-pretty text-step-body leading-[1.65] text-ink/75">{product.summary}</p>
            {product.features.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[0.9375rem] leading-snug">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center gap-2 rounded-[3px] bg-ink px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Үнийн санал авах
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
              </Link>
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex min-h-12 items-center rounded-[3px] border border-ink/20 px-5 text-sm font-semibold tabular-nums transition-[border-color,transform] duration-200 hover:border-ink/50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {contact.phone}
              </a>
            </div>
            {brand && (
              <a
                href={product.source}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center gap-1.5 text-sm text-ink/60 underline decoration-ink/25 decoration-1 underline-offset-[5px] transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Үйлдвэрлэгчийн сайтаас үзэх (шинэ цонхонд нээгдэнэ)
                <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
            )}
          </div>
        </div>

        {product.specs.length > 0 && (
          <section aria-labelledby="specs-title" className="mt-20 lg:mt-24">
            <h2 id="specs-title" className="text-[clamp(1.5rem,1.2rem+0.9vw,2rem)] font-semibold tracking-[-0.025em]">
              Техникийн үзүүлэлт
            </h2>
            <dl className="mt-6 grid border-t border-ink/10 sm:grid-cols-2 sm:gap-x-12">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-6 border-b border-ink/10 py-4">
                  <dt className="text-ink/60">{spec.label}</dt>
                  <dd className="text-right font-semibold [overflow-wrap:anywhere]">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-20 lg:mt-24">
            <h2 id="related-title" className="text-[clamp(1.5rem,1.2rem+0.9vw,2rem)] font-semibold tracking-[-0.025em]">
              Төстэй бүтээгдэхүүн
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <ProductCard product={item} sizes="(min-width: 1024px) 290px, 50vw" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
