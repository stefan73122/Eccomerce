import api from '@/lib/axios';
import { Product, ProductColor, SearchFilters } from '@/types';
import { products as staticProducts } from '@/data/products';
import { SALES_CHANNEL_ID, ORGANIZATION_ID } from '@/lib/config';

// ─── Backend types ─────────────────────────────────────────────────────────

interface BackendMedia {
  id: number;
  url: string;
  fileType: string;
  altText: string | null;
  sortOrder: number;
}

interface BackendStockLevel {
  quantity: number;
}

interface BackendAttributeOption {
  value: string;
  attribute?: { name: string };
}

interface BackendVariantOption {
  attributeOption?: BackendAttributeOption;
}

interface BackendVariant {
  id: number;
  purchasePrice: number;
  salePrice?: number | null; // null = no channel price configured
  status: string;
  variantOptions?: BackendVariantOption[];
  stockLevels?: BackendStockLevel[];
}

interface BackendProduct {
  id: number;
  name: string;
  description: string | null;
  status: string;
  category?: { id: number; name: string; slug?: string | null };
  brand?: { id: number; name: string };
  variants?: BackendVariant[];
  media?: BackendMedia[];
}

interface BackendEnvelope<T> {
  status: string;
  data: T;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

// ─── Mapper ────────────────────────────────────────────────────────────────

export function mapProduct(p: BackendProduct): Product {
  const activeVariants = (p.variants ?? []).filter((v) => v.status === 'Active');

  // If salePrice field is present (even null) on any variant, we are in a sales-channel context.
  // In that case, use only salePrice — never fall back to purchasePrice (which is cost price).
  const inChannelContext = activeVariants.some((v) => 'salePrice' in v);
  const prices = inChannelContext
    ? activeVariants.map((v) => (v.salePrice != null ? Number(v.salePrice) : null)).filter((n): n is number => n !== null && n > 0)
    : activeVariants.map((v) => Number(v.purchasePrice)).filter((n) => n > 0);
  const price = prices.length > 0 ? Math.min(...prices) : 0;

  const totalStock = activeVariants.reduce((sum, v) => {
    const s = (v.stockLevels ?? []).reduce((a, sl) => a + sl.quantity, 0);
    return sum + s;
  }, 0);

  // inStock: solo verdadero si hay stockLevels cargados con stock > 0
  const inStock = totalStock > 0;

  const images = (p.media ?? [])
    .filter((m) => m.fileType === 'IMAGE')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.url);

  const colorsMap = new Map<string, ProductColor>();
  for (const v of activeVariants) {
    for (const vo of v.variantOptions ?? []) {
      const attrName = vo.attributeOption?.attribute?.name?.toLowerCase();
      if (attrName === 'color' || attrName === 'colour' || attrName === 'color') {
        const val = vo.attributeOption?.value;
        if (val && !colorsMap.has(val)) {
          colorsMap.set(val, { name: val, hex: '#888888' });
        }
      }
    }
  }

  const firstVariantId = activeVariants.length > 0 ? activeVariants[0].id : undefined;

  return {
    id: String(p.id),
    name: p.name,
    price,
    description: p.description ?? '',
    shortDescription: p.description ? p.description.slice(0, 120) : '',
    category: p.category?.name ?? 'Sin categoría',
    categorySlug: p.category?.slug ?? '',
    images,
    rating: 0,
    reviewCount: 0,
    inStock,
    stockCount: totalStock > 0 ? totalStock : undefined,
    colors: colorsMap.size > 0 ? Array.from(colorsMap.values()) : undefined,
    firstVariantId,
  };
}

// ─── API functions ──────────────────────────────────────────────────────────

export async function getProductsByRegion(
  regionId: number,
  page?: number,
  limit?: number,
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  const params: Record<string, number> = {
    salesChannelId: SALES_CHANNEL_ID,
    organizationId: ORGANIZATION_ID,
    regionId,
  };
  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;
  const response = await api.get<BackendEnvelope<BackendProduct[]>>(
    `/api/products/search`,
    { params },
  );
  const products = (response.data.data ?? []).map(mapProduct);
  return {
    products,
    total: response.data.pagination?.totalItems ?? products.length,
    totalPages: response.data.pagination?.totalPages ?? 1,
  };
}

export async function getProductsByCategoryId(
  categoryId: number,
  page?: number,
  limit?: number,
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  const params: Record<string, number> = { salesChannelId: SALES_CHANNEL_ID, categoryId, organizationId: ORGANIZATION_ID };
  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;
  const response = await api.get<BackendEnvelope<BackendProduct[]>>(
    `/api/products/search`,
    { params },
  );
  const products = (response.data.data ?? []).map(mapProduct);
  return {
    products,
    total: response.data.pagination?.totalItems ?? products.length,
    totalPages: response.data.pagination?.totalPages ?? 1,
  };
}

export async function getProductsByChannel(
  channelId: number = SALES_CHANNEL_ID,
  page?: number,
  limit?: number,
  regionId?: number,
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  const params: Record<string, number> = { salesChannelId: channelId, organizationId: ORGANIZATION_ID };
  if (page !== undefined) params.page = page;
  if (limit !== undefined) params.limit = limit;
  if (regionId !== undefined) params.regionId = regionId;
  const response = await api.get<BackendEnvelope<BackendProduct[]>>(
    `/api/products/search`,
    { params },
  );
  const products = (response.data.data ?? []).map(mapProduct);
  return {
    products,
    total: response.data.pagination?.totalItems ?? products.length,
    totalPages: response.data.pagination?.totalPages ?? 1,
  };
}

export async function getProductByIdFromApi(id: number): Promise<Product | null> {
  try {
    const response = await api.get<{ data: BackendProduct }>(`/api/products/${id}`);
    return mapProduct(response.data.data);
  } catch {
    return null;
  }
}

// ─── Static / local functions (kept for fallback) ──────────────────────────

export function getProducts(): Product[] {
  return staticProducts;
}

export function getProductById(id: string): Product | undefined {
  return staticProducts.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return staticProducts.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return staticProducts
    .filter((p) => p.id !== productId && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}

export function searchProducts(filters: SearchFilters): Product[] {
  let results = [...staticProducts];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  if (filters.category) {
    results = results.filter((p) => p.categorySlug === filters.category);
  }

  if (filters.priceRange) {
    results = results.filter(
      (p) => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1],
    );
  }

  if (filters.inStock) {
    results = results.filter((p) => p.inStock);
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.reverse();
        break;
    }
  }

  return results;
}

export function getDealsProducts(): Product[] {
  return staticProducts.filter((p) => p.originalPrice && p.originalPrice > p.price);
}
