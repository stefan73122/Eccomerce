'use client';

import { cn } from '@/lib/cn';
import { useCartStore } from '@/store/useCartStore';
import { Tag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  showPromo?: boolean;
}

export default function CartSummary({ showPromo }: CartSummaryProps) {
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const [promoCode, setPromoCode] = useState('');

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6">
      <h3 className="text-lg font-semibold text-[var(--text-dark)] mb-4">
        Resumen del pedido
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">Subtotal</span>
          <span className="text-[var(--text-dark)]">
            {formatPrice(getSubtotal())}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">Envío</span>
          <span className="text-[var(--text-muted)] italic">Se calcula al confirmar dirección</span>
        </div>
      </div>

      <div className="border-t border-[var(--border-light)] my-3" />

      <div className="flex justify-between text-lg font-bold">
        <span className="text-[var(--text-dark)]">Subtotal</span>
        <span className="text-[var(--text-dark)]">
          {formatPrice(getSubtotal())}
        </span>
      </div>

      {showPromo && (
        <div className="mt-4 flex gap-2">
          <div className="flex-1 flex items-center border border-[var(--border)] rounded-lg px-3 h-10">
            <Tag size={16} className="text-[var(--text-placeholder)] mr-2" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Código promocional"
              className="flex-1 outline-none text-sm placeholder:text-[var(--text-placeholder)] bg-transparent"
            />
          </div>
          <button
            className={cn(
              'px-4 h-10 rounded-lg text-sm font-medium transition-colors',
              promoCode
                ? 'bg-[var(--primary)] text-white hover:opacity-90'
                : 'bg-[var(--bg-light)] text-[var(--text-muted)] cursor-not-allowed'
            )}
            disabled={!promoCode}
          >
            Aplicar
          </button>
        </div>
      )}

      <Link
        href="/checkout"
        className="mt-4 w-full h-12 bg-[var(--primary)] text-white font-medium rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        Ir al pago
      </Link>
    </div>
  );
}
