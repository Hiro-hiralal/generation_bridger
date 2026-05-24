#!/usr/bin/env python3
"""
Audio generation pipeline for Family Language Bridge.

Generates English (en-US) and Hindi (hi) audio for all phrases.

Voice priority:
  English: Kokoro (high quality) → espeak-ng fallback
  Hindi:   Indic Parler-TTS (high quality) → espeak-ng fallback

Run from the repo root:
  python3 scripts/generate_audio.py

Requirements:
  pip install kokoro soundfile scipy transformers
  Optional for better Hindi: pip install git+https://github.com/AI4Bharat/indic-parler-tts
  System: espeak-ng, ffmpeg
"""

import json
import subprocess
import shutil
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PHRASES_FILE = REPO_ROOT / "src" / "data" / "phrases.json"
EN_OUT = REPO_ROOT / "public" / "audio" / "en"
HI_OUT = REPO_ROOT / "public" / "audio" / "hi"

SAMPLE_RATE_KOKORO = 24000
KOKORO_VOICE = "af_heart"   # warm female American English voice


# ---------------------------------------------------------------------------
# ffmpeg conversion
# ---------------------------------------------------------------------------

def wav_to_mp3(wav_path: Path, mp3_path: Path):
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", str(wav_path),
            "-codec:a", "libmp3lame",
            "-qscale:a", "3",      # ~190 kbps VBR
            "-ar", "22050",
            str(mp3_path),
        ],
        check=True,
        capture_output=True,
    )


def array_to_mp3(audio_array, sample_rate: int, mp3_path: Path):
    import soundfile as sf
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        wav_path = Path(f.name)
    sf.write(str(wav_path), audio_array, sample_rate)
    wav_to_mp3(wav_path, mp3_path)
    wav_path.unlink()


# ---------------------------------------------------------------------------
# English: Kokoro
# ---------------------------------------------------------------------------

_kokoro_pipeline = None

def get_kokoro():
    global _kokoro_pipeline
    if _kokoro_pipeline is None:
        print("  Loading Kokoro English voice model (downloads ~80MB on first run)...")
        from kokoro import KPipeline
        _kokoro_pipeline = KPipeline(lang_code='a')
    return _kokoro_pipeline


def generate_english_kokoro(text: str, mp3_path: Path, speed: float = 1.0):
    import numpy as np
    pipe = get_kokoro()
    chunks = [audio for _, _, audio in pipe(text, voice=KOKORO_VOICE, speed=speed)]
    audio = np.concatenate(chunks)
    array_to_mp3(audio, SAMPLE_RATE_KOKORO, mp3_path)


# ---------------------------------------------------------------------------
# English fallback: espeak-ng
# ---------------------------------------------------------------------------

def generate_english_espeak(text: str, mp3_path: Path):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        wav_path = Path(f.name)
    subprocess.run(
        ["espeak-ng", "-v", "en-us", "-s", "145", "-p", "45", "-a", "90", text, "-w", str(wav_path)],
        check=True, capture_output=True,
    )
    wav_to_mp3(wav_path, mp3_path)
    wav_path.unlink()


def generate_english(text: str, mp3_path: Path):
    try:
        generate_english_kokoro(text, mp3_path)
        return "kokoro"
    except Exception as e:
        if "kokoro" in str(type(e).__module__).lower() or "import" in str(e).lower():
            pass  # expected if not installed
        else:
            print(f"    Kokoro error ({e}), falling back to espeak-ng")
        generate_english_espeak(text, mp3_path)
        return "espeak-ng"


# ---------------------------------------------------------------------------
# Hindi: Indic Parler-TTS
# ---------------------------------------------------------------------------

_parler_model = None
_parler_tokenizer = None

PARLER_DESCRIPTION = (
    "A female speaker with a clear, warm voice. "
    "The recording is of high quality with no background noise."
)

def get_parler():
    global _parler_model, _parler_tokenizer
    if _parler_model is None:
        print("  Loading Indic Parler-TTS model (downloads ~1GB on first run)...")
        import torch
        from transformers import AutoTokenizer
        from parler_tts import ParlerTTSForConditionalGeneration

        model_id = "ai4bharat/indic-parler-tts"
        device = "cuda" if torch.cuda.is_available() else "cpu"
        _parler_model = ParlerTTSForConditionalGeneration.from_pretrained(model_id).to(device)
        _parler_tokenizer = AutoTokenizer.from_pretrained(model_id)
    return _parler_model, _parler_tokenizer


