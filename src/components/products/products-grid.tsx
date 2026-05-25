"use client";

import ProductCard from "./product-card";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
};

type ProductsGridProps = {
  products: Product[];
  title?: string;
  subtitle?: string;
};

export default function ProductsGrid({
  products,
  title,
  subtitle,
}: ProductsGridProps) {
  if (!products || products.length === 0) {
    return (
      <section dir="rtl" className="py-10">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-3xl font-black text-slate-900">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-2 text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
          <p className="text-lg font-medium text-slate-500">
            محصولی یافت نشد.
          </p>
        </div>
      </section>
    );
  }

  const availableProducts = products.filter(
    (product) => product.stock > 0,
  );

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0,
  );

  return (
    <section dir="rtl" className="py-10">
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-3xl font-black text-slate-900">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-2 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* AVAILABLE PRODUCTS */}
      {availableProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {availableProducts.map((product) => (
            <div
              key={product._id}
              className="transition duration-300 hover:-translate-y-1"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* OUT OF STOCK TITLE */}
      {outOfStockProducts.length > 0 && (
        <div className="mt-16 mb-8">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-3">
            <div className="h-2 w-2 rounded-full bg-red-500" />

            <h3 className="text-lg font-black text-red-500">
              محصولات ناموجود
            </h3>
          </div>
        </div>
      )}

      {/* OUT OF STOCK PRODUCTS */}
      {outOfStockProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {outOfStockProducts.map((product) => (
            <div
              key={product._id}
              className="relative overflow-hidden rounded-[28px] opacity-65 grayscale transition duration-300"
            >
              {/* DARK OVERLAY */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-black/20" />

              {/* OUT OF STOCK BADGE */}
              <div className="absolute right-4 top-4 z-20 rounded-full bg-red-500 px-4 py-1 text-sm font-bold text-white shadow-lg">
                ناموجود
              </div>

              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}