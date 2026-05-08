"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const API_URL = "https://maktab-shop.runflare.run/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
};

export default function QuantityPage() {
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
              <th className="p-3">قیمت</th>
              <th className="p-3">موجودی</th>
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
                      <Image
                        src={`${p.images[0]}`}
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

                {/* title */}
                <td className="p-3 font-semibold text-slate-700">{p.name}</td>

                {/* price */}
                <td className="p-3">{p.price?.toLocaleString()} تومان</td>

                {/* stock */}
                <td className="p-3">{p.stock}</td>
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
    </div>
  );
}
