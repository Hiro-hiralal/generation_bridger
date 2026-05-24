import { useState } from 'react';
import Layout from '../../components/shared/Layout';
import SpeakIt from '../../components/dadi/SpeakIt';
import { useAllPhrases } from '../../hooks/usePhrases';

export default function SpeakItPage() {
  const phrases = useAllPhrases();
  const [index, setIndex] = useState(0);

  const phrase = phrases[index];

  return (
    <Layout mode="dadi" title="Speak It" backTo="/dadi">
      <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between text-dadi-sm text-gray-400">
          <span>{phrase.theme}</span>
          <span>
            {index + 1} / {phrases.length}
          </span>
        </div>

        <SpeakIt phrase={phrase} />

        <div className="flex gap-4">
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            className="flex-1 rounded-2xl py-4 font-dadi font-bold text-dadi-base bg-gray-100 text-gray-500 disabled:opacity-40 hover:bg-gray-200 active:scale-95 transition-all touch-target"
          >
            ← Previous
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, phrases.length - 1))}
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
