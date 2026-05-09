'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme/ThemeContext';
import type { HomeSection, LayoutMode } from '@/lib/theme/theme.types';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/types';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategorySection from '@/components/home/CategorySection';
import SectionHeader from './SectionHeader';
import ProductGrid from './ProductGrid';

// ─── 3. Promociones ──────────────────────────────────────────────────────────
export function PromotionsSection({ section }: { section: HomeSection }) {
  const promos = [
    { title: 'Envío gratis',      desc: 'En compras +Bs.350',     icon: '🚚' },
    { title: '24 cuotas sin interés', desc: 'Con tarjetas participantes', icon: '💳' },
    { title: 'Hasta 50% off',     desc: 'En productos seleccionados', icon: '🏷️' },
    { title: 'Garantía extendida', desc: '1 año de cobertura',    icon: '🛡️' },
  ];
  return (
    <section className="px-4 sm:px-6 lg:px-20 py-8 bg-[var(--bg)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {promos.map((p) => (
          <div key={p.title} className="flex min-h-[96px] min-w-0 items-center gap-3 bg-[var(--bg-light)] rounded-xl p-4 border border-[var(--border)]">
            <div className="text-3xl shrink-0">{p.icon}</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--text-dark)] leading-snug truncate">{p.title}</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed truncate">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 4. Categorías (banners de categorías) ───────────────────────────────────
export function CategoriesSection({ section }: { section: HomeSection }) {
  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10 bg-[var(--bg)]">
      {section.title && (
        <SectionHeader title={section.title} subtitle={section.subtitle} eyebrow="CATEGORÍAS" viewAllHref="/products" />
      )}
      <CategorySection />
    </section>
  );
}

// ─── 5. Productos en promoción ───────────────────────────────────────────────
export function SaleProductsSection({ section }: { section: HomeSection }) {
  const { theme } = useTheme();
  const layout = theme.layout ?? 'default';
  const gridCols = layout === 'editorial' ? 2 : layout === 'centered' ? 3 : 4;

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10 bg-[var(--bg-light)]">
      <SectionHeader
        title={section.title || 'Productos en oferta'}
        subtitle={section.subtitle}
        eyebrow="OFERTAS"
        viewAllHref="/products?filter=sale"
      />
      <ProductGrid limit={6} cols={gridCols as 2 | 3 | 4} />
    </section>
  );
}

// ─── 6. Banner principal ─────────────────────────────────────────────────────
export function MainBannerSection({ section }: { section: HomeSection }) {
  if (section.bannerImageUrl) {
    return (
      <section className="px-4 sm:px-6 lg:px-20 py-6">
        <Link href={section.bannerLinkUrl || '#'} className="block rounded-2xl overflow-hidden relative h-[180px] lg:h-[280px] bg-gray-100">
          <Image src={section.bannerImageUrl} alt="Banner" fill className="object-cover" unoptimized />
        </Link>
      </section>
    );
  }
  return <HeroCarousel />;
}

// ─── 7. Productos por categoría (rotativo con tabs) ──────────────────────────
export function CategoryProductsSection({ section }: { section: HomeSection }) {
  const { theme } = useTheme();
  const layout = theme.layout ?? 'default';
  const gridCols = layout === 'editorial' ? 2 : layout === 'centered' ? 3 : 4;
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    categoryService
      .getCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setActiveCategoryId(cats[0].id);
      })
      .catch(() => setCategories([]));
  }, []);

  const visible = categories.slice(0, 6);

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10 bg-[var(--bg)]">
      <SectionHeader title={section.title || 'Por categoría'} subtitle={section.subtitle} eyebrow="EXPLORÁ" viewAllHref="/products" />
      {visible.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {visible.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeCategoryId === cat.id
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--text-dark)] hover:bg-[var(--bg-light)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
      <ProductGrid limit={8} cols={gridCols as 2 | 3 | 4} />
    </section>
  );
}

// ─── 8. Sugerencias al cliente ───────────────────────────────────────────────
export function SuggestionsSection({ section }: { section: HomeSection }) {
  const { theme } = useTheme();
  const layout = theme.layout ?? 'default';
  const gridCols = layout === 'editorial' ? 2 : layout === 'centered' ? 3 : 4;

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10 bg-[var(--bg-light)]">
      <SectionHeader
        title={section.title || 'Recomendado para vos'}
        subtitle={section.subtitle || 'Basado en tu historial'}
        eyebrow="SUGERENCIAS"
        viewAllHref="/products"
      />
      <ProductGrid limit={4} cols={gridCols as 2 | 3 | 4} />
    </section>
  );
}

// ─── 9. Banner de marca/categoría ────────────────────────────────────────────
export function BrandBannerSection({ section }: { section: HomeSection }) {
  return (
    <section className="px-4 sm:px-6 lg:px-20 py-6">
      <Link
        href={section.bannerLinkUrl || '#'}
        className="block rounded-2xl overflow-hidden relative h-[140px] lg:h-[200px] bg-gradient-to-r from-[var(--primary)] to-[var(--text-dark)]"
      >
        {section.bannerImageUrl ? (
          <Image src={section.bannerImageUrl} alt="Brand banner" fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center px-6">
              <p className="text-[11px] font-bold tracking-[3px] uppercase opacity-80 mb-1">Colección destacada</p>
              <p className="text-2xl lg:text-3xl font-bold">{section.title || 'Descubrí lo nuevo'}</p>
              {section.subtitle && <p className="text-sm mt-1 opacity-90">{section.subtitle}</p>}
            </div>
          </div>
        )}
      </Link>
    </section>
  );
}

// ─── 10. Productos según el banner ───────────────────────────────────────────
export function BrandProductsSection({ section }: { section: HomeSection }) {
  const { theme } = useTheme();
  const layout = theme.layout ?? 'default';
  const gridCols = layout === 'editorial' ? 2 : layout === 'centered' ? 3 : 4;

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-10 bg-[var(--bg)]">
      <SectionHeader
        title={section.title || 'Productos destacados'}
        subtitle={section.subtitle}
        eyebrow="DESTACADOS"
        viewAllHref="/products"
      />
      <ProductGrid limit={4} cols={gridCols as 2 | 3 | 4} />
    </section>
  );
}
