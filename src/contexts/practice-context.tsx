import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type FactData = {
  a: number;
  b: number;
  streak: number;
};

export type PracticeContextType = {
  wrongFacts: Record<string, FactData>;
  addWrong: (a: number, b: number) => void;
  recordCorrect: (a: number, b: number) => void;
  practiceFailed: boolean;
  setPracticeFailed: (v: boolean) => void;
  getPracticeFact: () => { a: number; b: number } | null;
  wrongCount: number;
  resetAll: () => void;
  minFactor: number;
  maxFactor: number;
  setMinFactor: (v: number) => void;
  setMaxFactor: (v: number) => void;
  timerEnabled: boolean;
  setTimerEnabled: (v: boolean) => void;
  timerSeconds: number;
  setTimerSeconds: (v: number) => void;
};

function factKey(a: number, b: number) {
  const [x, y] = a <= b ? [a, b] : [b, a];
  return `${x}×${y}`;
}

const PracticeContext = createContext<PracticeContextType | null>(null);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [wrongFacts, setWrongFacts] = useState<Record<string, FactData>>({});
  const [practiceFailed, setPracticeFailed] = useState(false);
  const [minFactor, setMinFactor] = useState(1);
  const [maxFactor, setMaxFactor] = useState(12);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5);

  const addWrong = useCallback((a: number, b: number) => {
    const key = factKey(a, b);
    setWrongFacts((prev) => ({ ...prev, [key]: { a, b, streak: 0 } }));
  }, []);

  const recordCorrect = useCallback((a: number, b: number) => {
    const key = factKey(a, b);
    setWrongFacts((prev) => {
      if (!(key in prev)) return prev;
      const entry = prev[key];
      if (entry.streak + 1 >= 3) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: { ...entry, streak: entry.streak + 1 } };
    });
  }, []);

  const resetAll = useCallback(() => {
    setWrongFacts({});
    setPracticeFailed(false);
  }, []);

  const filteredWrongFacts = useMemo(() => {
    return Object.fromEntries(
      Object.entries(wrongFacts).filter(
        ([, f]) => f.a >= minFactor && f.b <= maxFactor,
      ),
    );
  }, [wrongFacts, minFactor, maxFactor]);

  const wrongCount = Object.keys(filteredWrongFacts).length;

  const getPracticeFact = useCallback((): { a: number; b: number } | null => {
    const keys = Object.keys(filteredWrongFacts);
    if (keys.length === 0) return null;
    const key = keys[Math.floor(Math.random() * keys.length)];
    const fact = filteredWrongFacts[key];
    return Math.random() < 0.5
      ? { a: fact.a, b: fact.b }
      : { a: fact.b, b: fact.a };
  }, [filteredWrongFacts]);

  const value = useMemo(
    () => ({
      wrongFacts,
      addWrong,
      recordCorrect,
      practiceFailed,
      setPracticeFailed,
      getPracticeFact,
      wrongCount,
      resetAll,
      minFactor,
      maxFactor,
      setMinFactor,
      setMaxFactor,
      timerEnabled,
      setTimerEnabled,
      timerSeconds,
      setTimerSeconds,
    }),
    [
      wrongFacts, addWrong, recordCorrect,
      practiceFailed, setPracticeFailed, getPracticeFact,
      wrongCount, resetAll,
      minFactor, maxFactor,
      timerEnabled, timerSeconds,
    ],
  );

  return (
    <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>
  );
}

export function usePractice() {
  const ctx = useContext(PracticeContext);
  if (!ctx) throw new Error('usePractice must be used within PracticeProvider');
  return ctx;
}
