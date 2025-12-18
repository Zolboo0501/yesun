"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

export const Purpose = () => {
  return (
    <section className="py-24 bg-gray-50">
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#0100FD] mb-12 leading-tight font-bold">
              ЗОРИЛТ
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              Манай компани нь барилгын үйл ажиллагаа эрхлэх үндсэн чиглэлээ
              тууштай баримталж, салбарт хүчин төгөлдөр мөрдөж буй хууль, журам,
              норм стандартыг идэвхтэй хэрэгжүүлэгч байх, барилгын салбарын
              хөгжил дэвшилд илэрхийлж чадах бүтээн байгуулалт, шинэ технологи
              нэвтрүүлэлт, цаашлаад хотын хөгжилд бодитой хувь нэмрээ оруулагч
              байхын зэрэгцээ, дотоодын шилдэг ах ахуй нэгж, татвар төлөгч,
              нийгмийн хариуцлагыг ухамсарлагч компани байхыг зорилтоо болгож
              байна.
            </p>
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
            className="relative h-[385px] md:h-[385px] lg:h-[385px]"
          >
            <div className="relative w-full h-full overflow-hidden shadow-2xl bg-transparent">
              <ImageWithFallback
                src="/images/banner.jpg"
                alt="Зорилт"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
