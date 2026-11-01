"use client";
import { contact, menu } from "@/constants/data";
import { rise, stagger } from "@/lib/reveal";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
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

function FooterView() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="lg:col-span-6"
          >
            <motion.p variants={rise} className={`${label} text-white/60`}>
              Холбоо барих
            </motion.p>
            <motion.h2
              variants={rise}
              className="mt-5 max-w-[14ch] text-[clamp(2.25rem,1.4rem+3.4vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
            >
              Төслөө бидэнтэй ярилцъя.
            </motion.h2>
            <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className={`group inline-flex items-center gap-3 bg-brand px-6 py-4 ${label} text-white transition-colors hover:bg-white hover:text-ink active:scale-[0.98] ${linkFocus}`}
              >
                Төсөл ярилцах
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${contact.phone}`}
                className={`${label} underline decoration-1 underline-offset-[6px] transition-colors hover:text-white/70 ${linkFocus}`}
              >
                {contact.phone}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 gap-x-8 gap-y-10 text-step-small lg:col-span-5 lg:col-start-8"
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
            </motion.div>
            <motion.div variants={rise} className="max-sm:col-span-2 max-sm:row-start-1">
              <p className={`${label} text-white/50`}>Имэйл</p>
              <a
                href={`mailto:${contact.email}`}
                className={`mt-3 block break-words transition-colors hover:text-white/70 ${linkFocus}`}
              >
                {contact.email}
              </a>
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
            <motion.div variants={rise}>
              <p className={`${label} text-white/50`}>Цагийн хуваарь</p>
              <p className="mt-3 leading-relaxed">
                Даваа – Бямба
                <br />
                9:00 – 19:00
              </p>
            </motion.div>
            <motion.nav variants={rise} aria-label="Footer цэс">
              <p className={`${label} text-white/50`}>Цэс</p>
              <ul className="mt-3 space-y-1">
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
        </div>

        <div className={`mt-24 flex flex-wrap justify-between gap-4 ${label} text-white/50 lg:mt-32`}>
          <span>© {new Date().getFullYear()} Есөн Бэлчир ХХК</span>
          <a
            href={contact.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 transition-colors hover:text-white ${linkFocus}`}
          >
            Facebook
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>

      {/* The name closes the page, cropped by the bottom edge. */}
      <p
        aria-hidden
        className="pointer-events-none mt-6 translate-y-[24%] select-none whitespace-nowrap px-3 text-[14.5vw] font-semibold uppercase leading-[0.8] tracking-[-0.05em]"
      >
        Есөн Бэлчир
      </p>
    </footer>
  );
}

export { Footer };
