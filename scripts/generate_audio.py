#!/usr/bin/env python3
"""
Audio generation pipeline for Family Language Bridge.

Voices used:
  English: en-US-JennyNeural  (warm, natural American female — Microsoft Edge TTS)
  Hindi:   hi-IN-SwaraNeural  (clear female Hindi — Microsoft Edge TTS)

Run from the repo root:
  pip install edge-tts
  python3 scripts/generate_audio.py

Then push:
  git add public/audio/
  git commit -m "chore: upgrade to neural TTS voices"
  git push origin main
"""

import asyncio
import json
import sys
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
PHRASES_FILE = REPO_ROOT / "src" / "data" / "phrases.json"
EN_OUT = REPO_ROOT / "public" / "audio" / "en"
HI_OUT = REPO_ROOT / "public" / "audio" / "hi"

EN_VOICE = "en-US-JennyNeural"   # warm American female, ideal for accent learning
HI_VOICE = "hi-IN-SwaraNeural"   # clear Hindi female


def check_deps():
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        print("ERROR: edge-tts not installed.")
        print("  Run: pip install edge-tts")
        sys.exit(1)


async def generate_one(text: str, voice: str, out_path: Path):
    import edge_tts
    tts = edge_tts.Communicate(text, voice=voice, rate="-5%")
    await tts.save(str(out_path))


async def main():
    check_deps()

    EN_OUT.mkdir(parents=True, exist_ok=True)
    HI_OUT.mkdir(parents=True, exist_ok=True)

    with open(PHRASES_FILE) as f:
        phrases = json.load(f)

    print(f"Generating {len(phrases) * 2} audio files with Microsoft neural voices...\n")
    print(f"  English: {EN_VOICE}")
    print(f"  Hindi:   {HI_VOICE}\n")

    errors = []

    for phrase in phrases:
        pid = phrase["id"]

        # English
        try:
            await generate_one(phrase["english_text"], EN_VOICE, EN_OUT / f"{pid}.mp3")
            print(f"[{pid}] EN ✓  {phrase['english_text']}")
        except Exception as e:
            print(f"[{pid}] EN ✗  {phrase['english_text']}: {e}")
            errors.append(f"EN {pid}: {e}")

        # Hindi
        try:
            await generate_one(phrase["hindi_devanagari"], HI_VOICE, HI_OUT / f"{pid}.mp3")
            print(f"[{pid}] HI ✓  {phrase['hindi_devanagari']}")
        except Exception as e:
            print(f"[{pid}] HI ✗  {phrase['hindi_devanagari']}: {e}")
            errors.append(f"HI {pid}: {e}")

    print(f"\n{'='*50}")
    total = len(phrases) * 2
    print(f"Done: {total - len(errors)}/{total} files generated")

    if errors:
        print("\nErrors:")
        for e in errors:
            print(f"  {e}")
    else:
        print("\nAll done! Now push to GitHub:")
        print("  git add public/audio/")
        print('  git commit -m "chore: upgrade to neural TTS voices"')
        print("  git push origin main")


if __name__ == "__main__":
    asyncio.run(main())
