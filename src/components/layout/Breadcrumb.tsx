import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-[8px] px-4 sm:px-6 lg:px-20 py-[10px]"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-[8px]">
            {index > 0 && (
              <ChevronRight className="text-[#BBBBBB]" size={14} />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={cn(
                  'text-[13px] text-[var(--primary)] transition-colors hover:underline'
                )}
                style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-[13px] text-[var(--text-placeholder)]"
                style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
