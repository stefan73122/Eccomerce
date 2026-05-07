'use client';

import { cn } from '@/lib/cn';
import { useCartStore } from '@/store/useCartStore';
import type { CartItem as CartItemType } from '@/types';
import { Minus, Package, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex p-4 border-b border-[var(--border-light)]">
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-lg bg-[var(--bg-light)] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        {item.product.images?.[0] ? (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-contain"
            unoptimized
          />
        ) : (
          <Package size={24} className="text-[var(--text-muted)]" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 ml-4 min-w-0">
        <h4 className="text-sm font-medium text-[var(--text-dark)] truncate">
          {item.product.name}
        </h4>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {item.product.category}
        </p>
        {item.selectedColor && (
          <p className="text-xs text-[#999] mt-0.5">
            Color: {item.selectedColor}
          </p>
        )}
        <span
          className={cn(
            'inline-block text-[10px] font-medium mt-1 px-1.5 py-0.5 rounded',
            item.product.inStock
              ? 'text-[var(--success)] bg-[var(--success)]/10'
              : 'text-[var(--error)] bg-[var(--error)]/10'
          )}
        >
          {item.product.inStock ? 'En stock' : 'Sin stock'}
        </span>
      </div>

      {/* Price & Controls */}
      <div className="flex flex-col items-end justify-between ml-3">
        <p className="text-base font-semibold text-[var(--text-dark)]">
          {formatPrice(item.product.price * item.quantity)}
        </p>

        <div className="flex items-center gap-0">
          <button
            onClick={() =>
              updateQuantity(item.product.id, item.quantity - 1)
            }
            className="w-8 h-8 flex items-center justify-center border border-[var(--border-light)] rounded-l-md hover:bg-[var(--bg-light)] transition-colors"
          >
            <Minus size={14} />
          </button>
          <div className="w-8 h-8 flex items-center justify-center border-y border-[var(--border-light)] text-sm font-medium">
            {item.quantity}
          </div>
          <button
            onClick={() =>
              updateQuantity(item.product.id, item.quantity + 1)
            }
            className="w-8 h-8 flex items-center justify-center border border-[var(--border-light)] rounded-r-md hover:bg-[var(--bg-light)] transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          onClick={() => removeItem(item.product.id)}
          className="text-[var(--text-muted)] hover:text-red-500 transition-colors mt-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
