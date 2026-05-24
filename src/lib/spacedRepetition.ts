import type { Progress, MasteryLevel } from '../types';

export function updateMastery(current: Progress, correct: boolean): Progress {
  const newLevel = correct
    ? (Math.min(4, current.mastery_level + 1) as MasteryLevel)
    : (Math.max(0, current.mastery_level - 1) as MasteryLevel);

  return {
    ...current,
    seen_count: current.seen_count + 1,
    last_seen: Date.now(),
    mastery_level: newLevel,
  };
}

export function createProgress(phraseId: string): Progress {
  return {
    phrase_id: phraseId,
    seen_count: 0,
    last_seen: 0,
    mastery_level: 0,
  };
}

/** Sort phrase IDs: unseen (0) first, then low mastery, then high mastery */
export function sortByPriority(
  phraseIds: string[],
  progressMap: Map<string, Progress>
): string[] {
  return [...phraseIds].sort((a, b) => {
    const pa = progressMap.get(a)?.mastery_level ?? 0;
    const pb = progressMap.get(b)?.mastery_level ?? 0;
    return pa - pb;
  });
}
