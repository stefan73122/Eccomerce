'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  eyebrow?: string;
}

export default function SectionHeader({ title, subtitle, viewAllHref, viewAllLabel = 'Ver todos', eyebrow }: Props) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div className="flex flex-col gap-1.5 min-w-0">
        {eyebrow && (
          <span className="text-[11px] font-semibold tracking-[3px] uppercase text-[var(--primary)]">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl lg:text-[28px] font-semibold text-[var(--text-dark)] leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="shrink-0 hidden sm:inline-flex items-center gap-2 border border-[var(--border)] rounded-lg px-5 py-2 text-sm font-medium text-[var(--text-dark)] hover:bg-gray-50 transition whitespace-nowrap"
        >
          {viewAllLabel} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
