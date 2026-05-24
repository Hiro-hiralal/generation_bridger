import type { Phrase, AppMode } from '../../types';
import { audioSrc } from '../../hooks/usePhrases';
import AudioPlayer from './AudioPlayer';

interface PhraseCardProps {
  phrase: Phrase;
  mode: AppMode;
  showHindi?: boolean;
  showRomanized?: boolean;
  highlighted?: 'correct' | 'incorrect' | null;
  size?: 'sm' | 'lg';
  showAudioPlayer?: boolean;
  showSpeedToggle?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function PhraseCard({
  phrase,
  mode,
  showHindi = true,
  showRomanized = false,
  highlighted = null,
  size = 'sm',
  showAudioPlayer = true,
  showSpeedToggle = false,
  className = '',
  onClick,
}: PhraseCardProps) {
  const isDadi = mode === 'dadi';
  const isLarge = size === 'lg';

  const highlightClass =
    highlighted === 'correct'
      ? 'ring-4 ring-green-400 bg-green-50'
      : highlighted === 'incorrect'
      ? 'ring-4 ring-red-400 bg-red-50'
      : '';

  return (
    <div
      className={`rounded-2xl p-4 bg-white shadow-md ${highlightClass} ${
        onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {phrase.image && (
        <img
          src={audioSrc(phrase.image)}
          alt={phrase.english_text}
          className="w-full h-32 object-contain mb-3 rounded-xl"
        />
      )}

      <p
        className={`font-bold text-gray-900 ${
          isDadi
            ? isLarge
              ? 'text-dadi-xl font-dadi'
              : 'text-dadi-lg font-dadi'
            : isLarge
            ? 'text-2xl font-child'
            : 'text-xl font-child'
        }`}
      >
        {phrase.english_text}
      </p>

      {showHindi && (
        <>
          <p
            className={`devanagari mt-2 text-purple-700 ${
              isDadi ? 'text-dadi-base' : 'text-xl'
            }`}
          >
            {phrase.hindi_devanagari}
          </p>
          {showRomanized && (
            <p className="mt-1 text-gray-500 italic text-sm">
              {phrase.hindi_romanized}
            </p>
          )}
        </>
      )}

      {phrase.usage_note && (
        <p className="mt-2 text-xs text-gray-400">{phrase.usage_note}</p>
      )}

      {showAudioPlayer && (
        <div className="mt-3 flex gap-2 flex-wrap">
          <AudioPlayer
            src={phrase.english_audio}
            lang="en-US"
            text={phrase.english_text}
            size={isDadi ? 'lg' : 'md'}
            showSpeedToggle={showSpeedToggle && isDadi}
            label="Play English"
          />
          {showHindi && (
            <AudioPlayer
              src={phrase.hindi_audio}
              lang="hi-IN"
              text={phrase.hindi_devanagari}
              size={isDadi ? 'lg' : 'md'}
              label="Play Hindi"
            />
          )}
        </div>
      )}
    </div>
  );
}
