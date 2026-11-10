"use client";
import Navigation15, { type Navigation15Link } from "@/components/blocks/navigation-15";
import { contact, menu } from "@/constants/data";
import type { ProductMenu } from "@/constants/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "./icons";

/**
 * The site's header through the repo's navigation-15 block, white on every page (the home page too since 2026-11-10). "Нүүр"
 * first, then the menu's pages; "Холбоо барих" is the button instead. Products opens a panel with the categories and
 * one featured product; the phone drawer ends with the phones and the email.
 */
export function Header({ productMenu }: { productMenu: ProductMenu }) {
  const links: Navigation15Link[] = [
    { title: "Нүүр", href: "/" },
    ...menu.filter((item) => item.href !== "/contact"),
  ].map((item) =>
    item.href === "/products"
      ? { ...item, panel: (close: () => void) => <ProductsPanel menu={productMenu} onPick={close} /> }
      : item,
  );

  return (
    <Navigation15
      logo={
        // the logo drawn white on the night bar, in its own colours on the light one; it never shrinks
        <Image
          src="/images/logo.png"
          alt="Есөн Бэлчир ХХК"
          width={1297}
          height={192}
          priority
          className="h-6 w-auto max-w-none brightness-0 invert light:brightness-100 light:invert-0"
        />
      }
      links={links}
      cta={{ label: "Холбоо барих", href: "/contact" }}
      labels={{
        nav: "Үндсэн цэс",
        open: "Цэс нээх",
        close: "Цэс хаах",
        skip: "Агуулга руу шилжих",
        menu: "Цэс",
        contact: "Холбоо барих",
      }}
      drawerFoot={
        <div className="mt-2 grid">
          {[contact.phone, contact.phone2].map((phone) => (
            <a
              key={phone}
              href={`tel:${phone}`}
              className="inline-flex min-h-11 items-center text-base font-medium tabular-nums transition-colors duration-200 hover:text-white/60 light:hover:text-ink/60"
            >
              {phone}
            </a>
          ))}
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex min-h-11 items-center text-base font-medium transition-colors duration-200 hover:text-white/60 light:hover:text-ink/60"
          >
            {contact.email}
          </a>
        </div>
      }
    />
  );
}

// the footer's label: small mono capitals
const label = "font-mono text-[11px] uppercase tracking-[0.16em] text-white/60 light:text-ink/60";

/** The products panel, a card under the bar as wide as it: the categories (each with its count) in two columns and
 *  the link to the whole catalog on the left; on the right the featured product as a card, its photo on white. */
function ProductsPanel({ menu, onPick }: { menu: ProductMenu; onPick: () => void }) {
  const { featured } = menu;
  return (
    <div className="rounded-[28px] border border-white/10 bg-night/95 text-white shadow-[0_28px_50px_-20px_rgb(0_0_0/0.75)] backdrop-blur-xl light:border-ink/10 light:bg-white/95 light:text-ink light:shadow-[0_28px_50px_-24px_rgb(11_16_32/0.3)]">
      <div className="grid grid-cols-12 gap-8 p-8">
        <div className="col-span-7">
          <p className={label}>Ангилал</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-8">
            {menu.categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?category=${category.id}`}
                  onClick={onPick}
                  className="-mx-4 flex min-h-11 items-center justify-between gap-4 rounded-full px-4 py-2.5 text-base font-medium transition-colors duration-200 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white light:hover:bg-ink/[0.045] light:focus-visible:outline-brand"
                >
                  {category.label}
                  <span className="text-sm tabular-nums text-white/50 light:text-ink/50">{category.count}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            onClick={onPick}
            className="group mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline decoration-white/30 decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white light:decoration-ink/30 light:hover:decoration-ink light:focus-visible:outline-brand"
          >
            Бүх бүтээгдэхүүн ({menu.total})
            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
          </Link>
        </div>

        <Link
          href={`/products/${featured.slug}`}
          onClick={onPick}
          className="group col-span-5 grid grid-cols-[minmax(0,11rem)_1fr] items-center gap-6 rounded-[20px] bg-white/[0.05] p-4 transition-colors duration-200 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white light:bg-ink/[0.035] light:hover:bg-ink/[0.06] light:focus-visible:outline-brand"
        >
          <span className="relative block aspect-square overflow-hidden rounded-[14px] bg-white">
            <Image
              src={featured.image}
              alt=""
              fill
              sizes="11rem"
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </span>
          <span className="min-w-0">
            <span className="inline-block rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-night light:bg-ink light:text-white">
              Онцлох бүтээгдэхүүн
            </span>
            <span className="mt-3 block text-sm font-semibold text-white/60 light:text-ink/60">{featured.brand}</span>
            <span className="mt-1 block text-pretty text-lg font-semibold leading-snug tracking-[-0.01em]">
              {featured.title}
            </span>
            <span className="mt-1 block text-sm text-white/60 light:text-ink/60">{featured.name}</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-white/30 decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 group-hover:decoration-white light:decoration-ink/30 light:group-hover:decoration-ink">
              Дэлгэрэнгүй
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
