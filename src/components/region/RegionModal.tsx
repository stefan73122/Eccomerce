'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useRegionStore } from '@/store/useRegionStore';
import { useUIStore } from '@/store/useUIStore';
import { regionService } from '@/services/regionService';
import { Region } from '@/types';
import { useMounted } from '@/lib/useMounted';

export default function RegionModal() {
  const mounted = useMounted();
  const { hasSelectedRegion, selectedRegion, setRegion } = useRegionStore();
  const isOpen = useUIStore((s) => s.isRegionModalOpen);
  const openRegionModal = useUIStore((s) => s.openRegionModal);
  const closeRegionModal = useUIStore((s) => s.closeRegionModal);

  const [regions, setRegions] = useState<Region[]>([]);
  const [selected, setSelected] = useState<Region | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Pre-select current region on re-open
  useEffect(() => {
    if (isOpen && selectedRegion) setSelected(selectedRegion);
  }, [isOpen, selectedRegion]);

  // Auto-open on first visit
  useEffect(() => {
    if (mounted && !hasSelectedRegion) openRegionModal();
  }, [mounted, hasSelectedRegion, openRegionModal]);

  // Load regions whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(false);
    regionService
      .getRegions()
      .then((data) => setRegions(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleConfirm = () => {
    if (!selected) return;
    setRegion(selected);
    closeRegionModal();
  };

  const handleClose = () => {
    if (!hasSelectedRegion) return;
    closeRegionModal();
  };

  if (!mounted || !isOpen) return null;

  const isDismissable = hasSelectedRegion;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={isDismissable ? handleClose : undefined}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 p-6 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-[var(--text-dark)]">¡Bienvenido!</h2>
            <p className="text-sm text-[#666]">Selecciona tu región para ver precios y disponibilidad.</p>
          </div>
          {isDismissable && (
            <button onClick={handleClose} className="text-[#999] hover:text-[var(--text-dark)] transition-colors">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={28} className="animate-spin text-[var(--primary)]" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-red-500 text-center">No se pudieron cargar las regiones.</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(false);
                regionService.getRegions()
                  .then(setRegions)
                  .catch(() => setError(true))
                  .finally(() => setLoading(false));
              }}
              className="text-sm text-[var(--primary)] underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Region list */}
        {!loading && !error && (
          <>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[340px]">
              {regions.map((region) => {
                const isSelected = selected?.id === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelected(region)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border text-left transition-colors',
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                        : 'border-[var(--border)] hover:bg-[var(--bg-light)]',
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                      isSelected ? 'border-[var(--primary)]' : 'border-[#CCC]',
                    )}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />}
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-dark)]">{region.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="w-full h-11 bg-[var(--primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
