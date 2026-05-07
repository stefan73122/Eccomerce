'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { categoryService } from '@/services/categoryService';
import { getProductsByCategoryId } from '@/services/productService';
import { Category, Product } from '@/types';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductCard from '@/components/product/ProductCard';
import { Loader2 } from 'lucide-react';

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    categoryService.getCategoryBySlug(slug).then(async (cat) => {
      setCategory(cat);
      if (!cat) { setLoading(false); return; }

      try {
        const { products } = await getProductsByCategoryId(Number(cat.id));
        setProducts(products);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="px-4 sm:px-6 lg:px-20 py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--text-dark)]">Category not found</h1>
        <p className="text-[var(--text-muted)] mt-2">The category you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Categories', href: '/categories' }, { label: category.name }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-8">
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[var(--text-dark)]">{category.name}</h1>
          {category.description && (
            <p className="text-sm text-[var(--text-muted)] mt-1">{category.description}</p>
          )}
        </div>

        {category.subcategories && category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-medium">All</button>
            {category.subcategories.map((sub) => (
              <button key={sub.slug} className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition">
                {sub.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">{sorted.length} productos</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[var(--border)] rounded-lg px-3 h-9 text-sm outline-none bg-white"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg font-medium text-[var(--text-dark)]">No hay productos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
