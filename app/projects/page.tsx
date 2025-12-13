"use client";
import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { Star } from "lucide-react";

const projects = [
  {
    number: "1",
    title: "Нийслэлийн нутгийн захиргааны төв цогцолбор барилгын агаар",
    subtitle: "сэлгэлтийн систем - 2019 он",
    image: "/images/banner.webp",
    rating: 5,
  },
  {
    number: "2",
    title: "Монгол банкны үндэсний цахим гүйлгээний төв",
    subtitle: "барилгын агаар сэлгэлтийн систем - 2019 он",
    image: "/images/banner2.webp",
    rating: 5,
  },
  {
    number: "3",
    title: "Хүннү 2222 төслийн 2-р ээлжийн орон сууцны барилгын агаар",
    subtitle: "сэлгэлтийн систем - 2020 он",
    image: "/images/banner.webp",
    rating: 5,
  },
  {
    number: "4",
    title: "Хүннү 2222 төслийн 2-р ээлжийн орон сууцны нэгдсэн граж барилгын",
    subtitle: "агаар сэлгэлт, Хөргөлтийн системийн угсралт - 2020 он",
    image: "/images/banner2.webp",
    rating: 5,
  },
  {
    number: "5",
    title: "Чингис хаан музей барилгын Агаар сэлгэлтийн системийн угсралт",
    subtitle:
      "тоног төхөөрөмж нийлүүлэх, Хөргөлтийн системийн угсралт - 2021 он",
    image: "/images/banner.webp",
    rating: 5,
  },
  {
    number: "6",
    title: "Нисэх гардэн орон сууцны хотхоны агаар",
    subtitle: "сэлгэлтийн систем - 2022 он",
    image: "/images/banner2.webp",
    rating: 5,
  },
  {
    number: "7",
    title: "Хүннү 2222 төслийн 3 - р ээлжийн Канад Сургууль спорт комплекс",
    subtitle:
      "барилгын агаар сэлгэлт, Хөргөлтийн системийн тоног төхөөрөмж нийлүүлэх, угсралт - 2022 он",
    image: "/images/banner.webp",
    rating: 5,
  },
  {
    number: "8",
    title: "Одод Хотхон орон сууцны хотхоны 2 блок барилгын",
    subtitle:
      "агаар сэлгэлт, хөргөлтийн систем болон нэгдсэн гражийн агаар сэлгэлт - 2022 он",
    image: "/images/banner2.webp",
    rating: 5,
  },
  {
    number: "9",
    title: "Platinum Tower орон сууцны хотхоны 2 блок",
    subtitle:
      "барилгын агаар сэлгэлт, хөргөлтийн систем болон нэгдсэн гражийн агаар сэлгэлт - 2023 он",
    image: "/images/banner.webp",
    rating: 5,
  },
  {
    number: "10",
    title: "СансарГардэн орон сууцны хотхоны 2 блок",
    subtitle: "барилгын агаар сэлгэлт, хөргөлтийн систем - 2024 он",
    image: "/images/banner2.webp",
    rating: 5,
  },
  {
    number: "11",
    title: "Эрдэнэс Таван Толгойн Нүүрс Баяжуулах үйлдвэрийн",
    subtitle: "ийн төслийн үйлдвэрийн барилга агаар сэлгэлт - 2024 он",
    image: "/images/banner.webp",
    rating: 5,
  },
  {
    number: "12",
    title: "Эрдэнэс Таван Толгойн Нүүрс Баяжуулах үйлдвэрийн",
    subtitle:
      "ийн төслийн ахлагдын байр, оффис барилга агаар сэлгэлт, хөргөлтийн систем - 2024 он",
    image: "/images/banner2.webp",
    rating: 5,
  },
];

const Projects = () => {
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
            Төслүүд
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-4xl lg:text-5xl text-gray-900 mb-6 gap-2 flex flex-col mt-4"
          >
            <span className="text-[#0100FD] font-semibold">2019 – 2024 </span>
            ОНУУДЫН АЖЛЫН ТҮҮХ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Бид олон төрлийн төсөл амжилттай хэрэгжүүлсэн туршлагатай
          </motion.p>
        </motion.div>

        <div className="space-y-16 lg:space-y-32">
          {projects.map((project, index) => {
            const isOdd = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: isOdd ? -50 : 50,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  isOdd ? "lg:justify-start" : "lg:justify-end"
                }`}
              >
                <div
                  className={`w-full lg:w-1/2 ${
                    isOdd ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="relative overflow-hidden shadow-xl group">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>

                <div
                  className={`w-full lg:w-1/2 ${
                    isOdd ? "lg:order-2 lg:pl-8" : "lg:order-1 lg:pr-8"
                  }`}
                >
                  <div
                    className={`${
                      isOdd ? "lg:text-left" : "lg:text-right"
                    } text-left`}
                  >
                    <div className="mb-4">
                      <span className="text-6xl font-bold text-[#0100FD]">
                        {project.number}.
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600 mb-6">
                      {project.subtitle}
                    </p>
                    <div
                      className={`flex gap-1 ${
                        isOdd ? "lg:justify-start" : "lg:justify-end"
                      } justify-start`}
                    >
                      {[...Array(project.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-[#FFA500] text-[#FFA500]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
