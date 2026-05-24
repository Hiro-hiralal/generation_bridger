import { useState } from 'react';
import Layout from '../../components/shared/Layout';
import SayIt from '../../components/granddaughter/SayIt';
import { useAllPhrases } from '../../hooks/usePhrases';

export default function SayItPage() {
  const phrases = useAllPhrases();
  const [index, setIndex] = useState(0);
  const [showRomanized, setShowRomanized] = useState(false);

  const phrase = phrases[index];

  return (
    <Layout mode="granddaughter" title="Say It!" backTo="/child">
      <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between text-sm font-child text-gray-400">
          <span className="capitalize">{phrase.theme}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRomanized((v) => !v)}
              className="text-purple-400 underline touch-target text-xs py-1"
            >
              {showRomanized ? 'Hide guide' : 'Show guide'}
            </button>
            <span>
              {index + 1}/{phrases.length}
            </span>
          </div>
        </div>

        <SayIt phrase={phrase} showRomanized={showRomanized} />

        <div className="flex gap-4">
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            className="flex-1 rounded-2xl py-4 font-child font-bold text-base bg-gray-100 text-gray-500 disabled:opacity-40 hover:bg-gray-200 active:scale-95 transition-all touch-target"
          >
            ← Back
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, phrases.length - 1))}
            disabled={index === phrases.length - 1}
            className="flex-1 rounded-2xl py-4 font-child font-bold text-base bg-child-primary text-white disabled:opacity-40 active:scale-95 transition-all touch-target"
          >
            Next →
          </button>
        </div>
      </div>
    </Layout>
  );
}
