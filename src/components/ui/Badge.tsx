import { cn } from '@/lib/cn';

interface BadgeProps {
  variant: 'hot' | 'new' | 'sale' | 'limited' | 'bestseller' | 'stock';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  hot: 'bg-[var(--error)] text-white',
  new: 'bg-[var(--primary)] text-white',
  sale: 'bg-[var(--error)] text-white',
  limited: 'bg-[var(--warning)] text-white',
  bestseller: 'bg-[var(--primary)] text-white',
  stock: 'bg-[var(--success)]/10 text-[var(--success)]',
};

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
