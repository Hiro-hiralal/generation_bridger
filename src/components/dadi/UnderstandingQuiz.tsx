import { useState, useRef } from 'react';
import type { Phrase, QuizResult } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { audioSrc } from '../../hooks/usePhrases';

interface QuizCardProps {
  phrase: Phrase;
  allPhrases: Phrase[];
  onResult: (result: QuizResult) => void;
}

function pickDistractors(correct: Phrase, allPhrases: Phrase[]): Phrase[] {
  const sameTheme = allPhrases.filter(
    (p) => p.id !== correct.id && p.theme === correct.theme
  );
  const otherTheme = allPhrases.filter(
    (p) => p.id !== correct.id && p.theme !== correct.theme
  );
  const pool = sameTheme.length >= 2 ? sameTheme : [...sameTheme, ...otherTheme];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function QuizCard({ phrase, allPhrases, onResult }: QuizCardProps) {
  const distractors = useRef(pickDistractors(phrase, allPhrases)).current;
  const options = useRef(shuffle([phrase, ...distractors])).current;
  const [selected, setSelected] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  const { play } = useAudio({
    src: audioSrc(phrase.english_audio),
    lang: 'en-US',
    text: phrase.english_text,
  });

  const handlePlay = () => {
    play();
    setHasPlayed(true);
  };

  const handleSelect = (optionId: string) => {
    if (selected) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setSelected(optionId);
    const correct = optionId === phrase.id;
    setTimeout(() => {
      onResult({ phrase_id: phrase.id, correct, attempts: newAttempts });
    }, 800);
  };

  const optionStyle = (optionId: string) => {
    if (!selected) return 'bg-white border-2 border-purple-200 hover:border-purple-400 active:scale-95';
    if (optionId === phrase.id) return 'bg-green-50 border-4 border-green-400';
    if (optionId === selected) return 'bg-red-50 border-4 border-red-400';
    return 'bg-white border-2 border-gray-200 opacity-50';
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-3xl p-6 shadow-md text-center">
        <p className="text-gray-500 text-dadi-sm mb-4">What does this mean?</p>
        <button
          onClick={handlePlay}
          className="w-24 h-24 rounded-full bg-purple-100 text-purple-700 text-5xl flex items-center justify-center mx-auto hover:bg-purple-200 active:scale-95 transition-all touch-target-lg"
          aria-label="Play English phrase"
        >
          {hasPlayed ? '🔄' : '▶'}
        </button>
        <p className="mt-3 text-dadi-sm text-gray-400">
          {hasPlayed ? 'Tap to replay' : 'Tap to hear'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            disabled={!!selected}
            className={`rounded-2xl p-4 text-left transition-all touch-target ${optionStyle(opt.id)}`}
          >
            <p className="devanagari text-dadi-lg text-gray-800">{opt.hindi_devanagari}</p>
            <p className="text-dadi-sm text-gray-500 mt-1">{opt.hindi_romanized}</p>
          </button>
        ))}
      </div>

      {selected && (
        <p
          className={`text-center text-dadi-base font-bold animate-fade-in ${
            selected === phrase.id ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {selected === phrase.id ? '✓ Correct!' : `✗ The answer was: ${phrase.hindi_devanagari}`}
        </p>
      )}
    </div>
  );
}

interface UnderstandingQuizProps {
  phrases: Phrase[];
  allPhrases: Phrase[];
  onComplete: (results: QuizResult[]) => void;
}

export default function UnderstandingQuiz({ phrases, allPhrases, onComplete }: UnderstandingQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);

  const handleResult = (result: QuizResult) => {
    const newResults = [...results, result];
    setResults(newResults);
    if (currentIndex + 1 >= phrases.length) {
      setTimeout(() => onComplete(newResults), 400);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
        {phrases.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-all ${
              i < currentIndex
                ? 'bg-green-400'
                : i === currentIndex
                ? 'bg-purple-400'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <QuizCard
        key={phrases[currentIndex].id}
        phrase={phrases[currentIndex]}
        allPhrases={allPhrases}
        onResult={handleResult}
      />
    </div>
  );
}
