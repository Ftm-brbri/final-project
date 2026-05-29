"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroBanner() {
  const [offset, setOffset] = useState(200);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY - window.screen.height - 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = () => {
    router.push("/products?category=stoke");
  };

  return (
    <section className="hidden md:block relative h-105 w-full overflow-hidden">
      {/* IMAGE */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translateY(${offset * 0.15}px) scale(1.15)`,
        }}
      >
        <Image
          style={{
            top: "-120px",
          }}
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
        <button
          onClick={handleNavigate}
          className="mt-8 rounded-2xl bg-white px-8 py-4 font-extrabold text-2xl text-black transition hover:bg-orange-500 hover:text-white"
        >
          قدم اول رو بردار
        </button>
      </div>
    </section>
  );
}
