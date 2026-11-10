"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface Navigation15Link {
  title: string;
  href: string;
  /** a panel that opens under the bar while the link is pointed at or focused; it is handed a function that closes it */
  panel?: (close: () => void) => ReactNode;
}

interface Navigation15Props {
  /** the brand mark inside the home link (an image whose alt names the company) */
  logo: ReactNode;
  links: Navigation15Link[];
  cta: { label: string; href: string };
  /** the night bar (the home page) or the light one (the `light` variant everywhere else) */
  dark?: boolean;
  /** the drawer's foot under its label: the phones and the email */
  drawerFoot?: ReactNode;
  labels: { nav: string; open: string; close: string; skip: string; menu: string; contact: string };
}

const EASE = [0.22, 1, 0.36, 1] as const;

// white rings on night, brand rings on white
const ring =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white light:focus-visible:outline-brand";
const micro = "font-mono text-[11px] uppercase tracking-[0.16em] text-white/55 light:text-ink/55";

const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * The site's header, after the repo's navigation-15 block: a flat bar across the page with a hairline under it. The
 * logo, the page links (a 1px line sits under the current page and slides to the one pointed at or focused) and the
 * outlined button, which fills under the pointer; from 1280px, since the links need the room. A link with a panel
 * opens it under the bar on hover or focus; Escape closes it and gives focus back. Below 1280px the menu button opens
 * a drawer from the right (a dialog: focus moves into it and back, the page holds still behind it, Escape or the
 * backdrop closes it) with the links large, then the contacts and the button. A navigation closes whatever is open.
 */
