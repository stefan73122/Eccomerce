'use client';

import Breadcrumb from '@/components/layout/Breadcrumb';
import StoreCard from '@/components/store/StoreCard';
import StoreMap from '@/components/store/StoreMap';
import { Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getStores, searchStores } from '@/services/storeService';
import { Store } from '@/types';

export default function StoresPage() {
  const [search, setSearch] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      const data = await getStores();
      setStores(data);
    } catch (error: any) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim() === '') {
      loadStores();
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchStores(search);
        setStores(results);
      } catch (error: any) {
        console.error('Error searching stores:', error);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const activeStores = stores.filter(s => s.isActive);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Store Directory' }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--text-dark)]">Store Directory</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Find a Storefront location near you
              {activeStores.length > 0 && (
                <span className="ml-2 text-[var(--primary)] font-medium">
                  ({activeStores.length} {activeStores.length === 1 ? 'store' : 'stores'})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center border border-[var(--border)] rounded-lg bg-white h-10 px-3 w-full sm:w-[300px]">
            <Search size={18} className="text-[var(--text-placeholder)] mr-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stores..."
              className="flex-1 outline-none text-sm"
            />
            {searching && (
              <Loader2 size={16} className="text-[var(--primary)] animate-spin ml-2" />
            )}
          </div>
        </div>

        {stores.length > 0 && (
          <div className="mb-8">
            <StoreMap stores={activeStores} className="h-[300px] w-full" />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={40} className="text-[var(--primary)] animate-spin" />
          </div>
        ) : activeStores.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--text-muted)] text-lg">
              {search ? 'No stores found matching your search.' : 'No stores available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
