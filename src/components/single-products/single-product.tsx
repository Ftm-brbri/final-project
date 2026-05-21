"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Heart, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

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
  const [adding, setAdding] = useState(false);

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

  const handleAddToCart = async () => {
    try {
      if (!product) return;

      if (product.stock <= 0) {
        toast.error("این محصول ناموجود است");
        return;
      }

      if (quantity > product.stock) {
        toast.error("موجودی کافی نیست");
        return;
      }

      setAdding(true);

      const token = localStorage.getItem("admin_token");

      await axios.post(
        `${API_URL}/cart/add`,
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(
        <div className="flex flex-col gap-2">
          <span>محصول به سبد خرید اضافه شد</span>
          <a
            href="/cart"
            className="text-sm font-bold text-orange-500 hover:underline"
          >
            برو به سبد خرید
          </a>
        </div>,
      );
    } catch (err) {
      console.error(err);
      toast.error("خطا در افزودن به سبد خرید");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 py-10 mt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
            <Image
              src={selectedImage || images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-contain p-6"
            />
          </div>

          <div>
            <h1 className="text-4xl font-black">{product.name}</h1>

            <div className="mt-3">
              <span
                className={`text-sm font-bold ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.stock > 0 ? `موجودی: ${product.stock}` : "ناموجود"}
              </span>
            </div>

            <div className="mt-6 text-3xl font-black text-orange-500">
              {product.price.toLocaleString("fa-IR")} تومان
            </div>

            <p className="mt-6 text-slate-600 leading-8">
              {product.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                className="h-10 w-10 rounded-xl text-white flex items-center justify-center bg-linear-to-r from-orange-500 to-amber-400"
              >
                <Minus size={18} />
              </button>

              <span className="w-10 text-center font-bold">{quantity}</span>

              <button
                onClick={() => setQuantity((p) => p + 1)}
                className="h-10 w-10 rounded-xl text-white flex items-center justify-center bg-linear-to-r from-orange-500 to-amber-400"
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 font-bold text-white disabled:opacity-50"
            >
              <ShoppingBag />
              {adding ? "در حال افزودن..." : "افزودن به سبد خرید"}
            </button>

            <div className="mt-6 flex gap-4">
              <button className="rounded-xl border p-3">
                <Heart />
              </button>
              <button className="rounded-xl border p-3">
                <Share2 />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
