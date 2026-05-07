'use client';

import { getDealsProducts } from '@/services/productService';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductCard from '@/components/product/ProductCard';
import { Flame, Clock, Zap } from 'lucide-react';
import { formatDiscount } from '@/lib/utils';

export default function DealsPage() {
  const deals = getDealsProducts();

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Deals' }]} />

      {/* Hero Banner */}
      <div className="mx-4 sm:mx-6 lg:mx-20 mt-6 rounded-2xl bg-gradient-to-r from-[var(--error)] to-[#FF6B6B] p-10 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Flame size={28} />
          <span className="text-sm font-bold tracking-[2px] uppercase">Flash Sale</span>
        </div>
        <h1 className="text-[36px] font-bold leading-tight">Hot Deals &<br />Limited Offers</h1>
        <p className="text-white/80 mt-2 text-base">Save up to 40% on selected premium products. Limited time only!</p>
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
            <Clock size={16} />
            <span className="text-sm font-medium">Ends in 23:45:12</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={16} />
            <span className="text-sm">{deals.length} deals available</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-20 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-dark)]">All Deals</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
