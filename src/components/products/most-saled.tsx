"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Flame, ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";



type Product = {
  id: number;
  title: string;
  price: string;
  image: string;
  category: string;
  href: string;
};

const products: Product[] = [
  {
    id: 1,
    title: "کفش ورزشی مردانه نایک",
    price: "4,800,000",
    image: "/image/pro_56532_558.webp",
    category: "کفش ورزشی",
    href: "/products/1",
  },
  {
    id: 2,
    title: "کفش والیبال زنانه اسیکس",
    price: "2,500,000",
    image: "/image/pro_61092_558.webp",
    category: "والیبال",
    href: "/products/2",
  },
  {
    id: 3,
    title: "کفش ورزشی مردانه اسپورتلند",
    price: "3,500,000",
    image: "/image/pro_56418_558.webp",
    category: "اسپرت",
    href: "/products/3",
  },
  {
    id: 4,
    title: "تی شرت اسپرت مردانه نایک",
    price: "2,700,000",
    image: "/image/pro_56701_558.webp",
    category: "لباس ورزشی",
    href: "/products/4",
  },
  {
    id: 5,
    title: "کفش پیاده روی مردانه اسپورتلند",
    price: "1,500,000",
    image: "/image/pro_56785_558.webp",
    category: "پیاده روی",
    href: "/products/5",
  },
  {
    id: 6,
    title: "کفش روزانه زنانه نایک",
    price: "3,700,000",
    image: "/image/pro_59512_558.webp",
    category: "روزانه",
    href: "/products/6",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={product.href}
      className="group block overflow-hidden rounded-[28px] border border-white/10 bg-white/80 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden">
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-orange-500/30">
          <Flame size={14} />
          پرفروش
        </div>

        <Image
          src={product.image}
          alt={product.title}
          width={500}
          height={500}
          className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
            {product.category}
          </span>

          <div className="flex items-center gap-1 text-sm text-emerald-600">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            موجود
          </div>
        </div>

        <h3 className="line-clamp-2 text-lg font-extrabold leading-8 text-slate-800 transition-colors group-hover:text-orange-500">
          {product.title}
        </h3>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">قیمت محصول</p>

            <div className="mt-1 flex items-center gap-1">
              <span className="text-xl font-black text-slate-900">
                {product.price}
              </span>

              <span className="text-sm text-slate-500">تومان</span>
            </div>
          </div>

          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 transition duration-300 hover:scale-110">
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
}


export function MostSaled() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-950" />

      <div className="absolute left-0 top-0 h-[350px] w-[350px] rounded-full bg-orange-500/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-amber-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400 backdrop-blur-xl">
              <Flame size={16} />
              محبوب‌ترین محصولات فروشگاه
            </div>

            <h2 className="text-4xl font-black text-white md:text-5xl">
              پرفروش‌ترین محصولات
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              بهترین و محبوب‌ترین محصولات ورزشی فروشگاه اسپرتکس را
              مشاهده کنید.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white backdrop-blur-xl transition hover:border-orange-500 hover:bg-orange-500"
          >
            مشاهده همه محصولات

            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />
          </Link>
        </div>

        {/* Swiper */}
         <Swiper
          modules={[Autoplay, Navigation]}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={24}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="!overflow-hidden"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}