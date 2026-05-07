'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Store, Package, Search, X, ChevronDown, ChevronUp, Loader2, SlidersHorizontal } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SellerProductCard from '@/components/product/SellerProductCard';
import { getSellerProducts } from '@/services/sellerProductService';
import { useRegionStore } from '@/store/useRegionStore';
import type { Product } from '@/types';
import { cn } from '@/lib/cn';

const PAGE_SIZE = 24;

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-[#EAEAEA] bg-[#F9F9F9] overflow-hidden animate-pulse">
      <div className="h-[180px] bg-gray-200" />
      <div className="p-[14px] space-y-2.5">
        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-7 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
        <X size={11} />
      </button>
    </span>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedRegion = useRegionStore((s) => s.selectedRegion);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sellerId, setSellerId] = useState<number | undefined>(undefined);
  const [sellerStoreName, setSellerStoreName] = useState<string | undefined>(undefined);

  const regionId = selectedRegion?.id;

  useEffect(() => {
    const sellerParam = searchParams.get('seller');
    if (sellerParam) {
      setSellerId(parseInt(sellerParam, 10));
    } else {
      setSellerId(undefined);
      setSellerStoreName(undefined);
    }
  }, [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSellerProducts(page, PAGE_SIZE, search || undefined, regionId, sellerId);
      setProducts(result.products);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      
      if (sellerId && result.products.length > 0 && !sellerStoreName) {
        setSellerStoreName(result.products[0].sellerStoreName);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, regionId, sellerId, sellerStoreName]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setPriceMin('');
    setPriceMax('');
    setInStockOnly(false);
    setSellerId(undefined);
    setSellerStoreName(undefined);
    setPage(1);
    router.push('/marketplace');
  };

  const removeSeller = () => {
    setSellerId(undefined);
    setSellerStoreName(undefined);
    setPage(1);
    router.push('/marketplace');
  };

  const hasActiveFilters = !!search || !!priceMin || !!priceMax || inStockOnly || !!sellerId;

  const filtered = products.filter((p) => {
    if (inStockOnly && !p.inStock) return false;
    if (priceMin && p.price < parseFloat(priceMin)) return false;
    if (priceMax && p.price > parseFloat(priceMax)) return false;
    return true;
  });

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Marketplace' },
        ]}
      />

      <div className="px-4 sm:px-6 lg:px-20 py-8 lg:py-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold tracking-[3px] text-[var(--primary)]">
            VENDEDORES INDEPENDIENTES
          </span>
          <h1 className="text-[32px] font-bold text-[var(--text-dark)] mt-2">
            Marketplace
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Descubre productos únicos de vendedores locales
          </p>
          {total > 0 && !loading && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-xs text-[var(--text-muted)]">
                {total} producto{total !== 1 ? 's' : ''} disponible{total !== 1 ? 's' : ''}
              </span>
              {selectedRegion && (
                <>
                  <span className="text-xs text-[var(--text-muted)]">·</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)]">
                    <Store size={12} />
                    {selectedRegion.name}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                placeholder="Buscar productos en el marketplace..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 h-11 border border-[var(--border)] rounded-lg text-sm outline-none focus:border-[var(--primary)] transition-colors bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 h-11 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--text-muted)]">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin" /> Cargando...
              </span>
            ) : (
              `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`
            )}
          </p>
          <button
            onClick={() => setShowMobileFilters((v) => !v)}
            className={cn(
              'flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors',
              hasActiveFilters
                ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5'
                : 'border-[var(--border)] text-[var(--text-dark)]',
            )}
          >
            <SlidersHorizontal size={15} />
            Filtros
            {hasActiveFilters && (
              <span className="w-4 h-4 bg-[var(--primary)] text-white text-[10px] rounded-full flex items-center justify-center">!</span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showMobileFilters && (
          <div className="mb-6 p-5 bg-white border border-[var(--border-light)] rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[var(--text-dark)]">Filtros</p>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={16} className="text-[var(--text-muted)]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2.5">
                  Precio
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Mín."
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full border border-[var(--border)] rounded-lg px-3 h-9 text-sm outline-none focus:border-[var(--primary)] transition-colors"
                  />
                  <span className="text-[var(--text-muted)] shrink-0">—</span>
                  <input
                    type="number"
                    placeholder="Máx."
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full border border-[var(--border)] rounded-lg px-3 h-9 text-sm outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setInStockOnly((v) => !v)}
                    className={cn(
                      'w-10 h-5 rounded-full relative transition-colors',
                      inStockOnly ? 'bg-[var(--primary)]' : 'bg-gray-200',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                        inStockOnly ? 'translate-x-5' : 'translate-x-0.5',
                      )}
                    />
                  </div>
                  <span className="text-sm text-[var(--text-dark)] select-none">Solo con stock</span>
                </label>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-[var(--error)] hover:opacity-80 transition-opacity w-full justify-center pt-2"
                >
                  <X size={14} />
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {sellerId && sellerStoreName && <FilterPill label={`Tienda: ${sellerStoreName}`} onRemove={removeSeller} />}
            {search && <FilterPill label={`Búsqueda: "${search}"`} onRemove={() => { setSearch(''); setSearchInput(''); }} />}
            {priceMin && <FilterPill label={`Desde Bs. ${priceMin}`} onRemove={() => setPriceMin('')} />}
            {priceMax && <FilterPill label={`Hasta Bs. ${priceMax}`} onRemove={() => setPriceMax('')} />}
            {inStockOnly && <FilterPill label="Con stock" onRemove={() => setInStockOnly(false)} />}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-dark)]">
              {search ? 'Sin resultados' : 'El marketplace está vacío'}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm mx-auto">
              {search
                ? `No encontramos productos para "${search}"`
                : 'Pronto habrá productos disponibles de nuestros vendedores'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-[var(--primary)] hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <SellerProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium disabled:opacity-40 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-[var(--text-muted)] px-2">
                  Página {page} de {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium disabled:opacity-40 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
