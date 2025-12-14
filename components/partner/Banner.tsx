"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

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
            <p className="text-sm text-gray-600 mb-6 leading-relaxed text-justify">
              Манай компани халаалт, хөргөлт, агааржуулалт ба агаар сэлгэлтийн
              бүтээгдэхүүнээрээ дэлхийд танигдсан брэндүүдийн албан ёсны байнгын
              төлөөлөгч юм.
            </p>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed text-justify">
              Чиллер, Агаар боловсруулах төхөөрөмж, Фэнкойл, бүх төрлийн
              Эйркондишнууд, дулаан солилцуур, Хятадын “KANION” брэндийн бүх
              төрлийн эйркондишн, Оросын “SHUFT”, ‘BALLU’ брэндийн бүх төрлийн
              агаар боловсруулах, сэлгэх тоног төхөөрөмж мөн Шведийн “Ostberg”
              брэндийн төрөл бүрийн сэнс зэрэг Дэлхийн стандартад нийцсэн эрчим
              хүч болон байгаль орчин, хүний биед сөрөг нөлөөгүй шилдэг
              бүтээгдэхүүнүүдийг Монгол улсынхаа зах зээлд нийлүүлэн угсарч,
              суурилуулсаар байна.
            </p>
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
            <div className="relative row-span-2 overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/kanon.webp"
                alt="Partner 1"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right Top */}
            <div className="relative overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/aux.png"
                alt="Partner 2"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right Bottom */}
            <div className="relative row-span-2 overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/shuft.png"
                alt="Partner 3"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Left Bottom */}
            <div className="relative overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/ballu.png"
                alt="Partner 4"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
