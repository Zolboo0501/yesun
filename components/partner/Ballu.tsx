"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

const advantages = [
  "Аж үйлдвэрийн концерн Баллу мэргэшсэн цаг уурын хяналтыг хөгжүүлэх, үйлдвэрлэхэд болон инженерийн тоног төхөөрөмж. Олон жилийн туршлага, дотоод судалгааны төвүүд болон үйлдвэрлэл нь дэвшилтэт технологийг хангах, чанар, найдвартай байдал нь группын тогтвортой хөгжлийг баталгаажуулсан бүтээгдэхүүн өнөөдөр, ирээдүйд амжилт.",
  "Тус концерн нь Орос, ТУХН, Зүүн Европын орнуудын зах зээлд тэргүүлэгч байр суурийг эзэлдэг. Аж үйлдвэрийн концерн нь дулааны хөшиг, дулааны буу, конвектор, агааржуулагч, агааржуулалтын системийн 5 сая гаруй төхөөрөмж, чийгшүүлэх, цэвэршүүлэх, цаг уурын хяналтын 250,000 гаруй төхөөрөмж зэрэг 30 гаруй оронд жил бүр 2 сая халаалтын төхөөрөмж үйлдвэрлэж, нийлүүлдэг. үйлдвэрлэлийн зориулалттай, үүнд хүрээ хавтангийн агааржуулалтын агрегатор, хөргөгч, хөргөх цамхаг гэх мэтийг манай Ballu, Ballu Machine, Ballu-Biemmedue болон OEM брэндийн аль алинд нь үйлдвэрлэдэг.",
  "Ballu аж үйлдвэрийн концернийн бүх бүтээгдэхүүн олон улсын болон Оросын чанарын стандартад нийцдэг. Шилдэг туршлага, ногоон технологи-ыг нэвтрүүлэх, байгаль орчинд ээлтэй материалыг ашиглах нь Баллугийн дэлхий даяар амжилтанд хүрэх түлхүүр юм.",
];

const Ballu = () => {
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
                src="/images/ballu3.webp"
                alt="Давуу$тал$1"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/ballu2.webp"
                alt="Давуу$тал$2"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden shadow-xl col-span-2">
              <ImageWithFallback
                src="/images/ballu.png"
                alt="Давуу$тал$3"
                className="w-full h-full object-contain"
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
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl bg-linear-to-br from-[#0100FD] to-black bg-clip-text text-transparent leading-tight font-bold">
                <span className="bg-linear-to-br from-[#0100FD] to-black bg-clip-text text-transparent">
                  3.
                </span>
                <br />
                BALLU
              </h2>
              <Link
                href={"https://www.ballu.ru/"}
                className="text-base text-[#0100FD] underline tracking-wider"
              >
                ballu.ru
              </Link>
            </div>

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

export default Ballu;
