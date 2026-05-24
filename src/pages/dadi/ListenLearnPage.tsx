import { useState } from 'react';
import Layout from '../../components/shared/Layout';
import { useAllPhrases } from '../../hooks/usePhrases';
import { useProgress } from '../../store/ProgressContext';
import AudioPlayer from '../../components/shared/AudioPlayer';

export default function ListenLearnPage() {
  const phrases = useAllPhrases();
  const { recordSeen } = useProgress();
  const [index, setIndex] = useState(0);
  const [showRomanized, setShowRomanized] = useState(false);

  const phrase = phrases[index];

  const handleNext = async () => {
    await recordSeen(phrase.id, true);
    setShowRomanized(false);
    setIndex((i) => Math.min(i + 1, phrases.length - 1));
  };

  const handlePrev = () => {
    setShowRomanized(false);
    setIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <Layout mode="dadi" title="Listen & Learn" backTo="/dadi">
      <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between text-dadi-sm text-gray-400">
          <span>{phrase.theme}</span>
          <span>
            {index + 1} / {phrases.length}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md">
          <p className="text-dadi-2xl font-dadi font-bold text-dadi-text leading-tight">
            {phrase.english_text}
          </p>

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <AudioPlayer
              src={phrase.english_audio}
              lang="en-US"
              text={phrase.english_text}
              size="lg"
              showSpeedToggle
              label="Play English"
            />
            <span className="text-dadi-sm text-gray-400">English ↑</span>
          </div>

          <hr className="my-5 border-purple-100" />

          <p className="devanagari text-dadi-xl text-purple-700 leading-relaxed">
            {phrase.hindi_devanagari}
          </p>

          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <AudioPlayer
              src={phrase.hindi_audio}
              lang="hi-IN"
              text={phrase.hindi_devanagari}
              size="lg"
              label="Play Hindi"
            />
            <span className="text-dadi-sm text-gray-400">Hindi ↑</span>
          </div>

          <button
            onClick={() => setShowRomanized((v) => !v)}
            className="mt-4 text-dadi-sm text-purple-400 underline touch-target py-1"
          >
            {showRomanized ? 'Hide guide' : 'Show pronunciation guide'}
          </button>
          {showRomanized && (
            <p className="mt-2 text-dadi-sm text-gray-500 italic">
              {phrase.hindi_romanized}
            </p>
          )}

          {phrase.usage_note && (
            <p className="mt-3 text-sm text-gray-400 bg-purple-50 rounded-xl p-3">
              💡 {phrase.usage_note}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="flex-1 rounded-2xl py-4 font-dadi font-bold text-dadi-base bg-gray-100 text-gray-500 disabled:opacity-40 hover:bg-gray-200 active:scale-95 transition-all touch-target"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={index === phrases.length - 1}
            className="flex-1 rounded-2xl py-4 font-dadi font-bold text-dadi-base bg-dadi-primary text-white disabled:opacity-40 hover:bg-dadi-primary-dark active:scale-95 transition-all touch-target"
          >
            Next →
          </button>
        </div>
      </div>
    </Layout>
  );
}
