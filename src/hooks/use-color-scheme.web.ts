import { useThemeContext } from '@/contexts/theme-context';
import { useEffect, useState } from 'react';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const { colorScheme } = useThemeContext();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
