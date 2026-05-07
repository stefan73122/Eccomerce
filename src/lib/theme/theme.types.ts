export type HomeSectionId =
  | 'promotions'        // 3. Promociones
  | 'categories'        // 4. Banners de categorías
  | 'saleProducts'      // 5. Productos en promoción
  | 'mainBanner'        // 6. Banner principal
  | 'categoryProducts'  // 7. Productos por categoría (rotativo)
  | 'suggestions'       // 8. Sugerencias al cliente
  | 'brandBanner'       // 9. Banner (producto/categoría/marca)
  | 'brandProducts';    // 10. Productos según el banner

export interface HomeSection {
  id: HomeSectionId;
  visible: boolean;
  title?: string;
  subtitle?: string;
  bannerImageUrl?: string;
  bannerLinkUrl?: string;
}

export interface StoreTheme {
  branding: {
    storeName: string;
    logoUrl: string;
    faviconUrl: string;
    bannerUrl?: string;
  };

  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };

  typography: {
    fontFamily: string;
    fontUrl?: string;
    baseFontSize: string;
  };

  topBar: {
    visible: boolean;
    backgroundColor: string;
    textColor: string;
    links: Array<{ label: string; href: string }>;
  };

  navbar: {
    backgroundColor: string;
    textColor: string;
    activeColor: string;
    layout: 'horizontal' | 'centered';
    sticky: boolean;
    showSearch: boolean;
  };

  categoryBar: {
    visible: boolean;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonLabel: string;
  };

  announcementBar: {
    visible: boolean;
    text: string;
    backgroundColor: string;
    textColor: string;
  };

  productCards: {
    variant: 'classic' | 'minimal' | 'overlay' | 'compact';
    borderRadius: string;
    shadow: boolean;
    showDescription: boolean;
    imageHeight: string;
    buttonStyle: 'rounded' | 'pill' | 'square';
    hoverEffect: 'zoom' | 'lift' | 'none';
    showBadge: boolean;
    showRating: boolean;
    showStock: boolean;
    showWishlist: boolean;
    showCategory: boolean;
    imageAspect: 'square' | 'portrait' | 'landscape' | 'auto';
  };

  login: {
    backgroundType: 'color' | 'image';
    backgroundColor: string;
    backgroundImageUrl?: string;
  };

  footer: {
    backgroundColor: string;
    textColor: string;
  };

  homeSections: HomeSection[];
}

export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type ThemeUpdate = DeepPartial<StoreTheme>;
