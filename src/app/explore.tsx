import { Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useThemeContext, type ThemePreference } from '@/contexts/theme-context';
import { usePractice } from '@/contexts/practice-context';
import { useTheme } from '@/hooks/use-theme';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

function Stepper({
  label,
  value,
  onDecrement,
  onIncrement,
  min,
  max,
  theme,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min: number;
  max: number;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <ThemedView style={stepperStyles.row}>
      <ThemedText type="default">{label}</ThemedText>
      <ThemedView style={stepperStyles.controls}>
        <Pressable
          onPress={onDecrement}
          disabled={value <= min}
          style={({ pressed }) => [
            stepperStyles.button,
            {
              backgroundColor: theme.backgroundElement,
              opacity: pressed || value <= min ? 0.5 : 1,
            },
          ]}
        >
          <ThemedText type="default">−</ThemedText>
        </Pressable>
        <ThemedText type="default" style={stepperStyles.value}>
          {value}
        </ThemedText>
        <Pressable
          onPress={onIncrement}
          disabled={value >= max}
          style={({ pressed }) => [
            stepperStyles.button,
            {
              backgroundColor: theme.backgroundElement,
              opacity: pressed || value >= max ? 0.5 : 1,
            },
          ]}
        >
          <ThemedText type="default">+</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const stepperStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default function SettingsScreen() {
  const { preference, setPreference } = useThemeContext();
  const {
    wrongFacts,
    practiceFailed,
    setPracticeFailed,
    wrongCount,
    resetAll,
    minFactor,
    maxFactor,
    setMinFactor,
    setMaxFactor,
  } = usePractice();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle" style={styles.title}>
          Settings
        </ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="default" style={styles.sectionTitle}>
            Number Range
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.rangeCard}>
            <Stepper
              label="Min"
              value={minFactor}
              onDecrement={() => setMinFactor(Math.max(1, minFactor - 1))}
              onIncrement={() => setMinFactor(Math.min(maxFactor - 1, minFactor + 1))}
              min={1}
              max={maxFactor - 1}
              theme={theme}
            />
            <ThemedView style={stepperStyles.row}>
              <ThemedText type="small" themeColor="textSecondary">
                ×
              </ThemedText>
            </ThemedView>
            <Stepper
              label="Max"
              value={maxFactor}
              onDecrement={() => setMaxFactor(Math.max(minFactor + 1, maxFactor - 1))}
              onIncrement={() => setMaxFactor(Math.min(20, maxFactor + 1))}
              min={minFactor + 1}
              max={20}
              theme={theme}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="default" style={styles.sectionTitle}>
            Appearance
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.optionsContainer}>
            {THEME_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      preference === option.value
                        ? theme.backgroundSelected
                        : 'transparent',
                  },
                ]}
              >
                <ThemedText>{option.label}</ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="default" style={styles.sectionTitle}>
            Practice
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.optionsContainer}>
            <Pressable
              onPress={() => setPracticeFailed(!practiceFailed)}
              style={[
                styles.option,
                {
                  backgroundColor: practiceFailed
                    ? theme.backgroundSelected
                    : 'transparent',
                },
              ]}
            >
              <ThemedText>
                {practiceFailed ? '✓ Practice Failed' : 'Practice Failed'}
              </ThemedText>
            </Pressable>
          </ThemedView>
          {wrongCount > 0 && (
            <ThemedView type="backgroundElement" style={styles.statsBox}>
              <ThemedText type="small">
                {wrongCount} fact{wrongCount > 1 ? 's' : ''} to practice
              </ThemedText>
              {Object.entries(wrongFacts).map(([key, fact]) => (
                <ThemedText key={key} type="small" themeColor="textSecondary">
                  {fact.a} × {fact.b} — {fact.streak}/3 correct
                </ThemedText>
              ))}
            </ThemedView>
          )}
          {wrongCount > 0 && (
            <Pressable
              onPress={resetAll}
              style={({ pressed }) => [
                styles.resetButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <ThemedText type="small" style={styles.resetText}>
                Reset practice progress
              </ThemedText>
            </Pressable>
          )}
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  title: {
    textAlign: 'center',
    paddingVertical: Spacing.four,
  },
  section: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  optionsContainer: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  statsBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  resetButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.two,
  },
  resetText: {
    color: '#FF3B30',
  },
  rangeCard: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
});
