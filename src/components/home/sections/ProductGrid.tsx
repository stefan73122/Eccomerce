'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getProductsByChannel } from '@/services/productService';
import type { Product } from '@/types';

interface Props {
  limit?: number;
  cols?: 2 | 3 | 4;
}

export default function ProductGrid({ limit = 6, cols = 3 }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductsByChannel(undefined, 1, limit)
      .then(({ products }) => setProducts(products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [limit]);

  const gridCols = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

  if (loading) {
    return (
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-light)] overflow-hidden animate-pulse">
            <div className="h-[180px] bg-gray-200" />
            <div className="p-[14px] space-y-2.5">
              <div className="h-3.5 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-7 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center text-sm text-[var(--text-muted)] py-16">No hay productos disponibles.</p>;
  }

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
