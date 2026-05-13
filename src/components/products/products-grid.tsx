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
              <h2 className="text-3xl font-black text-slate-900">{title}</h2>
            )}
            {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          محصولی یافت نشد.
        </div>
      </section>
    );
  }

  return (
    <section dir="rtl" className="py-10">
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-3xl font-black text-slate-900">{title}</h2>
          )}
          {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
