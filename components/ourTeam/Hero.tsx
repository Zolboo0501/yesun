"use client";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

const teamSections = [
  {
    image: "/images/banner.webp",
    isImageSection: true,
  },
  {
    title: "Инженерийн мэндчилгээ",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-[oklch(0.5_0.19_256)]",
    desc: "Манай хамт олон “Хөргөлт, агааржуулалт, салхивчийн тоног төхөөрөмж нийлүүлэлт, угсралт”-ын чиглэлээр 29 жил тасралтгүй үйл ажиллагаагаа явуулж байна. Бид түүнчлэн гадаадаас оруулж ирэх импортын бүтээгдэхүүний тоо хэмжээг өчүүхэн боловч багасгах үүднээс зарим нэр төрлийн тоног төхөөрөмжүүдийг өөрсдөө үйлдвэрлэж байна. Мөн өдөр ирэх тусам өөрчлөгдөн хувьсаж буй хүмүүсийн ая тухтай байх хэрэгцээ, шаардлагыг хангах үүднээс байнгын эрэл хайгуул хийн дэлхийн алдартай брэндүүд болох VTS VENTUS, Carrier, Toshiba, Daikin, LG зэрэг брэндийн гэр ахуйн, системийн, техникийн зориулалттай эйркондишнуудыг үйлдвэрээс нь хямд, хурдан шуурхай нийлүүлж, угсарч суурилуулдаг. Та бүхэн манай байгууллагын бүтээгдэхүүн үйлчилгээтэй танилцаж амьдрал ахуй, бизнес хийх орчноо ая тухтай байлгах үүднээс биднийг сонгож, хамтран ажиллана гэдэгт итгэлтэй байна.",
  },
  {
    image: "/images/banner2.webp",
    isImageSection: true,
  },
  {
    title: "Захирлийн мэндчилгээ",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-[oklch(0.5_0.19_49)]",
    desc: "Манай хамт олон “Хөргөлт, агааржуулалт, салхивчийн тоног төхөөрөмж нийлүүлэлт, угсралт”-ын чиглэлээр 29 жил тасралтгүй үйл ажиллагаагаа явуулж байна. Бид түүнчлэн гадаадаас оруулж ирэх импортын бүтээгдэхүүний тоо хэмжээг өчүүхэн боловч багасгах үүднээс зарим нэр төрлийн тоног төхөөрөмжүүдийг өөрсдөө үйлдвэрлэж байна. Мөн өдөр ирэх тусам өөрчлөгдөн хувьсаж буй хүмүүсийн ая тухтай байх хэрэгцээ, шаардлагыг хангах үүднээс байнгын эрэл хайгуул хийн дэлхийн алдартай брэндүүд болох VTS VENTUS, Carrier, Toshiba, Daikin, LG зэрэг брэндийн гэр ахуйн, системийн, техникийн зориулалттай эйркондишнуудыг үйлдвэрээс нь хямд, хурдан шуурхай нийлүүлж, угсарч суурилуулдаг. Та бүхэн манай байгууллагын бүтээгдэхүүн үйлчилгээтэй танилцаж амьдрал ахуй, бизнес хийх орчноо ая тухтай байлгах үүднээс биднийг сонгож, хамтран ажиллана гэдэгт итгэлтэй байна.",
  },
  {
    image: "/images/banner2.webp",
    isImageSection: true,
  },
  {
    title: "Бидний тухай",
    subtitle: "ДЭЛГЭРЭНГҮЙ",
    bgColor: "bg-[oklch(0.5_0.19_170)]",
  },
];

const Hero = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
          {teamSections.map((section, index) => {
            const isImageSection = section.isImageSection;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3,
                }}
                className={`relative overflow-hidden group cursor-pointer ${
                  isImageSection ? "row-span-1" : "row-span-1"
                }`}
              >
                {isImageSection ? (
                  <div className="relative h-80 lg:h-96 group-hover:scale-105 transition-transform duration-300">
                    <ImageWithFallback
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="bg-gray-400 p-4 top-0 right-0">
                      <ImageWithFallback
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent"></div>
                  </div>
                ) : (
                  <div
                    className={`${section.bgColor} h-80 lg:h-96 flex flex-col items-center justify-center p-10 text-center group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                      <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                        {section.title}
                      </h3>
                      <div className="w-16 h-1 bg-white/80 mx-auto mb-6 rounded-full" />
                      {section?.desc && (
                        <p className="text-sm text-white/90 leading-relaxed line-clamp-4 text-justify mb-6 font-light">
                          {section.desc}
                        </p>
                      )}
                      <div className="flex flex-row gap-2 items-center justify-center group/btn">
                        <p className="text-xs text-white font-semibold tracking-widest uppercase">
                          {section.subtitle}
                        </p>
                        <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
