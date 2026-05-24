import type { Phrase } from '../../types';
import type { Progress } from '../../types';

interface ProgressMapProps {
  phrases: Phrase[];
  progressMap: Map<string, Progress>;
}

const themeEmoji: Record<string, string> = {
  greetings: '👋',
  family: '👨‍👩‍👧',
  'video-call': '📱',
  mealtime: '🍽️',
  feelings: '😊',
  play: '🎮',
  school: '📚',
  bedtime: '🌙',
};

export default function ProgressMap({ phrases, progressMap }: ProgressMapProps) {
  const byTheme = phrases.reduce<Record<string, Phrase[]>>((acc, p) => {
    if (!acc[p.theme]) acc[p.theme] = [];
    acc[p.theme].push(p);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(byTheme).map(([theme, themeP]) => {
        const totalMastery = themeP.reduce(
          (sum, p) => sum + (progressMap.get(p.id)?.mastery_level ?? 0),
          0
        );
        const maxMastery = themeP.length * 4;
        const pct = maxMastery > 0 ? Math.round((totalMastery / maxMastery) * 100) : 0;

        return (
          <div key={theme} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{themeEmoji[theme] ?? '📖'}</span>
              <span className="font-child font-bold capitalize text-gray-700">{theme}</span>
              <span className="ml-auto font-child font-bold text-child-primary">{pct}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {themeP.map((p) => {
                const level = progressMap.get(p.id)?.mastery_level ?? 0;
                return (
                  <div
                    key={p.id}
                    title={p.english_text}
                    className={`w-5 h-5 rounded-full ${
                      level >= 4
                        ? 'bg-yellow-400'
                        : level >= 2
                        ? 'bg-orange-300'
                        : level >= 1
                        ? 'bg-orange-100'
                        : 'bg-gray-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