def generate_hindi_parler(devanagari: str, mp3_path: Path):
    import torch
    model, tokenizer = get_parler()
    device = next(model.parameters()).device

    input_ids = tokenizer(PARLER_DESCRIPTION, return_tensors="pt").input_ids.to(device)
    prompt_ids = tokenizer(devanagari, return_tensors="pt").input_ids.to(device)

    with torch.no_grad():
        generation = model.generate(
            input_ids=input_ids,
            prompt_input_ids=prompt_ids,
        )

    audio = generation.cpu().numpy().squeeze()
    sr = model.config.sampling_rate
    array_to_mp3(audio, sr, mp3_path)


# ---------------------------------------------------------------------------
# Hindi fallback: espeak-ng
# ---------------------------------------------------------------------------

def generate_hindi_espeak(devanagari: str, romanized: str, mp3_path: Path):
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        wav_path = Path(f.name)
    try:
        subprocess.run(
            ["espeak-ng", "-v", "hi", "-s", "130", "-p", "45", "-a", "90", devanagari, "-w", str(wav_path)],
            check=True, capture_output=True,
        )
    except subprocess.CalledProcessError:
        subprocess.run(
            ["espeak-ng", "-v", "hi", "-s", "130", romanized, "-w", str(wav_path)],
            check=True, capture_output=True,
        )
    wav_to_mp3(wav_path, mp3_path)
    wav_path.unlink()


def generate_hindi(devanagari: str, romanized: str, mp3_path: Path):
    try:
        generate_hindi_parler(devanagari, mp3_path)
        return "parler-tts"
    except Exception as e:
        if "import" in str(e).lower() or "No module" in str(e):
            pass  # not installed
        else:
            print(f"    Parler error ({e}), falling back to espeak-ng")
        generate_hindi_espeak(devanagari, romanized, mp3_path)
        return "espeak-ng"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def check_deps():
    for cmd in ["espeak-ng", "ffmpeg"]:
        if not shutil.which(cmd):
            print(f"ERROR: '{cmd}' not found in PATH.")
            print("  Mac:   brew install espeak-ng ffmpeg")
            print("  Linux: sudo apt install espeak-ng ffmpeg")
            sys.exit(1)


def main():
    check_deps()
    EN_OUT.mkdir(parents=True, exist_ok=True)
    HI_OUT.mkdir(parents=True, exist_ok=True)

    with open(PHRASES_FILE) as f:
        phrases = json.load(f)

    print(f"\nGenerating audio for {len(phrases)} phrases...\n")
    errors = []
    voice_used = {"en": set(), "hi": set()}

    for phrase in phrases:
        pid = phrase["id"]

        try:
            engine = generate_english(phrase["english_text"], EN_OUT / f"{pid}.mp3")
            voice_used["en"].add(engine)
            print(f"[{pid}] EN ✓  [{engine}]  {phrase['english_text']}")
        except Exception as e:
            print(f"[{pid}] EN ✗  {phrase['english_text']}: {e}")
            errors.append(f"EN {pid}: {e}")

        try:
            engine = generate_hindi(phrase["hindi_devanagari"], phrase["hindi_romanized"], HI_OUT / f"{pid}.mp3")
            voice_used["hi"].add(engine)
            print(f"[{pid}] HI ✓  [{engine}]  {phrase['hindi_devanagari']}")
        except Exception as e:
            print(f"[{pid}] HI ✗  {phrase['hindi_devanagari']}: {e}")
            errors.append(f"HI {pid}: {e}")

    print(f"\n{'='*50}")
    total = len(phrases) * 2
    failed = len(errors)
    print(f"Done: {total - failed}/{total} files generated")
    print(f"English engine(s): {', '.join(voice_used['en'])}")
    print(f"Hindi engine(s):   {', '.join(voice_used['hi'])}")

    if errors:
        print("\nErrors:")
        for e in errors:
            print(f"  {e}")
    else:
        print("\nAll files generated! Now run:")
        print("  git add public/audio/")
        print('  git commit -m "chore: upgrade TTS audio quality"')
        print("  git push origin main")


if __name__ == "__main__":
    main()
