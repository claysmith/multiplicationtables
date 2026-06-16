import '@/global.css';

import { Platform } from 'react-native';

export type ColorSchemeName = 'default' | 'ocean' | 'forest' | 'sunset' | 'midnight';

export type Palette = {
  text: string;
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  textSecondary: string;
};

export const ColorSchemes: Record<ColorSchemeName, { light: Palette; dark: Palette }> = {
  default: {
    light: {
      text: '#000000',
      background: '#ffffff',
      backgroundElement: '#F0F0F3',
      backgroundSelected: '#E0E1E6',
      textSecondary: '#60646C',
    },
    dark: {
      text: '#ffffff',
      background: '#000000',
      backgroundElement: '#212225',
      backgroundSelected: '#2E3135',
      textSecondary: '#B0B4BA',
    },
  },
  ocean: {
    light: {
      text: '#1A3A5C',
      background: '#F0F7FF',
      backgroundElement: '#D6E8F9',
      backgroundSelected: '#B8D6F0',
      textSecondary: '#5A7A9A',
    },
    dark: {
      text: '#D6E8FF',
      background: '#0D1B2A',
      backgroundElement: '#1B2D44',
      backgroundSelected: '#243B56',
      textSecondary: '#8AA9C9',
    },
  },
  forest: {
    light: {
      text: '#1B3D2B',
      background: '#F0F9F0',
      backgroundElement: '#D4EDD4',
      backgroundSelected: '#B8E0B8',
      textSecondary: '#5A7A5A',
    },
    dark: {
      text: '#D4EDD4',
      background: '#0D1F14',
      backgroundElement: '#1A3324',
      backgroundSelected: '#244632',
      textSecondary: '#7AAA7A',
    },
  },
  sunset: {
    light: {
      text: '#3D2B1B',
      background: '#FFF8F0',
      backgroundElement: '#F5E6D4',
      backgroundSelected: '#E8D0B8',
      textSecondary: '#8A7A6A',
    },
    dark: {
      text: '#F5E6D4',
      background: '#1F140D',
      backgroundElement: '#33261A',
      backgroundSelected: '#463324',
      textSecondary: '#AA9A8A',
    },
  },
  midnight: {
    light: {
      text: '#2D1B3D',
      background: '#F8F0FF',
      backgroundElement: '#E6D4F5',
      backgroundSelected: '#D0B8E8',
      textSecondary: '#7A6A8A',
    },
    dark: {
      text: '#E6D4F5',
      background: '#140D1F',
      backgroundElement: '#261A33',
      backgroundSelected: '#332446',
      textSecondary: '#AA8ABA',
    },
  },
};

export type ThemeColor = keyof Palette;

export function getPalette(scheme: ColorSchemeName, mode: 'light' | 'dark'): Palette {
  return ColorSchemes[scheme][mode];
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
