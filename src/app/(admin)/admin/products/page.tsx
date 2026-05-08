"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

const API_URL = "https://maktab-shop.runflare.run/api";

type Product = {
  _id: string;
  title: string;
  brand: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ GET PRODUCTS
  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/products`);

      // adjust if backend shape differs
      setProducts(res.data?.data || res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      await getProducts();
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">لیست محصولات</h1>

        <button className="rounded-xl bg-slate-800 px-4 py-2 text-white">
          + افزودن محصول
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
              <th className="p-3">برند</th>
              <th className="p-3">قیمت</th>
              <th className="p-3">موجودی</th>
              <th className="p-3">دسته‌بندی</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, index) => (
              <tr key={p._id} className="border-b hover:bg-slate-50 transition">
                {/* index */}
                <td className="p-3 text-center">{index + 1}</td>

                {/* image */}
                <td className="p-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                    {p.images.length ? (
                      <img
                        src={p.images?.[0] || ""}
                        alt={p.title}
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

                {/* title */}
                <td className="p-3 font-semibold text-slate-700">{p.title}</td>

                {/* brand */}
                <td className="p-3">{p.brand}</td>

                {/* price */}
                <td className="p-3">{p.price?.toLocaleString()} تومان</td>

                {/* stock */}
                <td className="p-3">{p.stock}</td>

                {/* category */}
                <td className="p-3">{p.category}</td>

                {/* actions (UI ONLY) */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => openDeleteModal(p)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            محصولی یافت نشد
          </div>
        )}
      </div>
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[400px] bg-white p-6 rounded-2xl relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 left-2"
            >
              ✕
            </button>

            <h2 className="font-bold mb-4">ویرایش محصول</h2>
            <label htmlFor="edit">edit note</label>
            <textarea
              name="edit note"
              id="edit"
              dir="ltr"
              placeholder="write the note here!"
              className="w-full border"
            ></textarea>

            {/* SAFE ACCESS */}
            <p>{selectedProduct?.title}</p>
            <p>{selectedProduct?.brand}</p>
          </div>
        </div>
      )}

      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[400px] bg-white p-6 rounded-2xl relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-2 left-2"
            >
              ✕
            </button>

            <h2 className="text-red-600 font-bold">حذف محصول</h2>

            <p className="mt-3">آیا مطمئن هستید؟</p>

            <p className="mt-2 font-semibold">{selectedProduct?.title}</p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border py-2 rounded-lg"
              >
                لغو
              </button>

              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
