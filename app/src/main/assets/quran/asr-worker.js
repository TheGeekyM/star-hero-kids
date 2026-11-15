// Runs the Quran speech model (Tarteel's Quran Whisper, int8) off the main thread, fully offline.
// In: { id, audio: Float32Array at 16 kHz }. Out: { ready } once loaded, { id, text } per phrase, { error }.
import { pipeline, env } from '../lib/transformers.min.js';

env.allowRemoteModels = false;              // never touch the internet
env.allowLocalModels = true;                // off by default in browsers; our model ships inside the app
env.localModelPath = new URL('./', import.meta.url).href;
env.useBrowserCache = false;                // the model already lives in the APK; don't copy 100 MB into cache storage
env.backends.onnx.wasm.wasmPaths = new URL('../lib/', import.meta.url).href;
env.backends.onnx.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 1) : 1;

const asr = pipeline('automatic-speech-recognition', 'model', { dtype: 'q8', device: 'wasm' });
asr.then(() => postMessage({ ready: true }), e => postMessage({ error: String(e && e.message || e) }));

// One phrase at a time, in order: the matcher needs them in the order they were said.
let queue = Promise.resolve();
onmessage = ({ data }) => {
  queue = queue.then(async () => {
    try {
      const r = await (await asr)(data.audio, { chunk_length_s: 30, stride_length_s: 5 });
      postMessage({ id: data.id, text: r.text || '' });
    } catch (e) {
      postMessage({ id: data.id, text: '', error: String(e && e.message || e) });
    }
  });
};
