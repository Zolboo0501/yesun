"use client";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Б.Болормаа",
    position: "Захирал",
    company: "Шангри-Ла Зочид Буудал",
    content:
      "VentCool Systems компанийн мэргэжлийн баг маш сайн ажилласан. Төслийг цаг хугацаандаа чанартай гүйцэтгэж, одоо хүртэл тогтвортой ажиллаж байна.",
  },
  {
    name: "Д.Ганбат",
    position: "Техникийн захирал",
    company: "МонПласт ХХК",
    content:
      "Манай үйлдвэрийн хоолойн системийг бүрэн шинэчлэх төсөл амжилттай хэрэгжлээ. Баг маш мэргэжлийн өндөр түвшинд ажилласан.",
  },
  {
    name: "Ц.Сарангэрэл",
    position: "Ерөнхий захирал",
    company: "Төв Шуудан",
    content:
      "Агааржуулалтын систем маш сайн ажиллаж байна. Засвар үйлчилгээний тогтмол дэмжлэг үзүүлдэгт баярлалаа.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#0100FD]/10 text-[#0100FD] rounded-full text-sm uppercase tracking-wider mb-4">
            Үнэлгээ
          </span>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            Үйлчлүүлэгчдийн <span className="text-[#0100FD]">сэтгэгдэл</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-xl transition-shadow"
            >
              <div className="absolute top-8 right-8 w-16 h-16 bg-[#0100FD]/10 rounded-full flex items-center justify-center">
                <Quote className="w-8 h-8 text-[#0100FD]" />
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed italic">
                {testimonial.content}
              </p>

              <div className="pt-6 border-t border-gray-200">
                <div className="text-lg text-gray-900 mb-1">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.position}
                </div>
                <div className="text-sm text-[#0100FD] mt-1">
                  {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
