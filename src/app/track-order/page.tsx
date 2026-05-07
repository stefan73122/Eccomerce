'use client';

import { useState } from 'react';
import { trackOrder } from '@/services/orderService';
import { Order } from '@/types';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/cn';
import { Package, Search, Check, Circle, MapPin, Truck, Box, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const timelineSteps = [
  { key: 'processing', label: 'Order Placed', icon: Box, date: 'Dec 15, 2024' },
  { key: 'shipped', label: 'Processing', icon: Package, date: 'Dec 16, 2024' },
  { key: 'out_for_delivery', label: 'Shipped', icon: Truck, date: 'Dec 17, 2024' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, date: 'Dec 18, 2024' },
];

const statusOrder = ['processing', 'shipped', 'out_for_delivery', 'delivered'];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const found = trackOrder(orderId);
    setOrder(found || null);
  };

  const currentIndex = order ? statusOrder.indexOf(order.status) : -1;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Track Order' }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-10">
        {!order ? (
          <div className="max-w-md mx-auto text-center py-10">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h1 className="text-[28px] font-bold text-[var(--text-dark)] mb-2">Track Your Order</h1>
            <p className="text-sm text-[var(--text-muted)] mb-6">Enter your order ID to see the latest status</p>

            <div className="flex gap-2">
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. ORD-2024-001"
                className="flex-1 border border-[var(--border)] rounded-lg px-4 h-12 text-sm outline-none focus:border-[var(--primary)]"
              />
              <button onClick={handleSearch} className="bg-[var(--primary)] text-white px-6 h-12 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2">
                <Search size={18} /> Track
              </button>
            </div>

            {searched && !order && (
              <p className="text-sm text-[var(--error)] mt-4">No order found with that ID. Please try again.</p>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-dark)]">{order.id}</h1>
                <p className="text-sm text-[var(--text-muted)]">Placed on {order.date}</p>
              </div>
              <span className="text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1.5 rounded-full capitalize">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-6">Order Timeline</h3>
              <div className="space-y-0">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = idx <= currentIndex;
                  const isCurrent = idx === currentIndex;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                          isCompleted ? 'bg-[var(--primary)] text-white' : 'bg-gray-200 text-gray-400',
                          isCurrent && 'ring-4 ring-[var(--primary)]/20'
                        )}>
                          {isCompleted && idx < currentIndex ? <Check size={16} /> : <StepIcon size={16} />}
                        </div>
                        {idx < timelineSteps.length - 1 && (
                          <div className={cn('w-0.5 h-12', isCompleted ? 'bg-[var(--primary)]' : 'bg-gray-200')} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={cn('text-sm font-medium', isCompleted ? 'text-[var(--text-dark)]' : 'text-[var(--text-placeholder)]')}>{step.label}</p>
                        <p className="text-xs text-[var(--text-light)]">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 mb-6">
              <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-4">Order Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Tracking Number</span>
                  <span className="text-[var(--text-dark)] font-medium">{order.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Estimated Delivery</span>
                  <span className="text-[var(--text-dark)]">{order.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Total</span>
                  <span className="text-[var(--text-dark)] font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setOrder(null)} className="border border-[var(--border)] text-[var(--text-dark)] px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Track Another
              </button>
              <Link href="/contact" className="text-sm text-[var(--primary)] font-medium hover:underline flex items-center px-4">
                Need Help?
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
