'use client';

import { cn } from '@/lib/cn';
import { useUserStore } from '@/store/useUserStore';
import { MapPin, Plus, Store, Truck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AddressCard from './AddressCard';

type DeliveryTab = 'delivery' | 'pickup';
type ShippingSpeed = 'standard' | 'express';

export default function ShippingForm() {
  const addresses = useUserStore((s) => s.addresses);
  const [deliveryTab, setDeliveryTab] = useState<DeliveryTab>('delivery');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? ''
  );
  const [shippingSpeed, setShippingSpeed] =
    useState<ShippingSpeed>('standard');

  return (
    <div className="space-y-6">
      {/* Delivery Tabs */}
      <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
        <button
          type="button"
          onClick={() => setDeliveryTab('delivery')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            deliveryTab === 'delivery'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-white text-[var(--text-muted)] hover:bg-[var(--bg-light)]'
          )}
        >
          <Truck size={18} />
          Delivery
        </button>
        <button
          type="button"
          onClick={() => setDeliveryTab('pickup')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            deliveryTab === 'pickup'
              ? 'bg-[var(--primary)] text-white'
              : 'bg-white text-[var(--text-muted)] hover:bg-[var(--bg-light)]'
          )}
        >
          <Store size={18} />
          Store Pickup
        </button>
      </div>

      {deliveryTab === 'delivery' && (
        <>
          {/* Address List */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-dark)] mb-3 flex items-center gap-2">
              <MapPin size={16} />
              Delivery Address
            </h3>
            <div className="space-y-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  selected={selectedAddressId === address.id}
                  onSelect={() => setSelectedAddressId(address.id)}
                />
              ))}
            </div>

            <Link
              href="/checkout/address/new"
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              <Plus size={18} />
              Add New Address
            </Link>
          </div>

          {/* Delivery Speed */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text-dark)] mb-3">
              Delivery Date
            </h3>
            <div className="space-y-2">
              <label
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                  shippingSpeed === 'standard'
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border)] hover:border-[var(--border-light)]'
                )}
              >
                <input
                  type="radio"
                  name="shipping-speed"
                  checked={shippingSpeed === 'standard'}
                  onChange={() => setShippingSpeed('standard')}
                  className="accent-[var(--primary)]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-dark)]">
                    Standard (3-5 days)
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Free shipping
                  </p>
                </div>
                <span className="text-sm font-medium text-[var(--success)]">
                  Free
                </span>
              </label>

              <label
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                  shippingSpeed === 'express'
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border)] hover:border-[var(--border-light)]'
                )}
              >
                <input
                  type="radio"
                  name="shipping-speed"
                  checked={shippingSpeed === 'express'}
                  onChange={() => setShippingSpeed('express')}
                  className="accent-[var(--primary)]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-dark)]">
                    Express (1-2 days)
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Priority delivery
                  </p>
                </div>
                <span className="text-sm font-medium text-[var(--text-dark)]">
                  $9.99
                </span>
              </label>
            </div>
          </div>
        </>
      )}

      {deliveryTab === 'pickup' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Store size={40} className="text-[var(--text-muted)] mb-3" />
          <p className="text-sm text-[var(--text-muted)]">
            Store pickup locations will be available soon.
          </p>
        </div>
      )}
    </div>
  );
}
