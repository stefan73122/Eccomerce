'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({ onSearch, defaultValue = '', className }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-center border border-[var(--border)] rounded-lg bg-white h-11 px-3', className)}>
      <Search size={18} className="text-[var(--text-placeholder)] mr-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="flex-1 outline-none text-sm bg-transparent text-[var(--text-dark)] placeholder:text-[var(--text-placeholder)]"
      />
      {value && (
        <button type="button" onClick={() => { setValue(''); onSearch?.(''); }} className="text-[var(--text-placeholder)] hover:text-[var(--text-dark)]">
          <X size={16} />
        </button>
      )}
    </form>
  );
}
