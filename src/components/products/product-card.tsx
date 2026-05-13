"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

type ProductCardProps = {
  product: Product;
};

const BASE_URL = "https://maktab-shop.runflare.run";

function getImageSrc(image?: string) {
  if (!image) return "/image/placeholder.png";

  // If backend already returns full URL
  if (image.startsWith("http")) {
    return image;
  }

  // If backend returns relative path
  return `${BASE_URL}${image}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = getImageSrc(product.images?.[0]);

  return (
    <div
      dir="rtl"
      className="group overflow-hidden rounded-[28px] bg-slate-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* IMAGE */}
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          {/* BADGE */}
          <span className="absolute right-4 top-4 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white shadow">
            پرفروش
          </span>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-5">
        {/* STOCK + CATEGORY */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <span
            className={`font-bold ${
              product.stock > 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {product.stock > 0 ? "● موجود" : "● ناموجود"}
          </span>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-500">
            {product.category}
          </span>
        </div>

        {/* TITLE */}
        <Link href={`/products/${product._id}`}>
          <h3 className="line-clamp-2 min-h-[64px] text-xl font-black leading-8 text-slate-800 transition group-hover:text-orange-500">
            {product.name}
          </h3>
        </Link>

        {/* DIVIDER */}
        <div className="my-4 h-px bg-slate-200" />

        {/* PRICE + BUTTON */}
        <div className="flex items-end justify-between gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg transition hover:scale-105">
            <ShoppingBag size={20} />
          </button>

          <div className="text-left">
            <p className="text-xs font-semibold text-slate-400">قیمت محصول</p>

            <p className="text-2xl font-black text-slate-800">
              {product.price.toLocaleString("fa-IR")}
              <span className="mr-1 text-base font-bold text-slate-500">
                تومان
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
