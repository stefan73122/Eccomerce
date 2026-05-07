'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Minus,
  Plus,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Loader2,
  Package,
  Store,
  MapPin,
  Warehouse,
  X,
  Search,
  Globe,
  Navigation,
} from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGallery from '@/components/product/ProductGallery';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/cn';
import api from '@/lib/axios';
import { formatPrice } from '@/lib/utils';
import { SALES_CHANNEL_ID } from '@/lib/config';

// ─── Backend types ────────────────────────────────────────────────────────────

interface BMedia {
  id: number;
  url: string;
  fileType: string;
  altText: string | null;
  sortOrder: number;
}

interface BStockLevel {
  quantity: number;
}

interface BAttributeOption {
  value: string;
  attribute?: { name: string };
}

interface BVariantOption {
  attributeOption?: BAttributeOption;
}

interface BVariant {
  id: number;
  sku?: string | null;
  name?: string | null;
  description?: string | null;
  purchasePrice: number;
  salePrice?: number | null;
  status: string;
  variantOptions?: BVariantOption[];
  stockLevels?: BStockLevel[];
  media?: BMedia[];
}

interface BStore {
  id: number;
  name: string;
  address: string | null;
  regionName: string | null;
}

interface BProduct {
  id: number;
  name: string;
  description: string | null;
  status: string;
  category?: { id: number; name: string; slug?: string | null };
  brand?: { id: number; name: string };
  variants?: BVariant[];
  media?: BMedia[];
  stores?: BStore[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildAttributeMap(variants: BVariant[]): Map<string, string[]> {
  const map = new Map<string, Set<string>>();
  for (const v of variants) {
    if (v.status !== 'Active') continue;
    for (const vo of v.variantOptions ?? []) {
      const name = vo.attributeOption?.attribute?.name;
      const value = vo.attributeOption?.value;
      if (!name || !value) continue;
      if (!map.has(name)) map.set(name, new Set());
      map.get(name)!.add(value);
    }
  }
  const result = new Map<string, string[]>();
  for (const [k, v] of map) result.set(k, Array.from(v));
  return result;
}

function findMatchingVariant(
  variants: BVariant[],
  selections: Record<string, string>,
): BVariant | null {
  const entries = Object.entries(selections);
  if (entries.length === 0) return null;
  return (
    variants.find((v) => {
      if (v.status !== 'Active') return false;
      return entries.every(([attrName, attrValue]) =>
        (v.variantOptions ?? []).some(
          (vo) =>
            vo.attributeOption?.attribute?.name === attrName &&
            vo.attributeOption?.value === attrValue,
        ),
      );
    }) ?? null
  );
}

function getImages(product: BProduct, variant: BVariant | null): string[] {
  const variantImages = (variant?.media ?? [])
    .filter((m) => m.fileType === 'IMAGE')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.url);
  if (variantImages.length > 0) return variantImages;

  return (product.media ?? [])
    .filter((m) => m.fileType === 'IMAGE')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => m.url);
}

function getVariantStock(variant: BVariant | null): number {
  if (!variant) return 0;
  return (variant.stockLevels ?? []).reduce((s, sl) => s + sl.quantity, 0);
}

