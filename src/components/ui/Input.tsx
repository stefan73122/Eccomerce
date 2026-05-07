'use client';

import { cn } from '@/lib/cn';
import * as LucideIcons from 'lucide-react';
import { type LucideProps } from 'lucide-react';
import { type ComponentType } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: string;
  error?: string;
  className?: string;
}

function getIcon(name: string): ComponentType<LucideProps> | null {
  const icons = LucideIcons as Record<string, unknown>;
  return (icons[name] as ComponentType<LucideProps>) ?? null;
}

export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  icon,
  error,
  className,
}: InputProps) {
  const Icon = icon ? getIcon(icon) : null;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-[var(--text-dark)]">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center border rounded-lg bg-white px-3 h-11',
          error ? 'border-[var(--error)]' : 'border-[var(--border)]'
        )}
      >
        {Icon && <Icon size={18} className="text-[var(--text-placeholder)] mr-2" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm placeholder:text-[var(--text-placeholder)] bg-transparent"
        />
      </div>
      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
