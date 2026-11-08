"use client";
import { contact, menu } from "@/constants/data";
import { rise, stagger } from "@/lib/reveal";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import type { CSSProperties } from "react";
import { Facebook } from "./FacebookIcon";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// fit: per-logo scale for files with large built-in margins.
const partners: { name: string; image: string; href: string; fit?: string }[] = [
  { name: "KANION", image: "/images/kanon.webp", href: "https://www.kanionco.com/", fit: "scale-[1.15]" },
  { name: "AUX", image: "/images/aux.png", href: "https://www.auxcool.com" },
  { name: "BALLU", image: "/images/ballu.png", href: "https://www.ballu.ru/" },
  { name: "SHUFT", image: "/images/shuft.png", href: "https://www.shuft.com/", fit: "scale-[1.4]" },
  { name: "AIRONN", image: "/images/aironn.png", href: "https://www.aironn.com.tr/", fit: "scale-[1.2]" },
  { name: "LAVFILL", image: "/images/lavfill.jpg", href: "https://lavfill.en.alibaba.com/", fit: "scale-[1.6]" },
];

const places = [
  {
    label: "Оффис",
    lines: ["Хан-Уул дүүрэг, 15-р хороо", "Наадам центр, 2 давхар"],
    href: "https://maps.app.goo.gl/WNwFbL8zdkjAG2sG8?g_st=ic",
  },
  {
    label: "Үйлдвэр",
    lines: ["Хан-Уул дүүрэг, 10-р хороо", "Морингийн зам 42"],
    href: "https://www.google.com/maps/place/Есөн+Бэлчир+ХХК+үйлдвэр+%2FFactory%2F/@47.856987,106.7556404,344m/data=!3m1!1e3!4m6!3m5!1s0x5d96eb00274f4edd:0x1877f58312c82a8c!8m2!3d47.8570456!4d106.7557945!16s%2Fg%2F11vs7nhrgh?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D",
  },
];

const label = "font-mono text-[11px] uppercase tracking-[0.16em]";
// white rings on night (brand blue is too dark to see there), brand rings on white
const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white light:focus-visible:outline-brand";

const Footer = () => (
  // night on the home page, white everywhere else (the `light` variant in globals.css)
  <div className={usePathname() === "/" ? undefined : "light"}>
    <Partners />
    <FooterView />
  </div>
);

