'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import Modal from '@/components/ui/Modal';
import { useUIStore } from '@/store/useUIStore';
import { useStoreStore } from '@/store/useStoreStore';

export default function StoreModal() {
  const isStoreModalOpen = useUIStore((s) => s.isStoreModalOpen);
  const closeStoreModal = useUIStore((s) => s.closeStoreModal);
  const stores = useStoreStore((s) => s.stores);
  const selectedStore = useStoreStore((s) => s.selectedStore);
  const setSelectedStore = useStoreStore((s) => s.setSelectedStore);
  const loadStores = useStoreStore((s) => s.loadStores);
  const loading = useStoreStore((s) => s.loading);

  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState(selectedStore);

  useEffect(() => {
    if (isStoreModalOpen && stores.length === 0 && !loading) {
      loadStores();
    }
  }, [isStoreModalOpen]);

  useEffect(() => {
    setTempSelected(selectedStore);
  }, [selectedStore]);

  const filteredStores = stores.filter((store) => {
    const query = searchQuery.toLowerCase();
    const regionName = store.region?.name?.toLowerCase() || '';
    const address = store.address?.toLowerCase() || '';
    const name = store.name.toLowerCase();
    
    return (
      name.includes(query) ||
      regionName.includes(query) ||
      address.includes(query)
    );
  });

  const handleConfirm = () => {
    if (tempSelected) {
      setSelectedStore(tempSelected);
    }
    closeStoreModal();
  };

  return (
    <Modal isOpen={isStoreModalOpen} onClose={closeStoreModal} title="Select Your Store">
      <div className="flex flex-col gap-4">
        {/* Search input */}
        <div className="flex items-center gap-2 border border-[var(--border)] rounded-lg px-3 h-10 bg-white">
          <Search size={16} className="text-[#999]" />
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-[var(--text-dark)] placeholder:text-[#999]"
          />
        </div>

        {/* Store list */}
        <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 size={32} className="text-[var(--primary)] animate-spin" />
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-[var(--text-muted)]">
                {searchQuery ? 'No stores found matching your search.' : 'No stores available.'}
              </p>
            </div>
          ) : (
            filteredStores.map((store) => {
              const isSelected = tempSelected?.id === store.id;
              const regionName = store.region?.name || 'N/A';
              return (
                <button
                  key={store.id}
                  onClick={() => setTempSelected(store)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border text-left transition-colors',
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                      : 'border-[var(--border-light)] hover:bg-gray-50'
                  )}
                >
                  {/* Radio circle */}
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0',
                      isSelected
                        ? 'border-[var(--primary)]'
                        : 'border-[#CCC]'
                    )}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                    )}
                  </div>

                  {/* Store info */}
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-sm font-semibold text-[var(--text-dark)] truncate">
                      {store.name}
                    </span>
                    <span className="text-xs text-[#999]">{regionName}</span>
                    {store.address && (
                      <span className="text-[13px] text-[#666] flex items-start gap-1">
                        <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{store.address}</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="w-full h-11 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Confirm Selection
        </button>
      </div>
    </Modal>
  );
}
