"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

const advantages = [
  "Kanion Co нь анх агааржуулагчын салбарт шинийг санаачлагч гэдгээрээ дэлхийд танигдсан дотоодын брэндүүдийн нэг болсон. Хийх боломжгүй, өндөр өртөгтэй технологийг шинэ хэм хэмжээ болгон өөрчлөхийн төлөө бид зөвхөн хамгийн сүүлийн үеийн, дэвшилтэт, технологийн дэвшилтэт эд ангиудыг нийлүүлж, угсарч, байгаль орчинд ээлтэй материаллаг нөөц, шинэ үйлдвэрлэлийн практикт судалгаагаа хөрөнгө оруулдаг.",
  "Дэвшилтэт 3D DC инвертер технологийн тусламжтайгаар энэхүү дулааны насос нь дээд зэргийн гүйцэтгэл, эрчим хүчний хэмнэлтийг санал болгодог. Энэ нь хүрээлэн буй агаарыг дулааны эх үүсвэр болгон ашиглаж, дулааныг гаргаж, халаах эсвэл хөргөх зорилгоор усны системд шилжүүлдэг.",
  "Энэхүү шинэлэг технологи нь эрчим хүчний хэрэглээг багасгахын зэрэгцээ хамгийн оновчтой тав тухтай байдлыг хангаж, зардлыг ихээхэн хэмнэдэг. Kanion Co нь дээд зэргийн чанартай бүтээгдэхүүн нийлүүлж байгаадаа бахархдаг.",
  "Нарийвчлалтай, дээд зэргийн материалыг ашиглан үйлдвэрлэсэн энэхүү дулааны насос нь удаан эдэлгээтэй болно. Энэ нь цаг агаарын янз бүрийн нөхцөлийг тэсвэрлэх, эрс тэс температурт ч жигд ажиллах зориулалттай. Удирдлага нь температурын нарийн тохируулга, тохируулж болох тохиргоог идэвхжүүлж, хувийн тав тух, эрчим хүчний хэмнэлттэй бөгөөд нэмж дурдахад дулааны насос нь чимээгүйхэн ажиллаж, тайван, эвдрэлгүй орчинг бүрдүүлдэг.",
];

const Kanion = () => {
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
                src="/images/kanon2.webp"
                alt="Давуу@тал@1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/kanon3.jpg"
                alt="Давуу@тал@2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative h-64 md:h-80 overflow-hidden shadow-xl col-span-2">
              <ImageWithFallback
                src="/images/kanon.webp"
                alt="Давуу@тал@3"
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
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl bg-linear-to-br from-[#0100FD] to-black bg-clip-text text-transparent leading-tight font-bold">
                <span className="bg-linear-to-br from-[#0100FD] to-black bg-clip-text text-transparent">
                  1.
                </span>
                <br />
                Kanion
              </h2>
              <Link
                href={"https://www.kanionco.com/"}
                className="text-base text-[#0100FD] underline tracking-wider"
              >
                kanionco.com
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

export default Kanion;
