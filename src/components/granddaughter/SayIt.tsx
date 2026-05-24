import type { Phrase } from '../../types';
import AudioPlayer from '../shared/AudioPlayer';
import RecordPlayback from '../shared/RecordPlayback';

interface SayItProps {
  phrase: Phrase;
  showRomanized: boolean;
}

export default function SayIt({ phrase, showRomanized }: SayItProps) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-md flex flex-col gap-4">
      <div className="text-center">
        <p className="font-child text-gray-500 text-sm mb-1">Say this in Hindi:</p>
        <p className="font-child font-black text-2xl text-gray-800">{phrase.english_text}</p>
      </div>

      <div className="text-center py-3 bg-purple-50 rounded-2xl">
        <p className="devanagari text-3xl text-purple-700 font-bold">
          {phrase.hindi_devanagari}
        </p>
        {showRomanized && (
          <p className="text-gray-400 text-sm italic mt-1">{phrase.hindi_romanized}</p>
        )}
      </div>

      <div>
        <p className="font-child text-sm text-gray-500 mb-2">1. Listen first:</p>
        <AudioPlayer
          src={phrase.hindi_audio}
          lang="hi-IN"
          text={phrase.hindi_devanagari}
          size="md"
          label="Play Hindi"
        />
      </div>

      <div>
        <p className="font-child text-sm text-gray-500 mb-2">2. Now you try! 🎤</p>
        <RecordPlayback phraseId={phrase.id} mode="granddaughter" />
      </div>
    </div>
  );
}
