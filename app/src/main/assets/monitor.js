// Focus Guard: watches a homework or Quran session with the phone's camera and mic, all on the phone, nothing recorded or sent.
// Homework: shouting, fidgeting, leaving the seat (plain math on loudness and pixels).
// Quran: the same camera checks, long silences, and every word checked by the offline Quran speech model.
// Rules live in monitor-logic.js (ML). app.js opens this with Guard.open() and gets the result back in guardDone().
(() => {
const S = {
  en: {
    title: 'Focus Guard', homework: 'Homework time', quran: 'Quran recitation', minutes: 'How long?', min: '{0} min',
    sura: 'Surah', from: 'From ayah', to: 'To ayah', words: '{0} words to recite',
    tip: 'Put the phone on the desk facing you. Sit down, then press Start.', start: 'Start', close: 'Close',
    stop: 'Stop', finish: 'I finished', sound: 'Sound', move: 'Movement', seat: 'Seat',
    sens: 'Sensitivity (parent)', pinAsk: 'Parent PIN', loud: 'Shouting level', voice: 'Voice level', moveK: 'Movement level',
    awayK: 'Left-seat level', quietK: 'Seconds of silence before a reminder',
    loading: 'Getting the Quran checker ready…', ready: 'Quran checker ready', listening: 'Listening…', checking: 'Checking…',
    modelErr: 'The Quran checker could not start: {0}',
    noMedia: 'Star Hero needs the camera and microphone for Focus Guard. Allow them in the phone settings.', noCam: 'No camera: only sound is checked.',
    a_shout: 'Shh! Use your calm voice 🤫', a_fidget: 'Sit still and focus 🧘', a_away: 'Come back to your seat! 🪑',
    a_quiet: 'Keep reciting! 📖', a_bad: 'Check this word: {0}',
    great: 'Great focus!', good: 'Well done!', tryAgain: 'Not finished yet',
    sumTime: '{0} min', sumAlerts: 'Reminders: {0}', none: 'No reminders at all!', sumWords: '{0} of {1} words right', mistakes: 'Words to practise',
    send: 'Send to parent', again: 'Try again', stopSure: 'Stop now? The mission will not be sent to your parent.',
    credit: 'Quran text: Tanzil Project (tanzil.net). Speech model: Tarteel AI. Recitation: Mahmoud Khalil Al-Husary (everyayah.com).',
    s_shout: 'shouting', s_fidget: 'fidgeting', s_away: 'left seat', s_quiet: 'silent', guard: 'Focus Guard',
    hifz: 'Memorize mode: hide the ayat', listenAll: 'Listen first', stopListen: 'Stop listening', tapHear: 'Tap any word to hear its ayah',
    noAudio: 'Recitation audio is included for Al-Fatiha, Juz Tabārak and Juz ʿAmma (suras 67-114).',
    practice: 'Practise first', practiceHint: 'Words you missed before. Tap one to practise its ayah.',
    breaks: 'Breaks', breakOn: '5 min break every 20 min', breakOff: 'No breaks', breakTime: 'Break time!', breakTip: 'Stretch, drink some water 💧', backIn: 'Back to work in',
    bonusNote: '+{0} bonus stars when your parent approves!', bonusS: 'bonus +{0}⭐',
    voiceT: 'Your voice for reminders', voiceHint: 'Record a short message (up to 4 seconds), like "Yusuf, sit down please". It plays instead of the beep.',
    rec: 'Record', recStop: 'Stop', play: 'Play',
    rTitle: 'Focus Guard this week', rMin: 'Minutes focused', rSessions: 'Sessions', rAlerts: 'Reminders', rAcc: 'Quran words right',
  },
  ar: {
    title: 'الحارس', homework: 'وقت الواجب', quran: 'تلاوة القرآن', minutes: 'كم دقيقة؟', min: '{0} دقيقة',
    sura: 'السورة', from: 'من الآية', to: 'إلى الآية', words: '{0} كلمة للتلاوة',
    tip: 'ضع الهاتف على الطاولة مقابلك. اجلس ثم اضغط ابدأ.', start: 'ابدأ', close: 'إغلاق',
    stop: 'إيقاف', finish: 'انتهيت', sound: 'الصوت', move: 'الحركة', seat: 'المقعد',
    sens: 'الحساسية (للوالدين)', pinAsk: 'رمز الوالدين', loud: 'مستوى الصراخ', voice: 'مستوى الصوت', moveK: 'مستوى الحركة',
    awayK: 'مستوى ترك المقعد', quietK: 'ثواني الصمت قبل التذكير',
    loading: 'جارٍ تجهيز مصحّح القرآن…', ready: 'مصحّح القرآن جاهز', listening: 'أستمع…', checking: 'أتحقّق…',
    modelErr: 'تعذّر تشغيل مصحّح القرآن: {0}',
    noMedia: 'يحتاج بطل النجوم إلى الكاميرا والميكروفون. اسمح بهما من إعدادات الهاتف.', noCam: 'لا توجد كاميرا: سيتم فحص الصوت فقط.',
    a_shout: 'هدوء! تكلّم بصوت هادئ 🤫', a_fidget: 'اجلس بهدوء وركّز 🧘', a_away: 'ارجع إلى مقعدك! 🪑',
    a_quiet: 'تابع التلاوة! 📖', a_bad: 'انتبه لهذه الكلمة: {0}',
    great: 'تركيز رائع!', good: 'أحسنت!', tryAgain: 'لم تنتهِ بعد',
    sumTime: '{0} دقيقة', sumAlerts: 'التذكيرات: {0}', none: 'بدون أي تذكير!', sumWords: '{0} من {1} كلمة صحيحة', mistakes: 'كلمات للتدرّب',
    send: 'أرسل للوالدين', again: 'حاول مرة أخرى', stopSure: 'إيقاف الآن؟ لن تُرسَل المهمة لوالديك.',
    credit: 'نص القرآن: مشروع تنزيل (tanzil.net). نموذج الصوت: ترتيل. التلاوة: محمود خليل الحصري (everyayah.com).',
    s_shout: 'صراخ', s_fidget: 'حركة', s_away: 'ترك المقعد', s_quiet: 'صمت', guard: 'الحارس',
    hifz: 'وضع الحفظ: إخفاء الآيات', listenAll: 'استمع أولاً', stopListen: 'إيقاف الاستماع', tapHear: 'اضغط على أي كلمة لتسمع آيتها',
    noAudio: 'التلاوة الصوتية متوفرة للفاتحة وجزء تبارك وجزء عمّ (السور 67-114).',
    practice: 'تدرّب أولاً', practiceHint: 'كلمات أخطأت فيها سابقاً. اضغط على كلمة لتتدرّب على آيتها.',
    breaks: 'الاستراحات', breakOn: 'استراحة 5 دقائق كل 20 دقيقة', breakOff: 'بدون استراحة', breakTime: 'وقت الاستراحة!', breakTip: 'تمدّد واشرب بعض الماء 💧', backIn: 'نعود للعمل بعد',
    bonusNote: '+{0} نجوم إضافية عند موافقة والديك!', bonusS: 'مكافأة +{0}⭐',
    voiceT: 'صوتك للتذكيرات', voiceHint: 'سجّل رسالة قصيرة (حتى 4 ثوانٍ) مثل: "يا يوسف، اجلس من فضلك". تُشغَّل بدلاً من الصفير.',
    rec: 'سجّل', recStop: 'إيقاف', play: 'تشغيل',
    rTitle: 'الحارس هذا الأسبوع', rMin: 'دقائق التركيز', rSessions: 'الجلسات', rAlerts: 'التذكيرات', rAcc: 'كلمات القرآن الصحيحة',
  },
};
const SURAS = "الفاتحة,Al-Faatiha|البقرة,Al-Baqara|آل عمران,Aal-i-Imraan|النساء,An-Nisaa|المائدة,Al-Maaida|الأنعام,Al-An'aam|الأعراف,Al-A'raaf|الأنفال,Al-Anfaal|التوبة,At-Tawba|يونس,Yunus|هود,Hud|يوسف,Yusuf|الرعد,Ar-Ra'd|ابراهيم,Ibrahim|الحجر,Al-Hijr|النحل,An-Nahl|الإسراء,Al-Israa|الكهف,Al-Kahf|مريم,Maryam|طه,Taa-Haa|الأنبياء,Al-Anbiyaa|الحج,Al-Hajj|المؤمنون,Al-Muminoon|النور,An-Noor|الفرقان,Al-Furqaan|الشعراء,Ash-Shu'araa|النمل,An-Naml|القصص,Al-Qasas|العنكبوت,Al-Ankaboot|الروم,Ar-Room|لقمان,Luqman|السجدة,As-Sajda|الأحزاب,Al-Ahzaab|سبإ,Saba|فاطر,Faatir|يس,Yaseen|الصافات,As-Saaffaat|ص,Saad|الزمر,Az-Zumar|غافر,Al-Ghaafir|فصلت,Fussilat|الشورى,Ash-Shura|الزخرف,Az-Zukhruf|الدخان,Ad-Dukhaan|الجاثية,Al-Jaathiya|الأحقاف,Al-Ahqaf|محمد,Muhammad|الفتح,Al-Fath|الحجرات,Al-Hujuraat|ق,Qaaf|الذاريات,Adh-Dhaariyat|الطور,At-Tur|النجم,An-Najm|القمر,Al-Qamar|الرحمن,Ar-Rahmaan|الواقعة,Al-Waaqia|الحديد,Al-Hadid|المجادلة,Al-Mujaadila|الحشر,Al-Hashr|الممتحنة,Al-Mumtahana|الصف,As-Saff|الجمعة,Al-Jumu'a|المنافقون,Al-Munaafiqoon|التغابن,At-Taghaabun|الطلاق,At-Talaaq|التحريم,At-Tahrim|الملك,Al-Mulk|القلم,Al-Qalam|الحاقة,Al-Haaqqa|المعارج,Al-Ma'aarij|نوح,Nooh|الجن,Al-Jinn|المزمل,Al-Muzzammil|المدثر,Al-Muddaththir|القيامة,Al-Qiyaama|الانسان,Al-Insaan|المرسلات,Al-Mursalaat|النبإ,An-Naba|النازعات,An-Naazi'aat|عبس,Abasa|التكوير,At-Takwir|الإنفطار,Al-Infitaar|المطففين,Al-Mutaffifin|الإنشقاق,Al-Inshiqaaq|البروج,Al-Burooj|الطارق,At-Taariq|الأعلى,Al-A'laa|الغاشية,Al-Ghaashiya|الفجر,Al-Fajr|البلد,Al-Balad|الشمس,Ash-Shams|الليل,Al-Lail|الضحى,Ad-Dhuhaa|الشرح,Ash-Sharh|التين,At-Tin|العلق,Al-Alaq|القدر,Al-Qadr|البينة,Al-Bayyina|الزلزلة,Az-Zalzala|العاديات,Al-Aadiyaat|القارعة,Al-Qaari'a|التكاثر,At-Takaathur|العصر,Al-Asr|الهمزة,Al-Humaza|الفيل,Al-Fil|قريش,Quraish|الماعون,Al-Maa'un|الكوثر,Al-Kawthar|الكافرون,Al-Kaafiroon|النصر,An-Nasr|المسد,Al-Masad|الإخلاص,Al-Ikhlaas|الفلق,Al-Falaq|الناس,An-Naas".split('|').map(x => x.split(','));
const KEY = 'starhero-guard';
const W = 64, H = 48; // camera checks work on a tiny grey picture

let lng = 'en';
const tr = (k, ...a) => (S[lng][k] || k).replace(/\{(\d)\}/g, (_, i) => a[i]);
const esc = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const store = load();
const cfg = Object.assign({}, ML.DEFAULTS, { breaks: true, hifz: false }, store.cfg);
const kidList = (k, id) => ((store[k] || (store[k] = {}))[id] || (store[k][id] = []));
// Offline recitation (Husary, everyayah.com) ships for Al-Fatiha, Juz Tabarak and Juz 'Amma; bigger suras would make the app too large.
const hasAudio = s => s === 1 || s >= 67;
const ayaFile = (s, a) => `quran/audio/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`;
const VOICE_KINDS = { homework: ['shout', 'fidget', 'away'], quran: ['quiet', 'away'] };
const keep = () => { store.cfg = cfg; try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* settings just won't stick */ } };
const beep = notes => window.tune && tune(notes);
const face = mood => typeof hero === 'function' ? hero(mood) : ''; // app.js's hero is a script-level const, not on window

const root = document.createElement('div');
root.id = 'guard';
root.hidden = true;
document.body.appendChild(root);

let G = null; // the open session
let quran = null; // parsed Tanzil text, loaded once

// ---------- camera + mic ----------
async function media() {
  const me = G, audio = { echoCancellation: false, noiseSuppression: false, autoGainControl: false }; // auto-gain would flatten shouting
  let stream, noCam = false;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio, video: { facingMode: 'user', width: 320, height: 240 } }); }
  catch (e) {
    try { stream = await navigator.mediaDevices.getUserMedia({ audio }); noCam = true; }
    catch (e2) { if (G === me) { G.err = tr('noMedia'); draw(); } return; }
  }
  if (G !== me) return stream.getTracks().forEach(x => x.stop()); // closed while the permission dialog was up
  G.stream = stream; G.noCam = noCam;
  G.video = attach(root.querySelector('video'));

  const ac = G.ac = new AudioContext({ sampleRate: 16000 }); // the speech model wants 16 kHz
  const src = ac.createMediaStreamSource(G.stream);
  // ponytail: ScriptProcessor is deprecated but runs everywhere with no extra file; AudioWorklet if it ever goes away.
  const proc = ac.createScriptProcessor(2048, 1, 1);
  src.connect(proc); proc.connect(ac.destination);
  proc.onaudioprocess = e => G && hear(e.inputBuffer.getChannelData(0));
  G.cut = ML.phrases();
  G.pre = [];
  G.tick = setInterval(step, 200);
  draw();
}

