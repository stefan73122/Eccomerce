import type { StoreTheme } from './theme.types';
import { defaultTheme } from './defaultTheme';

export const THEME_COOKIE = 'store_theme_v1';
export const THEME_CHANNEL = 'store_theme_bc';
export const COOKIE_MAX_AGE = 365 * 24 * 3600;

export function deepMerge<T extends object>(base: T, patch: Partial<T>): T {
  const result = { ...base };
  for (const key in patch) {
    const v = patch[key];
    if (
      v !== null &&
      v !== undefined &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      typeof result[key] === 'object'
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        result[key] as object,
        v as object,
      );
    } else if (v !== undefined) {
      (result as Record<string, unknown>)[key] = v;
    }
  }
  return result;
}

export function parseThemeFromRaw(raw: string | undefined): StoreTheme {
  if (!raw) return defaultTheme;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<StoreTheme>;
    return deepMerge(defaultTheme, parsed);
  } catch {
    return defaultTheme;
  }
}
