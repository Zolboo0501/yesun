"use client";
import StaggeredText from "@/components/react-bits/staggered-text";
import { brands } from "@/constants/brands";
import { categories, categoryLabel, products, type CategoryId, type Product } from "@/constants/products";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ProductCard } from "./ProductCard";

type Filters = { brand: string | null; category: CategoryId | null; q: string };

const none: Filters = { brand: null, category: null, q: "" };
const brandName = (slug: string) => brands.find((b) => b.slug === slug)?.name ?? slug;
const fold = (text: string) => text.toLocaleLowerCase("mn");

/** The catalog on white: the heading, then the filters down the left (what it is, then whose) beside a search box and
 *  the products. The filters and the search live in the URL, so a filtered list can be shared. */
export function Catalog() {
  return (
    <section aria-labelledby="products-title" className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-32 lg:pt-20">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1
            id="products-title"
            className="text-balance text-[clamp(2.5rem,1.3rem+3.4vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] lg:col-span-7"
          >
            <StaggeredText
              as="span"
              text="Бүтээгдэхүүн"
              delay={60}
              duration={0.8}
              easing={[0.16, 1, 0.3, 1]}
              from={{ opacity: 0, y: 14 }}
              to={{ opacity: 1, y: 0 }}
              className="block"
            />
          </h1>
          <p className="max-w-[42ch] text-pretty text-step-body leading-[1.65] text-ink/70 lg:col-span-4 lg:col-start-9">
            Албан ёсны түнш брэндүүдийн агааржуулагч, сэнс, агаар боловсруулах төхөөрөмж.
          </p>
        </div>

        {/* the static page lists everything; the URL's filters take over once it is read */}
        <Suspense fallback={<Browser filters={none} />}>
          <BrowserFromUrl />
        </Suspense>
      </div>
    </section>
  );
}

function BrowserFromUrl() {
  const params = useSearchParams();
  const brand = params.get("brand");
  const category = params.get("category");
  return (
    <Browser
      filters={{
        brand: brands.some((b) => b.slug === brand) ? brand : null,
        category: categories.find((c) => c.id === category)?.id ?? null,
        q: params.get("q") ?? "",
      }}
    />
  );
}

