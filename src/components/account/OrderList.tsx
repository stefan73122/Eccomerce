'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package, Loader2, ChevronRight, QrCode, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/axios';

interface BackendOrder {
  id: number;
  totalAmount: string;
  status: string;
  fulfillmentType: string;
  paymentMethod?: string | null;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const PAGE_SIZE = 10;

export default function OrderList() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback((p: number) => {
    setLoading(true);
    api
      .get<{ data: BackendOrder[]; pagination?: Pagination }>(
        `/api/orders/my-orders?page=${p}&limit=${PAGE_SIZE}`,
      )
      .then((res) => {
        setOrders(res.data.data ?? []);
        setPagination(res.data.pagination ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (orders.length === 0 && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Package size={48} className="text-gray-300" />
        <p className="text-lg font-medium text-[var(--text-dark)]">No tienes pedidos aún</p>
        <p className="text-sm text-[var(--text-muted)]">Realiza tu primera compra para verla aquí</p>
        <Link
          href="/categories"
          className="mt-2 bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div>
      <div className="space-y-3">
        {orders.map((order) => {
          const isPendingPayment = order.status === 'PENDING_PAYMENT';
          const href = isPendingPayment ? `/order/${order.id}/pay` : `/order/${order.id}`;
          return (
            <div
              key={order.id}
              className={cn(
                'p-4 bg-white rounded-xl border transition',
                isPendingPayment
                  ? 'border-yellow-300 shadow-sm'
                  : 'border-[var(--border-light)] hover:shadow-sm',
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-[var(--bg-light)] flex items-center justify-center shrink-0">
                    <Package size={20} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-dark)]">Pedido #{order.id}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600')}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                  <p className="text-sm font-semibold text-[var(--text-dark)]">
                    {formatPrice(parseFloat(order.totalAmount))}
                  </p>
                  <Link href={href}>
                    <ChevronRight size={16} className="text-[var(--text-muted)]" />
                  </Link>
                </div>
              </div>

              {isPendingPayment && (
                <div className="mt-3 pt-3 border-t border-yellow-100 flex items-center justify-between gap-3">
                  <p className="text-xs text-yellow-700">Este pedido está esperando tu pago.</p>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 bg-[var(--primary)] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition shrink-0"
                  >
                    <QrCode size={13} /> Completar pago
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={15} /> Anterior
          </button>

          <span className="text-sm text-[var(--text-muted)]">
            Página <span className="font-semibold text-[var(--text-dark)]">{page}</span> de{' '}
            <span className="font-semibold text-[var(--text-dark)]">{totalPages}</span>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Siguiente <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
