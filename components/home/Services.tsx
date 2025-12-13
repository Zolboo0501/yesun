"use client";
import { motion } from "motion/react";
import { ChevronRight, Settings, Snowflake, Wind, Wrench } from "lucide-react";

const services = [
  {
    icon: Wind,
    title: "Агааржуулалтын систем",
    description:
      "Орчин үеийн агааржуулалтын системийн зураг төсөл, суурилуулалт, засвар үйлчилгээ. Барилга байгууламжид тохирсон оновчтой шийдэл.",
  },
  {
    icon: Snowflake,
    title: "Хөргөлтийн төхөөрөмж",
    description:
      "Аж үйлдвэр, худалдаа, зочид буудалд зориулсан хөргөлтийн системийн нийлүүлэлт, суурилуулалт, техникийн үйлчилгээ.",
  },
  {
    icon: Settings,
    title: "Үйлдвэрлэл",
    description:
      "Манай үйлдвэр нь орчин үеийн дэвшилтэд тоног төхөөрөмжөөс бүрдсэн бөгөөд нийт 12 тоног төхөөрөмжтэй ажиллаж байна.",
  },
  {
    icon: Wrench,
    title: "Засвар үйлчилгээ",
    description:
      "Урьдчилан сэргийлэх, яаралтай засвар үйлчилгээ. 24/7 дэмжлэг, сэлбэг хэрэгсэл солих, техникийн туслалцаа.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-end mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-black text-sm uppercase tracking-wider text-white">
              Үйлчилгээ
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            Манай <span className="text-[#0100FD]">үйлчилгээ</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-xl text-end">
            Бид агааржуулалт, хөргөлтийн системийн бүрэн шийдлийг мэргэжлийн
            түвшинд үзүүлдэг
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-24 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: index * 0.2,
                }}
                className="group bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 bg-linear-to-br from-[#0100FD] to-[black] z-10"></div>
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="w-20 h-20 bg-black/30 backdrop-blur-sm flex items-center justify-center  group-hover:scale-110 transition-transform">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <button
                    onClick={() => {}}
                    className="border border-[#0100FD] text-[#0100FD] flex flex-row gap-2 items-center px-4 py-2 hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Дэлгэрэнгүй
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
