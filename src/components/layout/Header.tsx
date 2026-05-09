'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ShoppingBag, MapPin, ChevronDown, Search, User,
  ShoppingCart, Menu, X, Paintbrush2, AlignJustify, Phone,
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
  const openRegionModal  = useUIStore((s) => s.openRegionModal);
  const openCartDrawer   = useUIStore((s) => s.openCartDrawer);
  const openThemeEditor  = useUIStore((s) => s.openThemeEditor);
  const itemCount        = useCartStore((s) => s.getItemCount());
  const selectedRegion   = useRegionStore((s) => s.selectedRegion);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [query,    setQuery]      = useState('');
  const { theme } = useTheme();
  const { topBar, navbar, categoryBar, announcementBar, branding } = theme;
  const variant = navbar.variant || 'classic';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // ── Atoms ────────────────────────────────────────────────────────────────────

  const Logo = (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      {branding.logoUrl ? (
        <Image src={branding.logoUrl} alt={branding.storeName} width={130} height={40}
          className="h-10 w-auto object-contain" unoptimized />
      ) : (
        <>
          <ShoppingBag style={{ color: navbar.activeColor }} size={26} strokeWidth={2} />
          <span className="text-base font-bold tracking-[3px] hidden sm:block" style={{ color: navbar.textColor }}>
            {branding.storeName}
          </span>
        </>
      )}
    </Link>
  );

  const SearchBar = ({ className = '', pill = false }: { className?: string; pill?: boolean }) => (
    <form onSubmit={handleSearch} className={cn('flex', className)}>
      <div className={cn('flex w-full overflow-hidden border-2', pill ? 'rounded-full' : 'rounded-lg')}
        style={{ borderColor: navbar.activeColor }}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="flex-1 h-10 px-4 text-sm outline-none bg-white text-gray-800 placeholder:text-gray-400" />
        <button type="submit" className="h-10 w-12 flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: navbar.activeColor }}>
          <Search size={17} />
        </button>
      </div>
    </form>
  );

  const CartBtn = (
    <button onClick={openCartDrawer} className="relative flex flex-col items-center gap-0.5" aria-label="Carrito">
      <ShoppingCart size={22} style={{ color: navbar.activeColor }} />
      {mounted && itemCount > 0 && (
        <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
          style={{ backgroundColor: navbar.activeColor }}>
          {itemCount}
        </span>
      )}
    </button>
  );

  const CustomizeBtn = ({ light = false }: { light?: boolean }) => (
    <button onClick={openThemeEditor}
      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors"
      style={light
        ? { borderColor: 'rgba(255,255,255,0.4)', color: '#fff', borderRadius: navbar.borderRadius || '9999px' }
        : { borderColor: navbar.activeColor, color: navbar.activeColor, borderRadius: navbar.borderRadius || '9999px' }
      }>
      <Paintbrush2 size={11} />
      Personalizar
    </button>
  );

  const RegionBtn = ({ light = false }: { light?: boolean }) => (
    <button onClick={openRegionModal}
      className="flex items-center gap-1 text-xs hover:opacity-80"
      style={{ color: light ? 'rgba(255,255,255,0.8)' : topBar.textColor }}>
      <MapPin size={10} />
      {mounted ? (selectedRegion?.name ?? 'Región') : 'Región'}
      <ChevronDown size={10} />
    </button>
  );

  const TopBarLinks = ({ light = false }: { light?: boolean }) => (
    <>
      {topBar.links.map((link, i) => (
        <Link key={i} href={link.href}
          className="hidden sm:flex items-center gap-1 text-xs hover:opacity-80"
          style={{ color: light ? 'rgba(255,255,255,0.8)' : topBar.textColor }}>
          {i === 0 && <Phone size={10} />}
          {link.label}
        </Link>
      ))}
    </>
  );

  const CategoryButton = ({ dark = false }: { dark?: boolean }) => (
    <Link href="/products"
      className="flex items-center gap-2 px-4 h-full text-sm font-semibold shrink-0 hover:opacity-90 transition-opacity whitespace-nowrap"
      style={{ backgroundColor: dark ? categoryBar.buttonColor : categoryBar.buttonColor, color: '#FFFFFF' }}>
      <AlignJustify size={15} />
      {categoryBar.buttonLabel}
      <ChevronDown size={13} />
    </Link>
  );

  const NavLinks = ({ textColor, className = '' }: { textColor: string; className?: string }) => (
    <>
      {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
        <Link key={link.label} href={link.href}
          className={cn('px-3 h-full flex items-center text-sm font-medium hover:opacity-75 whitespace-nowrap', className)}
          style={{ color: textColor }}>
          {link.label}
        </Link>
      ))}
    </>
  );

  const MobileMenuBtn = ({ light = false }: { light?: boolean }) => (
    <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden"
      style={{ color: light ? '#fff' : navbar.textColor }} aria-label="Menú">
      {menuOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  );

  const MobileMenu = menuOpen && (
    <div style={{ backgroundColor: navbar.backgroundColor }} className="sm:hidden border-t border-[var(--border)] px-4 py-3 space-y-2">
      <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden border-2" style={{ borderColor: navbar.activeColor }}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..." className="flex-1 h-9 px-3 text-sm outline-none" />
        <button type="submit" className="w-10 flex items-center justify-center text-white" style={{ backgroundColor: navbar.activeColor }}>
          <Search size={15} />
        </button>
      </form>
      <Link href="/products" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white"
        style={{ backgroundColor: categoryBar.buttonColor }}>
        <AlignJustify size={14} />
        {categoryBar.buttonLabel}
      </Link>
      {NAV_LINKS.map((link) => (
        <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
          className="block px-3 py-2.5 rounded-lg text-sm font-medium"
          style={{ color: navbar.textColor }}>
          {link.label}
        </Link>
      ))}
    </div>
  );

  const navBg = {
    backgroundColor: navbar.backgroundColor,
    boxShadow: navbar.shadow ? '0 2px 8px rgba(0,0,0,0.1)' : undefined,
  };

  const stickyClass = cn('w-full z-40', navbar.sticky ? 'sticky top-0' : 'relative');

  // ── VARIANTE 1: CLÁSICO ───────────────────────────────────────────────────
  // Top bar | Logo + Búsqueda grande + Iconos | Categorías bar separada | Anuncio
  if (variant === 'classic') {
    return (
      <header className={stickyClass}>
        {topBar.visible && (
          <div style={{ backgroundColor: topBar.backgroundColor }}>
            <div className="flex items-center justify-between h-8 px-4 sm:px-6 lg:px-20" style={{ color: topBar.textColor }}>
              <div className="flex items-center gap-5"><TopBarLinks /></div>
              <RegionBtn />
            </div>
          </div>
        )}
        <div style={navBg} className="border-b border-[var(--border)]">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-20">
            {Logo}
            {navbar.showSearch && <SearchBar className="flex-1 max-w-2xl mx-auto hidden sm:flex" />}
            <div className="flex items-center gap-4 shrink-0 ml-auto sm:ml-0">
              <Link href="/account" className="hidden sm:flex flex-col items-center gap-0.5 text-xs hover:opacity-70" style={{ color: navbar.textColor }}>
                <User size={20} />
                <span className="hidden lg:block text-[10px]">Iniciar sesión</span>
              </Link>
              {CartBtn}
              <CustomizeBtn />
              <MobileMenuBtn />
            </div>
          </div>
        </div>
        {categoryBar.visible && (
          <div style={{ backgroundColor: categoryBar.backgroundColor }}>
            <div className="hidden lg:flex items-center h-10 px-4 sm:px-6 lg:px-20">
              <CategoryButton />
              <div className="w-px h-4 mx-3 opacity-20 bg-white" />
              <NavLinks textColor={categoryBar.textColor} />
            </div>
          </div>
        )}
        {announcementBar.visible && (
          <div className="w-full h-8 flex items-center justify-center text-xs font-semibold tracking-wide text-center"
            style={{ backgroundColor: announcementBar.backgroundColor, color: announcementBar.textColor }}>
            {announcementBar.text}
          </div>
        )}
        {MobileMenu}
      </header>
    );
  }

  // ── VARIANTE 2: HORIZONTAL ────────────────────────────────────────────────
  // Todo en una sola fila: Logo | Links con categorías integradas | Búsqueda compacta | Iconos
  if (variant === 'horizontal') {
    return (
      <header className={stickyClass}>
        {topBar.visible && (
          <div style={{ backgroundColor: topBar.backgroundColor }}>
            <div className="flex items-center justify-between h-8 px-4 sm:px-6 lg:px-20" style={{ color: topBar.textColor }}>
              <div className="flex items-center gap-5"><TopBarLinks /></div>
              <RegionBtn />
            </div>
          </div>
        )}
        {announcementBar.visible && (
          <div className="w-full h-8 flex items-center justify-center text-xs font-semibold tracking-wide text-center"
            style={{ backgroundColor: announcementBar.backgroundColor, color: announcementBar.textColor }}>
            {announcementBar.text}
          </div>
        )}
        <div style={navBg} className="border-b border-[var(--border)]">
          <div className="flex h-14 items-center gap-0 px-4 sm:px-6 lg:px-20">
            {Logo}
            <nav className="hidden lg:flex items-center flex-1 h-14 ml-4">
              <Link href="/products"
                className="flex items-center gap-1.5 px-4 h-14 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors"
                style={{ color: navbar.activeColor, borderColor: navbar.activeColor }}>
                <AlignJustify size={14} />
                {categoryBar.buttonLabel}
              </Link>
              {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
                <Link key={link.label} href={link.href}
                  className="px-3 h-14 flex items-center text-sm font-medium border-b-2 border-transparent hover:border-current transition-all whitespace-nowrap"
                  style={{ color: navbar.textColor }}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 ml-auto">
              {navbar.showSearch && (
                <form onSubmit={handleSearch} className="hidden lg:flex">
                  <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: navbar.activeColor }}>
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar..." className="h-8 px-3 text-sm w-44 outline-none" />
                    <button type="submit" className="h-8 w-9 flex items-center justify-center text-white" style={{ backgroundColor: navbar.activeColor }}>
                      <Search size={14} />
                    </button>
                  </div>
                </form>
              )}
              <Link href="/account" className="hidden sm:block hover:opacity-70" style={{ color: navbar.textColor }}>
                <User size={20} />
              </Link>
              {CartBtn}
              <CustomizeBtn />
              <MobileMenuBtn />
            </div>
          </div>
        </div>
        {MobileMenu}
      </header>
    );
  }

  // ── VARIANTE 3: CENTRADO ──────────────────────────────────────────────────
  // Logo centrado en primera fila | Links + búsqueda en segunda fila
  if (variant === 'centered') {
    return (
      <header className={stickyClass}>
        {announcementBar.visible && (
          <div className="w-full h-8 flex items-center justify-center text-xs font-semibold tracking-wide text-center"
            style={{ backgroundColor: announcementBar.backgroundColor, color: announcementBar.textColor }}>
            {announcementBar.text}
          </div>
        )}
        <div style={navBg} className="border-b border-[var(--border)]">
          {/* Fila 1: Logo centrado + contexto lateral */}
          <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-20">
            <div className="flex items-center gap-4 text-xs" style={{ color: navbar.textColor }}>
              {topBar.visible && topBar.links.slice(0, 2).map((link, i) => (
                <Link key={i} href={link.href} className="hidden lg:flex items-center gap-1 hover:opacity-75">
                  {i === 0 && <Phone size={10} />}
                  {link.label}
                </Link>
              ))}
            </div>
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              {branding.logoUrl ? (
                <Image src={branding.logoUrl} alt={branding.storeName} width={130} height={40}
                  className="h-10 w-auto object-contain" unoptimized />
              ) : (
                <>
                  <ShoppingBag style={{ color: navbar.activeColor }} size={26} strokeWidth={2} />
                  <span className="text-base font-bold tracking-[3px]" style={{ color: navbar.textColor }}>{branding.storeName}</span>
                </>
              )}
            </Link>
            <div className="flex items-center gap-3 ml-auto">
              <RegionBtn />
              <Link href="/account" className="hidden sm:block hover:opacity-70" style={{ color: navbar.textColor }}><User size={20} /></Link>
              {CartBtn}
              <CustomizeBtn />
              <MobileMenuBtn />
            </div>
          </div>
          {/* Fila 2: Links + búsqueda centrados */}
          <div className="hidden lg:flex items-center justify-center gap-6 h-11 border-t border-[var(--border)] px-4 sm:px-6 lg:px-20">
            <Link href="/products" className="flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
              style={{ color: navbar.activeColor }}>
              <AlignJustify size={14} />
              {categoryBar.buttonLabel}
            </Link>
            <div className="w-px h-4 bg-[var(--border)]" />
            {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
              <Link key={link.label} href={link.href}
                className="text-sm font-medium hover:opacity-75 whitespace-nowrap"
                style={{ color: navbar.textColor }}>
                {link.label}
              </Link>
            ))}
            {navbar.showSearch && (
              <>
                <div className="w-px h-4 bg-[var(--border)]" />
                <form onSubmit={handleSearch} className="flex">
                  <div className="flex rounded-full overflow-hidden border" style={{ borderColor: navbar.activeColor }}>
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar..." className="h-8 px-4 text-sm w-48 outline-none" />
                    <button type="submit" className="h-8 w-9 flex items-center justify-center text-white" style={{ backgroundColor: navbar.activeColor }}>
                      <Search size={14} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
        {MobileMenu}
      </header>
    );
  }

  // ── VARIANTE 4: BOLD ──────────────────────────────────────────────────────
  // Fondo del color primario en header | Búsqueda integrada | Categorías en barra clara debajo
  if (variant === 'bold') {
    return (
      <header className={stickyClass}>
        {topBar.visible && (
          <div style={{ backgroundColor: topBar.backgroundColor }}>
            <div className="flex items-center justify-between h-8 px-4 sm:px-6 lg:px-20" style={{ color: topBar.textColor }}>
              <div className="flex items-center gap-5"><TopBarLinks /></div>
              <RegionBtn />
            </div>
          </div>
        )}
        {/* Header con fondo del color activo */}
        <div style={{ backgroundColor: navbar.activeColor }}>
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-20">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              {branding.logoUrl ? (
                <Image src={branding.logoUrl} alt={branding.storeName} width={130} height={40}
                  className="h-10 w-auto object-contain" unoptimized />
              ) : (
                <span className="text-base font-bold tracking-[3px] text-white">{branding.storeName}</span>
              )}
            </Link>
            {navbar.showSearch && (
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto hidden sm:flex">
                <div className="flex w-full rounded-lg overflow-hidden bg-white/15 border border-white/30 focus-within:bg-white/25 transition-colors">
                  <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos..."
                    className="flex-1 h-10 px-4 text-sm outline-none bg-transparent text-white placeholder:text-white/60" />
                  <button type="submit" className="h-10 w-12 flex items-center justify-center text-white/80 hover:text-white">
                    <Search size={17} />
                  </button>
                </div>
              </form>
            )}
            <div className="flex items-center gap-4 shrink-0 ml-auto sm:ml-0 text-white">
              <Link href="/account" className="hidden sm:flex flex-col items-center gap-0.5 text-xs hover:opacity-75">
                <User size={20} />
                <span className="hidden lg:block text-[10px]">Iniciar sesión</span>
              </Link>
              <button onClick={openCartDrawer} className="relative flex flex-col items-center gap-0.5">
                <ShoppingCart size={22} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold bg-white"
                    style={{ color: navbar.activeColor }}>
                    {itemCount}
                  </span>
                )}
              </button>
              <CustomizeBtn light />
              <MobileMenuBtn light />
            </div>
          </div>
        </div>
        {/* Barra de categorías en blanco/claro debajo */}
        <div style={{ backgroundColor: navbar.backgroundColor }} className="border-b border-[var(--border)]">
          <div className="hidden lg:flex items-center h-10 px-4 sm:px-6 lg:px-20">
            <CategoryButton />
            <div className="w-px h-4 mx-3 bg-[var(--border)]" />
            <NavLinks textColor={navbar.textColor} />
          </div>
        </div>
        {announcementBar.visible && (
          <div className="w-full h-8 flex items-center justify-center text-xs font-semibold tracking-wide text-center"
            style={{ backgroundColor: announcementBar.backgroundColor, color: announcementBar.textColor }}>
            {announcementBar.text}
          </div>
        )}
        {menuOpen && (
          <div style={{ backgroundColor: navbar.activeColor }} className="sm:hidden border-t border-white/20 px-4 py-3 space-y-1">
            <Link href="/products" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/90">
              <AlignJustify size={14} />{categoryBar.buttonLabel}
            </Link>
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white/80">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    );
  }

  // ── VARIANTE 5: MINIMAL ───────────────────────────────────────────────────
  // Solo logo + iconos. Al clicar hamburger se despliega todo (links + búsqueda)
  if (variant === 'minimal') {
    return (
      <header className={stickyClass}>
        {announcementBar.visible && (
          <div className="w-full h-8 flex items-center justify-center text-xs font-semibold tracking-wide text-center"
            style={{ backgroundColor: announcementBar.backgroundColor, color: announcementBar.textColor }}>
            {announcementBar.text}
          </div>
        )}
        <div style={navBg} className="border-b border-[var(--border)]">
          <div className="flex h-14 items-center px-4 sm:px-6 lg:px-20">
            {Logo}
            <div className="ml-auto flex items-center gap-5">
              {navbar.showSearch && (
                <button className="hidden sm:flex items-center gap-1 text-sm hover:opacity-75" style={{ color: navbar.textColor }}>
                  <Search size={18} />
                </button>
              )}
              <Link href="/account" className="hidden sm:block hover:opacity-70" style={{ color: navbar.textColor }}>
                <User size={20} />
              </Link>
              <button onClick={openCartDrawer} className="relative" style={{ color: navbar.activeColor }}>
                <ShoppingCart size={20} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                    style={{ backgroundColor: navbar.activeColor }}>
                    {itemCount}
                  </span>
                )}
              </button>
              <CustomizeBtn />
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: navbar.textColor }} aria-label="Menú">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
          {/* Panel expandido */}
          {menuOpen && (
            <div className="border-t border-[var(--border)] px-4 sm:px-6 lg:px-20 py-5 space-y-4">
              {navbar.showSearch && <SearchBar className="w-full" />}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                <Link href="/products"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white whitespace-nowrap"
                  style={{ backgroundColor: categoryBar.buttonColor }}>
                  <AlignJustify size={14} />
                  {categoryBar.buttonLabel}
                </Link>
                {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
                  <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-medium border border-[var(--border)] hover:bg-[var(--bg-light)] transition-colors"
                    style={{ color: navbar.textColor }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }

  // ── VARIANTE 6: STACKED ───────────────────────────────────────────────────
  // Anuncio + links rápidos | Logo + Búsqueda grande (full width) | Categorías
  if (variant === 'stacked') {
    return (
      <header className={stickyClass}>
        {/* Banda superior con anuncio + links */}
        <div style={{ backgroundColor: navbar.activeColor }}>
          <div className="flex items-center justify-between h-9 px-4 sm:px-6 lg:px-20 gap-4">
            {announcementBar.visible
              ? <span className="text-xs font-semibold text-white/90 truncate">{announcementBar.text}</span>
              : <span />
            }
            <div className="flex items-center gap-5 shrink-0">
              <TopBarLinks light />
              <RegionBtn light />
            </div>
          </div>
        </div>
        {/* Logo + búsqueda prominente */}
        <div style={navBg} className="border-b border-[var(--border)]">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-20">
            {Logo}
            {navbar.showSearch && (
              <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-4 hidden sm:flex">
                <div className="flex w-full rounded-full overflow-hidden border-2" style={{ borderColor: navbar.activeColor }}>
                  <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="flex-1 h-10 px-5 text-sm outline-none bg-transparent" />
                  <button type="submit"
                    className="h-10 px-5 flex items-center justify-center text-white shrink-0 text-sm font-semibold gap-2"
                    style={{ backgroundColor: navbar.activeColor }}>
                    <Search size={15} />
                    Buscar
                  </button>
                </div>
              </form>
            )}
            <div className="flex items-center gap-3 ml-auto sm:ml-0 shrink-0">
              <Link href="/account" className="hidden sm:flex flex-col items-center gap-0.5 text-xs hover:opacity-75" style={{ color: navbar.textColor }}>
                <User size={20} />
                <span className="hidden lg:block text-[10px]">Mi cuenta</span>
              </Link>
              {CartBtn}
              <CustomizeBtn />
              <MobileMenuBtn />
            </div>
          </div>
        </div>
        {/* Barra de categorías */}
        {categoryBar.visible && (
          <div style={{ backgroundColor: categoryBar.backgroundColor }}>
            <div className="hidden lg:flex items-center h-10 px-4 sm:px-6 lg:px-20">
              <CategoryButton />
              <div className="w-px h-4 mx-3 opacity-20 bg-white" />
              <NavLinks textColor={categoryBar.textColor} />
            </div>
          </div>
        )}
        {MobileMenu}
      </header>
    );
  }

  return null;
}
