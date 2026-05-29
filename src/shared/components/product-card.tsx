"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, Heart, ShoppingBag } from "lucide-react";

const BASE_URL = "https://maktab-shop.runflare.run";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const image =
    product.images?.[0] &&
    (product.images[0].startsWith("http")
      ? product.images[0]
      : `${BASE_URL}${product.images[0]}`);

  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product._id}`}
      className={`group relative block overflow-hidden rounded-[28px] border bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
        isOutOfStock ? "border-red-100 opacity-75" : "border-slate-200"
      }`}
    >
      {/* OUT OF STOCK */}
      {isOutOfStock && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
          <span className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-lg font-black text-white">
            ناموجود
          </span>
        </div>
      )}

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        {/* FAVORITE ICON */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:scale-110 hover:text-red-500"
        >
          <Heart size={18} />
        </button>

        <Image
          src={image || "/placeholder.png"}
          alt={product.name}
          width={600}
          height={600}
          className={`h-[280px] w-full transition duration-700 group-hover:scale-110 ${
            isOutOfStock ? "object-contain p-6 grayscale" : "object-contain p-6"
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>

      {/* CONTENT */}
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
            {product.category}
          </span>

          {isOutOfStock ? (
            <div className="flex items-center gap-1 text-sm font-bold text-red-500">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              ناموجود
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              موجود
            </div>
          )}
        </div>

        {/* NAME */}
        <h3 className="line-clamp-2 min-h-[64px] text-lg font-black leading-8 text-slate-800 transition-colors group-hover:text-orange-500">
          {product.name}
        </h3>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">قیمت محصول</p>

            <div className="mt-1 flex items-center gap-1">
              <span className="text-2xl font-black text-slate-900">
                {product.price.toLocaleString("fa-IR")}
              </span>

              <span className="text-sm text-slate-500">تومان</span>
            </div>
          </div>

          <div
            className={`block md:hidden flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition duration-300 ${
              isOutOfStock
                ? "bg-slate-300"
                : "bg-gradient-to-br from-orange-500 to-amber-400 shadow-orange-500/30 hover:scale-110"
            }`}
          >
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
}
