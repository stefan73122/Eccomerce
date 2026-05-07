'use client';

import { Suspense, useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';
import { mapProduct } from '@/services/productService';
import api from '@/lib/axios';
import { SALES_CHANNEL_ID } from '@/lib/config';
import { useRegionStore } from '@/store/useRegionStore';
import { useMounted } from '@/lib/useMounted';
import { cn } from '@/lib/cn';
import {
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ── Backend types ──────────────────────────────────────────────────────────────

interface BCategory {
  id: number;
  name: string;
  slug: string;
  productCount?: number;
}

interface BRegion {
  id: number;
  name: string;
}

interface BPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name_asc', label: 'Nombre A–Z' },
];

// ── Pagination component ───────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  // Build visible page numbers with ellipsis
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex flex-col items-center gap-3 mt-8">
      {/* Info */}
      <p className="text-xs text-[var(--text-muted)]">
        Mostrando {from}–{to} de {totalItems} resultado{totalItems !== 1 ? 's' : ''}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-muted)]"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-[var(--text-muted)]">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                'w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors',
                p === page
                  ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                  : 'border-[var(--border)] text-[var(--text-dark)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
              )}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-muted)]"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

interface SearchSidebarProps {
  query: string;
  setQuery: (v: string) => void;
  showRegionList: boolean;
  setShowRegionList: Dispatch<SetStateAction<boolean>>;
  selectedRegionId: number | null;
  setSelectedRegionId: (v: number | null) => void;
  regions: BRegion[];
  showCategoryList: boolean;
  setShowCategoryList: Dispatch<SetStateAction<boolean>>;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (v: number | null) => void;
  selectedCategorySlug: string;
  setSelectedCategorySlug: (v: string) => void;
  categories: BCategory[];
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

function SearchSidebar({
  query, setQuery,
  showRegionList, setShowRegionList,
  selectedRegionId, setSelectedRegionId, regions,
  showCategoryList, setShowCategoryList,
  selectedCategoryId, setSelectedCategoryId,
  selectedCategorySlug, setSelectedCategorySlug,
  categories, totalItems,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  inStockOnly, setInStockOnly,
  hasActiveFilters, clearFilters,
}: SearchSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      {/* Search bar */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2.5">
          Búsqueda
        </p>
        <div className="flex items-center gap-2 border border-[var(--border)] rounded-lg px-3 h-10 bg-white focus-within:border-[var(--primary)] transition-colors">
          <Search size={15} className="text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="flex-1 text-sm bg-transparent outline-none text-[var(--text-dark)] placeholder:text-[var(--text-muted)]"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={14} className="text-[var(--text-muted)] hover:text-[var(--text-dark)]" />
            </button>
          )}
        </div>
      </div>

      {/* Region filter */}
      {regions.length > 0 && (
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
      )}

