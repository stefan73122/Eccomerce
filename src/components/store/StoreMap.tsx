'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Store } from '@/types';

interface StoreMapProps {
  className?: string;
  stores?: Store[];
}

// Default center: Santa Cruz, Bolivia
const DEFAULT_LAT = -17.7833;
const DEFAULT_LNG = -63.1821;

export default function StoreMap({ className, stores = [] }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storesWithCoordinates = stores.filter(
    (s) => s.latitude != null && s.longitude != null
  );
  const hasValidStores = storesWithCoordinates.length > 0;

  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;

      // Destroy any pre-existing Leaflet instance
      if ((mapRef.current as any)._leaflet_id) {
        (mapRef.current as any)._leaflet_id = undefined;
      }

      // Load Leaflet CSS if not already loaded
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current) return;

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Determine center and zoom based on stores
      let centerLat = DEFAULT_LAT;
      let centerLng = DEFAULT_LNG;
      let zoom = 13;

      if (hasValidStores) {
        if (storesWithCoordinates.length === 1) {
          // Single store: center on it
          centerLat = storesWithCoordinates[0].latitude!;
          centerLng = storesWithCoordinates[0].longitude!;
          zoom = 15;
        } else {
          // Multiple stores: calculate center
          const avgLat =
            storesWithCoordinates.reduce((sum, s) => sum + (s.latitude || 0), 0) /
            storesWithCoordinates.length;
          const avgLng =
            storesWithCoordinates.reduce((sum, s) => sum + (s.longitude || 0), 0) /
            storesWithCoordinates.length;
          centerLat = avgLat;
          centerLng = avgLng;
          zoom = 12;
        }
      }

      const map = L.map(mapRef.current, { 
        preferCanvas: false,
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([centerLat, centerLng], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add markers for each store
      storesWithCoordinates.forEach((store) => {
        if (store.latitude && store.longitude) {
          const marker = L.marker([store.latitude, store.longitude]).addTo(map);
          
          // Add popup with store info
          const regionName = store.region?.name || 'N/A';
          marker.bindPopup(`
            <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 180px;">
              <div style="font-weight: 700; font-size: 14px; color: #1a1a1a; margin-bottom: 6px;">
                ${store.name}
              </div>
              <div style="display: inline-block; background: rgba(var(--primary-rgb, 59, 130, 246), 0.1); color: var(--primary, #3b82f6); font-size: 10px; padding: 2px 8px; border-radius: 12px; margin-bottom: 8px; font-weight: 600;">
                ${regionName}
              </div>
              ${store.address ? `
                <div style="font-size: 12px; color: #666; margin-bottom: 4px; line-height: 1.4;">
                  📍 ${store.address}
                </div>
              ` : ''}
              ${store.phone ? `
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                  📞 ${store.phone}
                </div>
              ` : ''}
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                <a href="/stores/${store.id}" style="color: var(--primary, #3b82f6); font-size: 12px; font-weight: 600; text-decoration: none;">
                  Ver detalles →
                </a>
              </div>
            </div>
          `);
          
          markersRef.current.push(marker);
        }
      });

      // Fit bounds if multiple stores
      if (storesWithCoordinates.length > 1) {
        const bounds = L.latLngBounds(
          storesWithCoordinates.map((s) => [s.latitude!, s.longitude!])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }

      // Invalidate size to ensure correct rendering
      setTimeout(() => {
        if (!cancelled && mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

      setIsLoading(false);
    };

    loadLeaflet();

    return () => {
      cancelled = true;
      // Clear all markers
      markersRef.current.forEach((marker) => {
        if (marker) marker.remove();
      });
      markersRef.current = [];
      
      // Remove map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapRef.current) {
        (mapRef.current as any)._leaflet_id = undefined;
      }
    };
  }, [stores.length, hasValidStores]);

  if (!hasValidStores) {
    return (
      <div
        className={cn(
          'rounded-xl bg-[var(--bg-light)] border border-[var(--border)] flex flex-col items-center justify-center gap-3',
          className
        )}
      >
        <MapPin size={48} className="text-[#CCC]" />
        <span className="text-sm text-[var(--text-muted)]">No hay tiendas con ubicación</span>
      </div>
    );
  }

  return (
    <div className={cn('border border-[var(--border)] rounded-xl overflow-hidden relative', className)}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      {isLoading && (
        <div className="absolute inset-0 bg-[var(--bg-light)] flex flex-col items-center justify-center gap-2 z-[1000]">
          <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
          <span className="text-sm text-[var(--text-muted)]">Cargando mapa…</span>
        </div>
      )}
      
      {/* Store count badge */}
      {!isLoading && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-[var(--border)]">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-[var(--primary)]" />
            <span className="text-xs font-semibold text-[var(--text-dark)]">
              {storesWithCoordinates.length} {storesWithCoordinates.length === 1 ? 'tienda' : 'tiendas'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
