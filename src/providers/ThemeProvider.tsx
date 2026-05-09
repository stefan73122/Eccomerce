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

function injectCSSVars(theme: StoreTheme): void {
  const root = document.documentElement;
  const { colors, navbar, productCards, footer, typography, layout, businessModel } = theme;

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

  root.dataset.layout = layout || 'default';
  root.dataset.model = businessModel || 'general';

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
