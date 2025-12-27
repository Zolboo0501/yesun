"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { ImageWithFallback } from "../ImageWithFallback";

const partners = [
  {
    id: "factory13",
    name: "KANION",
    image: "/images/factory13.jpg",
  },
  {
    id: "factory14",
    name: "AUX",
    image: "/images/factory14.jpg",
  },
  {
    id: "factory15",
    name: "SHUFT",
    image: "/images/factory15.jpg",
  },
  {
    id: "factory16",
    name: "BALLU",
    image: "/images/factory16.jpg",
  },
];

const Full = () => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <section id="about" className="pb-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <p className="text-xl text-gray-600 mb-6 text-center leading-relaxed">
            Бид мэргэшсэн инженер, техникийн өндөр ур чадвартай хамт олноороо
            дамжуулан үйлдвэр, худалдаа үйлчилгээ, оффис, орон сууц, эмнэлэг,
            сургууль зэрэг төрөл бүрийн барилга байгууламжид тохирсон уян хатан,
            үр ашигтай шийдлүүдийг боловсруулж нийлүүлдэг. Харилцагчийн
            хэрэгцээ, орчны онцлогт нийцсэн шийдлийг санал болгож, урт хугацааны
            найдвартай түншлэл бий болгох нь бидний үндсэн зорилго юм.
          </p>
        </motion.div>
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
                      key={`${partner.id}-${partner.image}`}
                      src={partner.image}
                      alt={partner.id}
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
      </div>
    </section>
  );
};

export default Full;
