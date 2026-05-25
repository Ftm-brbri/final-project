"use client";

import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "@/src/lib/favorite-api";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = "https://maktab-shop.runflare.run";

type FavoriteProduct = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
};

export default function FavoritesPage() {
  const [products, setProducts] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavorites();

        const data =
          res?.data ||
          res?.favorites ||
          [];

        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeItem = async (id: string) => {
    const res = await removeFavorite(id);

    if (res?.success) {
      setProducts((prev) =>
        prev.filter((item) => item._id !== id),
      );

      toast.success("از علاقه‌مندی حذف شد");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-2xl bg-red-100 p-3 text-red-500">
            <Heart className="fill-red-500" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-900">
              علاقه‌مندی‌ها
            </h1>

            <p className="mt-1 text-slate-500">
              {products.length.toLocaleString("fa-IR")} محصول
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-20 text-center shadow-sm">
            <Heart className="mx-auto mb-4 h-16 w-16 text-slate-300" />

            <h2 className="text-2xl font-black text-slate-800">
              علاقه‌مندی شما خالی است
            </h2>

            <p className="mt-3 text-slate-500">
              محصولات مورد علاقه خود را ذخیره کنید
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:scale-105"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const image = product.images?.[0]
                ? `${BASE_URL}${product.images[0]}`
                : "/placeholder.png";

              return (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <Link href={`/products/${product._id}`}>
                    <div className="relative h-72 overflow-hidden bg-slate-100">
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="space-y-4 p-5">
                    <h2 className="line-clamp-2 text-lg font-bold text-slate-800">
                      {product.name}
                    </h2>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-orange-500">
                        {product.price.toLocaleString("fa-IR")}
                      </span>

                      <span className="text-sm text-slate-500">
                        تومان
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/products/${product._id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-3 font-bold text-white"
                      >
                        <ShoppingBag size={18} />
                        مشاهده
                      </Link>

                      <button
                        onClick={() => removeItem(product._id)}
                        className="rounded-2xl border border-red-200 p-3 text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}