'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import { categories } from '@/data/categories';

interface FilterState {
  categories: string[];
  priceMin: string;
  priceMax: string;
  inStockOnly: boolean;
  minRating: number | null;
}

interface SearchFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceMin: '',
    priceMax: '',
    inStockOnly: false,
    minRating: null,
  });

  const handleCategoryToggle = (slug: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(slug)
        ? prev.categories.filter((c) => c !== slug)
        : [...prev.categories, slug],
    }));
  };

  const handleApply = () => {
    onFilterChange?.(filters);
  };

  const handleClear = () => {
    const cleared: FilterState = {
      categories: [],
      priceMin: '',
      priceMax: '',
      inStockOnly: false,
      minRating: null,
    };
    setFilters(cleared);
    onFilterChange?.(cleared);
  };

  return (
    <div className="w-[260px] flex flex-col gap-5">
      {/* Categories */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-dark)]">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category.slug)}
                onChange={() => handleCategoryToggle(category.slug)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] accent-[var(--primary)]"
              />
              <span className="text-sm text-[var(--text-muted)]">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-dark)]">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: e.target.value }))}
            className="w-full h-9 px-3 text-sm border border-[var(--border)] rounded-lg outline-none bg-white focus:border-[var(--primary)]"
          />
          <span className="text-[var(--text-muted)] text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: e.target.value }))}
            className="w-full h-9 px-3 text-sm border border-[var(--border)] rounded-lg outline-none bg-white focus:border-[var(--primary)]"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-dark)]">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
            className={cn(
              'w-10 h-[22px] rounded-full transition-colors relative',
              filters.inStockOnly ? 'bg-[var(--primary)]' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform',
                filters.inStockOnly ? 'translate-x-[20px]' : 'translate-x-0.5'
              )}
            />
          </button>
          <span className="text-sm text-[var(--text-muted)]">In Stock Only</span>
        </label>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-dark)]">Rating</h3>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: prev.minRating === rating ? null : rating,
                }))
              }
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded text-sm transition-colors',
                filters.minRating === rating
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'text-[var(--text-muted)] hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={handleApply}
          className="w-full h-10 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="w-full h-10 text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text-dark)] transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
