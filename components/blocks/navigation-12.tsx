"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface Navigation12Link {
  title: string;
  href: string;
  /** a panel that opens under the bar while the link is pointed at or focused; it is handed a function that closes it */
  panel?: (close: () => void) => ReactNode;
}

interface Navigation12Props {
  /** the brand mark inside the home link (an image whose alt names the company) */
  logo: ReactNode;
  links: Navigation12Link[];
  cta: { label: string; href: string };
  /** the night bar (the home page) or the light one (the `light` variant everywhere else) */
  dark?: boolean;
  /** lines at the foot of the phone menu, under the button (the phones and the email) */
  menuFoot?: ReactNode;
  labels: { nav: string; open: string; close: string; skip: string };
}

const EASE = [0.22, 1, 0.36, 1] as const;

const menuStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};

const menuItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

// white rings on night, brand rings on white
const ring =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white light:focus-visible:outline-brand";

const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * The site's header: a floating pill on the page's container, 8px from the top, a hairline round it, the ground
 * behind it blurred. The logo, the page links (a pill slides to the current page), the button with its arrow; from
 * 1280px, since the links need the room. A link with a panel opens it under the bar on hover or focus (a short delay
 * lets the pointer pass over); Escape closes it and gives focus back. Below 1280px the menu button drops a card
 * under the bar with the links, the button and the foot lines. A navigation closes whatever is open.
 */
