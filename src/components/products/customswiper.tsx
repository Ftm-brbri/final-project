"use client";

// import "swiper/css";
// import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { slides } from "../../constants/swiper-slides";

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
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full h-full p-0 ">
              <div className="relative w-full h-full min-h-[350px] md:h-[450px]  overflow-hidden bg-primary">
                <img
                  src={slide.imageMobile}
                  alt="slider image mobile"
                  className="block md:hidden w-full h-full object-contain"
                />

                <img
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
