"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, PackageSearch, Layers } from "lucide-react";

const ADMIN_CATEGORIES = [
  {
    id: 1,
    title: "ست‌های ورزشی",
    slug: "set",
    image: "/image/367-4.jpg",
    count: 12,
  },
  {
    id: 2,
    title: "کفش مردانه",
    slug: "men shoes",
    image: "/image/357-2.jpg",
    count: 8,
  },
  {
    id: 3,
    title: "کفش زنانه",
    slug: "women shoes",
    image: "/image/357-1.jpg",
    count: 15,
  },
  {
    id: 4,
    title: "لباس ورزشی زنانه",
    slug: "women",
    image: "/image/367-5.jpg",
    count: 24,
  },
  {
    id: 5,
    title: "لباس ورزشی مردانه",
    slug: "men",
    image: "/image/3d85c22e6bb7fefcd9f5063f9ed65b5a03194878_1767522242.webp",
    count: 18,
  },
  {
    id: 6,
    title: "تجهیزات ورزشی",
    slug: "equipment",
    image: "/image/357-6.jpg",
    count: 5,
  },
  {
    id: 7,
    title: "استوک",
    slug: "stoke",
    image: "/image/pro_60929_558.webp",
    count: 3,
  },
];

export default function AdminCategoriesPage() {
  const router = useRouter();

  const handleViewProducts = (slug: string) => {
    router.push(`/admin/products?category=${slug}`);
  };

  // هدایت به صفحه ایجاد محصول و ارسال دسته به صورت Query Parameter
  const handleAddProduct = (slug: string) => {
    router.push(`/admin/products/create?category=${slug}`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              مدیریت دسته‌بندی‌ها
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              مشاهده محصولات یا افزودن محصول جدید به دسته‌بندی خاص
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ADMIN_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md"
          >
            {/* Image Section */}
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 right-4 text-white">
                <h3 className="text-xl font-bold">{cat.title}</h3>
                <span className="mt-1 inline-block rounded-md bg-white/20 px-2 py-0.5 text-xs backdrop-blur-sm">
                  {cat.slug}
                </span>
              </div>
            </div>

            {/* Actions Section */}
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                <span>تعداد محصولات ثبت شده:</span>
                <span className="font-bold text-slate-700">
                  {cat.count} محصول
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewProducts(cat.slug)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <PackageSearch size={18} />
                  محصولات
                </button>

                <button
                  onClick={() => handleAddProduct(cat.slug)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-50 text-orange-600 py-3 text-sm font-bold transition hover:bg-orange-500 hover:text-white"
                >
                  <Plus size={18} />
                  افزودن محصول
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
