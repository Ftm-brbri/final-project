"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type CategoryItem = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  large?: boolean;
};

const categories: CategoryItem[] = [
  {
    id: 1,
    title: "ست‌های ورزشی",
    subtitle: "جدیدترین ست‌های اسپرت",
    image: "/image/367-4.jpg",
    category: "set",
    large: true,
  },
  {
    id: 2,
    title: "کفش مردانه",
    subtitle: "مناسب دویدن و باشگاه",
    image: "/image/367-2.jpg",
    category: "men shoes",
  },
  {
    id: 3,
    title: "کفش زنانه",
    subtitle: "استایل راحت و مدرن",
    image: "/image/367-1.jpg",
    category: "women shoes",
  },
  {
    id: 4,
    title: "لباس ورزشی زنانه",
    subtitle: "پوشاک جذاب حرفه‌ای",
    image: "/image/357-5.jpg",
    category: "women",
  },
  {
    id: 5,
    title: "لباس ورزشی مردانه",
    subtitle: "پوشاک اسپرت حرفه‌ای",
    image: "/image/3d85c22e6bb7fefcd9f5063f9ed65b5a03194878_1767522242.webp",
    category: "men",
  },
];

function CategoryCard({
  item,
  onClick,
}: {
  item: CategoryItem;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[28px] cursor-pointer ${
        item.large ? "min-h-[620px]" : "min-h-[300px]"
      }`}
    >
      {/* Image */}
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-contain transition duration-700 group-hover:scale-110 "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* Glow */}
      <div className="absolute inset-0 bg-orange-500/0 transition duration-500 group-hover:bg-orange-500/10" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="translate-y-4 transition duration-500 group-hover:translate-y-0">
          <h3 className="text-2xl font-black text-white md:text-3xl">
            {item.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-200 md:text-base">
            {item.subtitle}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-orange-300 opacity-0 transition duration-500 group-hover:opacity-100">
            مشاهده محصولات
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Category() {
  const router = useRouter();

  const handleNavigate = (category: string) => {
    router.push(`/products?category=${category}`);
  };

  const featuredCategory = categories.find((item) => item.large);
  const otherCategories = categories.filter((item) => !item.large);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-100" />

      <div className="absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-[250px] w-[250px] rounded-full bg-amber-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-500">
              دسته‌بندی محصولات
            </div>

            <h2 className="text-4xl font-black text-slate-900 md:text-5xl">
              خرید بر اساس دسته‌بندی
            </h2>
          </div>

          <button
            onClick={() => router.push("/products")}
            className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white transition hover:bg-orange-500 "
          >
            مشاهده همه محصولات
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-1 "
            />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 ">
          {/* Large Card */}
          {featuredCategory && (
            <div className="lg:col-span-5">
              <CategoryCard
                item={featuredCategory}
                onClick={() => handleNavigate(featuredCategory.category)}
              />
            </div>
          )}

          {/* Small Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {otherCategories.map((item) => (
              <CategoryCard
                key={item.id}
                item={item}
                onClick={() => handleNavigate(item.category)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Category;