function Partners() {
  return (
    <section aria-labelledby="partners-title" className="bg-night py-24 text-white lg:py-32 light:bg-white light:text-ink">
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
            <motion.p variants={rise} className="mt-5 max-w-[40ch] text-pretty text-step-body leading-relaxed text-white/75 light:text-ink/75">
              Хөргөлт, агаар сэлгэлтийн төхөөрөмжийг үйлдвэрлэгчээс нь шууд
              нийлүүлдэг.
            </motion.p>
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
 *  overflow-clip cuts them (and leaves a focus ring's width spare). */
function PartnerOrbit() {
  return (
    <div className="orbit relative mx-auto aspect-square w-full max-w-[36rem] overflow-clip [overflow-clip-margin:0.5rem] [--chip:clamp(4.5rem,3rem+6vw,5.5rem)] lg:max-w-[46rem] lg:[--chip:clamp(5.5rem,1rem+6vw,7rem)]">
      <div aria-hidden className="absolute inset-[calc(var(--chip)/2)] rounded-full border border-dashed border-white/20 light:border-ink/20" />
      <div aria-hidden className="absolute inset-1/4 rounded-full border border-dashed border-white/20 light:border-ink/20" />
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
          className="h-auto w-[58%] brightness-0 invert light:brightness-100 light:invert-0"
        />
      </div>
      <ul className="absolute inset-0">
        {partners.map((partner, i) => {
          // every other logo moves to the inner ring at lg, where it turns the other way
          const inner = i % 2 === 1;
          return (
            <li
              key={partner.name}
              style={{ "--a": `${i * 60}deg` } as CSSProperties}
              className={`orbit-turn pointer-events-none absolute inset-0 animate-[orbit_90s_linear_infinite] [transform:rotate(var(--a))] ${inner ? "lg:animate-[orbit_60s_linear_infinite_reverse]" : ""}`}
            >
              <a
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${partner.name} (шинэ цонхонд нээгдэнэ)`}
                className={`orbit-turn group pointer-events-auto absolute left-1/2 top-[calc(var(--chip)/2)] grid size-[var(--chip)] -translate-x-1/2 -translate-y-1/2 animate-[orbit_90s_linear_infinite_reverse] place-items-center rounded-full bg-white transition-shadow duration-200 [transform:rotate(calc(var(--a)*-1))] hover:shadow-[0_0_0_6px_rgb(255_255_255/0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white light:border light:border-ink/10 light:hover:shadow-[0_0_0_6px_rgb(11_16_32/0.06)] light:focus-visible:outline-brand ${inner ? "lg:top-1/4 lg:animate-[orbit_60s_linear_infinite]" : ""}`}
              >
                {/* multiply drops the white ground some logo files carry */}
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={300}
                  height={200}
                  sizes="7rem"
                  className={`h-[46%] w-[70%] object-contain mix-blend-multiply grayscale transition-[filter] duration-500 group-hover:grayscale-0 ${partner.fit ?? ""}`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// The ductwork photo the company installed (5817px, 8.9MB), served by Next's optimizer at the screen's density as an
// image-set, so the name's letters can show it.
const ductSet = getImageProps({ src: "/images/banner.webp", alt: "", width: 1280, height: 852 }).props.srcSet ?? "";
const ductwork = `image-set(${ductSet
  .split(", ")
  .map((candidate) => {
    const [url, density] = candidate.split(" ");
    return `url("${url}") ${density}`;
  })
  .join(", ")})`;

// Confirmed by the client (PRODUCT.md); they close the page as the company's credentials.
const credentials = ["2011 оноос", "БХБЯ-ны тусгай зөвшөөрөлтэй", "150+ объект"];

// links on night: a step brighter and underlined under the pointer, never dimmer
const textLink = `text-white/80 underline decoration-transparent decoration-1 underline-offset-[5px] transition-[color,text-decoration-color] duration-200 hover:text-white hover:decoration-white/50 light:text-ink/80 light:hover:text-ink light:hover:decoration-ink/40 ${linkFocus}`;

/** Back to the top of a long page, instantly for visitors who ask for less motion. */
function BackToTop() {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        })
      }
      className={`group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white light:text-ink/70 light:hover:text-ink ${linkFocus}`}
    >
      Дээш
      <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}

function FooterView() {
  return (
    // the entrances keep their fade but drop the rise for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
      <footer id="footer" className="overflow-hidden bg-night text-white light:bg-white light:text-ink">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* The closing statement, set like the hero's steps: two lines with the second set in, a rule with the line
              beside it, and the actions under the rule. The block's font size is the heading's, so the set-in line,
              the rule and the actions all align on 0.9em. */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="border-t border-white/10 py-20 text-[clamp(2.5rem,1.1rem+4.2vw,6rem)] lg:py-28 light:border-ink/10"
          >
            <motion.h2 variants={rise} className="font-semibold leading-[0.95] tracking-[-0.035em]">
              Төслөө
              <span className="block pl-[0.9em]">бидэнтэй ярилцъя.</span>
            </motion.h2>
            <motion.div variants={rise} className="mt-[0.4em] flex items-start gap-5 pl-[0.9em]">
              <span aria-hidden className="mt-[0.85rem] h-px w-12 shrink-0 bg-white/60 sm:mt-[0.95rem] sm:w-16 light:bg-ink/60" />
              <p className="max-w-[38ch] text-pretty text-step-body leading-[1.55] text-white/80 light:text-ink/80">
                Агаар сэлгэлт, хөргөлтийн системийг зураг төслөөс угсралт, засвар үйлчилгээ хүртэл нэг дор хийнэ.
              </p>
            </motion.div>
            <motion.div
              variants={rise}
              className="mt-[0.45em] flex flex-wrap items-center gap-x-6 gap-y-3 pl-[0.9em]"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-[3px] bg-white px-5 py-3 text-xs font-semibold text-night transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white light:bg-ink light:text-white light:hover:bg-ink/85 light:focus-visible:outline-brand"
              >
                Инженертэй холбогдох
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
              </Link>
              <a
                href={`tel:${contact.phone}`}
                className={`text-xs font-medium text-white/85 transition-colors hover:text-white light:text-ink/80 light:hover:text-ink ${linkFocus}`}
              >
                {contact.phone}
              </a>
            </motion.div>
          </motion.div>

          {/* contact, the two places and the menu, four columns at lg */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-x-8 gap-y-12 border-t border-white/10 py-14 text-base leading-relaxed sm:grid-cols-2 lg:grid-cols-4 lg:py-16 light:border-ink/10"
          >
            <motion.div variants={rise}>
              <p className={`${label} text-white/50 light:text-ink/55`}>Холбоо барих</p>
              <ul className="mt-4 space-y-1">
                {[contact.phone, contact.phone2].map((phone) => (
                  <li key={phone}>
                    <a href={`tel:${phone}`} className={`${textLink} tabular-nums`}>
                      {phone}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${contact.email}`} className={textLink}>
                    {contact.email}
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-white/55 light:text-ink/60">Даваа – Бямба, 9:00 – 19:00</p>
            </motion.div>
            {places.map((place) => (
              <motion.div key={place.label} variants={rise}>
                <p className={`${label} text-white/50 light:text-ink/55`}>{place.label}</p>
                <p className="mt-4 text-white/80 light:text-ink/80">
                  {place.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <a
                  href={place.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${place.label}: газрын зураг (шинэ цонхонд нээгдэнэ)`}
                  className={`group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white underline decoration-white/30 decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-200 hover:decoration-white light:text-ink light:decoration-ink/30 light:hover:decoration-ink ${linkFocus}`}
                >
                  Газрын зураг
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                </a>
              </motion.div>
            ))}
            <motion.nav variants={rise} aria-label="Footer цэс">
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

          <div
            className={`flex flex-col gap-5 border-t border-white/10 py-6 ${label} text-white/50 lg:flex-row lg:items-center lg:justify-between light:border-ink/10 light:text-ink/55`}
          >
            <p>© {new Date().getFullYear()} Есөн Бэлчир ХХК</p>
            <ul aria-label="Итгэмжлэл" className="flex flex-wrap gap-x-6 gap-y-2">
              {credentials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="flex items-center gap-6">
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook (шинэ цонхонд нээгдэнэ)"
                className={`text-white/70 transition-colors hover:text-white light:text-ink/70 light:hover:text-ink ${linkFocus}`}
              >
                <Facebook className="size-5" />
              </a>
              <BackToTop />
            </div>
          </div>

          {/* The name across the frame, its letters cut from the ductwork photo (the band of spiral ducts above the
              lamp) and fading into the ground. Sized in container units: the name is 5.83em wide at -0.04em, so 16.9cqw
              fills the frame (98.5%) at every width. */}
          <div aria-hidden className="@container select-none">
            <p
              style={{ backgroundImage: ductwork }}
              className="whitespace-nowrap bg-cover bg-clip-text bg-[position:50%_35%] text-center text-[16.9cqw] font-semibold leading-[0.8] tracking-[-0.04em] text-transparent [mask-image:linear-gradient(to_bottom,#000_35%,transparent_95%)]"
            >
              Есөн Бэлчир
            </p>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}

export { Footer };
