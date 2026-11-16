// Star Hero 2.2: growing hero pet, morning and bedtime routines, school tests with a countdown and daily revision,
// read-aloud, story chapters on the journey, the child's own ideas, love notes from a parent and the star statement.
// Loaded before app.js; uses its globals (db, st, ui, t, lang, save, render, today, dialog, ic, tune, esc, icon, star ...)
// and logic.js (gain, dueTasks, full, addDays, parse, relabel, NODE_AT ...) only when called.
// app.js hooks: Plus.install(actions), homeTop() in home(), sayBtn() in mission(), rewards() in rewards(), storyBtn() in journey(),
// approveRows()/pendingCount() in the parent's approve page, tests() in pTasks(), settings() in pSettings(), after(app) in render().
const Plus = (() => {
  const L = {
    en: {
      cancel: 'Cancel', pet: 'My hero pet', petName: 'Sparky', petNameQ: "What's your pet's name?", rename: 'Rename',
      st0: 'A mystery egg', st1: 'Baby', st2: 'Growing up', st3: 'Super grown-up!', grow: '{0} more full days to grow', grow1: '1 more full day to grow!', grown: 'All grown up. Keep it happy!',
      hatched: 'Your egg hatched! Meet {0}!', grew: '{0} grew bigger! Keep going!', grewUp: '{0} is all grown up! You did it!',
      p_happy: ['Yay! You are my hero!', 'I love it when you finish your missions!', 'High five! ✋', "Let's do great today!"],
      p_ok: ['Hi friend! Shall we do our missions?', 'I grow when you finish full days!', 'Tap the missions, I believe in you!'],
      p_sad: ['I miss our full days… Can we fix it today?', "I'm a bit sad. Let's do our missions together!"],
      egg: ['Knock knock! Finish full days to hatch me!', '*wobble wobble*'],
      am: 'Morning routine', pm: 'Bedtime routine', rtDone: 'Routine done! +{0}⭐',
      am_teeth: 'Brush teeth', am_bed: 'Make bed', am_dress: 'Get dressed', am_food: 'Breakfast',
      pm_wash: 'Wash up', pm_teeth: 'Brush teeth', pm_pj: 'Pyjamas on', pm_dua: 'Bedtime dua',
      tests: 'Tests and exams', testsSub: 'Add a test date. A revision mission shows up every day until the test.', subj: 'Subject (e.g. Math)', when: 'Test date', addTest: '+ Add test',
      testBad: 'Enter a subject and a date after today.', revFor: 'Revise for {0} test', testIn: '{0} test in {1} days', testTom: '{0} test is tomorrow!', testToday: '{0} test is today! Good luck 🍀',
      upcoming: 'Coming up',
      say: 'Read aloud', sayOn: 'Read-aloud buttons 🔊', routines: 'Morning and bedtime routines',
      ideaBtn: 'I have an idea!', ideaQ: 'What is your idea?', ideaTask: 'A new mission', ideaReward: 'A new reward', ideaName: 'Write your idea', ideas: 'My ideas',
      ideaK: 'Idea from {0}', yes: 'Yes', no: 'No', i_pending: 'Waiting', i_yes: 'Yes! 🎉', i_no: 'Not this time',
      note: 'Love note to {0}', notePh: 'Write something kind… (they see it next time they open the app)', send: 'Send 💌', noteSent: 'Your note is waiting for {0}.',
      noteFrom: 'A note from {0}', yourParent: 'your parent', thanks: '❤️ Thank you!',
      story: 'Story book', chapter: 'Chapter {0}', lockedCh: 'Reach day {0} on {1} to unlock', newCh: 'New chapter!',
      log: 'My stars story', logSub: 'Where your stars came from and where they went', show: 'Show', hide: 'Hide', noLog: 'Nothing yet. Finish a mission!',
      k_task: '{0}', k_double: '⚡ {0} (double day)', k_chest: 'Treasure chest', k_planet: 'Planet finished', k_khatma: 'Finished the Quran', k_missed: 'Missed: {0}',
      k_adjust: 'From your parent', k_reward: 'Reward: {0}', k_refund: 'Stars back: {0}', k_shop: 'Dress-up: {0}', k_jar: 'Into the jar', k_jarBonus: 'Patience bonus',
      k_quiz: 'Quran quiz', k_videos: 'Videos ({0} min)', k_game: 'Game: {0}', k_deed: 'Good deed', k_fast: 'Fasting', k_rev: 'Revision', k_book: 'Book: {0}', k_fix: 'Made it right', k_routine: 'Routine', k_idea: 'Great idea', k_: 'Stars',
    },
    ar: {
      cancel: 'إلغاء', pet: 'صديقي البطل', petName: 'شرارة', petNameQ: 'ما اسم صديقك؟', rename: 'غيّر الاسم',
      st0: 'بيضة غامضة', st1: 'صغير', st2: 'يكبر', st3: 'كبر وصار بطلاً!', grow: 'بقي {0} أيام كاملة ليكبر', grow1: 'بقي يوم كامل واحد ليكبر!', grown: 'كبر تماماً. حافظ على سعادته!',
      hatched: 'فقست البيضة! تعرّف على {0}!', grew: 'كبر {0}! استمر!', grewUp: '{0} كبر تماماً! أحسنت!',
      p_happy: ['رائع! أنت بطلي!', 'أحبك عندما تنهي مهامك!', 'كفّك! ✋', 'هيا نجعل اليوم رائعاً!'],
      p_ok: ['أهلاً يا صديقي! هل ننجز مهامنا؟', 'أكبر عندما تكمل أياماً كاملة!', 'هيا، أنا أثق بك!'],
      p_sad: ['اشتقت لأيامنا الكاملة… هل نصلح ذلك اليوم؟', 'أنا حزين قليلاً. هيا ننجز مهامنا معاً!'],
      egg: ['طق طق! أكمل أياماً كاملة لأفقس!', '*تتمايل البيضة*'],
      am: 'روتين الصباح', pm: 'روتين النوم', rtDone: 'أنهيت الروتين! +{0}⭐',
      am_teeth: 'نظّف أسنانك', am_bed: 'رتّب سريرك', am_dress: 'البس ملابسك', am_food: 'الفطور',
      pm_wash: 'اغتسل', pm_teeth: 'نظّف أسنانك', pm_pj: 'البس البيجامة', pm_dua: 'دعاء النوم',
      tests: 'الاختبارات', testsSub: 'أضف موعد اختبار. ستظهر مهمة مراجعة كل يوم حتى الاختبار.', subj: 'المادة (مثال: الرياضيات)', when: 'موعد الاختبار', addTest: '+ إضافة اختبار',
      testBad: 'أدخل المادة وتاريخاً بعد اليوم.', revFor: 'مراجعة اختبار {0}', testIn: 'اختبار {0} بعد {1} أيام', testTom: 'اختبار {0} غداً!', testToday: 'اختبار {0} اليوم! بالتوفيق 🍀',
      upcoming: 'قريباً',
      say: 'اقرأ بصوت', sayOn: 'أزرار القراءة بصوت 🔊', routines: 'روتين الصباح والنوم',
      ideaBtn: 'عندي فكرة!', ideaQ: 'ما فكرتك؟', ideaTask: 'مهمة جديدة', ideaReward: 'جائزة جديدة', ideaName: 'اكتب فكرتك', ideas: 'أفكاري',
      ideaK: 'فكرة من {0}', yes: 'نعم', no: 'لا', i_pending: 'بالانتظار', i_yes: 'نعم! 🎉', i_no: 'ليس هذه المرة',
      note: 'رسالة حب إلى {0}', notePh: 'اكتب كلاماً لطيفاً… (سيراه عند فتح التطبيق في المرة القادمة)', send: 'أرسل 💌', noteSent: 'رسالتك بانتظار {0}.',
      noteFrom: 'رسالة من {0}', yourParent: 'والديك', thanks: '❤️ شكراً!',
      story: 'كتاب القصص', chapter: 'الفصل {0}', lockedCh: 'صل إلى اليوم {0} في {1} لفتحه', newCh: 'فصل جديد!',
      log: 'قصة نجومي', logSub: 'من أين جاءت نجومك وأين ذهبت', show: 'عرض', hide: 'إخفاء', noLog: 'لا شيء بعد. أنجز مهمة!',
      k_task: '{0}', k_double: '⚡ {0} (يوم مضاعف)', k_chest: 'صندوق الكنز', k_planet: 'أنهيت كوكباً', k_khatma: 'ختمت القرآن', k_missed: 'فاتك: {0}',
      k_adjust: 'من والديك', k_reward: 'جائزة: {0}', k_refund: 'عادت النجوم: {0}', k_shop: 'خزانة البطل: {0}', k_jar: 'في الحصالة', k_jarBonus: 'مكافأة الصبر',
      k_quiz: 'مسابقة القرآن', k_videos: 'فيديو ({0} دقيقة)', k_game: 'لعبة: {0}', k_deed: 'عمل طيب', k_fast: 'الصيام', k_rev: 'مراجعة', k_book: 'كتاب: {0}', k_fix: 'صحّحت الأمر', k_routine: 'الروتين', k_idea: 'فكرة رائعة', k_: 'نجوم',
    },
  };
  const tx = (k, ...a) => { const v = (L[lang()] || L.en)[k] ?? L.en[k] ?? k; return typeof v === 'string' ? v.replace(/\{(\d)\}/g, (_, i) => a[i]) : v; };
  const cfg = () => db.p || (db.p = { say: true });
  const pickOne = a => a[Math.random() * a.length | 0];

  // ---------------------------------------------------------------- read-aloud
  function say(text) {
    if (!text) return;
    const lg = lang();
    try {
      if (window.Android && Android.speak) return Android.speak(text, lg);
      if (window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lg === 'ar' ? 'ar' : 'en-US'; u.rate = .95; speechSynthesis.speak(u); }
    } catch (e) { /* no voice */ }
  }
  const sayBtn = text => cfg().say === false ? '' : `<button class="psay" data-a="pSay" data-t="${esc(text)}" aria-label="${tx('say')}">🔊</button>`;

  // ---------------------------------------------------------------- hero pet (grows with full days, mood follows the child)
  const stageOf = steps => steps >= 30 ? 3 : steps >= 10 ? 2 : steps >= 3 ? 1 : 0;
  const NEXT = [3, 10, 30];
  const petOf = (kid = st) => kid.pet || (kid.pet = { name: '', stage: stageOf(kid.steps) });
  const petName = () => petOf().name || tx('petName');
  function petMood() {
    if (st.consequence) return 'sad';
    const d = today(), due = dueTasks(st, d);
    return due.length && due.every(x => full(st, d, x)) ? 'happy' : 'ok';
  }
  function petSvg(stage, mood) {
    if (stage === 0) return `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="110" rx="30" ry="6" fill="#000" opacity=".13"/>
      <g class="pwob"><path d="M60 12 C88 12 99 56 99 77 C99 99 83 109 60 109 C37 109 21 99 21 77 C21 56 32 12 60 12Z" fill="#FFF6DD" stroke="#E8C77A" stroke-width="3"/>
      <circle cx="45" cy="55" r="8" fill="#9BE07A"/><circle cx="73" cy="79" r="10" fill="#7FD0FF"/><circle cx="71" cy="39" r="5.5" fill="#FF9EC7"/><circle cx="40" cy="88" r="5" fill="#FFC531"/>
      ${st.steps >= 2 ? '<path d="M34 64 l9 -7 l7 9 l9 -9 l7 7 l9 -7" fill="none" stroke="#B98A4C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' : ''}
      <ellipse cx="44" cy="34" rx="7" ry="11" fill="#fff" opacity=".7" transform="rotate(20 44 34)"/></g></svg>`;
    const sc = [0, .74, .88, 1][stage], body = stage === 3 ? '#5BC8F5' : '#7BE052', dark = stage === 3 ? '#2B8FC9' : '#3FAE3A', belly = stage === 3 ? '#DDF6FF' : '#E2FBD2';
    const eye = mood === 'sad' ? `<path d="M41 63 q7 -6 14 0 M65 63 q7 -6 14 0" stroke="#2B2350" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M45 70 q-2 6 1 9 q4 -3 -1 -9" fill="#7FD0FF"/>`
      : `<g class="pblink"><circle cx="48" cy="62" r="10" fill="#fff"/><circle cx="72" cy="62" r="10" fill="#fff"/><circle cx="50" cy="64" r="6" fill="#2B2350"/><circle cx="74" cy="64" r="6" fill="#2B2350"/><circle cx="52" cy="61" r="2.2" fill="#fff"/><circle cx="76" cy="61" r="2.2" fill="#fff"/></g>`;
    const mouth = mood === 'happy' ? '<path d="M50 80 q10 12 20 0 z" fill="#C2185B"/><path d="M55 85 q5 4 10 0" fill="#FF7AA8"/>'
      : mood === 'sad' ? '<path d="M52 86 q8 -7 16 0" stroke="#2B2350" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
      : '<path d="M52 81 q8 6 16 0" stroke="#2B2350" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    return `<svg viewBox="0 0 120 120"><ellipse cx="60" cy="111" rx="${26 + stage * 4}" ry="6" fill="#000" opacity=".13"/>
      <g transform="translate(60 112) scale(${sc}) translate(-60 -112)"><g class="pbob">
      ${stage >= 2 ? `<path class="pwing l" d="M30 66 C8 50 6 76 14 88 C20 80 26 80 32 82Z" fill="#C9B6FF" stroke="#8E6FE8" stroke-width="2.5"/><path class="pwing r" d="M90 66 C112 50 114 76 106 88 C100 80 94 80 88 82Z" fill="#C9B6FF" stroke="#8E6FE8" stroke-width="2.5"/>` : ''}
      <path d="M88 92 q24 4 22 -16 q-6 8 -14 6" fill="${body}" stroke="${dark}" stroke-width="2.5"/>
      ${stage === 3 ? `<path d="M42 34 l-6 -16 l14 10z M78 34 l6 -16 l-14 10z" fill="#FFC531" stroke="#E89A00" stroke-width="2"/>` : stage === 2 ? '<circle cx="60" cy="28" r="5" fill="#FFC531"/><path d="M60 33 v6" stroke="#E89A00" stroke-width="2.5"/>' : ''}
      <ellipse cx="60" cy="72" rx="36" ry="38" fill="${body}" stroke="${dark}" stroke-width="3"/>
      <ellipse cx="60" cy="88" rx="22" ry="18" fill="${belly}"/>
      ${stage === 3 ? '<path d="M60 78 l3.5 7 7.5 1 -5.5 5 1.5 7.5 -7 -3.8 -7 3.8 1.5 -7.5 -5.5 -5 7.5 -1z" fill="#FFC531"/>' : ''}
      <ellipse cx="40" cy="110" rx="11" ry="6" fill="${dark}"/><ellipse cx="80" cy="110" rx="11" ry="6" fill="${dark}"/>
      <circle cx="38" cy="76" r="6" fill="#FF9EC7" opacity=".6"/><circle cx="82" cy="76" r="6" fill="#FF9EC7" opacity=".6"/>
      ${eye}${mouth}</g></g></svg>`;
  }
  function petCard() {
    const p = petOf(), stage = stageOf(st.steps), mood = stage ? petMood() : 'ok', left = stage < 3 ? NEXT[stage] - st.steps : 0;
    const hearts = Array.from({ length: 5 }, (_, i) => `<i class="${i < Math.min(5, st.streak) ? 'on' : ''}">♥</i>`).join('');
    return `<section class="xcard ppet ${mood}"><button class="ppet-art" data-a="pPet" aria-label="${esc(petName())}">${petSvg(stage, mood)}<span class="pbub"></span></button>
      <div class="ppet-txt"><small>${tx('pet')}</small><b>${esc(petName())} <button class="link" data-a="pPetName" aria-label="${tx('rename')}">✏️</button></b>
        <small class="pst">${tx('st' + stage)}</small><span class="phearts">${hearts}</span>
        <small>${left ? (left === 1 ? tx('grow1') : tx('grow', left)) : tx('grown')}</small></div></section>`;
  }

  // ---------------------------------------------------------------- morning and bedtime routines
  const RT = { am: [['🦷', 'teeth'], ['🛏️', 'bed'], ['👕', 'dress'], ['🍳', 'food']], pm: [['🛁', 'wash'], ['🦷', 'teeth'], ['🌙', 'pj'], ['🤲', 'dua']] };
  const RT_STARS = 2;
  const rtOn = (kid = st) => kid.rtOn || (kid.rtOn = { am: true, pm: true });
  const nowRt = () => { const h = new Date().getHours(); return h >= 4 && h < 12 ? 'am' : h >= 17 ? 'pm' : null; };
  function rtCard() {
    const k = nowRt();
    if (!k || !rtOn()[k]) return '';
    const d = dayOf(st, today()), got = (d.rt || {})[k] || [], done = (d.rtd || {})[k];
    return `<section class="xcard prt ${k}"><div class="xcard-h"><span class="xbig-ic">${k === 'am' ? '☀️' : '🌙'}</span><b>${tx(k)}</b>${done ? `<em class="prt-done">${tx('rtDone', RT_STARS)}</em>` : ''}</div>
      <div class="prt-grid">${RT[k].map(([e, w], i) => `<button class="${got[i] ? 'on' : ''}" data-a="pRt" data-id="${k}" data-k="${i}" ${done ? 'disabled' : ''}><span>${got[i] ? '✅' : e}</span><small>${tx(k + '_' + w)}</small></button>`).join('')}</div></section>`;
  }

  // ---------------------------------------------------------------- tests and exams
  const daysTo = d => Math.round((parse(d) - parse(today())) / 864e5);
  const tests = (kid = st) => kid.tests || (kid.tests = []);
  function testsCard() {
    const up = tests().filter(x => daysTo(x.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
    if (!up.length) return '';
    return `<section class="xcard ptests"><div class="xcard-h"><span class="xbig-ic">📅</span><b>${tx('upcoming')}</b></div>
      ${up.map(x => { const n = daysTo(x.date), line = n === 0 ? tx('testToday', esc(x.subj)) : n === 1 ? tx('testTom', esc(x.subj)) : tx('testIn', esc(x.subj), n);
        return `<div class="mrow ptest ${n <= 1 ? 'soon' : ''}"><b>${line}</b>${n > 1 ? `<span class="pcount">${n}</span>` : '<span class="pcount">🍀</span>'}</div>`; }).join('')}</section>`;
  }
  function testsParent() {
    const list = tests().slice().sort((a, b) => a.date.localeCompare(b.date));
    return `<h3>📅 ${tx('tests')}</h3><div class="edit"><small class="hintx">${tx('testsSub')}</small>
      ${list.map(x => `<div class="line ptrow"><span>📚 <b>${esc(x.subj)}</b> · ${parse(x.date).toLocaleDateString(lang(), { weekday: 'short', day: 'numeric', month: 'short' })}</span><button class="link" data-a="pDelTest" data-id="${x.id}">${t('del')}</button></div>`).join('')}
      <div class="line"><label><span>${tx('subj')}</span><input id="pSubj" maxlength="24"></label><label><span>${tx('when')}</span><input id="pDate" type="date" min="${addDays(today(), 1)}"></label></div>
      <button class="add" data-a="pAddTest">${tx('addTest')}</button></div>`;
  }
  function sweepTests() { // a week after the test: the test and its revision mission go away
    for (const k of db.kids) {
      if (!k.tests) continue;
      const old = k.tests.filter(x => x.date < addDays(today(), -7)).map(x => x.id);
      if (!old.length) continue;
      k.tests = k.tests.filter(x => !old.includes(x.id));
      k.tasks = k.tasks.filter(x => !old.includes(x.test));
    }
  }

  // ---------------------------------------------------------------- the child's ideas (Rewards tab), love notes
  const ideas = (kid = st) => kid.ideas || (kid.ideas = []);
  const notes = (kid = st) => kid.notes || (kid.notes = []);
  const parentName = () => { const m = db.m || {}; return (ui.who === 2 ? m.n2 : m.n1) || ''; };
  function approveRows() {
    const pend = ideas().filter(i => i.s === 'pending');
    const last = notes().at(-1);
    return `<div class="edit pnote-edit"><b>💌 ${tx('note', esc(st.name))}</b><textarea id="pNoteText" maxlength="200" rows="2" placeholder="${tx('notePh')}"></textarea>
        <button class="btn go" data-a="pNote">${tx('send')}</button>${last && !last.seen ? `<small class="hintx">⏳ ${tx('noteSent', esc(st.name))}</small>` : ''}</div>
      ${pend.map(i => `<div class="row pend"><span class="ico xemo">💡</span><span class="txt"><b>${tx('ideaK', esc(st.name))}</b><small>${tx(i.k === 'task' ? 'ideaTask' : 'ideaReward')}: ${esc(i.t)}</small></span>
        <button class="no" data-a="pIdea" data-id="${i.id}" data-v="0" aria-label="${tx('no')}">${ic('x')}</button><button class="yes" data-a="pIdea" data-id="${i.id}" data-v="1" aria-label="${tx('yes')}">${ic('check')}</button></div>`).join('')}`;
  }
  const pendingCount = kid => ideas(kid).filter(i => i.s === 'pending').length;
  const noteOverlay = n => `<div class="overlay pnotebg"><div class="pop pnote"><div class="penv">💌</div><h2>${tx('noteFrom', esc(n.from || tx('yourParent')))}</h2>
    <p class="pnote-t">${esc(n.t)}</p>${sayBtn(n.t)}<button class="btn go" data-a="pNoteSeen" data-id="${n.id}">${tx('thanks')}</button></div></div>`;

  // ---------------------------------------------------------------- star statement + ideas (Rewards tab)
  const KIND_IC = { task: '✅', double: '⚡', chest: '🧰', planet: '🪐', khatma: '📖', missed: '😢', adjust: '👪', reward: '🎁', refund: '↩️', shop: '👑', jar: '🫙', jarBonus: '🫙',
    quiz: '🎧', videos: '📺', game: '🎮', deed: '🤲', fast: '🌙', rev: '🔁', book: '📚', fix: '💪', routine: '⏰', idea: '💡' };
  function rewards() {
    const my = ideas().slice(-4).reverse();
    const log = (st.log || []).slice(-40).reverse();
    return `<section class="xcard pideas"><div class="xcard-h"><span class="xbig-ic">💡</span><b>${tx('ideas')}</b></div>
        ${my.length ? `<div class="xchips">${my.map(i => `<span class="xchip ${i.s}">${i.k === 'task' ? '⭐' : '🎁'} ${esc(i.t)} · ${tx('i_' + (i.s === 'pending' ? 'pending' : i.s))}</span>`).join('')}</div>` : ''}
        <button class="btn go" data-a="pIdeaNew">${tx('ideaBtn')}</button></section>
      <section class="xcard plog"><div class="xcard-h"><span class="xbig-ic">🧾</span><b>${tx('log')}</b><button class="link" data-a="pLog">${tx(ui.pLog ? 'hide' : 'show')}</button></div><p class="msub">${tx('logSub')}</p>
        ${ui.pLog ? (log.length ? log.map(x => `<div class="plrow"><span>${KIND_IC[x.k] || '⭐'}</span><span class="pltxt">${tx('k_' + x.k, esc(x.t))}<small>${dayName(x.d)}</small></span><b class="${x.n > 0 ? 'up' : 'down'}" dir="ltr">${x.n > 0 ? '+' : '−'}${Math.abs(x.n)}</b></div>`).join('') : `<p class="msub">${tx('noLog')}</p>`) : ''}</section>`;
  }

  // ---------------------------------------------------------------- story chapters (one per treasure chest and one per finished planet)
  const CH_DAYS = [7, 14, 21, 28, 30];
  const FRIEND = [['🐰', '🦉', '🦫', '🧰', '🌳'], ['🦁', '🦜', '🐘', '🧰', '🦁'], ['👽', '🛸', '☄️', '🧰', '✨']];
  const STORY = {
    en: [[
      '{0} landed on the Green World with a big WHOOSH! A little rabbit was crying under the Star Tree. "Its light is fading," she sniffed. "Can you help?" {0} smiled: "Bismillah, of course I will!"',
      'A wise old owl whispered the secret: "The Star Tree shines when someone does good every single day: prayers, homework, kind words." {0} nodded. "Then I will keep going, day after day!"',
      'The bridge over the river was broken. {0} could not fix it alone, so the beavers, the rabbit and the owl all helped. "Together we are strong," laughed {0} as they crossed.',
      'Inside the treasure chest {0} found something warm and glowing: a golden Star Seed! "This is your reward for never giving up," said the owl.',
      '{0} planted the Star Seed and the Star Tree blazed with light! The animals cheered. Then a shiny rocket landed. "Next stop: the Jungle Safari!" said {0}.',
    ], [
      'Deep in the Jungle Safari, Leo the lion cub had lost his roar. "Rrr… squeak," he tried sadly. {0} sat next to him: "Don\'t worry Leo, we will find it together."',
      'The colourful parrots sang: "A little every day, a little every day!" {0} understood: being patient and practising a bit each day makes you strong, just like reading Quran every day.',
      'A baby elephant was stuck in the mud. {0} did not panic. "Let\'s pull gently, all together, one, two, three!" Out it came with a happy trumpet!',
      'In the second treasure chest shone another golden Star Seed. Leo jumped with joy. "You did it again!" he said, and this time a tiny roar came out!',
      'Leo took a deep breath and ROARED so loud the trees shook! The whole jungle had a parade for {0}. Then the rocket beeped: "Next stop: the Alien Planet!"',
    ], [
      'On the Alien Planet everything was purple and bubbly. A little alien called Zib waved: "Hello Earth hero! Our planet lights went out. Can you help us?"',
      'The aliens had one big ball of light, and everyone wanted it. {0} showed them how to share: "When we share, there is enough light for everyone!"',
      'Whoosh! A meteor shower lit up the sky. The little aliens hid, scared. {0} stayed calm, made a dua and led everyone safely home.',
      'The third treasure chest held the last golden Star Seed. Zib\'s antennae glowed: "With three Star Seeds, our lights can come back!"',
      '{0} planted the seed and the whole planet sparkled like a rainbow! All the friends came: the rabbit, the owl, Leo and Zib. "{0}, you are the true Hero of the Stars!"',
    ]],
    ar: [[
      'هبط {0} على العالم الأخضر بصوت ووووش كبير! كانت أرنبة صغيرة تبكي تحت شجرة النجوم: "نورها ينطفئ، هل تساعدنا؟" ابتسم {0}: "بسم الله، بالطبع سأساعدك!"',
      'همست البومة الحكيمة بالسر: "تلمع شجرة النجوم عندما يفعل أحدهم الخير كل يوم: الصلاة والواجب والكلمة الطيبة." فقال {0}: "إذن سأستمر يوماً بعد يوم!"',
      'كان الجسر فوق النهر مكسوراً. لم يستطع {0} إصلاحه وحده، فساعده القنادس والأرنبة والبومة. وضحك {0} وهم يعبرون: "معاً نحن أقوياء!"',
      'وجد {0} داخل صندوق الكنز شيئاً دافئاً يلمع: بذرة نجمة ذهبية! قالت البومة: "هذه مكافأتك لأنك لم تستسلم أبداً."',
      'زرع {0} بذرة النجمة فأضاءت شجرة النجوم بقوة! هتفت الحيوانات فرحاً. ثم هبط صاروخ لامع، فقال {0}: "المحطة التالية: غابة السفاري!"',
    ], [
      'في أعماق غابة السفاري فقد الشبل ليو زئيره. حاول بحزن: "ررر… سويك". جلس {0} بجانبه وقال: "لا تقلق يا ليو، سنجده معاً."',
      'غنّت الببغاوات الملوّنة: "قليلاً كل يوم، قليلاً كل يوم!" ففهم {0}: الصبر والتمرين كل يوم يجعلانك قوياً، تماماً مثل قراءة القرآن كل يوم.',
      'علق فيل صغير في الطين. لم يخف {0} وقال: "لنسحبه بلطف، معاً، واحد، اثنان، ثلاثة!" فخرج الفيل وهو ينفخ بخرطومه فرحاً!',
      'لمعت في صندوق الكنز الثاني بذرة نجمة ذهبية أخرى. قفز ليو فرحاً: "فعلتها مرة أخرى!" وهذه المرة خرج منه زئير صغير!',
      'أخذ ليو نفساً عميقاً وزأر بصوت عالٍ حتى اهتزت الأشجار! وأقامت الغابة كلها احتفالاً لـ{0}. ثم صفّر الصاروخ: "المحطة التالية: كوكب الفضائيين!"',
    ], [
      'على كوكب الفضائيين كان كل شيء بنفسجياً ومليئاً بالفقاعات. لوّح فضائي صغير اسمه زيب: "أهلاً يا بطل الأرض! انطفأت أنوار كوكبنا، هل تساعدنا؟"',
      'كان عند الفضائيين كرة نور واحدة كبيرة، وكل واحد يريدها لنفسه. علّمهم {0} المشاركة: "عندما نتشارك، يكفي النور الجميع!"',
      'ووووش! أضاء مطر من الشهب السماء، فاختبأ الفضائيون الصغار خائفين. بقي {0} هادئاً، ودعا الله، وقاد الجميع إلى البيت بأمان.',
      'كان في صندوق الكنز الثالث آخر بذرة نجمة ذهبية. لمعت قرون زيب: "بثلاث بذور نجوم ستعود أنوارنا!"',
      'زرع {0} البذرة فلمع الكوكب كله مثل قوس قزح! وجاء كل الأصدقاء: الأرنبة والبومة وليو وزيب. "يا {0}، أنت بطل النجوم الحقيقي!"',
    ]],
  };
  const unlocked = (p, c) => st.steps >= PLANETS * PLANET_DAYS || st.steps >= p * PLANET_DAYS + CH_DAYS[c];
  const seen = () => st.storySeen || (st.storySeen = []);
  const freshCh = () => { let n = 0; for (let p = 0; p < 3; p++) for (let c = 0; c < 5; c++) if (unlocked(p, c) && !seen().includes(p * 5 + c)) n++; return n; };
  const storyBtn = () => `<button class="sndbtn pbook" data-a="pStory" aria-label="${tx('story')}">📖${freshCh() ? '<i></i>' : ''}</button>`;
  const storyText = (p, c) => STORY[lang() === 'ar' ? 'ar' : 'en'][p][c].replace(/\{0\}/g, st.name);
  function storyBook(p0) {
    const el = document.createElement('div'), back = window.onBack;
    el.className = 'xpick pstory';
    let p = p0, c = 0;
    for (let i = 0; i < 5; i++) if (unlocked(p, i)) c = i; // open on the newest chapter of this planet
    const close = () => { try { if (window.Android && Android.stopSpeaking) Android.stopSpeaking(); else if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { /* */ } el.remove(); window.onBack = back; render(); };
    window.onBack = () => { close(); return true; };
    const draw = () => {
      const open = unlocked(p, c), map = PAINTED[p], y = NODE_AT(CH_DAYS[c] - 1)[1] / H * 100;
      if (open && !seen().includes(p * 5 + c)) { seen().push(p * 5 + c); save(); }
      el.innerHTML = `<div class="xpick-card"><h2>📖 ${tx('story')}</h2>
        <div class="seg ptabs">${[0, 1, 2].map(j => `<button class="${j === p ? 'on' : ''}" data-s="planet" data-i="${j}">${planetName(j)}</button>`).join('')}</div>
        <div class="pscene ${open ? '' : 'locked'}" style="background-image:url(${map}.webp);background-position:center ${y.toFixed(1)}%">
          ${open ? `<img class="ph" src="hero-body.webp" alt=""><span class="pfriend">${FRIEND[p][c]}</span>` : `<span class="plock">${ic('lock')}</span>`}</div>
        <small class="mqof">${tx('chapter', c + 1)} / 5</small>
        ${open ? `<p class="ptext">${esc(storyText(p, c))}</p>${sayBtn(storyText(p, c))}` : `<p class="ptext dim">${tx('lockedCh', CH_DAYS[c], planetName(p))}</p>`}
        <div class="pdots">${[0, 1, 2, 3, 4].map(i => `<button class="${i === c ? 'on' : ''} ${unlocked(p, i) ? '' : 'off'}" data-s="ch" data-i="${i}" aria-label="${tx('chapter', i + 1)}"></button>`).join('')}</div>
        <div class="line"><button class="btn off" data-s="prev" ${c === 0 ? 'disabled' : ''}>${lang() === 'ar' ? '›' : '‹'}</button><button class="btn go" data-s="close">${ic('check')}</button><button class="btn off" data-s="next" ${c === 4 ? 'disabled' : ''}>${lang() === 'ar' ? '‹' : '›'}</button></div></div>`;
    };
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-s],[data-a="pSay"]');
      if (!b) return;
      e.stopPropagation();
      if (b.dataset.a === 'pSay') return say(b.dataset.t);
      const s = b.dataset.s;
      if (s === 'close') return close();
      if (s === 'planet') { p = +b.dataset.i; c = 0; }
      else if (s === 'ch') c = +b.dataset.i;
      else if (s === 'prev') c = Math.max(0, c - 1);
      else if (s === 'next') c = Math.min(4, c + 1);
      tune([660]); draw();
    });
    document.body.appendChild(el); draw();
  }

  // ---------------------------------------------------------------- Home
  const homeTop = () => petCard() + rtCard() + testsCard();

  // ---------------------------------------------------------------- parent settings
  const seg = (a, opts, val) => `<div class="seg grow">${opts.map(([v, l]) => `<button class="${String(val) === String(v) ? 'on' : ''}" data-a="${a}" data-id="${v}">${l}</button>`).join('')}</div>`;
  const settings = () => `<h3>🔊 ${tx('sayOn')}</h3><div class="edit">${seg('pSayOn', [[1, t('on')], [0, t('off')]], cfg().say === false ? 0 : 1)}</div>
    <h3>⏰ ${tx('routines')}</h3><div class="edit">
      <label><span>☀️ ${tx('am')}</span>${seg('pRtOn', [['am1', t('on')], ['am0', t('off')]], 'am' + (rtOn().am ? 1 : 0))}</label>
      <label><span>🌙 ${tx('pm')}</span>${seg('pRtOn', [['pm1', t('on')], ['pm0', t('off')]], 'pm' + (rtOn().pm ? 1 : 0))}</label></div>`;

  // ---------------------------------------------------------------- actions
  const ACT = {
    pSay: (id, el) => { say(el.dataset.t); return false; },
    pPet: (id, el) => {
      const stage = stageOf(st.steps), lines = stage ? tx('p_' + petMood()) : tx('egg'), line = pickOne(lines), bub = el.querySelector('.pbub');
      tune(stage ? [784, 988, 1175] : [392, 330]);
      el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
      if (bub) { bub.textContent = line; bub.classList.add('on'); clearTimeout(bub._t); bub._t = setTimeout(() => bub.classList.remove('on'), 2600); }
      if (cfg().say !== false) say(line);
      return false;
    },
    pPetName: () => {
      dialog({ icon: 'smiley', title: tx('petNameQ'), input: { max: 14 }, ok: tx('rename') }).then(v => { const n = (v || '').trim(); if (n) { petOf().name = n.slice(0, 14); save(); render(); } });
      return false;
    },
    pRt: (k, el) => {
      const d = dayOf(st, today()), rt = d.rt || (d.rt = {}), got = rt[k] || (rt[k] = []), i = +el.dataset.k;
      if ((d.rtd || {})[k]) return false;
      got[i] = got[i] ? 0 : 1; tune([523 + 80 * i]);
      if (RT[k].every((_, j) => got[j])) { (d.rtd || (d.rtd = {}))[k] = 1; gain(st, today(), RT_STARS, ['routine']); if (window.celebrate) celebrate(); }
    },
    pAddTest: () => {
      const subj = (document.getElementById('pSubj').value || '').trim().slice(0, 24), date = document.getElementById('pDate').value;
      if (!subj || !/^\d{4}-\d\d-\d\d$/.test(date) || date <= today()) return later2({ icon: 'missed', text: tx('testBad'), cancel: null });
      const id = st.nextId++;
      tests().push({ id, subj, date });
      st.tasks.push({ id: st.nextId++, icon: '📚', title: tx('revFor', subj), target: '', stars: 2, days: [0, 1, 2, 3, 4, 5, 6], since: today(), until: addDays(date, -1), test: id });
    },
    pDelTest: id => { st.tests = tests().filter(x => x.id !== +id); st.tasks = st.tasks.filter(x => x.test !== +id); },
    pIdeaNew: () => {
      const el = document.createElement('div'), back = window.onBack;
      el.className = 'xpick';
      el.innerHTML = `<div class="xpick-card"><h2>${tx('ideaQ')}</h2><div class="xpick-grid"><button data-k="task"><span>⭐</span><b>${tx('ideaTask')}</b></button><button data-k="reward"><span>🎁</span><b>${tx('ideaReward')}</b></button></div><button class="link" data-k="">${tx('cancel')}</button></div>`;
      const close = () => { el.remove(); window.onBack = back; };
      window.onBack = () => { close(); return true; };
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-k]');
        if (!b && e.target !== el) return;
        e.stopPropagation(); close();
        const k = b && b.dataset.k;
        if (!k) return;
        dialog({ icon: 'sparkle', title: tx('ideaName'), input: { max: 30 }, ok: tx('send') }).then(v => {
          const name = (v || '').trim();
          if (!name) return;
          ideas().push({ id: st.nextId++, k, t: name.slice(0, 30), s: 'pending' });
          if (window.celebrate) celebrate(); save(); render();
        });
      });
      document.body.appendChild(el);
      return false;
    },
    pIdea: (id, el) => {
      const i = ideas().find(x => x.id === +id);
      if (!i || i.s !== 'pending') return false;
      i.s = el.dataset.v === '1' ? 'yes' : 'no';
      if (i.s === 'yes') {
        if (i.k === 'task') st.tasks.push({ id: st.nextId++, icon: '📚', title: i.t, target: '', stars: 2, days: [0, 1, 2, 3, 4, 5, 6], since: today() });
        else st.rewards.push({ id: st.nextId++, icon: '🎁', title: i.t, cost: 50 });
        gain(st, today(), 1, ['idea']);
      }
    },
    pNote: () => {
      const v = (document.getElementById('pNoteText').value || '').trim().slice(0, 200);
      if (!v) return false;
      const n = notes(); n.push({ id: Date.now() % 1e9, t: v, from: parentName(), at: today(), seen: false });
      if (n.length > 10) n.splice(0, n.length - 10);
    },
    pNoteSeen: id => { const n = notes().find(x => x.id === +id); if (n) n.seen = true; tune([659, 784, 1047]); },
    pLog: () => { ui.pLog = !ui.pLog; },
    pStory: () => { storyBook(ui.world ?? journeyPos(st.steps).planet); return false; },
    pSayOn: id => { cfg().say = id === '1'; },
    pRtOn: id => { rtOn()[id.slice(0, 2)] = id.endsWith('1'); },
  };
  const later2 = opts => { dialog(opts); return false; };

  function install(actions) {
    Object.assign(actions, ACT);
    if (db) { relabel(db); sweepTests(); }
  }
  // the language switch is saved by app.js; then the app's own mission/reward names follow it
  document.addEventListener('change', e => { if (e.target.dataset.f === 'db.0.lang') setTimeout(() => { relabel(db); save(); render(); }); });

  // after every render: an unread love note pops up; the pet hatching/growing is celebrated once
  function after(root) {
    if (!db || ui.parent || ui.pin !== null || ui.tab !== 'home' || root.querySelector('.overlay')) return;
    const n = notes().find(x => !x.seen);
    if (n) { root.insertAdjacentHTML('beforeend', noteOverlay(n)); return; }
    const p = petOf(), stage = stageOf(st.steps);
    if (stage > (p.stage || 0) && !document.querySelector('.dlg')) {
      p.stage = stage; save();
      if (window.celebrate) celebrate();
      dialog({ icon: 'sparkle', text: tx(stage === 1 ? 'hatched' : stage === 3 ? 'grewUp' : 'grew', petName()), cancel: null });
    }
  }

  return { install, homeTop, sayBtn, rewards, storyBtn, approveRows, pendingCount, tests: testsParent, settings, after, say, petSvg, STORY, tx };
})();
window.Plus = Plus;
