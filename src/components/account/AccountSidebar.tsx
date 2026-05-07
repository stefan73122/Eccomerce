'use client';

import { Heart, Package, MapPin, Settings, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { useMounted } from '@/lib/useMounted';

const navItems = [
  { label: 'Lista de deseos', icon: Heart, tab: 'wishlist' },
  { label: 'Mis pedidos', icon: Package, tab: 'orders' },
  { label: 'Direcciones', icon: MapPin, tab: 'addresses' },
  { label: 'Configuración', icon: Settings, tab: 'settings' },
];

interface AccountSidebarProps {
  activeTab: string;
}

export default function AccountSidebar({ activeTab }: AccountSidebarProps) {
  const mounted = useMounted();
  const user = useUserStore((s) => s.user);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const logout = useUserStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const displayName = mounted && user ? user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'Guest';
  const displayEmail = mounted && user ? user.email : '';

  return (
    <div className="w-[240px] flex-shrink-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-dark)]">{displayName}</p>
          <p className="text-xs text-[var(--text-muted)]">{displayEmail}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.tab}
            href={`/account?tab=${item.tab}`}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition',
              activeTab === item.tab
                ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                : 'text-[var(--text-muted)] hover:bg-gray-50'
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}

        {mounted && isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition mt-2"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        )}

        {mounted && !isLoggedIn && (
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[var(--primary)] hover:bg-[var(--primary)]/5 transition mt-2"
          >
            <User size={18} />
            Iniciar sesión
          </Link>
        )}
      </nav>
    </div>
  );
}
