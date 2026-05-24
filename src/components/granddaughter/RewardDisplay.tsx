interface RewardDisplayProps {
  stars: number;
  total: number;
  message?: string;
  onContinue: () => void;
}

const MESSAGES = [
  ['🌟 Amazing!', 'You got them all right!'],
  ['✨ Great job!', 'Almost perfect!'],
  ['👍 Good work!', 'Keep practicing!'],
  ['💪 Keep going!', "You're learning!"],
];

export default function RewardDisplay({ stars, total, onContinue }: RewardDisplayProps) {
  const ratio = total > 0 ? stars / total : 0;
  const [title, subtitle] =
    ratio >= 1
      ? MESSAGES[0]
      : ratio >= 0.67
      ? MESSAGES[1]
      : ratio >= 0.33
      ? MESSAGES[2]
      : MESSAGES[3];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-orange-400 to-yellow-300 flex flex-col items-center justify-center z-50 px-4">
      <div className="text-center animate-bounce-in flex flex-col items-center gap-4">
        <div className="text-8xl">{ratio >= 0.67 ? '🏆' : '🌟'}</div>
        <h2 className="text-4xl font-child font-black text-white drop-shadow">{title}</h2>
        <p className="text-xl font-child text-white/90">{subtitle}</p>

        <div className="flex gap-2 my-4">
          {[...Array(total)].map((_, i) => (
            <span
              key={i}
              className={`text-4xl transition-all ${
                i < stars ? 'animate-star-pop' : 'opacity-30'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <p className="text-3xl font-child font-bold text-white">
          {stars} / {total} stars
        </p>

        <button
          onClick={onContinue}
          className="mt-4 rounded-3xl px-10 py-5 bg-white text-child-primary font-child font-black text-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all touch-target"
        >
          Continue! →
        </button>
      </div>
    </div>
  );
}
