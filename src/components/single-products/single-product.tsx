"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  HeartOff,
  Minus,
  Plus,
  Share2,
  Undo2,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  Check,
} from "lucide-react";

import toast from "react-hot-toast";

import { addToCart, getCartItemCount } from "@/src/lib/cart-api";
import { isUserLoggedIn } from "@/src/lib/auth-keys";
import { notifyCartUpdated } from "@/src/lib/cart-events";
import { setCartItemCount } from "@/src/store/cartSlice";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "@/src/lib/userAxios";

import { addToFavorites } from "@/src/lib/favorite-api";

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
  const dispatch = useDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // fav
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE_URL}/products/${productId}`);

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
      <div className="flex min-h-[70vh] items-center justify-center text-slate-500">
        در حال بارگذاری محصول...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-red-500">
        محصول یافت نشد.
      </div>
    );
  }

  const images =
    product.images?.map((img) =>
      img.startsWith("http") ? img : `${BASE_URL}${img}`,
    ) || [];

  //add
  const handleAddToCart = async () => {
    if (!product) return;

    if (!isUserLoggedIn()) {
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-800">
              برای افزودن به سبد خرید ابتدا وارد شوید
            </span>

            <a
              href="/auth"
              className="text-sm font-bold text-orange-500 underline"
              onClick={() => toast.dismiss(t.id)}
            >
              رفتن به صفحه ورود
            </a>
          </div>
        ),
        {
          duration: 5000,
        },
      );

      return;
    }

    if (product.stock <= 0) {
      toast.error("این محصول ناموجود است");
      return;
    }

    if (quantity > product.stock) {
      toast.error("موجودی کافی نیست");
      return;
    }

    try {
      setAdding(true);

      const res = await addToCart(product._id, quantity);

      if (!res?.success) {
        toast.error(res?.message || "خطا در افزودن به سبد خرید");
        return;
      }

      const count = getCartItemCount(res.data ?? null);

      dispatch(setCartItemCount(count));
      notifyCartUpdated(count);

      toast.success(
        (t) => (
          <div className="flex flex-col gap-2">
            <span className="text-sm">
              {res.message || "محصول به سبد خرید اضافه شد"}
            </span>

            <a
              href="/cart"
              className="text-sm font-bold text-orange-500 underline"
              onClick={() => toast.dismiss(t.id)}
            >
              برو به سبد خرید
            </a>
          </div>
        ),
        {
          duration: 4000,
        },
      );
    } catch {
      toast.error("خطا در افزودن به سبد خرید");
    } finally {
      setAdding(false);
    }
  };
  // update cart
  const handleUpdateCart = async (currentQuantity: number) => {
    console.log(currentQuantity);
    if (!product) return;

    try {
      setAdding(true);

      const res = await addToCart(product._id, currentQuantity - 1);

      if (!res?.success) {
        toast.error(res?.message || "خطا در به‌روزرسانی سبد خرید");
        return;
      }

      const stock = getCartItemCount(res.data ?? null);
      dispatch(setCartItemCount(stock));
      notifyCartUpdated(stock);

      toast.success("تعداد با موفقیت به‌روزرسانی شد", { duration: 3000 });

      setShowControls(false);
    } catch {
      toast.error("موجودی کافی نیست");
    } finally {
      setAdding(false);
    }
  };
  //fav
  const handleAddToFavorite = async () => {
    if (!product) return;

    if (!isUserLoggedIn()) {
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-slate-800">
              برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید
            </span>

            <a
              href="/auth"
              className="text-sm font-bold text-orange-500 underline"
              onClick={() => toast.dismiss(t.id)}
            >
              رفتن به صفحه ورود
            </a>
          </div>
        ),
        {
          duration: 5000,
        },
      );

      return;
    }

    try {
      setFavoriteLoading(true);

      const res = await addToFavorites(product._id);

      if (!res?.success) {
        toast.error(res?.message || "خطا در افزودن");
        return;
      }

      setIsFavorite(true);

      toast.success(
        (t) => (
          <div className="flex flex-col gap-2">
            <span className="text-sm">محصول به علاقه‌مندی‌ها اضافه شد</span>

            <a
              href="/favorites"
              className="text-sm font-bold text-orange-500 underline"
              onClick={() => toast.dismiss(t.id)}
            >
              مشاهده علاقه‌مندی‌ها
            </a>
          </div>
        ),
        {
          duration: 4000,
        },
      );
    } catch {
      toast.error("خطا در افزودن به علاقه‌مندی‌ها");
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <section dir="rtl" className="min-h-screen bg-slate-50 pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="relative aspect-square overflow-hidden rounded-4xl bg-white shadow-xl">
              {product.stock === 0 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                  <span className="rounded-2xl bg-red-500 px-6 py-3 text-lg font-black text-white shadow-xl">
                    ناموجود
                  </span>
                </div>
              )}

              <Image
                src={selectedImage || images[0] || "/placeholder.png"}
                alt={product.name}
                fill
                priority
                className={`object-contain p-6 transition duration-500 ${
                  product.stock === 0 ? "opacity-50 grayscale" : ""
                }`}
              />
            </div>

            {/* thumb */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-24 w-24 overflow-hidden rounded-2xl border-2 transition ${
                      selectedImage === img
                        ? "border-orange-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`thumb-${index}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/*info*/}
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-600">
                  <Check size={16} />
                  موجود در انبار
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-500">
                  ناموجود
                </span>
              )}
            </div>

            <h1 className="text-4xl leading-17.5 font-black text-slate-900">
              {product.name}
            </h1>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-orange-500">
                  {product.price.toLocaleString("fa-IR")}
                </span>

                <span className="pb-2 text-lg text-slate-500">تومان</span>
              </div>

              <div className="mt-6 h-px bg-slate-100" />

              <div className="mt-6 relative flex w-full flex-col">
                <button
                  onClick={() => {
                    if (showControls) {
                      handleUpdateCart(quantity); // باید تابعی برای آپدیت (معمولا با متد PUT/PATCH) داشته باشید
                    } else {
                      handleAddToCart();
                      setShowControls(true);
                    }
                  }}
                  disabled={adding || product.stock === 0}
                  className="relative z-20 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag size={20} />
                  {adding
                    ? "در حال پردازش..."
                    : showControls
                      ? "به روز رسانی سبد خرید"
                      : "افزودن به سبد خرید"}
                </button>
                <div
                  className={`absolute left-0 right-0 top-full z-10 flex flex-wrap items-center justify-between gap-4 transition-all duration-500 ease-in-out ${
                    showControls
                      ? "pointer-events-auto translate-y-4 opacity-100"
                      : "pointer-events-none -translate-y-10 opacity-0"
                  }`}
                >
                  {/* Quantity */}
                  <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition hover:bg-orange-50"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-14 text-center text-lg font-black">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          product ? Math.min(prev + 1, product.stock) : prev,
                        )
                      }
                      disabled={quantity >= product.stock}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-orange-500 to-amber-400 text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                      product.stock > 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {product.stock > 0
                      ? `موجودی: ${product.stock.toLocaleString("fa-IR")} عدد`
                      : "ناموجود"}
                  </div>
                </div>
                <div
                  className={`transition-all duration-500 ${showControls ? "h-20" : "h-0"}`}
                ></div>
              </div>

              {/*action*/}
              <div className="mt-5 flex items-center gap-3">
                {/*fav*/}
                <button
                  onClick={handleAddToFavorite}
                  disabled={favoriteLoading}
                  className={`group flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 ${
                    isFavorite
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  {isFavorite ? (
                    <Heart className="fill-red-500 text-red-500" />
                  ) : (
                    <HeartOff />
                  )}
                </button>

                {/*share*/}
                <button className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500">
                  <Share2 />
                </button>
              </div>
            </div>

            {/*desc*/}
            <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900">
                توضیحات محصول
              </h2>

              <p className="mt-5 leading-9 text-slate-600">
                {product.description || "توضیحاتی برای این محصول ثبت نشده است."}
              </p>
            </div>

            {/* FEATURES */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <Truck className="text-orange-500" />

                <h3 className="mt-4 font-black text-slate-800">ارسال سریع</h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  ارسال به سراسر کشور در کوتاه‌ترین زمان
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <ShieldCheck className="text-orange-500" />

                <h3 className="mt-4 font-black text-slate-800">ضمانت کیفیت</h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  تضمین کیفیت و اصالت تمامی محصولات
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <Undo2 className="text-orange-500" />

                <h3 className="mt-4 font-black text-slate-800">بازگشت کالا</h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  امکان بازگشت کالا تا ۷ روز
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-16 rounded-4xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                نظرات کاربران
              </h2>

              <p className="mt-2 text-slate-500">
                هنوز نظری برای این محصول ثبت نشده است
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <MessageCircle className="text-orange-500" size={32} />
            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-800">
              هنوز نظری ثبت نشده
            </h3>

            <p className="mt-3 text-slate-500">
              اولین نفری باشید که برای این محصول نظر می‌دهد
            </p>
          </div>
        </div>

        {/* BACK TO PRODUCTS */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
          >
            بازگشت به محصولات
          </Link>
        </div>
      </div>
    </section>
  );
}