// Every ~128 ms of sound.
function hear(x) {
  const now = performance.now();
  let sum = 0;
  for (let i = 0; i < x.length; i++) sum += x[i] * x[i];
  const lvl = Math.max(0, Math.min(100, (20 * Math.log10(Math.sqrt(sum / x.length) + 1e-9) + 70) / 70 * 100)); // -70..0 dBFS -> 0..100
  // Our own alert sound is not the child shouting. In Quran mode keep recording though, or each alert would cut words out
  // (except while a parent's recorded message plays: that voice must never be checked as recitation).
  if (now < G.voiceUntil || (now < G.mute && G.kind !== 'quran')) { G.level = 0; return; }
  G.level = lvl > G.level ? lvl : G.level * 0.8 + lvl * 0.2; // fast up, slow down
  if (G.step !== 'run' || G.kind !== 'quran') return;
  const chunk = new Float32Array(x);
  const cut = G.cut(lvl >= cfg.voice, now);
  if (cut === 'start') G.rec = G.pre.slice();
  if (G.rec) G.rec.push(chunk);
  if (cut === 'end') send(G.rec);
  if (cut === 'end' || cut === 'drop') G.rec = null;
  G.pre.push(chunk); if (G.pre.length > 3) G.pre.shift(); // a little sound from before the voice started
}