export default function Navigation15({ logo, links, cta, dark = false, drawerFoot, labels }: Navigation15Props) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion() ?? false;

  // What is open belongs to the page it was opened on, so a navigation closes it without an effect.
  const [drawerAt, setDrawerAt] = useState<string | null>(null);
  const drawer = drawerAt === pathname;
  const [panelAt, setPanelAt] = useState<[string, string] | null>(null);
  const panel = panelAt && panelAt[1] === pathname ? panelAt[0] : null;
  const [hovered, setHovered] = useState<string | null>(null);

  const toggle = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
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
  // focus opens the panel at once, but not the focus Escape hands back
  const focusPanel = (href: string) => {
    if (skipFocus.current) skipFocus.current = false;
    else showPanel(href, 0);
  };
  // handed to the panel (it renders during render, so this touches no ref); a navigation closes it anyway
  const closePanel = () => setPanelAt(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Escape closes the panel and gives focus back to its link.
  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      window.clearTimeout(timer.current);
      setPanelAt(null);
      const link = document.querySelector<HTMLElement>(`[data-nav15-panel-link="${CSS.escape(panel)}"]`);
      if (link && document.activeElement !== link) {
        skipFocus.current = true;
        link.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);

  // The drawer: focus moves into it, the page behind holds still, Escape closes it, and it closes by itself once the
  // window is wide enough for the bar's links; focus goes back to the menu button when it closes.
  useEffect(() => {
    if (!drawer) return;
    closeButton.current?.focus();
    const button = toggle.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerAt(null);
    };
    const wide = window.matchMedia("(min-width: 1280px)");
    const onWide = (event: MediaQueryListEvent) => {
      if (event.matches) setDrawerAt(null);
    };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      button?.focus();
    };
  }, [drawer]);

  const activeHref = links.find((link) => isCurrent(pathname, link.href))?.href ?? null;
  const lined = hovered ?? panel ?? activeHref;
  const drawerStagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: reducedMotion ? 0 : 0.2 } },
  };
  const drawerItem: Variants = {
    hidden: { opacity: 0, x: reducedMotion ? 0 : 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
  };
  const fade = reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[var(--header-h)] border-b border-white/10 bg-night text-white light:border-ink/10 light:bg-white light:text-ink",
        !dark && "light",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-full focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-night light:focus:bg-ink light:focus:text-white"
      >
        {labels.skip}
      </a>

      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className={cn("inline-flex min-h-11 shrink-0 items-center rounded-sm", ring)}>
          {logo}
        </Link>

        <nav aria-label={labels.nav} className="hidden h-full xl:block">
          <ul className="flex h-full items-center gap-7" onPointerLeave={() => setHovered(null)}>
            {links.map((link, index) => {
              const current = isCurrent(pathname, link.href);
              const open = panel === link.href;
              return (
                <li
                  key={link.href}
                  className="flex h-full items-center"
                  onPointerEnter={() => {
                    setHovered(link.href);
                    if (link.panel) showPanel(link.href);
                  }}
                  onPointerLeave={link.panel ? () => hidePanel() : undefined}
                  onFocus={() => {
                    setHovered(link.href);
                    if (link.panel) focusPanel(link.href);
                  }}
                  onBlur={(event) => {
                    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
                    setHovered(null);
                    if (link.panel) hidePanel(0);
                  }}
                >
                  <Link
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    {...(link.panel && {
                      "aria-expanded": open,
                      "aria-controls": `nav15-panel-${index}`,
                      "data-nav15-panel-link": link.href,
                    })}
                    className={cn(
                      "relative inline-flex items-center gap-1 rounded-sm py-2 text-sm font-medium transition-colors duration-200",
                      ring,
                      lined === link.href ? "text-white light:text-ink" : "text-white/60 light:text-ink/60",
                    )}
                  >
                    {link.title}
                    {link.panel && (
                      <ChevronDown
                        aria-hidden
                        className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
                      />
                    )}
                    {lined === link.href && (
                      <motion.span
                        layoutId="nav15-line"
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-px bg-white light:bg-ink"
                        transition={{ duration: 0.3, ease: EASE }}
                      />
                    )}
                  </Link>
                  {link.panel && (
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          id={`nav15-panel-${index}`}
                          initial={fade}
                          animate={{ opacity: 1, y: 0 }}
                          exit={fade}
                          transition={{ duration: 0.22, ease: EASE }}
                          // under the bar across the page; the room above the card keeps the pointer inside on its way down
                          className="absolute inset-x-0 top-full text-left"
                        >
                          <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">{link.panel(closePanel)}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={cta.href}
            aria-current={isCurrent(pathname, cta.href) ? "page" : undefined}
            className={cn(
              "hidden items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white hover:text-night sm:inline-flex light:border-ink/20 light:hover:bg-ink light:hover:text-white",
              ring,
            )}
          >
            {cta.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
          <button
            ref={toggle}
            type="button"
            onClick={() => setDrawerAt(pathname)}
            aria-expanded={drawer}
            aria-controls="nav15-drawer"
            aria-label={labels.open}
            className={cn(
              "grid size-11 cursor-pointer place-items-center rounded-full border border-white/15 transition-colors duration-200 hover:bg-white/10 xl:hidden light:border-ink/15 light:hover:bg-ink/[0.05]",
              ring,
            )}
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={() => setDrawerAt(null)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-night/50 backdrop-blur-[2px] xl:hidden"
            />
            <motion.aside
              id="nav15-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={labels.menu}
              initial={reducedMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: reducedMotion ? 0.2 : 0.5, ease: EASE }}
              className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto bg-night px-6 pb-8 pt-4 text-white sm:max-w-md xl:hidden light:bg-white light:text-ink"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 light:border-ink/10">
                <Link href="/" onClick={() => setDrawerAt(null)} className={cn("inline-flex min-h-11 items-center rounded-sm", ring)}>
                  {logo}
                </Link>
                <button
                  ref={closeButton}
                  type="button"
                  onClick={() => setDrawerAt(null)}
                  aria-label={labels.close}
                  className={cn(
                    "grid size-11 cursor-pointer place-items-center rounded-full border border-white/15 transition-colors duration-200 hover:bg-white/10 light:border-ink/15 light:hover:bg-ink/[0.05]",
                    ring,
                  )}
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>

              <motion.nav initial="hidden" animate="visible" variants={drawerStagger} aria-label={labels.nav} className="mt-8 flex flex-col">
                <motion.p variants={drawerItem} className={micro}>
                  {labels.menu}
                </motion.p>
                {links.map((link) => {
                  const current = isCurrent(pathname, link.href);
                  return (
                    <motion.div key={link.href} variants={drawerItem}>
                      <Link
                        href={link.href}
                        onClick={() => setDrawerAt(null)}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "group flex items-center justify-between border-b border-white/10 py-4 light:border-ink/10",
                          ring,
                        )}
                      >
                        <span
                          className={cn(
                            "text-2xl font-semibold tracking-[-0.02em] transition-colors duration-200",
                            current
                              ? "text-white/50 light:text-ink/50"
                              : "group-hover:text-white/60 light:group-hover:text-ink/60",
                          )}
                        >
                          {link.title}
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-5 text-white/40 transition-colors duration-200 group-hover:text-white light:text-ink/40 light:group-hover:text-ink"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: reducedMotion ? 0.1 : 0.5, ease: EASE }}
                className="mt-auto pt-10"
              >
                <p className={micro}>{labels.contact}</p>
                {drawerFoot}
                <Link
                  href={cta.href}
                  onClick={() => setDrawerAt(null)}
                  className={cn(
                    "mt-6 inline-flex w-full min-h-12 items-center justify-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-night transition-colors duration-200 hover:bg-white/85 light:bg-ink light:text-white light:hover:bg-ink/85",
                    ring,
                  )}
                >
                  {cta.label}
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
