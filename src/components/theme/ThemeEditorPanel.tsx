'use client';

import { useState } from 'react';
import {
  X, Store, Palette, Type, Layout, ShoppingBag, LogIn, RotateCcw,
  AlignJustify, Megaphone, Rows3, SlidersHorizontal, MousePointerClick,
  Sparkles, Image as ImageIcon, ChevronDown, Home, LayoutGrid, Eye,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/lib/cn';
import type { StoreTheme } from '@/lib/theme/theme.types';
import HomeSectionsTab from './HomeSectionsTab';

// ─── Tab config ───────────────────────────────────────────────────────────────

type Tab = 'branding' | 'colors' | 'typography' | 'navbar' | 'home' | 'cards' | 'login';

const TABS: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: 'branding',   label: 'Marca',    icon: Store },
  { id: 'colors',     label: 'Colores',  icon: Palette },
  { id: 'typography', label: 'Tipo',     icon: Type },
  { id: 'navbar',     label: 'Navbar',   icon: Layout },
  { id: 'home',       label: 'Home',     icon: Home },
  { id: 'cards',      label: 'Cards',    icon: ShoppingBag },
  { id: 'login',      label: 'Login',    icon: LogIn },
];

// ─── Palette ──────────────────────────────────────────────────────────────────
// bg0: #0C0C10  bg1: #141419  bg2: #1C1C24
// border: #222230  text: #D8D8E8  muted: #6868808  accent: #10B981

// ─── Atoms ───────────────────────────────────────────────────────────────────

function Divider({ label, icon: Icon }: { label: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 mt-4 first:mt-0 mb-1">
      {Icon && <Icon size={10} className="text-[#3C3C50] shrink-0" />}
      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#3C3C50] whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-[#1E1E2A]" />
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#141419] px-3 py-2.5 space-y-2">
      {children}
    </div>
  );
}

function Prop({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 min-h-[26px]">
      <span className="text-[11px] text-[#686878] shrink-0">{label}</span>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text" value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#1C1C24] border border-[#28283A] rounded-lg px-2.5 h-7 text-[11px] text-[#C8C8DC] placeholder:text-[#3A3A50] outline-none focus:border-[#10B981]/60 transition-colors"
    />
  );
}

function ColorPill({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-1.5 bg-[#1C1C24] border border-[#28283A] rounded-lg px-2 h-7 cursor-pointer shrink-0 hover:border-[#10B981]/40 transition-colors">
      <div className="relative w-3.5 h-3.5 rounded-sm shrink-0 ring-1 ring-white/10">
        <div className="absolute inset-0 rounded-sm" style={{ backgroundColor: value }} />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </div>
      <input
        type="text" value={value} maxLength={7}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="w-[54px] text-[11px] font-mono text-[#A8A8C0] bg-transparent outline-none"
      />
    </label>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Prop label={label}>
      <ColorPill value={value} onChange={onChange} />
    </Prop>
  );
}

function Toggle({ label, description, value, onChange }: { label: string; description?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Prop label={label}>
      {description && <span className="text-[10px] text-[#44445A] mr-auto ml-1 hidden sm:block">{description}</span>}
      <button type="button" onClick={() => onChange(!value)}
        className={cn('relative shrink-0 w-7 h-4 rounded-full transition-colors duration-200', value ? 'bg-emerald-500' : 'bg-[#252534]')}>
        <span className={cn('absolute top-[3px] w-2.5 h-2.5 bg-white rounded-full shadow transition-transform duration-200', value ? 'translate-x-[14px]' : 'translate-x-[3px]')} />
      </button>
    </Prop>
  );
}

function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-[#686878]">{label}</p>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value as T)}
          className="w-full bg-[#1C1C24] border border-[#28283A] rounded-lg pl-2.5 pr-7 h-7 text-[11px] text-[#C8C8DC] outline-none focus:border-[#10B981]/60 transition-colors appearance-none cursor-pointer">
          {options.map((o) => <option key={o.value} value={o.value} className="bg-[#1C1C24]">{o.label}</option>)}
        </select>
        <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#44445A] pointer-events-none" />
      </div>
    </div>
  );
}

