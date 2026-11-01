"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";
import { ImageWithFallback } from "../ImageWithFallback";

const productImages = [
  "/images/kanon.webp",
  "/images/kanon2.webp",
  "/images/kanon3.jpg",
];

const Banner = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const [plugin] = useState(() =>
    Autoplay({
      delay: 2000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    }),
  );

  return (
    <section className="py-24 bg-gray-50 h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row flex-1 gap-12">
        <div className="flex flex-6 flex-col gap-1.5 mt-[5%]">
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight">
            Есөн бэлчир ХХК
            <br />
            <span className="text-[#0100FD]">Таны найдвартай түнш</span>
          </h2>

          <div className="space-y-4 text-sm text-justify text-gray-600 mb-6 leading-relaxed">
            <p>
              Бид Монголын хэрэглэгчдэд агаар сэрүүцэгч, халаалтын систем,
              агаарын чанар сайжруулах төхөөрөмж болон бусад холбогдох тоног
              төхөөрөмжийн жинхэнэ бүтээгдэхүүнүүдийг нийлүүлж байна.
            </p>
            <p>
              Манай компани олон улсын шилдэг брэндүүдийн албан ёсны төлөөлөгч
              бөгөөд бүтээгдэхүүний чанар, баталгаа, мэргэжлийн суурилуулалт
              болон засвар үйлчилгээний үйлчилгээг бүрэн хэмжээгээр хангадаг.
            </p>
          </div>
        </div>
        <div className="flex flex-6 relative flex-col">
          <Carousel
            plugins={[plugin]}
            setApi={(api) => {
              api?.on("select", () => {
                setSlideIndex(api.selectedScrollSnap());
              });
            }}
            className="w-full h-full"
          >
            <CarouselContent>
              {productImages.map((product: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-full overflow-hidden rounded-lg bg-white p-8">
                    <ImageWithFallback
                      src={product}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center gap-2 mt-4">
            {productImages.map((_, index) => (
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
        </div>
      </div>
    </section>
  );
};

export default Banner;
