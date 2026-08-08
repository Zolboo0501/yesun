"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

const advantages = [
  "LAVFILL нь Хятадын Жэжян мужийн Вэнжоу хотод байрладаг Zhejiang Lavfill Electrical Technology Co., Ltd компанийн брэнд бөгөөд 1999 оноос хойш ахуйн болон нийтийн зориулалтын агаар сорогч сэнсний судалгаа, зохион бүтээлт, үйлдвэрлэлд тусгайлан ажиллаж ирсэн туршлагатай үйлдвэрлэгч юм.",

  "Тус компани нь ариун цэврийн өрөө, гал тогоо болон бусад чийг ихтэй орчинд зориулсан хананы болон таазны агаар сорогч сэнс, суваг дундын (inline) сэнс, тэнхлэгийн сэнс, мөн гар хатаагч зэрэг өргөн сонголттой бүтээгдэхүүн үйлдвэрлэдэг.",

  "LAVFILL-ийн сэнснүүд нь нам чимээтэй ажиллагаа, эрчим хүчний бага зарцуулалт, урт насжилттай мотор зэрэг давуу талтай. Мөн чийг мэдрэгч, хөдөлгөөн мэдрэгч, цаг тохируулагч, буцах хаалт зэрэг нэмэлт үйлдлүүдтэй загварууд байдаг тул хэрэглэгчийн хэрэгцээнд нийцүүлэн сонгох боломжтой.",

  "Бүтээгдэхүүний загвар нь орчин үеийн интерьерт зохицсон нарийн, цомхон хэлбэртэй бөгөөд суурилуулах, цэвэрлэхэд хялбар байхаар зохион бүтээгдсэн. Энэ нь орон сууц, оффис, зочид буудал, худалдаа үйлчилгээний барилгад адилхан тохиромжтой.",

  "Үйлдвэрлэлийн үйл явц нь ISO9001 стандартын шаардлагыг хангадаг бөгөөд бүтээгдэхүүнүүд нь CE, TUV, CB, RoHS, CCC, GCC зэрэг олон улсын гэрчилгээтэй. LAVFILL нь 15 гаруй жилийн турш Европ, Австрали, Өмнөд Америк, Ойрх Дорнодын зах зээлд бүтээгдэхүүнээ нийлүүлж, OEM/ODM захиалгат үйлдвэрлэл гүйцэтгэдэг.",
];

const Lavfill = () => {
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
                  6.
                </span>
                <br />
                LAVFILL <span className="text-base">(агаар сорогч сэнс)</span>
              </h2>
              <Link
                href={"https://lavfill.en.alibaba.com/"}
                className="text-base text-[#0100FD] underline tracking-wider"
              >
                lavfill.en.alibaba.com
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
            <Link
              href={"https://lavfill.en.alibaba.com/"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/lavfill3.jpg"
                alt="Давуу#тал#1"
                className="w-full h-full object-contain"
              />
            </Link>
            <Link
              href={"https://lavfill.en.alibaba.com/"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/lavfill2.jpg"
                alt="Давуу#тал#2"
                className="w-full h-full object-contain"
              />
            </Link>
            <Link
              href={"https://lavfill.en.alibaba.com/"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl col-span-2"
            >
              <ImageWithFallback
                src="/images/lavfill.jpg"
                alt="Давуу#тал#3"
                className="w-full h-full object-contain"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Lavfill;
