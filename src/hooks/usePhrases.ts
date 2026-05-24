import { useMemo } from 'react';
import phrasesData from '../data/phrases.json';
import { sortByPriority } from '../lib/spacedRepetition';
import type { Phrase } from '../types';
import { useProgress } from '../store/ProgressContext';

const allPhrases = phrasesData as Phrase[];

export function usePhrases(theme?: Phrase['theme']): Phrase[] {
  const { progress } = useProgress();

  return useMemo(() => {
    const filtered = theme
      ? allPhrases.filter((p) => p.theme === theme)
      : allPhrases;

    const sorted = sortByPriority(
      filtered.map((p) => p.id),
      progress
    );

    return sorted
      .map((id) => filtered.find((p) => p.id === id))
      .filter(Boolean) as Phrase[];
  }, [theme, progress]);
}

export function useAllPhrases(): Phrase[] {
  return useMemo(() => [...allPhrases].sort((a, b) => a.order - b.order), []);
}

export function usePhraseById(id: string): Phrase | undefined {
  return useMemo(() => allPhrases.find((p) => p.id === id), [id]);
}

export function audioSrc(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
