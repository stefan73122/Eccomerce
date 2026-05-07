'use client';

import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useUIStore } from '@/store/useUIStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const typeStyles = {
  success: 'bg-[var(--success)] text-white',
  error: 'bg-[var(--error)] text-white',
  info: 'bg-[var(--primary)] text-white',
};

export default function Toast() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'rounded-lg shadow-lg px-4 py-3 flex items-center gap-2',
              typeStyles[toast.type]
            )}
          >
            <Icon size={18} />
            <span className="text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
