import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AppMode, Phrase } from '../types';

interface AppContextValue {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  sessionPhrases: Phrase[];
  setSessionPhrases: (p: Phrase[]) => void;
  currentPhraseIndex: number;
  setCurrentPhraseIndex: (i: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const MODE_KEY = 'flb_mode';

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const stored = localStorage.getItem(MODE_KEY);
    return stored === 'dadi' || stored === 'granddaughter' ? stored : null;
  });
  const [sessionPhrases, setSessionPhrases] = useState<Phrase[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const setMode = useCallback((m: AppMode) => {
    setModeState(m);
    if (m) localStorage.setItem(MODE_KEY, m);
    else localStorage.removeItem(MODE_KEY);
  }, []);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        sessionPhrases,
        setSessionPhrases,
        currentPhraseIndex,
        setCurrentPhraseIndex,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
