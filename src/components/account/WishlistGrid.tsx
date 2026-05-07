'use client';

import { useUserStore } from '@/store/useUserStore';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { Heart, Package, ShoppingCart, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistGrid() {
  const wishlist = useUserStore((s) => s.wishlist);
  const removeFromWishlist = useUserStore((s) => s.removeFromWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Heart size={48} className="text-gray-300" />
        <p className="text-lg font-medium text-[var(--text-dark)]">Tu lista de deseos está vacía</p>
        <p className="text-sm text-[var(--text-muted)]">Guarda los productos que te gustan para después</p>
        <Link href="/categories" className="mt-2 bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {wishlist.map((item) => {
        const coverImage = item.product.images?.[0] ?? null;
        return (
          <div key={item.product.id} className="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden">
            <Link href={`/product/${item.product.id}`} className="block h-[180px] bg-[var(--bg-input)] relative overflow-hidden">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={item.product.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={48} className="text-gray-300" />
                </div>
              )}
              <button
                onClick={(e) => { e.preventDefault(); removeFromWishlist(item.product.id); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 transition"
              >
                <Trash2 size={14} className="text-[var(--error)]" />
              </button>
            </Link>
            <div className="p-3.5 space-y-2">
              <Link href={`/product/${item.product.id}`} className="block text-sm font-medium text-[var(--text-dark)] truncate hover:text-[var(--primary)] transition-colors">
                {item.product.name}
              </Link>
              {item.product.price > 0 ? (
                <>
                  <p className="text-base font-bold text-[var(--text-dark)]">{formatPrice(item.product.price)}</p>
                  <button
                    onClick={() => {
                      addItem(item.product);
                      addToast('Agregado al carrito', 'success');
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-white text-xs font-medium py-2 rounded-md hover:opacity-90 transition"
                  >
                    <ShoppingCart size={14} /> Agregar al carrito
                  </button>
                </>
              ) : (
                <p className="text-xs text-gray-400 py-1">No disponible en tu región</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
