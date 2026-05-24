import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { useProgress } from '../../store/ProgressContext';
import Layout from '../../components/shared/Layout';

export default function GranddaughterHome() {
  const { setMode } = useApp();
  const { totalStars, masteredCount } = useProgress();
  const navigate = useNavigate();

  return (
    <Layout mode="granddaughter" showBack={false}>
      <div className="px-4 py-6 flex flex-col gap-6 max-w-lg mx-auto">
        <div className="text-center pt-2">
          <div className="text-5xl mb-3 animate-bounce-in">👧</div>
          <h1 className="text-3xl font-child font-black text-child-primary">My Learning Zone!</h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl font-child font-bold text-child-star">{totalStars} stars</span>
            {masteredCount > 0 && (
              <span className="text-sm font-child text-gray-500">· {masteredCount} mastered!</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/child/match')}
            className="w-full rounded-3xl p-5 bg-white shadow-lg border-2 border-orange-200 hover:border-orange-400 active:scale-95 transition-all text-left"
          >
            <div className="text-4xl mb-2">🎮</div>
            <div className="text-2xl font-child font-black text-child-primary">Matching Game</div>
            <p className="text-gray-500 text-sm mt-1 font-child">
              Hear a Hindi word, find the match!
            </p>
          </button>

          <button
            onClick={() => navigate('/child/say')}
            className="w-full rounded-3xl p-5 bg-white shadow-lg border-2 border-green-200 hover:border-green-400 active:scale-95 transition-all text-left"
          >
            <div className="text-4xl mb-2">🗣️</div>
            <div className="text-2xl font-child font-black text-child-accent">Say It!</div>
            <p className="text-gray-500 text-sm mt-1 font-child">
              Listen and record yourself in Hindi
            </p>
          </button>

          <button
            onClick={() => navigate('/child/rewards')}
            className="w-full rounded-3xl p-5 bg-white shadow-lg border-2 border-yellow-200 hover:border-yellow-400 active:scale-95 transition-all text-left"
          >
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-2xl font-child font-black text-yellow-600">My Rewards</div>
            <p className="text-gray-500 text-sm mt-1 font-child">See your stars and progress</p>
          </button>
        </div>

        <button
          onClick={() => { setMode(null); navigate('/'); }}
          className="text-center text-sm font-child text-gray-400 underline mt-2 touch-target py-2"
        >
          Switch to Dadi's mode
        </button>
      </div>
    </Layout>
  );
}
