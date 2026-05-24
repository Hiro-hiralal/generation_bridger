export type AppMode = 'dadi' | 'granddaughter' | null;
export type MasteryLevel = 0 | 1 | 2 | 3 | 4;
export type AudioSpeed = 'normal' | 'slow';

export interface Phrase {
  id: string;
  theme: 'greetings' | 'family' | 'video-call' | 'mealtime' | 'feelings' | 'play' | 'school' | 'bedtime';
  order: number;
  english_text: string;
  english_audio: string;
  hindi_devanagari: string;
  hindi_romanized: string;
  hindi_audio: string;
  image?: string;
  usage_note?: string;
}

export interface Progress {
  phrase_id: string;
  seen_count: number;
  last_seen: number;
  mastery_level: MasteryLevel;
}

export interface Recording {
  id?: number;
  phrase_id: string;
  blob: Blob;
  created_at: number;
  mode: AppMode;
}

export interface QuizResult {
  phrase_id: string;
  correct: boolean;
  attempts: number;
}
