'use client';

import { Package, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useUIStore } from '@/store/useUIStore';
import { products as allProducts } from '@/data/products';

export default function CompareModal() {
  const isOpen = useUIStore((s) => s.isCompareModalOpen);
  const compareProductIds = useUIStore((s) => s.compareProducts);
  const closeCompareModal = useUIStore((s) => s.closeCompareModal);

  const compareItems = compareProductIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean);

  // Collect all unique spec keys across compared products
  const allSpecKeys = Array.from(
    new Set(compareItems.flatMap((p) => Object.keys(p?.specs ?? {})))
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeCompareModal}
      title="Compare Products"
      maxWidth="max-w-4xl"
    >
      {compareItems.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No products selected for comparison.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header row: product images and names */}
            <thead>
              <tr className="border-b border-[#EAEAEA]">
                <th className="text-left py-3 pr-4 text-xs font-medium text-[var(--text-muted)] w-[140px]">
                  Product
                </th>
                {compareItems.map((product) => (
                  <th key={product!.id} className="py-3 px-4 text-center min-w-[160px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-20 h-20 rounded-lg bg-[var(--bg-input)] flex items-center justify-center">
                        <Package size={32} className="text-[#CCCCCC]" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-dark)]">
                        {product!.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Price row */}
              <tr className="border-b border-[#EAEAEA]">
                <td className="py-3 pr-4 text-xs font-medium text-[var(--text-muted)]">
                  Price
                </td>
                {compareItems.map((product) => (
                  <td
                    key={product!.id}
                    className="py-3 px-4 text-center font-bold text-[var(--text-dark)]"
                  >
                    ${product!.price.toFixed(2)}
                  </td>
                ))}
              </tr>

              {/* Rating row */}
              <tr className="border-b border-[#EAEAEA]">
                <td className="py-3 pr-4 text-xs font-medium text-[var(--text-muted)]">
                  Rating
                </td>
                {compareItems.map((product) => (
                  <td
                    key={product!.id}
                    className="py-3 px-4 text-center text-[var(--text-dark)]"
                  >
                    {product!.rating} / 5 ({product!.reviewCount})
                  </td>
                ))}
              </tr>

              {/* Availability row */}
              <tr className="border-b border-[#EAEAEA]">
                <td className="py-3 pr-4 text-xs font-medium text-[var(--text-muted)]">
                  Availability
                </td>
                {compareItems.map((product) => (
                  <td
                    key={product!.id}
                    className="py-3 px-4 text-center"
                  >
                    <span
                      className={
                        product!.inStock
                          ? 'text-green-600'
                          : 'text-red-500'
                      }
                    >
                      {product!.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Spec rows */}
              {allSpecKeys.map((key) => (
                <tr key={key} className="border-b border-[#EAEAEA]">
                  <td className="py-3 pr-4 text-xs font-medium text-[var(--text-muted)]">
                    {key}
                  </td>
                  {compareItems.map((product) => (
                    <td
                      key={product!.id}
                      className="py-3 px-4 text-center text-[var(--text-dark)]"
                    >
                      {product!.specs?.[key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
