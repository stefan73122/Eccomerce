import { createContext, useContext } from 'react';
import type { StoreTheme, ThemeUpdate } from './theme.types';
import { defaultTheme } from './defaultTheme';

export interface ThemeContextValue {
  theme: StoreTheme;
  updateTheme: (patch: ThemeUpdate) => void;
  resetTheme: () => void;
  isMounted: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  updateTheme: () => {},
  resetTheme: () => {},
  isMounted: false,
});

export const useTheme = () => useContext(ThemeContext);
