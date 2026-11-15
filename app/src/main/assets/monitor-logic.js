// Focus guard rules. No DOM, so `node monitor-logic.js` runs the self-check at the bottom.
// Camera and mic checks are plain math (pixel differences, loudness). Only the Quran check uses the speech model.
// Everything sits in one global, ML, so names like `split` or `diff` can't clash with app.js.
const ML = (() => {

// ---------- Quran words ----------
// Matching ignores tashkeel and spelling variants the model and the mushaf disagree on.
// ponytail: also squeezes doubled letters (both sides), so "أَاللَّهُ" (model glitch) still equals "اللَّهُ".
const norm = w => w
  .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ء/g, '')
  .replace(/[^ء-ي]/g, '')
  .replace(/(.)\1+/g, '$1');
const split = s => s.split(/\s+/).filter(w => norm(w));

function lev(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
const SIM = 0.7; // how close a heard word must be to count as right; lower = more forgiving
const same = (a, b) => { const x = norm(a), y = norm(b); return x === y || 1 - lev(x, y) / Math.max(x.length, y.length) >= SIM; };

// Tanzil text, kept verbatim as the licence asks: "sura|aya|text" lines, "#" lines are the notice.
function parseQuran(txt) {
  const q = {};
  for (const line of txt.split('\n')) {
    const m = /^(\d+)\|(\d+)\|(.+)$/.exec(line.trim());
    if (m) (q[m[1]] || (q[m[1]] = []))[m[2] - 1] = m[3];
  }
  return q;
}
const BASMALA = 'بسم الله الرحمن الرحيم';
// Words to recite for sura s, ayat a..b: [{w, aya}]. Tanzil puts the basmala inside aya 1; outside Al-Fatiha it is not counted.
function passage(q, s, a, b) {
  const out = [];
  for (let n = a; n <= b; n++) {
    let ws = split(q[s][n - 1]);
    if (n === 1 && s !== 1 && ws.slice(0, 4).map(norm).join(' ') === BASMALA.split(' ').map(norm).join(' ')) ws = ws.slice(4);
    for (const w of ws) out.push({ w, aya: n });
  }
  return out;
}

// Align what was heard to the passage, starting at word `from` (the next unread word).
// The child may go back up to BACK words to repeat; that's free and can turn a red word green.
// Words not reached yet are free too; skipped words before the end of what was heard are "miss".
// marks: per-word state array, changed in place: 'ok' | 'bad' | 'miss'. Returns the new `from`.
const BACK = 10;
function align(exp, marks, from, heard) {
  const s = Math.max(0, from - BACK), e = Math.min(exp.length, from + heard.length * 2 + 4);
  const E = exp.slice(s, e), H = heard, n = E.length, m = H.length, f = from - s;
  if (!m || !n) return from;
  const delCost = i => (i >= f ? 1 : 0); // i = index in E being skipped
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0)), bt = dp.map(r => r.map(() => 0));
  for (let i = 1; i <= n; i++) { dp[i][0] = dp[i - 1][0] + delCost(i - 1); bt[i][0] = 1; }
  for (let j = 1; j <= m; j++) { dp[0][j] = j; bt[0][j] = 2; }
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    const opts = [dp[i - 1][j - 1] + (same(E[i - 1].w, H[j - 1]) ? 0 : 1), dp[i - 1][j] + delCost(i - 1), dp[i][j - 1] + 1];
    let k = 0; if (opts[1] < opts[k]) k = 1; if (opts[2] < opts[k]) k = 2;
    dp[i][j] = opts[k]; bt[i][j] = k;
  }
  // Best end. Ties go to the shorter one, so a cough or a stray word never marks the next word wrong.
  let best = 0;
  for (let i = 1; i <= n; i++) if (dp[i][m] < dp[best][m]) best = i;
  for (let i = best, j = m; i > 0 || j > 0;) {
    const k = bt[i][j], at = s + i - 1;
    if (k === 0) {
      const ok = same(E[i - 1].w, H[j - 1]);
      if (ok) marks[at] = 'ok'; else if (at >= from || marks[at] !== 'ok') marks[at] = 'bad';
      i--; j--;
    } else if (k === 1) { if (at >= from) marks[at] = 'miss'; i--; } else j--;
  }
  return Math.max(from, s + best);
}

// ---------- camera ----------
// Grey 64x48 frames as Uint8Array. Share of pixels that changed by more than `t` (0..255).
function diff(a, b, t = 28) {
  let n = 0;
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > t) n++;
  return n / a.length;
}

