import type { StoreTheme } from './theme.types';

export const defaultTheme: StoreTheme = {
  branding: {
    storeName: 'STOREFRONT',
    logoUrl: '',
    faviconUrl: '/favicon.ico',
  },

  colors: {
    primary:    '#0D6E6E',
    secondary:  '#1A1A1A',
    background: '#FFFFFF',
    surface:    '#F8F9FA',
    text:       '#1A1A1A',
    textMuted:  '#666666',
    border:     '#E5E5E5',
    success:    '#22C55E',
    error:      '#FF3366',
    warning:    '#B8860B',
  },

  typography: {
    fontFamily:   'Inter',
    fontUrl:      '',
    baseFontSize: '16px',
  },

  topBar: {
    visible:         true,
    backgroundColor: '#F5F5F5',
    textColor:       '#666666',
    links: [
      { label: 'Ventas telefónicas',  href: 'tel:+591' },
      { label: 'Atención al cliente', href: '/contact' },
      { label: 'Sigue tu pedido',     href: '/orders'  },
    ],
  },

  navbar: {
    variant:         'classic',
    backgroundColor: '#FFFFFF',
    textColor:       '#1A1A1A',
    activeColor:     '#0D6E6E',
    hoverColor:      '#E5E5E5',
    layout:          'horizontal',
    sticky:          true,
    showSearch:      true,
    borderRadius:    '0px',
    shadow:          false,
  },

  categoryBar: {
    visible:         true,
    backgroundColor: '#1A1A1A',
    textColor:       '#FFFFFF',
    buttonColor:     '#0D6E6E',
    buttonLabel:     'Categorías',
  },

  announcementBar: {
    visible:         true,
    text:            '🚚 ENVÍO GRATUITO — COMPRA Y RECIBE EN 24 HRS.',
    backgroundColor: '#0D6E6E',
    textColor:       '#FFFFFF',
  },

  productCards: {
    variant:         'classic',
    borderRadius:    '12px',
    shadow:          true,
    showDescription: false,
    imageHeight:     '180px',
    buttonStyle:     'rounded',
    hoverEffect:     'zoom',
    showBadge:       true,
    showRating:      false,
    showStock:       true,
    showWishlist:    true,
    showCategory:    true,
    imageAspect:     'auto',
  },

  login: {
    backgroundType:     'color',
    backgroundColor:    '#0D6E6E',
    backgroundImageUrl: '',
  },

  footer: {
    backgroundColor: '#1A1A1A',
    textColor:       '#999999',
  },

  buttons: {
    primaryColor:  '#0D6E6E',
    hoverColor:    '#0A5555',
    hoverEffect:   'fade',
    borderRadius:  '6px',
    shadow:        false,
  },

  banners: {
    primaryColor:     '#0D6E6E',
    gradient:         'linear-gradient(135deg, #0D6E6E 0%, #0A5555 100%)',
    textColor:        '#FFFFFF',
    opacity:          1,
    borderRadius:     '0px',
    heroHeight:       '',
    heroMaxWidth:     '100%',
    brandBannerHeight: '200px',
  },

  /* ── Nuevos campos ── */
  layout:        'default',
  businessModel: 'general',

  layoutSettings: {
    default:   { heroHeight: '520px', containerMaxWidth: '1320px', sectionGap: '2rem' },
    centered:  { heroHeight: '420px', containerMaxWidth: '960px',  paddingX: '3rem'  },
    editorial: { heroHeight: '580px', sidebarWidth: '360px',       sidebarBg: '',    sidebarPosition: 'right' },
    fullwidth: { heroHeight: '640px', paddingX: '0px' },
  },

  homeSections: [
    { id: 'promotions',       visible: true,  title: 'Promociones',                 subtitle: 'Las mejores ofertas del momento' },
    { id: 'categories',       visible: true,  title: 'Explorá por categoría',       subtitle: 'Encontrá lo que buscás' },
    { id: 'saleProducts',     visible: true,  title: 'Productos en oferta',         subtitle: 'Descuentos por tiempo limitado' },
    { id: 'mainBanner',       visible: true,  title: '',                            subtitle: '', bannerImageUrl: '', bannerLinkUrl: '/products' },
    { id: 'categoryProducts', visible: true,  title: 'Lo mejor de cada categoría', subtitle: 'Novedades y más vendidos' },
    { id: 'suggestions',      visible: true,  title: 'Recomendado para vos',        subtitle: 'Basado en tus últimas compras' },
    { id: 'brandBanner',      visible: true,  title: '',                            subtitle: '', bannerImageUrl: '', bannerLinkUrl: '/products' },
    { id: 'brandProducts',    visible: true,  title: 'Productos destacados',        subtitle: 'De la colección que elegiste' },
  ],
};