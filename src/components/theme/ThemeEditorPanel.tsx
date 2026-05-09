'use client';

import { useState } from 'react';
import {
  X, Store, Palette, Type, Layout, ShoppingBag, LogIn, RotateCcw,
  AlignJustify, Megaphone, Rows3, SlidersHorizontal, MousePointerClick,
  Sparkles, Image as ImageIcon, ChevronDown, Home, LayoutGrid, Eye,
  Monitor, Zap, Layers,
} from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useTheme } from '@/lib/theme/ThemeContext';
import { cn } from '@/lib/cn';
import type { StoreTheme, LayoutMode, BusinessModel } from '@/lib/theme/theme.types';
import HomeSectionsTab from './HomeSectionsTab';
import { THEME_PRESETS } from '@/lib/theme/themePresets';

// ─── Tab config ───────────────────────────────────────────────────────────────

type Tab = 'branding' | 'colors' | 'typography' | 'navbar' | 'layout' | 'home' | 'cards' | 'buttons' | 'banners' | 'login';

const TABS: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: 'branding',   label: 'Marca',   icon: Store      },
  { id: 'colors',     label: 'Colores', icon: Palette    },
  { id: 'typography', label: 'Tipo',    icon: Type       },
  { id: 'navbar',     label: 'Navbar',  icon: Layout     },
  { id: 'buttons',    label: 'Botones', icon: Zap        },
  { id: 'banners',    label: 'Banners', icon: Layers     },
  { id: 'layout',     label: 'Layout',  icon: LayoutGrid },
  { id: 'home',       label: 'Home',    icon: Home       },
  { id: 'cards',      label: 'Cards',   icon: ShoppingBag },
  { id: 'login',      label: 'Login',   icon: LogIn      },
];

// ─── Atoms ────────────────────────────────────────────────────────────────────

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
  return <div className="rounded-xl bg-[#141419] px-3 py-2.5 space-y-2">{children}</div>;
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
    <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#1C1C24] border border-[#28283A] rounded-lg px-2.5 h-7 text-[11px] text-[#C8C8DC] placeholder:text-[#3A3A50] outline-none focus:border-[#10B981]/60 transition-colors" />
  );
}

