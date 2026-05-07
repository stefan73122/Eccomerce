'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { useMounted } from '@/lib/useMounted';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mounted = useMounted();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.replace('/login');
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
