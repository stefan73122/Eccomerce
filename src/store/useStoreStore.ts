'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Store } from '@/types';
import { getStores } from '@/services/storeService';

interface StoreState {
  stores: Store[];
  selectedStore: Store | null;
  loading: boolean;
  error: string | null;
  loadStores: () => Promise<void>;
  setSelectedStore: (store: Store | null) => void;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      stores: [],
      selectedStore: null,
      loading: false,
      error: null,
      loadStores: async () => {
        set({ loading: true, error: null });
        try {
          const data = await getStores();
          const activeStores = data.filter(s => s.isActive);
          set({
            stores: activeStores,
            loading: false,
            selectedStore: get().selectedStore || (activeStores.length > 0 ? activeStores[0] : null),
          });
        } catch (error: any) {
          console.error('Error loading stores:', error);
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load stores',
          });
        }
      },
      setSelectedStore: (store) => set({ selectedStore: store }),
    }),
    {
      name: 'storefront-store',
      partialize: (state) => ({ selectedStore: state.selectedStore }),
    }
  )
);
