'use client';

import { useState, useEffect } from 'react';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

function toPascalCase(str: string): string {
  return str.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function getDynamicIcon(iconName: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons: Record<string, any> = LucideIcons;
  return icons[toPascalCase(iconName)] || LucideIcons.Package;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Categorías' }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-10">
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold tracking-[3px] text-[var(--primary)]">EXPLORAR</span>
          <h1 className="text-[32px] font-bold text-[var(--text-dark)] mt-2">Todas las categorías</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">Explora nuestra gama completa de productos</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl border border-[var(--border)] animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--bg-warm)]" />
                  <div className="h-5 w-32 rounded bg-[var(--border)]" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-[var(--bg-warm)]" />
                  <div className="h-6 w-20 rounded-full bg-[var(--bg-warm)]" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-muted)] py-16">No hay categorías disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const IconComponent = getDynamicIcon(cat.icon ?? 'package');
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="p-6 rounded-xl border border-[var(--border)] hover:shadow-lg hover:border-[var(--primary)]/30 transition group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                      <IconComponent size={24} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-dark)] group-hover:text-[var(--primary)] transition">{cat.name}</h3>
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{cat.subcategories.length} subcategorías</p>
                      )}
                    </div>
                  </div>
                  {cat.description && (
                    <p className="text-sm text-[var(--text-muted)] mb-4">{cat.description}</p>
                  )}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cat.subcategories.map((sub) => (
                        <span key={sub.slug} className="text-xs bg-[var(--bg-light)] text-[var(--text-muted)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
