'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, MapPin, Phone, Package, ChevronLeft, CreditCard, Banknote } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import QRPayment from '@/components/checkout/QRPayment';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/cn';
import api from '@/lib/axios';

interface OrderItem {
  id: number;
  requestedQuantity: number;
  unitPrice: string;
  productVariant?: {
    name: string | null;
    sku: string | null;
    product?: {
      id: number;
      name: string;
      media?: { url: string; fileType: string; sortOrder: number }[];
    } | null;
  } | null;
}

interface ShippingAddress {
  fullAddressLine: string;
  reference: string | null;
  recipientName: string | null;
  phone: string | null;
  region?: { name: string } | null;
}

interface BackendOrder {
  id: number;
  status: string;
  fulfillmentType: string;
  paymentMethod?: string | null;
  subtotal: string;
  shippingCost: string;
  totalAmount: string;
  createdAt: string;
  shippingAddress?: ShippingAddress | null;
  items?: OrderItem[];
}

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: 'Pendiente de pago',
  PROCESSING: 'En preparación',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  COMPLETED: 'Completado',
  FAILED: 'Fallido',
  REFUNDED: 'Reembolsado',
};

const STATUS_STYLE: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
};

const PAYMENT_LABEL: Record<string, string> = {
  QR: 'Pago por QR',
  CASH_ON_DELIVERY: 'Contra entrega',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    api
      .get<{ data: BackendOrder }>(`/api/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="px-4 sm:px-6 lg:px-20 py-20 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-[var(--text-dark)]">Orden no encontrada</h1>
        <p className="text-[var(--text-muted)] mt-2">{error ?? `No existe una orden con ID "${id}".`}</p>
        <Link href="/account?tab=orders" className="inline-block mt-6 text-sm text-[var(--primary)] hover:underline">
          ← Volver a mis pedidos
        </Link>
      </div>
    );
  }

  const isPendingPayment = order.status === 'PENDING_PAYMENT';

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Mis pedidos', href: '/account?tab=orders' },
          { label: `Pedido #${order.id}` },
        ]}
      />

      <div className="px-4 sm:px-6 lg:px-20 py-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-dark)]">Pedido #{order.id}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <span
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-full shrink-0',
              STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600',
            )}
          >
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>

        {/* QR Payment section */}
        {isPendingPayment && (
          <div className="bg-white rounded-xl border border-yellow-200 p-6">
            <h3 className="text-base font-semibold text-[var(--text-dark)] mb-1">Pago pendiente</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Esta orden aún no ha sido pagada. Puedes completar el pago ahora mediante QR.
            </p>
            {showQR ? (
              <QRPayment orderId={order.id} />
            ) : (
              <button
                onClick={() => setShowQR(true)}
                className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
              >
                Pagar ahora con QR
              </button>
            )}
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-xl border border-[var(--border-light)] p-6">
          <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-4">Productos</h3>
          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => {
                const coverImage = (item.productVariant?.product?.media ?? [])
                  .filter((m) => m.fileType === 'IMAGE')
                  .sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? null;
                const productId = item.productVariant?.product?.id;
                const label = item.productVariant?.product?.name
                  ?? item.productVariant?.name
                  ?? item.productVariant?.sku
                  ?? `Variante #${item.id}`;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-[var(--bg-input)] flex items-center justify-center shrink-0 relative overflow-hidden">
                      {coverImage ? (
                        <Image src={coverImage} alt={label} fill className="object-contain" unoptimized />
                      ) : (
                        <Package size={18} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {productId ? (
                        <Link href={`/product/${productId}`} className="text-sm font-medium text-[var(--text-dark)] truncate hover:text-[var(--primary)] transition-colors block">
                          {label}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-[var(--text-dark)] truncate">{label}</p>
                      )}
                      <p className="text-xs text-[var(--text-muted)]">Cant: {item.requestedQuantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-dark)]">
                      {formatPrice(parseFloat(item.unitPrice) * item.requestedQuantity)}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[var(--text-muted)]">Sin productos registrados.</p>
            )}
          </div>

          <div className="border-t border-[var(--border)] mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span className="text-[var(--text-dark)]">{formatPrice(parseFloat(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Envío</span>
              {parseFloat(order.shippingCost) === 0 ? (
                <span className="text-green-600 font-medium">Gratis</span>
              ) : (
                <span className="text-[var(--text-dark)]">{formatPrice(parseFloat(order.shippingCost))}</span>
              )}
            </div>
            <div className="flex justify-between text-base font-bold pt-1 border-t border-[var(--border)]">
              <span className="text-[var(--text-dark)]">Total</span>
              <span className="text-[var(--text-dark)]">{formatPrice(parseFloat(order.totalAmount))}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        {order.shippingAddress && (
          <div className="bg-white rounded-xl border border-[var(--border-light)] p-6">
            <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-3">Dirección de entrega</h3>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[var(--primary)] mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                {order.shippingAddress.recipientName && (
                  <p className="text-sm font-medium text-[var(--text-dark)]">{order.shippingAddress.recipientName}</p>
                )}
                <p className="text-sm text-[var(--text-muted)]">{order.shippingAddress.fullAddressLine}</p>
                {order.shippingAddress.region?.name && (
                  <p className="text-sm text-[var(--text-muted)]">{order.shippingAddress.region.name}</p>
                )}
                {order.shippingAddress.reference && (
                  <p className="text-xs text-[var(--text-muted)] italic">Ref: {order.shippingAddress.reference}</p>
                )}
                {order.shippingAddress.phone && (
                  <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-1">
                    <Phone size={12} /> {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment method */}
        {order.paymentMethod && (
          <div className="bg-white rounded-xl border border-[var(--border-light)] p-6">
            <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-3">Método de pago</h3>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              {order.paymentMethod === 'CASH_ON_DELIVERY' ? (
                <Banknote size={16} className="text-[var(--primary)]" />
              ) : (
                <CreditCard size={16} className="text-[var(--primary)]" />
              )}
              {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/account?tab=orders"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline"
          >
            <ChevronLeft size={14} /> Volver a mis pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
