"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const bannerSlides = [
  {
    id: 2,
    image: "/images/banner2.webp",
    title: "Мэргэжлийн шийдэл",
    description: "Таны бизнест зориулсан инновацийн технологи",
  },
  {
    id: 3,
    image: "/images/banner.webp",
    title: "Найдвартай түнш",
    description: "10 жилийн туршлага, мянга гаруй төсөл",
  },
];

const Banner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full h-[calc(100vh-7vh)]"
      opts={{
        loop: true,
      }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        <Banner1 />
      </CarouselContent>
    </Carousel>
  );
};

const Banner1 = () => {
  return (
    <div className="relative w-full h-screen bg-[url(/images/banner.webp)] bg-center bg-no-repeat bg-cover flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 text-white text-center px-4 gap-4 flex flex-col">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          ЕСӨН БЭЛЧИР ХХК
        </h1>
        <p className="text-xl md:text-2xl drop-shadow-md">
          АГААРСЭЛГЭЛТ, ХӨРГӨЛТИЙН СИСТЕМ
        </p>
      </div>
    </div>
  );
};
export default Banner;
