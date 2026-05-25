"use client";

type Props = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;

  selectedStock: string;
  setSelectedStock: (value: string) => void;

  selectedSort: string;
  setSelectedSort: (value: string) => void;
};

const categories = [
  { label: "همه", value: "all" },
  { label: "مردانه", value: "men" },
  { label: "زنانه", value: "women" },
  { label: "ست ورزشی", value: "set" },
  { label: "کفش مردانه", value: "men shoes" },
  { label: "کفش زنانه", value: "women shoes" },
  { label: "تجهیزات", value: "equipment" },
];

export default function ProductsFilter({
  selectedCategory,
  setSelectedCategory,
  selectedStock,
  setSelectedStock,
  selectedSort,
  setSelectedSort,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* TITLE */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-900">
          فیلتر محصولات
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          محصولات موردنظر خود را پیدا کنید
        </p>
      </div>

      {/* CATEGORY */}
      <div className="mb-6">
        <h3 className="mb-3 font-bold text-slate-800">
          دسته‌بندی
        </h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedCategory(item.value)}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                selectedCategory === item.value
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* STOCK */}
      <div className="mb-6">
        <h3 className="mb-3 font-bold text-slate-800">
          موجودی
        </h3>

        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          <option value="all">همه محصولات</option>
          <option value="available">فقط موجود</option>
          <option value="unavailable">ناموجود</option>
        </select>
      </div>

      {/* SORT */}
      <div>
        <h3 className="mb-3 font-bold text-slate-800">
          مرتب‌سازی
        </h3>

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          <option value="newest">جدیدترین</option>
          <option value="price-low">ارزان‌ترین</option>
          <option value="price-high">گران‌ترین</option>
        </select>
      </div>
    </div>
  );
}