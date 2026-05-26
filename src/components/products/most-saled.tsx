"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Flame, ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const API_URL = "https://maktab-shop.runflare.run/api";
const BASE_URL = "https://maktab-shop.runflare.run";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

function ProductCard({ product }: { product: Product }) {
  const imageSrc =
    product.images?.length > 0
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `${BASE_URL}${product.images[0]}`
      : "/image/placeholder.png";

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block overflow-hidden rounded-[28px] border border-white/10 bg-white/80 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden">
        {/* Badge */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-orange-500/30">
          <Flame size={14} />
          پرفروش
        </div>

        {/* Image */}
        <div className="relative h-[260px] w-full overflow-hidden bg-white">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover object-center transition duration-500 group-hover:scale-110"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          {/* Category */}
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
            {product.category}
          </span>

          {/* Stock */}
          <div
            className={`flex items-center gap-1 text-sm ${
              product.stock > 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
              }`}
            />

            {product.stock > 0 ? "موجود" : "ناموجود"}
          </div>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 min-h-[64px] text-lg font-extrabold leading-8 text-slate-800 transition-colors group-hover:text-orange-500">
          {product.name}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">قیمت محصول</p>

            <div className="mt-1 flex items-center gap-1">
              <span className="text-xl font-black text-slate-900">
                {product.price?.toLocaleString("fa-IR")}
              </span>

              <span className="text-sm text-slate-500">تومان</span>
            </div>
          </div>

          {/* Cart Button */}
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 transition duration-300 hover:scale-110">
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function MostSaled() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/products`, {
          params: {
            limit: 6,
          },
        });

        const productsData =
          res.data?.data?.products ||
          res.data?.data ||
          res.data?.products ||
          res.data ||
          [];

        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-white">
            در حال بارگذاری محصولات...
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="py-20 text-center text-white">محصولی یافت نشد.</div>
        )}

        {/* Swiper */}
        {!loading && products.length > 0 && (
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
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
