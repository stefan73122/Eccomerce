'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Package, Plus, Store } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Product } from '@/types';
import { useUIStore } from '@/store/useUIStore';
import { useUserStore } from '@/store/useUserStore';
import { formatPrice } from '@/lib/utils';

interface SellerProductCardProps {
  product: Product;
}

export default function SellerProductCard({ product }: SellerProductCardProps) {
  const addToast = useUIStore((s) => s.addToast);
  const wishlist = useUserStore((s) => s.wishlist);
  const addToWishlist = useUserStore((s) => s.addToWishlist);
  const removeFromWishlist = useUserStore((s) => s.removeFromWishlist);

  const isWishlisted = wishlist.some((w) => w.product.id === product.id);
  const unavailable = product.price === 0;

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

  const productId = product.sellerProductId ?? product.id.replace('sp_', '');

  return (
    <Link href={`/marketplace/${productId}`} className="block group">
      <div
        className={cn(
          'rounded-xl border bg-white overflow-hidden transition-all duration-200',
          unavailable
            ? 'border-[#EAEAEA]'
            : 'border-[#EAEAEA] hover:border-[var(--primary)]/30 hover:shadow-md',
        )}
      >
        {/* Image */}
        <div className="relative h-[180px] bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={cn(
                'object-cover transition-transform duration-300',
                !unavailable && 'group-hover:scale-105',
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-[var(--border)] flex items-center justify-center">
                <Package size={28} className="text-[#AAAAAA]" />
              </div>
              <span className="text-[10px] text-[#CCCCCC] font-medium uppercase tracking-widest">
                Sin imagen
              </span>
            </div>
          )}

          {/* SALE badge */}
          {!unavailable && product.originalPrice && (
            <span className="absolute top-2 left-2 z-10 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-500 text-white">
              SALE
            </span>
          )}

          {/* Marketplace badge */}
          <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-black/60 text-white uppercase tracking-wide">
            <Store size={9} />
            Marketplace
          </span>

          {/* Wishlist */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Heart
              size={16}
              className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-[var(--text-muted)]'}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-[14px] flex flex-col gap-2">
          <p
            className={cn(
              'text-sm font-medium truncate',
              unavailable ? 'text-gray-400' : 'text-[var(--text-dark)]',
            )}
          >
            {product.name}
          </p>

          {/* Seller */}
          {product.sellerStoreName && (
            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
              <Store size={11} className="shrink-0" />
              <span className="truncate">{product.sellerStoreName}</span>
            </div>
          )}

          <p className="text-xs text-[var(--text-muted)]">{product.category}</p>

          {unavailable ? (
            <p className="text-xs text-gray-400">Sin precio configurado</p>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-[var(--text-dark)]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[var(--text-placeholder)] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <span className="bg-[var(--primary)] text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Plus size={12} />
                  Ver
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    product.inStock ? 'bg-green-500' : 'bg-red-500',
                  )}
                />
                <span className="text-[10px] text-[var(--text-muted)]">
                  {product.inStock ? 'En stock' : 'Sin stock'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