// ---------- the rules ----------
// A condition must hold for `ms` before it alerts, then it waits `cool` before alerting again.
function sustain(ms, cool) {
  let since = null, last = -Infinity;
  return (on, now) => {
    if (!on) { since = null; return false; }
    if (since === null) since = now;
    if (now - since >= ms && now - last >= cool) { last = now; since = now; return true; }
    return false;
  };
}

// Sensitivity knobs (parent can tune them on the setup screen while watching the live meters).
const DEFAULTS = { loud: 70, voice: 30, move: 25, away: 45, quiet: 10, minutes: 20 };
// One rule set per session. tick() gets the latest readings and returns the alerts that fired.
// r = { level: 0..100 loudness, motion: 0..1 frame-to-frame change, off: 0..1 change against the start picture }
function rules(cfg, quran) {
  const shout = sustain(600, 5000), fidget = sustain(4000, 15000), away = sustain(15000, 20000), quiet = sustain(cfg.quiet * 1000, cfg.quiet * 1000);
  return (r, now) => {
    const out = [];
    if (!quran && shout(r.level >= cfg.loud, now)) out.push('shout'); // reciting out loud is the point, so no shout rule there
    if (fidget(r.motion * 100 >= cfg.move, now)) out.push('fidget');
    if (away(r.off * 100 >= cfg.away, now)) out.push('away');
    if (quran && quiet(r.level < cfg.voice, now)) out.push('quiet');
    return out;
  };
}

// Cut the mic into phrases at the child's own pauses, so the speech model never gets half a word.
// feed(isVoice, now) -> 'start' | 'end' | null. A phrase ends after 700ms of quiet, or at 25s.
function phrases() {
  let start = null, lastVoice = 0;
  return (voice, now) => {
    if (voice) lastVoice = now;
    if (start === null) { if (voice) { start = now; return 'start'; } return null; }
    if (now - lastVoice >= 700 || now - start >= 25000) { const long = lastVoice - start >= 400; start = null; return long ? 'end' : 'drop'; }
    return null;
  };
}

// ---------- after a session ----------
// Practice list: words read wrong are saved as {s, a, w}; a word read right later leaves the list. Newest first, at most 40.
function practice(list, s, words, marks) {
  const key = x => `${x.s}:${x.a}:${norm(x.w)}`, out = list.slice();
  words.forEach((x, i) => {
    const it = { s, a: x.aya, w: x.w }, k = key(it), at = out.findIndex(y => key(y) === k);
    if (marks[i] === 'ok') { if (at >= 0) out.splice(at, 1); }
    else if (marks[i] === 'bad' || marks[i] === 'miss') { if (at >= 0) out.splice(at, 1); out.unshift(it); }
  });
  return out.slice(0, 40);
}
// Bonus stars for a great session (paid when the parent approves): 2 for perfect, 1 for nearly.
function bonus(sum) {
  if (!sum.ok) return 0;
  const n = Object.entries(sum.alerts || {}).filter(([k]) => k !== 'bad').reduce((a, [, v]) => a + v, 0);
  if (sum.kind === 'quran') return sum.right === sum.total && n <= 1 ? 2 : sum.total && sum.right / sum.total >= 0.9 ? 1 : 0;
  return n === 0 ? 2 : n <= 2 ? 1 : 0;
}
// Homework time cut into focus blocks with short breaks: [{rest, ms}]. 45 min, blocks of 20, breaks of 5 -> 20 · 5 · 20 · 5 · 5.
function schedule(minutes, block, rest) {
  const out = [];
  for (let left = minutes; left > 0;) {
    const f = Math.min(block, left); out.push({ rest: false, ms: f * 60000 }); left -= f;
    if (left > 0 && rest > 0) out.push({ rest: true, ms: rest * 60000 });
  }
  return out;
}
// Last 7 days of sessions for the parent report. log: [{d, kind, min, alerts, right, total}]
function week(log, today) {
  const days = [], t = new Date(today + 'T00:00:00');
  const local = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; // same as logic.js ymd(), not UTC
  for (let i = 6; i >= 0; i--) { const d = new Date(t); d.setDate(t.getDate() - i); days.push(local(d)); }
  const r = { days: days.map(d => ({ d, min: 0, alerts: 0 })), min: 0, sessions: 0, alerts: 0, right: 0, total: 0 };
  for (const x of log) {
    const day = r.days.find(y => y.d === x.d);
    if (!day) continue;
    day.min += x.min; day.alerts += x.alerts; r.min += x.min; r.alerts += x.alerts; r.sessions++;
    if (x.kind === 'quran') { r.right += x.right; r.total += x.total; }
  }
  return r;
}

