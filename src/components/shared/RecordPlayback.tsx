import { useEffect } from 'react';
import { useRecorder } from '../../hooks/useRecorder';
import { useProgress } from '../../store/ProgressContext';
import type { AppMode } from '../../types';

interface RecordPlaybackProps {
  phraseId: string;
  mode: AppMode;
  onRecordingComplete?: (blob: Blob) => void;
  isDadi?: boolean;
  className?: string;
}

export default function RecordPlayback({
  phraseId,
  mode,
  onRecordingComplete,
  isDadi = false,
  className = '',
}: RecordPlaybackProps) {
  const { status, recordingBlob, startRecording, stopRecording, playRecording, stopPlayback, reset, error } =
    useRecorder();
  const { saveRecording } = useProgress();

  useEffect(() => {
    return () => reset();
  }, [phraseId, reset]);

  const handleSave = async () => {
    if (recordingBlob) {
      await saveRecording(phraseId, recordingBlob, mode);
      onRecordingComplete?.(recordingBlob);
    }
  };

  const btnBase = isDadi
    ? 'touch-target-lg rounded-2xl px-6 py-4 font-bold text-lg font-dadi transition-all active:scale-95'
    : 'touch-target rounded-2xl px-5 py-3 font-bold text-base font-child transition-all active:scale-95';

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">
          {error === 'Permission denied' || error.includes('denied')
            ? 'Microphone access is needed to record. Please allow it in your browser settings.'
            : error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {status === 'idle' && (
          <button
            onClick={startRecording}
            className={`${btnBase} bg-red-100 text-red-700 hover:bg-red-200`}
          >
            🎙 {isDadi ? 'Record yourself' : 'Record me!'}
          </button>
        )}

        {status === 'recording' && (
          <button
            onClick={stopRecording}
            className={`${btnBase} bg-red-500 text-white animate-pulse`}
          >
            ⏹ Stop recording
          </button>
        )}

        {status === 'recorded' && (
          <>
            <button
              onClick={playRecording}
              className={`${btnBase} bg-green-100 text-green-700 hover:bg-green-200`}
            >
              ▶ Play back
            </button>
            <button
              onClick={handleSave}
              className={`${btnBase} bg-purple-100 text-purple-700 hover:bg-purple-200`}
            >
              💾 Save
            </button>
            <button
              onClick={reset}
              className={`${btnBase} bg-gray-100 text-gray-600 hover:bg-gray-200`}
            >
              🔄 Try again
            </button>
          </>
        )}

        {status === 'playing' && (
          <button
            onClick={stopPlayback}
            className={`${btnBase} bg-green-500 text-white`}
          >
            ⏹ Stop playback
          </button>
        )}
      </div>
    </div>
  );
}
