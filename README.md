# Star Hero ⭐

An Android app that helps children build good daily habits — homework, Quran, prayers — with stars, rewards and a superhero who grows with them. Arabic and English. **Everything runs on the phone, offline**; nothing is sent anywhere.

## Features

- **Daily missions** (homework, Quran, five prayers, your own) that the parent approves and rates 1–5 stars; streaks, a 3-planet journey with treasure chests, and a reward shop where stars buy real treats.
- **Focus Guard** — props the phone on the desk and watches a homework or Quran session:
  - shouting, fidgeting and leaving the seat (plain loudness and pixel math, no AI);
  - every Quran word checked as the child recites, by an **offline Quran speech model** (Tarteel's Quran Whisper running on the phone), with red/green words, a practice list of missed words, Memorize mode, and tap-a-word to hear the ayah by Al-Husary;
  - reminders in the parent's own recorded voice, homework breaks, bonus stars, weekly report.
- **Sticker book** and a memorized-surahs map, **prayer-time reminders** (calculated offline for 51 cities), **share the weekly report** as a picture, daily reminder, backup/restore, several children.
- Extras: homework photo proof, hero dress-up, Ramadan mode, adhkar and good deeds, Hero-of-the-Week certificate, home-screen widget, weekly auto-backup.

## Build

The app is a WebView shell (`app/src/main/java`) around a plain HTML/JS app (`app/src/main/assets`). Two large assets are **not** in this repo; download them first:

```bash
./scripts/fetch-assets.sh          # Quran speech model (~100 MB) + Al-Husary recitation (~41 MB); needs curl and ffmpeg
./gradlew assembleDebug            # Android SDK 36; APK in app/build/outputs/apk/debug/
```

Release signing reads `keystore.properties` (not in the repo); without it, release builds are unsigned.

### Self-checks

```bash
node app/src/main/assets/logic.js          # stars, streaks, approvals, rewards
node app/src/main/assets/monitor-logic.js  # Quran word matching, Focus Guard rules
node app/src/main/assets/prayers.js        # prayer times
```

## Licence

The app's own code is released under the [MIT License](LICENSE). The third-party parts below keep their own licences.

## Credits and licences

| What | Source | Licence |
|---|---|---|
| Quran text | [Tanzil Project](https://tanzil.net) (`quran-simple.txt`, verbatim, notice kept) | Tanzil terms |
| Quran speech model | [tarteel-ai/whisper-base-ar-quran](https://huggingface.co/tarteel-ai/whisper-base-ar-quran), ONNX export [aaqibhabib/whisper-base-ar-quran-onnx](https://huggingface.co/aaqibhabib/whisper-base-ar-quran-onnx) | Apache-2.0 |
| Recitation audio | Mahmoud Khalil Al-Husary via [everyayah.com](https://everyayah.com) — downloaded by the script, not redistributed here | see everyayah.com |
| Transformers.js / ONNX Runtime Web | Hugging Face / Microsoft | Apache-2.0 / MIT |
| Icons | [Phosphor Icons](https://phosphoricons.com) | MIT |
| Prayer times | [adhan-js](https://github.com/batoulapps/adhan-js) | MIT |