function getVariantLabel(v: BVariant): string {
  if (v.name) return v.name;
  const fromOptions = (v.variantOptions ?? [])
    .map((vo) => vo.attributeOption?.value)
    .filter(Boolean)
    .join(' / ');
  return fromOptions || v.sku || String(v.id);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const addToast = useUIStore((s) => s.addToast);
  const wishlist = useUserStore((s) => s.wishlist);
  const addToWishlist = useUserStore((s) => s.addToWishlist);
  const removeFromWishlist = useUserStore((s) => s.removeFromWishlist);

  const [product, setProduct] = useState<BProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get<{ data: BProduct }>(`/api/products/${id}?salesChannelId=${SALES_CHANNEL_ID}`);
      const p = res.data.data;
      setProduct(p);

      // Auto-select first value for each attribute
      const attrMap = buildAttributeMap(p.variants ?? []);
      const initial: Record<string, string> = {};
      for (const [attr, values] of attrMap) {
        if (values.length > 0) initial[attr] = values[0];
      }
      setSelections(initial);

      // Auto-select store when only one is available
      if (p.stores?.length === 1) {
        setSelectedStoreId(p.stores[0].id);
      }
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-3">
        <Package size={48} className="text-[#CCCCCC]" />
        <p className="text-lg text-[var(--text-muted)]">Producto no encontrado.</p>
        <Link href="/" className="text-sm text-[var(--primary)] hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  const activeVariants = (product.variants ?? []).filter((v) => v.status === 'Active');
  const attrMap = buildAttributeMap(activeVariants);
  const selectedVariant = findMatchingVariant(activeVariants, selections);

  const displayImages = getImages(product, selectedVariant);

  // Since this page always requests salesChannelId, salePrice is the channel price (or null if not configured).
  // Never fall back to purchasePrice (cost price).
  const getVariantChannelPrice = (v: BVariant): number | null =>
    v.salePrice != null && Number(v.salePrice) > 0 ? Number(v.salePrice) : null;

  const channelPrices = activeVariants.map(getVariantChannelPrice).filter((p): p is number => p !== null);
  const displayPrice = selectedVariant
    ? (getVariantChannelPrice(selectedVariant) ?? 0)
    : channelPrices.length > 0
    ? Math.min(...channelPrices)
    : 0;

  const hasChannelPrice = displayPrice > 0;

  const stockCount = selectedVariant
    ? getVariantStock(selectedVariant)
    : activeVariants.reduce((s, v) => s + getVariantStock(v), 0);

  const inStock = stockCount > 0;
  const canPurchase = hasChannelPrice && inStock;

  const isWishlisted = wishlist.some((w) => w.product.id === String(product.id));

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(String(product.id));
      addToast('Eliminado de favoritos', 'info');
    } else {
      addToWishlist({
        id: String(product.id),
        name: product.name,
        price: displayPrice,
        description: product.description ?? '',
        shortDescription: '',
        category: product.category?.name ?? '',
        categorySlug: product.category?.slug ?? '',
        images: displayImages,
        rating: 0,
        reviewCount: 0,
        inStock,
      });
      addToast('Añadido a favoritos', 'success');
    }
  };

  const handleAddToCart = async () => {
    const cartProduct = {
      id: String(product.id),
      name: product.name,
      price: displayPrice,
      description: product.description ?? '',
      shortDescription: '',
      category: product.category?.name ?? '',
      categorySlug: product.category?.slug ?? '',
      images: displayImages,
      rating: 0,
      reviewCount: 0,
      inStock,
    };
    addItem(cartProduct, quantity);
    openCartDrawer();

    const variantForCart = selectedVariant ?? activeVariants[0] ?? null;
    if (variantForCart) {
      try {
        await api.post('/api/carts/items', {
          productVariantId: variantForCart.id,
          salesChannelId: SALES_CHANNEL_ID,
          quantity,
        });
      } catch {
        // La adición local al carrito ya se realizó; el error del API no bloquea al usuario
      }
    }

    addToast(`${product.name} agregado al carrito`, 'success');
  };

  const handleBuyNow = async () => {
    const cartProduct = {
      id: String(product.id),
      name: product.name,
      price: displayPrice,
      description: product.description ?? '',
      shortDescription: '',
      category: product.category?.name ?? '',
      categorySlug: product.category?.slug ?? '',
      images: displayImages,
      rating: 0,
      reviewCount: 0,
      inStock,
    };
    addItem(cartProduct, quantity);

    const variantForCart = selectedVariant ?? activeVariants[0] ?? null;
    if (variantForCart) {
      try {
        await api.post('/api/carts/items', {
          productVariantId: variantForCart.id,
          salesChannelId: SALES_CHANNEL_ID,
          quantity,
        });
      } catch {
        // La adición local ya se realizó
      }
    }

    router.push('/checkout');
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[var(--border-light)]">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            ...(product.category
              ? [{ label: product.category.name, href: `/categories/${product.category.slug ?? ''}` }]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      {/* Main Section */}
      <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-20 py-8 lg:py-10">
        {/* Left: Gallery */}
        <div className="w-full lg:w-1/2 shrink-0">
          <ProductGallery images={displayImages} />
        </div>

        {/* Right: Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col gap-[18px]">
          {/* Brand */}
          {product.brand && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
              {product.brand.name}
            </span>
          )}

          {/* Name */}
          <h1 className="text-[28px] font-bold text-[var(--text-dark)]">
            {product.name}
          </h1>

          {/* Price */}
          {hasChannelPrice ? (
            <div className="flex items-center gap-3">
              <span className="text-[32px] font-bold text-[var(--text-dark)]">
                {formatPrice(displayPrice)}
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
              <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">No disponible en tu región</p>
                <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                  Este producto aún no está configurado para venta en línea en tu zona. Puede estar disponible en tiendas físicas.
                </p>
              </div>
            </div>
          )}

          {/* Stock badge — only relevant when there's a channel price */}
          {hasChannelPrice && (
            <div className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', inStock ? 'bg-green-500' : 'bg-red-500')} />
              <span className="text-sm text-[var(--text-muted)]">
                {inStock ? `En stock${stockCount > 0 ? ` (${stockCount} disponibles)` : ''}` : 'Sin stock'}
              </span>
            </div>
          )}

          {/* Description — dynamic: variant first, fallback to product */}
          {(selectedVariant?.description || product.description) && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {selectedVariant?.description || product.description}
            </p>
          )}

          {/* Store Availability */}
          {product.stores && product.stores.length > 0 && (
            <div className="rounded-[10px] bg-[#F8F9FA] border border-[#EAEAEA] p-4 flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Warehouse size={15} className="text-[var(--primary)]" />
                  <span className="text-[13px] font-semibold text-[var(--text-dark)]">Disponibilidad en tiendas</span>
                </div>
                <div className="flex items-center gap-1 bg-[var(--primary)]/10 rounded-full px-2.5 py-1">
                  <Globe size={11} className="text-[var(--primary)]" />
                  <span className="text-[11px] font-semibold text-[var(--primary)]">Bolivia</span>
                </div>
              </div>

              {/* Store rows (up to 3) */}
              {product.stores.slice(0, 3).map((store) => {
                const isSelected = selectedStoreId === store.id;
                return (
                  <div
                    key={store.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg bg-white px-3 py-2.5',
                      isSelected ? 'border border-[#0D6E6E40]' : 'border border-transparent',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-semibold text-[var(--text-dark)]">{store.name}</span>
                          {store.regionName && (
                            <span className="text-[10px] text-[var(--text-muted)] bg-gray-100 px-1.5 py-0.5 rounded">
                              {store.regionName}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-green-600">
                          {isSelected ? 'Listo para envío · Seleccionada' : 'En stock'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStoreId(isSelected ? null : store.id)}
                      className={cn(
                        'text-[11px] font-semibold px-3 py-1.5 rounded-md transition-colors',
                        isSelected
                          ? 'bg-[var(--primary)] text-white'
                          : 'border border-[#DDDDDD] text-[#666666] hover:border-[var(--primary)] hover:text-[var(--primary)]',
                      )}
                    >
                      {isSelected ? 'Seleccionada' : 'Seleccionar'}
                    </button>
                  </div>
                );
              })}

              {/* Ver todas */}
              {product.stores.length > 3 && (
                <button
                  onClick={() => setShowStoreModal(true)}
                  className="text-[12px] font-semibold text-[var(--primary)] hover:underline text-center pt-1"
                >
                  Ver todas las tiendas ({product.stores.length})
                </button>
              )}
              {product.stores.length <= 3 && product.stores.length > 0 && (
                <button
                  onClick={() => setShowStoreModal(true)}
                  className="text-[12px] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors text-center pt-0.5"
                >
                  Ver detalles de tiendas
                </button>
              )}
            </div>
          )}

          {/* Attribute selectors */}
          {attrMap.size > 0 && (
            <div className="flex flex-col gap-4">
              {Array.from(attrMap.entries()).map(([attrName, values]) => (
                <div key={attrName} className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-[var(--text-dark)]">
                    {attrName}
                    {selections[attrName] && (
                      <span className="font-normal text-[var(--text-muted)] ml-1">
                        — {selections[attrName]}
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {values.map((val) => (
                      <button
                        key={val}
                        onClick={() => setSelections((prev) => ({ ...prev, [attrName]: val }))}
                        className={cn(
                          'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                          selections[attrName] === val
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                            : 'border-[var(--border)] text-[var(--text-dark)] hover:border-[var(--primary)]',
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--text-dark)]">Cantidad</span>
            <div className="flex items-center gap-0 w-fit border border-[var(--border)] rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-[var(--border)]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!canPurchase}
              className="flex-1 h-12 border border-[var(--primary)] text-[var(--primary)] font-medium rounded-lg hover:bg-[var(--primary)]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Agregar al carrito
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!canPurchase}
              className="flex-1 h-12 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Comprar ahora
            </button>
            <button
              onClick={handleToggleWishlist}
              className="w-12 h-12 border border-[var(--border)] rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
            >
              <Heart size={18} className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-[var(--text-muted)]'} />
            </button>
          </div>
        </div>
      </section>

      {/* Variants table — only shown when more than 1 variant */}
      {activeVariants.length > 1 && (
        <>
          <div className="border-t border-[#E5E5E5]" />
          <section className="px-4 sm:px-6 lg:px-20 py-9">
            <h3 className="text-lg font-bold text-[var(--text-dark)] mb-4">Variantes disponibles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Variante</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Precio</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVariants.map((v, i) => {
                    const stock = getVariantStock(v);
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <tr
                        key={v.id}
                        className={cn(
                          'border-b border-[var(--border)] transition-colors',
                          isSelected ? 'bg-blue-50' : i % 2 === 0 ? 'bg-[var(--bg-light)]' : 'bg-white',
                        )}
                      >
                        <td className="py-2.5 px-3 text-[var(--text-dark)]">{getVariantLabel(v)}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-[var(--text-dark)]">
                          {getVariantChannelPrice(v) != null ? formatPrice(getVariantChannelPrice(v)!) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={cn(
                            'text-xs font-medium px-1.5 py-0.5 rounded',
                            stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600',
                          )}>
                            {stock > 0 ? stock : 'Sin stock'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Store Selector Modal */}
      {showStoreModal && product.stores && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowStoreModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[520px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAEAEA]">
              <div className="flex items-center gap-2.5">
                <MapPin size={20} className="text-[var(--primary)]" />
                <span className="text-lg font-bold text-[var(--text-dark)]">Seleccionar tienda</span>
              </div>
              <button
                onClick={() => setShowStoreModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={15} className="text-[#666666]" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-[#EAEAEA]">
              <div className="flex items-center gap-2.5 bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg px-3.5 h-11">
                <Search size={15} className="text-[#BBBBBB] shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar tienda por nombre..."
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[var(--text-dark)] placeholder:text-[#BBBBBB] outline-none"
                />
              </div>
            </div>

            {/* Store list */}
            <div className="overflow-y-auto max-h-[360px]">
              {product.stores
                .filter((s) => s.name.toLowerCase().includes(storeSearch.toLowerCase()))
                .map((store) => {
                  const isSelected = selectedStoreId === store.id;
                  return (
                    <button
                      key={store.id}
                      onClick={() => { setSelectedStoreId(store.id); setShowStoreModal(false); }}
                      className={cn(
                        'w-full flex items-center gap-3 px-6 py-3.5 text-left transition-colors',
                        isSelected
                          ? 'bg-[#F0FAFA] border-l-[3px] border-l-[var(--primary)]'
                          : 'border-b border-[#F0F0F0] hover:bg-gray-50',
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                        isSelected ? 'bg-[#E6F2F2]' : 'bg-[#F5F5F5]',
                      )}>
                        <Store size={17} className={isSelected ? 'text-[var(--primary)]' : 'text-[#999999]'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className={cn(
                            'text-[15px] font-semibold truncate',
                            isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-dark)]',
                          )}>
                            {store.name}
                          </p>
                          {store.regionName && (
                            <span className="shrink-0 text-[10px] text-[var(--text-muted)] bg-gray-100 px-1.5 py-0.5 rounded">
                              {store.regionName}
                            </span>
                          )}
                        </div>
                        {store.address && (
                          <p className="text-[12px] text-[#888888] truncate mt-0.5">{store.address}</p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="shrink-0 bg-[var(--primary)] text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                          Seleccionada
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-1.5 px-6 py-3.5 bg-[#F8F9FA] border-t border-[#EAEAEA]">
              <Navigation size={11} className="text-[#999999]" />
              <span className="text-[12px] text-[#999999]">El precio de envío varía según la tienda seleccionada</span>
            </div>
          </div>
        </div>
      )}

      {/* Shipping & Returns Bar */}
      <section className="bg-[var(--bg-warm)] px-4 sm:px-6 lg:px-20 py-8">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex-1 flex items-center justify-center gap-3">
            <Truck size={24} className="text-[var(--primary)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-dark)]">Envío gratis</p>
              <p className="text-xs text-[var(--text-muted)]">En pedidos mayores a Bs. 500</p>
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--border)] hidden sm:block" />
          <div className="flex-1 flex items-center justify-center gap-3">
            <RotateCcw size={24} className="text-[var(--primary)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-dark)]">Devoluciones fáciles</p>
              <p className="text-xs text-[var(--text-muted)]">30 días de política de devolución</p>
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--border)] hidden sm:block" />
          <div className="flex-1 flex items-center justify-center gap-3">
            <ShieldCheck size={24} className="text-[var(--primary)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-dark)]">Garantía</p>
              <p className="text-xs text-[var(--text-muted)]">1 año de garantía del fabricante</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
