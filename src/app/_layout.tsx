import { DarkTheme, DefaultTheme, ThemeProvider as RouterThemeProvider } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemeProvider, useThemeContext } from '@/contexts/theme-context';
import { PracticeProvider } from '@/contexts/practice-context';

function TabLayout() {
  const { colorScheme } = useThemeContext();
  return (
    <RouterThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <PracticeProvider>
        <AppTabs />
      </PracticeProvider>
    </RouterThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TabLayout />
    </ThemeProvider>
  );
}
