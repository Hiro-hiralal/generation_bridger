import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { useProgress } from '../../store/ProgressContext';
import Layout from '../../components/shared/Layout';

export default function DadiHome() {
  const { setMode } = useApp();
  const { masteredCount, totalStars } = useProgress();
  const navigate = useNavigate();

  return (
    <Layout mode="dadi" showBack={false}>
      <div className="px-4 py-6 flex flex-col gap-6 max-w-lg mx-auto">
        <div className="text-center pt-2">
          <div className="text-5xl mb-3">👵</div>
          <h1 className="text-dadi-xl font-dadi font-bold text-dadi-text">Dadi's Mode</h1>
          <p className="devanagari text-purple-500 text-dadi-base mt-1">दादी का मोड</p>
          {totalStars > 0 && (
            <p className="text-gray-500 mt-2 text-dadi-sm">
              ⭐ {totalStars} stars · {masteredCount} mastered
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/dadi/listen')}
            className="w-full rounded-2xl p-5 bg-white shadow-md border-2 border-purple-200 hover:border-purple-400 active:scale-95 transition-all text-left touch-target"
          >
            <div className="text-3xl mb-2">🎧</div>
            <div className="text-dadi-lg font-dadi font-bold text-dadi-text">Listen & Learn</div>
            <div className="devanagari text-purple-500 text-dadi-sm">सुनें और सीखें</div>
            <p className="text-gray-400 text-sm mt-1">Hear phrases, see translations</p>
          </button>

          <button
            onClick={() => navigate('/dadi/quiz')}
            className="w-full rounded-2xl p-5 bg-white shadow-md border-2 border-amber-200 hover:border-amber-400 active:scale-95 transition-all text-left touch-target"
          >
            <div className="text-3xl mb-2">✅</div>
            <div className="text-dadi-lg font-dadi font-bold text-dadi-text">Understanding Quiz</div>
            <div className="devanagari text-purple-500 text-dadi-sm">समझ की जाँच</div>
            <p className="text-gray-400 text-sm mt-1">Hear English, choose the meaning</p>
          </button>

          <button
            onClick={() => navigate('/dadi/speak')}
            className="w-full rounded-2xl p-5 bg-white shadow-md border-2 border-green-200 hover:border-green-400 active:scale-95 transition-all text-left touch-target"
          >
            <div className="text-3xl mb-2">🎙</div>
            <div className="text-dadi-lg font-dadi font-bold text-dadi-text">Speak It</div>
            <div className="devanagari text-purple-500 text-dadi-sm">बोलें और सुनें</div>
            <p className="text-gray-400 text-sm mt-1">Listen, then record yourself</p>
          </button>
        </div>

        <button
          onClick={() => { setMode(null); navigate('/'); }}
          className="text-center text-dadi-sm text-gray-400 underline mt-2 touch-target py-2"
        >
          Switch mode / मोड बदलें
        </button>
      </div>
    </Layout>
  );
}