// Memorized ayat of one sura as merged ranges [[a, b], ...]. A perfect Memorize-mode session adds its range.
function cover(ranges, a, b) {
  const all = ranges.concat([[a, b]]).sort((x, y) => x[0] - y[0]), out = [];
  for (const [x, y] of all) {
    const last = out[out.length - 1];
    if (last && x <= last[1] + 1) last[1] = Math.max(last[1], y); else out.push([x, y]);
  }
  return out;
}
const covered = ranges => ranges.reduce((n, [a, b]) => n + b - a + 1, 0);

return { norm, split, same, parseQuran, passage, align, diff, sustain, rules, phrases, practice, bonus, schedule, week, cover, covered, DEFAULTS };
})();
if (typeof module !== 'undefined') module.exports = ML;

if (typeof module !== 'undefined' && require.main === module) {
  const { norm, split, same, parseQuran, passage, align, diff, rules, phrases, DEFAULTS } = ML;
  const assert = require('assert');
  const fs = require('fs');
  // normalisation: what the model wrote vs the mushaf
  assert.ok(same('إِهْدِنَا', 'اهْدِنَا'));
  assert.ok(same('الرَّحْمَنِ', 'الرَّحْمَٰنِ'));
  assert.ok(same('أَاللَّهُ', 'اللَّهُ'));
  assert.ok(same('يَاكَ', 'إِيَّاكَ')); // word cut at a chunk edge still passes
  assert.ok(!same('الْكَافِرُونَ', 'الْمُؤْمِنُونَ'));
  const txt = fs.existsSync(__dirname + '/quran/quran-simple.txt') ? fs.readFileSync(__dirname + '/quran/quran-simple.txt', 'utf8')
    : '1|1|بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n1|2|الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\n1|3|الرَّحْمَٰنِ الرَّحِيمِ\n1|4|مَالِكِ يَوْمِ الدِّينِ\n1|5|إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\n' +
      '112|1|بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ\n112|2|اللَّهُ الصَّمَدُ\n112|3|لَمْ يَلِدْ وَلَمْ يُولَدْ\n112|4|وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ\n';
  const q = parseQuran('# notice\n' + txt);
  // basmala is aya 1 of Al-Fatiha, but not counted in other suras
  assert.equal(passage(q, 1, 1, 1).length, 4);
  const ikh = passage(q, 112, 1, 4);
  assert.equal(ikh[0].w, 'قُلْ');
  assert.equal(ikh.length, 15);
  // real model output for Al-Ikhlas (Minshawy): all 15 right
  let marks = [], from = align(ikh, marks, 0, split('قُلْ هُوَ اللَّهُ أَحَدٌ أَاللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ'));
  assert.equal(from, 15);
  assert.equal(marks.filter(x => x === 'ok').length, 15);
  // real model output for Al-Fatiha with aya 3 skipped, heard in two phrases
  const fat = passage(q, 1, 2, 5);
  marks = []; from = 0;
  from = align(fat, marks, from, split('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ'));
  assert.equal(from, 4);
  from = align(fat, marks, from, split('مَالِكِ يَوْمِ الدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ'));
  assert.equal(from, fat.length);
  assert.deepEqual([marks[4], marks[5]], ['miss', 'miss']); // الرحمن الرحيم skipped
  assert.equal(marks.filter(x => x === 'ok').length, fat.length - 2);
  // a wrong word is red, the next phrase carries on, and going back to say it right turns it green
  marks = []; from = 0;
  from = align(fat, marks, from, split('الْحَمْدُ لِلَّهِ رَبِّ الْمُؤْمِنِينَ الرَّحْمَنِ'));
  assert.deepEqual([marks[3], from], ['bad', 5]);
  from = align(fat, marks, from, split('رَبِّ الْعَالَمِينَ الرَّحْمَنِ الرَّحِيمِ'));
  assert.deepEqual([marks[3], from], ['ok', 6]);
  // a wrong LAST word looks like an extra word until the next phrase shows the gap; then it is "miss"
  marks = []; from = align(fat, marks, 0, split('الْحَمْدُ لِلَّهِ رَبِّ الْمُؤْمِنِينَ'));
  assert.equal(from, 3);
  from = align(fat, marks, from, split('الرَّحْمَنِ الرَّحِيمِ'));
  assert.deepEqual([marks[3], from], ['miss', 6]);
  // a cough (one junk word) marks nothing and does not move on
  const before = marks.slice();
  assert.equal(align(fat, marks, from, ['اه']), 6);
  assert.deepEqual(marks, before);
  // rules: 600ms of shouting alerts once, then waits 5s
  const tick = rules(DEFAULTS, false);
  const loud = { level: 90, motion: 0, off: 0 };
  assert.deepEqual(tick(loud, 0), []);
  assert.deepEqual(tick(loud, 700), ['shout']);
  assert.deepEqual(tick(loud, 2000), []);
  assert.deepEqual(tick(loud, 6000), ['shout']);
  // quiet in Quran mode: 10s of silence, and no shout rule
  const tq = rules(DEFAULTS, true);
  assert.deepEqual(tq(loud, 0), []);
  assert.deepEqual(tq({ level: 5, motion: 0, off: 0 }, 1000), []);
  assert.deepEqual(tq({ level: 5, motion: 0, off: 0 }, 11000), ['quiet']);
  // fidget needs 4s of big movement; left the seat needs 15s of a changed picture
  assert.deepEqual(tick({ level: 0, motion: 0.4, off: 0.6 }, 10000), []);
  assert.deepEqual(tick({ level: 0, motion: 0.4, off: 0.6 }, 14500), ['fidget']);
  assert.deepEqual(tick({ level: 0, motion: 0.0, off: 0.6 }, 25000), ['away']);
  // camera diff
  assert.equal(diff(new Uint8Array([0, 0, 100, 100]), new Uint8Array([0, 50, 100, 200])), 0.5);
  // phrases: cut at a 700ms pause; a click shorter than 400ms is dropped
  const ph = phrases();
  assert.equal(ph(true, 0), 'start'); assert.equal(ph(true, 2000), null); assert.equal(ph(false, 2500), null);
  assert.equal(ph(false, 2700), 'end');
  assert.equal(ph(true, 5000), 'start'); assert.equal(ph(false, 5900), 'drop');
  // practice list: wrong words go in, a word read right comes out
  const { practice: pr, bonus: bo, schedule: sch, week: wk } = ML;
  let list = pr([], 1, fat, ['ok', 'ok', 'ok', 'ok', 'miss', 'bad']);
  assert.deepEqual(list.map(x => norm(x.w)), ['الرحيم', 'الرحمن']);
  assert.deepEqual([list[0].s, list[0].a], [1, 3]);
  list = pr(list, 1, fat, ['ok', 'ok', 'ok', 'ok', 'ok', 'miss']);
  assert.deepEqual(list.map(x => norm(x.w)), ['الرحيم']);
  // bonus
  assert.equal(bo({ kind: 'quran', ok: true, right: 29, total: 29, alerts: { fidget: 1, bad: 3 } }), 2);
  assert.equal(bo({ kind: 'quran', ok: true, right: 27, total: 29, alerts: {} }), 1);
  assert.equal(bo({ kind: 'quran', ok: false, right: 29, total: 29, alerts: {} }), 0);
  assert.equal(bo({ kind: 'homework', ok: true, alerts: {} }), 2);
  assert.equal(bo({ kind: 'homework', ok: true, alerts: { shout: 3 } }), 0);
  // breaks
  assert.deepEqual(sch(45, 20, 5).map(x => (x.rest ? 'r' : 'f') + x.ms / 60000), ['f20', 'r5', 'f20', 'r5', 'f5']);
  assert.deepEqual(sch(15, 20, 5).map(x => x.ms / 60000), [15]);
  assert.deepEqual(sch(40, 20, 0).map(x => x.ms / 60000), [20, 20]);
  // week report
  const r = wk([{ d: '2026-11-15', kind: 'quran', min: 5, alerts: 1, right: 9, total: 10 }, { d: '2026-11-14', kind: 'homework', min: 20, alerts: 2 },
    { d: '2026-11-01', kind: 'homework', min: 30, alerts: 0 }], '2026-11-15');
  assert.deepEqual([r.min, r.sessions, r.alerts, r.right, r.total, r.days.length, r.days[6].min, r.days[5].min], [25, 2, 3, 9, 10, 7, 5, 20]);
  // memorized ranges merge; touching ranges join; the sura is done when every aya is covered
  let m = ML.cover([], 1, 2); m = ML.cover(m, 5, 6); m = ML.cover(m, 3, 4);
  assert.deepEqual(m, [[1, 6]]);
  assert.deepEqual(ML.cover([[1, 2]], 4, 5), [[1, 2], [4, 5]]);
  assert.equal(ML.covered([[1, 2], [4, 5]]), 4);
  console.log('monitor logic ok');
}
