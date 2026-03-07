"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

const advantages = [
  "AIRONN нь агааржуулалт болон үйлдвэрийн сэнсний системийн чиглэлээр ажилладаг Туркийн инженерийн компани юм. Тус компани нь 2011 онд байгуулагдсан бөгөөд агааржуулалтын салбарт технологи, инновац болон өндөр үр ашигтай шийдлүүдийг хөгжүүлэх зорилготойгоор үйл ажиллагаагаа эхлүүлсэн.",

  "AIRONN нь HVAC болон үйлдвэрийн агааржуулалтын системийн сэнс, утаа сорох систем, туннелийн агааржуулалт зэрэг олон төрлийн тоног төхөөрөмжийг үйлдвэрлэдэг. Тэдний бүтээгдэхүүнүүд нь барилга байгууламж, метро, туннель, авто зогсоол, үйлдвэр зэрэг томоохон байгууламжуудад өргөн хэрэглэгддэг.",

  "Компанийн гол давуу тал нь хүчирхэг судалгаа хөгжүүлэлт (R&D), аэродинамик тооцоолол болон CFD технологид тулгуурласан сэнсний оновчтой дизайн юм. Энэ нь AIRONN-ийн бүтээгдэхүүнийг илүү эрчим хүчний хэмнэлттэй, найдвартай, өндөр хүчин чадалтай болгодог.",

  "AIRONN нь Турк улсын Кожаели хотод байрлах орчин үеийн үйлдвэрлэлийн үйлдвэрт үйл ажиллагаагаа явуулдаг бөгөөд жилд ойролцоогоор 20,000 ширхэг сэнс үйлдвэрлэх хүчин чадалтай. Тус компани одоогоор дэлхийн 45-аас дээш улс руу бүтээгдэхүүнээ экспортолдог олон улсын брэнд юм.",

  "Мөн AIRONN нь олон улсын стандартуудыг хангасан CE, ISO, EN 12101 зэрэг сертификатуудтай бөгөөд галын утаа зайлуулах болон аюулгүй ажиллагааны шаардлагуудыг хангадаг өндөр чанартай бүтээгдэхүүн үйлдвэрлэдэг.",
];

const AirOne = () => {
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
            <Link
              href={"https://www.aironn.com.tr/en/products/axial-fans"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/aironn3.jpg"
                alt="Давуу$тал$1"
                className="w-full h-full object-contain"
              />
            </Link>
            <Link
              href={"https://www.aironn.com.tr/en/products/axial-fans"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/aironn2.jpg"
                alt="Давуу$тал$2"
                className="w-full h-full object-contain"
              />
            </Link>
            <Link
              href={"https://aironn.com.tr/en"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl col-span-2"
            >
              <ImageWithFallback
                src="/images/aironn.png"
                alt="Давуу$тал$3"
                className="w-full p-12 h-full object-contain"
              />
            </Link>
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
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl bg-linear-to-br from-[#0100FD] to-black bg-clip-text text-transparent leading-tight font-bold">
                <span className="bg-linear-to-br from-[#0100FD] to-black bg-clip-text text-transparent">
                  5.
                </span>
                <br />
                AIRONN <span className="text-base">(галын сэнс)</span>
              </h2>
              <Link
                href={"https://aironn.com.tr/en"}
                className="text-base text-[#0100FD] underline tracking-wider"
              >
                aironn.com
              </Link>
            </div>

            <ul className="space-y-4 p-4 border-2 border-gray-100 shadow-xs">
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
                  <span className="text-[#0100FD] text-sm shrink-0">•</span>
                  <span className="text-sm  text-gray-700 leading-relaxed text-justify">
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

export default AirOne;
