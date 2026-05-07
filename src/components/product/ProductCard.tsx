'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Package, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { useUserStore } from '@/store/useUserStore';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/axios';
import { SALES_CHANNEL_ID } from '@/lib/config';
import { useTheme } from '@/lib/theme/ThemeContext';

interface ProductCardProps {
  product: Product;
}

const badgeColors: Record<string, string> = {
  HOT: 'bg-red-500 text-white',
  NEW: 'bg-blue-500 text-white',
  SALE: 'bg-orange-500 text-white',
  LIMITED: 'bg-purple-500 text-white',
  BESTSELLER: 'bg-green-600 text-white',
};

export default function ProductCard({ product }: ProductCardProps) {
  const { theme } = useTheme();
  const variant = theme.productCards.variant;

  switch (variant) {
    case 'minimal': return <MinimalCard product={product} />;
    case 'overlay': return <OverlayCard product={product} />;
    case 'compact': return <CompactCard product={product} />;
    case 'classic':
    default:        return <ClassicCard product={product} />;
  }
}

// ─── Shared hooks / helpers ──────────────────────────────────────────────────

function useCardActions(product: Product) {
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const addToast = useUIStore((s) => s.addToast);
  const wishlist = useUserStore((s) => s.wishlist);
  const addToWishlist = useUserStore((s) => s.addToWishlist);
  const removeFromWishlist = useUserStore((s) => s.removeFromWishlist);

  const isWishlisted = wishlist.some((w) => w.product.id === product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCartDrawer();
    addToast(`${product.name} agregado al carrito`, 'success');
    if (product.firstVariantId) {
      try {
        await api.post('/api/carts/items', {
          productVariantId: product.firstVariantId,
          salesChannelId: SALES_CHANNEL_ID,
          quantity: 1,
        });
      } catch {
        /* silent */
      }
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      addToast('Eliminado de favoritos', 'info');
    } else {
      addToWishlist(product);
      addToast('Añadido a favoritos', 'success');
    }
  };

  return { isWishlisted, handleAddToCart, handleToggleWishlist };
}

function WishlistButton({ wishlisted, onClick, className }: { wishlisted: boolean; onClick: (e: React.MouseEvent) => void; className?: string }) {
  return (
    <button onClick={onClick}
      className={cn('w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors', className)}>
      <Heart size={15} className={wishlisted ? 'text-red-500 fill-red-500' : 'text-[var(--text-muted)]'} />
    </button>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className={cn('absolute top-2 left-2 z-10 text-[10px] font-semibold px-2 py-0.5 rounded-md', badgeColors[label] ?? 'bg-gray-600 text-white')}>
      {label}
    </span>
  );
}

function Rating({ value = 4.5 }: { value?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={11} className={n <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
      ))}
      <span className="text-[10px] text-[var(--text-muted)] ml-1">({value.toFixed(1)})</span>
    </div>
  );
}

function StockIndicator({ inStock }: { inStock: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('w-1.5 h-1.5 rounded-full', inStock ? 'bg-green-500' : 'bg-red-500')} />
      <span className="text-[10px] text-[var(--text-muted)]">{inStock ? 'En stock' : 'Sin stock'}</span>
    </div>
  );
}

function PriceBlock({ price, originalPrice, size = 'md' }: { price: number; originalPrice?: number; size?: 'md' | 'lg' }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={cn('font-bold text-[var(--text-dark)]', size === 'lg' ? 'text-lg' : 'text-base')}>
        {formatPrice(price)}
      </span>
      {originalPrice && (
        <span className="text-xs text-[var(--text-placeholder)] line-through">{formatPrice(originalPrice)}</span>
      )}
    </div>
  );
}

function Placeholder() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 rounded-full bg-[var(--border)] flex items-center justify-center">
        <Package size={28} className="text-[#AAAAAA]" />
      </div>
      <span className="text-[10px] text-[#CCCCCC] font-medium uppercase tracking-widest">Sin imagen</span>
    </div>
  );
}

function getAspectClass(aspect: string): string {
  switch (aspect) {
    case 'square':    return 'aspect-square';
    case 'portrait':  return 'aspect-[3/4]';
    case 'landscape': return 'aspect-[4/3]';
    default:          return '';
  }
}

function getHoverEffect(effect: string): string {
  switch (effect) {
    case 'zoom': return 'group-hover:scale-105';
    case 'lift': return '';
    default:     return '';
  }
}

// ─── Variant 1: Classic ──────────────────────────────────────────────────────

