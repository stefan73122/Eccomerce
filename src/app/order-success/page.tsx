'use client';

import { CheckCircle, Package, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="py-10 lg:py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[var(--success)]" />
        </div>

        <h1 className="text-[28px] font-bold text-[var(--text-dark)] mb-2">Order Placed Successfully!</h1>
        <p className="text-base text-[var(--text-muted)]">Thank you for your purchase. You will receive a confirmation email shortly.</p>

        <div className="bg-[var(--bg-light)] rounded-xl p-6 mt-8 text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-muted)]">Order ID</span>
            <span className="text-sm font-semibold text-[var(--text-dark)]">ORD-2024-001</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-muted)]">Date</span>
            <span className="text-sm text-[var(--text-dark)]">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-muted)]">Status</span>
            <span className="text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-1 rounded-full">Processing</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-muted)]">Est. Delivery</span>
            <span className="text-sm text-[var(--text-dark)]">3-5 business days</span>
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[var(--text-dark)]">Storefront Northeast</p>
                <p className="text-xs text-[var(--text-muted)]">123 Main St, Boston, MA 02108</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-8">
          <Link href="/track-order" className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2">
            <Package size={18} /> Track Order
          </Link>
          <Link href="/" className="border border-[var(--border)] text-[var(--text-dark)] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
