"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { slides } from "../../constants/swiper-slides";
import Image from "next/image";

export default function HeroSlider() {
  return (
    <div className="relative pb-16">
      <Swiper
        dir="ltr"
        className="hero-swiper"
        modules={[Pagination, Autoplay]}
        pagination={{
          el: ".hero-pagination",
          clickable: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        rewind
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full h-full p-0 ">
              <div className="relative w-full h-full min-h-87.5 md:h-112.5 overflow-hidden bg-primary">
                <Image
                  src={slide.imageMobile}
                  alt="slider image mobile"
                  className="block md:hidden w-full h-full object-contain"
                />

                <Image
                  src={slide.imageDesktop}
                  alt="slider image desktop"
                  className="hidden md:block w-full h-full object-cover"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-pagination flex justify-center gap-1.5 mt-8"></div>
    </div>
  );
}
