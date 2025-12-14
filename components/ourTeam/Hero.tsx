"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import { Flag, Ship, Users } from "lucide-react";

const teamSections = [
  {
    image: "/images/banner.webp",
    isImageSection: true,
  },
  {
    title: "Хамтрагч түншүүд",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-blue-700",
  },
  {
    image: "/images/banner2.webp",
    isImageSection: true,
  },
  {
    title: "Захирлийн мэндчилгээ",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-blue-700",
    textColor: "text-white",
  },
  {
    image: "/images/banner2.webp",
    isImageSection: true,
  },
  {
    title: "Түүхэн замнал",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-red-600",
    textColor: "text-white",
  },
];

const Hero = () => {
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
                    className={`${section.bgColor} h-80 lg:h-96 flex flex-col items-center justify-center p-8 text-center group-hover:scale-105 transition-transform duration-300`}
                  >
                    <h3 className={`text-2xl font-bold text-gray-100  mb-2`}>
                      {section.title}
                    </h3>
                    <div className={`w-12 h-0.5 bg-white mb-3`} />
                    <p
                      className={`text-sm ${section.textColor} tracking-wider`}
                    >
                      {section.subtitle}
                    </p>
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
