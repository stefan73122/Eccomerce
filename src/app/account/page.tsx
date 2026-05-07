'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import AccountSidebar from '@/components/account/AccountSidebar';
import WishlistGrid from '@/components/account/WishlistGrid';
import OrderList from '@/components/account/OrderList';
import { useUserStore } from '@/store/useUserStore';
import { MapPin, Trash2, Pencil, Plus, Loader2, Star } from 'lucide-react';
import { useMounted } from '@/lib/useMounted';
import Link from 'next/link';
import api from '@/lib/axios';

interface BackendAddress {
  id: number;
  fullAddressLine: string;
  reference?: string | null;
  label?: string | null;
  recipientName?: string | null;
  phone?: string | null;
  regionId: number;
  isDefault: boolean;
  region?: { id: number; name: string };
}

function AddressesTab() {
  const user = useUserStore((s) => s.user);
  const [addresses, setAddresses] = useState<BackendAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);

  const fetchAddresses = () => {
    const customerId = user?.customerId;
    const params = customerId ? `?userId=${customerId}` : '';
    api
      .get<{ status: string; data: BackendAddress[] }>(`/api/addresses${params}`)
      .then((res) => setAddresses(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.customerId]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta dirección?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addr: BackendAddress) => {
    if (addr.isDefault) return;
    setSettingDefaultId(addr.id);
    try {
      await api.put(`/api/addresses/${addr.id}/default`);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === addr.id })),
      );
    } catch {
      // silent
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-dark)]">Mis direcciones</h2>
        <Link
          href="/checkout/address/new"
          className="flex items-center gap-2 text-sm font-medium text-[var(--primary)] border border-[var(--primary)] rounded-lg px-4 py-2 hover:bg-[var(--primary)]/5 transition"
        >
          <Plus size={15} /> Nueva dirección
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <MapPin size={40} className="text-gray-300" />
          <p className="text-[var(--text-muted)] text-sm">No tienes direcciones guardadas.</p>
          <Link
            href="/checkout/address/new"
            className="text-sm font-medium text-[var(--primary)] hover:underline"
          >
            Agregar una dirección
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`flex items-start justify-between p-4 bg-white rounded-xl border transition ${
                addr.isDefault ? 'border-amber-300 bg-amber-50/30' : 'border-[var(--border-light)]'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <MapPin size={18} className="text-[var(--primary)] mt-0.5 shrink-0" />
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
              </div>

              <div className="flex items-center gap-1 ml-2 shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    disabled={settingDefaultId === addr.id}
                    className="p-2 rounded-lg hover:bg-amber-50 transition text-gray-300 hover:text-amber-500 disabled:opacity-50"
                    title="Establecer como predeterminada"
                  >
                    {settingDefaultId === addr.id
                      ? <Loader2 size={15} className="animate-spin" />
                      : <Star size={15} />}
                  </button>
                )}
                <Link
                  href={`/checkout/address/${addr.id}/edit`}
                  className="p-2 rounded-lg hover:bg-gray-100 transition text-[var(--text-muted)] hover:text-[var(--primary)]"
                  title="Editar"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={deletingId === addr.id}
                  className="p-2 rounded-lg hover:bg-red-50 transition text-[var(--text-muted)] hover:text-red-500 disabled:opacity-50"
                  title="Eliminar"
                >
                  {deletingId === addr.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'wishlist';
  const mounted = useMounted();
  const user = useUserStore((s) => s.user);

  const displayName = mounted && user ? user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '' : '';
  const displayEmail = mounted && user ? user.email : '';
  const displayPhone = mounted && user ? user.phone || '' : '';

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Mi cuenta' }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-6 lg:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <AccountSidebar activeTab={tab} />

        <div className="flex-1">
          {tab === 'wishlist' && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-6">Mi lista de deseos</h2>
              <WishlistGrid />
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-6">Mis pedidos</h2>
              <OrderList />
            </div>
          )}

          {tab === 'addresses' && <AddressesTab />}

          {tab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-dark)] mb-6">Configuración de cuenta</h2>
              <div className="bg-white rounded-xl border border-[var(--border-light)] p-6 space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Nombre completo</label>
                  <input defaultValue={displayName} className="w-full border border-[var(--border)] rounded-lg px-3 h-11 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Correo electrónico</label>
                  <input defaultValue={displayEmail} className="w-full border border-[var(--border)] rounded-lg px-3 h-11 text-sm outline-none" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Teléfono</label>
                  <input defaultValue={displayPhone} className="w-full border border-[var(--border)] rounded-lg px-3 h-11 text-sm outline-none" />
                </div>
                <button className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
                  Guardar cambios
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="px-4 sm:px-6 lg:px-20 py-10">Cargando...</div>}>
      <AccountContent />
    </Suspense>
  );
}
