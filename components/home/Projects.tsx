"use client";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import Link from "next/link";

const projects = [
  {
    title: "Монгол банкны үндэсний цахим гүйлгээний төв",
    category: "Агааржуулалт",
    location: "Улаанбаатар",
    year: "2019",
    description: "Барилгын агаар сэлгэлтийн систем",
    image: "/images/project3.webp",
  },
  {
    title: "Хүннү 2222",
    category: "Агааржуулалт",
    location: "Улаанбаатар",
    year: "2020",
    description:
      "Төслийн 2–рээлжийн орон сууцны нэгдсэн граж барилгын агаар сэлгэлт, Хөргөлтийн системийн угсралт",
    image: "/images/project6.webp",
  },

  {
    title: "Хүннү 2222",
    category: "Агааржуулалт",
    location: "Улаанбаатар",
    year: "2020",
    description:
      "Төслийн 2–р ээлжийн орон сууц Барилгын агаар сэлгэлтийн систем",
    image: "/images/project4.webp",
  },
  {
    title: "Чингис хаан музей",
    category: "Агааржуулалт & Хөргөлт",
    location: "Улаанбаатар",
    year: "2021",
    description:
      "Барилгын Агаар сэлгэлтийн системийн угсралт тоног төхөөрөмж нийлүүлэх, хөргөлтийн системийн угсралт",
    image: "/images/project2.webp",
  },
  {
    title: "Эрдэнэс Таван Толгойн Нүүрс Баяжуулах үйлдвэр",
    category: "Агааржуулалт",
    location: "Өмнөговь",
    year: "2024",
    description: "Төслийн үйлдвэрийн барилга агаар сэлгэлт",
    image: "/images/project.webp",
  },

  {
    title: "Сансар Гарден",
    category: "Агааржуулалт & Хөргөлт",
    location: "Улаанбаатар",
    year: "2024",
    description:
      "Орон сууцны хотхоны 2 блок барилгын агаар сэлгэлт, хөргөлтийн систем",
    image: "/images/project13.webp",
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
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
            className="text-3xl lg:text-4xl text-gray-900 mb-6"
          >
            Амжилттай <span className="text-[#0100FD]">төслүүд</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Бид олон төрлийн төсөл амжилттай хэрэгжүүлсэн туршлагатай
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-black text-white text-xs px-4 py-2 uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-xl text-gray-900 mb-3 group-hover:text-[#0100FD] transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0100FD]" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0100FD]" />
                    <span>{project.year}</span>
                  </div>
                </div>

                <Link href={"/projects"} className="hover:cursor-pointer">
                  <button className="mt-6 text-[#0100FD] hover:text-[#FE0002] transition-colors flex items-center gap-2 group">
                    <span>Дэлгэрэнгүй үзэх</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <Link className="flex justify-center" href={"/projects"}>
          <button className="bg-[#0100FD] text-sm text-white px-10 py-4 hover:bg-[#0100FD]/90 transition-all shadow-lg hover:shadow-xl">
            Бүх төслүүдийг үзэх
          </button>
        </Link>
      </div>
    </section>
  );
}

export default Projects;
