'use client';

import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { useMounted } from '@/lib/useMounted';
import { Lock, Package, Loader2 } from 'lucide-react';

interface OrderSummaryProps {
  buttonLabel?: string;
  onSubmit?: () => void;
  shippingCost?: number | null;
  loadingShipping?: boolean;
  disabled?: boolean;
}

export default function OrderSummary({ buttonLabel = 'Place Order', onSubmit, shippingCost, loadingShipping, disabled }: OrderSummaryProps) {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  return (
    <div className="bg-white rounded-xl border border-[var(--border-light)] p-6">
      <h3 className="text-lg font-semibold text-[var(--text-dark)] mb-4">Resumen del pedido</h3>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[var(--bg-input)] flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-dark)] truncate">{item.product.name}</p>
              <p className="text-xs text-[var(--text-muted)]">Cant: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium text-[var(--text-dark)]">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">Subtotal</span>
          <span className="text-[var(--text-dark)]">{mounted ? formatPrice(getSubtotal()) : '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">Envío</span>
          {loadingShipping ? (
            <span className="flex items-center gap-1 text-[var(--text-muted)]">
              <Loader2 size={12} className="animate-spin" /> Calculando…
            </span>
          ) : shippingCost == null ? (
            <span className="text-[var(--text-muted)]">—</span>
          ) : shippingCost === 0 ? (
            <span className="text-green-600 font-medium">Gratis</span>
          ) : (
            <span className="text-[var(--text-dark)] font-medium">Bs. {shippingCost.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--border)] mt-3 pt-3">
        <div className="flex justify-between text-lg font-bold">
          <span className="text-[var(--text-dark)]">Total</span>
          <span className="text-[var(--text-dark)]">
            {mounted ? formatPrice(getSubtotal() + (shippingCost ?? 0)) : '—'}
          </span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={disabled}
        className="w-full mt-4 bg-[var(--primary)] text-white h-12 rounded-lg font-semibold text-base hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {buttonLabel}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-light)] mt-3">
        <Lock size={12} /> Pago seguro — cifrado SSL
      </p>
    </div>
  );
}
