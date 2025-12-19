"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import { Quote } from "lucide-react";
export const Greeting = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative h-[385px] md:h-[385px] lg:h-[500px]"
          >
            <div className="relative w-full h-full overflow-hidden shadow-2xl bg-transparent">
              <ImageWithFallback
                src="/images/director2.jpg"
                alt="Зорилт"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative"
          >
            <Quote className=" absolute -bottom-12 -right-4 w-8 h-8  " />
            <p className="text-sm text-gray-700 leading-relaxed text-justify lg:px-[10%] relative">
              <span className="font-bold text-xl text-[#0100FD]">
                Захирлын мэндчилгээ
              </span>
              <br />
              <br /> Сайн байна уу, Намайг Дамирангийн Цогтоо гэдэг. Би Есөн
              Бэлчир ХХК-ийн үүсгэн байгуулагч бөгөөд ерөнхий захирлаар ажиллаж
              байна.
              <br />
              Есөн Бэлчир ХХК нь агаар сэлгэлт, хөргөлтийн салбарт инженерийн
              нарийн тооцоонд суурилсан, чанартай, найдвартай шийдлийг санал
              болгох зорилгоор байгуулагдсан.
              <br />
              <br />
              Бид агаар сэлгэлт, хөргөлтийн системийг зураг
              төсөл–үйлдвэрлэл–угсралт–ашиглалт хүртэлх бүрэн циклээр
              хэрэгжүүлдэг. Миний хувьд бизнесийн үйл ажиллагаанд хариуцлага,
              стандарт, урт хугацааны хамтын ажиллагаа-г нэн тэргүүнд тавьж
              ажилладаг.
              <br />
              <br />
              Энэхүү зарчим маань манай инженерийн баг, үйлдвэрийн соёл,
              харилцагчидтай тогтоосон итгэлцэлд бүрэн шингэсэн байдаг. Бид
              Монгол орны уур амьсгал, барилгын онцлогт тохирсон, эрчим хүчний
              хэмнэлттэй, тогтвортой агаар сэлгэлт хөргөлтийн шийдлийг дотооддоо
              үйлдвэрлэж, зах зээлд нийлүүлэхийг зорьж байна. Таны төсөлд итгэл
              даах түнш байж, урт хугацаанд хамтран ажиллахдаа бид үргэлж
              нээлттэй байх болно
              <br />
              <br />
              <div className="flex flex-col w-fit relative">
                <div className="flex flex-row items-center">
                  <span className="shrink-0">
                    — Үүсгэн байгуулагч & Ерөнхий захирал / Д.Цогтоо /
                  </span>
                  <ImageWithFallback
                    src="/images/signatureee.png"
                    alt="Logo"
                    className="w-32 h-20 pt-3"
                  />
                </div>
                <div className="flex flex-row mt-4">
                  <span className="font-semibold text-xl text-[#0100FD]">
                    Есөн Бэлчир ХХК
                  </span>
                </div>
              </div>
            </p>
            <Quote className="absolute -top-12 -left-4 w-8 h-8 rotate-180" />
          </motion.div>

          {/* Right Image */}
        </div>
      </div>
    </section>
  );
};
