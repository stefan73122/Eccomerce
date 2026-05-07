'use client';

import { cn } from '@/lib/cn';
import type { Address } from '@/types';
import { CheckCircle } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}

export default function AddressCard({
  address,
  selected,
  onSelect,
}: AddressCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-lg p-4 border-2 transition-colors',
        selected
          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
          : 'border-[var(--border)] bg-white hover:border-[var(--border-light)]'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Radio circle */}
          <div
            className={cn(
              'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
              selected
                ? 'border-[var(--primary)] bg-[var(--primary)]'
                : 'border-[var(--border)]'
            )}
          >
            {selected && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>

          <div>
            {/* Label badge */}
            <span
              className={cn(
                'inline-block text-xs font-medium px-2 py-0.5 rounded mb-1.5',
                address.label === 'Home'
                  ? 'bg-blue-50 text-blue-600'
                  : address.label === 'Office'
                  ? 'bg-purple-50 text-purple-600'
                  : 'bg-gray-50 text-gray-600'
              )}
            >
              {address.label}
            </span>

            <p className="text-sm font-medium text-[var(--text-dark)]">
              {address.fullName}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {address.street}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {address.city}, {address.state} {address.zip}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {address.phone}
            </p>
          </div>
        </div>

        {selected && (
          <CheckCircle
            size={20}
            className="text-[var(--primary)] flex-shrink-0"
          />
        )}
      </div>
    </button>
  );
}
