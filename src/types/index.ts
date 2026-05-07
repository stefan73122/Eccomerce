export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription?: string;
  category: string;
  categorySlug: string;
  images: string[];
  badge?: 'HOT' | 'NEW' | 'SALE' | 'LIMITED' | 'BESTSELLER';
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount?: number;
  colors?: ProductColor[];
  specs?: Record<string, string>;
  storeId?: string;
  firstVariantId?: number;
  /** Marketplace 3P fields */
  source?: '1p' | '3p';
  sellerId?: number;
  sellerStoreName?: string;
  sellerProductId?: number;
}

// ─── Marketplace / 3P types ─────────────────────────────────────────────────

export interface SellerProductVariantPublic {
  id: number;
  label: string;
  sku: string | null;
  price: number | null;
  compareAtPrice: number | null;
  stock: number;
  isPublished: boolean;
}

export interface SellerProductPublic {
  id: number;
  sellerId: number;
  sellerStoreName?: string;
  name: string;
  description: string | null;
  suggestedCategory: string | null;
  approvalStatus: string;
  media?: { id: number; url: string; sortOrder: number; altText: string | null }[];
  variants?: SellerProductVariantPublic[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  productCount: number;
  subcategories?: { name: string; slug: string }[];
}

export interface Store {
  id: number;
  name: string;
  address: string | null;
  regionId: number;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  region?: {
    id: number;
    name: string;
    latitude: number | null;
    longitude: number | null;
  };
  phone?: string;
  hours?: string;
  distance?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoresApiResponse {
  status: string;
  data: Store[];
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  regionId?: number;
  customerId?: number;
  status?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface ApiEnvelope<T> {
  status: string;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
  user?: {
    id: number;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    roles?: string[];
    customer?: {
      id?: number;
      phone?: string;
      regionId?: number;
      personId?: number;
      person?: {
        firstName?: string;
        lastName?: string;
      };
    };
    customerId?: number;
  };
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  store?: Store;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface SearchFilters {
  query: string;
  category?: string;
  priceRange?: [number, number];
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
  inStock?: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface HeroSlide {
  tag: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface Region {
  id: number;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
