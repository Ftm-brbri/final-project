"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroBanner() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-[420px] w-full overflow-hidden">
      {/* IMAGE */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translateY(${offset * 0.15}px) scale(1.15)`,
        }}
      >
        <Image
          src="/image/367-3.jpg"
          alt="sport shoes image"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/45" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 md:px-16">
        <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
          با استوک حرفه‌ای
        </h1>

        <p className="mt-4 text-lg text-white/80">بازی رو مال خودت کن</p>

        <button className="mt-8 rounded-2xl bg-white px-8 py-4 font-bold text-black transition hover:bg-orange-500 hover:text-white">
          همه مدل‌ها
        </button>
      </div>
    </section>
  );
}
