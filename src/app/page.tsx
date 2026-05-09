'use client';

import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/lib/cn';
import TrustBadges from '@/components/home/TrustBadges';
import type { HomeSection, HomeSectionId } from '@/lib/theme/theme.types';
import {
  PromotionsSection,
  CategoriesSection,
  SaleProductsSection,
  MainBannerSection,
  CategoryProductsSection,
  SuggestionsSection,
  BrandBannerSection,
  BrandProductsSection,
} from '@/components/home/sections/sections';

const SECTION_MAP: Record<HomeSectionId, (p: { section: HomeSection }) => React.ReactNode> = {
  promotions:       PromotionsSection,
  categories:       CategoriesSection,
  saleProducts:     SaleProductsSection,
  mainBanner:       MainBannerSection,
  categoryProducts: CategoryProductsSection,
  suggestions:      SuggestionsSection,
  brandBanner:      BrandBannerSection,
  brandProducts:    BrandProductsSection,
};

function EditorialSidebar() {
  return (
    <aside className="hidden lg:block space-y-6">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-light)] p-6 shadow-sm">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4">Columna secundaria</p>
        <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-3">Contenido editorial</h2>
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          Aquí encontrarás recursos rápidos, categorías destacadas y productos resaltados que complementan el flujo principal.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-light)] p-6">
        <p className="text-xs uppercase tracking-[0.26em] text-[var(--text-muted)] mb-4">Tendencias</p>
        <div className="grid grid-cols-2 gap-3">
          {['Nuevas', 'Populares', 'Top ventas', 'Ofertas'].map((item) => (
            <div key={item} className="rounded-2xl bg-white/90 border border-[var(--border)] p-3 text-center text-sm font-medium text-[var(--text-dark)]">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-light)] p-6">
        <p className="text-xs uppercase tracking-[0.26em] text-[var(--text-muted)] mb-4">Colecciones</p>
        <div className="space-y-3">
          {['Hogar', 'Moda', 'Electrónica', 'Regalos'].map((label) => (
            <div key={label} className="rounded-2xl border border-[var(--border)] bg-white/90 px-4 py-3 text-sm text-[var(--text-dark)]">
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-light)] p-6">
        <p className="text-xs uppercase tracking-[0.26em] text-[var(--text-muted)] mb-4">Recomendado</p>
        <div className="space-y-3">
          <div className="rounded-3xl bg-white/95 border border-[var(--border)] p-4">
            <p className="text-sm font-semibold text-[var(--text-dark)] mb-2">Gorra urbana</p>
            <p className="text-xs text-[var(--text-muted)]">Lo más visto esta semana.</p>
          </div>
          <div className="rounded-3xl bg-white/95 border border-[var(--border)] p-4">
            <p className="text-sm font-semibold text-[var(--text-dark)] mb-2">Accesorios</p>
            <p className="text-xs text-[var(--text-muted)]">Impresiona con estilo.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function HomePage() {
  const { theme } = useTheme();
  const sections = theme.homeSections ?? [];
  const layout = theme.layout ?? 'default';
  const isEditorial = layout === 'editorial';
  const splitIndex = sections.findIndex((section) => section.id === 'categories');
  const topSections = splitIndex === -1 ? sections : sections.slice(0, splitIndex);
  const bottomSections = splitIndex === -1 ? [] : sections.slice(splitIndex);
  const wrappedTop = layout === 'default' || layout === 'centered';
  const wrappedBottom = layout === 'default' || layout === 'centered';

  return (
    <>
      {isEditorial && topSections.length > 0 ? (
        <div className={cn('space-y-8 lg:grid lg:grid-cols-[minmax(0,2fr)_360px] lg:gap-8 lg:items-start', wrappedTop && 'section-container')}>
          <div className="space-y-8">
            {topSections.map((section) => {
              const Component = SECTION_MAP[section.id];
              if (!Component) return null;
              return <Component key={section.id} section={section} />;
            })}
          </div>
          <EditorialSidebar />
        </div>
      ) : (
        <div className={cn('space-y-8', wrappedTop && 'section-container')}>
          {sections.map((section) => {
            const Component = SECTION_MAP[section.id];
            if (!Component) return null;
            return <Component key={section.id} section={section} />;
          })}
        </div>
      )}

      {!isEditorial && <TrustBadges />}

      {isEditorial && bottomSections.length > 0 && (
        <div className={cn('space-y-8', wrappedBottom && 'section-container')}>
          {bottomSections.map((section) => {
            const Component = SECTION_MAP[section.id];
            if (!Component) return null;
            return <Component key={section.id} section={section} />;
          })}
        </div>
      )}
    </>
  );
}
