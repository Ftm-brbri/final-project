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
    <div className="relative h-[420px] w-full overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          transform: `translateY(${offset * 0.3}px)`,
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

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 md:px-16">
        <h1 className="text-3xl font-black text-white md:text-5xl">
          با استوک حرفه‌ای
        </h1>

        <p className="mt-4 text-white/80">بازی رو مال خودت کن</p>

        <button className="mt-6 rounded-xl bg-white px-6 py-3 font-bold text-black hover:bg-orange-500 hover:text-white transition">
          همه مدل‌ها
        </button>
      </div>
    </div>
  );
}
