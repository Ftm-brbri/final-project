"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import ProductsGrid from "@/src/components/products/products-grid";
import ProductsFilter from "@/src/components/products/products-filter";
import Pagination from "@/src/shared/components/pagination";

const API_URL = "https://maktab-shop.runflare.run/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

const ITEMS_PER_PAGE = 8;

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // category from url
  const categoryFromUrl = searchParams.get("category") || "all";

  // states
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStock, setSelectedStock] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // selected category directly from URL (NO useEffect needed)
  const selectedCategory =
    categoryFromUrl && categoryFromUrl.trim() !== ""
      ? categoryFromUrl.toLowerCase().trim()
      : "all";

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_URL}/products`, {
          params: {
            page: 1,
            limit: 200,
          },
        });

        const data =
          res.data?.data?.products ||
          res.data?.data?.items ||
          res.data?.data ||
          res.data ||
          [];

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // FILTER + SORT
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // CATEGORY FILTER
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category?.toLowerCase().trim() === selectedCategory,
      );
    }

    // STOCK FILTER
    if (selectedStock === "available") {
      result = result.filter((p) => p.stock > 0);
    }

    if (selectedStock === "unavailable") {
      result = result.filter((p) => p.stock === 0);
    }

    // SORTING
    if (selectedSort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (selectedSort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (selectedSort === "newest") {
      result.reverse();
    }

    return result;
  }, [products, selectedCategory, selectedStock, selectedSort]);

  // CATEGORY CHANGE
  const handleCategoryChange = (value: string) => {
    setCurrentPage(1);

    if (value === "all") {
      router.push("/products");
    } else {
      router.push(`/products?category=${encodeURIComponent(value)}`);
    }
  };

  // STOCK CHANGE
  const handleStockChange = (value: string) => {
    setSelectedStock(value);
    setCurrentPage(1);
  };

  // SORT CHANGE
  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    setCurrentPage(1);
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        در حال بارگذاری محصولات...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-10" dir="rtl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:px-8 lg:grid-cols-12">
        {/* FILTER */}
        <div className="lg:col-span-3">
          <ProductsFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            selectedStock={selectedStock}
            setSelectedStock={handleStockChange}
            selectedSort={selectedSort}
            setSelectedSort={handleSortChange}
          />
        </div>

        {/* PRODUCTS */}
        <div className="lg:col-span-9">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900">محصولات</h1>

            <p className="mt-1 text-slate-500">
              {filteredProducts.length.toLocaleString("fa-IR")} محصول یافت شد
            </p>
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-slate-500">
              محصولی یافت نشد
            </div>
          ) : (
            <ProductsGrid products={paginatedProducts} />
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-500">
          در حال بارگذاری محصولات...
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
