"use client";
import { brands, type Brand } from "@/constants/brands";
import { contact, menu, places } from "@/constants/data";
import { rise, stagger } from "@/lib/reveal";
import { ArrowUpRight, Clock, Mail, Phone } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Three of the engineers (the team page's photos) over the closing card.
const engineers = [
  "/images/member2.jpg",
  "/images/member3.jpg",
  "/images/member4.jpg",
];

const label = "font-mono text-[11px] uppercase tracking-[0.16em]";
// white rings on night (brand blue is too dark to see there), brand rings on white
const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white light:focus-visible:outline-brand";
// the same, drawn inside, for the card's rows, which the card's rounded list clips
const rowFocus =
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white light:focus-visible:outline-brand";
// the house's secondary link: underlined in white 30%, full white under the pointer
const underlined = `text-white underline decoration-white/30 decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-white light:text-ink light:decoration-ink/30 light:hover:decoration-ink ${linkFocus}`;

const Footer = () => {
  const path = usePathname();
  return (
    // night on the home page, white everywhere else (the `light` variant in globals.css)
    <div className={path === "/" ? undefined : "light"}>
      {/* the partner page shows the brands in full, so the shared block would only repeat them there */}
      {path !== "/partner" && <Partners />}
      <FooterView />
    </div>
  );
};

function Partners() {
  return (
    <section
      aria-labelledby="partners-title"
      className="bg-night py-24 text-white lg:py-32 light:bg-white light:text-ink"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8"
        >
          <div className="lg:col-span-4">
            <motion.h2
              id="partners-title"
              variants={rise}
              className="text-balance text-[clamp(2rem,1.3rem+2.6vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
            >
              Албан ёсны 6 түнш
            </motion.h2>
            <motion.p
              variants={rise}
              className="mt-5 max-w-[40ch] text-pretty text-step-body leading-relaxed text-white/75 light:text-ink/75"
            >
              Хөргөлт, агаар сэлгэлтийн төхөөрөмжийг үйлдвэрлэгчээс нь шууд
              нийлүүлдэг.
            </motion.p>
            <motion.div variants={rise} className="mt-4">
              <Link
                href="/partner"
                className={`group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium ${underlined}`}
              >
                Бүх түнш
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
              </Link>
            </motion.div>
          </div>
          <motion.div variants={rise} className="lg:col-span-8">
            <PartnerOrbit />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** The partners orbit the company's mark on dashed rings. At lg three ride the outer ring and three the inner one,
 *  turning opposite ways; below lg all six share the outer ring, where two rings of logos would not clear each other.
 *  --chip is a logo disc's size; the outer ring runs through the discs' centres, half a disc in from the edge. The
 *  carriers are squares turned about the centre, so their corners would reach past the orbit and widen the page:
 *  overflow-clip cuts them (and leaves a focus ring's width spare). Each logo opens its brand on the partner page, and
 *  the hub names the brand pointed at or focused, with what it makes. */
function PartnerOrbit() {
  // kept through the fade-out, so the hub does not blank before it fades
  const [named, setNamed] = useState<Brand>();
  const [naming, setNaming] = useState(false);
  const name = (brand: Brand) => {
    setNamed(brand);
    setNaming(true);
  };
  const unname = () => setNaming(false);

  return (
    <div className="orbit relative mx-auto aspect-square w-full max-w-[36rem] overflow-clip [overflow-clip-margin:0.5rem] [--chip:clamp(4.5rem,3rem+6vw,5.5rem)] lg:max-w-[46rem] lg:[--chip:clamp(5.5rem,1rem+6vw,7rem)]">
      <div
        aria-hidden
        className="absolute inset-[calc(var(--chip)/2)] rounded-full border border-dashed border-white/20 light:border-ink/20"
      />
      <div
        aria-hidden
        className="absolute inset-1/4 rounded-full border border-dashed border-white/20 light:border-ink/20"
      />
      {/* the hub, drawn as the header draws the logo: on night the mark white on a dark disc with a hairline and a soft
          glow round it; on white the mark in its own colours on a white disc with the soft shade of the client's
          reference */}
      <div className="absolute left-1/2 top-1/2 grid size-[calc(var(--chip)*1.55)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 shadow-[0_0_90px_-20px_rgb(255_255_255/0.22)] light:border-ink/[0.06] light:bg-white light:shadow-[0_28px_60px_-24px_rgb(11_16_32/0.3)]">
        <Image
          src="/images/logo3.png"
          alt="Есөн Бэлчир"
          width={594}
          height={420}
          sizes="11rem"
          className={`h-auto w-[58%] brightness-0 invert transition-opacity duration-300 light:brightness-100 light:invert-0 ${naming ? "opacity-0" : ""}`}
        />
        {/* the links carry the same words, so this is for the eye only */}
        <p
          aria-hidden
          className={`absolute inset-[13%] grid place-content-center text-center transition-opacity duration-300 ${naming ? "" : "opacity-0"}`}
        >
          <span className="text-[clamp(0.8125rem,0.65rem+0.45vw,1.0625rem)] font-semibold tracking-[-0.01em]">
            {named?.name}
          </span>
          <span className="mt-1 text-pretty text-[clamp(0.625rem,0.52rem+0.3vw,0.75rem)] leading-snug text-white/65 light:text-ink/60">
            {named?.category}
          </span>
        </p>
      </div>
      <ul className="absolute inset-0">
        {brands.map((brand, i) => {
          // every other logo moves to the inner ring at lg, where it turns the other way
          const inner = i % 2 === 1;
          return (
            <li
              key={brand.slug}
              style={{ "--a": `${i * 60}deg` } as CSSProperties}
              className={`orbit-turn pointer-events-none absolute inset-0 animate-[orbit_90s_linear_infinite] [transform:rotate(var(--a))] ${inner ? "lg:animate-[orbit_60s_linear_infinite_reverse]" : ""}`}
            >
              <Link
                href={`/partner#${brand.slug}`}
                aria-label={`${brand.name}: ${brand.category}`}
                onPointerEnter={() => name(brand)}
                onPointerLeave={unname}
                onFocus={() => name(brand)}
                onBlur={unname}
                className={`orbit-turn group pointer-events-auto absolute left-1/2 top-[calc(var(--chip)/2)] size-[var(--chip)] -translate-x-1/2 -translate-y-1/2 animate-[orbit_90s_linear_infinite_reverse] rounded-full bg-white transition-shadow duration-200 [transform:rotate(calc(var(--a)*-1))] hover:shadow-[0_0_0_6px_rgb(255_255_255/0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white light:border light:border-ink/10 light:hover:shadow-[0_0_0_6px_rgb(11_16_32/0.06)] light:focus-visible:outline-brand ${inner ? "lg:top-1/4 lg:animate-[orbit_60s_linear_infinite]" : ""}`}
              >
                {/* the logo's box fills the disc and orbitScale evens the logos' sizes; multiply drops the white ground
                    some logo files carry */}
                <Image
                  src={brand.logo}
                  alt=""
                  fill
                  sizes="7rem"
                  className="object-contain mix-blend-multiply grayscale transition-[filter] duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0"
                  style={{ transform: `scale(${brand.orbitScale})` }}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// links on night: a step brighter and underlined under the pointer, never dimmer
const textLink = `text-white/80 underline decoration-transparent decoration-1 underline-offset-[5px] transition-[color,text-decoration-color] duration-200 hover:text-white hover:decoration-white/50 light:text-ink/80 light:hover:text-ink light:hover:decoration-ink/40 ${linkFocus}`;

// a row of the closing card: an icon in a round well, then the row's content; tight on phones, so the email
// keeps to one line from 360px
const row = "flex min-h-16 items-center gap-2.5 px-3 py-3 sm:gap-4 sm:px-5";
const well =
  "grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.07] text-white/80 sm:size-10 light:bg-ink/[0.05] light:text-ink/70";

/** The closing call's card: three of the engineers and who answers, then the two phones (a tap calls), the email
 *  and the hours. */
function ContactCard() {
  return (
    <motion.div
      variants={rise}
      className="rounded-[24px] bg-white/[0.04] p-2 lg:col-span-5 light:bg-ink/[0.035]"
    >
      <div className="flex items-center gap-4 px-3 pb-4 pt-3 sm:px-4">
        <div aria-hidden className="flex shrink-0 -space-x-3">
          {engineers.map((src) => (
            // the ring is the card's own ground, so the faces read as cut apart
            <Image
              key={src}
              src={src}
              alt=""
              width={88}
              height={88}
              sizes="44px"
              className="size-11 rounded-full object-cover object-[50%_20%] ring-[3px] ring-[#1f2024] light:ring-[#f7f7f8]"
            />
          ))}
        </div>
        <p className="text-pretty font-medium leading-snug">
          Таны асуултад инженер маань хариулна
        </p>
      </div>
      <ul className="divide-y divide-white/[0.08] overflow-hidden rounded-[18px] bg-white/[0.05] light:divide-ink/[0.08] light:bg-white">
        {[contact.phone, contact.phone2].map((phone) => (
          <li key={phone}>
            <a
              href={`tel:${phone}`}
              className={`group ${row} transition-colors duration-200 hover:bg-white/[0.04] light:hover:bg-ink/[0.03] ${rowFocus}`}
            >
              <span className={well}>
                <Phone aria-hidden className="size-4" />
              </span>
              <span className="flex-1 text-lg font-semibold tabular-nums tracking-[-0.01em]">
                {phone}
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 text-white/50 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px light:text-ink/45"
              />
            </a>
          </li>
        ))}
        <li className={row}>
          <span className={well}>
            <Mail aria-hidden className="size-4" />
          </span>
          <a
            href={`mailto:${contact.email}`}
            className={`min-w-0 flex-1 font-semibold underline decoration-transparent decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 text-[0.9375rem] [overflow-wrap:anywhere] hover:decoration-white/50 sm:text-lg light:hover:decoration-ink/40 ${linkFocus}`}
          >
            {contact.email}
          </a>
        </li>
        <li className={row}>
          <span className={well}>
            <Clock aria-hidden className="size-4" />
          </span>
          <p className="flex flex-1 flex-wrap gap-x-2">
            <span className="font-semibold">Даваа – Бямба</span>
            <span className="tabular-nums text-white/70 light:text-ink/65">
              9:00 – 19:00
            </span>
          </p>
        </li>
      </ul>
    </motion.div>
  );
}

function FooterView() {
  return (
    // the entrances keep their fade but drop the rise for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
      <footer
        id="footer"
        className="bg-night text-white light:bg-white light:text-ink"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* The closing statement, set like the hero's steps: two lines with the second set in, a rule with the line
              beside it, and the button under the rule; the statement's font size is the heading's, so the set-in line,
              the rule and the button all align on 0.9em. The contact card stands beside it at lg, under it below. */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-12 border-t border-white/10 py-20 lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-28 light:border-ink/10"
          >
            <div className="text-[clamp(2.5rem,1.2rem+3.4vw,5rem)] lg:col-span-7">
              <motion.h2
                variants={rise}
                className="font-semibold leading-[0.95] tracking-[-0.035em]"
              >
                Төслөө
                <span className="block pl-[0.9em]">хамтдаа ярилцъя.</span>
              </motion.h2>
              <motion.div
                variants={rise}
                className="mt-[0.4em] flex items-start gap-5 pl-[0.9em]"
              >
                <span
                  aria-hidden
                  className="mt-[0.85rem] h-px w-12 shrink-0 bg-white/60 sm:mt-[0.95rem] sm:w-16 light:bg-ink/60"
                />
                <p className="max-w-[38ch] text-pretty text-step-body leading-[1.55] text-white/80 light:text-ink/80">
                  Агаар сэлгэлт, хөргөлтийн системийг зураг төслөөс угсралт,
                  засвар үйлчилгээ хүртэл нэг дор хийнэ.
                </p>
              </motion.div>
              {/* flex, so the button's line does not take the heading's line height */}
              <motion.div
                variants={rise}
                className="mt-[0.45em] flex pl-[0.9em]"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-3 text-xs font-semibold text-night transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white light:bg-ink light:text-white light:hover:bg-ink/85 light:focus-visible:outline-brand"
                >
                  Инженертэй холбогдох
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                </Link>
              </motion.div>
            </div>
            <ContactCard />
          </motion.div>

          {/* the two places and the menu, three columns at lg; below lg the room under them keeps the menu clear
              of the contact bar at the foot of the screen */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-x-8 gap-y-12 border-t border-white/10 py-14 text-base leading-relaxed max-lg:pb-28 sm:grid-cols-2 lg:grid-cols-3 lg:py-16 light:border-ink/10"
          >
            {places.map(({ id, label: name, lines }) => (
              <motion.div key={id} variants={rise}>
                <p className={`${label} text-white/50 light:text-ink/55`}>{name}</p>
                <p className="mt-4 text-white/80 light:text-ink/80">
                  {lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                {/* the place's tab on the contact page, its map in view */}
                <Link
                  href={`/contact?place=${id}#location`}
                  aria-label={`${name}: газрын зураг`}
                  className={`group mt-4 inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-white/25 px-4 text-xs font-semibold text-white transition-[border-color,transform] duration-200 hover:border-white/60 active:scale-[0.98] light:border-ink/25 light:text-ink light:hover:border-ink/60 ${linkFocus}`}
                >
                  Газрын зураг
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                </Link>
              </motion.div>
            ))}
            <motion.nav
              variants={rise}
              aria-label="Доод цэс"
              className="sm:col-span-2 lg:col-span-1"
            >
              <p className={`${label} text-white/50 light:text-ink/55`}>Цэс</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
                {menu.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={textLink}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        </div>
      </footer>
    </MotionConfig>
  );
}

export { Footer };