function ColorPill({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-1.5 bg-[#1C1C24] border border-[#28283A] rounded-lg px-2 h-7 cursor-pointer shrink-0 hover:border-[#10B981]/40 transition-colors">
      <div className="relative w-3.5 h-3.5 rounded-sm shrink-0 ring-1 ring-white/10">
        <div className="absolute inset-0 rounded-sm" style={{ backgroundColor: value }} />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </div>
      <input type="text" value={value} maxLength={7} onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="w-[54px] text-[11px] font-mono text-[#A8A8C0] bg-transparent outline-none" />
    </label>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <Prop label={label}><ColorPill value={value} onChange={onChange} /></Prop>;
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

function Sep() { return <div className="h-px bg-[#1E1E2A] -mx-3" />; }

// ─── COLOR PRESETS ────────────────────────────────────────────────────────────
// Reemplaza las paletas individuales con swatches visuales como en la imagen

const COLOR_PRESETS: Array<{
  id: string; label: string; swatch: string;
  colors: Partial<StoreTheme['colors']>;
  navbar?: Partial<StoreTheme['navbar']>;
  buttons?: Partial<StoreTheme['buttons']>;
  banners?: Partial<StoreTheme['banners']>;
  categoryBar?: Partial<StoreTheme['categoryBar']>;
  topBar?: Partial<StoreTheme['topBar']>;
  announcementBar?: Partial<StoreTheme['announcementBar']>;
}> = [
  {
    id: 'default', label: 'Default', swatch: '#0D6E6E',
    colors: THEME_PRESETS.default.colors,
    navbar: THEME_PRESETS.default.navbar,
    buttons: THEME_PRESETS.default.buttons,
    banners: THEME_PRESETS.default.banners,
    categoryBar: THEME_PRESETS.default.categoryBar,
    topBar: THEME_PRESETS.default.topBar,
    announcementBar: THEME_PRESETS.default.announcementBar,
  },
  {
    id: 'dark', label: 'Dark', swatch: '#22C55E',
    colors: THEME_PRESETS.dark.colors,
    navbar: THEME_PRESETS.dark.navbar,
    buttons: THEME_PRESETS.dark.buttons,
    banners: THEME_PRESETS.dark.banners,
    categoryBar: THEME_PRESETS.dark.categoryBar,
    topBar: THEME_PRESETS.dark.topBar,
    announcementBar: THEME_PRESETS.dark.announcementBar,
  },
  {
    id: 'minimal', label: 'Minimal', swatch: '#111111',
    colors: THEME_PRESETS.minimal.colors,
    navbar: THEME_PRESETS.minimal.navbar,
    buttons: THEME_PRESETS.minimal.buttons,
    banners: THEME_PRESETS.minimal.banners,
    categoryBar: THEME_PRESETS.minimal.categoryBar,
    topBar: THEME_PRESETS.minimal.topBar,
    announcementBar: THEME_PRESETS.minimal.announcementBar,
  },
  {
    id: 'bold', label: 'Bold', swatch: '#E63946',
    colors: THEME_PRESETS.bold.colors,
    navbar: THEME_PRESETS.bold.navbar,
    buttons: THEME_PRESETS.bold.buttons,
    banners: THEME_PRESETS.bold.banners,
    categoryBar: THEME_PRESETS.bold.categoryBar,
    topBar: THEME_PRESETS.bold.topBar,
    announcementBar: THEME_PRESETS.bold.announcementBar,
  },
  {
    id: 'luxury', label: 'Luxury', swatch: '#B8960C',
    colors: THEME_PRESETS.luxury.colors,
    navbar: THEME_PRESETS.luxury.navbar,
    buttons: THEME_PRESETS.luxury.buttons,
    banners: THEME_PRESETS.luxury.banners,
    categoryBar: THEME_PRESETS.luxury.categoryBar,
    topBar: THEME_PRESETS.luxury.topBar,
    announcementBar: THEME_PRESETS.luxury.announcementBar,
  },
  {
    id: 'fresh', label: 'Fresh', swatch: '#0B7A4E',
    colors: THEME_PRESETS.fresh.colors,
    navbar: THEME_PRESETS.fresh.navbar,
    buttons: THEME_PRESETS.fresh.buttons,
    banners: THEME_PRESETS.fresh.banners,
    categoryBar: THEME_PRESETS.fresh.categoryBar,
    topBar: THEME_PRESETS.fresh.topBar,
    announcementBar: THEME_PRESETS.fresh.announcementBar,
  },
  {
    id: 'tech', label: 'Tech', swatch: '#2563EB',
    colors: THEME_PRESETS.tech.colors,
    navbar: THEME_PRESETS.tech.navbar,
    buttons: THEME_PRESETS.tech.buttons,
    banners: THEME_PRESETS.tech.banners,
    categoryBar: THEME_PRESETS.tech.categoryBar,
    topBar: THEME_PRESETS.tech.topBar,
    announcementBar: THEME_PRESETS.tech.announcementBar,
  },
  {
    id: 'warm', label: 'Warm', swatch: '#C2410C',
    colors: THEME_PRESETS.warm.colors,
    navbar: THEME_PRESETS.warm.navbar,
    buttons: THEME_PRESETS.warm.buttons,
    banners: THEME_PRESETS.warm.banners,
    categoryBar: THEME_PRESETS.warm.categoryBar,
    topBar: THEME_PRESETS.warm.topBar,
    announcementBar: THEME_PRESETS.warm.announcementBar,
  },
];

type PresetEntry = typeof COLOR_PRESETS[number];

function ColorPresetsGrid({ current, onSelect }: {
  current: StoreTheme['colors'];
  onSelect: (preset: PresetEntry) => void;
}) {
  const activeId = COLOR_PRESETS.find((p) => p.colors.primary === current.primary)?.id ?? null;

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {COLOR_PRESETS.map((preset) => {
        const isActive = activeId === preset.id;
        return (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            title={preset.label}
            className={cn(
              'flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl transition-all',
              isActive
                ? 'bg-emerald-500/12 ring-1 ring-emerald-500/60'
                : 'bg-[#141419] hover:bg-[#18181E] ring-1 ring-transparent hover:ring-[#28283A]',
            )}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{
                backgroundColor: preset.swatch,
                boxShadow: isActive ? `0 0 0 2px #10B981` : undefined,
              }}
            />
            <span className={cn('text-[9px] font-semibold text-center leading-tight', isActive ? 'text-emerald-400' : 'text-[#5A5A70]')}>
              {preset.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── LAYOUT + MODELO DE NEGOCIO ───────────────────────────────────────────────
// Estos van en el tab "Home", debajo del drag-and-drop de secciones

const LAYOUTS: Array<{ id: LayoutMode; label: string; desc: string }> = [
  { id: 'default',   label: 'Default',    desc: 'Hero full + grid asimétrico' },
  { id: 'centered',  label: 'Centrado',   desc: 'Máx 960px, centrado'        },
  { id: 'editorial', label: 'Editorial',  desc: 'Col principal + sidebar'     },
  { id: 'fullwidth', label: 'Full Width', desc: 'Sin límites, inmersivo'       },
];

// ─── Presets completos por modelo de negocio ─────────────────────────────────
// Cada modelo define layout, paleta, tipografía, tarjetas y layout settings

type FullBusinessPreset = {
  layout: LayoutMode;
  colorPresetId: string;
  accentColor: string;
  label: string;
  emoji: string;
  font: string;
  fontUrl: string;
  fontStack?: string;
  tags: string[];
  desc: string;
  navbarVariant: NonNullable<StoreTheme['navbar']['variant']>;
  productCards: Partial<StoreTheme['productCards']>;
  buttons: Partial<StoreTheme['buttons']>;
  banners: Partial<StoreTheme['banners']>;
  layoutSettings: NonNullable<StoreTheme['layoutSettings']>;
};

const FULL_BUSINESS_PRESETS: Record<BusinessModel, FullBusinessPreset> = {
  general: {
    layout: 'default',
    colorPresetId: 'default',
    accentColor: '#0D6E6E',
    label: 'General',
    emoji: '🛒',
    font: 'Inter',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    tags: ['4 col', 'Default', 'Inter'],
    desc: 'Producto primero (Amazon)',
    navbarVariant: 'classic',
    productCards: {
      variant: 'classic', borderRadius: '12px', shadow: true,
      hoverEffect: 'zoom', imageAspect: 'auto', imageHeight: '200px',
      buttonStyle: 'rounded', showBadge: true, showRating: true,
      showWishlist: true, showStock: true, showCategory: true,
    },
    buttons: { borderRadius: '6px', hoverEffect: 'fade', shadow: false },
    banners: { borderRadius: '0px', textColor: '#FFFFFF' },
    layoutSettings: { default: { heroHeight: '480px', containerMaxWidth: '1320px', sectionGap: '2rem' } },
  },

  sport: {
    layout: 'fullwidth',
    colorPresetId: 'bold',
    accentColor: '#E63946',
    label: 'Sport',
    emoji: '👟',
    font: 'Bebas Neue',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    tags: ['100vh', 'Full Width', 'Bebas Neue'],
    desc: 'Hero fuerte, branding (Nike)',
    navbarVariant: 'bold',
    productCards: {
      variant: 'overlay', borderRadius: '0px', shadow: false,
      hoverEffect: 'zoom', imageAspect: 'portrait', imageHeight: '300px',
      buttonStyle: 'square', showBadge: true, showRating: false,
      showWishlist: false, showStock: false, showCategory: false,
    },
    buttons: { borderRadius: '0px', hoverEffect: 'scale', shadow: true },
    banners: { borderRadius: '0px', textColor: '#FFFFFF' },
    layoutSettings: { fullwidth: { heroHeight: '100vh', paddingX: '0px' } },
  },

  fashion: {
    layout: 'centered',
    colorPresetId: 'minimal',
    accentColor: '#111111',
    label: 'Fashion',
    emoji: '👗',
    font: 'Playfair Display',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap',
    tags: ['90vh', 'Centrado', 'Playfair'],
    desc: 'Visual, editorial (Zara)',
    navbarVariant: 'centered',
    productCards: {
      variant: 'minimal', borderRadius: '0px', shadow: false,
      hoverEffect: 'lift', imageAspect: 'portrait', imageHeight: '320px',
      buttonStyle: 'pill', showBadge: false, showRating: false,
      showWishlist: true, showStock: false, showCategory: false,
    },
    buttons: { borderRadius: '24px', hoverEffect: 'fade', shadow: false },
    banners: { borderRadius: '0px', textColor: '#FFFFFF' },
    layoutSettings: { centered: { heroHeight: '90vh', containerMaxWidth: '960px', paddingX: '4rem' } },
  },

  food: {
    layout: 'default',
    colorPresetId: 'warm',
    accentColor: '#C2410C',
    label: 'Food',
    emoji: '🍔',
    font: 'Nunito',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap',
    tags: ['420px', 'Default', 'Nunito'],
    desc: 'Imágenes apetitosas (Rappi)',
    navbarVariant: 'stacked',
    productCards: {
      variant: 'classic', borderRadius: '20px', shadow: true,
      hoverEffect: 'lift', imageAspect: 'square', imageHeight: '180px',
      buttonStyle: 'pill', showBadge: true, showRating: true,
      showWishlist: false, showStock: true, showCategory: true,
    },
    buttons: { borderRadius: '24px', hoverEffect: 'lift', shadow: false },
    banners: { borderRadius: '16px', textColor: '#FFFFFF' },
    layoutSettings: { default: { heroHeight: '420px', containerMaxWidth: '1200px', sectionGap: '1.5rem' } },
  },

  street: {
    layout: 'editorial',
    colorPresetId: 'minimal',
    accentColor: '#1A1A1A',
    label: 'Street',
    emoji: '🧢',
    font: 'Anton',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Anton&display=swap',
    tags: ['640px', 'Editorial', 'Anton'],
    desc: 'Minimal extremo (Supreme)',
    navbarVariant: 'minimal',
    productCards: {
      variant: 'overlay', borderRadius: '0px', shadow: false,
      hoverEffect: 'zoom', imageAspect: 'portrait', imageHeight: '340px',
      buttonStyle: 'square', showBadge: false, showRating: false,
      showWishlist: false, showStock: false, showCategory: false,
    },
    buttons: { borderRadius: '0px', hoverEffect: 'none', shadow: false },
    banners: { borderRadius: '0px', textColor: '#FFFFFF' },
    layoutSettings: { editorial: { heroHeight: '640px', sidebarWidth: '300px', sidebarPosition: 'right', sidebarBg: '#111111' } },
  },

  marketplace: {
    layout: 'fullwidth',
    colorPresetId: 'tech',
    accentColor: '#2563EB',
    label: 'Marketplace',
    emoji: '🛍️',
    font: 'Inter',
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    tags: ['300px', 'Full Width', 'Compacto'],
    desc: 'Categorías primero (MercadoLibre)',
    navbarVariant: 'horizontal',
    productCards: {
      variant: 'compact', borderRadius: '8px', shadow: false,
      hoverEffect: 'none', imageAspect: 'square', imageHeight: '120px',
      buttonStyle: 'rounded', showBadge: true, showRating: true,
      showWishlist: false, showStock: true, showCategory: true,
    },
    buttons: { borderRadius: '4px', hoverEffect: 'fade', shadow: false },
    banners: { borderRadius: '8px', textColor: '#FFFFFF' },
    layoutSettings: { fullwidth: { heroHeight: '300px', paddingX: '1rem' } },
  },
};

const HERO_HEIGHT_OPTIONS = [
  { value: '320px', label: '320px — compacto'       },
  { value: '420px', label: '420px'                  },
  { value: '480px', label: '480px'                  },
  { value: '520px', label: '520px — default'        },
  { value: '580px', label: '580px'                  },
  { value: '640px', label: '640px — grande'         },
  { value: '720px', label: '720px'                  },
  { value: '80vh',  label: '80vh — relativo'        },
  { value: '90vh',  label: '90vh'                   },
  { value: '100vh', label: '100vh — pantalla completa' },
];

const SIDEBAR_WIDTH_OPTIONS = [
  { value: '280px', label: '280px — estrecho' },
  { value: '320px', label: '320px'            },
  { value: '360px', label: '360px — default'  },
  { value: '400px', label: '400px'            },
  { value: '440px', label: '440px — ancho'   },
];

function LayoutSpecificSettings({
  theme,
  update,
}: {
  theme: StoreTheme;
  update: (patch: Partial<StoreTheme>) => void;
}) {
  const layout = theme.layout ?? 'default';
  const ls = theme.layoutSettings ?? {};

  const patchLayout = (key: 'default' | 'centered' | 'editorial' | 'fullwidth', value: Record<string, unknown>) => {
    update({
      layoutSettings: { ...ls, [key]: { ...(ls[key] as Record<string, unknown> ?? {}), ...value } },
    } as unknown as Partial<StoreTheme>);
  };

  const def  = (ls.default   ?? {}) as Record<string, string>;
  const cen  = (ls.centered  ?? {}) as Record<string, string>;
  const ed   = (ls.editorial ?? {}) as Record<string, string>;
  const fw   = (ls.fullwidth ?? {}) as Record<string, string>;

  return (
    <div className="space-y-2">
      <Divider icon={SlidersHorizontal} label="Configuración del layout activo" />

      {layout === 'default' && (
        <Group>
          <Select
            label="Altura del hero"
            value={def.heroHeight || '520px'}
            options={HERO_HEIGHT_OPTIONS}
            onChange={(v) => patchLayout('default', { heroHeight: v })}
          />
          <Sep />
          <div className="space-y-1">
            <p className="text-[10px] text-[#686878]">Ancho máximo del contenedor</p>
            <TextInput value={def.containerMaxWidth || '1320px'} onChange={(v) => patchLayout('default', { containerMaxWidth: v })} placeholder="1320px" />
          </div>
        </Group>
      )}

      {layout === 'centered' && (
        <Group>
          <Select
            label="Altura del hero"
            value={cen.heroHeight || '420px'}
            options={HERO_HEIGHT_OPTIONS}
            onChange={(v) => patchLayout('centered', { heroHeight: v })}
          />
          <Sep />
          <div className="space-y-1">
            <p className="text-[10px] text-[#686878]">Ancho máximo</p>
            <TextInput value={cen.containerMaxWidth || '960px'} onChange={(v) => patchLayout('centered', { containerMaxWidth: v })} placeholder="960px" />
          </div>
          <Sep />
          <div className="space-y-1">
            <p className="text-[10px] text-[#686878]">Padding horizontal</p>
            <TextInput value={cen.paddingX || '3rem'} onChange={(v) => patchLayout('centered', { paddingX: v })} placeholder="3rem" />
          </div>
        </Group>
      )}

      {layout === 'editorial' && (
        <Group>
          <Select
            label="Altura del hero"
            value={ed.heroHeight || '580px'}
            options={HERO_HEIGHT_OPTIONS}
            onChange={(v) => patchLayout('editorial', { heroHeight: v })}
          />
          <Sep />
          <Select
            label="Posición del sidebar"
            value={ed.sidebarPosition || 'right'}
            options={[{ value: 'right', label: 'Derecha' }, { value: 'left', label: 'Izquierda' }]}
            onChange={(v) => patchLayout('editorial', { sidebarPosition: v as 'left' | 'right' })}
          />
          <Sep />
          <Select
            label="Ancho del sidebar"
            value={ed.sidebarWidth || '360px'}
            options={SIDEBAR_WIDTH_OPTIONS}
            onChange={(v) => patchLayout('editorial', { sidebarWidth: v })}
          />
          <Sep />
          <ColorRow
            label="Fondo del sidebar"
            value={ed.sidebarBg || '#F8F9FA'}
            onChange={(v) => patchLayout('editorial', { sidebarBg: v })}
          />
        </Group>
      )}

      {layout === 'fullwidth' && (
        <Group>
          <Select
            label="Altura del hero"
            value={fw.heroHeight || '640px'}
            options={HERO_HEIGHT_OPTIONS}
            onChange={(v) => patchLayout('fullwidth', { heroHeight: v })}
          />
          <Sep />
          <div className="space-y-1">
            <p className="text-[10px] text-[#686878]">Padding lateral de secciones</p>
            <TextInput value={fw.paddingX || '0px'} onChange={(v) => patchLayout('fullwidth', { paddingX: v })} placeholder="0px" />
          </div>
        </Group>
      )}
    </div>
  );
}

function LayoutSection({
  theme,
  update,
}: {
  theme: StoreTheme;
  update: (patch: Partial<StoreTheme>) => void;
}) {
  const currentLayout = theme.layout ?? 'default';
  return (
    <div className="space-y-2">
      <Divider icon={LayoutGrid} label="Layout de página" />
      <div className="grid grid-cols-2 gap-2">
        {LAYOUTS.map(({ id, label, desc }) => {
          const active = currentLayout === id;
          return (
            <button
              key={id}
              onClick={() => update({ layout: id })}
              className={cn(
                'flex flex-col gap-1 p-2.5 rounded-xl text-left transition-all',
                active
                  ? 'bg-emerald-500/10 ring-1 ring-emerald-500/60'
                  : 'bg-[#141419] ring-1 ring-transparent hover:bg-[#18181E] hover:ring-[#28283A]',
              )}
            >
              <span className={cn('text-[11px] font-bold', active ? 'text-emerald-400' : 'text-[#C8C8DC]')}>{label}</span>
              <span className="text-[9px] leading-tight text-[#5A5A70]">{desc}</span>
            </button>
          );
        })}
      </div>
      <LayoutPreview current={currentLayout} />
      <LayoutSpecificSettings theme={theme} update={update} />
    </div>
  );
}

function BusinessModelSection({
  theme,
  update,
}: {
  theme: StoreTheme;
  update: (patch: Partial<StoreTheme>) => void;
}) {
  const currentModel = theme.businessModel ?? 'general';

  const handleModelSelect = (id: BusinessModel) => {
    const fp = FULL_BUSINESS_PRESETS[id];
    const colorPreset = COLOR_PRESETS.find((p) => p.id === fp.colorPresetId)!;

    update({
      businessModel: id,
      layout: fp.layout,
      // Colors from preset
      colors: { ...theme.colors, ...colorPreset.colors },
      // Typography — font + URL
      typography: {
        ...theme.typography,
        fontFamily: fp.font,
        fontUrl: fp.fontUrl,
      },
      // Product cards — full override
      productCards: { ...theme.productCards, ...fp.productCards },
      // Layout settings — merge so other layouts keep their settings
      layoutSettings: { ...theme.layoutSettings, ...fp.layoutSettings },
      // Navbar variant from model + colors from preset
      navbar: { ...theme.navbar, ...(colorPreset.navbar ?? {}), variant: fp.navbarVariant },
      buttons: { ...theme.buttons, ...(colorPreset.buttons ?? {}), ...fp.buttons },
      banners: { ...theme.banners, ...(colorPreset.banners ?? {}), ...fp.banners },
      ...(colorPreset.categoryBar ? { categoryBar: { ...theme.categoryBar, ...colorPreset.categoryBar } } : {}),
      ...(colorPreset.topBar ? { topBar: { ...theme.topBar, ...colorPreset.topBar } } : {}),
      ...(colorPreset.announcementBar ? { announcementBar: { ...theme.announcementBar, ...colorPreset.announcementBar } } : {}),
    } as unknown as Partial<StoreTheme>);
  };

  return (
    <div className="space-y-2">
      <Divider icon={Store} label="Modelo de negocio" />
      <p className="text-[9px] text-[#5A5A70] px-1 -mt-1">
        Aplica layout, paleta, tipografía y tarjetas únicos para cada modelo.
      </p>
      <div className="space-y-1.5">
        {(Object.entries(FULL_BUSINESS_PRESETS) as Array<[BusinessModel, FullBusinessPreset]>).map(([id, fp]) => {
          const active = currentModel === id;
          return (
            <button
              key={id}
              onClick={() => handleModelSelect(id)}
              className={cn(
                'w-full flex items-center gap-0 rounded-xl text-left transition-all overflow-hidden',
                active
                  ? 'ring-1 ring-emerald-500/70'
                  : 'ring-1 ring-transparent hover:ring-[#28283A]',
              )}
            >
              {/* Color strip */}
              <div
                className="w-1.5 self-stretch flex-shrink-0"
                style={{ backgroundColor: fp.accentColor }}
              />
              {/* Content */}
              <div className={cn(
                'flex-1 flex items-center gap-3 px-3 py-2.5',
                active ? 'bg-emerald-500/10' : 'bg-[#141419] hover:bg-[#18181E]',
              )}>
                <span className="text-base flex-shrink-0">{fp.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-[11px] font-bold leading-none', active ? 'text-emerald-400' : 'text-[#C8C8DC]')}>
                    {fp.label}
                  </p>
                  <p className="text-[9px] text-[#5A5A70] mt-0.5 truncate">{fp.desc}</p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {fp.tags.map((tag) => (
                      <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded-md bg-[#1E1E2A] text-[#44445A] font-mono leading-none">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {active && <span className="text-[10px] font-black text-emerald-400 flex-shrink-0">✓</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Preview visual del layout seleccionado
function LayoutPreview({ current }: { current: LayoutMode }) {
  return (
    <div className="rounded-xl bg-[#0C0C10] p-3 h-[80px] flex gap-2 overflow-hidden">
      {current === 'default' && (
        <>
          <div className="flex-1 rounded-md bg-[#252534]" />
          <div className="flex-1 rounded bg-[#1C1C28]" />
        </>
      )}
      {current === 'centered' && (
        <div className="flex-1 flex flex-col items-center gap-1 px-4">
          <div className="w-3/4 h-2 rounded bg-[#252534]" />
          <div className="flex gap-1 w-full justify-center">
            {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded bg-[#1C1C28]" />)}
          </div>
        </div>
      )}
      {current === 'editorial' && (
        <>
          <div className="w-2/3 rounded-md bg-[#252534]" />
          <div className="flex flex-col gap-1 w-1/3">
            <div className="flex-1 rounded bg-[#1C1C28]" />
            <div className="flex-1 rounded bg-[#1C1C28]" />
          </div>
        </>
      )}
      {current === 'fullwidth' && (
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-5 rounded bg-[#252534]" />
          <div className="flex gap-1 flex-1">
            {[1,2,3,4].map(i => <div key={i} className="flex-1 rounded bg-[#1C1C28]" />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ColorsTab ────────────────────────────────────────────────────────────────
// Ahora con swatches de presets primero, luego pickers individuales

function ColorsTab({ theme, patch, update }: {
  theme: StoreTheme;
  patch: (p: Partial<StoreTheme['colors']>) => void;
  update: (p: Partial<StoreTheme>) => void;
}) {
  const handlePresetSelect = (preset: PresetEntry) => {
    update({
      colors: { ...theme.colors, ...preset.colors },
      ...(preset.navbar          ? { navbar:          { ...theme.navbar,          ...preset.navbar          } } : {}),
      ...(preset.buttons         ? { buttons:         { ...theme.buttons,         ...preset.buttons         } } : {}),
      ...(preset.banners         ? { banners:         { ...theme.banners,         ...preset.banners         } } : {}),
      ...(preset.categoryBar     ? { categoryBar:     { ...theme.categoryBar,     ...preset.categoryBar     } } : {}),
      ...(preset.topBar          ? { topBar:          { ...theme.topBar,          ...preset.topBar          } } : {}),
      ...(preset.announcementBar ? { announcementBar: { ...theme.announcementBar, ...preset.announcementBar } } : {}),
    });
  };

  return (
    <div className="space-y-2">

      {/* Paletas rápidas */}
      <Divider icon={Sparkles} label="Paletas predefinidas" />
      <ColorPresetsGrid current={theme.colors} onSelect={handlePresetSelect} />

      {/* Color primario + secundario */}
      <Divider icon={Palette} label="Acento" />
      <Group>
        <ColorRow label="Primario"   value={theme.colors.primary}   onChange={(v) => patch({ primary: v })}   />
        <Sep />
        <ColorRow label="Secundario" value={theme.colors.secondary} onChange={(v) => patch({ secondary: v })} />
      </Group>

      {/* Fondos */}
      <Divider icon={Layout} label="Fondos" />
      <Group>
        <ColorRow label="Fondo"      value={theme.colors.background} onChange={(v) => patch({ background: v })} />
        <Sep />
        <ColorRow label="Superficie" value={theme.colors.surface}    onChange={(v) => patch({ surface: v })}    />
        <Sep />
        <ColorRow label="Borde"      value={theme.colors.border}     onChange={(v) => patch({ border: v })}     />
      </Group>

      {/* Texto */}
      <Divider icon={Type} label="Texto" />
      <Group>
        <ColorRow label="Principal"  value={theme.colors.text}      onChange={(v) => patch({ text: v })}      />
        <Sep />
        <ColorRow label="Secundario" value={theme.colors.textMuted} onChange={(v) => patch({ textMuted: v })} />
      </Group>

      {/* Estados */}
      <Divider icon={SlidersHorizontal} label="Estados" />
      <Group>
        <ColorRow label="Éxito"       value={theme.colors.success} onChange={(v) => patch({ success: v })} />
        <Sep />
        <ColorRow label="Error"       value={theme.colors.error}   onChange={(v) => patch({ error: v })}   />
        <Sep />
        <ColorRow label="Advertencia" value={theme.colors.warning} onChange={(v) => patch({ warning: v })} />
      </Group>
    </div>
  );
}

// ─── Resto de tabs (sin cambios) ──────────────────────────────────────────────

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

// ─── Navbar variant picker ────────────────────────────────────────────────────

type NavbarVariantId = NonNullable<StoreTheme['navbar']['variant']>;

const NAVBAR_VARIANTS: Array<{ id: NavbarVariantId; label: string; desc: string }> = [
  { id: 'classic',    label: 'Clásico',    desc: 'Top bar + logo + barra de nav' },
  { id: 'horizontal', label: 'Horizontal', desc: 'Todo en una sola fila'         },
  { id: 'centered',   label: 'Centrado',   desc: 'Logo centrado, links abajo'    },
  { id: 'bold',       label: 'Bold',       desc: 'Header con fondo de acento'    },
  { id: 'minimal',    label: 'Minimal',    desc: 'Solo logo e iconos'            },
  { id: 'stacked',    label: 'Apilado',    desc: 'Anuncio + búsqueda grande'     },
];

function NavbarVariantPreview({ id, accent }: { id: NavbarVariantId; accent: string }) {
  const bg = '#1C1C28';
  const dim = '#2A2A3A';
  const dimLt = '#353548';

  if (id === 'classic') return (
    <div className="w-full h-full flex flex-col gap-px p-1 overflow-hidden">
      <div className="h-1.5 rounded-sm w-full" style={{ backgroundColor: dim }} />
      <div className="flex items-center gap-1 flex-1">
        <div className="w-3.5 h-2.5 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="flex-1 h-2 rounded-sm" style={{ backgroundColor: dim }} />
        <div className="flex gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
        </div>
      </div>
      <div className="flex items-center gap-1 h-2.5 rounded-sm px-1" style={{ backgroundColor: accent + '30' }}>
        <div className="w-2.5 h-1.5 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
      </div>
      <div className="h-1 rounded-sm w-full" style={{ backgroundColor: accent + '60' }} />
    </div>
  );

  if (id === 'horizontal') return (
    <div className="w-full h-full flex flex-col gap-px p-1">
      <div className="h-1.5 rounded-sm w-full" style={{ backgroundColor: dim }} />
      <div className="flex items-center gap-1 flex-1">
        <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="w-px h-3 mx-0.5" style={{ backgroundColor: dimLt }} />
        <div className="w-2 h-1.5 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="flex-1" />
        <div className="w-5 h-2 rounded-sm" style={{ backgroundColor: dim }} />
        <div className="flex gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
        </div>
      </div>
    </div>
  );

  if (id === 'centered') return (
    <div className="w-full h-full flex flex-col gap-px p-1">
      <div className="flex items-center flex-1">
        <div className="w-2 h-1 rounded-sm" style={{ backgroundColor: dim }} />
        <div className="flex-1 flex justify-center">
          <div className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: dimLt }} />
        </div>
        <div className="flex gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
        </div>
      </div>
      <div className="h-px w-full" style={{ backgroundColor: dimLt }} />
      <div className="flex items-center justify-center gap-1 h-3">
        <div className="w-2 h-1 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="w-px h-2" style={{ backgroundColor: dim }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="w-6 h-2 rounded-full" style={{ backgroundColor: dim }} />
      </div>
    </div>
  );

  if (id === 'bold') return (
    <div className="w-full h-full flex flex-col gap-px p-1">
      <div className="h-1.5 rounded-sm w-full" style={{ backgroundColor: dim }} />
      <div className="flex items-center gap-1 flex-1 rounded-sm px-1" style={{ backgroundColor: accent + '50' }}>
        <div className="w-3 h-2 rounded-sm bg-white/20" />
        <div className="flex-1 h-2 rounded-sm bg-white/15" />
        <div className="flex gap-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="flex items-center gap-1 h-2.5 rounded-sm px-1" style={{ backgroundColor: dim }}>
        <div className="w-2.5 h-1.5 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
      </div>
    </div>
  );

  if (id === 'minimal') return (
    <div className="w-full h-full flex items-center gap-1 p-1">
      <div className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: dimLt }} />
      <div className="flex-1" />
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
      <div className="flex flex-col gap-px">
        <div className="w-2 h-px rounded" style={{ backgroundColor: dimLt }} />
        <div className="w-2 h-px rounded" style={{ backgroundColor: dimLt }} />
        <div className="w-2 h-px rounded" style={{ backgroundColor: dimLt }} />
      </div>
    </div>
  );

  if (id === 'stacked') return (
    <div className="w-full h-full flex flex-col gap-px p-1">
      <div className="flex items-center justify-center h-2 rounded-sm" style={{ backgroundColor: accent + '60' }}>
        <div className="w-8 h-1 rounded-sm bg-white/30" />
      </div>
      <div className="flex items-center gap-1 flex-1">
        <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: dim }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dimLt }} />
      </div>
      <div className="flex items-center gap-1 h-2.5 rounded-sm px-1" style={{ backgroundColor: accent + '30' }}>
        <div className="w-2.5 h-1.5 rounded-sm" style={{ backgroundColor: accent }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
        <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: dimLt }} />
      </div>
    </div>
  );

  return null;
}

function NavbarVariantPicker({ value, accent, onChange }: {
  value: NavbarVariantId;
  accent: string;
  onChange: (v: NavbarVariantId) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {NAVBAR_VARIANTS.map(({ id, label, desc }) => {
        const selected = value === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className={cn(
              'group text-left rounded-xl p-1.5 pb-2 transition-all',
              selected
                ? 'bg-emerald-500/10 ring-1 ring-emerald-500/60'
                : 'bg-[#141419] hover:bg-[#18181E] ring-1 ring-transparent hover:ring-[#28283A]',
            )}>
            <div className="rounded-lg overflow-hidden mb-1.5 h-[52px] bg-[#0C0C10]">
              <NavbarVariantPreview id={id} accent={accent} />
            </div>
            <p className={cn('text-[10px] font-semibold leading-none', selected ? 'text-emerald-400' : 'text-[#C8C8DC]')}>
              {label}
            </p>
            <p className="text-[8px] text-[#5A5A70] mt-0.5 leading-tight">{desc}</p>
          </button>
        );
      })}
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
      <Divider icon={Layout} label="Diseño de navbar" />
      <NavbarVariantPicker
        value={theme.navbar.variant || 'classic'}
        accent={theme.navbar.activeColor}
        onChange={(v) => patch({ variant: v })}
      />
      <Divider icon={Layout} label="Header principal" />
      <Group>
        <ColorRow label="Fondo"   value={theme.navbar.backgroundColor} onChange={(v) => patch({ backgroundColor: v })} />
        <Sep />
        <ColorRow label="Texto"   value={theme.navbar.textColor}       onChange={(v) => patch({ textColor: v })}       />
        <Sep />
        <ColorRow label="Acento"  value={theme.navbar.activeColor}     onChange={(v) => patch({ activeColor: v })}     />
        <Sep />
        <Toggle label="Sticky"   description="Se fija al scroll" value={theme.navbar.sticky}     onChange={(v) => patch({ sticky: v })}     />
        <Sep />
        <Toggle label="Búsqueda" description="Mostrar barra"    value={theme.navbar.showSearch}  onChange={(v) => patch({ showSearch: v })} />
      </Group>
      <Divider icon={Rows3} label="Barra superior" />
      <Group>
        <Toggle label="Visible" value={theme.topBar.visible} onChange={(v) => patchTopBar({ visible: v })} />
        {theme.topBar.visible && (
          <>
            <Sep />
            <ColorRow label="Fondo" value={theme.topBar.backgroundColor} onChange={(v) => patchTopBar({ backgroundColor: v })} />
            <Sep />
            <ColorRow label="Texto" value={theme.topBar.textColor}       onChange={(v) => patchTopBar({ textColor: v })}       />
          </>
        )}
      </Group>
      <Divider icon={AlignJustify} label="Barra de categorías" />
      <Group>
        <Toggle label="Visible" value={theme.categoryBar.visible} onChange={(v) => patchCategoryBar({ visible: v })} />
        {theme.categoryBar.visible && (
          <>
            <Sep />
            <ColorRow label="Fondo"  value={theme.categoryBar.backgroundColor} onChange={(v) => patchCategoryBar({ backgroundColor: v })} />
            <Sep />
            <ColorRow label="Texto"  value={theme.categoryBar.textColor}       onChange={(v) => patchCategoryBar({ textColor: v })}       />
            <Sep />
            <ColorRow label="Botón"  value={theme.categoryBar.buttonColor}     onChange={(v) => patchCategoryBar({ buttonColor: v })}     />
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
            <ColorRow label="Texto" value={theme.announcementBar.textColor}       onChange={(v) => patchAnnouncement({ textColor: v })}       />
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

const CARD_VARIANTS: Array<{ id: StoreTheme['productCards']['variant']; label: string; desc: string; Preview: React.FC }> = [
  { id: 'classic', label: 'Classic', desc: 'Imagen + info + botón',    Preview: PreviewClassic },
  { id: 'minimal', label: 'Minimal', desc: 'Sin borde, botón al hover', Preview: PreviewMinimal },
  { id: 'overlay', label: 'Overlay', desc: 'Info sobre la imagen',      Preview: PreviewOverlay },
  { id: 'compact', label: 'Compact', desc: 'Horizontal (lista)',         Preview: PreviewCompact },
];

function VariantPicker({ value, onChange }: { value: StoreTheme['productCards']['variant']; onChange: (v: StoreTheme['productCards']['variant']) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {CARD_VARIANTS.map(({ id, label, desc, Preview }) => {
        const selected = value === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className={cn('group text-left rounded-xl p-2 transition-all', selected ? 'bg-emerald-500/10 ring-1 ring-emerald-500/60' : 'bg-[#141419] hover:bg-[#18181E] ring-1 ring-transparent hover:ring-[#28283A]')}>
            <div className="rounded-lg overflow-hidden mb-1.5 h-[72px] flex items-center justify-center bg-[#0C0C10]">
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
        <div className="h-1 w-2/3 bg-[#2A2A34] rounded-sm" />
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
          { value: 'auto', label: 'Auto (altura fija)' }, { value: 'square', label: 'Cuadrada 1:1' },
          { value: 'portrait', label: 'Vertical 3:4' },   { value: 'landscape', label: 'Horizontal 4:3' },
        ]} onChange={(v) => patch({ imageAspect: v })} />
      </Group>
      <Divider icon={MousePointerClick} label="Botón" />
      <Group>
        <Select label="Estilo del botón" value={cfg.buttonStyle} options={[
          { value: 'rounded', label: 'Redondeado' }, { value: 'pill', label: 'Píldora' }, { value: 'square', label: 'Cuadrado' },
        ]} onChange={(v) => patch({ buttonStyle: v })} />
      </Group>
      <Divider icon={Sparkles} label="Interacción" />
      <Group>
        <Select label="Efecto hover" value={cfg.hoverEffect} options={[
          { value: 'zoom', label: 'Zoom a la imagen' }, { value: 'lift', label: 'Elevar tarjeta' }, { value: 'none', label: 'Sin efecto' },
        ]} onChange={(v) => patch({ hoverEffect: v })} />
        <Sep />
        <Toggle label="Sombra al hover" value={cfg.shadow} onChange={(v) => patch({ shadow: v })} />
      </Group>
      <Divider icon={Eye} label="Elementos visibles" />
      <Group>
        <Toggle label="Badge (HOT/NEW/SALE)"  value={cfg.showBadge}    onChange={(v) => patch({ showBadge: v })}    />
        <Sep /><Toggle label="Wishlist (corazón)"    value={cfg.showWishlist} onChange={(v) => patch({ showWishlist: v })} />
        <Sep /><Toggle label="Categoría"             value={cfg.showCategory} onChange={(v) => patch({ showCategory: v })} />
        <Sep /><Toggle label="Rating (estrellas)"    value={cfg.showRating}   onChange={(v) => patch({ showRating: v })}   />
        <Sep /><Toggle label="Indicador de stock"    value={cfg.showStock}    onChange={(v) => patch({ showStock: v })}    />
      </Group>
    </div>
  );
}

function LoginTab({ theme, patch }: { theme: StoreTheme; patch: (p: Partial<StoreTheme['login']>) => void }) {
  return (
    <div className="space-y-2">
      <Divider icon={LogIn} label="Panel derecho" />
      <Group>
        <Select label="Tipo de fondo" value={theme.login.backgroundType} options={[
          { value: 'color', label: 'Color sólido' }, { value: 'image', label: 'Imagen' },
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

function ButtonsTab({ theme, patch }: { theme: StoreTheme; patch: (p: Partial<StoreTheme['buttons']>) => void }) {
  const cfg = theme.buttons || {};
  const hoverEffects = [
    { value: 'fade', label: 'Fade (desvanecimiento)' },
    { value: 'scale', label: 'Scale (escala)' },
    { value: 'lift', label: 'Lift (elevar)' },
    { value: 'none', label: 'Sin efecto' },
  ];
  const borderRadiusValues = [
    { value: '0px', label: 'Cuadrado' },
    { value: '4px', label: 'Ligeramente redondeado' },
    { value: '6px', label: 'Default (pequeño)' },
    { value: '8px', label: 'Redondeado' },
    { value: '12px', label: 'Muy redondeado' },
    { value: '24px', label: 'Píldora' },
  ];

  return (
    <div className="space-y-2">
      <Divider icon={Zap} label="Color y estilo" />
      <Group>
        <ColorRow label="Color primario" value={cfg.primaryColor || '#0D6E6E'} onChange={(v) => patch({ primaryColor: v })} />
        <Sep />
        <ColorRow label="Color hover" value={cfg.hoverColor || '#0A5555'} onChange={(v) => patch({ hoverColor: v })} />
      </Group>
      
      <Divider icon={SlidersHorizontal} label="Forma" />
      <Group>
        <Select label="Border radius" value={cfg.borderRadius || '6px'} options={borderRadiusValues}
          onChange={(v) => patch({ borderRadius: v })} />
      </Group>

      <Divider icon={Sparkles} label="Interacción" />
      <Group>
        <Select label="Efecto hover" value={cfg.hoverEffect || 'fade'} options={hoverEffects}
          onChange={(v) => patch({ hoverEffect: v as 'fade' | 'scale' | 'lift' | 'none' })} />
        <Sep />
        <Toggle label="Sombra" description="Agregar sombra al botón" value={cfg.shadow || false} onChange={(v) => patch({ shadow: v })} />
      </Group>

      <Divider icon={Eye} label="Preview" />
      <div className="rounded-xl bg-[#141419] px-4 py-4 flex gap-2">
        <button className="px-4 py-2 text-sm font-medium text-white rounded transition-all"
          style={{
            backgroundColor: cfg.primaryColor || '#0D6E6E',
            borderRadius: cfg.borderRadius || '6px',
            boxShadow: cfg.shadow ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cfg.hoverColor || '#0A5555'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = cfg.primaryColor || '#0D6E6E'}>
          Botón
        </button>
      </div>
    </div>
  );
}

const BANNER_PREVIEW_IMAGE = 'https://images.unsplash.com/photo-1583607314031-76f40f069cce?w=600&q=80';

const HERO_HEIGHT_OPTS = [
  { value: '300px', label: '300px' },
  { value: '380px', label: '380px' },
  { value: '420px', label: '420px' },
  { value: '480px', label: '480px' },
  { value: '520px', label: '520px' },
  { value: '580px', label: '580px' },
  { value: '640px', label: '640px' },
  { value: '720px', label: '720px' },
  { value: '80vh',  label: '80vh'  },
  { value: '90vh',  label: '90vh'  },
  { value: '100vh', label: '100vh — pantalla completa' },
];

const HERO_WIDTH_OPTS = [
  { value: '100%',   label: '100% — ancho completo' },
  { value: '1320px', label: '1320px'                },
  { value: '1200px', label: '1200px'                },
  { value: '1080px', label: '1080px'                },
  { value: '960px',  label: '960px'                 },
  { value: '800px',  label: '800px'                 },
  { value: '75%',    label: '75%'                   },
  { value: '60%',    label: '60%'                   },
];

const BRAND_BANNER_HEIGHT_OPTS = [
  { value: '100px', label: '100px — compacto' },
  { value: '140px', label: '140px'            },
  { value: '180px', label: '180px'            },
  { value: '200px', label: '200px'            },
  { value: '240px', label: '240px'            },
  { value: '280px', label: '280px'            },
  { value: '320px', label: '320px — grande'  },
];

const BORDER_RADIUS_OPTS = [
  { value: '0px',  label: 'Sin redondeo'             },
  { value: '4px',  label: 'Ligeramente redondeado'   },
  { value: '8px',  label: 'Redondeado'               },
  { value: '12px', label: 'Muy redondeado'           },
  { value: '16px', label: 'Extra redondeado'         },
];

function BannersTab({ theme, patch }: { theme: StoreTheme; patch: (p: Partial<StoreTheme['banners']>) => void }) {
  const cfg = theme.banners || {};
  const layout = theme.layout ?? 'default';
  const layoutHeroHeight = theme.layoutSettings?.[layout as keyof typeof theme.layoutSettings]?.heroHeight;
  const effectiveHeroHeight = cfg.heroHeight || layoutHeroHeight || '520px';

  return (
    <div className="space-y-2">

      {/* ── Hero principal ── */}
      <Divider icon={ImageIcon} label="Hero principal" />
      <Group>
        <Select
          label="Altura"
          value={effectiveHeroHeight}
          options={HERO_HEIGHT_OPTS}
          onChange={(v) => patch({ heroHeight: v })}
        />
        <Sep />
        <Select
          label="Anchura máxima"
          value={cfg.heroMaxWidth || '100%'}
          options={HERO_WIDTH_OPTS}
          onChange={(v) => patch({ heroMaxWidth: v })}
        />
        <Sep />
        <Select
          label="Border radius"
          value={cfg.borderRadius || '0px'}
          options={BORDER_RADIUS_OPTS}
          onChange={(v) => patch({ borderRadius: v })}
        />
      </Group>

      {/* ── Banner de marca ── */}
      <Divider icon={Layers} label="Banner de marca / categoría" />
      <Group>
        <Select
          label="Altura"
          value={cfg.brandBannerHeight || '200px'}
          options={BRAND_BANNER_HEIGHT_OPTS}
          onChange={(v) => patch({ brandBannerHeight: v })}
        />
      </Group>

      {/* ── Color y gradiente ── */}
      <Divider icon={Palette} label="Color de fondo (sin imagen)" />
      <Group>
        <ColorRow label="Color primario" value={cfg.primaryColor || '#0D6E6E'} onChange={(v) => patch({ primaryColor: v })} />
        <Sep />
        <div className="space-y-1">
          <p className="text-[10px] text-[#686878]">Gradiente CSS</p>
          <TextInput value={cfg.gradient || ''} onChange={(v) => patch({ gradient: v })} placeholder="linear-gradient(135deg, #0D6E6E 0%, #0A5555 100%)" />
        </div>
      </Group>

      <Divider icon={Type} label="Texto" />
      <Group>
        <ColorRow label="Color de texto" value={cfg.textColor || '#FFFFFF'} onChange={(v) => patch({ textColor: v })} />
      </Group>

      {/* ── Preview hero ── */}
      <Divider icon={Eye} label="Preview hero" />
      <div
        className="relative overflow-hidden mx-auto"
        style={{
          height: '120px',
          maxWidth: cfg.heroMaxWidth === '100%' ? '100%' : cfg.heroMaxWidth || '100%',
          borderRadius: cfg.borderRadius || '0px',
          backgroundColor: cfg.primaryColor || '#0D6E6E',
        }}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BANNER_PREVIEW_IMAGE})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 55%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <p className="text-sm font-bold leading-tight" style={{ color: cfg.textColor || '#FFFFFF' }}>Relojes Premium</p>
          <p className="text-[10px] mt-0.5" style={{ color: cfg.textColor || '#FFFFFF', opacity: 0.85 }}>Precisión y diseño atemporal.</p>
        </div>
      </div>

      {/* ── Preview brand banner ── */}
      <Divider icon={Eye} label="Preview banner de marca" />
      <div
        className="overflow-hidden flex items-center justify-center rounded-2xl"
        style={{
          height: cfg.brandBannerHeight || '200px',
          background: cfg.gradient || `linear-gradient(135deg, ${cfg.primaryColor || '#0D6E6E'} 0%, #1A1A1A 100%)`,
        }}
      >
        <p className="text-base font-bold" style={{ color: cfg.textColor || '#FFFFFF' }}>Colección destacada</p>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export function ThemeEditorPanel() {
  const isOpen           = useUIStore((s) => s.isThemeEditorOpen);
  const closeThemeEditor = useUIStore((s) => s.closeThemeEditor);
  const { theme, updateTheme, resetTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('branding');

  const patch = <K extends keyof StoreTheme>(key: K, value: Partial<StoreTheme[K]>) =>
    updateTheme({ [key]: value } as Parameters<typeof updateTheme>[0]);

  const activeTabInfo = TABS.find((t) => t.id === activeTab)!;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={closeThemeEditor} />}

      <div
        className={cn(
          'fixed top-0 right-0 h-full z-50 w-[320px] flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ backgroundColor: '#0C0C10', boxShadow: '-8px 0 32px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
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

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 p-2 shrink-0" style={{ borderBottom: '1px solid #181820' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={cn(
                'flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-medium transition-all duration-150',
                activeTab === id ? 'bg-emerald-500/12 text-emerald-400' : 'text-[#44445A] hover:text-[#8888A8] hover:bg-white/4',
              )}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab label */}
        <div className="flex items-center gap-2 px-4 h-8 shrink-0">
          <activeTabInfo.icon size={11} className="text-emerald-500" />
          <span className="text-[11px] font-semibold text-[#686888]">{activeTabInfo.label}</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          {activeTab === 'branding'   && <BrandingTab    theme={theme} patch={(v) => patch('branding', v)} />}
          {activeTab === 'colors'     && <ColorsTab      theme={theme} patch={(v) => patch('colors', v)} update={(p) => updateTheme(p as Parameters<typeof updateTheme>[0])} />}
          {activeTab === 'typography' && <TypographyTab  theme={theme} patch={(v) => patch('typography', v)} />}
          {activeTab === 'navbar'     && (
            <NavbarTab
              theme={theme}
              patch={(v) => patch('navbar', v)}
              patchTopBar={(v) => patch('topBar', v)}
              patchCategoryBar={(v) => patch('categoryBar', v)}
              patchAnnouncement={(v) => patch('announcementBar', v)}
            />
          )}
          {activeTab === 'buttons'    && <ButtonsTab     theme={theme} patch={(v) => patch('buttons', v)} />}
          {activeTab === 'banners'    && <BannersTab     theme={theme} patch={(v) => patch('banners', v)} />}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <LayoutSection
                theme={theme}
                update={(p) => updateTheme(p as Parameters<typeof updateTheme>[0])}
              />
              <BusinessModelSection
                theme={theme}
                update={(p) => updateTheme(p as Parameters<typeof updateTheme>[0])}
              />
            </div>
          )}
          {activeTab === 'home' && (
            <HomeSectionsTab
              sections={theme.homeSections}
              onChange={(next) => updateTheme({ homeSections: next } as Parameters<typeof updateTheme>[0])}
            />
          )}
          {activeTab === 'cards' && <CardsTab theme={theme} patch={(v) => patch('productCards', v)} />}
          {activeTab === 'login' && <LoginTab theme={theme} patch={(v) => patch('login', v)} />}
        </div>
      </div>
    </>
  );
}