function grab() {
  if (G.noCam || !G.video || G.video.readyState < 2) return null;
  const c = G.cv || (G.cv = Object.assign(document.createElement('canvas'), { width: W, height: H }));
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(G.video, 0, 0, W, H);
  const px = ctx.getImageData(0, 0, W, H).data, g = new Uint8Array(W * H);
  for (let i = 0; i < g.length; i++) g[i] = (px[i * 4] * 3 + px[i * 4 + 1] * 6 + px[i * 4 + 2]) / 10;
  return g;
}

// Every 200 ms: camera numbers, rules, timer, meters.
function step() {
  if (!G) return;
  const now = performance.now(), g = grab();
  if (g) {
    if (G.prev) G.motion = G.motion * 0.6 + ML.diff(G.prev, g) * 0.4;
    G.prev = g;
    if (!G.ref && now - G.since > 1500) G.ref = g.slice(); // the "sitting at the desk" picture
    if (G.ref) {
      G.off = ML.diff(G.ref, g, 40);
      if (G.off * 100 < cfg.away / 2) for (let i = 0; i < g.length; i++) G.ref[i] = (G.ref[i] * 15 + g[i]) >> 4; // follow slow light changes
    }
  }
  if (G.step === 'run') {
    const t = Date.now();
    if (!G.resting) G.focusMs += t - (G.lastT || t);
    G.lastT = t;
    if (G.kind === 'homework' && t >= G.segEnd) { // next focus block or break
      if (++G.seg >= G.plan.length) return finish(true);
      G.segEnd = t + G.plan[G.seg].ms; G.resting = G.plan[G.seg].rest;
      if (!G.resting) { G.ref = null; G.since = now; } // the child may have moved during the break: retake the seat picture
      beep(G.resting ? [523, 659, 784] : [784, 659, 523]);
      return draw();
    }
    if (!G.resting) for (const a of G.rules({ level: G.level, motion: G.motion, off: G.off }, now)) alert(a);
  }
  meters();
}

