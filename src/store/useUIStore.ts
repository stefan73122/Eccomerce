'use client';

import { create } from 'zustand';
import { Toast } from '@/types';

interface UIState {
  isCartDrawerOpen: boolean;
  isStoreModalOpen: boolean;
  isCompareModalOpen: boolean;
  isRegionModalOpen: boolean;
  isThemeEditorOpen: boolean;
  compareProducts: string[];
  toasts: Toast[];
  searchQuery: string;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  openStoreModal: () => void;
  closeStoreModal: () => void;
  openRegionModal: () => void;
  closeRegionModal: () => void;
  openCompareModal: (productIds: string[]) => void;
  closeCompareModal: () => void;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  setSearchQuery: (query: string) => void;
  openThemeEditor: () => void;
  closeThemeEditor: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isCartDrawerOpen: false,
  isStoreModalOpen: false,
  isCompareModalOpen: false,
  isRegionModalOpen: false,
  isThemeEditorOpen: false,
  compareProducts: [],
  toasts: [],
  searchQuery: '',
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((s) => ({ isCartDrawerOpen: !s.isCartDrawerOpen })),
  openStoreModal: () => set({ isStoreModalOpen: true }),
  closeStoreModal: () => set({ isStoreModalOpen: false }),
  openRegionModal: () => set({ isRegionModalOpen: true }),
  closeRegionModal: () => set({ isRegionModalOpen: false }),
  openCompareModal: (productIds) =>
    set({ isCompareModalOpen: true, compareProducts: productIds }),
  closeCompareModal: () => set({ isCompareModalOpen: false, compareProducts: [] }),
  addToast: (message, type) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  openThemeEditor: () => set({ isThemeEditorOpen: true }),
  closeThemeEditor: () => set({ isThemeEditorOpen: false }),
}));
