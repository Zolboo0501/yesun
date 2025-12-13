"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

const facilities = [
  {
    number: "01",
    title: "Үйлдвэрийн танилцуулга",
    description:
      "Манай байгууллагын үйлдвэр нь 2 хэсгээс бүрдэх бөгөөд 2021 нд ашиглалтад орсон болно. Барилга нь тэнхлэгээрээ 72м х 24м хэмжээтэй, газрын ±0.000 түвшинээс дээш 7,35м өндөр бөгөөд 1800М2 бүхий 2 давхар сэндвичэн объект болно.",
    image: "/images/banner.webp",
    color: "#0100FD",
  },
  {
    number: "02",
    title: "Агуулах",
    description:
      "Үйлдвэрийн 2 дох хэсэг болох агуулах нь тэнхлэгээрээ 18м х 12м хэмжээтэй, газрын ±0.000 түвшинээс дээш 3,35м 216М2 1 давхар бөгөөд барааг материал агуулахаас гадна хөргөх, хөлдөөх камертай хүнсний агуулах дотор нь шийдэж өгсөн болно.",
    image: "/images/banner2.webp",
    color: "black",
  },
  {
    number: "03",
    title: "Тоног төхөөрөмж",
    description:
      "Манай үйлдвэр нь орчин үеийн дэвшилтэд тоног төхөөрөмжөөс бүрдсэн бөгөөд нийт 12 тоног төхөөрөмжтэй ажиллаж байна.",
    image: "/images/banner.webp",
    color: "#FFA500",
  },
];

export const Facilities = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.2,
              }}
              className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover"
                />
                {/* Number Badge */}
                <div className="absolute bottom-4 left-4">
                  <div
                    className={`w-20 h-20 flex items-center justify-center text-white text-3xl font-bold`}
                    style={{ backgroundColor: facility.color }}
                  >
                    {facility.number}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className={`text-xl md:text-2xl font-bold mb-4 `}
                  style={{ color: facility.color }}
                >
                  {facility.title}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {facility.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
