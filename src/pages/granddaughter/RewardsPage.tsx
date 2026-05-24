import { useNavigate } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import ProgressMap from '../../components/granddaughter/ProgressMap';
import { useAllPhrases } from '../../hooks/usePhrases';
import { useProgress } from '../../store/ProgressContext';

export default function RewardsPage() {
  const allPhrases = useAllPhrases();
  const { totalStars, masteredCount, progress } = useProgress();
  const navigate = useNavigate();

  const totalPossible = allPhrases.length * 4;
  const pct = totalPossible > 0 ? Math.round((totalStars / totalPossible) * 100) : 0;

  return (
    <Layout mode="granddaughter" title="My Rewards 🏆" backTo="/child">
      <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-3xl p-6 text-center shadow-md">
          <div className="text-5xl mb-2">⭐</div>
          <p className="text-4xl font-child font-black text-white">{totalStars} Stars</p>
          <p className="text-white/90 font-child mt-1">
            {masteredCount} / {allPhrases.length} phrases mastered
          </p>
          <div className="mt-4 h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-white/80 text-sm font-child mt-1">{pct}% complete</p>
        </div>

        {masteredCount >= 5 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 text-center animate-bounce-in">
            <p className="text-3xl">🏅</p>
            <p className="font-child font-bold text-yellow-700 mt-1">
              Language Star Badge!
            </p>
            <p className="text-sm text-yellow-600 font-child">You mastered {masteredCount} phrases!</p>
          </div>
        )}

        <div>
          <h2 className="font-child font-black text-xl text-gray-700 mb-3">Progress by Topic</h2>
          <ProgressMap phrases={allPhrases} progressMap={progress} />
        </div>

        <button
          onClick={() => navigate('/child/match')}
          className="w-full rounded-2xl py-4 font-child font-black text-lg bg-child-primary text-white hover:bg-child-primary-dark active:scale-95 transition-all touch-target"
        >
          Keep Learning! 🎮
        </button>
      </div>
    </Layout>
  );
}
