import type { Phrase } from '../../types';
import AudioPlayer from '../shared/AudioPlayer';
import RecordPlayback from '../shared/RecordPlayback';

interface SpeakItProps {
  phrase: Phrase;
}

export default function SpeakIt({ phrase }: SpeakItProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md flex flex-col gap-5">
      <div>
        <p className="text-dadi-2xl font-dadi font-bold text-dadi-text leading-tight">
          {phrase.english_text}
        </p>
        <p className="devanagari text-dadi-lg text-purple-600 mt-2">
          {phrase.hindi_devanagari}
        </p>
        <p className="text-dadi-sm text-gray-400 italic mt-1">{phrase.hindi_romanized}</p>
      </div>

      <div>
        <p className="text-dadi-sm text-gray-500 mb-2">1. Listen to the phrase:</p>
        <AudioPlayer
          src={phrase.english_audio}
          lang="en-US"
          text={phrase.english_text}
          size="lg"
          showSpeedToggle
          label="Play English phrase"
        />
      </div>

      <hr className="border-purple-100" />

      <div>
        <p className="text-dadi-sm text-gray-500 mb-2">2. Now record yourself:</p>
        <RecordPlayback phraseId={phrase.id} mode="dadi" isDadi />
      </div>
    </div>
  );
}
