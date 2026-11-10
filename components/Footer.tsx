"use client";
import CTA3 from "@/components/blocks/cta-3";
import { CoolIcon, Glyph, ServiceIcon, VentIcon } from "@/components/home/ServiceIcons";
import { brands, type Brand } from "@/constants/brands";
import { contact, menu, places } from "@/constants/data";
import { rise, stagger } from "@/lib/reveal";
import { ArrowUpRight, Clock, Mail, Phone } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Three of the engineers (the team page's photos) beside "who answers" under the closing call.
const engineers = [
  "/images/member2.jpg",
  "/images/member3.jpg",
  "/images/member4.jpg",
];

const label = "font-mono text-[11px] uppercase tracking-[0.16em]";
// white rings on night (brand blue is too dark to see there), brand rings on white
const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white light:focus-visible:outline-brand";
// the house's secondary link: underlined in white 30%, full white under the pointer
const underlined = `text-white underline decoration-white/30 decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-white light:text-ink light:decoration-ink/30 light:hover:decoration-ink ${linkFocus}`;

const Footer = () => {
  const path = usePathname();
  return (
    // white on every page, the home page included (the `light` variant in globals.css)
    <div className="light">
      {/* the partners' orbit on the home page only (2026-11-10, at the user's request) */}
      {path === "/" && <Partners />}
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

// the close's contact links: outlined pills, brighter under the pointer
const chip = `inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-medium text-white/85 transition-colors duration-200 hover:border-white/40 hover:text-white light:border-ink/15 light:text-ink/80 light:hover:border-ink/40 light:hover:text-ink ${linkFocus}`;

// links on night: a step brighter and underlined under the pointer, never dimmer
const textLink = `text-white/80 underline decoration-transparent decoration-1 underline-offset-[5px] transition-[color,text-decoration-color] duration-200 hover:text-white hover:decoration-white/50 light:text-ink/80 light:hover:text-ink light:hover:decoration-ink/40 ${linkFocus}`;

function FooterView() {
  return (
    // the entrances keep their fade but drop the rise for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
      <footer
        id="footer"
        className="bg-night text-white light:bg-white light:text-ink"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* The close through the repo's cta-3 block: the subject's three icons over the turning rings, the statement,
              its line and the button, then who answers and how to reach them. */}
          <div className="relative overflow-hidden border-t border-white/10 pb-20 pt-32 lg:pb-28 lg:pt-40 light:border-ink/10">
            <CTA3
              title={"Төслөө\nхамтдаа ярилцъя."}
              text="Агаар сэлгэлт, хөргөлтийн системийг зураг төслөөс угсралт, засвар үйлчилгээ хүртэл нэг дор хийнэ."
              action={{ label: "Инженертэй холбогдох", href: "/contact" }}
              tiles={({ seen, active, reduced }) => [
                // the home page's service icons, drawn in once seen and moving while in view: air, the engineer's
                // wrench working a bolt, cooling
                <Glyph key="vent" seen={seen} active={active} reduced={reduced} className="size-full">
                  <VentIcon seen={seen} reduced={reduced} />
                </Glyph>,
                <Glyph key="service" seen={seen} active={active} reduced={reduced} className="size-full">
                  <ServiceIcon seen={seen} reduced={reduced} />
                </Glyph>,
                <Glyph key="cool" seen={seen} active={active} reduced={reduced} className="size-full">
                  <CoolIcon seen={seen} reduced={reduced} />
                </Glyph>,
              ]}
            >
              <div className="mt-12 flex flex-col items-center gap-5">
                <div className="flex items-center gap-3">
                  <div aria-hidden className="flex shrink-0 -space-x-3">
                    {engineers.map((src) => (
                      // the ring is the footer's own ground, so the faces read as cut apart
                      <Image
                        key={src}
                        src={src}
                        alt=""
                        width={80}
                        height={80}
                        sizes="40px"
                        className="size-10 rounded-full object-cover object-[50%_20%] ring-[3px] ring-night light:ring-white"
                      />
                    ))}
                  </div>
                  <p className="text-pretty text-left text-sm font-medium leading-snug text-white/80 light:text-ink/75">
                    Таны асуултад инженер маань хариулна
                  </p>
                </div>
                <ul className="flex flex-wrap justify-center gap-2">
                  {[contact.phone, contact.phone2].map((phone) => (
                    <li key={phone}>
                      <a href={`tel:${phone}`} className={`${chip} tabular-nums`}>
                        <Phone aria-hidden className="size-4" />
                        {phone}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={`mailto:${contact.email}`} className={chip}>
                      <Mail aria-hidden className="size-4" />
                      {contact.email}
                    </a>
                  </li>
                  <li className="inline-flex min-h-11 items-center gap-2 px-4 text-sm font-medium text-white/80 light:text-ink/75">
                    <Clock aria-hidden className="size-4" />
                    Даваа – Бямба
                    <span className="tabular-nums text-white/55 light:text-ink/55">9:00 – 19:00</span>
                  </li>
                </ul>
              </div>
            </CTA3>
          </div>

          {/* the two places and the menu, three columns at lg; below wide the room under them keeps the menu clear
              of the contact bar at the foot of the screen */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-x-8 gap-y-12 border-t border-white/10 py-14 pb-28 text-base leading-relaxed sm:grid-cols-2 lg:grid-cols-3 lg:pt-16 wide:pb-16 light:border-ink/10"
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
                  className={`group mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-[border-color,transform] duration-200 hover:border-white/60 active:scale-[0.98] light:border-ink/25 light:text-ink light:hover:border-ink/60 ${linkFocus}`}
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
