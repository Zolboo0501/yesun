"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

export function Banner() {
  return (
    <section id="about" className="py-24 bg-gray-50">
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
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight">
              Хамтрагч түншүүд
              <br />
              <span className="text-[#0100FD]">Таны найдвартай түнш</span>
            </h2>
            <div className="p-4 border-2 border-gray-100 shadow-xs ">
              <p className="text-sm text-gray-600 mb-6 leading-relaxed text-justify">
                Манай компани халаалт, хөргөлт, агааржуулалт ба агаар сэлгэлтийн
                бүтээгдэхүүнээрээ дэлхийд танигдсан брэндүүдийн албан ёсны
                байнгын төлөөлөгч юм.
              </p>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed text-justify">
                Чиллер, Агаар боловсруулах төхөөрөмж, Фэнкойл, бүх төрлийн
                Эйркондишнууд, дулаан солилцуур, Хятадын “KANION” брэндийн бүх
                төрлийн эйркондишн, Оросын “SHUFT”, ‘BALLU’ брэндийн бүх төрлийн
                агаар боловсруулах, сэлгэх тоног төхөөрөмж мөн Шведийн “Ostberg”
                брэндийн төрөл бүрийн сэнс зэрэг Дэлхийн стандартад нийцсэн
                эрчим хүч болон байгаль орчин, хүний биед сөрөг нөлөөгүй шилдэг
                бүтээгдэхүүнүүдийг Монгол улсынхаа зах зээлд нийлүүлэн угсарч,
                суурилуулсаар байна.
              </p>
            </div>
          </motion.div>

          {/* Right Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative grid grid-cols-2 grid-rows-3 gap-2 h-[600px]"
          >
            {/* Left Top - Large (spans 2 rows) */}

            <Link
              href={"https://www.kanionco.com/"}
              className="relative row-span-2 overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/kanon.webp"
                alt="Partner 1"
                className="w-full h-full p-12 object-contain"
              />
            </Link>

            {/* Right Top */}
            <Link
              href={"https://www.auxcool.com"}
              className="relative overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/aux.png"
                alt="Partner 2"
                className="w-full p-12 h-full object-contain"
              />
            </Link>

            {/* Right Bottom */}
            <Link
              href={"https://www.shuft.ru/"}
              className="relative row-span-2 overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/shuft.png"
                alt="Partner 3"
                className="w-full p-12 h-full object-contain"
              />
            </Link>

            {/* Left Bottom */}
            <Link
              href={"https://www.ballu.com/"}
              className="relative overflow-hidden shadow-xl"
            >
              <ImageWithFallback
                src="/images/ballu.png"
                alt="Partner 4"
                className="w-full p-12 h-full object-contain"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
