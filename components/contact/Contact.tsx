"use client";
import StaggeredText from "@/components/react-bits/staggered-text";
import { contact, places } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Building2, Factory, Mail, MapPin, Phone } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type KeyboardEvent } from "react";

type PlaceId = (typeof places)[number]["id"];

const icons = { office: Building2, factory: Factory } satisfies Record<PlaceId, unknown>;

// a row of a place's card: an icon in a round well, then a small label over the value
const row = "flex min-h-16 items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5";
const well = "grid size-10 shrink-0 place-items-center rounded-full bg-ink/[0.05] text-ink/70";
const rowLink = `group ${row} transition-colors duration-200 hover:bg-ink/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand`;
const arrow =
  "size-4 shrink-0 text-ink/40 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px";

/** The contact page on white: the heading with one line beside it, then the office and the factory as two tabs in the
 *  middle, each with its address, the phones and the email beside its map. */
export function Contact() {
  return (
    <section aria-labelledby="contact-title" className="bg-white text-ink">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-32 lg:pt-20">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1
            id="contact-title"
            className="text-balance text-[clamp(2.5rem,1.3rem+3.4vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] lg:col-span-7"
          >
            <StaggeredText
              as="span"
              text="Холбоо барих"
              delay={60}
              duration={0.8}
              easing={[0.16, 1, 0.3, 1]}
              from={{ opacity: 0, y: 14 }}
              to={{ opacity: 1, y: 0 }}
              className="block"
            />
          </h1>
          <p className="max-w-[42ch] text-pretty text-step-body leading-[1.65] text-ink/70 lg:col-span-4 lg:col-start-9">
            Оффис болон үйлдвэрийн хаяг, утас, байршил.
          </p>
        </div>

        {/* The place on show comes from ?place=, so the footer's map links can open either. The static page and the
            first paint show the office with its map's ground; the URL's place takes over once it is read. */}
        <Suspense fallback={<Places place="office" maps={false} />}>
          <PlacesFromUrl />
        </Suspense>
      </div>
    </section>
  );
}

function PlacesFromUrl() {
  const place: PlaceId = useSearchParams().get("place") === "factory" ? "factory" : "office";
  return <Places place={place} />;
}

/** The two tabs and their panels. A tab rewrites the URL in place (Next keeps useSearchParams in step), so the page
 *  can be shared open on either place. A place's map loads the first time its tab opens (a map loaded while its panel
 *  is hidden starts at no size and loses its pin) and then stays, so it does not load again. */
function Places({ place, maps = true }: { place: PlaceId; maps?: boolean }) {
  const [opened, setOpened] = useState<PlaceId[]>([place]);
  if (!opened.includes(place)) setOpened([...opened, place]);

  const select = (id: PlaceId) =>
    window.history.replaceState(null, "", id === "office" ? window.location.pathname : `?place=${id}`);

  // arrows, Home and End move between the tabs, as in the WAI-ARIA tabs pattern
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const at = places.findIndex((p) => p.id === place);
    const moves: Partial<Record<string, number>> = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: places.length - 1 };
    const to = moves[event.key];
    if (to === undefined) return;
    event.preventDefault();
    const next = places[(to + places.length) % places.length].id;
    select(next);
    document.getElementById(`tab-${next}`)?.focus();
  }

  return (
    <MotionConfig reducedMotion="user">
      <div id="location" className="mt-12 scroll-mt-24 lg:mt-16">
        <div role="tablist" aria-label="Байршил" className="mx-auto flex w-fit gap-1 rounded-full bg-ink/[0.05] p-1">
          {places.map(({ id, label }) => {
            const on = id === place;
            const Icon = icons[id];
            return (
              <button
                key={id}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`panel-${id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(id)}
                onKeyDown={onKeyDown}
                className={cn(
                  "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-7",
                  on ? "text-white" : "text-ink/65 hover:text-ink",
                )}
              >
                {/* the ink pill slides to the chosen tab */}
                {on && (
                  <motion.span
                    layoutId="place-tab"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                  />
                )}
                <Icon aria-hidden className="relative size-4" />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        {places.map(({ id, label, lines, pin: [lat, lng] }) => (
          <div
            key={id}
            id={`panel-${id}`}
            role="tabpanel"
            aria-labelledby={`tab-${id}`}
            hidden={id !== place}
            className="mt-8 grid animate-in gap-4 duration-300 fade-in lg:mt-10 lg:grid-cols-12 lg:gap-8"
          >
            <div className="flex flex-col rounded-[24px] bg-ink/[0.035] p-2 lg:col-span-5">
              <h2 className="px-4 pb-4 pt-3 text-[clamp(1.5rem,1.2rem+0.9vw,2rem)] font-semibold leading-tight tracking-[-0.025em] sm:px-5">
                {label}
              </h2>
              <ul className="divide-y divide-ink/[0.08] overflow-hidden rounded-[18px] bg-white">
                <li className={row}>
                  <span className={well}>
                    <MapPin aria-hidden className="size-4" />
                  </span>
                  <p>
                    <span className="block text-sm text-ink/55">Хаяг</span>
                    <span className="block font-semibold leading-snug">{lines.join(", ")}</span>
                  </p>
                </li>
                {[contact.phone, contact.phone2].map((phone) => (
                  <li key={phone}>
                    <a href={`tel:${phone}`} className={rowLink}>
                      <span className={well}>
                        <Phone aria-hidden className="size-4" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm text-ink/55">Утас</span>
                        <span className="block text-lg font-semibold tabular-nums tracking-[-0.01em]">{phone}</span>
                      </span>
                      <ArrowUpRight aria-hidden className={arrow} />
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${contact.email}`} className={rowLink}>
                    <span className={well}>
                      <Mail aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-ink/55">Имэйл</span>
                      <span className="block font-semibold [overflow-wrap:anywhere]">{contact.email}</span>
                    </span>
                    <ArrowUpRight aria-hidden className={arrow} />
                  </a>
                </li>
              </ul>
              <div className="mt-auto px-2 pb-2 pt-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat}%2C${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label}: чиглэл авах (шинэ цонхонд нээгдэнэ)`}
                  className="group flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-ink px-5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-ink/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Чиглэл авах
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                </a>
              </div>
            </div>

            {/* Google's keyless embed of the pin */}
            <div className="relative h-[22rem] overflow-hidden rounded-[24px] bg-ink/[0.04] sm:h-[28rem] lg:col-span-7 lg:h-auto lg:min-h-[28rem]">
              {maps && opened.includes(id) && (
                <iframe
                  title={`${label}: байршил Google Maps дээр`}
                  src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=mn&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 size-full border-0"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </MotionConfig>
  );
}
