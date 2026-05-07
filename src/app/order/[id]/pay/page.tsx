'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import QRPayment from '@/components/checkout/QRPayment';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/axios';

interface OrderItem {
  id: number;
  requestedQuantity: number;
  unitPrice: string;
  productVariant?: {
    name: string | null;
    product?: { name: string } | null;
  } | null;
}

interface BackendOrder {
  id: number;
  status: string;
  subtotal: string;
  shippingCost: string;
  totalAmount: string;
  items?: OrderItem[];
}

export default function OrderPayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = Number(id);

  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    api
      .get<{ data: BackendOrder }>(`/api/orders/${orderId}`)
      .then((res) => {
        const o = res.data.data;
        // Si ya fue pagada, redirigir directo a success
        if (o.status !== 'PENDING_PAYMENT') {
          router.replace('/order-success');
          return;
        }
        setOrder(o);
      })
      .catch(() => router.replace('/'))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!order) return null;

  const subtotal = parseFloat(order.subtotal);
  const shippingCost = parseFloat(order.shippingCost);
  const totalAmount = parseFloat(order.totalAmount);

  return (
    <div className="px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-dark)] mb-6"
      >
        <ChevronLeft size={16} /> Seguir comprando
      </Link>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 max-w-5xl mx-auto">
        {/* QR */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-[var(--border-light)] p-6">
            <h2 className="text-lg font-semibold text-[var(--text-dark)] mb-1">Completar pago</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Orden <span className="font-medium text-[var(--text-dark)]">#{order.id}</span>
            </p>
            <QRPayment orderId={orderId} />
          </div>
        </div>

        {/* Resumen */}
        <div className="w-full lg:w-[360px]">
          <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-[var(--text-dark)] mb-4">Resumen del pedido</h3>

            <div className="space-y-3 mb-4">
              {order.items?.map((item) => {
                const name = item.productVariant?.product?.name ?? 'Producto';
                const variant = item.productVariant?.name;
                const lineTotal = item.requestedQuantity * parseFloat(item.unitPrice);
                return (
                  <div key={item.id} className="flex justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-dark)] truncate">{name}</p>
                      {variant && <p className="text-xs text-[var(--text-muted)]">{variant}</p>}
                      <p className="text-xs text-[var(--text-muted)]">Cant: {item.requestedQuantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-dark)] shrink-0">{formatPrice(lineTotal)}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[var(--border)] pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Envío</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600 font-medium">Gratis</span>
                ) : (
                  <span>Bs. {shippingCost.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
