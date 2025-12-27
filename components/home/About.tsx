"use client";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ImageWithFallback } from "../ImageWithFallback";

export function About({ hiddenButton }: { hiddenButton?: boolean }) {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center relative">
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
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-black text-sm uppercase tracking-wider text-white">
                Танилцуулга
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight">
              Есөн бэлчир ХХК -
              <br />
              <span className="text-[#0100FD]">Таны найдвартай түнш</span>
            </h2>
            <p className="text-sm text-justify text-gray-600 mb-6 leading-relaxed">
              Манай байгууллага нь “Барилга Хот Байгуулалтын яам” -наас
              олгогдсон тусгай зөвшөөрлийн дагуу 2011 оноос эхлэн байгуулагдсан.
            </p>
            <p className="text-sm text-justify text-gray-600 mb-8 leading-relaxed">
              Агаар сэлгэх систем болон хөргөлтийн системийн тооцоолол, зураг
              зурах, зөвлөгөө өгөх, агаар сэлгэх болон хөргөлтийн тоног
              төхөөрөмж нийлүүлэх, угсрах үйл ажиллагааны чиглэлээр нийслэл
              болон хөдөө орон нутагт нийт 150 гаруй объектод угсралт,
              суурилуултын ажил үйлчилгээ хийсэн туршлагатай хамт олон юм.
            </p>
            <p className="text-sm text-justify text-gray-600 mb-8 leading-relaxed">
              Манай хамт олон мэргэжлээрээ өндөр түвшинд бэлтгэгдсэн,
              туршлагатай чадварлаг ажилчид байдаг нь хийж гүйцэтгэсэн ажлын үр
              дүнгээрээ харагддаг билээ.
            </p>

            {!hiddenButton && (
              <Link href={"/about"}>
                <button
                  onClick={() => {}}
                  className="border text-sm border-black flex flex-row gap-2 items-center px-8 py-2 hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Дэлгэрэнгүй
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            )}
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative flex flex-row flex-1 gap-2 h-[600px]"
          >
            <div className="relative flex-1 overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/person.jpg"
                alt="Modern building"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="relative flex-1 overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="/images/person2.jpg"
                  alt="Modern building2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative flex-1 overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="/images/person6.jpg"
                  alt="Modern building3"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