      {/* Categories */}
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
              onClick={() => { setSelectedCategoryId(null); setSelectedCategorySlug(''); }}
              className={cn(
                'flex items-center justify-between text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors',
                !selectedCategorySlug
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                  : 'text-[var(--text-muted)] hover:bg-gray-50 hover:text-[var(--text-dark)]',
              )}
            >
              <span>Todas las categorías</span>
              <span className="text-[11px] text-[var(--text-muted)] tabular-nums">{totalItems}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  if (selectedCategoryId === cat.id) {
                    setSelectedCategoryId(null);
                    setSelectedCategorySlug('');
                  } else {
                    setSelectedCategoryId(cat.id);
                    setSelectedCategorySlug(cat.slug);
                  }
                }}
                className={cn(
                  'flex items-center justify-between text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors',
                  selectedCategoryId === cat.id
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:bg-gray-50 hover:text-[var(--text-dark)]',
                )}
              >
                <span>{cat.name}</span>
                {cat.productCount != null && (
                  <span className="text-[11px] text-[var(--text-muted)] tabular-nums">{cat.productCount}</span>
                )}
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

      {/* In stock */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer group">
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

// ── Page shell ─────────────────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

// ── Main content ───────────────────────────────────────────────────────────────

function SearchContent() {
  const searchParams = useSearchParams();
  const mounted = useMounted();
  const selectedRegion = useRegionStore((s) => s.selectedRegion);

  // ── State ──────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showRegionList, setShowRegionList] = useState(true);
  const [showCategoryList, setShowCategoryList] = useState(true);

  const [regions, setRegions] = useState<BRegion[]>([]);
  const [categories, setCategories] = useState<BCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Pre-select user's region once mounted
  useEffect(() => {
    if (mounted && selectedRegion) {
      setSelectedRegionId(selectedRegion.id);
    }
  }, [mounted, selectedRegion]);

  // ── Debounce query ─────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  // ── Load regions & categories once ────────────────────────────────────────
  useEffect(() => {
    api.get<{ data: BRegion[] }>('/api/regions').then((r) => setRegions(r.data.data ?? [])).catch(() => {});
    api.get<{ data: BCategory[] }>('/api/categories').then((res) => setCategories(res.data.data ?? [])).catch(() => {});
  }, []);

  // ── Fetch page ─────────────────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (q: string, categoryId: number | null, regionId: number | null, pg: number) => {
      setLoading(true);
      try {
        const params: Record<string, unknown> = {
          page: pg,
          limit: PAGE_SIZE,
          salesChannelId: SALES_CHANNEL_ID,
        };
        if (q.trim()) params.q = q.trim();
        if (categoryId) params.categoryId = categoryId;
        if (regionId) params.regionId = regionId;

        const res = await api.get<{ data: unknown[]; pagination?: BPagination }>(
          '/api/products/search',
          { params },
        );
        const mapped = (res.data.data ?? []).map((p) => mapProduct(p as Parameters<typeof mapProduct>[0]));
        setProducts(mapped);
        setTotalPages(res.data.pagination?.totalPages ?? 1);
        setTotalItems(res.data.pagination?.totalItems ?? mapped.length);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Reset to page 1 when filters/query change
  useEffect(() => {
    if (!mounted) return;
    setPage(1);
    fetchPage(debouncedQuery, selectedCategoryId, selectedRegionId, 1);
  }, [mounted, debouncedQuery, selectedCategoryId, selectedRegionId, fetchPage]);

  // Fetch when page changes (without resetting page)
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchPage(debouncedQuery, selectedCategoryId, selectedRegionId, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Client-side filter + sort ─────────────────────────────────────────────
  const filtered = products
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

  const hasActiveFilters = !!(selectedRegionId || selectedCategorySlug || priceMin || priceMax || inStockOnly);

  const clearFilters = () => {
    setSelectedRegionId(null);
    setSelectedCategoryId(null);
    setSelectedCategorySlug('');
    setPriceMin('');
    setPriceMax('');
    setInStockOnly(false);
  };

  const selectedRegionName = regions.find((r) => r.id === selectedRegionId)?.name;

  const sidebarProps: SearchSidebarProps = {
    query, setQuery,
    showRegionList, setShowRegionList,
    selectedRegionId, setSelectedRegionId, regions,
    showCategoryList, setShowCategoryList,
    selectedCategoryId, setSelectedCategoryId,
    selectedCategorySlug, setSelectedCategorySlug,
    categories, totalItems,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    inStockOnly, setInStockOnly,
    hasActiveFilters, clearFilters,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Búsqueda' },
        ]}
      />

      <div className="px-4 sm:px-6 lg:px-20 py-6 lg:py-8">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <p className="text-sm text-[var(--text-muted)]">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin" /> Buscando...
              </span>
            ) : (
              `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}${debouncedQuery ? ` para "${debouncedQuery}"` : ''}`
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
              <span className="w-4 h-4 bg-[var(--primary)] text-white text-[10px] rounded-full flex items-center justify-center">
                !
              </span>
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
            <SearchSidebar {...sidebarProps} />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-[240px] flex-shrink-0 sticky top-24 self-start">
            <SearchSidebar {...sidebarProps} />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[var(--text-muted)] hidden lg:block">
                {loading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin" /> Buscando...
                  </span>
                ) : (
                  <>
                    <span className="font-medium text-[var(--text-dark)]">{totalItems}</span>
                    {` resultado${totalItems !== 1 ? 's' : ''}`}
                    {debouncedQuery && (
                      <span className="text-[var(--text-muted)]"> para &quot;{debouncedQuery}&quot;</span>
                    )}
                    {selectedRegionName && (
                      <span className="text-[var(--text-muted)]"> en {selectedRegionName}</span>
                    )}
                    {totalPages > 1 && (
                      <span className="text-[var(--text-muted)]"> · Página {page} de {totalPages}</span>
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
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
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
                {selectedCategorySlug && (
                  <FilterPill
                    label={categories.find((c) => c.slug === selectedCategorySlug)?.name ?? selectedCategorySlug}
                    onRemove={() => { setSelectedCategoryId(null); setSelectedCategorySlug(''); }}
                  />
                )}
                {priceMin && <FilterPill label={`Desde Bs. ${priceMin}`} onRemove={() => setPriceMin('')} />}
                {priceMax && <FilterPill label={`Hasta Bs. ${priceMax}`} onRemove={() => setPriceMax('')} />}
                {inStockOnly && <FilterPill label="Con stock" onRemove={() => setInStockOnly(false)} />}
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState query={debouncedQuery} hasFilters={hasActiveFilters} onClear={clearFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

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

function EmptyState({
  query,
  hasFilters,
  onClear,
}: {
  query: string;
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        {query ? (
          <Search size={28} className="text-gray-400" />
        ) : (
          <Package size={28} className="text-gray-400" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-[var(--text-dark)]">
        {query ? 'Sin resultados' : 'Empieza a buscar'}
      </h3>
      <p className="text-sm text-[var(--text-muted)] mt-2 max-w-sm mx-auto">
        {query
          ? `No encontramos productos para "${query}". Intenta con otro término o revisa los filtros.`
          : 'Escribe el nombre de un producto, marca o categoría para comenzar.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-4 text-sm text-[var(--primary)] hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
