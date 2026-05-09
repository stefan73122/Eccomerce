'use client';

import { cn } from '@/lib/cn';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-[var(--btn-primary)] text-white hover:bg-[var(--btn-hover)] transition-all',
  secondary: 'bg-[var(--bg-light)] text-[var(--text-dark)] hover:bg-[var(--bg-warm)]',
  outline: 'border border-[var(--border)] text-[var(--text-dark)] hover:bg-[var(--bg-light)]',
  ghost: 'text-[var(--text-muted)] hover:bg-[var(--bg-light)]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'font-medium transition-all',
        'rounded-[var(--btn-radius)]',
        `shadow-[var(--btn-shadow)]`,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
