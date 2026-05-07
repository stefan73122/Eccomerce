'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  ChevronDown,
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  Paintbrush2,
  AlignJustify,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { NAV_LINKS } from '@/data/constants';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useRegionStore } from '@/store/useRegionStore';
import { useMounted } from '@/lib/useMounted';
import { useTheme } from '@/lib/theme/ThemeContext';

export default function Header() {
  const router = useRouter();
  const mounted = useMounted();
  const openRegionModal = useUIStore((s) => s.openRegionModal);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const openThemeEditor = useUIStore((s) => s.openThemeEditor);
  const itemCount = useCartStore((s) => s.getItemCount());
  const selectedRegion = useRegionStore((s) => s.selectedRegion);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const { topBar, navbar, categoryBar, announcementBar, branding } = theme;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className={cn('w-full z-40', navbar.sticky ? 'sticky top-0' : 'relative')}>

      {/* ── Row 1: Top utility bar ── */}
      {topBar.visible && (
        <div style={{ backgroundColor: topBar.backgroundColor }}>
          <div
            className="flex items-center justify-between h-8 px-4 sm:px-6 lg:px-20"
            style={{ color: topBar.textColor }}
          >
            <div className="flex items-center gap-5">
              {topBar.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="hidden sm:flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
                >
                  {i === 0 && <Phone size={10} />}
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              onClick={openRegionModal}
              className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
            >
              <MapPin size={10} />
              {mounted ? (selectedRegion?.name ?? 'Seleccionar región') : 'Seleccionar región'}
              <ChevronDown size={10} />
            </button>
          </div>
        </div>
      )}

      {/* ── Row 2: Main header — logo + search + icons ── */}
      <div style={{ backgroundColor: navbar.backgroundColor }} className="border-b border-[var(--border)]">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {branding.logoUrl ? (
              <Image
                src={branding.logoUrl}
                alt={branding.storeName}
                width={130}
                height={40}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            ) : (
              <>
                <ShoppingBag style={{ color: navbar.activeColor }} size={26} strokeWidth={2} />
                <span className="text-base font-bold tracking-[3px] hidden sm:block" style={{ color: navbar.textColor }}>
                  {branding.storeName}
                </span>
              </>
            )}
          </Link>

          {/* Search bar */}
          {navbar.showSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto hidden sm:flex">
              <div className="flex w-full rounded-lg overflow-hidden border-2" style={{ borderColor: navbar.activeColor }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="flex-1 h-10 px-4 text-sm outline-none bg-white text-gray-800 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="h-10 w-12 flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: navbar.activeColor }}
                >
                  <Search size={17} />
                </button>
              </div>
            </form>
          )}

          {/* Right icons */}
          <div className="flex items-center gap-4 shrink-0 ml-auto sm:ml-0">
            <Link
              href="/account"
              className="hidden sm:flex flex-col items-center gap-0.5 text-xs transition-opacity hover:opacity-70"
              style={{ color: navbar.textColor }}
            >
              <User size={20} />
              <span className="hidden lg:block text-[10px]">Iniciar sesión</span>
            </Link>

            <button
              onClick={openCartDrawer}
              className="relative flex flex-col items-center gap-0.5"
              aria-label="Carrito"
            >
              <ShoppingCart size={22} style={{ color: navbar.activeColor }} />
              {mounted && itemCount > 0 && (
                <span
                  className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                  style={{ backgroundColor: navbar.activeColor }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={openThemeEditor}
              className="hidden md:flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              style={{ borderColor: navbar.activeColor, color: navbar.activeColor }}
            >
              <Paintbrush2 size={11} />
              Personalizar
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden"
              style={{ color: navbar.textColor }}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 3: Category bar ── */}
      {categoryBar.visible && (
        <div style={{ backgroundColor: categoryBar.backgroundColor }}>
          <div className="hidden lg:flex items-center h-10 px-4 sm:px-6 lg:px-20 gap-0">

            {/* Categorías button */}
            <Link
              href="/products"
              className="flex items-center gap-2 px-4 h-full text-sm font-semibold shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: categoryBar.buttonColor, color: '#FFFFFF' }}
            >
              <AlignJustify size={15} />
              {categoryBar.buttonLabel}
              <ChevronDown size={13} />
            </Link>

            <div className="w-px h-4 mx-3 opacity-20 bg-white" />

            {/* Nav links */}
            {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 h-full flex items-center text-sm font-medium transition-opacity hover:opacity-75 whitespace-nowrap"
                style={{ color: categoryBar.textColor }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Row 4: Announcement bar ── */}
      {announcementBar.visible && (
        <div
          className="w-full h-8 flex items-center justify-center text-xs font-semibold tracking-wide text-center"
          style={{ backgroundColor: announcementBar.backgroundColor, color: announcementBar.textColor }}
        >
          {announcementBar.text}
        </div>
      )}

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: navbar.backgroundColor }} className="sm:hidden border-t border-[var(--border)] px-4 py-3 space-y-1">
          <form onSubmit={handleSearch} className="flex mb-3 rounded-lg overflow-hidden border-2" style={{ borderColor: navbar.activeColor }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 h-9 px-3 text-sm outline-none"
            />
            <button type="submit" className="w-10 flex items-center justify-center text-white" style={{ backgroundColor: navbar.activeColor }}>
              <Search size={15} />
            </button>
          </form>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: navbar.textColor }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
