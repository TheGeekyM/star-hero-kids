#!/usr/bin/env bash
# Downloads the two big offline assets that are not stored in this repo, then you can build the app.
#   1. Quran speech model (Tarteel's Quran Whisper, ONNX int8, ~100 MB, Apache-2.0)
#   2. Recitation audio, Mahmoud Khalil Al-Husary, per ayah (everyayah.com), re-encoded small:
#      Al-Fatiha + suras 67-114 (Juz Tabarak and Juz 'Amma), ~41 MB
# Needs: curl, ffmpeg. Safe to run again: files already there are skipped.
set -euo pipefail
cd "$(dirname "$0")/.."
A=app/src/main/assets/quran

echo "== Quran speech model"
M=$A/model; mkdir -p "$M/onnx"
B=https://huggingface.co/aaqibhabib/whisper-base-ar-quran-onnx/resolve/main
for f in config.json generation_config.json preprocessor_config.json tokenizer.json tokenizer_config.json added_tokens.json \
         special_tokens_map.json normalizer.json vocab.json merges.txt onnx/encoder_model_quantized.onnx onnx/decoder_model_merged_quantized.onnx; do
  [ -s "$M/$f" ] || curl -fL --retry 3 -o "$M/$f" "$B/$f"
done
[ -s "$M/LICENSE-tarteel.txt" ] || curl -fsL -o "$M/LICENSE-tarteel.txt" https://www.apache.org/licenses/LICENSE-2.0.txt

echo "== Recitation audio (Al-Husary)"
O=$A/audio; mkdir -p "$O"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
for s in 1 $(seq 67 114); do
  n=$(grep -c "^$s|" $A/quran-simple.txt)
  for a in $(seq 1 "$n"); do
    f=$(printf "%03d%03d" "$s" "$a")
    [ -s "$O/$f.mp3" ] && continue
    curl -fsL --retry 3 -o "$T/$f.mp3" "https://everyayah.com/data/Husary_64kbps/$f.mp3"
    ffmpeg -loglevel error -y -i "$T/$f.mp3" -ac 1 -ar 22050 -b:a 32k "$O/$f.mp3"
  done
  printf "."
done
echo
echo "Done: $(ls "$M/onnx" | wc -l) model files, $(ls "$O" | wc -l) ayah recordings."
