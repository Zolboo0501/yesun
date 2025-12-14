"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

export function VisionPurpose() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full"
          >
            {/* Second Image - Bottom Right (Behind) */}
            <div className="absolute bottom-12 right-0 w-full md:w-[70%] h-[45%] md:h-[50%] overflow-hidden shadow-2xl z-10">
              <ImageWithFallback
                src="/images/banner2.webp"
                alt="Эрхэм зорилго"
                className="w-full h-full object-cover"
              />
            </div>

            {/* First Image - Top Left (On Top) */}
            <div className="absolute top-12 left-0 w-full md:w-[70%] h-[45%] md:h-[50%] overflow-hidden shadow-2xl z-20">
              <ImageWithFallback
                src="/images/banner.webp"
                alt="Агааржуулалтын систем"
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-12 leading-tight font-bold">
              АЛСЫН ХАРАА БА ЭРХЭМ ЗОРИЛГО
            </h2>

            <div className="space-y-8">
              {/* Item 01 */}
              <div>
                <h3 className="text-lg md:text-xl text-[#0100FD] mb-4 font-semibold">
                  01. Алсын хараа
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed text-justify">
                  Улс, нийгмийнхээ хөгжилд үнэтэй хувь оруулсан түүхүйн хүүдсэг
                  нэмж, салбартаа манлайлсан, олон нийтэд нээлттэй ах ахуй нэгж
                  байна.
                </p>
              </div>

              {/* Item 02 */}
              <div>
                <h3 className="text-lg md:text-xl text-[#0100FD] mb-4 font-semibold">
                  02. Эрхэм зорилго
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed text-justify">
                  Бид орчин үеийн шийдэл, техник технологийг үйл ажиллагаандаа
                  нэвтрүүлж эрүүл аюулгүй ажиллагаа, хурд, чанар, стандартыг
                  эрхэмлэн ажиллах тэргүүн зорилготой. Бидний хувь нэмэр,
                  оролцоотой бүтээн байгуулалтууд, аливаа үйл ажиллагаа бүхэн
                  Монгол улсын хөгжил дэвшилд бодитой хувь нэмэр оруулж чадахуйц
                  байхыг ямагт чухалчилж ажиллахад бидний эрхэм зорилго оршино.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
