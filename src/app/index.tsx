import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { usePractice } from '@/contexts/practice-context';
import { useTheme } from '@/hooks/use-theme';

export default function PracticeScreen() {
  const {
    practiceFailed,
    wrongCount,
    getPracticeFact,
    addWrong,
    recordCorrect,
    minFactor,
    maxFactor,
    timerEnabled,
    timerSeconds,
  } = usePractice();
  const theme = useTheme();

  const randomFactor = useCallback(
    () => Math.floor(Math.random() * (maxFactor - minFactor + 1)) + minFactor,
    [minFactor, maxFactor],
  );

  const [num1, setNum1] = useState(() => randomFactor());
  const [num2, setNum2] = useState(() => randomFactor());
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerEnabled ? timerSeconds : 0);
  const submittedRef = useRef(false);

  useEffect(() => {
    setNum1(randomFactor());
    setNum2(randomFactor());
  }, [minFactor, maxFactor, randomFactor]);

  useEffect(() => {
    if (practiceFailed && wrongCount === 0) {
      setAllDone(true);
    } else {
      setAllDone(false);
    }
  }, [practiceFailed, wrongCount]);

  useEffect(() => {
    setTimeLeft(timerEnabled ? timerSeconds : 0);
  }, [timerEnabled, timerSeconds, num1, num2]);

  useEffect(() => {
    if (!timerEnabled || submitted) {
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerEnabled, submitted, timerSeconds, num1, num2]);

  useEffect(() => {
    if (timerEnabled && !submitted && timeLeft === 0 && !submittedRef.current) {
      submittedRef.current = true;
      setSubmitted(true);
      setTotalCount((c) => c + 1);
      addWrong(num1, num2);
    }
  }, [timeLeft, timerEnabled, submitted, num1, num2, addWrong]);

  const correctAnswer = num1 * num2;
  const parsed = parseInt(answer, 10);
  const isCorrect = parsed === correctAnswer;

  const newQuestion = useCallback(() => {
    submittedRef.current = false;
    if (practiceFailed && wrongCount > 0) {
      const fact = getPracticeFact();
      if (fact) {
        setNum1(fact.a);
        setNum2(fact.b);
        return;
      }
    }
    setNum1(randomFactor());
    setNum2(randomFactor());
  }, [practiceFailed, wrongCount, getPracticeFact, randomFactor]);

  const handleSubmit_ = useCallback(() => {
    if (submittedRef.current || answer === '') return;
    submittedRef.current = true;
    setSubmitted(true);
    setTotalCount((c) => c + 1);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      if (practiceFailed) {
        recordCorrect(num1, num2);
      }
    } else {
      addWrong(num1, num2);
    }
  }, [answer, isCorrect, num1, num2, practiceFailed, recordCorrect, addWrong]);

  const handleNext = useCallback(() => {
    setAnswer('');
    setSubmitted(false);
    setTimeLeft(timerEnabled ? timerSeconds : 0);
    submittedRef.current = false;
    newQuestion();
  }, [newQuestion, timerEnabled, timerSeconds]);

  const timerFraction = timerEnabled && !submitted ? timeLeft / timerSeconds : 0;

  if (practiceFailed && wrongCount === 0 && allDone) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.quizArea}>
            <ThemedText type="title" style={styles.doneText}>
              All mastered!
            </ThemedText>
            <ThemedText style={styles.doneSubtext}>
              You got every fact right 3 times. Go to Settings to start fresh.
            </ThemedText>
            <Pressable
              onPress={() => {
                setAllDone(false);
                setNum1(randomFactor());
                setNum2(randomFactor());
              }}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <ThemedText type="default">Normal practice</ThemedText>
            </Pressable>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">
            {practiceFailed ? 'Practice Failed' : 'Times Tables'}
          </ThemedText>
          <ThemedView style={styles.headerRow}>
            <ThemedText type="small">
              {minFactor}–{maxFactor}
            </ThemedText>
            <ThemedText type="small">·</ThemedText>
            <ThemedText type="small">
              ✓ {correctCount}/{totalCount}
            </ThemedText>
            {totalCount > 0 && (
              <ThemedText type="small">
                {Math.round((correctCount / totalCount) * 100)}%
              </ThemedText>
            )}
            {practiceFailed && wrongCount > 0 && (
              <ThemedView type="backgroundElement" style={styles.badge}>
                <ThemedText type="small">{wrongCount} left</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
          {timerEnabled && !submitted && (
            <ThemedView style={styles.timerBarOuter}>
              <ThemedView
                style={[
                  styles.timerBarInner,
                  {
                    width: `${timerFraction * 100}%`,
                    backgroundColor:
                      timerFraction > 0.5
                        ? '#34C759'
                        : timerFraction > 0.25
                          ? '#FF9F0A'
                          : '#FF3B30',
                  },
                ]}
              />
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={styles.quizArea}>
          <ThemedText style={styles.prompt}>
            {practiceFailed ? 'Practice' : 'What is'}
          </ThemedText>

          <ThemedText type="title" style={styles.question}>
            {num1} × {num2}
          </ThemedText>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundElement,
                color: theme.text,
                borderColor: submitted
                  ? isCorrect
                    ? '#34C759'
                    : '#FF3B30'
                  : theme.backgroundSelected,
              },
            ]}
            value={answer}
            onChangeText={setAnswer}
            keyboardType="number-pad"
            editable={!submitted}
            placeholder="?"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="go"
            onSubmitEditing={handleSubmit_}
          />

          {submitted ? (
            <>
              <ThemedText
                style={[
                  styles.feedback,
                  { color: isCorrect ? '#34C759' : '#FF3B30' },
                ]}
              >
                {isCorrect
                  ? '✓ Correct!'
                  : parsed !== correctAnswer && answer !== ''
                    ? `${num1} × ${num2} = ${correctAnswer}`
                    : `⏱ ${num1} × ${num2} = ${correctAnswer}`}
              </ThemedText>
              <Pressable
                onPress={handleNext}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <ThemedText type="default">Next →</ThemedText>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={handleSubmit_}
              disabled={answer === ''}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: theme.backgroundElement,
                  opacity: pressed || answer === '' ? 0.5 : 1,
                },
              ]}
            >
              <ThemedText type="default">Submit</ThemedText>
            </Pressable>
          )}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.one,
    alignSelf: 'stretch',
  },
  headerRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    alignItems: 'center',
  },
  badge: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  timerBarOuter: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128,128,128,0.3)',
    alignSelf: 'stretch',
    marginTop: Spacing.one,
    marginHorizontal: Spacing.four,
  },
  timerBarInner: {
    height: 4,
    borderRadius: 2,
  },
  quizArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    width: '100%',
  },
  prompt: {
    fontSize: 20,
  },
  question: {
    textAlign: 'center',
  },
  input: {
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    width: 200,
    height: 80,
    borderWidth: 2,
    borderRadius: Spacing.four,
  },
  feedback: {
    fontSize: 20,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    minWidth: 150,
    alignItems: 'center',
  },
  doneText: {
    textAlign: 'center',
  },
  doneSubtext: {
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
});
