"use client";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

const teamSections = [
  {
    image: "/images/banner.webp",
    isImageSection: true,
  },
  {
    title: "Инженер техникийн алба",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-[oklch(0.5_0.19_256)]",
    href: "/greeting/engineering",
  },
  {
    image: "/images/banner2.webp",
    isImageSection: true,
  },
  {
    title: "Захирлийн мэндчилгээ",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-[oklch(0.5_0.19_49)]",
    href: "/greeting/director",
  },
  {
    image: "/images/banner2.webp",
    isImageSection: true,
  },
  {
    title: "Манай хамт олон",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-[oklch(0.5_0.19_170)]",
    isScroll: true,
  },
];

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
          {teamSections.map((section, index) => {
            const isImageSection = section.isImageSection;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3,
                }}
                className={`relative overflow-hidden group cursor-pointer ${
                  isImageSection ? "row-span-1" : "row-span-1"
                }`}
              >
                {isImageSection ? (
                  <div className="relative h-80 lg:h-96 group-hover:scale-105 transition-transform duration-300">
                    <ImageWithFallback
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="bg-gray-400 p-4 top-0 right-0">
                      <ImageWithFallback
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent"></div>
                  </div>
                ) : (
                  <div
                    className={`${section.bgColor} h-80 lg:h-96 flex flex-col items-center justify-center p-10 text-center group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                      <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                        {section.title}
                      </h3>
                      <div className="w-16 h-1 bg-white/80 mx-auto mb-6 rounded-full" />
                      {/* {section?.desc && (
                        <p className="text-sm text-white/90 leading-relaxed line-clamp-4 text-justify mb-6 font-light">
                          {section.desc}
                        </p>
                      )} */}
                      {section.isScroll ? (
                        <div
                          onClick={() => scrollToSection("ourTeam")}
                          className="flex flex-row gap-2 items-center justify-center group/btn"
                        >
                          <p className="text-xs text-white font-semibold tracking-widest uppercase">
                            {section.subtitle}
                          </p>
                          <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      ) : (
                        section.href && (
                          <Link
                            href={section?.href}
                            className="flex flex-row gap-2 items-center justify-center group/btn"
                          >
                            <p className="text-xs text-white font-semibold tracking-widest uppercase">
                              {section.subtitle}
                            </p>
                            <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
