'use client';

import { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, Loader2, MapPin, Pencil,
  Plus, Star, Store, Trash2, Truck,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { useUserStore } from '@/store/useUserStore';
import api from '@/lib/axios';

interface BackendAddress {
  id: number;
  fullAddressLine: string;
  reference?: string | null;
  label?: string | null;
  recipientName?: string | null;
  phone?: string | null;
  regionId: number;
  customerId: number;
  isDefault: boolean;
  region?: { id: number; name: string };
  latitude?: number | null;
  longitude?: number | null;
}

export interface ShippingResult {
  shippingCost: number;
  estimatedDays: number | null;
  originRegion: string;
  destinationRegion: string;
  distance?: number;
  currency?: string;
  coverageZone?: string;
}

interface DeliverySectionProps {
  deliveryTab: 'delivery' | 'pickup';
  onDeliveryTabChange: (tab: 'delivery' | 'pickup') => void;
  selectedAddressId: number | null;
  onAddressSelect: (id: number | null) => void;
  onShippingInfoChange: (info: ShippingResult | null) => void;
}

export default function DeliverySection({
  deliveryTab,
  onDeliveryTabChange,
  selectedAddressId,
  onAddressSelect,
  onShippingInfoChange,
}: DeliverySectionProps) {
  const user = useUserStore((s) => s.user);
  const [addresses, setAddresses] = useState<BackendAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingResult | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Load addresses
  useEffect(() => {
    const customerId = user?.customerId;
    const params = customerId ? `?userId=${customerId}` : '';
    api
      .get<{ status: string; data: BackendAddress[] }>(`/api/addresses${params}`)
      .then((res) => {
        const list = res.data.data ?? [];
        setAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault) ?? list[0] ?? null;
        if (defaultAddr) onAddressSelect(defaultAddr.id);
      })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.customerId]);

  // Calculate shipping cost
  useEffect(() => {
    if (!selectedAddressId || deliveryTab !== 'delivery') {
      setShippingInfo(null);
      setShippingError(null);
      onShippingInfoChange(null);
      return;
    }
    setLoadingShipping(true);
    setShippingInfo(null);
    setShippingError(null);
    api
      .post<{ status: string; data: ShippingResult }>('/api/shipping-rates/calculate', { addressId: selectedAddressId })
      .then((res) => {
        setShippingInfo(res.data.data);
        onShippingInfoChange(res.data.data);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || 'No hay tarifa de envío disponible para esta dirección.';
        setShippingError(msg);
        onShippingInfoChange(null);
      })
      .finally(() => setLoadingShipping(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId, deliveryTab]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar esta dirección?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/addresses/${id}`);
      const remaining = addresses.filter((a) => a.id !== id);
      setAddresses(remaining);
      if (selectedAddressId === id) onAddressSelect(remaining[0]?.id ?? null);
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (e: React.MouseEvent, addr: BackendAddress) => {
    e.stopPropagation();
    if (addr.isDefault) return;
    setSettingDefaultId(addr.id);
    try {
      await api.put(`/api/addresses/${addr.id}/default`);
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === addr.id })));
    } catch {
      // silent
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border-light)] p-6">
      <h2 className="text-lg font-semibold text-[var(--text-dark)] mb-4">Dirección de Envío</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => onDeliveryTabChange('delivery')}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
            deliveryTab === 'delivery' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-[var(--text-muted)]'
          )}
        >
          <Truck size={16} /> Envío a domicilio
        </button>
        <button
          onClick={() => onDeliveryTabChange('pickup')}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
            deliveryTab === 'pickup' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-[var(--text-muted)]'
          )}
        >
          <Store size={16} /> Retiro en tienda
        </button>
      </div>

      {/* Address list */}
      <div className="space-y-3">
        {loadingAddresses ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] py-4 text-center">
            No tienes direcciones guardadas.
          </p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              role="radio"
              aria-checked={selectedAddressId === addr.id}
              onClick={() => onAddressSelect(addr.id)}
              className={cn(
                'w-full text-left p-4 rounded-lg border transition cursor-pointer',
                selectedAddressId === addr.id
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                  : 'border-[var(--border-light)] hover:border-gray-300'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0',
                  selectedAddressId === addr.id ? 'border-[var(--primary)]' : 'border-gray-300'
                )}>
                  {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {addr.label && (
                      <span className="text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full">
                        {addr.label}
                      </span>
                    )}
                    {addr.isDefault && (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={10} className="fill-amber-500 text-amber-500" /> Predeterminada
                      </span>
                    )}
                    {addr.region?.name && (
                      <span className="text-xs text-[var(--text-muted)]">{addr.region.name}</span>
                    )}
                  </div>
                  {addr.recipientName && (
                    <p className="text-sm font-medium text-[var(--text-dark)]">{addr.recipientName}</p>
                  )}
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">{addr.fullAddressLine}</p>
                  {addr.reference && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 italic">{addr.reference}</p>
                  )}
                  {addr.phone && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{addr.phone}</p>
                  )}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-0.5 ml-1 shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={(e) => handleSetDefault(e, addr)}
                      disabled={settingDefaultId === addr.id}
                      className="p-1.5 rounded-lg hover:bg-amber-50 transition text-gray-300 hover:text-amber-500 disabled:opacity-50"
                      title="Establecer como predeterminada"
                    >
                      {settingDefaultId === addr.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Star size={14} />}
                    </button>
                  )}
                  <Link
                    href={`/checkout/address/${addr.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                    title="Editar dirección"
                  >
                    <Pencil size={14} className="text-[var(--text-muted)]" />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, addr.id)}
                    disabled={deletingId === addr.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition text-[var(--text-muted)] hover:text-red-500 disabled:opacity-50"
                    title="Eliminar dirección"
                  >
                    {deletingId === addr.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/checkout/address/new" className="flex items-center gap-2 mt-4 text-sm font-medium text-[var(--primary)] hover:underline">
        <Plus size={16} /> Agregar nueva dirección
      </Link>

      {/* Shipping cost panel */}
      {deliveryTab === 'delivery' && selectedAddressId && (
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-3">Costo de envío</h3>
          {loadingShipping ? (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Loader2 size={15} className="animate-spin text-[var(--primary)]" />
              <span>Calculando costo de envío…</span>
            </div>
          ) : shippingError ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{shippingError}</p>
            </div>
          ) : shippingInfo ? (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                <span className="text-sm font-medium text-green-700">
                  {shippingInfo.coverageZone
                    ? `Zona de cobertura: ${shippingInfo.coverageZone}`
                    : `Envío inter-región disponible`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm pl-5">
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <MapPin size={12} />
                  <span>
                    {shippingInfo.originRegion} → {shippingInfo.destinationRegion}
                    {shippingInfo.distance != null && ` (${shippingInfo.distance} km)`}
                  </span>
                </div>
                <span className="font-semibold text-[var(--text-dark)]">
                  {shippingInfo.shippingCost === 0
                    ? 'Gratis'
                    : `Bs. ${shippingInfo.shippingCost.toFixed(2)}`}
                </span>
              </div>
              {shippingInfo.estimatedDays != null && (
                <p className="text-xs text-[var(--text-muted)] pl-5">
                  Tiempo estimado: {shippingInfo.estimatedDays} día{shippingInfo.estimatedDays !== 1 ? 's' : ''} hábil{shippingInfo.estimatedDays !== 1 ? 'es' : ''}
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
