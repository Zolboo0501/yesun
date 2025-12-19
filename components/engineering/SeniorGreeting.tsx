"use client";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

export function SeniorGreeting() {
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
            <h2 className="text-4xl lg:text-5xl  text-[#0100FD] mb-6 leading-tight">
              Инженерийн багийн ахлагч -{" "}
              <span className="text-gray-900">Б.Бэхбат</span>
            </h2>
            <p className="text-sm text-justify text-gray-600 mb-6 leading-relaxed">
              Манай инженерийн багийн үндсэн зорилго бол Монгол орны уур
              амьсгал, барилгын онцлог, ашиглалтын нөхцөлд бүрэн нийцсэн
              чанартай, найдвартай, өндөр үр ашигтай агаар сэлгэлт, хөргөлтийн
              системийг мэргэжлийн түвшинд хэрэгжүүлэх явдал юм.
            </p>
            <p className="text-sm text-justify text-gray-600 mb-8 leading-relaxed">
              Бид төслийн эхний шатны судалгаа, зураг төсөл, инженерийн нарийн
              тооцооноос эхлэн суурилуулалт, ашиглалт, тохируулга хүртэлх бүрэн
              циклийг хариуцлагатайгаар гүйцэтгэдэг. Инженерийн оновчтой тооцоо,
              бодит талбайн гүйцэтгэлийг уялдуулснаар системийн тогтвортой
              ажиллагаа, урт хугацааны ашиглалт, эрчим хүчний хэмнэлтийг
              хангадаг.
            </p>
            <p className="text-sm text-justify text-gray-600 mb-8 leading-relaxed">
              Манай баг олон улсын стандарт, инженерийн шилдэг туршлагад
              тулгуурлан ажиллаж, захиалагч бүрийн хэрэгцээнд тохирсон оновчтой,
              бодит шийдлийг санал болгодог. Бид зөвхөн өнөөдрийн гүйцэтгэлд
              бус, ирээдүйн ашиглалт, засвар үйлчилгээний үр ашгийг урьдчилан
              тооцож ажилладаг нь бидний гол давуу тал юм.
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
            className="relative flex flex-row flex-1 gap-2 h-[600px]"
          >
            <div className="relative flex-1 overflow-hidden shadow-xl">
              <ImageWithFallback
                src="/images/engineering5.jpg"
                alt="Modern building"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
