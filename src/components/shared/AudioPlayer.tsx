import { useState } from 'react';
import { useAudio } from '../../hooks/useAudio';
import { audioSrc } from '../../hooks/usePhrases';
import type { AudioSpeed } from '../../types';

interface AudioPlayerProps {
  src: string;
  lang: 'en-US' | 'hi-IN';
  text: string;
  showSpeedToggle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-12 h-12 text-xl',
  lg: 'w-16 h-16 text-3xl',
};

export default function AudioPlayer({
  src,
  lang,
  text,
  showSpeedToggle = false,
  size = 'md',
  onEnded,
  className = '',
  label,
}: AudioPlayerProps) {
  const [speed, setSpeed] = useState<AudioSpeed>('normal');
  const rate = speed === 'slow' ? 0.65 : 1.0;

  const { isPlaying, play, stop } = useAudio({
    src: audioSrc(src),
    lang,
    text,
    onEnded,
  });

  const handlePlay = () => {
    if (isPlaying) {
      stop();
    } else {
      play(rate);
    }
  };

  const btnClass = `${sizeMap[size]} rounded-full flex items-center justify-center font-bold transition-all active:scale-95 touch-target`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={handlePlay}
        aria-label={label ?? (isPlaying ? 'Stop audio' : 'Play audio')}
        className={`${btnClass} ${
          isPlaying
            ? 'bg-purple-600 text-white shadow-lg scale-105'
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        }`}
      >
        {isPlaying ? '⏹' : '▶'}
      </button>

      {showSpeedToggle && (
        <button
          onClick={() => {
            const newSpeed = speed === 'normal' ? 'slow' : 'normal';
            setSpeed(newSpeed);
            if (isPlaying) {
              stop();
              setTimeout(() => play(newSpeed === 'slow' ? 0.65 : 1.0), 50);
            }
          }}
          aria-label={`Switch to ${speed === 'normal' ? 'slow' : 'normal'} speed`}
          className="px-3 py-1 rounded-full text-sm font-semibold border-2 border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors touch-target"
        >
          {speed === 'normal' ? '🐢 Slow' : '🐇 Normal'}
        </button>
      )}
    </div>
  );
}