function alert(kind, word) {
  G.alerts[kind] = (G.alerts[kind] || 0) + 1;
  G.mute = performance.now() + 1200;
  const clip = (store.voice || {})[kind];
  if (clip && VOICE_KINDS[G.kind].includes(kind)) { // the parent's own recorded message instead of the beep
    G.voiceUntil = performance.now() + 4500;
    const au = new Audio(clip);
    au.onended = au.onerror = () => { if (G) G.voiceUntil = performance.now() + 300; };
    au.play().catch(() => { if (G) G.voiceUntil = 0; beep([330, 262]); });
  } else beep(kind === 'bad' ? [392, 330] : [330, 262]);
  G.msg = { text: kind === 'bad' ? tr('a_bad', word) : tr('a_' + kind), until: Date.now() + 3500 };
  const el = root.querySelector('.gmsg');
  if (el) { el.innerHTML = `${face('sad')}<b dir="auto">${esc(G.msg.text)}</b>`; el.hidden = false; }
  clearTimeout(G.msgT);
  G.msgT = setTimeout(() => { const m = root.querySelector('.gmsg'); if (m) m.hidden = true; }, 3500);
}

// ---------- Quran checking ----------
function worker() {
  if (G.asr) return;
  G.asr = new Worker('quran/asr-worker.js', { type: 'module' });
  G.model = 'loading';
  G.asr.onmessage = ({ data }) => {
    if (!G) return;
    if (data.ready) G.model = 'ready';
    else if (data.error && data.id === undefined) { G.model = 'error'; G.modelErr = data.error; }
    else heard(data);
    draw(true);
  };
  G.asr.onerror = e => { if (G) { G.model = 'error'; G.modelErr = e.message || 'worker'; draw(true); } };
}

function send(chunks) {
  const n = chunks.reduce((a, c) => a + c.length, 0), audio = new Float32Array(n);
  let o = 0;
  for (const c of chunks) { audio.set(c, o); o += c.length; }
  G.waiting++;
  G.asr.postMessage({ id: ++G.sent, audio }, [audio.buffer]);
  draw(true);
}

function heard({ text }) {
  G.waiting--;
  const before = G.marks.slice();
  G.from = ML.align(G.words, G.marks, G.from, ML.split(text));
  const newBad = G.marks.map((m, i) => (m === 'bad' || m === 'miss') && before[i] !== m ? i : -1).filter(i => i >= 0);
  if (newBad.length && G.step === 'run') alert('bad', newBad.map(i => G.words[i].w).join(' '));
  if (G.step === 'run' && G.from >= G.words.length) finish(true);
  else if (G.step === 'wrap' && !G.waiting) finish(true);
}

async function text() {
  if (!quran) quran = ML.parseQuran(await (await fetch('quran/quran-simple.txt')).text());
  return quran;
}

// ---------- flow ----------
function open(kid, task, language) {
  lng = language === 'ar' ? 'ar' : 'en';
  const isQ = task.icon === 'quran' || task.pages > 0;
  const last = (store.next || {})[kid.id] || { s: 1, a: 1, b: 7 };
  G = { kid, task, kind: isQ ? 'quran' : 'homework', step: 'setup', s: last.s, a: last.a, b: last.b, minutes: cfg.minutes,
    level: 0, motion: 0, off: 0, mute: 0, voiceUntil: 0, since: performance.now(), alerts: {}, waiting: 0, sent: 0, focusMs: 0, hifz: cfg.hifz };
  root.hidden = false;
  if (window.Android && Android.keepAwake) Android.keepAwake(true);
  draw();
  media();
  if (isQ) { worker(); text().then(() => G && draw()); }
}

function close() {
  if (!G) return;
  clearInterval(G.tick); clearTimeout(G.msgT); hush();
  if (G.recorder && G.recorder.state === 'recording') G.recorder.stop();
  if (G.stream) G.stream.getTracks().forEach(x => x.stop());
  if (G.ac) G.ac.close().catch(() => {});
  if (G.asr) G.asr.terminate(); // frees the ~100 MB model
  G = null;
  root.hidden = true; root.innerHTML = '';
  if (window.Android && Android.keepAwake) Android.keepAwake(false);
}

function start() {
  if (G.kind === 'quran') {
    const ayas = quran[G.s].length;
    G.a = Math.max(1, Math.min(ayas, G.a)); G.b = Math.max(G.a, Math.min(ayas, G.b));
    G.words = ML.passage(quran, G.s, G.a, G.b);
    G.marks = []; G.from = 0;
  } else {
    G.plan = ML.schedule(G.minutes, cfg.breaks ? 20 : G.minutes, cfg.breaks ? 5 : 0);
    G.seg = 0; G.segEnd = Date.now() + G.plan[0].ms; G.resting = false;
  }
  hush();
  G.rules = ML.rules(cfg, G.kind === 'quran');
  G.began = Date.now(); G.ref = null; G.since = performance.now(); // retake the seat picture now that the child sits down
  G.step = 'run';
  draw();
}

