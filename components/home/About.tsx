"use client";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

export function About() {
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
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Манай байгууллага нь “Барилга Хот Байгуулалтын яам” -наас
              олгогдсон тусгай зөвшөөрлийн дагуу 2011 оноос эхлэн байгуулагдсан.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Агаар сэлгэх систем болон хөргөлтийн системийн тооцоолол, зураг
              зурах, зөвлөгөө өгөх, агаар сэлгэх болон хөргөлтийн тоног
              төхөөрөмж нийлүүлэх, угсрах үйл ажиллагааны чиглэлээр нийслэл
              болон хөдөө орон нутагт нийт 150 гаруй объектод угсралт,
              суурилуултын ажил үйлчилгээ хийсэн туршлагатай хамт олон юм.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Манай хамт олон мэргэжлээрээ өндөр түвшинд бэлтгэгдсэн,
              туршлагатай чадварлаг ажилчид байдаг нь хийж гүйцэтгэсэн ажлын үр
              дүнгээрээ харагддаг билээ.
            </p>

            <button
              onClick={() => {}}
              className="border border-black flex flex-row gap-2 items-center px-8 py-2 hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Дэлгэрэнгүй
              <ChevronRight className="w-4 h-4" />
            </button>
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
                src="https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjU2MjQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern building"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="relative flex-1 overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjU2MjQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern building"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative flex-1 overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjU2MjQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern building"
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
