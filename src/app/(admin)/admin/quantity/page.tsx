"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Pagination from "@/src/shared/components/pagination";

const API_URL = "https://maktab-shop.runflare.run/api";
const IMAGE_BASE_URL = "https://maktab-shop.runflare.run";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
};

type EditableFields = {
  price: number;
  stock: number;
};

const ITEMS_PER_PAGE = 10; // تعداد محصولات در هر صفحه

export default function QuantityPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // استیت مربوط به صفحه‌بندی
  const [currentPage, setCurrentPage] = useState(1);

  // current
  const [editingCell, setEditingCell] = useState<{
    productId: string;
    field: "price" | "stock";
  } | null>(null);

  // edited values
  const [editedValues, setEditedValues] = useState<
    Record<string, EditableFields>
  >({});

  // FETCH ON LOAD
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`, {
          params: {
            page: 1,
            limit: 100, // فعلاً همه را می‌گیریم تا سمت کلاینت صفحه‌بندی کنیم
          },
        });

        const productsData =
          res.data?.data?.products ||
          res.data?.data?.items ||
          res.data?.data ||
          res.data?.products ||
          res.data ||
          [];

        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // START EDITING
  const startEditing = (productId: string, field: "price" | "stock") => {
    setEditingCell({
      productId,
      field,
    });
  };

  // HANDLE INPUT CHANGE
  const handleChange = (
    product: Product,
    field: "price" | "stock",
    value: string,
  ) => {
    setEditedValues((prev) => ({
      ...prev,
      [product._id]: {
        price:
          field === "price"
            ? Number(value)
            : (prev[product._id]?.price ?? product.price),
        stock:
          field === "stock"
            ? Number(value)
            : (prev[product._id]?.stock ?? product.stock),
      },
    }));
  };

  // SAVE ALL CHANGES
  const saveAllChanges = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("admin_token");
      const changedProducts = Object.entries(editedValues);

      if (changedProducts.length === 0) {
        alert("تغییری انجام نشده");
        return;
      }

      // SAVE ALL USING PROMISE.ALL
      await Promise.all(
        changedProducts.map(([productId, values]) =>
          axios.put(
            `${API_URL}/products/${productId}`,
            {
              price: values.price,
              stock: values.stock,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        ),
      );

      // UPDATE UI AFTER SUCCESS
      setProducts((prev) =>
        prev.map((product) => {
          const edited = editedValues[product._id];
          if (!edited) return product;
          return {
            ...product,
            price: edited.price,
            stock: edited.stock,
          };
        }),
      );

      // RESET
      setEditedValues({});
      setEditingCell(null);

      alert("همه تغییرات ذخیره شدند");
    } catch (error) {
      console.error("Save failed:", error);
      alert("خطا در ذخیره تغییرات");
    } finally {
      setSaving(false);
    }
  };

  const getImageSrc = (image: string) => {
    if (!image) return "";
    if (image.startsWith("http")) {
      return image;
    }
    return `${IMAGE_BASE_URL}${image}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        در حال بارگذاری...
      </div>
    );
  }

  // محاسبات صفحه‌بندی
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">
          مدیریت قیمت و موجودی
        </h1>

        <button
          onClick={saveAllChanges}
          disabled={saving}
          className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 px-5 py-2 font-medium text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50"
        >
          {saving ? "در حال ذخیره..." : "ذخیره همه"}
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3">ردیف</th>
              <th className="p-3">عکس</th>
              <th className="p-3">نام محصول</th>
              <th className="p-3">قیمت</th>
              <th className="p-3">موجودی</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p, index) => {
              const edited = editedValues[p._id];
              const currentPrice = edited?.price ?? p.price;
              const currentStock = edited?.stock ?? p.stock;

              return (
                <tr
                  key={p._id}
                  className="border-b transition hover:bg-slate-50"
                >
                  {/* محاسبه شماره ردیف با توجه به صفحه فعلی */}
                  <td className="p-3 text-center">{startIndex + index + 1}</td>

                  <td className="p-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                      {p.images.length ? (
                        <Image
                          src={getImageSrc(p.images[0])} // از تابع خودتان برای آدرس عکس استفاده شد
                          alt={p.name}
                          width={50}
                          height={50}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          no img
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-slate-700">{p.name}</td>

                  <td
                    onDoubleClick={() => startEditing(p._id, "price")}
                    className="cursor-pointer p-3"
                  >
                    {editingCell?.productId === p._id &&
                    editingCell?.field === "price" ? (
                      <input
                        type="number"
                        autoFocus
                        value={currentPrice}
                        onChange={(e) =>
                          handleChange(p, "price", e.target.value)
                        }
                        className="w-[140px] rounded-lg border p-2 outline-none focus:border-orange-400"
                      />
                    ) : (
                      <span className="rounded-lg bg-orange-50 px-3 py-2 text-orange-700 hover:bg-orange-100">
                        {currentPrice.toLocaleString()} تومان
                      </span>
                    )}
                  </td>

                  <td
                    onDoubleClick={() => startEditing(p._id, "stock")}
                    className="cursor-pointer p-3"
                  >
                    {editingCell?.productId === p._id &&
                    editingCell?.field === "stock" ? (
                      <input
                        type="number"
                        autoFocus
                        value={currentStock}
                        onChange={(e) =>
                          handleChange(p, "stock", e.target.value)
                        }
                        className="w-[100px] rounded-lg border p-2 outline-none focus:border-orange-400"
                      />
                    ) : (
                      <span className="rounded-lg bg-slate-100 px-3 py-2">
                        {currentStock}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            محصولی یافت نشد
          </div>
        )}

        {/* نمایش کامپوننت صفحه‌بندی در پایین جدول */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center pb-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
