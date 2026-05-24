import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

export default function Landing() {
  const { setMode } = useApp();
  const navigate = useNavigate();

  const selectDadi = () => {
    setMode('dadi');
    navigate('/dadi');
  };

  const selectChild = () => {
    setMode('granddaughter');
    navigate('/child');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-orange-50 flex flex-col items-center justify-center px-4 py-8 gap-8">
      <div className="text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Family Language Bridge</h1>
        <p className="text-gray-500 text-lg">Connecting family across languages</p>
        <p className="devanagari text-purple-600 text-xl mt-1">परिवार की भाषा सेतु</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-5">
        <button
          onClick={selectDadi}
          className="w-full rounded-3xl p-6 bg-white shadow-lg border-2 border-purple-200 hover:border-purple-400 active:scale-95 transition-all text-left"
        >
          <div className="text-4xl mb-2">👵</div>
          <div className="text-2xl font-bold font-dadi text-dadi-primary mb-1">
            Dadi's Mode
          </div>
          <div className="devanagari text-purple-500 text-lg mb-1">दादी का मोड</div>
          <p className="text-gray-500 text-sm">Learn English phrases • सुनें और सीखें</p>
        </button>

        <button
          onClick={selectChild}
          className="w-full rounded-3xl p-6 bg-white shadow-lg border-2 border-orange-200 hover:border-orange-400 active:scale-95 transition-all text-left"
        >
          <div className="text-4xl mb-2">👧</div>
          <div className="text-2xl font-bold font-child text-child-primary mb-1">
            My Mode
          </div>
          <p className="text-gray-500 text-sm">Learn Hindi words • Collect stars ⭐</p>
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Progress is saved on this device
      </p>
    </div>
  );
}
