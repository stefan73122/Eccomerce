'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types';

function toPascalCase(str: string): string {
  return str.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function getDynamicIcon(iconName: string) {
  const pascalName = toPascalCase(iconName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons: Record<string, any> = Icons;
  return icons[pascalName] || Icons.Package;
}

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-7 px-4 sm:px-6 lg:px-20 py-8 lg:py-10">
      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] font-semibold tracking-[3px] text-[var(--primary)]">BROWSE CATEGORIES</span>
        <h2 className="text-2xl lg:text-[28px] font-semibold text-[var(--text-dark)]">Comprar por categoría</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center rounded-xl border border-[var(--border)] p-4 sm:p-5 gap-3 sm:gap-4 animate-pulse">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--bg-warm)]" />
                <div className="h-3 w-20 rounded bg-[var(--border)]" />
              </div>
            ))
          : (
            <>
              {categories.map((category) => {
                const Icon = getDynamicIcon(category.icon ?? 'package');
                return (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <div className="flex flex-col items-center rounded-xl border border-[var(--border)] p-4 sm:p-5 gap-3 sm:gap-4 hover:shadow-md transition">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--bg-warm)] flex items-center justify-center">
                        <Icon size={28} className="text-[var(--primary)]" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[var(--text-dark)] text-center">{category.name}</span>
                    </div>
                  </Link>
                );
              })}
              {/* Marketplace Card */}
              <Link href="/marketplace">
                <div className="flex flex-col items-center rounded-xl border-2 border-[var(--primary)] bg-[var(--primary)]/5 p-4 sm:p-5 gap-3 sm:gap-4 hover:shadow-md hover:bg-[var(--primary)]/10 transition">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--primary)] flex items-center justify-center">
                    <Icons.Store size={28} className="text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[var(--primary)] text-center">Marketplace</span>
                </div>
              </Link>
            </>
          )}
      </div>
    </div>
  );
}
