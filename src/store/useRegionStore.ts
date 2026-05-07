'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Region } from '@/types';

interface RegionState {
  selectedRegion: Region | null;
  hasSelectedRegion: boolean;
  setRegion: (region: Region) => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      selectedRegion: null,
      hasSelectedRegion: false,
      setRegion: (region) => set({ selectedRegion: region, hasSelectedRegion: true }),
    }),
    { name: 'storefront-region' }
  )
);
