"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Heart, Minus, Plus, Share2, ShoppingBag } from "lucide-react";

const API_URL = "https://maktab-shop.runflare.run/api";
const BASE_URL = "https://maktab-shop.runflare.run";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand?: string;
  images: string[];
};

type Props = {
  productId: string;
};

export default function SingleProductPage({ productId }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/products/${productId}`);

        const data = res.data?.data || res.data?.product || res.data;

        setProduct(data);

        if (data.images?.length > 0) {
          const firstImage = data.images[0].startsWith("http")
            ? data.images[0]
            : `${BASE_URL}${data.images[0]}`;

          setSelectedImage(firstImage);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        در حال بارگذاری محصول...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-red-500">
        محصول یافت نشد.
      </div>
    );
  }

  const images =
    product.images?.map((img) =>
      img.startsWith("http") ? img : `${BASE_URL}${img}`,
    ) || [];

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 mt-10"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <span>خانه</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/*  GALLERY  */}
          <div className="flex flex-col-reverse gap-4 lg:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-3 lg:flex-col">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-24 w-24 overflow-hidden rounded-2xl border-2 ${
                    selectedImage === img
                      ? "border-orange-500"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 overflow-hidden rounded-[32px] bg-white shadow-xl h-fit">
              <div className="relative aspect-square w-full">
                <Image
                  style={{
                    objectPosition: "top",
                  }}
                  src={selectedImage || images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/*  INFO  */}
          <div>
            {/* Category */}
            <div className="mb-3 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
              {product.category}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black leading-[60px] text-slate-900 md:text-5xl">
              {product.name}
            </h1>

            {/* Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span>کد محصول: {product._id.slice(-6)}</span>

              {product.brand && (
                <>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>برند: {product.brand}</span>
                </>
              )}

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span
                className={
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }
              >
                {product.stock > 0 ? "موجود در انبار" : "ناموجود"}
              </span>
            </div>

            {/* Price */}
            <div className="mt-8 flex items-end gap-4">
              <span className="text-4xl font-black text-orange-500 md:text-5xl">
                {product.price.toLocaleString("fa-IR")}
              </span>

              <span className="pb-1 text-lg font-bold text-slate-600">
                تومان
              </span>
            </div>

            {/* Description */}
            <p className="mt-8 leading-9 text-slate-600">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-10">
              <h3 className="mb-4 font-bold text-slate-800">تعداد</h3>

              <div className="flex h-14 w-fit items-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="flex h-full w-14 items-center justify-center hover:bg-slate-100"
                >
                  <Minus size={18} />
                </button>

                <div className="flex h-full w-16 items-center justify-center border-x border-slate-200 text-lg font-bold">
                  {quantity}
                </div>

                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="flex h-full w-14 items-center justify-center hover:bg-slate-100"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <button className="group flex h-16 flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 text-lg font-bold text-white shadow-xl">
                <ShoppingBag size={22} />
                افزودن به سبد خرید
              </button>

              <button className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-orange-500">
                <Heart size={22} />
              </button>

              <button className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-orange-500">
                <Share2 size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
