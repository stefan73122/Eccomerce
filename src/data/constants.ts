import { FAQItem, HeroSlide } from '@/types';

export const APP_NAME = 'STOREFRONT';

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Tiendas', href: '/stores' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Categorías', href: '/categories' },
  { label: 'Ofertas', href: '/deals' },
  { label: 'Contacto', href: '/contact' },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    tag: 'NUEVA COLECCIÓN',
    title: 'Descubre Productos\nQue Definen Tu Estilo',
    subtitle: 'Esenciales para el hogar moderno — relojes premium, accesorios y más.',
    image: 'https://images.unsplash.com/photo-1767396858167-96df7b775931?w=1440&q=80',
  },
  {
    tag: 'MÁS VENDIDOS',
    title: 'Relojes Premium\nPara Toda Ocasión',
    subtitle: 'Precisión y diseño atemporal. Explora nuestra colección insignia.',
    image: 'https://images.unsplash.com/photo-1583607314031-76f40f069cce?w=1440&q=80',
  },
  {
    tag: 'NUEVOS INGRESOS',
    title: 'Sonido Como\nNunca Antes',
    subtitle: 'Tecnología de audio inmersiva y audífonos premium para amantes de la música.',
    image: 'https://images.unsplash.com/photo-1753685723643-9a75a5d885ea?w=1440&q=80',
  },
  {
    tag: 'OFERTAS EXCLUSIVAS',
    title: 'Bolsos y Accesorios\nQue Viajan Contigo',
    subtitle: 'Explora nuestra colección de maletas y bolsos para cada viaje.',
    image: 'https://images.unsplash.com/photo-1544511196-1646449a253b?w=1440&q=80',
  },
];

export const TRUST_BADGES = [
  {
    icon: 'map-pin',
    title: 'Soporte Regional',
    description: '5 tiendas en la región con retiro en tienda y atención local.',
  },
  {
    icon: 'qr-code',
    title: 'Pagos QR Rápidos',
    description: 'Escanea y paga al instante con tu app bancaria. Sin datos de tarjeta.',
  },
  {
    icon: 'tag',
    title: 'Precios de Mayoreo',
    description: 'Precios directos del fabricante. Ahorra hasta 40% en cada pedido.',
  },
  {
    icon: 'shield-check',
    title: 'Seguro y Confiable',
    description: 'Encriptación SSL, pagos PCI y 30 días de devolución sin complicaciones.',
  },
];

export const FOOTER_QUICK_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/categories' },
  { label: 'Categorías', href: '/categories' },
  { label: 'Ofertas', href: '/deals' },
  { label: 'Nosotros', href: '/contact' },
  { label: 'Directorio de Tiendas', href: '/stores' },
  { label: 'Rastrear Pedido', href: '/track-order' },
  { label: 'Mi Cuenta', href: '/account' },
  { label: 'Flash Sale', href: '/deals' },
];

export const FOOTER_CUSTOMER_SERVICE = [
  { label: 'Contacto y Soporte', href: '/contact' },
  { label: 'Info de Envío', href: '/terms' },
  { label: 'Devoluciones y Cambios', href: '/terms' },
  { label: 'Preguntas Frecuentes', href: '/contact' },
  { label: 'Guía de Tallas', href: '/terms' },
  { label: 'Seguimiento de Pedido', href: '/track-order' },
  { label: 'Localizador de Tiendas', href: '/stores' },
  { label: 'Términos y Privacidad', href: '/terms' },
];

export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay y pagos QR a través de tu app bancaria.',
    category: 'Pagos',
  },
  {
    question: '¿Cuánto tarda el envío?',
    answer: 'El envío estándar tarda 3-5 días hábiles. El envío express entrega en 1-2 días hábiles. El retiro en tienda está disponible dentro de 2 horas de confirmado el pedido.',
    category: 'Envíos',
  },
  {
    question: '¿Cuál es su política de devoluciones?',
    answer: 'Ofrecemos 30 días de devolución sin complicaciones. Los artículos deben estar en condición original con etiquetas. Los reembolsos se procesan en 5-7 días hábiles.',
    category: 'Devoluciones',
  },
  {
    question: '¿Realizan envíos internacionales?',
    answer: 'Actualmente enviamos dentro de Bolivia. Los envíos internacionales estarán disponibles próximamente.',
    category: 'Envíos',
  },
  {
    question: '¿Cómo puedo rastrear mi pedido?',
    answer: 'Puedes rastrear tu pedido usando el número de seguimiento enviado a tu correo, o visitar nuestra página de Rastreo de Pedido e ingresar tu ID de pedido.',
    category: 'Pedidos',
  },
  {
    question: '¿Puedo retirar mi pedido en tienda?',
    answer: '¡Sí! Selecciona "Retiro en Tienda" en el checkout y elige tu tienda preferida. Los pedidos generalmente están listos en 2 horas.',
    category: 'Pedidos',
  },
];
