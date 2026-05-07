import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Store } from '@/types';

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  const regionName = store.region?.name || 'N/A';

  return (
    <Link href={`/stores/${store.id}`} className="block">
      <div className="rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-md transition-shadow">
        {/* Image area */}
        <div className="h-[160px] bg-[var(--bg-input)] flex items-center justify-center relative">
          <MapPin size={40} className="text-[#CCC]" />
          {!store.isActive && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded">
              Inactive
            </div>
          )}
        </div>

        {/* Info area */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-base font-semibold text-[var(--text-dark)] line-clamp-2">
            {store.name}
          </h3>

          <span className="inline-flex self-start bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2 py-0.5 rounded">
            {regionName}
          </span>

          {store.address && (
            <p className="text-[13px] text-[var(--text-muted)] flex items-start gap-1.5 line-clamp-2">
              <MapPin size={14} className="shrink-0 mt-0.5" />
              <span>{store.address}</span>
            </p>
          )}

          {store.phone && (
            <p className="text-[13px] text-[var(--text-muted)] flex items-center gap-1.5">
              <Phone size={14} className="shrink-0" />
              {store.phone}
            </p>
          )}

          {store.hours && (
            <p className="text-xs text-[var(--text-light)] flex items-center gap-1.5">
              <Clock size={12} className="shrink-0" />
              {store.hours}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
