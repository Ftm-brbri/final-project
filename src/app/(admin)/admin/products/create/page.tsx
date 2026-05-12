"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = "https://maktab-shop.runflare.run/api";
const formatPrice = (value: string) => {
  // remove commas first
  const numericValue = value.replace(/,/g, "");

  // prevent NaN
  if (!numericValue) return "";

  return Number(numericValue).toLocaleString("en-US");
};
export default function CreateProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  const [images, setImages] = useState<FileList | null>(null);

  // =========================
  // HANDLE IMAGE PREVIEW
  // =========================
  const handleImages = (files: FileList | null) => {
    if (!files) return;

    setImages(files);

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));

    setPreviewImages(previews);
  };

  // =========================
  // CREATE PRODUCT
  // =========================
  const createProduct = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admin_token");

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("description", form.description);

      // append images
      if (images && images.length > 0) {
        Array.from(images).forEach((file) => {
          formData.append("images", file);

          // if backend requires:
          // formData.append("images[]", file);
        });
      }

      await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("محصول با موفقیت ایجاد شد");

      router.push("/admin/products");
    } catch (error) {
      console.error("Create product failed:", error);

      alert("خطا در ایجاد محصول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6" dir="rtl">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">
          افزودن محصول جدید
        </h1>

        <p className="mt-2 text-slate-500">اطلاعات محصول را وارد کنید</p>
      </div>

      {/* FORM */}
      <div className="rounded-2xl border bg-white p-6 shadow">
        <div className="space-y-5">
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              نام محصول
            </label>

            <input
              type="text"
              placeholder="مثال: کفش نایک"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-slate-800"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              قیمت
            </label>

            <input
              type="text"
              placeholder="قیمت محصول"
              value={formatPrice(form.price)}
              onChange={(e) => {
                // remove commas before saving
                const rawValue = e.target.value.replace(/,/g, "");

                // only numbers allowed
                if (!/^\d*$/.test(rawValue)) return;

                setForm((prev) => ({
                  ...prev,
                  price: rawValue,
                }));
              }}
              className="w-full rounded-xl border p-3 outline-none focus:border-slate-800"
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              موجودی
            </label>

            <input
              type="number"
              placeholder="تعداد موجودی"
              value={form.stock}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  stock: e.target.value,
                }))
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-slate-800"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              دسته بندی
            </label>

            <input
              type="text"
              placeholder="مثال: کفش"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-slate-800"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              توضیحات
            </label>

            <textarea
              rows={5}
              placeholder="توضیحات محصول..."
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-slate-800"
            />
          </div>

          {/* IMAGES */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              تصاویر محصول
            </label>

            <input
              type="file"
              multiple
              onChange={(e) => handleImages(e.target.files)}
              className="w-full"
            />
          </div>

          {/* PREVIEW */}
          {previewImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {previewImages.map((img, index) => (
                <div key={index} className="overflow-hidden rounded-xl border">
                  <Image
                    src={img}
                    alt={`preview-${index}`}
                    width={100}
                    height={100}
                    className="h-[100px] w-[100px] object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            {/* CANCEL */}
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="flex-1 rounded-xl border border-slate-300 py-3 font-medium hover:bg-slate-50"
            >
              لغو
            </button>

            {/* SUBMIT */}
            <button
              type="button"
              onClick={createProduct}
              disabled={loading}
              className="flex-1 rounded-xl bg-slate-900 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "در حال ایجاد..." : "ایجاد محصول"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
