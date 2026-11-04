"use client";
import { contact, menu } from "@/constants/data";
import { rise, stagger } from "@/lib/reveal";
import { ArrowUpRight } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { Facebook } from "./FacebookIcon";
import Image from "next/image";
import Link from "next/link";

// fit: per-logo scale for files with large built-in margins.
const partners: { name: string; image: string; href: string; fit?: string }[] = [
  { name: "KANION", image: "/images/kanon.webp", href: "https://www.kanionco.com/" },
  { name: "AUX", image: "/images/aux.png", href: "https://www.auxcool.com" },
  { name: "BALLU", image: "/images/ballu.png", href: "https://www.ballu.ru/" },
  { name: "SHUFT", image: "/images/shuft.png", href: "https://www.shuft.com/" },
  { name: "AIRONN", image: "/images/aironn.png", href: "https://www.aironn.com.tr/" },
  { name: "LAVFILL", image: "/images/lavfill.jpg", href: "https://lavfill.en.alibaba.com/", fit: "scale-[2.2]" },
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
const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand";

const Footer = () => (
  <>
    <Partners />
    <FooterView />
  </>
);

function Partners() {
  return (
    <section aria-labelledby="partners-title" className="bg-white py-24 text-ink lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-10 lg:grid-cols-12 lg:gap-8"
        >
          <div className="lg:col-span-4">
            <motion.p variants={rise} className={`${label} text-brand`}>
              Түнш брэндүүд
            </motion.p>
            <motion.h2
              id="partners-title"
              variants={rise}
              className="mt-5 text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-semibold leading-none tracking-[-0.04em]"
            >
              Албан ёсны 6 түнш
            </motion.h2>
            <motion.p variants={rise} className="mt-5 max-w-[40ch] text-step-body leading-relaxed">
              Хөргөлт, агаар сэлгэлтийн төхөөрөмжийг үйлдвэрлэгчээс нь шууд
              нийлүүлдэг.
            </motion.p>
          </div>
          <motion.ul
            variants={rise}
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-8"
          >
            {partners.map((partner) => (
              <li key={partner.name}>
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${partner.name} (шинэ цонхонд нээгдэнэ)`}
                  className={`group grid aspect-[3/2] place-items-center bg-panel p-8 transition-colors hover:bg-[#dfe2e7] ${linkFocus}`}
                >
                  {/* multiply drops the white ground some logo files carry */}
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={320}
                    height={160}
                    sizes="(min-width: 1024px) 18vw, 40vw"
                    className={`max-h-16 w-auto object-contain mix-blend-multiply grayscale transition-[filter] duration-500 group-hover:grayscale-0 ${partner.fit ?? ""}`}
                  />
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

// The panel's raised shoulders (after footer-2): it rises into the photo at both corners and dips between them.
const SHOULDER = "M0 0H451.601C467.78 0 483.071 7.75893 491.954 21.2815C558.518 122.612 538.359 153.074 614 153H0V0Z";

function Shoulder({ right = false }: { right?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 614 153"
      className={`absolute top-px z-10 h-auto w-[min(250px,32vw)] -translate-y-full fill-ink ${right ? "right-0 -scale-x-100" : "left-0"}`}
    >
      <path d={SHOULDER} />
    </svg>
  );
}

// Confirmed by the client (PRODUCT.md); they close the page as the company's credentials.
const credentials = ["2011 оноос", "БХБЯ-ны тусгай зөвшөөрөлтэй", "150+ объект"];

function FooterView() {
  return (
    // the entrances keep their fade but drop the rise for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
      <footer id="footer" className="relative overflow-hidden bg-ink text-white">
        {/* Ductwork the company installed: the photo shows only above the panel and between its shoulders. */}
        <div className="absolute inset-0">
          <Image src="/images/banner.webp" alt="" fill sizes="100vw" className="object-cover object-[50%_35%]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(11_16_32/0.05),rgb(11_16_32/0.5)_60%)]" />
        </div>

        <div className="relative">
          <div className="h-32 sm:h-40 md:h-52" />

          <div className="relative bg-ink">
            <Shoulder />
            <Shoulder right />

            <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pt-16">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <motion.p
                  variants={rise}
                  className="text-[clamp(2.75rem,1.5rem+5vw,6rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
                >
                  Есөн Бэлчир
                </motion.p>
                <motion.h2
                  variants={rise}
                  className="mt-4 text-[clamp(1.25rem,1rem+1vw,1.875rem)] font-medium tracking-[-0.02em] text-white/80"
                >
                  Төслөө бидэнтэй ярилцъя.
                </motion.h2>
                <motion.div
                  variants={rise}
                  className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
                >
                  <Link
                    href="/contact"
                    className={`group inline-flex items-center gap-3 bg-white px-6 py-4 ${label} text-ink transition-colors hover:bg-brand hover:text-white active:scale-[0.98] ${linkFocus}`}
                  >
                    Инженертэй холбогдох
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={`tel:${contact.phone}`}
                    className={`${label} underline decoration-1 underline-offset-[6px] transition-colors hover:text-white/70 ${linkFocus}`}
                  >
                    {contact.phone}
                  </a>
                  <span aria-hidden className="text-white/30 max-sm:hidden">
                    —
                  </span>
                  {/* an address reads better in its own case than in capitals */}
                  <a
                    href={`mailto:${contact.email}`}
                    className={`font-mono text-xs tracking-[0.04em] underline decoration-1 underline-offset-[6px] transition-colors hover:text-white/70 ${linkFocus}`}
                  >
                    {contact.email}
                  </a>
                </motion.div>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-10 text-step-small lg:mt-20 lg:grid-cols-4"
              >
                <motion.div variants={rise}>
                  <p className={`${label} text-white/50`}>Утас</p>
                  <ul className="mt-3 space-y-1">
                    {[contact.phone, contact.phone2].map((phone) => (
                      <li key={phone}>
                        <a href={`tel:${phone}`} className={`transition-colors hover:text-white/70 ${linkFocus}`}>
                          {phone}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className={`mt-6 ${label} text-white/50`}>Цагийн хуваарь</p>
                  <p className="mt-3 leading-relaxed">
                    Даваа – Бямба
                    <br />
                    9:00 – 19:00
                  </p>
                </motion.div>
                {places.map((place) => (
                  <motion.div key={place.label} variants={rise}>
                    <p className={`${label} text-white/50`}>{place.label}</p>
                    <a
                      href={place.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group mt-3 block leading-relaxed transition-colors hover:text-white/70 ${linkFocus}`}
                    >
                      {place.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                      <span className={`mt-1 inline-flex items-center gap-1 ${label} text-white/50 group-hover:text-white`}>
                        Газрын зураг
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </a>
                  </motion.div>
                ))}
                <motion.nav variants={rise} aria-label="Footer цэс">
                  <p className={`${label} text-white/50`}>Цэс</p>
                  <ul className="mt-3 grid grid-cols-1 gap-y-1">
                    {menu.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className={`transition-colors hover:text-white/70 ${linkFocus}`}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.nav>
              </motion.div>

              <div
                className={`mt-16 flex flex-col-reverse items-center gap-6 border-t border-white/10 pt-8 text-center ${label} text-white/50 sm:flex-row sm:items-end sm:justify-between sm:text-left`}
              >
                <div className="flex items-center gap-5">
                  <span>© {new Date().getFullYear()} Есөн Бэлчир ХХК</span>
                  <a
                    href={contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook (шинэ цонхонд нээгдэнэ)"
                    className={`text-white/70 transition-colors hover:text-white ${linkFocus}`}
                  >
                    <Facebook className="size-5" />
                  </a>
                </div>
                <ul className="space-y-1 sm:text-right">
                  {credentials.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}

export { Footer };
