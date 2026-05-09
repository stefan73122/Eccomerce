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
    <aside className="hidden lg:block space-y-4 sticky top-4">
      <div className="rounded-2xl border border-[var(--border)] p-5 shadow-sm" style={{ backgroundColor: 'var(--sidebar-bg, var(--bg-light))' }}>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-3">Tendencias</p>
        <div className="grid grid-cols-2 gap-2">
          {['Nuevas', 'Populares', 'Top ventas', 'Ofertas'].map((item) => (
            <div key={item} className="rounded-xl border border-[var(--border)] p-2.5 text-center text-xs font-medium text-[var(--text-dark)]" style={{ backgroundColor: 'var(--bg-card)' }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] p-5" style={{ backgroundColor: 'var(--sidebar-bg, var(--bg-light))' }}>
        <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--text-muted)] mb-3">Colecciones</p>
        <div className="space-y-2">
          {['Hogar', 'Moda', 'Electrónica', 'Regalos'].map((label) => (
            <div key={label} className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text-dark)] cursor-pointer hover:border-[var(--primary)] transition-colors" style={{ backgroundColor: 'var(--bg-card)' }}>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] p-5" style={{ backgroundColor: 'var(--sidebar-bg, var(--bg-light))' }}>
        <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--text-muted)] mb-3">Recomendado</p>
        <div className="space-y-2">
          <div className="rounded-xl border border-[var(--border)] p-3 cursor-pointer hover:border-[var(--primary)] transition-colors" style={{ backgroundColor: 'var(--bg-card)' }}>
            <p className="text-sm font-semibold text-[var(--text-dark)]">Gorra urbana</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Lo más visto esta semana.</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-3 cursor-pointer hover:border-[var(--primary)] transition-colors" style={{ backgroundColor: 'var(--bg-card)' }}>
            <p className="text-sm font-semibold text-[var(--text-dark)]">Accesorios</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Impresiona con estilo.</p>
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
  const sidebarPosition = theme.layoutSettings?.editorial?.sidebarPosition ?? 'right';
  const sidebarWidth = theme.layoutSettings?.editorial?.sidebarWidth ?? '360px';

  // Editorial: everything up to and including mainBanner goes in the 2-col grid
  // Everything after mainBanner goes below in full width
  const mainBannerIndex = sections.findIndex((s) => s.id === 'mainBanner');
  const splitAt = isEditorial ? (mainBannerIndex === -1 ? sections.length : mainBannerIndex + 1) : sections.length;
  const topSections = isEditorial ? sections.slice(0, splitAt) : [];
  const bottomSections = isEditorial ? sections.slice(splitAt) : sections;

  const wrappedTop = layout === 'default' || layout === 'centered';
  const wrappedBottom = layout === 'default' || layout === 'centered';

  return (
    <>
      {isEditorial && topSections.length > 0 ? (
        <div
          className={cn(
            'space-y-8 lg:grid lg:gap-8 lg:items-start',
            sidebarPosition === 'left'
              ? `lg:grid-cols-[${sidebarWidth}_minmax(0,1fr)]`
              : `lg:grid-cols-[minmax(0,1fr)_${sidebarWidth}]`,
            wrappedTop && 'section-container',
          )}
        >
          {sidebarPosition === 'left' && <EditorialSidebar />}
          <div className="space-y-8 min-w-0">
            {topSections.map((section) => {
              const Component = SECTION_MAP[section.id];
              if (!Component) return null;
              return <Component key={section.id} section={section} />;
            })}
          </div>
          {sidebarPosition === 'right' && <EditorialSidebar />}
        </div>
      ) : (
        <div className={cn('space-y-8', wrappedBottom && 'section-container')}>
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
