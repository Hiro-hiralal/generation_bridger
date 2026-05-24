import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/shared/Layout';
import MatchingGame from '../../components/granddaughter/MatchingGame';
import RewardDisplay from '../../components/granddaughter/RewardDisplay';
import { useAllPhrases } from '../../hooks/usePhrases';
import { useProgress } from '../../store/ProgressContext';

const SESSION_SIZE = 5;

export default function MatchingGamePage() {
  const allPhrases = useAllPhrases();
  const { recordSeen } = useProgress();
  const navigate = useNavigate();

  const [sessionPhrases] = useState(() => {
    const shuffled = [...allPhrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, SESSION_SIZE);
  });
  const [stars, setStars] = useState<number | null>(null);

  const handleComplete = async (earnedStars: number) => {
    setStars(earnedStars);
    for (const p of sessionPhrases) {
      // Mark as seen; correctness is based on ratio
      await recordSeen(p.id, earnedStars >= sessionPhrases.length / 2);
    }
  };

  const handleContinue = () => navigate('/child');

  return (
    <Layout mode="granddaughter" title="Matching Game!" backTo="/child">
      <div className="px-4 py-6 max-w-lg mx-auto">
        <MatchingGame
          phrases={sessionPhrases}
          allPhrases={allPhrases}
          onComplete={handleComplete}
        />
      </div>
      {stars !== null && (
        <RewardDisplay
          stars={stars}
          total={sessionPhrases.length}
          onContinue={handleContinue}
        />
      )}
    </Layout>
  );
}