function finish(ok) {
  if (G.kind === 'quran' && ok && G.step === 'run') {
    if (G.rec && G.rec.length) send(G.rec); // "I finished" pressed right after the last word: check it too
    G.rec = null;
    if (G.waiting) { G.step = 'wrap'; draw(); return; } // let the last phrases be checked
  }
  const words = G.words || [];
  // Finished = reached the last ayah. A wrong last word still counts; the parent sees the score and decides.
  const reached = G.kind === 'quran' && (G.from >= words.length || (G.from > 0 && words[G.from - 1].aya === G.b));
  if (G.kind === 'quran') { // practice list: only words actually reached count, not the ones after where the child stopped
    store.practice = store.practice || {};
    store.practice[G.kid.id] = ML.practice(kidList('practice', G.kid.id), G.s, words, G.marks.slice(0, G.from));
    for (let i = G.from; i < words.length; i++) G.marks[i] = G.marks[i] || 'miss';
  }
  G.sum = {
    kind: G.kind, min: Math.max(1, Math.round(G.focusMs / 60000)), alerts: G.alerts,
    ok: G.kind === 'homework' ? ok : reached,
    right: words.filter((_, i) => G.marks[i] === 'ok').length, total: words.length,
    wrong: [...new Set(words.filter((_, i) => G.marks[i] !== 'ok').map(x => x.w))].slice(0, 12),
    ref: G.kind === 'quran' ? `${G.s}:${G.a}-${G.b}` : '',
  };
  G.sum.bonus = ML.bonus(G.sum);
  if (G.kind === 'quran' && G.hifz && G.sum.ok && G.sum.right === G.sum.total) { // memorized by heart, every word right
    const h = (store.hifz || (store.hifz = {}))[G.kid.id] || (store.hifz[G.kid.id] = {});
    h[G.s] = ML.cover(h[G.s] || [], Math.min(G.a, G.b), Math.max(G.a, G.b));
    G.sum.hifz = true;
  }
  const log = kidList('log', G.kid.id), n = Object.entries(G.alerts).filter(([k]) => k !== 'bad').reduce((a, [, v]) => a + v, 0);
  log.push({ d: ymd(new Date()), kind: G.kind, min: G.sum.min, alerts: n, right: G.sum.right, total: G.sum.total });
  if (log.length > 300) log.splice(0, log.length - 300);
  keep();
  if (G.kind === 'quran' && G.sum.ok) { // next time, carry on from the next ayah
    const ayas = quran[G.s].length, len = G.b - G.a + 1, s = G.b < ayas ? G.s : G.s % 114 + 1, a = G.b < ayas ? G.b + 1 : 1;
    (store.next || (store.next = {}))[G.kid.id] = { s, a, b: Math.min(quran[s].length, a + len - 1) };
    keep();
  }
  G.step = 'done';
  beep(G.sum.ok ? [523, 659, 784, 1047] : [330, 262]);
  draw();
}

// Short text for the parent's approval list.
function summary(s, language) {
  lng = language === 'ar' ? 'ar' : 'en';
  const al = Object.entries(s.alerts || {}).filter(([k]) => k !== 'bad').map(([k, n]) => `${tr('s_' + k)} ×${n}`).join(', ');
  return [`🎥 ${tr('guard')}: ${tr('sumTime', s.min)}`, s.kind === 'quran' ? tr('sumWords', s.right, s.total) : '', al || tr('none'),
    s.bonus ? tr('bonusS', s.bonus) : ''].filter(Boolean).join(' · ');
}

// ---------- listening to the correct recitation ----------
// Never while a session runs: the mic would hear the reciter and count it as the child.
function hush() { if (G && G.player) { G.player.pause(); G.player = null; G.playing = null; } }
function listen(s, a, b) {
  hush();
  if (!hasAudio(s) || G.step === 'run' || G.step === 'wrap') return;
  const au = G.player = new Audio(ayaFile(s, a));
  G.playing = { s, a };
  au.onended = () => { if (G && G.player === au) { if (b && a < b) listen(s, a + 1, b); else { G.player = null; G.playing = null; draw(); } } };
  au.onerror = () => { if (G && G.player === au) { G.player = null; G.playing = null; draw(); } };
  au.play().catch(() => {});
  draw();
}

// ---------- parent's recorded reminders ----------
function record(kind) {
  if (G.recorder && G.recorder.state === 'recording') return G.recorder.stop();
  if (!G.stream || !window.MediaRecorder) return;
  const chunks = [], r = G.recorder = new MediaRecorder(new MediaStream(G.stream.getAudioTracks()));
  G.recKind = kind;
  r.ondataavailable = e => chunks.push(e.data);
  r.onstop = () => {
    clearTimeout(G && G.recT);
    const fr = new FileReader();
    fr.onload = () => { (store.voice || (store.voice = {}))[kind] = fr.result; keep(); if (G) { G.recKind = null; draw(); } };
    fr.readAsDataURL(new Blob(chunks, { type: r.mimeType || 'audio/webm' }));
  };
  r.start();
  G.recT = setTimeout(() => r.state === 'recording' && r.stop(), 4000); // short and sweet
  draw();
}

