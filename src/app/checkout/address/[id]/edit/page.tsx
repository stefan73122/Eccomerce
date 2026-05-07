'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/cn';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { regionService } from '@/services/regionService';
import { Region } from '@/types';
import LocationPicker from '@/components/ui/LocationPicker';

const labelOptions = ['Casa', 'Oficina', 'Otro'];

interface FieldError {
  fullAddressLine?: string;
  regionId?: string;
  recipientName?: string;
  phone?: string;
}

export default function EditAddressPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [label, setLabel] = useState('Casa');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [fullAddressLine, setFullAddressLine] = useState('');
  const [reference, setReference] = useState('');
  const [regionId, setRegionId] = useState<number | ''>('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});

  useEffect(() => {
    Promise.all([
      api.get<{ status: string; data: any }>(`/api/addresses/${id}`),
      regionService.getRegions(),
    ])
      .then(([addrRes, regList]) => {
        const addr = addrRes.data.data;
        setLabel(addr.label || 'Casa');
        setRecipientName(addr.recipientName || '');
        setPhone(addr.phone || '');
        setFullAddressLine(addr.fullAddressLine || '');
        setReference(addr.reference || '');
        setRegionId(addr.regionId || '');
        if (addr.latitude) setLatitude(Number(addr.latitude));
        if (addr.longitude) setLongitude(Number(addr.longitude));
        setRegions(regList);
      })
      .catch(() => router.replace('/checkout'))
      .finally(() => setLoadingData(false));
  }, [id]);

  function validate(): boolean {
    const next: FieldError = {};
    if (!fullAddressLine.trim()) next.fullAddressLine = 'La dirección completa es requerida.';
    if (!regionId) next.regionId = 'Selecciona una región.';
    if (!recipientName.trim()) next.recipientName = 'El nombre del destinatario es requerido.';
    if (!phone.trim()) next.phone = 'El teléfono es requerido.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.put(`/api/addresses/${id}`, {
        fullAddressLine: fullAddressLine.trim(),
        reference: reference.trim() || undefined,
        label,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        regionId: Number(regionId),
        latitude,
        longitude,
      });
      router.push('/checkout');
    } catch {
      setErrors({ fullAddressLine: 'Error al guardar los cambios. Intenta de nuevo.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Checkout', href: '/checkout' },
          { label: 'Editar dirección' },
        ]}
      />

      <div className="px-4 sm:px-6 lg:px-20 py-10 max-w-2xl mx-auto">
        <h1 className="text-[26px] font-bold text-[var(--text-dark)] mb-8">Editar dirección</h1>

        {/* Label selector */}
        <div className="flex gap-2 mb-8">
          {labelOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setLabel(opt)}
              className={cn(
                'px-5 py-2 rounded-full border text-sm font-medium transition',
                label === opt
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:border-gray-400',
              )}
            >
              {opt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Recipient + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">
                Nombre del destinatario <span className="text-red-500">*</span>
              </label>
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Juan Pérez"
                className={cn(
                  'w-full border rounded-lg px-3 h-11 text-sm outline-none focus:border-[var(--primary)] transition',
                  errors.recipientName ? 'border-red-400' : 'border-[var(--border)]',
                )}
              />
              {errors.recipientName && (
                <p className="text-xs text-red-500 mt-1">{errors.recipientName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+591 70000000"
                className={cn(
                  'w-full border rounded-lg px-3 h-11 text-sm outline-none focus:border-[var(--primary)] transition',
                  errors.phone ? 'border-red-400' : 'border-[var(--border)]',
                )}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">
              Región <span className="text-red-500">*</span>
            </label>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value ? Number(e.target.value) : '')}
              className={cn(
                'w-full border rounded-lg px-3 h-11 text-sm outline-none focus:border-[var(--primary)] transition bg-white',
                errors.regionId ? 'border-red-400' : 'border-[var(--border)]',
              )}
            >
              <option value="">Selecciona una región</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.regionId && <p className="text-xs text-red-500 mt-1">{errors.regionId}</p>}
          </div>

          {/* Full address */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">
              Dirección completa <span className="text-red-500">*</span>
            </label>
            <textarea
              value={fullAddressLine}
              onChange={(e) => setFullAddressLine(e.target.value)}
              placeholder="Av. Cristo Redentor #1234, entre Calle 5 y 6"
              rows={3}
              className={cn(
                'w-full border rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:border-[var(--primary)] transition',
                errors.fullAddressLine ? 'border-red-400' : 'border-[var(--border)]',
              )}
            />
            {errors.fullAddressLine && (
              <p className="text-xs text-red-500 mt-1">{errors.fullAddressLine}</p>
            )}
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">
              Referencias{' '}
              <span className="text-xs text-[var(--text-muted)] font-normal">(opcional)</span>
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Casa color amarilla con portón negro, frente a la farmacia"
              className="w-full border border-[var(--border)] rounded-lg px-3 h-11 text-sm outline-none focus:border-[var(--primary)] transition"
            />
          </div>

          {/* Map */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">
              Ubicación en el mapa{' '}
              <span className="text-xs text-[var(--text-muted)] font-normal">(opcional)</span>
            </label>
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-[var(--border)] text-[var(--text-dark)] px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
