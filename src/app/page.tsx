'use client';

import { useTheme } from '@/lib/theme/ThemeContext';
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

export default function HomePage() {
  const { theme } = useTheme();
  const sections = theme.homeSections ?? [];

  return (
    <div>
      {sections
        .filter((s) => s.visible)
        .map((section) => {
          const Component = SECTION_MAP[section.id];
          if (!Component) return null;
          return <Component key={section.id} section={section} />;
        })}
      <TrustBadges />
    </div>
  );
}
