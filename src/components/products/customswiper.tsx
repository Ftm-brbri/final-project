"use client";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { slides } from "../../constants/swiper-slides";

export default function HeroSlider() {
  return (
    <div className="relative w-full h-fit pb-0">
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
            <div className="w-full h-full ">
              <div className="relative w-full h-full overflow-hidden bg-primary">
                <img
                  src={slide.imageMobile}
                  alt="slider image mobile"
                  className="block md:hidden w-full h-full object-contain"
                />

                <img
                  src={slide.imageDesktop}
                  alt="slider image desktop"
                  className="hidden md:block w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-pagination absolute bottom-6 w-full z-10 flex justify-center gap-1.5 [&_.swiper-pagination-bullet]:bg-gray-300 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]!bg-gray-700"></div>
    </div>
  );
}
