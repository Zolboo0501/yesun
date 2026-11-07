"use client";
import { contact, menu } from "@/constants/data";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CloseIcon, MenuIcon } from "./icons";

// The page links, "Нүүр" first; "Холбоо барих" is the white button on the right instead.
const links = [{ title: "Нүүр", href: "/" }, ...menu.filter((item) => item.href !== "/contact")];
const HEADER_PX = 64; // --header-h in globals.css; the scroll stages sit under it

/**
 * A dark bar in the colour of the home page's first screen, so over the hero it reads as part of it
 * (no rule, as on a full-bleed photo); elsewhere a hairline sets it off from the page. White logo,
 * small uppercase links in the middle, the phone and one white button on the right.
 */
export function Header() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [overHero, setOverHero] = useState(true);
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const toggle = useRef<HTMLButtonElement>(null);
  const onHero = home && overHero;

  // Is the hero still under the header?
  useEffect(() => {
    if (!home) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById("home");
      if (hero) setOverHero(hero.getBoundingClientRect().bottom > HEADER_PX);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [home]);

  // The phone menu closes on Escape and gives focus back to its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 h-[var(--header-h)] border-b bg-night text-white transition-colors duration-300 ${
        onHero && !open ? "border-transparent" : "border-white/10"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-[3px] focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-night"
      >
        Агуулга руу шилжих
      </a>

      <div className="mx-auto grid h-full max-w-7xl grid-cols-[1fr_auto] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="justify-self-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {/* the logo drawn in white, as the dark bar needs */}
          <Image
            src="/images/logo.png"
            alt="Есөн Бэлчир ХХК"
            width={1297}
            height={192}
            priority
            className="h-6 w-auto brightness-0 invert sm:h-7"
          />
        </Link>

        <nav aria-label="Үндсэн цэс" className="hidden lg:block">
          <ul className="flex items-center gap-5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.06em] xl:gap-8">
            {links.map((item) => {
              const current = item.href === "/" ? home : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      current ? "text-white/45" : "text-white hover:text-white/60"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-5 justify-self-end">
          <a
            href={`tel:${contact.phone}`}
            className="hidden whitespace-nowrap text-[11px] font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white xl:inline"
          >
            {contact.phone}
          </a>
          <Link
            href="/contact"
            className="hidden items-center gap-1.5 whitespace-nowrap rounded-[3px] bg-white px-3.5 py-2 text-[11px] font-semibold text-night transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
          >
            Холбоо барих
          </Link>
          <button
            ref={toggle}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Цэс хаах" : "Цэс нээх"}
            className="-mr-2 grid size-11 place-items-center text-white transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-night lg:hidden"
          >
            <nav aria-label="Үндсэн цэс" className="flex min-h-full flex-col px-4 pb-10 pt-4 sm:px-6">
              <ul>
                {[...links, { title: "Холбоо барих", href: "/contact" }].map((item, i) => {
                  const current = item.href === "/" ? home : pathname.startsWith(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="border-b border-white/10"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={current ? "page" : undefined}
                        className={`flex items-center justify-between py-4 text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                          current ? "text-white/45" : "text-white"
                        }`}
                      >
                        {item.title}
                        <ArrowUpRight className="size-5 text-white/40" />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-auto flex flex-col gap-3 pt-12 text-sm text-white/70">
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                <a href={`tel:${contact.phone2}`}>{contact.phone2}</a>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
