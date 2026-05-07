'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, Package, Tag } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CartSummary from '@/components/cart/CartSummary';
import ProductCard from '@/components/product/ProductCard';
import { useCartStore } from '@/store/useCartStore';
import { products } from '@/data/products';
import { cn } from '@/lib/cn';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const [promoCode, setPromoCode] = useState('');

  const recommendedProducts = products
    .filter((p) => !items.some((item) => item.product.id === p.id))
    .slice(0, 4);

  const itemCount = getItemCount();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-[var(--bg-light)] border-b border-[var(--border-light)]">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shopping Cart' },
          ]}
        />
      </div>

      {/* Title */}
      <div className="px-4 sm:px-6 lg:px-20 pt-8 pb-2 bg-[var(--bg-light)]">
        <h1 className="text-[28px] font-bold text-[var(--text-dark)]">
          Shopping Cart{' '}
          <span className="text-[var(--text-muted)] font-normal text-lg">
            ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
          </span>
        </h1>
      </div>

      {/* Body */}
      <section className="bg-[var(--bg-light)] px-4 sm:px-6 lg:px-20 py-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Left: Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-lg border border-[var(--border)] p-12 text-center">
              <Package size={48} className="text-[#CCCCCC] mx-auto mb-4" />
              <p className="text-[var(--text-muted)] text-sm">Your cart is empty.</p>
              <Link
                href="/"
                className="inline-block mt-4 text-sm font-medium text-[var(--primary)] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => {
                const discount = item.product.originalPrice
                  ? Math.round(
                      ((item.product.originalPrice - item.product.price) /
                        item.product.originalPrice) *
                        100
                    )
                  : null;

                return (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-lg border border-[var(--border)] p-4 flex items-center gap-4"
                  >
                    {/* Image Placeholder */}
                    <div className="w-20 h-20 rounded-lg bg-[var(--bg-input)] flex items-center justify-center shrink-0">
                      <Package size={28} className="text-[#CCCCCC]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-dark)] truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#666666]">{item.product.category}</p>
                      <span
                        className={cn(
                          'text-[10px] font-medium px-2 py-0.5 rounded w-fit',
                          item.product.inStock
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-500'
                        )}
                      >
                        {item.product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span className="text-base font-semibold text-[var(--text-dark)]">
                        ${item.product.price.toFixed(2)}
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-xs text-[var(--text-placeholder)] line-through">
                          ${item.product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden shrink-0">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 h-9 flex items-center justify-center text-sm font-medium border-x border-[var(--border)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 size={16} className="text-[var(--error)]" />
                    </button>
                  </div>
                );
              })}

              {/* Promo Code Row */}
              <div className="flex gap-3 mt-2">
                <div className="flex-1 flex items-center border border-[var(--border)] rounded-lg px-3 h-11 bg-white">
                  <Tag size={16} className="text-[var(--text-placeholder)] mr-2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 outline-none text-sm placeholder:text-[var(--text-placeholder)] bg-transparent"
                  />
                </div>
                <button
                  className={cn(
                    'px-6 h-11 rounded-lg text-sm font-medium transition-colors',
                    promoCode
                      ? 'bg-[var(--primary)] text-white hover:opacity-90'
                      : 'bg-[var(--bg-input)] text-[var(--text-muted)] cursor-not-allowed'
                  )}
                  disabled={!promoCode}
                >
                  Apply
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right: Order Summary */}
        {items.length > 0 && (
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-4">
              <CartSummary />
            </div>
          </div>
        )}
      </section>

      {/* You May Also Like */}
      {recommendedProducts.length > 0 && (
        <section className="bg-white border-t border-[var(--border)] px-4 sm:px-6 lg:px-20 py-10">
          <h3 className="text-xl font-bold text-[var(--text-dark)] mb-6">
            You May Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
