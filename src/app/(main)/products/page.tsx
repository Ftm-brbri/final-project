"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ProductsGrid from "@/src/components/products/products-grid";
import Pagination from "@/src/shared/components/pagination";

const API_URL = "https://maktab-shop.runflare.run/api";
const ITEMS_PER_PAGE = 8;

type Product = {
  _id: string;
  name: string;
  title?: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/products`, {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const allProducts: Product[] =
          res.data?.data?.products ||
          res.data?.data?.items ||
          res.data?.data ||
          res.data?.products ||
          res.data ||
          [];

        const filteredProducts = category
          ? allProducts.filter(
              (product) =>
                product.category?.toLowerCase() === category.toLowerCase(),
            )
          : allProducts;

        setProducts(filteredProducts);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center py-20 text-slate-500">
        در حال بارگذاری محصولات...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-10 pt-28" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">
            {category ? `محصولات دسته‌بندی ${category}` : "همه محصولات"}
          </h1>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
            <p className="text-lg text-slate-500">
              محصولی در این دسته‌بندی یافت نشد.
            </p>
          </div>
        ) : (
          <>
            <ProductsGrid products={paginatedProducts} />
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
