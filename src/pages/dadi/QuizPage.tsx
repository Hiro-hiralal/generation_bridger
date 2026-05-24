import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import UnderstandingQuiz from '../../components/dadi/UnderstandingQuiz';
import { useAllPhrases } from '../../hooks/usePhrases';
import { useProgress } from '../../store/ProgressContext';
import type { QuizResult } from '../../types';

const SESSION_SIZE = 5;

export default function QuizPage() {
  const allPhrases = useAllPhrases();
  const { recordSeen } = useProgress();
  const navigate = useNavigate();
  const [sessionPhrases] = useState(() => {
    const shuffled = [...allPhrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, SESSION_SIZE);
  });
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);

  const handleComplete = async (res: QuizResult[]) => {
    setResults(res);
    setDone(true);
    for (const r of res) {
      await recordSeen(r.phrase_id, r.correct);
    }
  };

  const correct = results.filter((r) => r.correct).length;

  return (
    <Layout mode="dadi" title="Understanding Quiz" backTo="/dadi">
      <div className="px-4 py-6 max-w-lg mx-auto">
        {!done ? (
          <UnderstandingQuiz
            phrases={sessionPhrases}
            allPhrases={allPhrases}
            onComplete={handleComplete}
          />
        ) : (
          <div className="flex flex-col items-center gap-6 text-center pt-4">
            <div className="text-6xl">{correct >= 4 ? '🎉' : correct >= 2 ? '👍' : '💪'}</div>
            <div>
              <p className="text-dadi-2xl font-dadi font-bold text-dadi-text">
                {correct} / {sessionPhrases.length} correct
              </p>
              <p className="devanagari text-purple-500 text-dadi-base mt-2">
                {correct >= 4 ? 'बहुत बढ़िया!' : correct >= 2 ? 'अच्छा!' : 'कोशिश करते रहें!'}
              </p>
              <p className="text-gray-500 text-dadi-sm mt-1">
                {correct >= 4 ? 'Excellent!' : correct >= 2 ? 'Good job!' : 'Keep practicing!'}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => navigate('/dadi/quiz')}
                className="w-full rounded-2xl py-4 font-dadi font-bold text-dadi-base bg-dadi-primary text-white hover:bg-dadi-primary-dark active:scale-95 transition-all touch-target"
              >
                Try again
              </button>
              <button
                onClick={() => navigate('/dadi')}
                className="w-full rounded-2xl py-4 font-dadi font-bold text-dadi-base bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all touch-target"
              >
                Back to menu
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
