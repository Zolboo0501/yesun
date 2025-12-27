"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback";
import { useRef, useState } from "react";

const partners = [
  {
    id: 1,
    name: "KANION",
    image: "/images/factory5.jpg",
  },
  {
    id: 2,
    name: "AUX",
    image: "/images/factory6.jpg",
  },
  {
    id: 3,
    name: "SHUFT",
    image: "/images/factory7.jpg",
  },
  {
    id: 4,
    name: "BALLU",
    image: "/images/factory8.jpg",
  },
  {
    id: 5,
    name: "BALLU",
    image: "/images/factory18.jpg",
  },
];

export function LeftSide() {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const [slideIndex, setSlideIndex] = useState(0);
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative w-full"
          >
            <Carousel
              plugins={[plugin.current]}
              setApi={(api) => {
                api?.on("select", () => {
                  setSlideIndex(api.selectedScrollSnap());
                });
              }}
              className="w-full"
            >
              <CarouselContent>
                {partners.map((partner) => (
                  <CarouselItem key={partner.id}>
                    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg bg-white p-8">
                      <ImageWithFallback
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {partners.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === slideIndex
                      ? "w-8 bg-[#0100FD]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="p-4 border-2 border-gray-100 shadow-xs"
          >
            <p className="text-sm text-gray-600 mb-6 leading-relaxed text-justify">
              Бид олон улсын стандарт, норм дүрмийг мөрдөн ажиллаж, бүтээгдэхүүн
              бүрийн чанар, найдвартай ажиллагаа, аюулгүй байдлыг хатуу хяналт
              дор баталгаажуулдаг. Үйлдвэрлэлд ашиглагдаж буй материал, тоног
              төхөөрөмж нь эрчим хүчний өндөр хэмнэлттэй, байгаль орчинд ээлтэй
              шийдлүүдэд тулгуурласан бөгөөд хэрэглэгчдийн ашиглалтын зардлыг
              бууруулахад чиглэгддэг.
            </p>
          </motion.div>

          {/* Right Carousel */}
        </div>
      </div>
    </section>
  );
}
