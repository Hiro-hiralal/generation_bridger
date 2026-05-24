import { useState, useRef, useCallback, useEffect } from 'react';
import { checkAudioUrl, speakText, stopSpeech } from '../lib/speechSynthesis';

interface UseAudioOptions {
  src: string;
  lang: 'en-US' | 'hi-IN';
  text: string;
  onEnded?: () => void;
}

interface UseAudioReturn {
  isPlaying: boolean;
  usingSynthesis: boolean;
  play: (rate?: number) => void;
  stop: () => void;
}

const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);

export function useAudio({ src, lang, text, onEnded }: UseAudioOptions): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [usingSynthesis, setUsingSynthesis] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srcAvailableRef = useRef<boolean | null>(null);

  // Pre-check if the audio file exists
  useEffect(() => {
    srcAvailableRef.current = null;
    checkAudioUrl(src).then((available) => {
      srcAvailableRef.current = available;
      setUsingSynthesis(!available);
    });
  }, [src]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopSpeech();
    setIsPlaying(false);
  }, []);

  const play = useCallback(
    (rate = 1.0) => {
      stop();

      const useFile = srcAvailableRef.current === true;

      if (useFile) {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.playbackRate = rate;
        audio.onended = () => {
          setIsPlaying(false);
          onEnded?.();
        };
        audio.onerror = () => {
          // File disappeared or failed at runtime — fall back to synthesis
          setUsingSynthesis(true);
          srcAvailableRef.current = false;
          setIsPlaying(false);
          speakText(text, lang, rate, () => {
            setIsPlaying(false);
            onEnded?.();
          });
        };
        setIsPlaying(true);
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        if (isIOS) {
          // iOS requires user gesture — play is already inside a click handler in our components
        }
        setIsPlaying(true);
        speakText(text, lang, rate, () => {
          setIsPlaying(false);
          onEnded?.();
        });
      }
    },
    [src, lang, text, stop, onEnded]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSpeech();
    };
  }, []);

  return { isPlaying, usingSynthesis, play, stop };
}
