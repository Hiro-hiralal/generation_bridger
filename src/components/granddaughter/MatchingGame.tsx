import { useState, useRef } from 'react';
import type { Phrase } from '../../types';
import { useAudio } from '../../hooks/useAudio';
import { audioSrc } from '../../hooks/usePhrases';

interface MatchCardProps {
  phrase: Phrase;
  allPhrases: Phrase[];
  starCount: number;
  onResult: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickOptions(correct: Phrase, all: Phrase[]): Phrase[] {
  const others = all.filter((p) => p.id !== correct.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffle([correct, ...shuffled.slice(0, 2)]);
}

function MatchCard({ phrase, allPhrases, starCount, onResult }: MatchCardProps) {
  const options = useRef(pickOptions(phrase, allPhrases)).current;
  const [selected, setSelected] = useState<string | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const { play } = useAudio({
    src: audioSrc(phrase.hindi_audio),
    lang: 'hi-IN',
    text: phrase.hindi_devanagari,
  });

  const handlePlay = () => {
    play();
    setHasPlayed(true);
  };

  const handleSelect = (id: string) => {
    if (selected) return;
    setSelected(id);
    const correct = id === phrase.id;
    setTimeout(() => onResult(correct), 900);
  };

  const optionStyle = (id: string) => {
    if (!selected)
      return 'bg-white border-2 border-orange-200 hover:border-orange-400 active:scale-95';
    if (id === phrase.id) return 'bg-green-50 border-4 border-green-400';
    if (id === selected) return 'bg-red-50 border-4 border-red-400';
    return 'bg-white border-2 border-gray-200 opacity-40';
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center gap-1 text-2xl">
        {[...Array(3)].map((_, i) => (
          <span key={i} className={i < starCount ? 'text-child-star' : 'text-gray-200'}>
            ⭐
          </span>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-md text-center">
        <p className="font-child text-gray-500 mb-3">What does this say?</p>
        <button
          onClick={handlePlay}
          className="w-28 h-28 rounded-full bg-orange-100 text-orange-600 text-6xl flex items-center justify-center mx-auto hover:bg-orange-200 active:scale-95 transition-all touch-target-lg"
          aria-label="Play Hindi phrase"
        >
          {hasPlayed ? '🔄' : '▶'}
        </button>
        <p className="mt-2 font-child text-sm text-gray-400">
          {hasPlayed ? 'Tap to hear again' : 'Tap to listen!'}
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
            <p className="font-child font-bold text-xl text-gray-800">{opt.english_text}</p>
            <p className="devanagari text-purple-500 text-lg mt-1">{opt.hindi_devanagari}</p>
          </button>
        ))}
      </div>

      {selected && (
        <p
          className={`text-center text-lg font-child font-bold animate-bounce-in ${
            selected === phrase.id ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {selected === phrase.id ? '⭐ Correct!' : `Not quite! It was: ${phrase.english_text}`}
        </p>
      )}
    </div>
  );
}

interface MatchingGameProps {
  phrases: Phrase[];
  allPhrases: Phrase[];
  onComplete: (stars: number) => void;
}

export default function MatchingGame({ phrases, allPhrases, onComplete }: MatchingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState(0);

  const handleResult = (correct: boolean) => {
    const newStars = correct ? stars + 1 : stars;
    setStars(newStars);
    if (currentIndex + 1 >= phrases.length) {
      setTimeout(() => onComplete(newStars), 400);
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
                ? 'bg-orange-400'
                : i === currentIndex
                ? 'bg-orange-300'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      <MatchCard
        key={phrases[currentIndex].id}
        phrase={phrases[currentIndex]}
        allPhrases={allPhrases}
        starCount={stars}
        onResult={handleResult}
      />
    </div>
  );
}