// ---------- weekly report (shown in the parent's Report tab) ----------
function report(kid, language) {
  lng = language === 'ar' ? 'ar' : 'en';
  const r = ML.week(kidList('log', kid.id), ymd(new Date()));
  if (!r.sessions) return '';
  const top = Math.max(1, ...r.days.map(d => d.min));
  return `<h3>${tr('rTitle')}</h3><div class="grep">
    <div class="tiles"><div><b>${r.min}</b><small>${tr('rMin')}</small></div><div><b>${r.sessions}</b><small>${tr('rSessions')}</small></div>
      <div class="${r.alerts ? 'down' : 'up'}"><b>${r.alerts}</b><small>${tr('rAlerts')}</small></div>
      ${r.total ? `<div class="up"><b>${Math.round(r.right / r.total * 100)}%</b><small>${tr('rAcc')}</small></div>` : ''}</div>
    <div class="gweek" dir="ltr">${r.days.map(d => `<span><i style="height:${Math.round(d.min / top * 100)}%"></i><small>${new Date(d.d + 'T12:00').toLocaleDateString(lng, { weekday: 'narrow' })}</small></span>`).join('')}</div></div>`;
}

// ---------- screens ----------
const bar = (k, v, mark) => `<div class="gm"><span>${tr(k)}</span><div class="gbar"><i data-m="${k}" style="width:${v}%"></i><u style="inset-inline-start:${mark}%"></u></div></div>`;
const slider = (k, f, min, max) => `<label class="gs"><span>${tr(k)}: <b>${cfg[f]}</b></span><input type="range" min="${min}" max="${max}" value="${cfg[f]}" data-g="${f}"></label>`;

// The camera is a small tall tile in the corner, like a video call. Until the picture arrives it shows a camera
// placeholder; the empty poster stops Android's grey "play" cover from appearing on the video.
const POSTER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const camTile = () => `<div class="gcam ${G.noCam ? 'nocam' : ''}"><span class="gcam-ph">${ic('camera')}${G.noCam ? `<small>${tr('noCam')}</small>` : ''}</span>
  ${G.noCam ? '' : `<video muted playsinline poster="${POSTER}"></video>`}</div>`;
const meterBox = () => `<div class="gmeters">${bar('sound', 0, G.kind === 'quran' ? cfg.voice : cfg.loud)}${G.noCam ? '' : bar('move', 0, cfg.move) + bar('seat', 0, cfg.away)}</div>`;
function attach(v) {
  if (!v || !G.stream || G.noCam) return null;
  v.onplaying = () => v.parentNode.classList.add('live');
  v.srcObject = G.stream; v.play().catch(() => {});
  return v;
}

function setup() {
  const isQ = G.kind === 'quran';
  const ayas = isQ && quran ? quran[G.s].length : 0;
  const pick = isQ ? (quran ? `<label><span>${tr('sura')}</span><select data-g="s">${SURAS.map(([ar, en], i) =>
      `<option value="${i + 1}" ${i + 1 === G.s ? 'selected' : ''}>${i + 1}. ${esc(lng === 'ar' ? ar : en)}</option>`).join('')}</select></label>
      <div class="gline"><label><span>${tr('from')}</span><input type="number" inputmode="numeric" min="1" max="${ayas}" value="${G.a}" data-g="a"></label>
      <label><span>${tr('to')}</span><input type="number" inputmode="numeric" min="1" max="${ayas}" value="${G.b}" data-g="b"></label></div>
      <small class="gnote">${tr('words', ML.passage(quran, G.s, Math.min(G.a, ayas), Math.min(Math.max(G.a, G.b), ayas)).length)}</small>
      <button class="gtoggle ${G.hifz ? 'on' : ''}" data-g="hifz">${ic(G.hifz ? 'check' : 'sleep')}${tr('hifz')}</button>
      ${hasAudio(G.s) ? `<button class="glisten ${G.player ? 'on' : ''}" data-g="listenAll">${ic(G.player ? 'x' : 'play')}${tr(G.player ? 'stopListen' : 'listenAll')}</button>`
        : `<small class="gnote">${tr('noAudio')}</small>`}` : `<p>${tr('loading')}</p>`)
    : `<span class="glabel">${tr('minutes')}</span><div class="gchips">${[10, 15, 20, 30, 45, 60].map(m =>
      `<button class="${G.minutes === m ? 'on' : ''}" data-g="minutes" data-v="${m}">${tr('min', m)}</button>`).join('')}</div>
      <span class="glabel">${tr('breaks')}</span><div class="gchips">${[[true, 'breakOn'], [false, 'breakOff']].map(([v, k]) =>
      `<button class="${cfg.breaks === v ? 'on' : ''}" data-g="breaks" data-v="${v}">${tr(k)}</button>`).join('')}</div>`;
  const prac = isQ && quran ? kidList('practice', G.kid.id) : [];
  return `<div class="gpage setup">${G.err ? '' : camTile()}
    <div class="gtop"><header><button class="gx" data-g="close" aria-label="${tr('close')}">${ic('x')}</button><h1>${tr('title')}</h1></header>
      <h2><span class="gkind ${G.kind}">${ic(G.kind === 'quran' ? 'quran' : 'homework')}</span>${esc(G.task.title)}</h2>
      ${G.err ? '' : meterBox()}</div>
    ${G.err ? `<p class="gerr">${esc(G.err)}</p>` : ''}
    ${prac.length ? `<div class="gpractice"><b>${ic('trophy')}${tr('practice')}</b><small>${tr('practiceHint')}</small>
      <div class="gwrong" dir="rtl" lang="ar">${prac.slice(0, 10).map(x => `<button data-g="pick" data-s="${x.s}" data-ay="${x.a}">${esc(x.w)}</button>`).join('')}</div></div>` : ''}
    <div class="gform">${pick}</div>
    ${isQ ? modelLine() : ''}
    <p class="gnote">${tr('tip')}</p>
    <button class="btn go" data-g="start" ${G.err || (isQ && !quran) ? 'disabled' : ''}>${tr('start')}</button>
    <details class="gsens" ${G.sens ? 'open' : ''}><summary data-g="sens">⚙️ ${tr('sens')}</summary>${G.sens ? `
      ${isQ ? slider('voice', 'voice', 5, 80) + slider('quietK', 'quiet', 4, 60) : slider('loud', 'loud', 30, 100)}
      ${slider('moveK', 'move', 3, 80)}${slider('awayK', 'away', 10, 90)}
      <div class="gvoice"><b>${tr('voiceT')}</b><small>${tr('voiceHint')}</small>
        ${VOICE_KINDS[G.kind].map(k => { const has = (store.voice || {})[k], recNow = G.recKind === k;
          return `<div class="gvrow"><span>${tr('a_' + k)}</span>
            <button class="gvb rec ${recNow ? 'on' : ''}" data-g="rec" data-k="${k}">${recNow ? tr('recStop') : tr('rec')}</button>
            ${has ? `<button class="gvb" data-g="playv" data-k="${k}">${ic('play')}</button><button class="gvb del" data-g="delv" data-k="${k}">${ic('x')}</button>` : ''}</div>`; }).join('')}
      </div>` : ''}</details>
    ${isQ ? `<small class="gcredit">${tr('credit')}</small>` : ''}</div>`;
}

