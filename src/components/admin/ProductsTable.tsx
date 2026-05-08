"use client";

import { Eye, Pencil, Trash2, Search, Plus } from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: string;
  status: "موجود" | "کم موجود" | "ناموجود";
};

const products: Product[] = [
  {
    id: 1,
    name: "کفش نایک ایر مکس",
    category: "کفش ورزشی",
    stock: 24,
    price: "4,200,000",
    status: "موجود",
  },
  {
    id: 2,
    name: "ست لباس بدنسازی",
    category: "لباس ورزشی",
    stock: 12,
    price: "1,850,000",
    status: "کم موجود",
  },
  {
    id: 3,
    name: "توپ فوتبال حرفه‌ای",
    category: "تجهیزات ورزشی",
    stock: 0,
    price: "950,000",
    status: "ناموجود",
  },
  {
    id: 4,
    name: "ساعت هوشمند ورزشی",
    category: "اکسسوری",
    stock: 5,
    price: "6,900,000",
    status: "کم موجود",
  },
  {
    id: 5,
    name: "هودی ورزشی آدیداس",
    category: "لباس ورزشی",
    stock: 18,
    price: "2,450,000",
    status: "موجود",
  },
];

export default function ProductsTable() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">
            محصولات فروشگاه
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            مدیریت محصولات، موجودی و قیمت‌ها
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="جستجوی محصول..."
              className="bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Add Product */}
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]">
            <Plus size={18} />
            افزودن محصول
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="px-4 py-3 text-right text-sm font-bold text-slate-500">
                محصول
              </th>

              <th className="px-4 py-3 text-right text-sm font-bold text-slate-500">
                دسته‌بندی
              </th>

              <th className="px-4 py-3 text-right text-sm font-bold text-slate-500">
                موجودی
              </th>

              <th className="px-4 py-3 text-right text-sm font-bold text-slate-500">
                قیمت
              </th>

              <th className="px-4 py-3 text-right text-sm font-bold text-slate-500">
                وضعیت
              </th>

              <th className="px-4 py-3 text-center text-sm font-bold text-slate-500">
                عملیات
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="group transition-all duration-200"
              >
                {/* Product Name */}
                <td className="rounded-r-2xl bg-slate-50 px-4 py-4 font-semibold text-slate-800 group-hover:bg-orange-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-sm font-bold text-white">
                      {product.name.charAt(0)}
                    </div>

                    <div>
                      <p>{product.name}</p>

                      <span className="text-xs text-slate-400">
                        کد محصول #{product.id}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="bg-slate-50 px-4 py-4 text-slate-600 group-hover:bg-orange-50">
                  {product.category}
                </td>

                {/* Stock */}
                <td className="bg-slate-50 px-4 py-4 text-slate-600 group-hover:bg-orange-50">
                  {product.stock}
                </td>

                {/* Price */}
                <td className="bg-slate-50 px-4 py-4 font-bold text-slate-800 group-hover:bg-orange-50">
                  {product.price} تومان
                </td>

                {/* Status */}
                <td className="bg-slate-50 px-4 py-4 group-hover:bg-orange-50">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      product.status === "موجود"
                        ? "bg-emerald-100 text-emerald-600"
                        : product.status === "کم موجود"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="rounded-l-2xl bg-slate-50 px-4 py-4 group-hover:bg-orange-50">
                  <div className="flex items-center justify-center gap-2">
                    <button className="rounded-xl bg-slate-200 p-2 text-slate-600 transition hover:bg-slate-300">
                      <Eye size={18} />
                    </button>

                    <button className="rounded-xl bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-xl bg-red-100 p-2 text-red-600 transition hover:bg-red-200">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
