'use client';

import { cn } from '@/lib/cn';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { useMounted } from '@/lib/useMounted';
import { ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import CartItem from './CartItem';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const mounted = useMounted();
  const isOpen = useUIStore((s) => s.isCartDrawerOpen);
  const closeCartDrawer = useUIStore((s) => s.closeCartDrawer);
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={closeCartDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-[420px] max-w-full bg-white shadow-xl flex flex-col z-50 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--text-dark)]">
              Carrito
            </h2>
            {mounted && getItemCount() > 0 && (
              <span className="bg-[var(--primary)] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </div>
          <button
            onClick={closeCartDrawer}
            className="text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <ShoppingCart size={48} className="text-[#CCC]" />
              <p className="text-[var(--text-muted)] text-sm">
                Tu carrito está vacío
              </p>
              <button
                onClick={closeCartDrawer}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] px-6 py-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span className="text-[var(--text-dark)]">
                  {formatPrice(getSubtotal())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Envío</span>
                <span className="text-[var(--text-muted)] italic text-xs">Se calcula al confirmar dirección</span>
              </div>
              <div className="border-t border-[var(--border-light)] my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-[var(--text-dark)]">Total</span>
                <span className="text-[var(--text-dark)]">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCartDrawer}
              className="mt-4 w-full h-12 bg-[var(--primary)] text-white font-medium rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              Ir al pago
            </Link>

            <button
              onClick={closeCartDrawer}
              className="mt-3 w-full text-sm text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors text-center"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
