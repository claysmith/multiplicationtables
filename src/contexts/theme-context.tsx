import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import type { ColorSchemeName } from '@/constants/theme';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextType = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  colorScheme: 'light' | 'dark';
  schemeName: ColorSchemeName;
  setSchemeName: (s: ColorSchemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>('dark');
  const [schemeName, setSchemeName] = useState<ColorSchemeName>('default');
  const systemScheme = useSystemColorScheme();

  const colorScheme = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  const value = useMemo(
    () => ({ preference, setPreference, colorScheme, schemeName, setSchemeName }),
    [preference, colorScheme, schemeName],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}
