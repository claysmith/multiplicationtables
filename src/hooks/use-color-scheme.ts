import { useThemeContext } from '@/contexts/theme-context';

export function useColorScheme() {
  return useThemeContext().colorScheme;
}
