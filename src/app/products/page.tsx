'use client';

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { useRegionStore } from '@/store/useRegionStore';
import { mapProduct } from '@/services/productService';
import { Product } from '@/types';
import { useMounted } from '@/lib/useMounted';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumb from '@/components/layout/Breadcrumb';
import api from '@/lib/axios';
import { SALES_CHANNEL_ID } from '@/lib/config';
import { cn } from '@/lib/cn';
import {
  Loader2,
  SlidersHorizontal,
  X,
  MapPin,
  ChevronDown,
  ChevronUp,
  Package,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────

interface BCategory {
  id: number;
  name: string;
  slug: string;
}

interface BPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface BRegion {
  id: number;
  name: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name_asc', label: 'Nombre A–Z' },
];

// ── Sidebar (top-level to avoid remount on re-render) ────────────────────────

interface SidebarProps {
  selectedRegionId: number | null;
  setSelectedRegionId: (v: number | null) => void;
  regions: BRegion[];
  showRegionList: boolean;
  setShowRegionList: Dispatch<SetStateAction<boolean>>;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (v: number | null) => void;
  categories: BCategory[];
  showCategoryList: boolean;
  setShowCategoryList: Dispatch<SetStateAction<boolean>>;
  totalItems: number;
  priceMin: string;
  setPriceMin: (v: string) => void;
  priceMax: string;
  setPriceMax: (v: string) => void;
  inStockOnly: boolean;
  setInStockOnly: Dispatch<SetStateAction<boolean>>;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

function ProductsSidebar({
  selectedRegionId, setSelectedRegionId,
  regions, showRegionList, setShowRegionList,
  selectedCategoryId, setSelectedCategoryId,
  categories, showCategoryList, setShowCategoryList,
  totalItems,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  inStockOnly, setInStockOnly,
  hasActiveFilters, clearFilters,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      {/* Region filter */}
      <div>
        <button
          onClick={() => setShowRegionList((v) => !v)}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2.5"
        >
          <span>Región</span>
          {showRegionList ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showRegionList && (
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setSelectedRegionId(null)}
              className={cn(
                'flex items-center justify-between text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors',
                selectedRegionId === null
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                  : 'text-[var(--text-muted)] hover:bg-gray-50 hover:text-[var(--text-dark)]',
              )}
            >
              <span>Todas las regiones</span>
              {selectedRegionId === null && (
                <span className="text-[11px] text-[var(--text-muted)] tabular-nums">{totalItems}</span>
              )}
            </button>
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegionId(selectedRegionId === r.id ? null : r.id)}
                className={cn(
                  'flex items-center gap-1.5 text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors',
                  selectedRegionId === r.id
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:bg-gray-50 hover:text-[var(--text-dark)]',
                )}
              >
                <MapPin size={11} className="shrink-0" />
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category filter */}
      <div>
        <button
          onClick={() => setShowCategoryList((v) => !v)}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2.5"
        >
          <span>Categorías</span>
          {showCategoryList ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showCategoryList && (
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={cn(
                'flex items-center justify-between text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors',
                selectedCategoryId === null
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                  : 'text-[var(--text-muted)] hover:bg-gray-50 hover:text-[var(--text-dark)]',
              )}
            >
              <span>Todas las categorías</span>
              {selectedCategoryId === null && (
                <span className="text-[11px] text-[var(--text-muted)] tabular-nums">{totalItems}</span>
              )}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
                className={cn(
                  'text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors',
                  selectedCategoryId === cat.id
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:bg-gray-50 hover:text-[var(--text-dark)]',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price range */}
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

      {/* In stock toggle */}
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

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-sm text-[var(--error)] hover:opacity-80 transition-opacity"
        >
          <X size={14} />
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}

// ── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-[#EAEAEA] bg-[#F9F9F9] overflow-hidden animate-pulse">
      <div className="h-[180px] bg-gray-200" />
      <div className="p-[14px] space-y-2.5">
        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-7 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

// ── Filter pill ──────────────────────────────────────────────────────────────

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

// ── Main page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const mounted = useMounted();
  const selectedRegion = useRegionStore((s) => s.selectedRegion);

  // Filters
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showRegionList, setShowRegionList] = useState(true);
  const [showCategoryList, setShowCategoryList] = useState(true);

  // Data
  const [regions, setRegions] = useState<BRegion[]>([]);
  const [categories, setCategories] = useState<BCategory[]>([]);
  const [allLoaded, setAllLoaded] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Pre-select the user's region once mounted
  useEffect(() => {
    if (mounted && selectedRegion) {
      setSelectedRegionId(selectedRegion.id);
    }
  }, [mounted, selectedRegion]);

  // Load regions & categories once
  useEffect(() => {
    api.get<{ data: BRegion[] }>('/api/regions').then((r) => setRegions(r.data.data ?? [])).catch(() => {});
    api.get<{ data: BCategory[] }>('/api/categories').then((r) => setCategories(r.data.data ?? [])).catch(() => {});
  }, []);

  // Fetch products
  const fetchProducts = useCallback(
    async (categoryId: number | null, regionId: number | null, pg: number, reset: boolean) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      try {
        const params: Record<string, unknown> = {
          page: pg,
          limit: PAGE_SIZE,
          salesChannelId: SALES_CHANNEL_ID,
        };
        if (categoryId) params.categoryId = categoryId;
        if (regionId) params.regionId = regionId;

        const res = await api.get<{ data: unknown[]; pagination?: BPagination }>(
          '/api/products/search',
          { params },
        );
        const mapped = (res.data.data ?? []).map((p) => mapProduct(p as Parameters<typeof mapProduct>[0]));
        setAllLoaded((prev) => (reset ? mapped : [...prev, ...mapped]));
        setTotalPages(res.data.pagination?.totalPages ?? 1);
        setTotalItems(res.data.pagination?.totalItems ?? mapped.length);
      } catch {
        if (reset) setAllLoaded([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!mounted) return;
    setPage(1);
    fetchProducts(selectedCategoryId, selectedRegionId, 1, true);
  }, [mounted, selectedCategoryId, selectedRegionId, fetchProducts]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchProducts(selectedCategoryId, selectedRegionId, next, false);
  };

  // Client-side filter + sort
  const filtered = allLoaded
    .filter((p) => {
      if (priceMin && p.price < Number(priceMin)) return false;
      if (priceMax && p.price > Number(priceMax)) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

  const hasActiveFilters = !!(selectedRegionId || selectedCategoryId || priceMin || priceMax || inStockOnly);

  const clearFilters = () => {
    setSelectedRegionId(null);
    setSelectedCategoryId(null);
    setPriceMin('');
    setPriceMax('');
    setInStockOnly(false);
  };

  const selectedRegionName = regions.find((r) => r.id === selectedRegionId)?.name;
  const selectedCategoryName = categories.find((c) => c.id === selectedCategoryId)?.name;

  const sidebarProps: SidebarProps = {
    selectedRegionId, setSelectedRegionId,
    regions, showRegionList, setShowRegionList,
    selectedCategoryId, setSelectedCategoryId,
    categories, showCategoryList, setShowCategoryList,
    totalItems,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    inStockOnly, setInStockOnly,
    hasActiveFilters,
    clearFilters,
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Productos' }]} />

      <div className="px-4 sm:px-6 lg:px-20 py-6 lg:py-8">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
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

        {/* Mobile sidebar drawer */}
        {showMobileFilters && (
          <div className="lg:hidden mb-4 bg-white rounded-xl border border-[var(--border-light)] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[var(--text-dark)]">Filtros</p>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={16} className="text-[var(--text-muted)]" />
              </button>
            </div>
            <ProductsSidebar {...sidebarProps} />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-[240px] flex-shrink-0 sticky top-24 self-start">
            <ProductsSidebar {...sidebarProps} />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[var(--text-muted)] hidden lg:block">
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin" /> Cargando...
                  </span>
                ) : (
                  <>
                    <span className="font-medium text-[var(--text-dark)]">{filtered.length}</span>
                    {` producto${filtered.length !== 1 ? 's' : ''}`}
                    {selectedRegionName && (
                      <span className="text-[var(--text-muted)]"> en {selectedRegionName}</span>
                    )}
                    {allLoaded.length < totalItems && (
                      <span className="text-[var(--text-muted)]"> (mostrando {allLoaded.length} de {totalItems})</span>
                    )}
                  </>
                )}
              </p>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-[var(--text-muted)] hidden sm:block">Ordenar por</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-[var(--border)] rounded-lg px-3 h-9 text-sm outline-none bg-white cursor-pointer focus:border-[var(--primary)] transition-colors"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedRegionName && (
                  <FilterPill label={selectedRegionName} onRemove={() => setSelectedRegionId(null)} />
                )}
                {selectedCategoryName && (
                  <FilterPill label={selectedCategoryName} onRemove={() => setSelectedCategoryId(null)} />
                )}
                {priceMin && <FilterPill label={`Desde Bs. ${priceMin}`} onRemove={() => setPriceMin('')} />}
                {priceMax && <FilterPill label={`Hasta Bs. ${priceMax}`} onRemove={() => setPriceMax('')} />}
                {inStockOnly && <FilterPill label="Con stock" onRemove={() => setInStockOnly(false)} />}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {page < totalPages && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 border border-[var(--border)] text-sm text-[var(--text-dark)] px-6 py-2.5 rounded-lg hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <><Loader2 size={14} className="animate-spin" />Cargando...</>
                      ) : (
                        `Cargar más (${totalItems - allLoaded.length} restantes)`
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Package size={28} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-dark)]">Sin productos</h3>
                <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm mx-auto">
                  {hasActiveFilters
                    ? 'No encontramos productos con los filtros seleccionados.'
                    : 'No hay productos disponibles.'}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-4 text-sm text-[var(--primary)] hover:underline">
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
