// src/app/product/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_URL = "https://maktab-shop.runflare.run/api";
const BASE_URL = "https://maktab-shop.runflare.run";

type Product = {
  _id: string;
  name: string;
  title?: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/products`, {
          params: {
            limit: 100,
          },
        });

        const allProducts: Product[] =
          res.data?.data?.products ||
          res.data?.data ||
          res.data?.products ||
          res.data ||
          [];

        const filteredProducts = category
          ? allProducts.filter(
              (product) =>
                product.category?.toLowerCase() === category.toLowerCase(),
            )
          : allProducts;

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        در حال بارگذاری محصولات...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-10" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">
            {category ? `محصولات دسته‌بندی ${category}` : "همه محصولات"}
          </h1>

          <p className="mt-2 text-slate-500">
            {products.length.toLocaleString("fa-IR")} محصول یافت شد
          </p>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <p className="text-lg text-slate-500">
              محصولی در این دسته‌بندی یافت نشد.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const imageUrl =
                product.images?.length > 0
                  ? product.images[0].startsWith("http")
                    ? product.images[0]
                    : `${BASE_URL}${product.images[0]}`
                  : "/image/placeholder.png";

              return (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-slate-100">
                    <Image
                      src={imageUrl}
                      alt={product.name || product.title || "product"}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="line-clamp-2 min-h-[56px] font-bold text-slate-800">
                      {product.name || product.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {product.category}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-black text-orange-500">
                        {product.price?.toLocaleString("fa-IR")} تومان
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          product.stock > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {product.stock > 0 ? "موجود" : "ناموجود"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