function Browser({ filters }: { filters: Filters }) {
  const { brand, category } = filters;
  // the box answers each key at once; the URL follows
  const [q, setQ] = useState(filters.q);
  const [open, setOpen] = useState(false);

  const write = (next: Partial<Filters>) => {
    const merged = { ...filters, q, ...next };
    const params = new URLSearchParams();
    if (merged.brand) params.set("brand", merged.brand);
    if (merged.category) params.set("category", merged.category);
    if (merged.q.trim()) params.set("q", merged.q.trim());
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  };

  const needle = fold(q.trim());
  // names, model codes, what it is, the brand, the kind, the figures (so "R32" finds every R32 unit) and the text
  const found = (p: Product) =>
    !needle ||
    fold(
      [
        p.name,
        p.model,
        brandName(p.brand),
        p.title,
        categoryLabel(p.category),
        p.summary,
        ...p.features,
        ...p.specs.map((s) => s.value),
      ].join(" "),
    ).includes(needle);
  // each group counts what the other filters and the search leave
  const byCategory = products.filter((p) => (!brand || p.brand === brand) && found(p));
  const byBrand = products.filter((p) => (!category || p.category === category) && found(p));
  const shown = byCategory.filter((p) => !category || p.category === category);
  const picked = brands.find((b) => b.slug === brand);
  const active = Number(!!brand) + Number(!!category);

  // on phones the filters fold away once one is chosen, so the products come into view
  const pick = (next: Partial<Filters>) => {
    write(next);
    setOpen(false);
  };

  const clear = () => {
    setQ("");
    write({ brand: null, category: null, q: "" });
  };

  return (
    <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12">
      <aside aria-label="Шүүлтүүр" className="lg:col-span-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="product-filters"
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-sm font-semibold transition-colors hover:bg-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
        >
          <SlidersHorizontal aria-hidden className="size-4" />
          Шүүлтүүр
          {active > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-ink text-[11px] text-white tabular-nums">
              {active}
            </span>
          )}
        </button>
        <div
          id="product-filters"
          className={cn("mt-4 space-y-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:mt-0 lg:block", !open && "hidden")}
        >
          <Facet
            title="Ангилал"
            all={byCategory.length}
            selected={category}
            items={categories
              .map((c) => ({ id: c.id, label: c.label, count: byCategory.filter((p) => p.category === c.id).length }))
              .filter((item) => item.count > 0 || item.id === category)}
            onSelect={(id) => pick({ category: id as CategoryId | null })}
          />
          <Facet
            title="Брэнд"
            all={byBrand.length}
            selected={brand}
            items={brands
              .map((b) => ({ id: b.slug, label: b.name, count: byBrand.filter((p) => p.brand === b.slug).length }))
              .filter((item) => item.count > 0 || item.id === brand)}
            onSelect={(id) => pick({ brand: id })}
          />
        </div>
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block sm:w-[min(26rem,100%)]">
            <span className="sr-only">Бүтээгдэхүүн хайх</span>
            <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/45" />
            <input
              type="search"
              value={q}
              onChange={(event) => {
                setQ(event.target.value);
                write({ q: event.target.value });
              }}
              placeholder="Нэр, загвар, брэндээр хайх"
              autoComplete="off"
              enterKeyHint="search"
              className="h-12 w-full rounded-full bg-ink/[0.05] pl-11 pr-11 text-base outline-none transition-colors placeholder:text-ink/45 focus:bg-ink/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-search-cancel-button]:hidden"
            />
            {q && (
              <button
                type="button"
                aria-label="Хайлтыг арилгах"
                onClick={() => {
                  setQ("");
                  write({ q: "" });
                }}
                className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ink/55 transition-colors hover:bg-ink/10 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </label>
          <p aria-live="polite" className="text-sm text-ink/60 tabular-nums">
            {shown.length} бүтээгдэхүүн
          </p>
        </div>

        {/* the chosen brand, as the partner page has it */}
        {picked && (
          <div className="mt-6 flex flex-col gap-4 rounded-[24px] bg-ink/[0.035] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <span className="relative block h-10 w-32 shrink-0">
              <Image
                src={picked.logo}
                alt={picked.name}
                fill
                sizes="128px"
                className="origin-left object-contain object-left mix-blend-multiply"
                style={{ transform: `scale(${picked.logoScale})` }}
              />
            </span>
            <p className="flex-1 text-pretty text-base leading-[1.6] text-ink/70">
              <span className="font-semibold text-ink">{picked.category}.</span> {picked.summary}
            </p>
            <Link
              href={`/partner#${picked.slug}`}
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium underline decoration-ink/30 decoration-1 underline-offset-[5px] transition-[text-decoration-color] hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              Брэндийн тухай
              <ArrowUpRight aria-hidden className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          </div>
        )}

        {shown.length > 0 ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3">
            {shown.map((product) => (
              <li key={product.slug}>
                <ProductCard product={product} sizes="(min-width: 1280px) 290px, (min-width: 768px) 30vw, 50vw" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[24px] bg-ink/[0.035] px-6 py-16 text-center">
            <p className="font-semibold">Тохирох бүтээгдэхүүн олдсонгүй</p>
            <p className="mt-1 text-sm text-ink/60">Өөр үгээр хайгаад, эсвэл шүүлтүүрээ арилгаад үзнэ үү.</p>
            <button
              type="button"
              onClick={clear}
              className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-[background-color,transform] hover:bg-ink/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Шүүлтүүрийг арилгах
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** One filter group: "all" first, then its options with how many products each leaves; the chosen one is ink. */
function Facet({
  title,
  all,
  selected,
  items,
  onSelect,
}: {
  title: string;
  all: number;
  selected: string | null;
  items: { id: string; label: string; count: number }[];
  onSelect: (id: string | null) => void;
}) {
  const option = (id: string | null, label: string, count: number) => {
    const on = selected === id;
    return (
      <li key={id ?? "all"}>
        <button
          type="button"
          aria-pressed={on}
          onClick={() => onSelect(on && id ? null : id)}
          className={cn(
            "flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-full px-4 py-2 text-left text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            on ? "bg-ink font-semibold text-white" : "text-ink/75 hover:bg-ink/[0.05] hover:text-ink",
          )}
        >
          <span>{label}</span>
          <span className={cn("text-xs tabular-nums", on ? "text-white/60" : "text-ink/40")}>{count}</span>
        </button>
      </li>
    );
  };

  return (
    <div>
      <p className="px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">{title}</p>
      <ul className="mt-2 space-y-0.5">
        {option(null, "Бүгд", all)}
        {items.map((item) => option(item.id, item.label, item.count))}
      </ul>
    </div>
  );
}
