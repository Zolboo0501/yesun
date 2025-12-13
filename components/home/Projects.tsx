"use client";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";

const projects = [
  {
    title: "Шангри-Ла Зочид Буудал",
    category: "Агааржуулалт & Хөргөлт",
    location: "Улаанбаатар",
    year: "2023",
    description:
      "Зочид буудлын төв агааржуулалт болон хөргөлтийн системийн бүрэн шийдэл",
    image:
      "https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjU2MjQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Төв Шуудан Оффис",
    category: "Агааржуулалт",
    location: "Улаанбаатар",
    year: "2024",
    description: "Оффисын орчин үеийн агааржуулалтын систем, автоматжуулалт",
    image:
      "https://images.unsplash.com/photo-1559569283-327b99858782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodmFjJTIwY29vbGluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjU2MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "МонПласт Үйлдвэр",
    category: "Хоолойн систем",
    location: "Дархан",
    year: "2023",
    description: "Үйлдвэрийн хоолойн системийн угсралт, суурилуулалт",
    image:
      "https://images.unsplash.com/photo-1765218933298-dc55fdfb517a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGlwZXMlMjBzeXN0ZW18ZW58MXx8fHwxNzY1NjI0OTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Сэнтрал Тауэр",
    category: "Агааржуулалт & Үйлдвэрлэл",
    location: "Улаанбаатар",
    year: "2024",
    description:
      "Оффисын цогцолборын агааржуулалтын систем болон хоолойн үйлдвэрлэл",
    image:
      "https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjU2MjQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Эрдэнэт Үйлдвэр",
    category: "Хөргөлт & Засвар",
    location: "Эрдэнэт",
    year: "2023",
    description:
      "Үйлдвэрийн хөргөлтийн системийн суурилуулалт болон засвар үйлчилгээ",
    image:
      "https://images.unsplash.com/photo-1559569283-327b99858782?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodmFjJTIwY29vbGluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjU2MTU0MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Хаан Банк Төв Оффис",
    category: "Агааржуулалт",
    location: "Улаанбаатар",
    year: "2024",
    description:
      "Банкны төв байрны агааржуулалт, хөргөлтийн системийн шинэчлэл",
    image:
      "https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjU2MjQ4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-black text-sm uppercase tracking-wider text-white">
            Төслүүд
          </span>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            Амжилттай <span className="text-[#0100FD]">төслүүд</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Бид олон төрлийн төсөл амжилттай хэрэгжүүлсэн туршлагатай
          </p>
        </div>

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
                <h3 className="text-2xl text-gray-900 mb-3 group-hover:text-[#0100FD] transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
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

                <button className="mt-6 text-[#0100FD] hover:text-[#FE0002] transition-colors flex items-center gap-2 group">
                  <span>Дэлгэрэнгүй үзэх</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="bg-[#0100FD] text-white px-10 py-4 hover:bg-[#0100FD]/90 transition-all shadow-lg hover:shadow-xl">
            Бүх төслүүдийг үзэх
          </button>
        </div>
      </div>
    </section>
  );
}
