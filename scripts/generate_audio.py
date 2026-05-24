#!/usr/bin/env python3
"""
Audio generation pipeline for Family Language Bridge.
Generates English (en-US) and Hindi (hi) audio files from phrases.json
using espeak-ng + ffmpeg for WAV→MP3 conversion.
"""

import json
import subprocess
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PHRASES_FILE = REPO_ROOT / "src" / "data" / "phrases.json"
EN_OUT = REPO_ROOT / "public" / "audio" / "en"
HI_OUT = REPO_ROOT / "public" / "audio" / "hi"


def check_deps():
    for cmd in ["espeak-ng", "ffmpeg"]:
        if not shutil.which(cmd):
            raise RuntimeError(f"{cmd} not found. Install it first.")


def wav_to_mp3(wav_path: Path, mp3_path: Path, speed_factor=1.0):
    """Convert WAV to MP3 with optional tempo adjustment."""
    filter_chain = f"atempo={speed_factor}" if speed_factor != 1.0 else "anull"
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", str(wav_path),
            "-filter:a", filter_chain,
            "-codec:a", "libmp3lame",
            "-qscale:a", "3",          # ~190 kbps VBR, good quality
            "-ar", "22050",            # 22kHz, sufficient for speech
            str(mp3_path),
        ],
        check=True,
        capture_output=True,
    )


def generate_english(text: str, out_path: Path):
    wav = out_path.with_suffix(".wav")
    subprocess.run(
        [
            "espeak-ng",
            "-v", "en-us",
            "-s", "145",               # words per minute (natural pace)
            "-p", "45",                # pitch (lower = more natural female)
            "-a", "90",               # amplitude (volume)
            text,
            "-w", str(wav),
        ],
        check=True,
        capture_output=True,
    )
    wav_to_mp3(wav, out_path)
    wav.unlink()


def generate_hindi(text: str, romanized: str, out_path: Path):
    wav = out_path.with_suffix(".wav")
    # espeak-ng handles Devanagari natively; use romanized as fallback
    try:
        subprocess.run(
            [
                "espeak-ng",
                "-v", "hi",
                "-s", "130",           # slightly slower for Hindi
                "-p", "45",
                "-a", "90",
                text,                  # Devanagari
                "-w", str(wav),
            ],
            check=True,
            capture_output=True,
        )
    except subprocess.CalledProcessError:
        # Fallback to romanized
        subprocess.run(
            ["espeak-ng", "-v", "hi", "-s", "130", romanized, "-w", str(wav)],
            check=True,
            capture_output=True,
        )
    wav_to_mp3(wav, out_path)
    wav.unlink()


def main():
    check_deps()
    EN_OUT.mkdir(parents=True, exist_ok=True)
    HI_OUT.mkdir(parents=True, exist_ok=True)

    with open(PHRASES_FILE) as f:
        phrases = json.load(f)

    print(f"Generating audio for {len(phrases)} phrases...\n")
    errors = []

    for phrase in phrases:
        pid = phrase["id"]
        en_text = phrase["english_text"]
        hi_dev = phrase["hindi_devanagari"]
        hi_rom = phrase["hindi_romanized"]

        en_path = EN_OUT / f"{pid}.mp3"
        hi_path = HI_OUT / f"{pid}.mp3"

        # English
        try:
            generate_english(en_text, en_path)
            print(f"[{pid}] EN ✓  {en_text}")
        except Exception as e:
            print(f"[{pid}] EN ✗  {en_text}: {e}")
            errors.append(f"EN {pid}: {e}")

        # Hindi
        try:
            generate_hindi(hi_dev, hi_rom, hi_path)
            print(f"[{pid}] HI ✓  {hi_dev}")
        except Exception as e:
            print(f"[{pid}] HI ✗  {hi_dev}: {e}")
            errors.append(f"HI {pid}: {e}")

    print(f"\n{'='*40}")
    total = len(phrases) * 2
    failed = len(errors)
    print(f"Done: {total - failed}/{total} files generated")
    if errors:
        print("Errors:")
        for e in errors:
            print(f"  {e}")
    else:
        print("All audio files generated successfully!")


if __name__ == "__main__":
    main()
