"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

const advantages = [
  "Угсралт суурилуулалт хийсэн олон жилийн туршлагатай",
  "Өргөн сонголттой орчин үеийн дэвшилтэд технологийг цаг тухайд бүрт манлайлан нэвтрүүлэх",
  "Агаар сэлгэх системийн түүхий эд, бөөлөг хийх бүрэн тоноглогдсон үйлдвэр",
  "LAVFILL брэндийн албан ёсны төлөөлөгчөөр",
  "Чадварлаг хамт олон, олон жил ажилласан туршлагатай ажилтан, мэргэжилтэй зөвлөгөө үйлчилгээ",
  "Хамдрал уламжлал, Тоног төхөөрөмжийн ашиглалтын үеийн заавар чиглэл",
  "Угсралт суурилуулалтандаа урт хугацааны чанарын баталгаа гаргаж өгдөг",
];

export const Advantages = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="relative h-64 md:h-80 overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/banner.webp"
                alt="Давуу тал 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/banner2.webp"
                alt="Давуу тал 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden shadow-xl col-span-2">
              <ImageWithFallback
                src="/images/banner.webp"
                alt="Давуу тал 3"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-12 leading-tight font-bold">
              Манай компанийн <br />
              <span className="text-[#0100FD]">давуу тал</span>
            </h2>

            <ul className="space-y-4">
              {advantages.map((advantage, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="flex items-start gap-3"
                >
                  <span className="text-[#0100FD] text-xl shrink-0">•</span>
                  <span className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {advantage}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
