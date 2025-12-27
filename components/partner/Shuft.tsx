"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

const advantages = [
  "SHUFT HVAC Technologies нь 1998 онд байгуулагдсан агааржуулалт, агааржуулалтын системийн тоног төхөөрөмж үйлдвэрлэдэг Оросын хамгийн том үйлдвэр юм. Тус компани нь агааржуулалт, агааржуулалтын иж бүрэн тоног төхөөрөмж үйлдвэрлэдэг. Төвлөрсөн агааржуулагч ба хүрээ хавтан агааржуулалтын нэгж, моноблок агааржуулалтын төхөөрөмж 10 МВт хүртэлх хүчин чадалтай хөргөгч, диспетчерийн болон автоматжуулалтын систем, агаар халдваргүйжүүлэх систем, гал унтраах, утаа зайлуулах систем.",
  "SHUFT HVAC Technologies нь орон сууц, нийтийн болон үйлдвэрлэлийн орчинд ашиглах өргөн хүрээний тоног төхөөрөмжийг санал болгодог.",
  "Халаагч: цахилгаан ба усны төрлийн дугуй ба тэгш өнцөгт хэлбэртэй халаагуур. Бид эрчим хүч, халаалтын төрөл, материал, хэмжээс зэрэг техникийн нарийвчилсан үзүүлэлт бүхий найдвартай, үр ашигтай халаагчыг санал болгож байна.",
  "Агаар хуваарилах төхөөрөмж: диффузор, агаарын хавхлага, агааржуулалтын сараалж, агаарын урсгалын зохицуулагч. Эдгээр төхөөрөмжүүд нь өрөөнд агаарын жигд хуваарилалтыг хангаж, тохь тухтай уур амьсгалыг хангаж, интерьер дизайны шаардлагыг хангадаг.",
  "Аж үйлдвэрийн фенүүд: янз бүрийн хэрэгцээнд тохирсон олон төрлийн сэнсний загварууд. Эдгээр нь дэвшилтэт дизайн, найдвартай байдал, өндөр үр ашигтай шинж чанартай байдаг. Сэнс бүрийн техникийн шинж чанарыг орон сууцны материал, моторын дугуй, дуу чимээний түвшин, даралт, агаарын урсгал зэрэг дэлгэрэнгүй тайлбарласан болно.",
];

const Shuft = () => {
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
                  4.
                </span>
                <br />
                SHUFT
              </h2>
              <Link
                href={"https://www.shuft.ru/"}
                className="text-base text-[#0100FD] underline tracking-wider"
              >
                shuft.ru
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
            <Link
              href={"https://www.shuft.ru/"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/shuft3.jpg"
                alt="Давуу#тал#1"
                className="w-full h-full object-contain"
              />
            </Link>
            <Link
              href={"https://www.shuft.ru/"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/shuft2.webp"
                alt="Давуу#тал#2"
                className="w-full h-full object-contain"
              />
            </Link>
            <Link
              href={"https://www.shuft.ru/"}
              className="relative h-64 md:h-80 overflow-hidden shadow-xl col-span-2"
            >
              <ImageWithFallback
                src="/images/shuft.png"
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

export default Shuft;
