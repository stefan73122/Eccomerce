import api from '@/lib/axios';
import type { Product, SellerProductPublic, SellerProductVariantPublic } from '@/types';

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

// ─── Mapper ─────────────────────────────────────────────────────────────────

export function mapSellerProduct(sp: SellerProductPublic): Product {
  const published = (sp.variants ?? []).filter(
    (v: SellerProductVariantPublic) => v.isPublished && v.price != null,
  );

  const prices = published
    .map((v) => Number(v.price))
    .filter((p) => p > 0);
  const price = prices.length > 0 ? Math.min(...prices) : 0;

  const comparePrices = published
    .map((v) => (v.compareAtPrice != null ? Number(v.compareAtPrice) : null))
    .filter((p): p is number => p != null && p > 0);
  const originalPrice = comparePrices.length > 0 ? Math.max(...comparePrices) : undefined;

  const totalStock = published.reduce((sum, v) => sum + (v.stock ?? 0), 0);

  const images = (sp.media ?? [])
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.url);

  const firstVariant = published[0];

  return {
    id: `sp_${sp.id}`,
    name: sp.name,
    price,
    originalPrice,
    description: sp.description ?? '',
    shortDescription: sp.description ? sp.description.slice(0, 120) : '',
    category: sp.suggestedCategory ?? 'Marketplace',
    categorySlug: '',
    images,
    rating: 0,
    reviewCount: 0,
    inStock: totalStock > 0 || published.length > 0,
    stockCount: totalStock > 0 ? totalStock : undefined,
    badge: originalPrice && originalPrice > price ? 'SALE' : undefined,
    source: '3p',
    sellerId: sp.sellerId,
    sellerStoreName: sp.sellerStoreName,
    sellerProductId: sp.id,
    firstVariantId: firstVariant?.id,
  };
}

// ─── API functions ───────────────────────────────────────────────────────────

export async function getSellerProducts(
  page = 1,
  limit = 20,
  search?: string,
  regionId?: number,
  sellerId?: number,
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;
  if (regionId) params.regionId = regionId;
  if (sellerId) params.sellerId = sellerId;

  const response = await api.get<BackendEnvelope<SellerProductPublic[]>>(
    '/api/seller-products/public',
    { params },
  );
  const products = (response.data.data ?? []).map(mapSellerProduct);
  return {
    products,
    total: response.data.pagination?.totalItems ?? products.length,
    totalPages: response.data.pagination?.totalPages ?? 1,
  };
}

export async function getSellerProductById(id: number): Promise<SellerProductPublic | null> {
  try {
    const response = await api.get<BackendEnvelope<SellerProductPublic>>(
      `/api/seller-products/public/${id}`,
    );
    return response.data.data;
  } catch {
    return null;
  }
}