function Slider({ label, value, unit, min, max, onChange }: { label: string; value: number; unit: string; min: number; max: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#686878]">{label}</span>
        <span className="text-[11px] font-mono text-emerald-400">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full cursor-pointer accent-emerald-500"
        style={{ background: `linear-gradient(to right,#10B981 ${pct}%,#1E1E2A ${pct}%)` }} />
    </div>
  );
}

function Sep() {
  return <div className="h-px bg-[#1E1E2A] -mx-3" />;
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

function BrandingTab({ theme, patch }: { theme: StoreTheme; patch: (p: Partial<StoreTheme['branding']>) => void }) {
  return (
    <div className="space-y-2">
      <Divider icon={Store} label="Identidad" />
      <Group>
        <Prop label="Nombre">
          <TextInput value={theme.branding.storeName} onChange={(v) => patch({ storeName: v })} placeholder="Mi Tienda" />
        </Prop>
      </Group>

      <Divider icon={ImageIcon} label="Recursos" />
      <Group>
        <Prop label="Logo URL">
          <TextInput value={theme.branding.logoUrl} onChange={(v) => patch({ logoUrl: v })} placeholder="https://…/logo.png" />
        </Prop>
        {theme.branding.logoUrl && (
          <>
            <Sep />
            <div className="rounded-lg h-12 flex items-center justify-center" style={{ backgroundColor: theme.navbar.backgroundColor }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={theme.branding.logoUrl} alt="logo preview" className="h-8 object-contain" />
            </div>
          </>
        )}
        <Sep />
        <Prop label="Favicon">
          <TextInput value={theme.branding.faviconUrl} onChange={(v) => patch({ faviconUrl: v })} placeholder="/favicon.ico" />
        </Prop>
        <Sep />
        <Prop label="Banner">
          <TextInput value={theme.branding.bannerUrl ?? ''} onChange={(v) => patch({ bannerUrl: v })} placeholder="https://…/banner.jpg" />
        </Prop>
      </Group>
    </div>
  );
}

function ColorsTab({ theme, patch }: { theme: StoreTheme; patch: (p: Partial<StoreTheme['colors']>) => void }) {
  return (
    <div className="space-y-2">
      <Divider icon={Sparkles} label="Acento" />
      <Group>
        <ColorRow label="Primario" value={theme.colors.primary} onChange={(v) => patch({ primary: v })} />
        <Sep />
        <ColorRow label="Secundario" value={theme.colors.secondary} onChange={(v) => patch({ secondary: v })} />
      </Group>

      <Divider icon={Layout} label="Fondos" />
      <Group>
        <ColorRow label="Fondo" value={theme.colors.background} onChange={(v) => patch({ background: v })} />
        <Sep />
        <ColorRow label="Superficie" value={theme.colors.surface} onChange={(v) => patch({ surface: v })} />
        <Sep />
        <ColorRow label="Borde" value={theme.colors.border} onChange={(v) => patch({ border: v })} />
      </Group>

      <Divider icon={Type} label="Texto" />
      <Group>
        <ColorRow label="Principal" value={theme.colors.text} onChange={(v) => patch({ text: v })} />
        <Sep />
        <ColorRow label="Secundario" value={theme.colors.textMuted} onChange={(v) => patch({ textMuted: v })} />
      </Group>

      <Divider icon={SlidersHorizontal} label="Estados" />
      <Group>
        <ColorRow label="Éxito" value={theme.colors.success} onChange={(v) => patch({ success: v })} />
        <Sep />
        <ColorRow label="Error" value={theme.colors.error} onChange={(v) => patch({ error: v })} />
        <Sep />
        <ColorRow label="Advertencia" value={theme.colors.warning} onChange={(v) => patch({ warning: v })} />
      </Group>
    </div>
  );
}

// ─── Catálogo de fuentes por modelo de negocio ─────────────────────────────
// Las fuentes propietarias (SF Pro, Helvetica Neue, Futura, Didot, Bodoni, Graphik,
// Proxima Nova, Söhne, Circular, Amazon Ember, Motiva Sans) usan stacks del sistema.
// Las disponibles en Google Fonts cargan vía URL.
type FontDef = { value: string; label: string; url?: string; stack?: string };

const FONT_GROUPS: Array<{ group: string; fonts: FontDef[] }> = [
  {
    group: 'Marketplace (Amazon, Mercado Libre, Etsy)',
    fonts: [
      { value: 'Inter',         label: 'Inter',         url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      { value: 'Helvetica Neue', label: 'Helvetica Neue', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
      { value: 'Arial',         label: 'Proxima Nova / Arial', stack: '"Proxima Nova", "Helvetica Neue", Arial, sans-serif' },
    ],
  },
  {
    group: 'Moda / Fashion (Nike, Zara, Gymshark)',
    fonts: [
      { value: 'Montserrat',    label: 'Montserrat',    url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap' },
      { value: 'Bebas Neue',    label: 'Bebas Neue',    url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap' },
      { value: 'Futura',        label: 'Futura',        stack: 'Futura, "Trebuchet MS", "Century Gothic", Arial, sans-serif' },
      { value: 'Playfair Display', label: 'Didot / Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap' },
      { value: 'Bodoni Moda',   label: 'Bodoni Moda',   url: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;600;700&display=swap' },
    ],
  },
  {
    group: 'Tecnología / Electrónica (Apple, Samsung, Tesla)',
    fonts: [
      { value: 'Geist',         label: 'Geist',         url: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap' },
      { value: '-apple-system', label: 'SF Pro (Apple)', stack: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif' },
      { value: 'IBM Plex Sans', label: 'IBM Plex Sans', url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap' },
      { value: 'Roboto',        label: 'Roboto',        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
      { value: 'Inter',         label: 'Inter',         url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
    ],
  },
  {
    group: 'Lujo / Premium (Rolex, Chanel, Louis Vuitton)',
    fonts: [
      { value: 'Playfair Display', label: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap' },
      { value: 'Bodoni Moda',   label: 'Bodoni',        url: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;600;700&display=swap' },
      { value: 'EB Garamond',   label: 'Garamond',      url: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap' },
      { value: 'Cormorant Garamond', label: 'Cormorant Garamond', url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap' },
      { value: 'Cinzel',        label: 'Cinzel',        url: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap' },
    ],
  },
  {
    group: 'SaaS / Plataformas (Stripe, Notion, Vercel)',
    fonts: [
      { value: 'Inter',         label: 'Inter',         url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      { value: 'Geist',         label: 'Geist',         url: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap' },
      { value: 'IBM Plex Sans', label: 'IBM Plex Sans', url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap' },
      { value: 'Manrope',       label: 'Manrope',       url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap' },
    ],
  },
  {
    group: 'Delivery / Grocery (Rappi, PedidosYa)',
    fonts: [
      { value: 'Inter',         label: 'Inter',         url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      { value: 'Nunito',        label: 'Nunito',        url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap' },
      { value: 'Poppins',       label: 'Poppins',       url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' },
      { value: 'DM Sans',       label: 'DM Sans',       url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap' },
    ],
  },
  {
    group: 'Productos digitales (Udemy, Steam)',
    fonts: [
      { value: 'Inter',         label: 'Inter',         url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      { value: 'Roboto',        label: 'Roboto',        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
      { value: 'Open Sans',     label: 'Open Sans',     url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' },
      { value: 'Lato',          label: 'Lato',          url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap' },
    ],
  },
  {
    group: 'Streetwear / Gaming (Gymshark, eSports)',
    fonts: [
      { value: 'Bebas Neue',    label: 'Bebas Neue',    url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap' },
      { value: 'Anton',         label: 'Anton',         url: 'https://fonts.googleapis.com/css2?family=Anton&display=swap' },
      { value: 'Oswald',        label: 'Oswald',        url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap' },
      { value: 'Montserrat',    label: 'Montserrat',    url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap' },
      { value: 'Teko',          label: 'Teko',          url: 'https://fonts.googleapis.com/css2?family=Teko:wght@400;500;600;700&display=swap' },
    ],
  },
  {
    group: 'Minimalista / Apple-style (Apple, Nothing, Vercel)',
    fonts: [
      { value: '-apple-system', label: 'SF Pro (Apple)', stack: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif' },
      { value: 'Inter',         label: 'Inter',         url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      { value: 'Geist',         label: 'Geist',         url: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap' },
      { value: 'Helvetica Neue', label: 'Helvetica Neue', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
    ],
  },
];

// Mapa rápido value -> URL (para resolver al elegir)
const FONT_URL_MAP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const g of FONT_GROUPS) for (const f of g.fonts) if (f.url) map[f.value] = f.url;
  return map;
})();

function TypographyTab({ theme, patch }: { theme: StoreTheme; patch: (p: Partial<StoreTheme['typography']>) => void }) {
  const SIZES = [
    { value: '13px', label: '13px (compacto)' },
    { value: '14px', label: '14px' },
    { value: '15px', label: '15px' },
    { value: '16px', label: '16px (default)' },
    { value: '17px', label: '17px' },
    { value: '18px', label: '18px' },
    { value: '19px', label: '19px' },
    { value: '20px', label: '20px (grande)' },
  ];
  return (
    <div className="space-y-2">
      <Divider icon={Type} label="Fuente" />
      <Group>
        <div className="space-y-1">
          <p className="text-[10px] text-[#686878]">Familia (por modelo de negocio)</p>
          <div className="relative">
            <select
              value={theme.typography.fontFamily}
              onChange={(e) => patch({ fontFamily: e.target.value, fontUrl: FONT_URL_MAP[e.target.value] ?? '' })}
              className="w-full bg-[#1C1C24] border border-[#28283A] rounded-lg pl-2.5 pr-7 h-7 text-[11px] text-[#C8C8DC] outline-none focus:border-[#10B981]/60 transition-colors appearance-none cursor-pointer"
            >
              {FONT_GROUPS.map((g) => (
                <optgroup key={g.group} label={g.group} className="bg-[#1C1C24]">
                  {g.fonts.map((f) => (
                    <option key={`${g.group}-${f.value}-${f.label}`} value={f.value} className="bg-[#1C1C24]">
                      {f.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#44445A] pointer-events-none" />
          </div>
        </div>
        <Sep />
        <Select label="Tamaño base" value={theme.typography.baseFontSize} options={SIZES}
          onChange={(v) => patch({ baseFontSize: v })} />
        <Sep />
        <div className="space-y-1">
          <p className="text-[10px] text-[#686878]">Google Fonts URL (avanzado)</p>
          <TextInput value={theme.typography.fontUrl ?? ''} onChange={(v) => patch({ fontUrl: v })} placeholder="https://fonts.googleapis.com/…" />
        </div>
      </Group>

      <Divider icon={Sparkles} label="Vista previa" />
      <div className="rounded-xl bg-[#141419] px-4 py-3 space-y-0.5" style={{ fontFamily: `'${theme.typography.fontFamily}', sans-serif`, fontSize: theme.typography.baseFontSize }}>
        <p className="font-bold text-[#D8D8E8]" style={{ fontSize: '1em' }}>Título del producto</p>
        <p className="text-[#8888A0]" style={{ fontSize: '0.85em' }}>Descripción en texto normal.</p>
        <p className="text-[#444454]" style={{ fontSize: '0.7em' }}>Etiqueta secundaria.</p>
      </div>
    </div>
  );
}

function NavbarTab({ theme, patch, patchTopBar, patchCategoryBar, patchAnnouncement }: {
  theme: StoreTheme;
  patch: (p: Partial<StoreTheme['navbar']>) => void;
  patchTopBar: (p: Partial<StoreTheme['topBar']>) => void;
  patchCategoryBar: (p: Partial<StoreTheme['categoryBar']>) => void;
  patchAnnouncement: (p: Partial<StoreTheme['announcementBar']>) => void;
}) {
  return (
    <div className="space-y-2">
      <Divider icon={Layout} label="Header principal" />
      <Group>
        <ColorRow label="Fondo" value={theme.navbar.backgroundColor} onChange={(v) => patch({ backgroundColor: v })} />
        <Sep />
        <ColorRow label="Texto" value={theme.navbar.textColor} onChange={(v) => patch({ textColor: v })} />
        <Sep />
        <ColorRow label="Acento" value={theme.navbar.activeColor} onChange={(v) => patch({ activeColor: v })} />
        <Sep />
        <Toggle label="Sticky" description="Se fija al scroll" value={theme.navbar.sticky} onChange={(v) => patch({ sticky: v })} />
        <Sep />
        <Toggle label="Búsqueda" description="Mostrar barra" value={theme.navbar.showSearch} onChange={(v) => patch({ showSearch: v })} />
      </Group>

      <Divider icon={Rows3} label="Barra superior" />
      <Group>
        <Toggle label="Visible" value={theme.topBar.visible} onChange={(v) => patchTopBar({ visible: v })} />
        {theme.topBar.visible && (
          <>
            <Sep />
            <ColorRow label="Fondo" value={theme.topBar.backgroundColor} onChange={(v) => patchTopBar({ backgroundColor: v })} />
            <Sep />
            <ColorRow label="Texto" value={theme.topBar.textColor} onChange={(v) => patchTopBar({ textColor: v })} />
          </>
        )}
      </Group>

      <Divider icon={AlignJustify} label="Barra de categorías" />
      <Group>
        <Toggle label="Visible" value={theme.categoryBar.visible} onChange={(v) => patchCategoryBar({ visible: v })} />
        {theme.categoryBar.visible && (
          <>
            <Sep />
            <ColorRow label="Fondo" value={theme.categoryBar.backgroundColor} onChange={(v) => patchCategoryBar({ backgroundColor: v })} />
            <Sep />
            <ColorRow label="Texto" value={theme.categoryBar.textColor} onChange={(v) => patchCategoryBar({ textColor: v })} />
            <Sep />
            <ColorRow label="Botón" value={theme.categoryBar.buttonColor} onChange={(v) => patchCategoryBar({ buttonColor: v })} />
            <Sep />
            <Prop label="Label">
              <TextInput value={theme.categoryBar.buttonLabel} onChange={(v) => patchCategoryBar({ buttonLabel: v })} placeholder="Categorías" />
            </Prop>
          </>
        )}
      </Group>

      <Divider icon={Megaphone} label="Barra de anuncio" />
      <Group>
        <Toggle label="Visible" value={theme.announcementBar.visible} onChange={(v) => patchAnnouncement({ visible: v })} />
        {theme.announcementBar.visible && (
          <>
            <Sep />
            <div className="space-y-1">
              <p className="text-[10px] text-[#686878]">Mensaje</p>
              <TextInput value={theme.announcementBar.text} onChange={(v) => patchAnnouncement({ text: v })} placeholder="🚚 ENVÍO GRATUITO…" />
            </div>
            <Sep />
            <ColorRow label="Fondo" value={theme.announcementBar.backgroundColor} onChange={(v) => patchAnnouncement({ backgroundColor: v })} />
            <Sep />
            <ColorRow label="Texto" value={theme.announcementBar.textColor} onChange={(v) => patchAnnouncement({ textColor: v })} />
            <Sep />
            <div className="rounded-lg h-7 flex items-center justify-center text-[11px] font-medium px-2 text-center"
              style={{ backgroundColor: theme.announcementBar.backgroundColor, color: theme.announcementBar.textColor }}>
              {theme.announcementBar.text || '— Vista previa —'}
            </div>
          </>
        )}
      </Group>
    </div>
  );
}

function CardsTab({ theme, patch }: { theme: StoreTheme; patch: (p: Partial<StoreTheme['productCards']>) => void }) {
  const cfg = theme.productCards;
  return (
    <div className="space-y-2">
      <Divider icon={LayoutGrid} label="Diseño de tarjeta" />
      <VariantPicker value={cfg.variant} onChange={(v) => patch({ variant: v })} />

      <Divider icon={SlidersHorizontal} label="Forma" />
      <Group>
        <Slider label="Border radius" value={parseInt(cfg.borderRadius)} unit="px" min={0} max={24}
          onChange={(v) => patch({ borderRadius: `${v}px` })} />
        <Sep />
        <Slider label="Altura de imagen" value={parseInt(cfg.imageHeight)} unit="px" min={120} max={320}
          onChange={(v) => patch({ imageHeight: `${v}px` })} />
        <Sep />
        <Select label="Proporción de imagen" value={cfg.imageAspect} options={[
          { value: 'auto',      label: 'Auto (altura fija)' },
          { value: 'square',    label: 'Cuadrada 1:1' },
          { value: 'portrait',  label: 'Vertical 3:4' },
          { value: 'landscape', label: 'Horizontal 4:3' },
        ]} onChange={(v) => patch({ imageAspect: v })} />
      </Group>

      <Divider icon={MousePointerClick} label="Botón" />
      <Group>
        <Select label="Estilo del botón" value={cfg.buttonStyle} options={[
          { value: 'rounded', label: 'Redondeado' },
          { value: 'pill',    label: 'Píldora' },
          { value: 'square',  label: 'Cuadrado' },
        ]} onChange={(v) => patch({ buttonStyle: v })} />
      </Group>

      <Divider icon={Sparkles} label="Interacción" />
      <Group>
        <Select label="Efecto hover" value={cfg.hoverEffect} options={[
          { value: 'zoom', label: 'Zoom a la imagen' },
          { value: 'lift', label: 'Elevar tarjeta' },
          { value: 'none', label: 'Sin efecto' },
        ]} onChange={(v) => patch({ hoverEffect: v })} />
        <Sep />
        <Toggle label="Sombra al hover" value={cfg.shadow} onChange={(v) => patch({ shadow: v })} />
      </Group>

      <Divider icon={Eye} label="Elementos visibles" />
      <Group>
        <Toggle label="Badge (HOT/NEW/SALE)" value={cfg.showBadge} onChange={(v) => patch({ showBadge: v })} />
        <Sep />
        <Toggle label="Wishlist (corazón)" value={cfg.showWishlist} onChange={(v) => patch({ showWishlist: v })} />
        <Sep />
        <Toggle label="Categoría" value={cfg.showCategory} onChange={(v) => patch({ showCategory: v })} />
        <Sep />
        <Toggle label="Rating (estrellas)" value={cfg.showRating} onChange={(v) => patch({ showRating: v })} />
        <Sep />
        <Toggle label="Indicador de stock" value={cfg.showStock} onChange={(v) => patch({ showStock: v })} />
      </Group>
    </div>
  );
}

// ─── Variant picker (visual thumbnails) ──────────────────────────────────────
const VARIANTS: Array<{ id: StoreTheme['productCards']['variant']; label: string; desc: string; Preview: React.FC }> = [
  { id: 'classic', label: 'Classic', desc: 'Imagen + info + botón',   Preview: PreviewClassic },
  { id: 'minimal', label: 'Minimal', desc: 'Sin borde, botón al hover', Preview: PreviewMinimal },
  { id: 'overlay', label: 'Overlay', desc: 'Info sobre la imagen',    Preview: PreviewOverlay },
  { id: 'compact', label: 'Compact', desc: 'Horizontal (lista)',       Preview: PreviewCompact },
];

function VariantPicker({ value, onChange }: { value: StoreTheme['productCards']['variant']; onChange: (v: StoreTheme['productCards']['variant']) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {VARIANTS.map(({ id, label, desc, Preview }) => {
        const selected = value === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className={cn(
              'group text-left rounded-xl p-2 transition-all',
              selected ? 'bg-emerald-500/10 ring-1 ring-emerald-500/60' : 'bg-[#141419] hover:bg-[#18181E] ring-1 ring-transparent hover:ring-[#28283A]',
            )}>
            <div className={cn('rounded-lg overflow-hidden mb-1.5 h-[72px] flex items-center justify-center', selected ? 'bg-[#0C0C10]' : 'bg-[#0C0C10]')}>
              <Preview />
            </div>
            <p className={cn('text-[11px] font-semibold leading-none', selected ? 'text-emerald-400' : 'text-[#C8C8DC]')}>{label}</p>
            <p className="text-[9px] text-[#5A5A70] mt-1 leading-tight">{desc}</p>
          </button>
        );
      })}
    </div>
  );
}

// Mini SVG-free previews (CSS only)
function PreviewClassic() {
  return (
    <div className="w-[68px] h-[60px] rounded-md bg-white overflow-hidden border border-[#28283A] flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-[#E5E5EC] to-[#CCCCD6]" />
      <div className="h-[20px] px-1.5 py-1 space-y-0.5">
        <div className="h-1 w-10 bg-[#1A1A24] rounded-sm" />
        <div className="flex justify-between items-center">
          <div className="h-1 w-5 bg-[#1A1A24] rounded-sm" />
          <div className="h-1.5 w-4 bg-emerald-500 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

function PreviewMinimal() {
  return (
    <div className="w-[68px] h-[60px] flex flex-col">
      <div className="flex-1 rounded-md bg-gradient-to-br from-[#E5E5EC] to-[#CCCCD6]" />
      <div className="h-[18px] pt-1.5 space-y-0.5">
        <div className="h-1 w-8 bg-[#2A2A34] rounded-sm" />
        <div className="h-1 w-5 bg-[#5A5A6A] rounded-sm" />
      </div>
    </div>
  );
}

function PreviewOverlay() {
  return (
    <div className="w-[52px] h-[62px] rounded-md overflow-hidden relative bg-gradient-to-br from-[#E5E5EC] to-[#888896]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-x-1 bottom-1 space-y-0.5">
        <div className="h-1 w-6 bg-white rounded-sm" />
        <div className="flex justify-between items-end">
          <div className="h-1.5 w-5 bg-white rounded-sm" />
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}

function PreviewCompact() {
  return (
    <div className="w-[80px] h-[42px] rounded-md bg-white border border-[#28283A] flex overflow-hidden">
      <div className="w-[42px] bg-gradient-to-br from-[#E5E5EC] to-[#CCCCD6]" />
      <div className="flex-1 p-1.5 space-y-1">
        <div className="h-1 w-8 bg-[#1A1A24] rounded-sm" />
        <div className="h-1 w-6 bg-[#5A5A6A] rounded-sm" />
        <div className="flex items-center gap-1 pt-0.5">
          <div className="h-1 w-4 bg-[#1A1A24] rounded-sm" />
          <div className="h-1.5 w-3 bg-emerald-500 rounded-sm ml-auto" />
        </div>
      </div>
    </div>
  );
}

function LoginTab({ theme, patch }: { theme: StoreTheme; patch: (p: Partial<StoreTheme['login']>) => void }) {
  return (
    <div className="space-y-2">
      <Divider icon={LogIn} label="Panel derecho" />
      <Group>
        <Select label="Tipo de fondo" value={theme.login.backgroundType} options={[
          { value: 'color', label: 'Color sólido' },
          { value: 'image', label: 'Imagen' },
        ]} onChange={(v) => patch({ backgroundType: v })} />
        <Sep />
        {theme.login.backgroundType === 'color'
          ? <ColorRow label="Color" value={theme.login.backgroundColor} onChange={(v) => patch({ backgroundColor: v })} />
          : (
            <div className="space-y-1">
              <p className="text-[10px] text-[#686878]">URL de imagen</p>
              <TextInput value={theme.login.backgroundImageUrl ?? ''} onChange={(v) => patch({ backgroundImageUrl: v })} placeholder="https://…/bg.jpg" />
            </div>
          )
        }
        <Sep />
        <div className="flex rounded-lg overflow-hidden h-16">
          <div className="flex-1 bg-white flex items-center justify-center">
            <span className="text-[9px] text-gray-400">Form</span>
          </div>
          <div className="w-12 flex items-center justify-center"
            style={theme.login.backgroundType === 'image' && theme.login.backgroundImageUrl
              ? { backgroundImage: `url(${theme.login.backgroundImageUrl})`, backgroundSize: 'cover' }
              : { backgroundColor: theme.login.backgroundColor }}>
            <span className="text-[8px] text-white/70">Panel</span>
          </div>
        </div>
      </Group>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function ThemeEditorPanel() {
  const isOpen = useUIStore((s) => s.isThemeEditorOpen);
  const closeThemeEditor = useUIStore((s) => s.closeThemeEditor);
  const { theme, updateTheme, resetTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('branding');

  const patch = <K extends keyof StoreTheme>(key: K, value: Partial<StoreTheme[K]>) =>
    updateTheme({ [key]: value } as Parameters<typeof updateTheme>[0]);

  const activeTabInfo = TABS.find((t) => t.id === activeTab)!;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={closeThemeEditor} />
      )}

      <div
        className={cn(
          'fixed top-0 right-0 h-full z-50 w-[320px] flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ backgroundColor: '#0C0C10', boxShadow: '-8px 0 32px rgba(0,0,0,0.6)' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 h-12 shrink-0" style={{ borderBottom: '1px solid #181820' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Palette size={12} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-[#3C3C52] uppercase tracking-[0.12em] leading-none">Personalizador</p>
              <p className="text-xs font-semibold text-[#D0D0E8] leading-tight mt-0.5 truncate max-w-[140px]">{theme.branding.storeName}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={resetTheme} title="Restablecer"
              className="w-7 h-7 flex items-center justify-center rounded-md text-[#3C3C52] hover:text-[#A0A0C0] hover:bg-white/5 transition-colors">
              <RotateCcw size={12} />
            </button>
            <button onClick={closeThemeEditor}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[#3C3C52] hover:text-[#A0A0C0] hover:bg-white/5 transition-colors">
              <X size={13} />
            </button>
          </div>
        </div>

        {/* ── Tab grid (4 cols) ── */}
        <div className="grid grid-cols-4 gap-1 p-2 shrink-0" style={{ borderBottom: '1px solid #181820' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-medium transition-all duration-150',
                activeTab === id
                  ? 'bg-emerald-500/12 text-emerald-400'
                  : 'text-[#44445A] hover:text-[#8888A8] hover:bg-white/4',
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Active tab label ── */}
        <div className="flex items-center gap-2 px-4 h-8 shrink-0">
          <activeTabInfo.icon size={11} className="text-emerald-500" />
          <span className="text-[11px] font-semibold text-[#6868888]">{activeTabInfo.label}</span>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          {activeTab === 'branding'    && <BrandingTab    theme={theme} patch={(v) => patch('branding', v)} />}
          {activeTab === 'colors'      && <ColorsTab      theme={theme} patch={(v) => patch('colors', v)} />}
          {activeTab === 'typography'  && <TypographyTab  theme={theme} patch={(v) => patch('typography', v)} />}
          {activeTab === 'navbar'      && (
            <NavbarTab
              theme={theme}
              patch={(v) => patch('navbar', v)}
              patchTopBar={(v) => patch('topBar', v)}
              patchCategoryBar={(v) => patch('categoryBar', v)}
              patchAnnouncement={(v) => patch('announcementBar', v)}
            />
          )}
          {activeTab === 'home'        && (
            <HomeSectionsTab
              sections={theme.homeSections}
              onChange={(next) => updateTheme({ homeSections: next } as unknown as Parameters<typeof updateTheme>[0])}
            />
          )}
          {activeTab === 'cards'       && <CardsTab       theme={theme} patch={(v) => patch('productCards', v)} />}
          {activeTab === 'login'       && <LoginTab       theme={theme} patch={(v) => patch('login', v)} />}
        </div>
      </div>
    </>
  );
}
