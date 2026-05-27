"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import Pagination from "@/src/shared/components/pagination";

const API_URL = "https://maktab-shop.runflare.run/api";
const BASE_URL = "https://maktab-shop.runflare.run";
const ITEMS_PER_PAGE = 10;

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
  description?: string;
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
  const [modalLoading, setModalLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as string[],
  });

  const [newImages, setNewImages] = useState<FileList | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      try {
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

        if (!ignore) {
          setProducts(Array.isArray(productsData) ? productsData : []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);

        if (!ignore) {
          setProducts([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  // OPEN EDIT MODAL
  const openEditModal = async (productId: string) => {
    try {
      setModalLoading(true);
      setShowEditModal(true);

      const res = await axios.get(`${API_URL}/products/${productId}`);

      const product = res.data?.data || res.data?.product || res.data;

      setSelectedProduct(product);

      setEditForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        category: product.category || "",
        images: product.images || [],
      });

      setNewImages(null);
    } catch (error) {
      console.error(error);
      alert("خطا در دریافت اطلاعات محصول");
      setShowEditModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // DELETE IMAGE
  const handleRemoveImage = (image: string) => {
    setEditForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  };

  // CLOSE MODAL
  const closeEditModal = () => {
    setShowEditModal(false);

    setSelectedProduct(null);

    setEditForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      images: [],
    });

    setNewImages(null);
  };

  // UPDATE PRODUCT
  const updateProduct = async () => {
    if (!selectedProduct) return;

    try {
      setUpdating(true);

      const token = localStorage.getItem("admin_token");

      const formData = new FormData();

      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("stock", editForm.stock);
      formData.append("category", editForm.category);

      // KEEP REMAINING IMAGES
      editForm.images.forEach((img) => {
        formData.append("existingImages", img);
      });

      // NEW IMAGES
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

      // UPDATE UI
      setProducts((prev) =>
        prev.map((product) =>
          product._id === selectedProduct._id ? updatedProduct : product,
        ),
      );

      closeEditModal();

      alert("محصول با موفقیت ویرایش شد");
    } catch (error) {
      console.error(error);
      alert("خطا در ویرایش محصول");
    } finally {
      setUpdating(false);
    }
  };

  // DELETE PRODUCT
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
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

      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id));

      setShowDeleteModal(false);
      setSelectedProduct(null);

      if (paginatedProducts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error(error);
      alert("خطا در حذف محصول");
    }
  };

  // PAGINATION
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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

        <Link
          href="/admin/products/create"
          className="rounded-xl bg-slate-800 px-4 py-2 text-white"
        >
          + افزودن محصول
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3">ردیف</th>
              <th className="p-3">عکس</th>
              <th className="p-3">نام</th>
              <th className="p-3">قیمت</th>
              <th className="p-3">موجودی</th>
              <th className="p-3">دسته‌بندی</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p, index) => (
              <tr
                key={p._id}
                className="border-b transition hover:bg-slate-50 text-center"
              >
                <td className="p-3 text-center">{startIndex + index + 1}</td>

                <td className="p-3">
                  <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                    {p.images?.length > 0 ? (
                      <Image
                        src={getImageSrc(p.images[0])}
                        alt={p.name}
                        width={60}
                        height={60}
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

                <td className="p-3">{p.price.toLocaleString()} تومان</td>

                <td className="p-3">{p.stock}</td>

                <td className="p-3">{p.category}</td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(p._id)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => openDeleteModal(p)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            {modalLoading ? (
              <div className="py-20 text-center text-slate-500">
                در حال دریافت اطلاعات محصول...
              </div>
            ) : (
              <>
                {/* HEADER */}
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-800">
                    ویرایش محصول
                  </h2>

                  <button
                    onClick={closeEditModal}
                    className="rounded-full p-2 transition hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* FORM */}
                <div className="space-y-5">
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
                    className="w-full rounded-2xl border p-4 outline-none focus:border-orange-500"
                  />

                  <textarea
                    placeholder="توضیحات محصول"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={5}
                    className="w-full rounded-2xl border p-4 outline-none focus:border-orange-500"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      className="w-full rounded-2xl border p-4 outline-none focus:border-orange-500"
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
                      className="w-full rounded-2xl border p-4 outline-none focus:border-orange-500"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="دسته‌بندی"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border p-4 outline-none focus:border-orange-500"
                  />

                  {/* IMAGES */}
                  <div>
                    <p className="mb-4 font-bold text-slate-700">
                      تصاویر محصول
                    </p>

                    <div className="flex flex-wrap gap-4">
                      {editForm.images.map((img, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={getImageSrc(img)}
                            alt={`product-${index}`}
                            width={100}
                            height={100}
                            className="h-[100px] w-[100px] rounded-2xl object-cover"
                          />

                          <button
                            onClick={() => handleRemoveImage(img)}
                            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NEW IMAGES */}
                  <div>
                    <label className="mb-2 block font-medium text-slate-700">
                      افزودن تصاویر جدید
                    </label>

                    <input
                      type="file"
                      multiple
                      onChange={(e) => setNewImages(e.target.files)}
                      className="w-full rounded-xl border p-3"
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={closeEditModal}
                      className="flex-1 rounded-2xl border py-4 font-bold transition hover:bg-slate-100"
                    >
                      لغو
                    </button>

                    <button
                      onClick={updateProduct}
                      disabled={updating}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                    >
                      {updating ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[400px] rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-black text-red-600">حذف محصول</h2>

            <p className="mt-4 text-slate-600">
              آیا از حذف این محصول مطمئن هستید؟
            </p>

            <p className="mt-2 font-bold text-slate-800">
              {selectedProduct.name}
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 rounded-2xl border py-3 font-bold"
              >
                لغو
              </button>

              <button
                onClick={deleteProduct}
                className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-white"
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
