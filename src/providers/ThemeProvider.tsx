'use client';

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { ThemeContext } from '@/lib/theme/ThemeContext';
import { defaultTheme } from '@/lib/theme/defaultTheme';
import { deepMerge, THEME_COOKIE, THEME_CHANNEL, COOKIE_MAX_AGE } from '@/lib/theme/themeUtils';
import type { StoreTheme, ThemeUpdate } from '@/lib/theme/theme.types';

function writeCookie(theme: StoreTheme): void {
  try {
    document.cookie = `${THEME_COOKIE}=${encodeURIComponent(JSON.stringify(theme))}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
  } catch {
    // ignore write errors
  }
}

function deleteCookie(): void {
  document.cookie = `${THEME_COOKIE}=; max-age=0; path=/`;
}

const LAYOUT_HERO_DEFAULTS: Record<string, string> = {
  default:   '520px',
  centered:  '420px',
  editorial: '580px',
  fullwidth: '640px',
};

function injectCSSVars(theme: StoreTheme): void {
  const root = document.documentElement;
  const { colors, navbar, productCards, footer, typography, layout, businessModel, buttons, banners, layoutSettings } = theme;

  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--primary-light', `${colors.primary}1A`);
  root.style.setProperty('--text-dark', colors.text);
  root.style.setProperty('--text-muted', colors.textMuted);
  root.style.setProperty('--text-light', colors.textMuted);
  root.style.setProperty('--text-placeholder', `${colors.textMuted}99`);
  root.style.setProperty('--bg', colors.background);
  root.style.setProperty('--bg-light', colors.surface);
  root.style.setProperty('--bg-warm', colors.surface);
  root.style.setProperty('--bg-card', colors.surface);
  root.style.setProperty('--bg-input', colors.surface);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--border-light', colors.border);
  root.style.setProperty('--success', colors.success);
  root.style.setProperty('--error', colors.error);
  root.style.setProperty('--warning', colors.warning);

  root.style.setProperty('--navbar-bg', navbar.backgroundColor);
  root.style.setProperty('--navbar-text', navbar.textColor);
  root.style.setProperty('--navbar-active', navbar.activeColor);
  root.style.setProperty('--navbar-hover', navbar.hoverColor || '#E5E5E5');
  root.style.setProperty('--navbar-radius', navbar.borderRadius || '0px');
  root.style.setProperty('--navbar-shadow', navbar.shadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none');

  root.style.setProperty('--btn-primary', buttons?.primaryColor || colors.primary);
  root.style.setProperty('--btn-hover', buttons?.hoverColor || '#0A5555');
  root.style.setProperty('--btn-radius', buttons?.borderRadius || '6px');
  root.style.setProperty('--btn-hover-effect', buttons?.hoverEffect || 'fade');
  root.style.setProperty('--btn-shadow', buttons?.shadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none');

  root.style.setProperty('--banner-primary', banners?.primaryColor || colors.primary);
  root.style.setProperty('--banner-gradient', banners?.gradient || `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`);
  root.style.setProperty('--banner-text', banners?.textColor || '#FFFFFF');
  root.style.setProperty('--banner-opacity', `${banners?.opacity ?? 1}`);
  root.style.setProperty('--banner-radius', banners?.borderRadius || '0px');
  root.style.setProperty('--banner-max-width', banners?.heroMaxWidth || '100%');
  root.style.setProperty('--brand-banner-h', banners?.brandBannerHeight || '200px');

  root.dataset.layout = layout || 'default';
  root.dataset.model = businessModel || 'general';

  // Per-layout settings — banners.heroHeight overrides layoutSettings when set
  const currentLS = layoutSettings?.[layout as keyof typeof layoutSettings] ?? {};
  const layoutHeroHeight = (currentLS as { heroHeight?: string }).heroHeight || LAYOUT_HERO_DEFAULTS[layout] || '520px';
  const heroHeight = banners?.heroHeight || layoutHeroHeight;
  root.style.setProperty('--hero-height', heroHeight);

  if (layout === 'editorial') {
    const eds = (currentLS as { sidebarWidth?: string; sidebarBg?: string }) ?? {};
    root.style.setProperty('--sidebar-width', eds.sidebarWidth || '360px');
    root.style.setProperty('--sidebar-bg', eds.sidebarBg || colors.surface);
  }
  if (layout === 'centered') {
    const cs = (currentLS as { containerMaxWidth?: string; paddingX?: string }) ?? {};
    if (cs.containerMaxWidth) root.style.setProperty('--layout-max', cs.containerMaxWidth);
    if (cs.paddingX) root.style.setProperty('--layout-padding-x', cs.paddingX);
  }
  if (layout === 'fullwidth') {
    const fs = (currentLS as { paddingX?: string }) ?? {};
    root.style.setProperty('--fullwidth-padding-x', fs.paddingX || '0px');
  }
  if (layout === 'default') {
    const ds = (currentLS as { containerMaxWidth?: string; sectionGap?: string }) ?? {};
    if (ds.containerMaxWidth) root.style.setProperty('--layout-max', ds.containerMaxWidth);
  }

  root.style.setProperty('--card-radius', productCards.borderRadius);
  root.style.setProperty('--card-img-height', productCards.imageHeight);

  const btnRadius =
    productCards.buttonStyle === 'pill'
      ? '9999px'
      : productCards.buttonStyle === 'square'
        ? '0px'
        : '6px';
  root.style.setProperty('--btn-radius', btnRadius);

  root.style.setProperty('--footer-dark', footer.backgroundColor);
  root.style.setProperty('--footer-text', footer.textColor);

  root.style.setProperty('--font-family', `'${typography.fontFamily}', sans-serif`);
  root.style.setProperty('--base-font-size', typography.baseFontSize);
}

function loadFont(fontUrl: string | undefined): void {
  if (!fontUrl) return;
  const existing = document.querySelector('link[data-theme-font]');
  if (existing) existing.remove();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontUrl;
  link.setAttribute('data-theme-font', 'true');
  document.head.appendChild(link);
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme?: StoreTheme;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<StoreTheme>(initialTheme ?? defaultTheme);
  const [isMounted, setIsMounted] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // BroadcastChannel — sync across tabs in real-time
    const channel = new BroadcastChannel(THEME_CHANNEL);
    channelRef.current = channel;
    channel.onmessage = (e: MessageEvent<StoreTheme | null>) => {
      setTheme(e.data ?? defaultTheme);
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    injectCSSVars(theme);
    if (theme.typography.fontUrl) loadFont(theme.typography.fontUrl);
  }, [theme, isMounted]);

  const updateTheme = useCallback((patch: ThemeUpdate) => {
    setTheme((prev) => {
      const next = deepMerge(prev, patch as Partial<StoreTheme>);
      writeCookie(next);
      channelRef.current?.postMessage(next);
      return next;
    });
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(defaultTheme);
    deleteCookie();
    channelRef.current?.postMessage(null);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
