"use client";
import { motion } from "motion/react";
import { Flame, Repeat, Pipette, Factory } from "lucide-react";

const Catelog = () => {
  const catelog = [
    {
      name: "Галын сэнс",
      icon: Flame,
      description: "Агаар сэрүүцэгчийн галын сэнс",
    },
    {
      name: "Хөрвөлт",
      icon: Repeat,
      description: "Хөрвөлтийн төхөөрөмж",
    },
    {
      name: "Шугам хоолой",
      icon: Pipette,
      description: "Шугам хоолойн системүүд",
    },
    {
      name: "Үйлдвэрлэл",
      icon: Factory,
      description: "Үйлдвэрлэлийн тоног төхөөрөмж",
    },
  ];

  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="inline-block px-4 py-2 bg-black text-sm uppercase tracking-wider text-white"
          >
            Бүтээгдэхүүн
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-3xl lg:text-4xl text-gray-900 mb-6 gap-2 flex flex-col mt-4"
          >
            Таньд санал болгох бүтээгдэхүүн
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Бид тухайн бүтээгдэхүүнийг үйлдвэрээс таны гарт хүргэж байна
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {catelog.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#0100FD] md:py-12"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#0100FD]/10 to-[#0100FD]/5 flex items-center justify-center group-hover:from-[#0100FD]/20 group-hover:to-[#0100FD]/10 transition-all duration-300">
                    <Icon className="w-8 h-8 text-[#0100FD] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#0100FD] transition-colors duration-300">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-[#0100FD]/0 to-[#0100FD]/0 group-hover:from-[#0100FD]/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Catelog;
