export type HomeSectionId =
  | 'promotions'
  | 'categories'
  | 'saleProducts'
  | 'mainBanner'
  | 'categoryProducts'
  | 'suggestions'
  | 'brandBanner'
  | 'brandProducts';

export interface HomeSection {
  id: HomeSectionId;
  visible: boolean;
  title?: string;
  subtitle?: string;
  bannerImageUrl?: string;
  bannerLinkUrl?: string;
}

/* ── Layout y modelo de negocio ────────────────────────────── */

export type LayoutMode =
  | 'default'     // hero full + grid asimétrico
  | 'centered'    // todo centrado, máx 960px
  | 'editorial'   // col principal + sidebar
  | 'fullwidth';  // sin límites, inmersivo

export type BusinessModel =
  | 'general'      // Amazon: producto primero
  | 'sport'        // Nike: hero fuerte, branding
  | 'fashion'      // Zara: visual, minimal
  | 'food'         // McDonald's: colores fuertes, imágenes grandes
  | 'street'       // Supreme: minimal extremo
  | 'marketplace'; // MercadoLibre: categorías primero

/* ── Color presets ─────────────────────────────────────────── */

export interface ColorPreset {
  id: string;
  label: string;
  swatch: string;
  colors: Partial<StoreTheme['colors']>;
}

/* ── StoreTheme principal ──────────────────────────────────── */

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

  /* Nuevos campos ─────────────────────────────────────────── */
  layout: LayoutMode;
  businessModel: BusinessModel;
  homeSections: HomeSection[];
}

export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type ThemeUpdate = DeepPartial<StoreTheme>;