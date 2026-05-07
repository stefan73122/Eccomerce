'use client';

import { AlertCircle, Banknote, QrCode, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CheckoutPaymentSectionProps {
  paymentTab: 'qr' | 'cod';
  onPaymentTabChange: (tab: 'qr' | 'cod') => void;
  isSameRegion: boolean;
  orderError: string | null;
}

export default function CheckoutPaymentSection({
  paymentTab,
  onPaymentTabChange,
  isSameRegion,
  orderError,
}: CheckoutPaymentSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border-light)] p-6">
      <h2 className="text-lg font-semibold text-[var(--text-dark)] mb-4">Método de Pago</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onPaymentTabChange('qr')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
            paymentTab === 'qr' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-[var(--text-muted)]',
          )}
        >
          <QrCode size={16} /> Pago QR
        </button>
        <button
          onClick={() => isSameRegion && onPaymentTabChange('cod')}
          disabled={!isSameRegion}
          title={!isSameRegion ? 'Solo disponible para envíos en la misma región' : undefined}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
            paymentTab === 'cod' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-[var(--text-muted)]',
            !isSameRegion && 'opacity-40 cursor-not-allowed',
          )}
        >
          <Banknote size={16} /> Contra entrega
        </button>
      </div>

      {paymentTab === 'qr' && (
        <div className="flex items-start gap-3 p-3 bg-[var(--bg-light)] rounded-lg">
          <QrCode size={18} className="text-[var(--primary)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[var(--text-dark)]">Pago con código QR</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
              Al confirmar serás redirigido a la página de pago
              <ArrowRight size={11} />
            </p>
          </div>
        </div>
      )}

      {paymentTab === 'cod' && (
        <div className="flex items-start gap-3 p-3 bg-[var(--bg-light)] rounded-lg">
          <Banknote size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[var(--text-dark)]">Pago contra entrega</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Pagarás en efectivo cuando el repartidor entregue tu pedido. Solo disponible en la misma región.
            </p>
          </div>
        </div>
      )}

      {orderError && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-600">{orderError}</p>
        </div>
      )}
    </div>
  );
}
