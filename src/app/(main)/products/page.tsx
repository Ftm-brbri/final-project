"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import ProductsGrid from "@/src/components/products/products-grid";

const API_URL = "https://maktab-shop.runflare.run/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/products`, {
          params: {
            page: 1,
            limit: 100,
            category: slug, // filter by category
          },
        });

        const allProducts: Product[] =
          res.data?.data?.products ||
          res.data?.data?.items ||
          res.data?.data ||
          res.data?.products ||
          res.data ||
          [];

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        در حال بارگذاری محصولات...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">
            {slug ? `محصولات دسته‌بندی ${slug}` : "همه محصولات"}
          </h1>
          <p className="mt-2 text-slate-500">
            {products.length.toLocaleString("fa-IR")} محصول یافت شد
          </p>
        </div>

        {/* PRODUCTS */}
        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <p className="text-lg text-slate-500">
              محصولی در این دسته‌بندی یافت نشد.
            </p>
          </div>
        ) : (
          <ProductsGrid products={products} />
        )}
      </div>
    </main>
  );
}
