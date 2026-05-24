import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Progress, Recording, AppMode } from '../types';
import {
  getAllProgress,
  putProgress,
  addRecording,
  getRecordingsByPhrase,
} from '../lib/db';
import { updateMastery, createProgress } from '../lib/spacedRepetition';

interface ProgressContextValue {
  progress: Map<string, Progress>;
  recordSeen: (phraseId: string, correct?: boolean) => Promise<void>;
  saveRecording: (phraseId: string, blob: Blob, mode: AppMode) => Promise<void>;
  getRecordings: (phraseId: string) => Promise<Recording[]>;
  totalStars: number;
  masteredCount: number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map());

  useEffect(() => {
    getAllProgress().then((all) => {
      const map = new Map<string, Progress>();
      for (const p of all) map.set(p.phrase_id, p);
      setProgress(map);
    });
  }, []);

  const recordSeen = useCallback(
    async (phraseId: string, correct = true) => {
      const current = progress.get(phraseId) ?? createProgress(phraseId);
      const updated = updateMastery(current, correct);
      await putProgress(updated);
      setProgress((prev) => {
        const next = new Map(prev);
        next.set(phraseId, updated);
        return next;
      });
    },
    [progress]
  );

  const saveRecording = useCallback(
    async (phraseId: string, blob: Blob, mode: AppMode) => {
      await addRecording({ phrase_id: phraseId, blob, created_at: Date.now(), mode });
    },
    []
  );

  const getRecordings = useCallback(
    async (phraseId: string): Promise<Recording[]> => getRecordingsByPhrase(phraseId),
    []
  );

  const { totalStars, masteredCount } = useMemo(() => {
    let stars = 0;
    let mastered = 0;
    for (const p of progress.values()) {
      stars += p.mastery_level;
      if (p.mastery_level === 4) mastered++;
    }
    return { totalStars: stars, masteredCount: mastered };
  }, [progress]);

  return (
    <ProgressContext.Provider
      value={{ progress, recordSeen, saveRecording, getRecordings, totalStars, masteredCount }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
