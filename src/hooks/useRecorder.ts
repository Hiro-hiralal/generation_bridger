import { useState, useRef, useCallback } from 'react';

type RecorderStatus = 'idle' | 'recording' | 'recorded' | 'playing';

interface UseRecorderReturn {
  status: RecorderStatus;
  recordingBlob: Blob | null;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  playRecording: () => void;
  stopPlayback: () => void;
  reset: () => void;
  error: string | null;
}

function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return '';
}

export function useRecorder(): UseRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || 'audio/webm',
        });
        const url = URL.createObjectURL(blob);
        setRecordingBlob(blob);
        setAudioUrl(url);
        setStatus('recorded');

        // Stop all tracks to release microphone
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start();
      setStatus('recording');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied';
      setError(msg);
      setStatus('idle');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const playRecording = useCallback(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    playbackAudioRef.current = audio;
    audio.onended = () => setStatus('recorded');
    audio.play();
    setStatus('playing');
  }, [audioUrl]);

  const stopPlayback = useCallback(() => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current.currentTime = 0;
    }
    setStatus('recorded');
  }, []);

  const reset = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setRecordingBlob(null);
    setAudioUrl(null);
    setStatus('idle');
    setError(null);
  }, [audioUrl]);

  return {
    status,
    recordingBlob,
    audioUrl,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    reset,
    error,
  };
}