const modelLine = () => `<p class="gmodel ${G.model}">${G.model === 'error' ? esc(tr('modelErr', G.modelErr)) : G.model === 'ready'
  ? (G.step === 'setup' ? '✅ ' + tr('ready') : G.waiting ? '⏳ ' + tr('checking') : '🎙️ ' + tr('listening')) : '⏳ ' + tr('loading')}</p>`;

function passageHtml() {
  let out = '';
  const tap = G.step === 'done' && hasAudio(G.s);
  G.words.forEach((x, i) => {
    const playing = G.playing && G.playing.a === x.aya;
    out += `<span class="w ${G.marks[i] || ''} ${i === G.from && G.step !== 'done' ? 'cur' : ''} ${playing ? 'playing' : ''}" ${tap ? `data-g="hear" data-ay="${x.aya}"` : ''}>${esc(x.w)}</span> `;
    if (!G.words[i + 1] || G.words[i + 1].aya !== x.aya) out += `<span class="aya">﴿${x.aya.toLocaleString('ar-EG')}﴾</span> `;
  });
  return out;
}

function run() {
  const isQ = G.kind === 'quran';
  return `<div class="gpage run ${G.kind}">${camTile()}
    <div class="gtop"><header><h1><span class="rec"></span>${esc(G.task.title)}</h1></header>${meterBox()}${isQ ? modelLine() : ''}</div>
    ${isQ ? `<div class="gtext ${G.hifz ? 'hifz' : ''}" dir="rtl" lang="ar">${G.s !== 1 && G.s !== 9 && G.a === 1 ? '<p class="basm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>' : ''}${passageHtml()}</div>` : G.resting ? `<div class="gclock rest"><h1>${tr('breakTime')}</h1><p class="gnote">${tr('breakTip')}</p>
      <small class="gnote">${tr('backIn')}</small><b class="gtime" data-m="time"></b>${face('cheer')}</div>`
      : `<div class="gclock"><b class="gtime" data-m="time"></b>${face('happy')}</div>`}
    <div class="gmsg" hidden></div>
    ${G.step === 'wrap' ? `<button class="btn wait" disabled>⏳ ${tr('checking')}</button>`
      : `<button class="btn ${isQ ? 'go' : 'off'}" data-g="${isQ ? 'finish' : 'stop'}">${tr(isQ ? 'finish' : 'stop')}</button>`}</div>`;
}

function done() {
  const s = G.sum, n = Object.entries(s.alerts).filter(([k]) => k !== 'bad').reduce((a, [, v]) => a + v, 0);
  return `<div class="gpage done"><div class="gbig">${face(s.ok ? 'cheer' : 'sad')}</div>
    <h1>${s.ok ? (n <= 2 && s.right === s.total ? tr('great') : tr('good')) : tr('tryAgain')}</h1>
    <p>${tr('sumTime', s.min)} · ${n ? tr('sumAlerts', n) : tr('none')}</p>
    ${n ? `<p class="gnote">${Object.entries(s.alerts).filter(([k]) => k !== 'bad').map(([k, v]) => `${tr('s_' + k)} ×${v}`).join(' · ')}</p>` : ''}
    ${s.bonus ? `<p class="gbonus">${ic('trophy')} ${tr('bonusNote', s.bonus)}</p>` : ''}
    ${s.kind === 'quran' ? `<p><b>${tr('sumWords', s.right, s.total)}</b></p>
      ${s.wrong.length ? `<h2>${tr('mistakes')}</h2><div class="gwrong" dir="rtl" lang="ar">${[...new Map(G.words.filter((_, i) => G.marks[i] !== 'ok').map(x => [x.w, x])).values()].slice(0, 12)
        .map(x => `<button ${hasAudio(G.s) ? `data-g="hear" data-ay="${x.aya}"` : ''} class="${G.playing && G.playing.a === x.aya ? 'playing' : ''}">${hasAudio(G.s) ? ic('play') : ''}${esc(x.w)}</button>`).join('')}</div>` : ''}
      ${hasAudio(G.s) ? `<small class="gnote">${tr('tapHear')}</small>` : ''}
      <div class="gtext small" dir="rtl" lang="ar">${passageHtml()}</div>` : ''}
    ${s.ok ? `<button class="btn go" data-g="send">${tr('send')}</button>` : ''}
    <button class="btn ${s.ok ? 'off' : 'go'}" data-g="again">${tr('again')}</button>
    <button class="btn off" data-g="close">${tr('close')}</button></div>`;
}

