// Star Hero 2.1: hifz revision, weekly verse quiz, books, savings jar, mood check-in, surprise double days (logic.js),
// monthly report, second parent, make-it-right tasks and a play-time limit.
// Loaded before app.js and uses its globals (db, st, ui, t, lang, save, render, today, hero, star, esc, dialog, ic, tune ...)
// and logic.js (isDouble, jarAdd, jarAsk, bookStreak, revisionPick, monthStats) only when called.
// app.js hooks: More.install(actions), homeTop()/homeCards() in home(), jar() in rewards(), report() in pReport(),
// settings() in pSettings(), after(app) in render(). extras.js asks More.item()/More.rated() about the new approval items.
const More = (() => {
  const L = {
    en: {
      mood: 'How do you feel today?', m_happy: 'Happy', m_ok: 'Okay', m_tired: 'Tired', m_sad: 'Sad',
      sadMsg: "It's okay to feel sad sometimes. Tell Mom or Dad. They love you so much! ❤️",
      double: 'Surprise! DOUBLE STARS today!', doubleSub: 'Every mission counts twice ⚡',
      rev: "Today's revision", revSub: 'Recite these from memory to keep them strong', revBtn: 'I revised it', revK: 'Revision',
      quiz: 'Weekly Quran quiz', quizSub: 'Listen to an ayah and pick the one that comes next', quizGo: 'Start the quiz', quizDone: 'This week: {0}/{1} ⭐ Next quiz on Monday!',
      qOf: 'Question {0} of {1}', next: 'What comes next?', again: 'Listen again', nextQ: 'Next', right: 'Correct! 🎉', wrong: 'Not quite. This is the right one:',
      score: 'You got {0} of {1}!', scoreStars: '+{0} stars', finish: 'Yay!', close: 'Close', quizLoad: 'Getting the ayat ready…', quizFail: 'The quiz could not load.',
      books: 'My books', bookBtn: 'I finished a book!', bookQ: 'What was the book called?', bookN: '{0} books read', bookWk: '🔥 {0} weeks in a row', bookK: 'Book',
      fix: 'Make it right!', fixSub: 'Do this and the sad face goes away', fixBtn: 'I did it!', fixK: 'Make it right', fixWait: 'Waiting for parent',
      f_rev: 'Revise one extra Quran page', f_tidy: 'Tidy your room', f_help: 'Help at home for 15 minutes', f_read: 'Read for 15 minutes', f_sorry: 'Say sorry and give a big hug',
      jar: 'Savings jar', jarSub: 'Save stars for a big reward. Fill the jar and get a patience bonus!', jarPick: 'What are you saving for?',
      jarIn: 'Put in', jarAsk: 'Ask for it!', jarChange: 'Change goal', jarOf: '{0} of {1}', jarBonus: 'Your jar is full! You get a patience bonus of +{0} stars!',
      jarWait: 'Waiting for parent', jarNone: 'Ask a parent to add a reward first.',
      month: 'Monthly report', monthT: 'Monthly report', monthMsg: "{0}'s month in Star Hero ⭐", chart: 'Stars each day', bestD: 'Best day: {0}', worstD: 'Hardest day: {0}',
      tEarned: 'Stars earned', tLost: 'Stars lost', tFull: 'Full days', tPages: 'Quran pages', tPrayers: 'Prayers', tBooks: 'Books', tHifz: 'Surahs by heart', tRev: 'Revisions', tDeeds: 'Good deeds',
      moodT: 'Mood (last 30 days)', moodFull: '{0}% full days', noMood: 'No mood check-ins yet.',
      who: 'Who approved', p1: 'Parent 1', p2: 'Parent 2',
      hifz: 'Hifz: memorised surahs', hifzSub: 'Tap a surah: new → memorised → needs revision. Surahs finished in Focus Guard memorize mode are memorised already.',
      h_m: 'Memorised', h_w: 'Needs revision', h_g: 'Memorised in Focus Guard', show: 'Show', hide: 'Hide',
      twoP: 'Second parent', twoPSub: 'Each parent has their own PIN. The report shows who approved what.', name1: 'Parent 1 name', name2: 'Parent 2 name', pin2: 'Parent 2 PIN (empty = off)',
      pinBad: 'The PIN must be 4 digits and different from Parent 1.',
      fixSet: 'Make-it-right task after a missed mission', none: 'None',
      surprise: 'Surprise double-stars days', on: 'On', off: 'Off',
      limit: 'Play-time limit (Journey, shop and games)', limitSub: 'Missions on Home are never locked.', used: 'Used today: {0} min', more15: '+15 min today',
      lockT: 'Time to go play!', lockP: "You've played {0} minutes today. Go run, draw or read. Your missions on Home are still open!", lockHome: 'Go to my missions', parent: 'Parent',
    },
    ar: {
      mood: 'كيف تشعر اليوم؟', m_happy: 'سعيد', m_ok: 'عادي', m_tired: 'متعب', m_sad: 'حزين',
      sadMsg: 'لا بأس أن تحزن أحياناً. أخبر ماما أو بابا، فهما يحبانك كثيراً! ❤️',
      double: 'مفاجأة! نجوم مضاعفة اليوم!', doubleSub: 'كل مهمة تُحسب مرتين ⚡',
      rev: 'مراجعة اليوم', revSub: 'اقرأها غيباً حتى تبقى ثابتة في قلبك', revBtn: 'راجعتها', revK: 'مراجعة',
      quiz: 'مسابقة القرآن الأسبوعية', quizSub: 'استمع إلى آية واختر الآية التي بعدها', quizGo: 'ابدأ المسابقة', quizDone: 'هذا الأسبوع: {0}/{1} ⭐ المسابقة القادمة يوم الاثنين!',
      qOf: 'السؤال {0} من {1}', next: 'ما الآية التالية؟', again: 'استمع مرة أخرى', nextQ: 'التالي', right: 'صحيح! 🎉', wrong: 'ليست هذه. الإجابة الصحيحة:',
      score: 'أجبت {0} من {1}!', scoreStars: '+{0} نجوم', finish: 'رائع!', close: 'إغلاق', quizLoad: 'نجهّز الآيات…', quizFail: 'تعذّر تحميل المسابقة.',
      books: 'كتبي', bookBtn: 'أنهيت كتاباً!', bookQ: 'ما اسم الكتاب؟', bookN: 'قرأت {0} كتب', bookWk: '🔥 {0} أسابيع متتالية', bookK: 'كتاب',
      fix: 'صحّح الأمر!', fixSub: 'افعل هذا ليذهب الوجه الحزين', fixBtn: 'فعلتها!', fixK: 'تصحيح', fixWait: 'بانتظار الوالدين',
      f_rev: 'راجع صفحة إضافية من القرآن', f_tidy: 'رتّب غرفتك', f_help: 'ساعد في البيت 15 دقيقة', f_read: 'اقرأ 15 دقيقة', f_sorry: 'اعتذر وأعطِ حضناً كبيراً',
      jar: 'حصّالة النجوم', jarSub: 'ادّخر نجومك لجائزة كبيرة. املأ الحصالة واحصل على مكافأة الصبر!', jarPick: 'ماذا تريد أن تدّخر له؟',
      jarIn: 'ضع', jarAsk: 'اطلبها!', jarChange: 'غيّر الهدف', jarOf: '{0} من {1}', jarBonus: 'امتلأت الحصالة! حصلت على مكافأة الصبر +{0} نجوم!',
      jarWait: 'بانتظار الوالدين', jarNone: 'اطلب من والديك إضافة جائزة أولاً.',
      month: 'التقرير الشهري', monthT: 'التقرير الشهري', monthMsg: 'شهر {0} في بطل النجوم ⭐', chart: 'النجوم كل يوم', bestD: 'أفضل يوم: {0}', worstD: 'أصعب يوم: {0}',
      tEarned: 'نجوم مكتسبة', tLost: 'نجوم مخصومة', tFull: 'أيام كاملة', tPages: 'صفحات القرآن', tPrayers: 'الصلوات', tBooks: 'الكتب', tHifz: 'سور محفوظة', tRev: 'المراجعات', tDeeds: 'أعمال الخير',
      moodT: 'المزاج (آخر 30 يوماً)', moodFull: '{0}% أيام كاملة', noMood: 'لا توجد تسجيلات للمزاج بعد.',
      who: 'من وافق', p1: 'الوالد 1', p2: 'الوالد 2',
      hifz: 'الحفظ: السور المحفوظة', hifzSub: 'اضغط على السورة: جديدة ← محفوظة ← تحتاج مراجعة. السور التي أتمّها في وضع الحفظ بالحارس محفوظة تلقائياً.',
      h_m: 'محفوظة', h_w: 'تحتاج مراجعة', h_g: 'محفوظة في الحارس', show: 'عرض', hide: 'إخفاء',
      twoP: 'الوالد الثاني', twoPSub: 'لكل والد رمزه الخاص. ويُظهر التقرير من وافق على كل مهمة.', name1: 'اسم الوالد 1', name2: 'اسم الوالد 2', pin2: 'رمز الوالد 2 (فارغ = متوقف)',
      pinBad: 'يجب أن يكون الرمز 4 أرقام ومختلفاً عن رمز الوالد 1.',
      fixSet: 'مهمة التصحيح بعد مهمة فائتة', none: 'لا شيء',
      surprise: 'أيام النجوم المضاعفة المفاجئة', on: 'تشغيل', off: 'إيقاف',
      limit: 'حد وقت اللعب (الرحلة والمتجر والألعاب)', limitSub: 'مهام الصفحة الرئيسية لا تُقفل أبداً.', used: 'استُخدم اليوم: {0} دقيقة', more15: '+15 دقيقة اليوم',
      lockT: 'حان وقت اللعب في الخارج!', lockP: 'لعبت {0} دقيقة اليوم. اركض أو ارسم أو اقرأ. مهامك في الصفحة الرئيسية ما زالت مفتوحة!', lockHome: 'اذهب إلى مهامي', parent: 'الوالدان',
    },
  };
  const txl = (lg, k, ...a) => ((L[lg] || L.en)[k] ?? L.en[k] ?? k).replace(/\{(\d)\}/g, (_, i) => a[i]);
  const tx = (k, ...a) => txl(lang(), k, ...a);
  const cfg = () => db.m || (db.m = { limit: 0, pin2: '', n1: '', n2: '' });
  const item = (k, w) => { const d = dayOf(st, today()); (d.x || (d.x = [])).push({ id: Date.now() % 1e9, k, w, s: 'pending' }); };
  const todays = k => xItems(st, today()).filter(i => i.k === k);
  const chipOf = i => i.s === 'done' ? `<em>+${i.r}⭐</em>` : i.s === 'pending' ? '⏳' : '';

  // ---------------------------------------------------------------- hifz (memorised surahs and daily revision)
  const SURAS = [1, ...Array.from({ length: 48 }, (_, i) => 67 + i)]; // Al-Fatiha, Juz Tabarak, Juz 'Amma: the ones with recitation audio
  const suraName = s => window.Guard && Guard.suraName ? Guard.suraName(s, 'ar') : String(s);
  const hifz = (kid = st) => kid.hifz || (kid.hifz = {});
  const byGuard = (kid = st) => { // finished in Focus Guard memorize mode (badges.js counts them the same way)
    if (!window.Guard || typeof ML === 'undefined' || !window.Badges || !Badges.AYAS) return new Set();
    const g = Guard.stats(kid).hifz;
    return new Set(Object.keys(g).map(Number).filter(s => ML.covered(g[s]) >= Badges.AYAS[s - 1]));
  };
  const memorised = (kid = st) => { const g = byGuard(kid), h = hifz(kid); return SURAS.filter(s => g.has(s) || (h[s] && h[s].m)); };
  function revToday() { // fixed for the whole day, so an approved revision doesn't swap in a new surah
    const d = today();
    if (!st.revDay || st.revDay.d !== d || !st.revDay.list.length) st.revDay = { d, list: revisionPick(memorised(), hifz()) };
    return st.revDay.list;
  }
  function revCard() {
    const list = revToday();
    if (!list.length) return '';
    const got = todays('rev');
    return `<section class="xcard mrev"><div class="xcard-h"><span class="xbig-ic">🔁</span><b>${tx('rev')}</b></div><p class="msub">${tx('revSub')}</p>
      ${list.map(s => { const i = got.find(x => +x.w === s); return `<div class="mrow"><b lang="ar" dir="rtl">سورة ${suraName(s)}</b>
        ${i ? `<span class="xchip ${i.s}">${chipOf(i) || '✓'}</span>` : `<button class="btn go" data-a="mRev" data-id="${s}">${tx('revBtn')}</button>`}</div>`; }).join('')}</section>`;
  }

  // ---------------------------------------------------------------- weekly verse quiz
  const QN = 5;
  const monday = d => addDays(d, -((parse(d).getDay() + 6) % 7));
  const quizState = () => st.quiz || (st.quiz = { wk: '', score: 0, best: 0 });
  function quizCard() {
    if (!memorised().length) return '';
    const q = quizState(), done = q.wk === monday(today());
    return `<section class="xcard mquizc"><div class="xcard-h"><span class="xbig-ic">🎧</span><b>${tx('quiz')}</b></div>
      ${done ? `<p class="msub">${tx('quizDone', q.score, QN)}</p>` : `<p class="msub">${tx('quizSub')}</p><button class="btn go" data-a="mQuiz">${tx('quizGo')}</button>`}</section>`;
  }
  let QURAN = null;
  const ayaText = (s, a) => { const x = QURAN[s][a - 1]; return s === 1 || a !== 1 ? x : x.split(' ').slice(4).join(' '); }; // Tanzil puts the 4-word basmala inside ayah 1
  const pickOne = arr => arr[Math.random() * arr.length | 0];
  function questions(pool) {
    const out = [];
    for (let n = 0; n < QN; n++) {
      const s = pickOne(pool), len = QURAN[s].length, a = 1 + (Math.random() * (len - 1) | 0), right = [s, a + 1];
      const wrong = [];
      for (let b = 1; b <= len; b++) if (b !== a && b !== a + 1) wrong.push([s, b]);
      while (wrong.length < 2) { const o = pickOne(SURAS.filter(x => x !== s)); wrong.push([o, 1 + (Math.random() * QURAN[o].length | 0)]); }
      const opts = [right, ...wrong.sort(() => Math.random() - .5).slice(0, 2)].sort(() => Math.random() - .5);
      out.push({ s, a, opts, right: opts.indexOf(right) });
    }
    return out;
  }
  const audio = (s, a) => `quran/audio/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`;
  async function quiz() {
    const el = document.createElement('div'), kid = st;
    el.className = 'xpick mquiz';
    el.innerHTML = `<div class="xpick-card"><p>${tx('quizLoad')}</p></div>`;
    document.body.appendChild(el);
    const back = window.onBack;
    let player = null;
    const play = (s, a) => { try { if (player) player.pause(); player = new Audio(audio(s, a)); player.play().catch(() => {}); } catch (e) { /* no sound */ } };
    const close = () => { if (player) player.pause(); el.remove(); window.onBack = back; };
    window.onBack = () => { close(); return true; };
    try { if (!QURAN) QURAN = ML.parseQuran(await (await fetch('quran/quran-simple.txt')).text()); }
    catch (e) { el.querySelector('p').textContent = tx('quizFail'); setTimeout(close, 1800); return; }
    const qs = questions(memorised(kid));
    let n = 0, score = 0, answered = -1;
    const draw = () => {
      const q = qs[n];
      if (!q) {
        el.innerHTML = `<div class="xpick-card">${hero('cheer', 'mqhero')}<h2>${tx('score', score, QN)}</h2>${score ? `<p class="mbig">${tx('scoreStars', score)} ${star}</p>` : ''}
          <button class="btn go" data-q="end">${tx('finish')}</button></div>`;
        return;
      }
      el.innerHTML = `<div class="xpick-card"><small class="mqof">${tx('qOf', n + 1, QN)} · <span lang="ar">سورة ${suraName(q.s)}</span></small>
        <button class="mplay" data-q="play">🔊 ${tx('again')}</button>
        <p class="mayah" lang="ar" dir="rtl">${esc(ayaText(q.s, q.a))}</p><h2>${tx('next')}</h2>
        <div class="mopts">${q.opts.map(([s, a], i) => `<button lang="ar" dir="rtl" data-q="opt" data-i="${i}" class="${answered < 0 ? '' : i === q.right ? 'ok' : i === answered ? 'bad' : 'dim'}" ${answered >= 0 ? 'disabled' : ''}>${esc(ayaText(s, a))}</button>`).join('')}</div>
        ${answered >= 0 ? `<p class="mfeed ${answered === q.right ? 'ok' : 'bad'}">${tx(answered === q.right ? 'right' : 'wrong')}</p><button class="btn go" data-q="next">${tx('nextQ')}</button>` : ''}
        <button class="link" data-q="close">${tx('close')}</button></div>`;
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-q]');
      if (!b) return;
      e.stopPropagation();
      const q = qs[n], k = b.dataset.q;
      if (k === 'play') play(q.s, q.a);
      else if (k === 'opt' && answered < 0) {
        answered = +b.dataset.i;
        if (answered === q.right) { score++; tune([660, 880, 1320]); play(q.opts[q.right][0], q.opts[q.right][1]); } else tune([330, 262]);
        draw();
      } else if (k === 'next') {
        n++; answered = -1; draw();
        if (qs[n]) play(qs[n].s, qs[n].a);
        else { // results: stars are paid right away (the app checked the answers)
          const s = kid.quiz || (kid.quiz = { wk: '', score: 0, best: 0 }), wk = monday(today());
          if (s.wk !== wk) { Object.assign(s, { wk, score, best: Math.max(s.best || 0, score) }); gain(kid, today(), score, ['quiz']); save(); }
          if (score && window.celebrate) celebrate();
        }
      } else if (k === 'end' || k === 'close') { close(); render(); }
    });
    draw(); play(qs[0].s, qs[0].a);
  }

  // ---------------------------------------------------------------- books
  function booksCard() {
    let total = 0;
    for (const d of Object.keys(st.days)) total += xItems(st, d).filter(i => i.k === 'book' && i.s === 'done').length;
    const wk = bookStreak(st, today()), list = todays('book');
    return `<section class="xcard mbooks"><div class="xcard-h"><span class="xbig-ic">📚</span><b>${tx('books')}</b></div>
      <div class="xchips"><span class="xchip">${tx('bookN', total)}</span>${wk ? `<span class="xchip">${tx('bookWk', wk)}</span>` : ''}
        ${list.map(i => `<span class="xchip ${i.s}">📖 ${esc(i.w)} ${chipOf(i)}</span>`).join('')}</div>
      <button class="btn go" data-a="mBook">${tx('bookBtn')}</button></section>`;
  }

  // ---------------------------------------------------------------- mood, surprise day and make-it-right on top of Home
  const MOODS = [['happy', '😄'], ['ok', '🙂'], ['tired', '😴'], ['sad', '😢']];
  const FIXES = ['rev', 'tidy', 'help', 'read', 'sorry'];
  function homeTop() {
    const d = st.days[today()] || {}, fix = st.consequence && st.penalty.fix;
    let h = '';
    if (isDouble(st, today())) h += `<section class="mdouble"><b>⚡ ${tx('double')}</b><small>${tx('doubleSub')}</small></section>`;
    if (!d.mood) h += `<section class="xcard mmood"><b>${tx('mood')}</b><div>${MOODS.map(([k, e]) => `<button data-a="mMood" data-id="${k}"><span>${e}</span><small>${tx('m_' + k)}</small></button>`).join('')}</div></section>`;
    if (fix) {
      const i = todays('fix')[0];
      h += `<section class="xcard mfix"><div class="xcard-h"><span class="xbig-ic">💪</span><b>${tx('fix')}</b></div><p class="msub">${tx('fixSub')}</p>
        <div class="mrow"><b>${tx('f_' + fix)}</b>${i ? `<span class="xchip ${i.s}">⏳ ${tx('fixWait')}</span>` : `<button class="btn go" data-a="mFix">${tx('fixBtn')}</button>`}</div></section>`;
    }
    return h;
  }
  const homeCards = () => revCard() + quizCard() + booksCard();

  // ---------------------------------------------------------------- savings jar (Rewards tab)
  function jar() {
    if (!st.rewards.length) return '';
    const j = jarOf(st), g = jarGoal(st), wait = st.requests.some(q => q.jar && q.status === 'pending');
    if (!g || ui.mJarPick) return `<section class="xcard mjar"><div class="xcard-h"><span class="xbig-ic">🫙</span><b>${tx('jar')}</b></div><p class="msub">${tx('jarSub')}</p>
      <h3>${tx('jarPick')}</h3><div class="xchips">${st.rewards.map(r => `<button class="xchip mgoal" data-a="mJarGoal" data-id="${r.id}">${icon(r.icon)} ${esc(r.title)} · ${r.cost}⭐</button>`).join('')}</div></section>`;
    const pct = Math.min(100, j.saved / g.cost * 100), full = j.saved >= g.cost;
    return `<section class="xcard mjar"><div class="xcard-h"><span class="xbig-ic">🫙</span><b>${tx('jar')}</b></div>
      <div class="mjarrow"><div class="mjarv ${full ? 'full' : ''}" style="--p:${pct}%"><i></i><span>${icon(g.icon)}</span></div>
        <div><b>${esc(g.title)}</b><p class="mbig">${tx('jarOf', j.saved, g.cost)} ${star}</p>
        ${full ? `<button class="btn go" data-a="mJarAsk">${tx('jarAsk')}</button>`
          : `<div class="line">${[5, 10].map(n => `<button class="btn ${st.stars >= 1 ? 'go' : 'off'}" data-a="mJarIn" data-id="${n}" ${st.stars < 1 ? 'disabled' : ''}>${tx('jarIn')} ${n}⭐</button>`).join('')}</div>`}
        ${wait ? `<small class="msub">⏳ ${tx('jarWait')}</small>` : ''}
        <button class="link" data-a="mJarChange">${tx('jarChange')}</button></div></div></section>`;
  }

  // ---------------------------------------------------------------- items shown on the parent's approve page (extras.js)
  function itemInfo(it) {
    if (it.k === 'rev') return { icon: '🔁', kind: tx('revK'), name: `<span lang="ar">سورة ${suraName(+it.w)}</span>` };
    if (it.k === 'book') return { icon: '📖', kind: tx('bookK'), name: esc(it.w) };
    if (it.k === 'fix') return { icon: '💪', kind: tx('fixK'), name: tx('f_' + it.w) };
    return null;
  }
  function rated(it, day) { // called by extras.js after the parent gave stars
    it.b = ui.who || 1;
    if (it.k === 'rev') { const h = hifz(), x = h[it.w] || (h[it.w] = {}); x.rev = day; delete x.weak; }
    if (it.k === 'fix') st.consequence = null;
  }

  // ---------------------------------------------------------------- parent report: monthly report, mood, who approved
  const pname = (w, lg = lang()) => (w === 2 ? cfg().n2 : cfg().n1) || txl(lg, w === 2 ? 'p2' : 'p1');
  function approvals() {
    const out = [];
    for (const d of Object.keys(st.days).sort().reverse().slice(0, 14)) {
      const x = st.days[d];
      for (const task of st.tasks) if (x['b' + task.id]) out.push([d, icon(task.icon), esc(task.title), x['s' + task.id], x['b' + task.id]]);
      for (const it of (x.x || [])) if (it.b && it.s === 'done') { const inf = itemInfo(it); out.push([d, `<span class="ico xemo">${inf ? inf.icon : '✨'}</span>`, inf ? inf.name : Extras.tx(it.k === 'fast' ? 'fastK' : 'd_' + it.w), it.r, it.b]); }
    }
    return out.slice(0, 12);
  }
  function report() {
    const r = monthStats(st, today()), moods = MOODS.filter(([k]) => r.mood[k]);
    const ap = cfg().pin2 ? approvals() : [];
    return `<div class="line mmonth">${['en', 'ar'].map(lg => `<button class="btn go" data-a="mMonth" data-id="${lg}">📊 ${txl(lg, 'month')}</button>`).join('')}</div>
      <h3>${tx('moodT')}</h3>${moods.length ? `<div class="tiles">${moods.map(([k, e]) => `<div><b>${e} ${r.mood[k].days}</b><small>${tx('moodFull', Math.round(r.mood[k].full / r.mood[k].days * 100))}</small></div>`).join('')}</div>` : `<p class="hintx">${tx('noMood')}</p>`}
      ${ap.length ? `<h3>${tx('who')}</h3>${ap.map(([d, ico, name, s, w]) => `<div class="row mwho">${ico}<span class="txt"><b>${name}</b><small>${dayName(d)} · ${s || '–'}⭐</small></span><span class="xchip">${esc(pname(w))}</span></div>`).join('')}` : ''}`;
  }

  const loadImg = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  async function monthly(lg) {
    const ar = lg === 'ar', W = 1080, H = 1660, r = monthStats(st, today());
    const T = (k, ...a) => txl(lg, k, ...a), wday = i => new Date(2026, 10, 15 + i).toLocaleDateString(lg, { weekday: 'long' }); // Nov 15 2026 is a Sunday
    try { await document.fonts.load('800 40px Baloo'); } catch (e) { /* system font */ }
    const cv = Object.assign(document.createElement('canvas'), { width: W, height: H }), c = cv.getContext('2d');
    const F = (s, w = 800) => `${w} ${s}px Baloo, system-ui, sans-serif`;
    c.direction = ar ? 'rtl' : 'ltr'; c.textAlign = 'center';
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#F3EDFF'); bg.addColorStop(1, '#FFF6E0');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    const top = c.createLinearGradient(0, 0, W, 300); top.addColorStop(0, '#7B3FE4'); top.addColorStop(1, '#B07CFF');
    c.fillStyle = top; c.beginPath(); c.roundRect(0, -40, W, 340, 60); c.fill();
    const hb = await loadImg('hero-body.webp');
    if (hb) { const h = 250, w = hb.width * h / hb.height; c.drawImage(hb, ar ? 40 : W - 40 - w, 30, w, h); }
    c.textAlign = ar ? 'right' : 'left';
    const tx0 = ar ? W - 60 : 60;
    c.fillStyle = '#FFE27A'; c.font = F(64); c.fillText(T('monthT'), tx0, 115);
    c.fillStyle = '#fff'; c.font = F(78); c.fillText(st.name, tx0, 205);
    const range = `${parse(r.days[0].d).toLocaleDateString(lg, { day: 'numeric', month: 'long' })} – ${parse(r.days.at(-1).d).toLocaleDateString(lg, { day: 'numeric', month: 'long', year: 'numeric' })}`;
    c.font = F(30, 600); c.fillText(range, tx0, 260);
    c.textAlign = 'center';
    // tiles 3 x 3
    const hasP = st.tasks.some(x => x.type === 'prayer');
    const tiles = [[r.plus, 'tEarned', '#F2B705'], [r.minus ? '−' + r.minus : 0, 'tLost', '#E5484D'], [`${r.full}/30`, 'tFull', '#1FB65A'],
      [r.pages, 'tPages', '#12AFA0'], [hasP && r.prayerDays ? Math.round(r.prayers / (r.prayerDays * 5) * 100) + '%' : '–', 'tPrayers', '#1E8FF0'], [r.books, 'tBooks', '#FF7A1A'],
      [memorised().length, 'tHifz', '#7B3FE4'], [r.revisions, 'tRev', '#B05CE8'], [r.deeds, 'tDeeds', '#F0508F']];
    const bw = 300, bh = 150, gx = 30, x0 = (W - 3 * bw - 2 * gx) / 2;
    tiles.forEach(([v, k, col], i) => {
      const cx = i % 3, x = x0 + (ar ? 2 - cx : cx) * (bw + gx), y = 340 + Math.floor(i / 3) * (bh + 24);
      c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x, y, bw, bh, 26); c.fill(); c.strokeStyle = col; c.lineWidth = 5; c.stroke();
      c.fillStyle = col; c.font = F(58); c.fillText(String(v), x + bw / 2, y + 78);
      c.fillStyle = '#5A5478'; c.font = F(28, 700); c.fillText(T(k), x + bw / 2, y + 122);
    });
    // stars per day
    const cy = 945, ch = 220, cw = W - 160, max = Math.max(5, ...r.days.map(d => d.plus));
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(50, cy - 70, W - 100, ch + 120, 30); c.fill();
    c.fillStyle = '#2B2350'; c.font = F(34); c.fillText(T('chart'), W / 2, cy - 22);
    r.days.forEach((d, i) => {
      const j = ar ? r.days.length - 1 - i : i, bwid = cw / r.days.length, h = Math.max(4, d.plus / max * ch);
      c.fillStyle = d.full ? '#FFC531' : '#B9A3F5';
      c.beginPath(); c.roundRect(80 + j * bwid + 3, cy + ch - h + 10, bwid - 6, h, 6); c.fill();
    });
    // best and hardest weekday, mood
    c.font = F(36, 700); c.fillStyle = '#1FB65A';
    if (r.best >= 0) c.fillText('🌟 ' + T('bestD', wday(r.best)), W / 2, 1275);
    c.fillStyle = '#E5484D';
    if (r.worst >= 0 && r.worst !== r.best) c.fillText('💪 ' + T('worstD', wday(r.worst)), W / 2, 1328);
    const ms = MOODS.filter(([k]) => r.mood[k]);
    if (ms.length) {
      c.fillStyle = '#2B2350'; c.font = F(34); c.fillText(T('moodT'), W / 2, 1410);
      const mw = 220, mx = (W - ms.length * mw) / 2;
      ms.forEach(([k, e], i) => {
        const x = mx + (ar ? ms.length - 1 - i : i) * mw + mw / 2, m = r.mood[k];
        c.font = F(64); c.fillText(e, x, 1495);
        c.font = F(30); c.fillStyle = '#2B2350'; c.fillText(`× ${m.days}`, x, 1540);
        c.font = F(24, 600); c.fillStyle = '#7A7598'; c.fillText(T('moodFull', Math.round(m.full / m.days * 100)), x, 1575);
      });
    }
    c.fillStyle = '#7B3FE4'; c.font = F(30, 800); c.fillText(ar ? 'بطل النجوم ⭐' : 'Star Hero ⭐', W / 2, H - 40);
    const png = cv.toDataURL('image/png');
    if (window.Share) Share.image(png, `star-hero-month-${today()}.png`, T('monthMsg', st.name));
    return png;
  }

  // ---------------------------------------------------------------- play-time limit (Journey and Rewards tabs only)
  const TKEY = 'starhero-time';
  const usage = () => { let u; try { u = JSON.parse(localStorage.getItem(TKEY) || 'null'); } catch (e) { u = null; } return u && u.d === today() ? u : { d: today(), min: 0, extra: 0 }; };
  const setUsage = u => { try { localStorage.setItem(TKEY, JSON.stringify(u)); } catch (e) { /* not counted */ } };
  const over = () => { const lim = cfg().limit; if (!lim) return false; const u = usage(); return u.min >= lim + u.extra; };
  const guardOpen = () => { const g = document.getElementById('guard'); return g && !g.hidden; };
  setInterval(() => { // ponytail: counts in 30 s steps while a play tab is on screen; good enough for a daily limit
    if (typeof db === 'undefined' || !db || !cfg().limit || document.hidden || ui.parent || guardOpen() || ui.tab === 'home') return;
    const was = over(), u = usage(); u.min += .5; setUsage(u);
    if (!was && over() && !(document.activeElement && document.activeElement.dataset.f)) render();
  }, 30000);
  const lockScreen = () => `<div class="overlay mlock"><div class="pop">${hero('happy', 'jump')}<h1>${tx('lockT')} 🌳</h1><p>${tx('lockP', Math.round(usage().min))}</p>
    <button class="btn go" data-a="tab" data-id="home">${tx('lockHome')}</button><button class="link" data-a="lock">${ic('lock')} ${tx('parent')}</button></div></div>`;

  // ---------------------------------------------------------------- parent settings section
  const seg = (a, opts, val) => `<div class="seg grow">${opts.map(([v, l]) => `<button class="${String(val) === String(v) ? 'on' : ''}" data-a="${a}" data-id="${v}">${l}</button>`).join('')}</div>`;
  const inp = (label, f, val, attrs = '') => `<label><span>${label}</span><input data-mf="${f}" value="${esc(val || '')}" ${attrs}></label>`;
  function settings() {
    const x = cfg(), h = hifz(), g = byGuard(), u = usage();
    return `<h3>📖 ${tx('hifz')}</h3><div class="edit"><small class="hintx">${tx('hifzSub')}</small>
        <button class="btn off" data-a="mHifzOpen">${tx(ui.mHifz ? 'hide' : 'show')} (${memorised().length})</button>
        ${ui.mHifz ? `<div class="mhifz">${SURAS.map(s => { const y = h[s] || {}, m = g.has(s) || y.m; return `<button class="${y.weak ? 'w' : m ? 'm' : ''} ${g.has(s) ? 'g' : ''}" data-a="mHifz" data-id="${s}" lang="ar"><i>${s}</i>${suraName(s)}<small>${y.weak ? tx('h_w') : g.has(s) ? tx('h_g') : m ? tx('h_m') : ''}</small></button>`; }).join('')}</div>` : ''}</div>
      <h3>👨‍👩‍👦 ${tx('twoP')}</h3><div class="edit"><small class="hintx">${tx('twoPSub')}</small>
        ${inp(tx('name1'), 'n1', x.n1, 'maxlength="16"')}${inp(tx('name2'), 'n2', x.n2, 'maxlength="16"')}
        ${inp(tx('pin2'), 'pin2', x.pin2, 'type="tel" inputmode="numeric" maxlength="4" dir="ltr"')}</div>
      <h3>💪 ${tx('fixSet')}</h3><div class="edit"><select data-mf="fix"><option value="">${tx('none')}</option>${FIXES.map(f => `<option value="${f}" ${st.penalty.fix === f ? 'selected' : ''}>${tx('f_' + f)}</option>`).join('')}</select></div>
      <h3>⚡ ${tx('surprise')}</h3><div class="edit">${seg('mSurprise', [[1, tx('on')], [0, tx('off')]], st.surprise === false ? 0 : 1)}</div>
      <h3>⏱️ ${tx('limit')}</h3><div class="edit"><small class="hintx">${tx('limitSub')}</small>
        ${seg('mLimit', [[0, tx('off')], [30, '30'], [45, '45'], [60, '60'], [90, '90']], x.limit || 0)}
        ${x.limit ? `<small class="hintx">${tx('used', Math.round(u.min))}${u.extra ? ` (+${u.extra})` : ''}</small><button class="btn off" data-a="mMore15">${tx('more15')}</button>` : ''}</div>`;
  }
  document.addEventListener('change', e => {
    const el = e.target, f = el.dataset.mf;
    if (!f || !db) return;
    const v = el.value.trim(), x = cfg();
    if (f === 'pin2') {
      if (v && (!/^\d{4}$/.test(v) || v === db.pin)) { dialog({ icon: 'missed', text: tx('pinBad'), cancel: null }); setTimeout(render); return; }
      x.pin2 = v;
    } else if (f === 'n1' || f === 'n2') x[f] = v.slice(0, 16);
    else if (f === 'fix') { st.penalty.fix = v; if (v) st.penalty.text = tx('f_' + v); }
    save(); setTimeout(render); // not inside the blur that fired this change
  });

  // ---------------------------------------------------------------- actions
  const ACT = {
    mMood: id => { dayOf(st, today()).mood = id; tune([523, 659]); if (id === 'sad') dialog({ icon: 'smiley', text: tx('sadMsg'), cancel: null }); },
    mRev: id => { if (!todays('rev').some(i => +i.w === +id)) { item('rev', +id); if (window.celebrate) celebrate(); } },
    mQuiz: () => { quiz(); return false; },
    mBook: () => {
      dialog({ icon: 'books', title: tx('bookQ'), input: { max: 40 }, ok: tx('bookBtn') }).then(v => {
        const name = (v || '').trim();
        if (!name) return;
        item('book', name); if (window.celebrate) celebrate(); save(); render();
      });
      return false;
    },
    mFix: () => { if (st.consequence && st.penalty.fix && !todays('fix').length) { item('fix', st.penalty.fix); if (window.celebrate) celebrate(); } },
    mJarGoal: id => { jarOf(st).rid = +id; ui.mJarPick = false; tune([660, 990]); },
    mJarChange: () => { ui.mJarPick = true; },
    mJarIn: id => { if (jarAdd(st, +id, today())) tune([880, 1175]); },
    mJarAsk: () => {
      const bonus = jarAsk(st, today());
      if (!bonus) return;
      if (window.celebrate) celebrate();
      dialog({ icon: 'gift', text: tx('jarBonus', bonus), cancel: null });
    },
    mMonth: id => { monthly(id === 'ar' ? 'ar' : 'en'); return false; },
    mHifzOpen: () => { ui.mHifz = !ui.mHifz; },
    mHifz: id => { // new -> memorised -> needs revision -> new (Focus Guard ones: memorised <-> needs revision)
      const s = +id, h = hifz(), y = h[s] || (h[s] = {}), g = byGuard().has(s);
      if (y.weak) { delete y.weak; if (!g) delete h[s]; }
      else if (y.m || g) y.weak = 1;
      else y.m = 1;
      if (st.revDay) st.revDay.d = ''; // pick today's revision again
    },
    mSurprise: id => { st.surprise = id === '1'; },
    mLimit: id => { cfg().limit = +id; },
    mMore15: () => { const u = usage(); u.extra += 15; setUsage(u); },
  };

  function install(actions) {
    // second parent: their own PIN opens the parent zone too, and approvals remember who gave them
    const key0 = actions.key, approve0 = actions.approve;
    actions.key = (id, el, e) => {
      const next = id === 'del' ? ui.pin.slice(0, -1) : ui.pin + id, p2 = db && cfg().pin2;
      if (next.length === 4 && p2 && next === p2 && next !== db.pin) { ui.shake = false; ui.pin = null; ui.parent = true; ui.ptab = 'approve'; ui.who = 2; return; }
      if (next.length === 4 && next === db.pin) ui.who = 1;
      return key0(id, el, e);
    };
    actions.approve = (id, el, e) => {
      const day = el.dataset.day, was = (st.days[day] || {})[id], out = approve0(id, el, e);
      if (was === 'pending' && st.days[day][id] === 'done') st.days[day]['b' + id] = ui.who || 1;
      return out;
    };
    Object.assign(actions, ACT);
  }

  function after(root) {
    if (!db || ui.parent || ui.pin !== null || ui.tab === 'home' || !over() || root.querySelector('.overlay')) return;
    root.insertAdjacentHTML('beforeend', lockScreen());
  }

  return { install, homeTop, homeCards, jar, report, settings, after, item: itemInfo, rated, monthly, memorised, tx };
})();
window.More = More;
