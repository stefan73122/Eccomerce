'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

// Default center: Santa Cruz, Bolivia
const DEFAULT_LAT = -17.7833;
const DEFAULT_LNG = -63.1821;

export default function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Keep refs to always-current prop values to avoid stale closures inside async loadLeaflet
  const latRef = useRef(latitude);
  const lngRef = useRef(longitude);
  const onChangeRef = useRef(onLocationChange);

  useEffect(() => { latRef.current = latitude; }, [latitude]);
  useEffect(() => { lngRef.current = longitude; }, [longitude]);
  useEffect(() => { onChangeRef.current = onLocationChange; }, [onLocationChange]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null,
  );

  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;

      // Destroy any pre-existing Leaflet instance on this DOM node
      if ((mapRef.current as any)._leaflet_id) {
        (mapRef.current as any)._leaflet_id = undefined;
      }

      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L = (await import('leaflet')).default;
      if (cancelled || !mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Read the CURRENT prop values via refs (avoids stale closure)
      const initLat = latRef.current ?? DEFAULT_LAT;
      const initLng = lngRef.current ?? DEFAULT_LNG;

      const map = L.map(mapRef.current, { preferCanvas: false }).setView([initLat, initLng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([initLat, initLng], { draggable: true }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;

      // Notify parent and update display if we have real coords
      if (latRef.current != null && lngRef.current != null) {
        setCoords({ lat: initLat, lng: initLng });
      }

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setCoords({ lat: pos.lat, lng: pos.lng });
        onChangeRef.current(pos.lat, pos.lng);
      });

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        onChangeRef.current(e.latlng.lat, e.latlng.lng);
      });

      // invalidateSize ensures correct tile rendering and drag behavior
      // after the container has its final CSS dimensions
      setTimeout(() => {
        if (!cancelled) map.invalidateSize();
      }, 150);

      setIsLoading(false);
    };

    loadLeaflet();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      if (mapRef.current) {
        (mapRef.current as any)._leaflet_id = undefined;
      }
    };
  }, []);

  // When parent updates lat/lng (e.g. user clicks "my location" while editing)
  useEffect(() => {
    if (!markerRef.current || !mapInstanceRef.current) return;
    if (latitude == null || longitude == null) return;
    markerRef.current.setLatLng([latitude, longitude]);
    mapInstanceRef.current.setView([latitude, longitude], 14);
    setCoords({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      );
      const data = await res.json();
      if (data?.[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          mapInstanceRef.current.setView([lat, lng], 15);
          setCoords({ lat, lng });
          onChangeRef.current(lat, lng);
        }
      }
    } catch {
      // silent
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      if (mapInstanceRef.current && markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], 16);
        setCoords({ lat, lng });
        onChangeRef.current(lat, lng);
      }
    });
  };

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Search bar */}
      <div className="flex gap-2 p-3 border-b border-[var(--border)] bg-[var(--bg-light)]">
        <div className="flex-1 flex items-center border border-[var(--border)] rounded-lg bg-white px-3 h-9">
          <Search size={14} className="text-[var(--text-muted)] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar ciudad o dirección…"
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-lg bg-white hover:bg-gray-50 transition disabled:opacity-50"
          title="Buscar"
        >
          {isSearching ? (
            <Loader2 size={14} className="animate-spin text-[var(--text-muted)]" />
          ) : (
            <Search size={14} className="text-[var(--text-muted)]" />
          )}
        </button>
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="w-9 h-9 flex items-center justify-center border border-[var(--primary)] rounded-lg bg-white hover:bg-[var(--primary)]/5 transition"
          title="Usar mi ubicación"
        >
          <Navigation size={14} className="text-[var(--primary)]" />
        </button>
      </div>

      {/* Map container — position:relative so Leaflet controls render correctly */}
      <div className="relative" style={{ height: 300 }}>
        <div ref={mapRef} style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }} />
        {isLoading && (
          <div className="absolute inset-0 bg-[var(--bg-light)] flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
            <span className="text-sm text-[var(--text-muted)]">Cargando mapa…</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-[var(--bg-light)] border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-[var(--text-muted)]" />
          <span className="text-xs text-[var(--text-muted)]">
            {coords
              ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
              : 'Haz clic en el mapa o arrastra el marcador'}
          </span>
        </div>
        {coords && (
          <span className="text-[10px] text-green-600 font-medium">Ubicación marcada ✓</span>
        )}
      </div>
    </div>
  );
}
