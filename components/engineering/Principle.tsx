"use client";
import { motion } from "motion/react";

const principles = [
  {
    id: 1,
    title: "Мэргэжлийн боловсролтой инженерүүд",
    items: [
      "Стандарт-д нийцсэн зураг төсөл",
      "Барилга, үйлдвэрийн бодит туршлага",
      "Талбайн хяналт, чанарын шалгалт",
    ],
  },
  {
    id: 2,
    title: "Инженерийн үйлчилгээ",
    items: [
      "Агаар сэлгэлт, хөргөлтийн системийн зураг төсөл",
      "Тоног төхөөрөмжийн сонголт",
      "Суурилуулалтын инженерийн хяналт",
      "Ашиглалт, тохируулга (Commissioning)",
    ],
  },
  {
    id: 3,
    title: "Инженерийн багийн ажлын зарчим",
    items: [
      "Захиалагчийн хэрэгцээг гүнзгий ойлгох",
      "Эрчим хүчний хэмнэлттэй шийдэл",
      "Аюулгүй ажиллагаа, стандартын хатуу мөрдөлт",
      "Урт хугацааны ашиглалт, найдвартай ажиллагаа",
    ],
  },
];

const Principle = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl text-gray-900 mb-6 font-bold">
            Манай инженерүүдийн{" "}
            <span className="text-[#0100FD]">давуу тал</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {principle.title}
              </h3>
              <ul className="space-y-3">
                {principle.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 leading-relaxed flex items-start"
                  >
                    <span className="mr-2 text-[#0100FD] font-bold">•</span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Principle;
