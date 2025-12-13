"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "../ImageWithFallback";

const slides = [
  {
    title: "Агааржуулалтын систем",
    subtitle: "Мэргэжлийн шийдэл",
    description:
      "Барилга байгууламж, үйлдвэр, оффист зориулсан орчин үеийн агааржуулалтын системийн бүрэн шийдэл",

    image: "/images/banner.webp",
  },
  {
    title: "Хөргөлтийн төхөөрөмж",
    subtitle: "Найдвартай систем",
    description:
      "Зочид буудал, худалдааны төв, аж үйлдвэрт зориулсан хөргөлтийн системийн суурилуулалт, засвар үйлчилгээ",
    image: "/images/banner2.webp",
  },
  {
    title: "Хоолойн систем",
    subtitle: "Бүрэн шийдэл",
    description:
      "Усан хангамж, халаалт, агааржуулалтын хоолойн системийн угсралт, суурилуулалт, шинэчлэлт",
    image:
      "https://images.unsplash.com/photo-1765218933298-dc55fdfb517a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGlwZXMlMjBzeXN0ZW18ZW58MXx8fHwxNzY1NjI0OTY0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSlideChange = (index: number) => {
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="relative h-screen">
        {slides.map((slide, index) => {
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent"></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
              </div>

              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 h-full items-center">
                  <div
                    className={`transition-all duration-700 delay-300 ${
                      index === currentSlide && !isAnimating
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-12 opacity-0"
                    }`}
                  >
                    <h1 className="text-5xl lg:text-7xl text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>

                    <p className="text-xl lg:text-2xl text-gray-400 mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20  flex items-center justify-center transition-all group z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20  flex items-center justify-center transition-all group z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </section>
  );
}
