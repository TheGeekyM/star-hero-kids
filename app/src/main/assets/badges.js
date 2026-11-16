// Sticker book: badges the child earns (streaks, planets, focus, Quran) and a map of memorized suras.
// Earned stickers are kept (with their date) in localStorage 'starhero-badges', so a sticker never disappears again.
// Reads app.js state (st, the kid) and Focus Guard's stats (Guard.stats). Opened from the medal button on Home.
(() => {
const KEY = 'starhero-badges';
const AYAS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
const MAP_SURAS = [1, ...Array.from({ length: 48 }, (_, i) => 67 + i)]; // Al-Fatiha, Juz Tabarak, Juz 'Amma
const AMMA = Array.from({ length: 37 }, (_, i) => 78 + i);

// [id, icon, colour class, en name, ar name, en how-to, ar how-to, test(c)]
const BADGES = [
  ['first', 'star', 'c4', 'First mission', 'أول مهمة', 'Finish your first mission', 'أنجز أول مهمة', c => c.doneMissions >= 1],
  ['streak3', 'fire', 'c4', '3 days in a row', '3 أيام متتالية', 'Finish all missions 3 days in a row', 'أنجز كل المهام 3 أيام متتالية', c => c.best >= 3],
  ['streak7', 'fire', 'c3', 'Week warrior', 'بطل الأسبوع', 'A 7-day streak', '7 أيام متتالية', c => c.best >= 7],
  ['streak30', 'crown', 'c1', 'Month master', 'بطل الشهر', 'A 30-day streak', '30 يوماً متتالياً', c => c.best >= 30],
  ['stars100', 'sparkle', 'c4', 'Star collector', 'جامع النجوم', 'Earn 100 stars', 'اجمع 100 نجمة', c => c.earned >= 100],
  ['planet1', 'planet', 'c0', 'Forest explorer', 'مستكشف الغابة', 'Finish the Green World', 'أنهِ العالم الأخضر', c => c.steps >= 30],
  ['planet2', 'planet', 'c5', 'Safari explorer', 'مستكشف السفاري', 'Finish the Jungle Safari', 'أنهِ غابة السفاري', c => c.steps >= 60],
  ['planet3', 'rocket', 'c1', 'Space hero', 'بطل الفضاء', 'Finish the Alien Planet', 'أنهِ كوكب الفضائيين', c => c.steps >= 90],
  ['focus', 'target', 'c2', 'Super focus', 'تركيز خارق', '20 minutes of homework with no reminders', '20 دقيقة واجب بدون أي تذكير', c => c.log.some(x => x.kind === 'homework' && x.min >= 20 && !x.alerts)],
  ['focus10', 'medal', 'c2', 'Focus pro', 'محترف التركيز', '10 homework sessions with Focus Guard', '10 جلسات واجب مع الحارس', c => c.log.filter(x => x.kind === 'homework').length >= 10],
  ['perfect', 'quran', 'c0', 'Perfect recitation', 'تلاوة متقنة', 'Recite every word right', 'اقرأ كل الكلمات صحيحة', c => c.log.some(x => x.kind === 'quran' && x.total && x.right === x.total)],
  ['quran10', 'books', 'c0', '10 recitations', '10 تلاوات', 'Recite with Focus Guard 10 times', 'اقرأ مع الحارس 10 مرات', c => c.log.filter(x => x.kind === 'quran').length >= 10],
  ['hifz1', 'seal', 'c5', 'First surah by heart', 'أول سورة حفظاً', 'Memorize a whole surah', 'احفظ سورة كاملة', c => c.memorized >= 1],
  ['hifz10', 'crown', 'c5', '10 surahs by heart', '10 سور حفظاً', 'Memorize 10 surahs', 'احفظ 10 سور', c => c.memorized >= 10],
  ['amma', 'trophy', 'c4', 'Juz ʿAmma hafiz', 'حافظ جزء عمّ', 'Memorize all of Juz ʿAmma', 'احفظ جزء عمّ كاملاً', c => AMMA.every(s => c.done.has(s))],
  ['prayers', 'mosque', 'c1', 'Prayer champion', 'بطل الصلاة', 'All 35 prayers in one week', 'كل الصلوات الـ35 في أسبوع', c => c.prayers >= 35],
  ['khatma', 'trophy', 'c3', 'Khatma!', 'ختمة!', 'Finish reading the whole Quran', 'اختم القرآن كاملاً', c => c.khatmas >= 1],
  ['book1', 'books', 'c3', 'First book', 'أول كتاب', 'Finish a book', 'أنهِ كتاباً', c => c.books >= 1],
  ['bookworm', 'books', 'c2', 'Bookworm', 'محب القراءة', 'A book every week, 4 weeks in a row', 'كتاب كل أسبوع لمدة 4 أسابيع متتالية', c => c.bookWeeks >= 4],
  ['quiz', 'target', 'c4', 'Quiz star', 'نجم المسابقة', 'Get every question right in the Quran quiz', 'أجب عن كل أسئلة مسابقة القرآن صحيحاً', c => c.quizBest >= 5],
  // games.js keeps wins (w) and best scores (b) per game in kid.gstats
  ['game1', 'game', 'c2', 'First game win', 'أول فوز في لعبة', 'Win any game', 'افز في أي لعبة', c => c.gwins >= 1],
  ['game25', 'trophy', 'c3', 'Game champion', 'بطل الألعاب', 'Win games 25 times', 'افز في الألعاب 25 مرة', c => c.gwins >= 25],
  ['puzzles', 'target', 'c1', 'Puzzle master', 'سيد الألغاز', 'Win all 8 puzzle games', 'افز في ألعاب الألغاز الثمانية كلها', c => c.puzzles >= 8],
  ['ayah10', 'quran', 'c0', 'Ayah builder', 'باني الآيات', 'Finish Ayah order 10 times', 'أنهِ لعبة رتّب الآية 10 مرات', c => c.ayahWins >= 10],
  ['letters', 'books', 'c5', 'Letter hero', 'بطل الحروف', 'Get 10 of 10 in Letter sounds', 'أجب 10 من 10 في أصوات الحروف', c => c.lettersBest >= 10],
];

const T = {
  en: { title: 'My sticker book', stickers: 'Stickers', quran: 'My surahs', of: '{0} of {1}', newOne: 'New sticker!', newMany: 'You earned {0} new stickers!',
    memorized: 'Surahs memorized: {0}', how: 'Use Memorize mode in Focus Guard and read every word right to fill a surah.', ayat: '{0}/{1} ayat', look: 'See it' },
  ar: { title: 'ألبوم الملصقات', stickers: 'الملصقات', quran: 'سوري', of: '{0} من {1}', newOne: 'ملصق جديد!', newMany: 'حصلت على {0} ملصقات جديدة!',
    memorized: 'السور المحفوظة: {0}', how: 'استخدم وضع الحفظ في الحارس واقرأ كل الكلمات صحيحة لتملأ السورة.', ayat: '{0}/{1} آية', look: 'شاهده' },
};
let lng = 'en';
const tr = (k, ...a) => T[lng][k].replace(/\{(\d)\}/g, (_, i) => a[i]);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const store = load();
const keep = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* stickers just won't stick */ } };

// Everything the badge tests look at, for one child.
function facts(kid) {
  const g = window.Guard ? Guard.stats(kid) : { log: [], hifz: {} };
  const done = new Set(Object.keys(g.hifz).map(Number).filter(s => typeof ML !== 'undefined' && ML.covered(g.hifz[s]) >= AYAS[s - 1]));
  let earned = 0, doneMissions = 0;
  for (const d of Object.values(kid.days || {})) { earned += d._p || 0; doneMissions += Object.values(d).filter(v => v === 'done').length; }
  let prayers = 0;
  try { prayers = report(kid, today()).prayers; } catch (e) { /* no report yet */ }
  let books = 0;
  for (const d of Object.values(kid.days || {})) books += (d.x || []).filter(i => i.k === 'book' && i.s === 'done').length;
  const bookWeeks = typeof bookStreak === 'function' ? bookStreak(kid, today()) : 0, quizBest = (kid.quiz || {}).best || 0;
  const gs = kid.gstats || {}, gw = id => (gs[id] || {}).w || 0;
  const gwins = Object.values(gs).reduce((n, x) => n + (x.w || 0), 0), puzzles = ['slide', 'ttt', 'lights', 'sudoku', 'maze', 'hanoi', 'sort', 'pipes'].filter(gw).length;
  return { gwins, puzzles, ayahWins: gw('ayah'), lettersBest: (gs.letters || {}).b || 0, books, bookWeeks, quizBest, best: kid.best || 0, steps: kid.steps || 0, earned, doneMissions, khatmas: (kid.quran || {}).khatmas || 0, log: g.log, hifz: g.hifz, done, memorized: done.size, prayers };
}
const mine = kid => store[kid.id] || (store[kid.id] = {});

// New stickers since last time: saved with today's date; the caller shows them.
function fresh(kid) {
  const c = facts(kid), got = mine(kid), out = [];
  for (const b of BADGES) if (!got[b[0]] && b[7](c)) { got[b[0]] = ymd(new Date()); out.push(b); }
  if (out.length) keep();
  return out;
}

// Called by app.js after drawing the child's screens: celebrate a newly earned sticker once.
function check(kid, language) {
  const busy = id => { const el = document.getElementById(id); return el && !el.hidden; };
  if (!kid || busy('guard') || busy('album') || document.querySelector('.dlg') || !window.dialog) return; // never on top of Focus Guard or another box
  lng = language === 'ar' ? 'ar' : 'en';
  const out = fresh(kid);
  if (!out.length) return;
  const b = out[0], ar = lng === 'ar';
  if (window.celebrate) celebrate();
  dialog({ icon: b[1], title: out.length > 1 ? tr('newMany', out.length) : tr('newOne'), text: out.map(x => ar ? x[4] : x[3]).join(' · '), ok: tr('look'), cancel: ar ? 'لاحقاً' : 'Later' })
    .then(go => go && open(kid, language, 'stickers'));
}

// ---------- the album ----------
const root = document.createElement('div');
root.id = 'album'; root.hidden = true;
document.body.appendChild(root);
let A = null; // { kid, tab }

function open(kid, language, tab = 'stickers') {
  lng = language === 'ar' ? 'ar' : 'en';
  fresh(kid); // anything earned quietly also shows up
  A = { kid, tab };
  root.hidden = false;
  draw();
}
function close() { A = null; root.hidden = true; root.innerHTML = ''; }

function stickers() {
  const got = mine(A.kid), ar = lng === 'ar', n = BADGES.filter(b => got[b[0]]).length;
  return `<p class="aprog">${tr('of', n, BADGES.length)}</p><div class="agrid">${BADGES.map(b => got[b[0]]
    ? `<div class="sticker ${b[2]}"><span class="ico">${ic(b[1])}</span><b>${ar ? b[4] : b[3]}</b><small>${new Date(got[b[0]] + 'T12:00').toLocaleDateString(lng, { day: 'numeric', month: 'short' })}</small></div>`
    : `<div class="sticker locked"><span class="ico">${ic('lockk')}</span><b>${ar ? b[4] : b[3]}</b><small>${ar ? b[6] : b[5]}</small></div>`).join('')}</div>`;
}

function surahs() {
  const c = facts(A.kid), name = s => window.Guard && Guard.suraName ? Guard.suraName(s, lng) : s;
  return `<p class="aprog">${ic('seal')} ${tr('memorized', c.memorized)}</p><p class="ahow">${tr('how')}</p>
    <div class="agrid suras">${MAP_SURAS.map(s => {
      const have = typeof ML !== 'undefined' ? ML.covered(c.hifz[s] || []) : 0, all = AYAS[s - 1], pct = Math.round(have / all * 100);
      return `<div class="sura ${have >= all ? 'gold' : have ? 'part' : ''}"><i>${s}</i><b lang="ar" dir="rtl">${name(s)}</b>
        <span class="abar"><em style="width:${pct}%"></em></span><small>${have >= all ? ic('star') : tr('ayat', have, all)}</small></div>`;
    }).join('')}</div>`;
}

function draw() {
  if (!A) return;
  root.innerHTML = `<div class="apage"><header><button class="gx" data-b="close" aria-label="close">${ic('x')}</button><h1>${ic('medal')} ${tr('title')}</h1></header>
    <nav class="atabs">${['stickers', 'quran'].map(k => `<button class="${A.tab === k ? 'on' : ''}" data-b="tab" data-k="${k}">${tr(k)}</button>`).join('')}</nav>
    ${A.tab === 'stickers' ? stickers() : surahs()}</div>`;
}

root.addEventListener('click', e => {
  const el = e.target.closest('[data-b]');
  if (!el || !A) return;
  if (el.dataset.b === 'close') close();
  else if (el.dataset.b === 'tab') { A.tab = el.dataset.k; draw(); }
});
const appBack = window.onBack;
window.onBack = () => { if (A) { close(); return true; } return appBack ? appBack() : false; };

window.Badges = { open, close, check, BADGES, AYAS };
if (typeof db !== 'undefined' && db && window.render) render(); // app.js drew Home before this file loaded: add the medal button and check stickers
if (typeof module !== 'undefined') module.exports = { BADGES, AYAS };
})();
