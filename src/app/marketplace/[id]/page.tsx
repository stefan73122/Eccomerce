'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  Store,
  Heart,
  Tag,
  Loader2,
  ShoppingBag,
  Minus,
  Plus,
  ShieldCheck,
  TruckIcon,
  RotateCcw,
  Warehouse,
} from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductGallery from '@/components/product/ProductGallery';
import { useUIStore } from '@/store/useUIStore';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/utils';
import { getSellerProductById } from '@/services/sellerProductService';
import type { SellerProductPublic, SellerProductVariantPublic } from '@/types';

export default function MarketplaceProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [product, setProduct] = useState<SellerProductPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<SellerProductVariantPublic | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const addToast = useUIStore((s) => s.addToast);
  const wishlist = useUserStore((s) => s.wishlist);
  const addToWishlist = useUserStore((s) => s.addToWishlist);
  const removeFromWishlist = useUserStore((s) => s.removeFromWishlist);

  useEffect(() => {
    if (!id) return;
    getSellerProductById(id).then((data) => {
      if (!data) { router.replace('/marketplace'); return; }
      setProduct(data);
      const publishedVariants = (data.variants ?? []).filter(
        (v) => v.isPublished && v.price != null,
      );
      if (publishedVariants.length > 0) setSelectedVariant(publishedVariants[0]);
      setLoading(false);
    });
  }, [id, router]);

  useEffect(() => {
    setWishlisted(wishlist.some((w) => w.product.id === `sp_${id}`));
  }, [wishlist, id]);

  const handleToggleWishlist = () => {
    if (!product) return;
    const pseudoProduct = {
      id: `sp_${product.id}`,
      name: product.name,
      price: selectedVariant?.price ? Number(selectedVariant.price) : 0,
      description: product.description ?? '',
      shortDescription: '',
      category: product.suggestedCategory ?? 'Marketplace',
      categorySlug: '',
      images: (product.media ?? []).map((m) => m.url),
      rating: 0,
      reviewCount: 0,
      inStock: true,
      source: '3p' as const,
      sellerId: product.sellerId,
      sellerStoreName: product.sellerStoreName,
      sellerProductId: product.id,
    };
    if (wishlisted) {
      removeFromWishlist(`sp_${product.id}`);
      addToast('Eliminado de favoritos', 'info');
    } else {
      addToWishlist(pseudoProduct);
      addToast('Añadido a favoritos', 'success');
    }
  };

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
        <Link href="/marketplace" className="text-sm text-[var(--primary)] hover:underline">
          Volver al marketplace
        </Link>
      </div>
    );
  }

  const images = (product.media ?? []).sort((a, b) => a.sortOrder - b.sortOrder);
  const displayImages = images.map((m) => m.url);
  
  const publishedVariants = (product.variants ?? []).filter(
    (v) => v.isPublished && v.price != null,
  );
  
  const price = selectedVariant?.price ? Number(selectedVariant.price) : null;
  const compareAtPrice = selectedVariant?.compareAtPrice
    ? Number(selectedVariant.compareAtPrice)
    : null;
  const stock = selectedVariant?.stock ?? 0;
  const inStock = stock > 0;
  const hasPrice = price != null;
  const canPurchase = hasPrice && inStock;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[var(--border-light)]">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Marketplace', href: '/marketplace' },
            { label: product.name },
          ]}
        />
      </div>

      {/* Main Section */}
      <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-20 py-8 lg:py-10">
        {/* Left: Gallery */}
        <div className="w-full lg:w-1/2 shrink-0">
          {displayImages.length > 0 ? (
            <ProductGallery images={displayImages} />
          ) : (
            <div className="aspect-square rounded-xl bg-gray-50 border border-[var(--border)] flex flex-col items-center justify-center">
              <Package size={56} className="text-gray-300 mb-3" />
              <span className="text-sm text-gray-400">Sin imágenes disponibles</span>
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col gap-[18px]">
          {/* Marketplace Badge */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] uppercase tracking-widest w-fit">
            <Store size={11} />
            Marketplace
          </span>

          {/* Product Name */}
          <h1 className="text-[28px] font-bold text-[var(--text-dark)]">
            {product.name}
          </h1>

          {/* Price */}
          {hasPrice ? (
            <div className="flex items-center gap-3">
              <span className="text-[32px] font-bold text-[var(--text-dark)]">
                {formatPrice(price!)}
              </span>
              {compareAtPrice && compareAtPrice > price! && (
                <>
                  <span className="text-lg text-[var(--text-muted)] line-through">
                    {formatPrice(compareAtPrice)}
                  </span>
                  <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                    -{Math.round(((compareAtPrice - price!) / compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
              <Tag size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Precio no disponible</p>
                <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                  Este producto no tiene precio configurado. Contacta al vendedor para más información.
                </p>
              </div>
            </div>
          )}

          {/* Stock badge */}
          {hasPrice && (
            <div className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', inStock ? 'bg-green-500' : 'bg-red-500')} />
              <span className="text-sm text-[var(--text-muted)]">
                {inStock ? `En stock${stock > 0 ? ` (${stock} disponibles)` : ''}` : 'Sin stock'}
              </span>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Seller Info Card - Moved up for better visibility */}
          {product.sellerStoreName && (
            <div className="rounded-[10px] bg-[#F8F9FA] border border-[#EAEAEA] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Store size={15} className="text-[var(--primary)]" />
                  <span className="text-[13px] font-semibold text-[var(--text-dark)]">Vendedor</span>
                </div>
                {product.suggestedCategory && (
                  <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2.5 py-1">
                    <Tag size={10} className="text-gray-600" />
                    <span className="text-[11px] font-medium text-gray-600">{product.suggestedCategory}</span>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-white px-3 py-2.5 border border-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-semibold text-[var(--text-dark)]">
                        {product.sellerStoreName}
                      </span>
                      <span className="text-[10px] text-green-600">Vendedor verificado</span>
                    </div>
                  </div>
                  <Link
                    href={`/marketplace?seller=${product.sellerId}`}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-md border border-[#DDDDDD] text-[#666666] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  >
                    Ver tienda
                  </Link>
                </div>
              </div>

              <Link
                href={`/marketplace?seller=${product.sellerId}`}
                className="text-[12px] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors text-center"
              >
                Ver más productos de esta tienda
              </Link>
            </div>
          )}

          {/* Variant Selector */}
          {publishedVariants.length > 1 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[var(--text-dark)]">
                Variantes
                {selectedVariant && (
                  <span className="font-normal text-[var(--text-muted)] ml-1">
                    — {selectedVariant.label}
                  </span>
                )}
              </span>
              <div className="flex flex-wrap gap-2">
                {publishedVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                      selectedVariant?.id === v.id
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                        : 'border-[var(--border)] text-[var(--text-dark)] hover:border-[var(--primary)]',
                    )}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          {canPurchase && (
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
                  onClick={() => setQuantity((q) => Math.min(stock > 0 ? stock : 999, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => addToast('Contacta al vendedor para realizar tu compra', 'info')}
              disabled={!canPurchase}
              className="flex-1 h-12 border border-[var(--primary)] text-[var(--primary)] font-medium rounded-lg hover:bg-[var(--primary)]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Consultar disponibilidad
            </button>
            <button
              onClick={() => addToast('Contacta al vendedor para realizar tu compra', 'info')}
              disabled={!canPurchase}
              className="flex-1 h-12 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Contactar vendedor
            </button>
            <button
              onClick={handleToggleWishlist}
              className="w-12 h-12 border border-[var(--border)] rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
            >
              <Heart size={18} className={wishlisted ? 'text-red-500 fill-red-500' : 'text-[var(--text-muted)]'} />
            </button>
          </div>
        </div>
      </section>

      {/* Variants table */}
      {publishedVariants.length > 1 && (
        <>
          <div className="border-t border-[#E5E5E5]" />
          <section className="px-4 sm:px-6 lg:px-20 py-9">
            <h3 className="text-lg font-bold text-[var(--text-dark)] mb-4">Variantes disponibles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Variante
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {publishedVariants.map((v, i) => {
                    const vStock = v.stock ?? 0;
                    const isSelected = selectedVariant?.id === v.id;
                    const vPrice = v.price ? Number(v.price) : null;
                    return (
                      <tr
                        key={v.id}
                        className={cn(
                          'border-b border-[var(--border)] transition-colors',
                          isSelected ? 'bg-blue-50' : i % 2 === 0 ? 'bg-[var(--bg-light)]' : 'bg-white',
                        )}
                      >
                        <td className="py-2.5 px-3 text-[var(--text-dark)]">{v.label}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-[var(--text-dark)]">
                          {vPrice != null ? formatPrice(vPrice) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={cn(
                              'text-xs font-medium px-1.5 py-0.5 rounded',
                              vStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600',
                            )}
                          >
                            {vStock > 0 ? vStock : 'Sin stock'}
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

      {/* Information Bar */}
      <section className="bg-[var(--bg-warm)] px-4 sm:px-6 lg:px-20 py-8">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex-1 flex items-center justify-center gap-3 py-4 sm:py-0">
            <ShieldCheck size={24} className="text-[var(--primary)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-dark)]">Compra segura</p>
              <p className="text-xs text-[var(--text-muted)]">Vendedor verificado por Fenix Store</p>
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--border)] hidden sm:block" />
          <div className="flex-1 flex items-center justify-center gap-3 py-4 sm:py-0">
            <TruckIcon size={24} className="text-[var(--primary)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-dark)]">Envío coordinado</p>
              <p className="text-xs text-[var(--text-muted)]">Acuerda envío directamente con el vendedor</p>
            </div>
          </div>
          <div className="w-px h-10 bg-[var(--border)] hidden sm:block" />
          <div className="flex-1 flex items-center justify-center gap-3 py-4 sm:py-0">
            <Store size={24} className="text-[var(--primary)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-dark)]">Vendedor local</p>
              <p className="text-xs text-[var(--text-muted)]">Apoya a negocios locales bolivianos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
