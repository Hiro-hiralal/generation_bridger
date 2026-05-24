const checkedUrls = new Set<string>();
const workingUrls = new Set<string>();

export async function checkAudioUrl(url: string): Promise<boolean> {
  if (checkedUrls.has(url)) return workingUrls.has(url);
  checkedUrls.add(url);
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) {
      workingUrls.add(url);
      return true;
    }
  } catch {
    // network error or missing file
  }
  return false;
}

export function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    const handler = () => {
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler, { once: true });
    // Fallback timeout in case voiceschanged never fires
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
}

export async function speakText(
  text: string,
  lang: 'en-US' | 'hi-IN',
  rate = 1.0,
  onEnd?: () => void
): Promise<void> {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;

  const voices = await getVoices();
  const langPrefix = lang.split('-')[0];
  const match =
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(langPrefix));

  if (match) {
    utterance.voice = match;
  } else if (lang === 'hi-IN') {
    // Degrade gracefully: no Hindi voice available, use English
    utterance.lang = 'en-US';
    const enMatch = voices.find((v) => v.lang.startsWith('en'));
    if (enMatch) utterance.voice = enMatch;
  }

  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function hasHindiVoice(): Promise<boolean> {
  return getVoices().then((voices) =>
    voices.some((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi'))
  );
}
