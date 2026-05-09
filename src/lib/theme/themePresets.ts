import type { StoreTheme } from './theme.types';

/**
 * 8 Color Presets completos con valores coherentes para:
 * - Colores base (colors)
 * - Navbar (backgroundColor, textColor, hoverColor, etc.)
 * - Botones (primaryColor, hoverColor, effects)
 * - Banners (primaryColor, gradient, textColor, etc.)
 */

export const THEME_PRESETS: Record<
  'default' | 'dark' | 'minimal' | 'bold' | 'luxury' | 'fresh' | 'tech' | 'warm',
  {
    id: string;
    label: string;
    swatch: string;
    colors: Partial<StoreTheme['colors']>;
    navbar: Partial<StoreTheme['navbar']>;
    buttons: Partial<StoreTheme['buttons']>;
    banners: Partial<StoreTheme['banners']>;
    categoryBar: Partial<StoreTheme['categoryBar']>;
    topBar: Partial<StoreTheme['topBar']>;
    announcementBar: Partial<StoreTheme['announcementBar']>;
  }
> = {
  // ─── DEFAULT: Teal neutral, balanceado
  default: {
    id: 'default',
    label: 'Default',
    swatch: '#0D6E6E',
    colors: {
      primary: '#0D6E6E',
      secondary: '#1A1A1A',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#1A1A1A',
      textMuted: '#666666',
      border: '#E5E5E5',
    },
    navbar: {
      backgroundColor: '#FFFFFF',
      textColor: '#1A1A1A',
      activeColor: '#0D6E6E',
      hoverColor: '#E5E5E5',
      borderRadius: '0px',
      shadow: false,
    },
    buttons: {
      primaryColor: '#0D6E6E',
      hoverColor: '#0A5555',
      hoverEffect: 'fade',
      borderRadius: '6px',
      shadow: false,
    },
    banners: {
      primaryColor: '#0D6E6E',
      gradient: 'linear-gradient(135deg, #0D6E6E 0%, #0A5555 100%)',
      textColor: '#FFFFFF',
      opacity: 1,
      borderRadius: '0px',
    },
    categoryBar: { backgroundColor: '#1A1A1A', textColor: '#FFFFFF', buttonColor: '#0D6E6E' },
    topBar:       { backgroundColor: '#F5F5F5', textColor: '#666666' },
    announcementBar: { backgroundColor: '#0D6E6E', textColor: '#FFFFFF' },
  },

  // ─── DARK: Verde vivo sobre fondo oscuro
  dark: {
    id: 'dark',
    label: 'Dark',
    swatch: '#22C55E',
    colors: {
      primary: '#22C55E',
      secondary: '#16A34A',
      background: '#0F172A',
      surface: '#111827',
      text: '#F9FAFB',
      textMuted: '#9CA3AF',
      border: '#374151',
    },
    navbar: {
      backgroundColor: '#1E293B',
      textColor: '#F9FAFB',
      activeColor: '#22C55E',
      hoverColor: '#334155',
      borderRadius: '0px',
      shadow: true,
    },
    buttons: {
      primaryColor: '#22C55E',
      hoverColor: '#16A34A',
      hoverEffect: 'lift',
      borderRadius: '8px',
      shadow: true,
    },
    banners: {
      primaryColor: '#22C55E',
      gradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      textColor: '#F9FAFB',
      opacity: 0.95,
      borderRadius: '0px',
    },
    categoryBar: { backgroundColor: '#0F172A', textColor: '#F9FAFB', buttonColor: '#22C55E' },
    topBar:       { backgroundColor: '#1E293B', textColor: '#9CA3AF' },
    announcementBar: { backgroundColor: '#22C55E', textColor: '#0F172A' },
  },

  // ─── MINIMAL: Negro puro, máximo contraste
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    swatch: '#111111',
    colors: {
      primary: '#111111',
      secondary: '#333333',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#111111',
      textMuted: '#555555',
      border: '#E5E5E5',
    },
    navbar: {
      backgroundColor: '#FFFFFF',
      textColor: '#111111',
      activeColor: '#111111',
      hoverColor: '#F5F5F5',
      borderRadius: '0px',
      shadow: false,
    },
    buttons: {
      primaryColor: '#111111',
      hoverColor: '#333333',
      hoverEffect: 'none',
      borderRadius: '0px',
      shadow: false,
    },
    banners: {
      primaryColor: '#111111',
      gradient: 'linear-gradient(90deg, #111111 0%, #333333 100%)',
      textColor: '#FFFFFF',
      opacity: 1,
      borderRadius: '0px',
    },
    categoryBar: { backgroundColor: '#111111', textColor: '#FFFFFF', buttonColor: '#333333' },
    topBar:       { backgroundColor: '#FAFAFA', textColor: '#555555' },
    announcementBar: { backgroundColor: '#111111', textColor: '#FFFFFF' },
  },

  // ─── BOLD: Rojo energético, impactante
  bold: {
    id: 'bold',
    label: 'Bold',
    swatch: '#E63946',
    colors: {
      primary: '#E63946',
      secondary: '#C1121F',
      background: '#FFF8F8',
      surface: '#FFF0F1',
      text: '#1A0508',
      textMuted: '#7A3040',
      border: '#FCCDD1',
    },
    navbar: {
      backgroundColor: '#FFFFFF',
      textColor: '#1A0508',
      activeColor: '#E63946',
      hoverColor: '#FFE5E8',
      borderRadius: '4px',
      shadow: false,
    },
    buttons: {
      primaryColor: '#E63946',
      hoverColor: '#C1121F',
      hoverEffect: 'scale',
      borderRadius: '8px',
      shadow: true,
    },
    banners: {
      primaryColor: '#E63946',
      gradient: 'linear-gradient(135deg, #E63946 0%, #C1121F 100%)',
      textColor: '#FFFFFF',
      opacity: 1,
      borderRadius: '8px',
    },
    categoryBar: { backgroundColor: '#1A0508', textColor: '#FFFFFF', buttonColor: '#E63946' },
    topBar:       { backgroundColor: '#FFF0F1', textColor: '#7A3040' },
    announcementBar: { backgroundColor: '#E63946', textColor: '#FFFFFF' },
  },

  // ─── LUXURY: Dorado premium, sofisticado
  luxury: {
    id: 'luxury',
    label: 'Luxury',
    swatch: '#B8960C',
    colors: {
      primary: '#B8960C',
      secondary: '#9A7C08',
      background: '#FFFEF9',
      surface: '#F8F4EF',
      text: '#1C1200',
      textMuted: '#7A6820',
      border: '#E0D4A0',
    },
    navbar: {
      backgroundColor: '#FFFEF9',
      textColor: '#1C1200',
      activeColor: '#B8960C',
      hoverColor: '#F5F1E8',
      borderRadius: '8px',
      shadow: false,
    },
    buttons: {
      primaryColor: '#B8960C',
      hoverColor: '#9A7C08',
      hoverEffect: 'fade',
      borderRadius: '12px',
      shadow: true,
    },
    banners: {
      primaryColor: '#B8960C',
      gradient: 'linear-gradient(135deg, #B8960C 0%, #9A7C08 100%)',
      textColor: '#FFFEF9',
      opacity: 0.98,
      borderRadius: '12px',
    },
    categoryBar: { backgroundColor: '#1C1200', textColor: '#E0D4A0', buttonColor: '#B8960C' },
    topBar:       { backgroundColor: '#F8F4EF', textColor: '#7A6820' },
    announcementBar: { backgroundColor: '#B8960C', textColor: '#FFFEF9' },
  },

  // ─── FRESH: Verde natural, orgánico
  fresh: {
    id: 'fresh',
    label: 'Fresh',
    swatch: '#0B7A4E',
    colors: {
      primary: '#0B7A4E',
      secondary: '#065F3B',
      background: '#F0FAF5',
      surface: '#E8F7EF',
      text: '#052E1C',
      textMuted: '#3D7A5A',
      border: '#A7E8C8',
    },
    navbar: {
      backgroundColor: '#F0FAF5',
      textColor: '#052E1C',
      activeColor: '#0B7A4E',
      hoverColor: '#D8F4E8',
      borderRadius: '12px',
      shadow: false,
    },
    buttons: {
      primaryColor: '#0B7A4E',
      hoverColor: '#065F3B',
      hoverEffect: 'scale',
      borderRadius: '12px',
      shadow: false,
    },
    banners: {
      primaryColor: '#0B7A4E',
      gradient: 'linear-gradient(135deg, #0B7A4E 0%, #065F3B 100%)',
      textColor: '#F0FAF5',
      opacity: 1,
      borderRadius: '12px',
    },
    categoryBar: { backgroundColor: '#052E1C', textColor: '#E8F7EF', buttonColor: '#0B7A4E' },
    topBar:       { backgroundColor: '#E8F7EF', textColor: '#3D7A5A' },
    announcementBar: { backgroundColor: '#0B7A4E', textColor: '#F0FAF5' },
  },

  // ─── TECH: Azul moderno, tech-forward
  tech: {
    id: 'tech',
    label: 'Tech',
    swatch: '#2563EB',
    colors: {
      primary: '#2563EB',
      secondary: '#1D4ED8',
      background: '#EEF2FF',
      surface: '#E8EDFA',
      text: '#0F172A',
      textMuted: '#4A6090',
      border: '#BFCFEE',
    },
    navbar: {
      backgroundColor: '#0F172A',
      textColor: '#EEF2FF',
      activeColor: '#2563EB',
      hoverColor: '#1E40AF',
      borderRadius: '6px',
      shadow: true,
    },
    buttons: {
      primaryColor: '#2563EB',
      hoverColor: '#1D4ED8',
      hoverEffect: 'lift',
      borderRadius: '6px',
      shadow: true,
    },
    banners: {
      primaryColor: '#2563EB',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
      textColor: '#FFFFFF',
      opacity: 0.97,
      borderRadius: '6px',
    },
    categoryBar: { backgroundColor: '#0F172A', textColor: '#EEF2FF', buttonColor: '#2563EB' },
    topBar:       { backgroundColor: '#EEF2FF', textColor: '#4A6090' },
    announcementBar: { backgroundColor: '#2563EB', textColor: '#FFFFFF' },
  },

  // ─── WARM: Naranja cálido, acogedora
  warm: {
    id: 'warm',
    label: 'Warm',
    swatch: '#C2410C',
    colors: {
      primary: '#C2410C',
      secondary: '#9A3408',
      background: '#FFF7F3',
      surface: '#FFF0E8',
      text: '#2C1203',
      textMuted: '#8A4020',
      border: '#F8C8A8',
    },
    navbar: {
      backgroundColor: '#FFF7F3',
      textColor: '#2C1203',
      activeColor: '#C2410C',
      hoverColor: '#FFE8D9',
      borderRadius: '8px',
      shadow: false,
    },
    buttons: {
      primaryColor: '#C2410C',
      hoverColor: '#9A3408',
      hoverEffect: 'scale',
      borderRadius: '8px',
      shadow: false,
    },
    banners: {
      primaryColor: '#C2410C',
      gradient: 'linear-gradient(135deg, #C2410C 0%, #9A3408 100%)',
      textColor: '#FFF7F3',
      opacity: 1,
      borderRadius: '8px',
    },
    categoryBar: { backgroundColor: '#2C1203', textColor: '#FFF0E8', buttonColor: '#C2410C' },
    topBar:       { backgroundColor: '#FFF0E8', textColor: '#8A4020' },
    announcementBar: { backgroundColor: '#C2410C', textColor: '#FFF7F3' },
  },
};

/**
 * Obtiene un preset completo por ID
 */
export function getThemePreset(
  presetId: 'default' | 'dark' | 'minimal' | 'bold' | 'luxury' | 'fresh' | 'tech' | 'warm'
) {
  return THEME_PRESETS[presetId];
}

/**
 * Lista de IDs de presets disponibles
 */
export const PRESET_IDS = Object.keys(THEME_PRESETS) as Array<
  'default' | 'dark' | 'minimal' | 'bold' | 'luxury' | 'fresh' | 'tech' | 'warm'
>;