export default function Navigation12({ logo, links, cta, dark = false, menuFoot, labels }: Navigation12Props) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion() ?? false;

  // What is open belongs to the page it was opened on, so a navigation closes it without an effect.
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const menuOpen = menuAt === pathname;
  const [panelAt, setPanelAt] = useState<[string, string] | null>(null);
  const panel = panelAt && panelAt[1] === pathname ? panelAt[0] : null;

  const toggle = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const skipFocus = useRef(false); // the focus Escape hands back must not reopen the panel

  const showPanel = (href: string, delay = 80) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPanelAt([href, pathname]), delay);
  };
  const hidePanel = (delay = 160) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPanelAt(null), delay);
  };
  // handed to the panel (it renders during render, so this touches no ref); a navigation closes it anyway
  const closePanel = () => setPanelAt(null);
  // focus opens the panel at once, but not the focus Escape hands back
  const focusPanel = (href: string) => {
    if (skipFocus.current) skipFocus.current = false;
    else showPanel(href, 0);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Escape closes the phone menu or the panel and gives focus back to what opened it.
  useEffect(() => {
    if (!menuOpen && !panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (menuOpen) {
        setMenuAt(null);
        toggle.current?.focus();
        return;
      }
      window.clearTimeout(timer.current);
      setPanelAt(null);
      const link = panel ? document.querySelector<HTMLElement>(`[data-nav12-panel-link="${CSS.escape(panel)}"]`) : null;
      if (link && document.activeElement !== link) {
        skipFocus.current = true;
        link.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, panel]);

  const fade = reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 };

  return (
    <header className={cn("sticky top-0 z-50 h-[var(--header-h)] px-3 sm:px-6 lg:px-8", !dark && "light")}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-full focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-night light:focus:bg-ink light:focus:text-white"
      >
        {labels.skip}
      </a>

      <div className="relative mx-auto h-full max-w-7xl py-2">
        <div className="flex h-full items-center justify-between gap-3 rounded-full border border-white/10 bg-night/75 pl-5 pr-2 text-white shadow-[0_1px_2px_rgb(0_0_0/0.2),0_10px_30px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl light:border-ink/10 light:bg-white/80 light:text-ink light:shadow-[0_1px_2px_rgb(11_16_32/0.04),0_8px_24px_-12px_rgb(11_16_32/0.14)]">
          <Link
            href="/"
            onClick={() => setMenuAt(null)}
            className={cn("inline-flex min-h-11 shrink-0 items-center rounded-full", ring)}
          >
            {logo}
          </Link>

          <nav aria-label={labels.nav} className="hidden h-full xl:block">
            <ul className="flex h-full items-center">
              {links.map((link, index) => {
                const current = isCurrent(pathname, link.href);
                const open = panel === link.href;
                return (
                  <li
                    key={link.href}
                    className="flex h-full items-center"
                    onPointerEnter={link.panel ? () => showPanel(link.href) : undefined}
                    onPointerLeave={link.panel ? () => hidePanel() : undefined}
                    onFocus={link.panel ? () => focusPanel(link.href) : undefined}
                    onBlur={
                      link.panel
                        ? (event) => {
                            if (!event.currentTarget.contains(event.relatedTarget as Node)) hidePanel(0);
                          }
                        : undefined
                    }
                  >
                    <Link
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      {...(link.panel && {
                        "aria-expanded": open,
                        "aria-controls": `nav12-panel-${index}`,
                        "data-nav12-panel-link": link.href,
                      })}
                      className={cn(
                        "relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                        ring,
                        current || open
                          ? "text-white light:text-ink"
                          : "text-white/65 hover:text-white light:text-ink/60 light:hover:text-ink",
                      )}
                    >
                      {current && (
                        <motion.span
                          layoutId="nav12-active"
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-white/10 light:bg-ink/[0.06]"
                          transition={{ duration: 0.35, ease: EASE }}
                        />
                      )}
                      <span className="relative">{link.title}</span>
                      {link.panel && (
                        <ChevronDown
                          aria-hidden
                          className={cn("relative size-3.5 transition-transform duration-200", open && "rotate-180")}
                        />
                      )}
                    </Link>
                    {link.panel && (
                      <AnimatePresence>
                        {open && (
                          <motion.div
                            id={`nav12-panel-${index}`}
                            initial={fade}
                            animate={{ opacity: 1, y: 0 }}
                            exit={fade}
                            transition={{ duration: 0.22, ease: EASE }}
                            // the room above the card keeps the pointer inside on its way down from the link
                            className="absolute inset-x-0 top-full pt-2 text-left"
                          >
                            {link.panel(closePanel)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href={cta.href}
              aria-current={isCurrent(pathname, cta.href) ? "page" : undefined}
              className={cn(
                "group hidden items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-night transition-colors duration-200 hover:bg-white/85 sm:inline-flex light:bg-ink light:text-white light:hover:bg-ink/85",
                ring,
              )}
            >
              {cta.label}
              <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <button
              ref={toggle}
              type="button"
              onClick={() => setMenuAt(menuOpen ? null : pathname)}
              aria-expanded={menuOpen}
              aria-controls="nav12-menu"
              aria-label={menuOpen ? labels.close : labels.open}
              className={cn(
                "grid size-11 cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-white/10 light:hover:bg-ink/[0.06] xl:hidden",
                ring,
              )}
            >
              {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="nav12-menu"
              initial={fade}
              animate={{ opacity: 1, y: 0 }}
              exit={fade}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute inset-x-0 top-full pt-2 xl:hidden"
            >
              <motion.nav
                aria-label={labels.nav}
                initial="hidden"
                animate="visible"
                variants={menuStagger}
                className="max-h-[calc(100svh-var(--header-h)-1rem)] overflow-y-auto rounded-[28px] border border-white/10 bg-night/95 p-2 text-white shadow-[0_24px_48px_-16px_rgb(0_0_0/0.7)] backdrop-blur-xl light:border-ink/10 light:bg-white/95 light:text-ink light:shadow-[0_24px_48px_-20px_rgb(11_16_32/0.25)]"
              >
                <ul>
                  {links.map((link) => {
                    const current = isCurrent(pathname, link.href);
                    return (
                      <motion.li key={link.href} variants={menuItem}>
                        <Link
                          href={link.href}
                          onClick={() => setMenuAt(null)}
                          aria-current={current ? "page" : undefined}
                          className={cn(
                            "flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors duration-200",
                            ring,
                            current
                              ? "bg-white/10 light:bg-ink/[0.06]"
                              : "text-white/75 hover:bg-white/[0.06] hover:text-white light:text-ink/70 light:hover:bg-ink/[0.04] light:hover:text-ink",
                          )}
                        >
                          {link.title}
                          {current && <span aria-hidden className="size-1.5 rounded-full bg-white light:bg-ink" />}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
                <motion.div
                  variants={menuItem}
                  className="mt-2 grid gap-3 border-t border-white/10 px-2 pb-2 pt-3 light:border-ink/10"
                >
                  <Link
                    href={cta.href}
                    onClick={() => setMenuAt(null)}
                    className={cn(
                      "inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-night transition-colors duration-200 hover:bg-white/85 light:bg-ink light:text-white light:hover:bg-ink/85",
                      ring,
                    )}
                  >
                    {cta.label}
                    <ArrowRight aria-hidden className="size-3.5" />
                  </Link>
                  {menuFoot}
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