// Full redraw, except during a session: then only the parts that change (the video element must survive).
function draw(partial) {
  if (!G) return;
  document.documentElement.dataset.guard = G.step;
  if (partial && G.step !== 'setup' && G.step !== 'done') {
    const m = root.querySelector('.gmodel'); if (m) m.outerHTML = modelLine();
    const x = root.querySelector('.gtext');
    if (x && G.words) {
      x.innerHTML = (x.querySelector('.basm') ? x.querySelector('.basm').outerHTML : '') + passageHtml();
      const c = x.querySelector('.cur'); if (c) c.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    return;
  }
  root.innerHTML = G.step === 'setup' ? setup() : G.step === 'done' ? done() : run();
  G.video = attach(root.querySelector('video'));
}

function meters() {
  const set = (k, v) => { const el = root.querySelector(`[data-m="${k}"]`); if (el) { el.style.width = Math.min(100, v) + '%'; el.classList.toggle('hot', v >= (k === 'sound' ? (G.kind === 'quran' ? cfg.voice : cfg.loud) : k === 'move' ? cfg.move : cfg.away)); } };
  set('sound', G.level); set('move', G.motion * 100); set('seat', G.off * 100);
  const tm = root.querySelector('[data-m="time"]');
  if (tm && G.segEnd) { const left = Math.max(0, G.segEnd - Date.now()) / 1000 | 0; tm.textContent = `${left / 60 | 0}:${String(left % 60).padStart(2, '0')}`; }
}

// ---------- input ----------
const acts = {
  close: () => close(),
  start: () => start(),
  stop: () => dialog({ icon: 'missed', text: tr('stopSure'), ok: tr('stop'), danger: true }).then(ok => { if (ok && G && G.step === 'run') finish(false); }),
  finish: () => finish(true),
  again: () => { const { kid, task } = G; close(); open(kid, task, lng); },
  send: () => { const { task, sum } = G; close(); if (window.guardDone) guardDone(task.id, sum); },
  minutes: el => { G.minutes = cfg.minutes = +el.dataset.v; keep(); draw(); },
  breaks: el => { cfg.breaks = el.dataset.v === 'true'; keep(); draw(); },
  hifz: () => { G.hifz = cfg.hifz = !G.hifz; keep(); draw(); },
  listenAll: () => { if (G.player) { hush(); draw(); } else listen(G.s, Math.min(G.a, G.b), Math.max(G.a, G.b)); },
  hear: el => listen(G.s, +el.dataset.ay),
  pick: el => { G.s = +el.dataset.s; G.a = G.b = +el.dataset.ay; hush(); draw(); },
  rec: el => record(el.dataset.k),
  playv: el => { const v = (store.voice || {})[el.dataset.k]; if (v) new Audio(v).play().catch(() => {}); },
  delv: el => { delete store.voice[el.dataset.k]; keep(); draw(); },
  sens: (el, e) => {
    e.preventDefault();
    if (G.sens) { G.sens = false; return draw(); }
    const pin = typeof db !== 'undefined' && db && db.pin; // app.js's db is a script-level let, not on window
    if (!pin) { G.sens = true; return draw(); }
    dialog({ icon: 'lock', title: tr('pinAsk'), input: { pin: true } }).then(v => { if (G && v === pin) { G.sens = true; draw(); } });
  },
};
root.addEventListener('click', e => {
  const el = e.target.closest('[data-g]');
  if (!el || el.disabled || !G || !acts[el.dataset.g]) return;
  acts[el.dataset.g](el, e);
});
root.addEventListener('input', e => {
  const el = e.target, k = el.dataset.g;
  if (!G || !k || el.type !== 'range') return;
  cfg[k] = +el.value; keep();
  el.previousElementSibling.querySelector('b').textContent = el.value;
  const u = root.querySelectorAll('.gbar u'), marks = [G.kind === 'quran' ? cfg.voice : cfg.loud, cfg.move, cfg.away];
  u.forEach((x, i) => x.style.insetInlineStart = marks[i] + '%');
});
root.addEventListener('change', e => {
  const el = e.target, k = el.dataset.g;
  if (!G || !k || el.type === 'range') return;
  const v = parseInt(el.value, 10) || 1;
  if (k === 's') { G.s = v; G.a = 1; G.b = quran[v].length; }
  else G[k] = v;
  if (k === 'a' && G.b < G.a) G.b = G.a;
  draw();
});

// Leaving the app ends a running session (the camera stops in the background anyway).
document.addEventListener('visibilitychange', () => {
  if (!document.hidden || !G) return;
  if (G.step === 'run' || G.step === 'wrap') finish(false); else if (G.step === 'setup') close();
});
// The phone's back button closes the guard first.
const appBack = window.onBack;
window.onBack = () => {
  if (!G) return appBack ? appBack() : false;
  if (G.step === 'run') acts.stop(); else close();
  return true;
};

// What the sticker book needs: this child's Focus Guard sessions and memorized ayat per sura.
const stats = kid => ({ log: kidList('log', kid.id), hifz: (store.hifz || {})[kid.id] || {} });
const ayaCount = s => quran ? quran[s].length : 0;
window.Guard = { open, close, summary, report, stats, text, ayaCount, suraName: (s, l) => SURAS[s - 1][l === 'ar' ? 0 : 1], canQuran: t => t.icon === 'quran' || t.pages > 0 };
if (typeof db !== 'undefined' && db && window.render) render(); // app.js drew the home screen before this file loaded: add the Guard buttons
})();
