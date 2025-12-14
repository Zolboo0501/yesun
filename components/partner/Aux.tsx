"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

const advantages = [
  "AUX групп нь 1986 оноос хойш зах зээл дээр ажиллаж байгаа бөгөөд ухаалаг гэр ахуйн цахилгаан хэрэгсэл, тэр дундаа агааржуулагч үйлдвэрлэгчдийн нэг юм. Тус групп нь Хятадын Нинбо, Наньчан, Тяньжин хотуудад хамгийн том нь болох орчин үеийн 7 үйлдвэрлэлийн төв, судалгаа шинжилгээний таван төвтэй. AUX төхөөрөмжүүд нь дэлхийн 100 гаруй оронд байдаг. AUX нь мэргэжлийн хөргөлтийн салбарт 27 жилийн туршлагаараа асар их өсөлтөд хүрсэн",
  "Хятадын агааржуулагчын салбарын шилдэг гурван брэндийн нэг болсон. 2018-2020 онд агааржуулагчын борлуулалтын хэмжээгээр дэлхийд нэгдүгээрт ордог. Хүчтэй R&D чадавхиар дэмжигдсэн AUX нь хувьсах давтамжын хяналт, тав тух ба эрүүл мэндийн технологи, ирээдүйн ухаалаг технологи зэрэг төрөл бүрийн салбарт тэргүүлэгчийн үүргийг гүйцэтгэдэг.",
  "Олон хуваах AUX систем нь нэг гадаа нэгжид 2-5 доторх нэгжийг суурилуулах боломжийг олгодог. Энэхүү саналд 4.1-ээс 12.0 кВт хүртэл хөргөх хүчин чадалтай гадаа нэгжийн 6 загвар багтсан болно. Эдгээр төхөөрөмжүүд нь экологийн R32 хөргөгч болон орчин үеийн инвертер технологийг ашиглан найдвартай, эрчим хүчний хэмнэлттэй ажилладаг. Тэд хөргөлтийн горимд -15 ° C-аас 52 ° C хүртэл, халаалтын горимд -22 ° C-аас 24 ° C хүртэл орчны температурын өргөн хүрээний тогтвортой ажиллагааг санал болгодог. Энэхүү систем нь компрессорын хүч, түвшний зөрүүгээс 15 метр хүртэлх нийт урт нь 80 метр хүртэл хөргөх системийг төлөвлөх боломжийг олгодог.",
];

const Aux = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
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
                  2.
                </span>
                <br />
                AUX
              </h2>
              <Link
                href={"https://www.auxcool.com"}
                className="text-base text-[#0100FD] underline tracking-wider"
              >
                auxcool.com
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

          {/* Right Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
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
        </div>
      </div>
    </section>
  );
};

export default Aux;
