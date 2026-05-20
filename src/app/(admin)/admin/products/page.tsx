"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const API_URL = "https://maktab-shop.runflare.run/api";
const BASE_URL = "https://maktab-shop.runflare.run";

const getImageSrc = (image: string) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }
  return `${BASE_URL}${image}`;
};
type Product = {
  _id: string;
  name: string;
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

  const [updating, setUpdating] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const [newImages, setNewImages] = useState<FileList | null>(null);

  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/products`, {
        params: {
          page: 1,
          limit: 100,
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

  //EDIT MODAL

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);

    setEditForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      category: product.category || "",
    });

    setNewImages(null);

    setShowEditModal(true);
  };

  //DELETE MODAL

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  // CLOSE

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);

    setEditForm({
      name: "",
      price: "",
      stock: "",
      category: "",
    });

    setNewImages(null);
  };

  const updateProduct = async () => {
    if (!selectedProduct) return;

    try {
      setUpdating(true);

      const token = localStorage.getItem("admin_token");

      const formData = new FormData();

      //changed fields
      if (editForm.name !== selectedProduct.name) {
        formData.append("name", editForm.name);
      }

      if (Number(editForm.price) !== selectedProduct.price) {
        formData.append("price", editForm.price);
      }

      if (Number(editForm.stock) !== selectedProduct.stock) {
        formData.append("stock", editForm.stock);
      }

      if (editForm.category !== selectedProduct.category) {
        formData.append("category", editForm.category);
      }

      //new images
      if (newImages && newImages.length > 0) {
        Array.from(newImages).forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await axios.put(
        `${API_URL}/products/${selectedProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const updatedProduct = res.data?.data || res.data?.product || res.data;

      // update UI
      setProducts((prev) =>
        prev.map((product) =>
          product._id === selectedProduct._id
            ? {
                ...product,
                ...updatedProduct,
              }
            : product,
        ),
      );

      closeEditModal();
    } catch (error) {
      console.error("Update failed:", error);
      alert("خطا در ویرایش محصول");
    } finally {
      setUpdating(false);
    }
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem("admin_token");

      await axios.delete(`${API_URL}/products/${selectedProduct._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // remove from UI
      setProducts((prev) =>
        prev.filter((product) => product._id !== selectedProduct._id),
      );

      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("خطا در حذف محصول");
    }
  };

  // INITIAL FETCH

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">لیست محصولات</h1>

        <Link
          href="/admin/products/create"
          className="rounded-xl bg-slate-800 px-4 py-2 text-white"
        >
          + افزودن محصول
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3">ردیف</th>
              <th className="p-3">عکس</th>
              <th className="p-3">نام محصول</th>
              <th className="p-3">قیمت</th>
              <th className="p-3">موجودی</th>
              <th className="p-3">دسته‌بندی</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, index) => (
              <tr key={p._id} className="border-b transition hover:bg-slate-50">
                <td className="p-3 text-center">{index + 1}</td>

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

                <td className="p-3 font-semibold text-slate-700">{p.name}</td>

                <td className="p-3">{p.price?.toLocaleString()} تومان</td>

                <td className="p-3">{p.stock}</td>

                <td className="p-3">{p.category}</td>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[500px] rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={closeEditModal}
              className="absolute left-3 top-3 text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            <h2 className="mb-6 text-xl font-bold text-slate-800">
              ویرایش محصول
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="نام محصول"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-slate-500"
              />

              <input
                type="number"
                placeholder="قیمت"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-slate-500"
              />

              <input
                type="number"
                placeholder="موجودی"
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    stock: e.target.value,
                  }))
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-slate-500"
              />

              <input
                type="text"
                placeholder="دسته بندی"
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full rounded-lg border p-3 outline-none focus:border-slate-500"
              />

              {selectedProduct.images?.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-slate-600">تصویر فعلی</p>

                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.images.map((img, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-lg border"
                      >
                        <Image
                          src={getImageSrc(img)}
                          alt={`product-${i}`}
                          width={70}
                          height={70}
                          className="h-[70px] w-[70px] object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm text-slate-600">
                  افزودن تصاویر جدید
                </label>

                <input
                  type="file"
                  multiple
                  onChange={(e) => setNewImages(e.target.files)}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeEditModal}
                  className="flex-1 rounded-lg border border-slate-300 py-3 font-medium hover:bg-slate-50"
                >
                  لغو
                </button>

                <button
                  onClick={updateProduct}
                  disabled={updating}
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}

      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[400px] rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedProduct(null);
              }}
              className="absolute left-3 top-3 text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-xl font-bold text-red-600">حذف محصول</h2>

            <p className="mt-3 text-slate-600">
              آیا از حذف این محصول مطمئن هستید؟
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              {selectedProduct.name}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 rounded-lg border border-slate-300 py-2 font-medium hover:bg-slate-50"
              >
                لغو
              </button>

              <button
                onClick={deleteProduct}
                className="flex-1 rounded-lg bg-red-600 py-2 font-medium text-white hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
