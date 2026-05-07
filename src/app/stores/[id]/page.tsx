'use client';

import { useParams } from 'next/navigation';
import { getStoreById, getNearbyStores } from '@/services/storeService';
import Breadcrumb from '@/components/layout/Breadcrumb';
import StoreMap from '@/components/store/StoreMap';
import StoreCard from '@/components/store/StoreCard';
import { MapPin, Phone, Clock, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Store } from '@/types';

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [nearby, setNearby] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      loadStoreData();
    }
  }, [id]);

  const loadStoreData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [storeData, nearbyStores] = await Promise.all([
        getStoreById(id),
        getNearbyStores(id, 3),
      ]);
      
      if (!storeData) {
        setError(true);
      } else {
        setStore(storeData);
        setNearby(nearbyStores);
      }
    } catch (err) {
      console.error('Error loading store data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-20 py-20 flex justify-center items-center">
        <Loader2 size={40} className="text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="px-4 sm:px-6 lg:px-20 py-20 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--text-dark)] mb-2">Store not found</h1>
        <p className="text-[var(--text-muted)] mb-6">The store you're looking for doesn't exist or has been removed.</p>
        <a 
          href="/stores" 
          className="inline-block bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Back to Stores
        </a>
      </div>
    );
  }

  const regionName = store.region?.name || 'N/A';
  const coordinates = store.latitude && store.longitude 
    ? { lat: store.latitude, lng: store.longitude }
    : undefined;

  const handleGetDirections = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Stores', href: '/stores' }, { label: store.name }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <StoreMap stores={[store]} className="h-[400px]" />

          <div className="space-y-6">
            <div>
              <span className="text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-1 rounded-full">
                {regionName}
              </span>
              <h1 className="text-[28px] font-bold text-[var(--text-dark)] mt-3">{store.name}</h1>
              {!store.isActive && (
                <span className="inline-block mt-2 text-xs font-medium bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                  Inactive
                </span>
              )}
            </div>

            <div className="space-y-4">
              {store.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-dark)]">Address</p>
                    <p className="text-sm text-[var(--text-muted)]">{store.address}</p>
                  </div>
                </div>
              )}
              {store.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-dark)]">Phone</p>
                    <p className="text-sm text-[var(--text-muted)]">{store.phone}</p>
                  </div>
                </div>
              )}
              {store.hours && (
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-dark)]">Hours</p>
                    <p className="text-sm text-[var(--text-muted)]">{store.hours}</p>
                  </div>
                </div>
              )}
            </div>

            {coordinates && (
              <button 
                onClick={handleGetDirections}
                className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
              >
                <Navigation size={18} /> Get Directions
              </button>
            )}
          </div>
        </div>

        {nearby.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-6">Nearby Stores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearby.map((s) => (
                <StoreCard key={s.id} store={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