function ClassicCard({ product }: ProductCardProps) {
  const { theme } = useTheme();
  const { productCards: cfg, colors } = theme;
  const { isWishlisted, handleAddToCart, handleToggleWishlist } = useCardActions(product);
  const unavailable = product.price === 0;

  const aspectClass = getAspectClass(cfg.imageAspect);
  const useAspect = cfg.imageAspect !== 'auto';

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div
        className={cn(
          'border bg-white overflow-hidden transition-all duration-200',
          !unavailable && cfg.shadow && 'hover:shadow-md',
          cfg.hoverEffect === 'lift' && 'hover:-translate-y-1',
          unavailable ? 'border-[#EAEAEA]' : 'border-[#EAEAEA] hover:border-[var(--primary)]/30',
        )}
        style={{ borderRadius: cfg.borderRadius }}
      >
        <div
          className={cn('relative bg-[#F5F5F5] flex items-center justify-center overflow-hidden', aspectClass)}
          style={useAspect ? undefined : { height: cfg.imageHeight }}
        >
          {unavailable && <div className="absolute inset-0 bg-white/50 z-10" />}
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill
              className={cn('object-cover transition-transform duration-300', !unavailable && getHoverEffect(cfg.hoverEffect))}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized />
          ) : <Placeholder />}

          {unavailable && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <span className="bg-gray-800/75 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full tracking-wide">No disponible</span>
            </div>
          )}
          {cfg.showBadge && !unavailable && product.badge && <Badge label={product.badge} />}
          {cfg.showWishlist && <WishlistButton wishlisted={isWishlisted} onClick={handleToggleWishlist} className="absolute top-2 right-2 z-30" />}
        </div>

        <div className="p-[14px] flex flex-col gap-2">
          <p className={cn('text-sm font-medium truncate', unavailable ? 'text-gray-400' : 'text-[var(--text-dark)]')}>{product.name}</p>
          {cfg.showCategory && <p className="text-xs text-[var(--text-muted)]">{product.category}</p>}
          {cfg.showRating && !unavailable && <Rating value={product.rating} />}
          {unavailable ? (
            <p className="text-xs text-gray-400">Próximamente en tu región</p>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <PriceBlock price={product.price} originalPrice={product.originalPrice} />
                <button onClick={handleAddToCart}
                  className="text-white text-xs px-3 py-1.5 hover:opacity-90 transition-opacity flex items-center gap-1"
                  style={{ borderRadius: 'var(--btn-radius)', backgroundColor: colors.primary }}>
                  <Plus size={12} /> Agregar
                </button>
              </div>
              {cfg.showStock && <StockIndicator inStock={product.inStock} />}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Variant 2: Minimal ──────────────────────────────────────────────────────

function MinimalCard({ product }: ProductCardProps) {
  const { theme } = useTheme();
  const { productCards: cfg, colors } = theme;
  const { isWishlisted, handleAddToCart, handleToggleWishlist } = useCardActions(product);
  const unavailable = product.price === 0;

  const aspectClass = getAspectClass(cfg.imageAspect);
  const useAspect = cfg.imageAspect !== 'auto';

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 bg-transparent',
          cfg.hoverEffect === 'lift' && 'hover:-translate-y-1',
        )}
      >
        <div
          className={cn('relative bg-[#F5F5F5] flex items-center justify-center overflow-hidden mb-3', aspectClass)}
          style={{ borderRadius: cfg.borderRadius, ...(useAspect ? {} : { height: cfg.imageHeight }) }}
        >
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill
              className={cn('object-cover transition-transform duration-500', !unavailable && getHoverEffect(cfg.hoverEffect))}
              sizes="(max-width: 640px) 100vw, 33vw" unoptimized />
          ) : <Placeholder />}

          {cfg.showBadge && !unavailable && product.badge && <Badge label={product.badge} />}
          {cfg.showWishlist && (
            <WishlistButton wishlisted={isWishlisted} onClick={handleToggleWishlist}
              className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}

          {/* Slide-up Add button on hover */}
          {!unavailable && (
            <button onClick={handleAddToCart}
              className="absolute bottom-2 left-2 right-2 text-white text-xs py-2 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
              style={{ borderRadius: 'var(--btn-radius)', backgroundColor: colors.primary }}>
              <Plus size={13} /> Agregar al carrito
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1 px-0.5">
          {cfg.showCategory && <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{product.category}</p>}
          <p className={cn('text-sm font-medium truncate', unavailable ? 'text-gray-400' : 'text-[var(--text-dark)]')}>{product.name}</p>
          {cfg.showRating && !unavailable && <Rating value={product.rating} />}
          <PriceBlock price={product.price} originalPrice={product.originalPrice} />
          {cfg.showStock && <StockIndicator inStock={product.inStock} />}
        </div>
      </div>
    </Link>
  );
}

// ─── Variant 3: Overlay ──────────────────────────────────────────────────────

function OverlayCard({ product }: ProductCardProps) {
  const { theme } = useTheme();
  const { productCards: cfg, colors } = theme;
  const { isWishlisted, handleAddToCart, handleToggleWishlist } = useCardActions(product);
  const unavailable = product.price === 0;

  const aspectClass = getAspectClass(cfg.imageAspect === 'auto' ? 'portrait' : cfg.imageAspect);

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div
        className={cn('relative overflow-hidden transition-all duration-200', aspectClass, cfg.shadow && 'shadow-sm hover:shadow-xl', cfg.hoverEffect === 'lift' && 'hover:-translate-y-1')}
        style={{ borderRadius: cfg.borderRadius }}
      >
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill
            className={cn('object-cover transition-transform duration-500', !unavailable && getHoverEffect(cfg.hoverEffect))}
            sizes="(max-width: 640px) 100vw, 33vw" unoptimized />
        ) : <div className="absolute inset-0 bg-[#F5F5F5] flex items-center justify-center"><Placeholder /></div>}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {cfg.showBadge && !unavailable && product.badge && <Badge label={product.badge} />}
        {cfg.showWishlist && <WishlistButton wishlisted={isWishlisted} onClick={handleToggleWishlist} className="absolute top-2 right-2 z-30" />}

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          {cfg.showCategory && <p className="text-[10px] uppercase tracking-wider opacity-80 mb-1">{product.category}</p>}
          <p className="text-sm font-semibold mb-2 line-clamp-2">{product.name}</p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-base font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-[11px] line-through opacity-70">{formatPrice(product.originalPrice)}</span>}
            </div>
            {!unavailable && (
              <button onClick={handleAddToCart}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform shrink-0"
                style={{ backgroundColor: colors.primary }}>
                <Plus size={16} />
              </button>
            )}
          </div>
          {cfg.showRating && !unavailable && (
            <div className="mt-2 opacity-90">
              <Rating value={product.rating} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Variant 4: Compact (horizontal) ─────────────────────────────────────────

function CompactCard({ product }: ProductCardProps) {
  const { theme } = useTheme();
  const { productCards: cfg, colors } = theme;
  const { isWishlisted, handleAddToCart, handleToggleWishlist } = useCardActions(product);
  const unavailable = product.price === 0;

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div
        className={cn(
          'flex bg-white border border-[#EAEAEA] overflow-hidden transition-all duration-200',
          cfg.shadow && 'hover:shadow-md',
          cfg.hoverEffect === 'lift' && 'hover:-translate-y-0.5',
          'hover:border-[var(--primary)]/30',
        )}
        style={{ borderRadius: cfg.borderRadius }}
      >
        {/* Image left */}
        <div className="relative w-[120px] h-[120px] shrink-0 bg-[#F5F5F5] overflow-hidden">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill
              className={cn('object-cover transition-transform duration-300', !unavailable && getHoverEffect(cfg.hoverEffect))}
              sizes="120px" unoptimized />
          ) : <Placeholder />}
          {cfg.showBadge && !unavailable && product.badge && <Badge label={product.badge} />}
        </div>

        {/* Info right */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {cfg.showCategory && <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">{product.category}</p>}
              <p className={cn('text-sm font-medium truncate', unavailable ? 'text-gray-400' : 'text-[var(--text-dark)]')}>{product.name}</p>
              {cfg.showRating && !unavailable && <div className="mt-1"><Rating value={product.rating} /></div>}
            </div>
            {cfg.showWishlist && <WishlistButton wishlisted={isWishlisted} onClick={handleToggleWishlist} className="shrink-0" />}
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <div>
              <PriceBlock price={product.price} originalPrice={product.originalPrice} />
              {cfg.showStock && <div className="mt-1"><StockIndicator inStock={product.inStock} /></div>}
            </div>
            {!unavailable && (
              <button onClick={handleAddToCart}
                className="text-white text-xs px-3 py-1.5 hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
                style={{ borderRadius: 'var(--btn-radius)', backgroundColor: colors.primary }}>
                <Plus size={12} /> Agregar
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
