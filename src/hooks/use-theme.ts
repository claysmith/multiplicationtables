import { getPalette } from '@/constants/theme';
import { useThemeContext } from '@/contexts/theme-context';

export function useTheme() {
  const { schemeName, colorScheme } = useThemeContext();
  return getPalette(schemeName, colorScheme);
}
