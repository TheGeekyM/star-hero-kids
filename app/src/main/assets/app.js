// UI only. All rules live in logic.js.
const T = {
  en: {
    app: 'Star Hero', hi: 'Hi, {0}!', ready: "Ready for today's missions?", allDone: 'All missions done. You are a star!',
    sorry: "Let's make today a great day!", stars: 'My stars', progress: '{0} of {1} done', streak: '{0} day streak',
    today: "Today's missions", waiting: 'Waiting for parent', done: 'Done!', plus: '+{0}',
    album: 'My sticker book', shareRep: 'Share this report', prayRem: 'Prayer-time reminders', prayCity: 'City', prayTitle: '🕌 Time for {0}', prayText: "{0}, it's time to pray!", todoL: 'To do', missedL: 'Missed', complete: 'Complete', undo: 'Undo', waitNote: 'Your parent will check it soon',
    rest: 'Rest day! No missions today.', home: 'Home', journey: 'Journey', rewards: 'Rewards', games: 'Games', videos: 'Videos', parent: 'Parent zone',
    world: 'World {0}', toChest: '{0} more full days to the treasure chest!',
    ask: 'Ask for it!', need: '{0} more', asked: 'Waiting for parent', myRewards: 'Rewards I earned', shop: 'Reward shop',
    shopSub: 'Collect stars, then ask for a reward!', noRewards: 'No rewards yet. Ask a parent to add some!',
    oops: 'Oh no!', missed: 'You missed: {0}', lost: 'You lost {0} stars.', fix: "Finish all of today's missions to make it right!",
    ok: 'OK', yay: 'Yay!', great: 'Great job!', earned: 'You earned {0} stars!', dayDone: 'Day complete! Streak: {0}',
    chest: 'Treasure chest! +{0} bonus stars. Go ask for a reward!', gift: 'Your reward is ready: {0}',
    dayOf: 'Day {0} of {1}', toPrize: '{0} more full days to the next treasure!', toGoal: '{0} more full days to finish this planet!',
    toPrize1: 'Just 1 more full day to the next treasure!', toGoal1: 'Just 1 more full day to finish this planet!', toPrize2: '2 more full days to the next treasure!', toGoal2: '2 more full days to finish this planet!',
    planetDone: 'You finished {0}! +{1} bonus stars', locked: 'Finish {0} to unlock this planet', planetComplete: 'Planet complete! You are a hero!', round: 'Round {0}', planetBonus: 'Bonus for finishing a planet (30 full days)',
    khatma: 'You finished the whole Quran! +{0} bonus stars', welcome: 'Welcome to Star Hero!', setup: 'A parent sets this up once.',
    childName: "Child's name", pin: 'Parent PIN (4 digits)', start: 'Start', pinAsk: 'Enter parent PIN', bad: 'Please enter a name and a 4-digit PIN.',
    approve: 'Approve', tasks: 'Missions', report: 'Report', settings: 'Settings', nothing: 'Nothing waiting. All caught up!',
    toApprove: 'Waiting for your approval', todayW: 'Today', reqs: 'Reward requests', give: 'Give', notNow: 'Not now',
    adjust: 'Bonus or deduct stars', adjustSub: 'For extra good (or bad) behaviour. Total: {0}', active: 'Active consequence', clear: 'Clear',
    title: 'Name', target: 'Note (e.g. Surah Al-Mulk, Math p. 12)', starsFor: 'Stars', cost: 'Cost in stars', del: 'Delete',
    addTask: '+ Add mission', addPrayer: '+ Add prayers mission', addReward: '+ Add reward', newTask: 'New mission', newReward: 'New reward', sure: 'Delete this?',
    quran: 'Quran', homework: 'Homework', lang: 'Language', penStars: 'Stars lost per missed mission',
    penText: 'Consequence shown to the child', chestBonus: 'Treasure chest bonus (every 7 full days)', newPin: 'Parent PIN',
    reset: 'Erase everything and start over', resetSure: 'Erase all children, stars, missions and history?', exit: 'Back to child',
    rules: 'Rules', days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], sep: ', ',
    prayers: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'], prayersOf: '{0}/5 prayers', tapPrayers: 'Tick each prayer you prayed',
    pagesDay: 'Quran pages per day', qJourney: 'My Quran journey', pageOf: 'Page {0} of {1}', khatmas: '{0}× khatma',
    quranNow: 'Quran: pages already read', khatmaBonus: 'Bonus stars for finishing the Quran',
    who: 'Who is using Star Hero?', children: 'Children', addKid: '+ Add child', kidName: "New child's name", delKidSure: 'Delete {0} and all their stars?',
    week: 'Last 7 days', fullDays: 'Full days', earnedW: 'Stars earned', lostW: 'Stars lost', pagesW: 'Quran pages', prayersW: 'Prayers', streakW: 'Streak',
    reminder: 'Daily reminder', remAt: 'Remind at', on: 'On', off: 'Off', remBlocked: 'Notifications are blocked. Allow them for Star Hero in the phone settings.',
    remTitle: '⭐ Missions are waiting!', remText: "{0}, finish today's missions to earn your stars!",
    backup: 'Backup', backupBtn: 'Save a backup file', restoreBtn: 'Restore from a backup file', backupSub: 'Keep the file somewhere safe (Google Drive, email) so stars are never lost.',

    upTo: 'up to 5', rateQ: 'How well was it done? Tap 1 to 5 stars', rated: 'You got {0} stars!',
    restoreSure: 'Replace ALL current data with this backup?', restoreBad: 'This file is not a Star Hero backup.', restored: 'Backup restored!', saved: 'Backup saved!', saveFail: 'Could not save the backup.',
  },
  ar: {
    app: 'بطل النجوم', hi: 'أهلاً يا {0}!', ready: 'جاهز لمهام اليوم؟', allDone: 'أنهيت كل المهام. أنت نجم!',
    sorry: 'هيا نجعل اليوم يوماً رائعاً!', stars: 'نجومي', progress: '{0} من {1}', streak: '{0} يوم متتالي',
    today: 'مهام اليوم', waiting: 'بانتظار الوالدين', done: 'تمّت!', plus: '+{0}',
    album: 'ألبوم الملصقات', shareRep: 'شارك هذا التقرير', prayRem: 'تذكير بمواقيت الصلاة', prayCity: 'المدينة', prayTitle: '🕌 حان وقت صلاة {0}', prayText: 'يا {0}، حان وقت الصلاة!', todoL: 'للإنجاز', missedL: 'فاتت', complete: 'أنجزتها', undo: 'تراجع', waitNote: 'سيتحقق والداك منها قريباً',
    rest: 'يوم راحة! لا مهام اليوم.', home: 'الرئيسية', journey: 'الرحلة', rewards: 'الجوائز', games: 'الألعاب', videos: 'فيديو', parent: 'ركن الوالدين',
    world: 'العالم {0}', toChest: 'بقي {0} أيام كاملة لتصل إلى صندوق الكنز!',
    ask: 'اطلبها!', need: 'بقي {0}', asked: 'بانتظار الوالدين', myRewards: 'جوائز حصلت عليها', shop: 'متجر الجوائز',
    shopSub: 'اجمع النجوم ثم اطلب جائزتك!', noRewards: 'لا توجد جوائز بعد. اطلب من والديك إضافتها!',
    oops: 'يا خسارة!', missed: 'فاتك: {0}', lost: 'خسرت {0} نجوم.', fix: 'أنجز كل مهام اليوم لتصحّح الأمر!',
    ok: 'حسناً', yay: 'رائع!', great: 'أحسنت!', earned: 'حصلت على {0} نجوم!', dayDone: 'اكتمل اليوم! أيام متتالية: {0}',
    chest: 'صندوق الكنز! +{0} نجوم إضافية. اطلب جائزتك الآن!', gift: 'جائزتك جاهزة: {0}',
    dayOf: 'اليوم {0} من {1}', toPrize: 'بقي {0} أيام كاملة للكنز التالي!', toGoal: 'بقي {0} أيام كاملة لإنهاء هذا الكوكب!',
    toPrize1: 'بقي يوم واحد فقط للكنز التالي!', toGoal1: 'بقي يوم واحد فقط لإنهاء هذا الكوكب!', toPrize2: 'بقي يومان للكنز التالي!', toGoal2: 'بقي يومان لإنهاء هذا الكوكب!',
    planetDone: 'أنهيت {0}! +{1} نجوم إضافية', locked: 'أنهِ {0} لفتح هذا الكوكب', planetComplete: 'اكتمل الكوكب! أنت بطل!', round: 'الجولة {0}', planetBonus: 'مكافأة إنهاء كوكب (30 يوماً كاملاً)',
    khatma: 'ختمت القرآن كاملاً! +{0} نجوم إضافية', welcome: 'أهلاً بك في بطل النجوم!', setup: 'يجهّزه أحد الوالدين مرة واحدة.',
    childName: 'اسم الطفل', pin: 'رمز الوالدين (4 أرقام)', start: 'ابدأ', pinAsk: 'أدخل رمز الوالدين', bad: 'أدخل الاسم ورمزاً من 4 أرقام.',
    approve: 'الموافقة', tasks: 'المهام', report: 'التقرير', settings: 'الإعدادات', nothing: 'لا شيء بانتظارك.',
    toApprove: 'بانتظار موافقتك', todayW: 'اليوم', reqs: 'طلبات الجوائز', give: 'أعطِه', notNow: 'ليس الآن',
    adjust: 'إضافة أو خصم نجوم', adjustSub: 'للسلوك الجيد (أو السيئ). المجموع: {0}', active: 'العقوبة الحالية', clear: 'إلغاء',
    title: 'الاسم', target: 'ملاحظة (مثال: سورة الملك، صفحة 12)', starsFor: 'النجوم', cost: 'السعر بالنجوم', del: 'حذف',
    addTask: '+ إضافة مهمة', addPrayer: '+ إضافة مهمة الصلوات', addReward: '+ إضافة جائزة', newTask: 'مهمة جديدة', newReward: 'جائزة جديدة', sure: 'حذف هذا العنصر؟',
    quran: 'القرآن', homework: 'الواجب', lang: 'اللغة', penStars: 'النجوم المخصومة عن كل مهمة فائتة',
    penText: 'العقوبة التي تظهر للطفل', chestBonus: 'مكافأة صندوق الكنز (كل 7 أيام كاملة)', newPin: 'رمز الوالدين',
    reset: 'مسح كل شيء والبدء من جديد', resetSure: 'مسح كل الأطفال والنجوم والمهام والسجل؟', exit: 'العودة للطفل',
    rules: 'القواعد', days: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'], sep: '، ',
    prayers: ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'], prayersOf: '{0}/5 صلوات', tapPrayers: 'اضغط على كل صلاة صلّيتها',
    pagesDay: 'صفحات القرآن يومياً', qJourney: 'رحلتي مع القرآن', pageOf: 'صفحة {0} من {1}', khatmas: 'ختمة ×{0}',
    quranNow: 'القرآن: الصفحات المقروءة سابقاً', khatmaBonus: 'نجوم إضافية عند ختم القرآن',
    who: 'من يستخدم بطل النجوم؟', children: 'الأطفال', addKid: '+ إضافة طفل', kidName: 'اسم الطفل الجديد', delKidSure: 'حذف {0} وكل نجومه؟',
    week: 'آخر 7 أيام', fullDays: 'أيام كاملة', earnedW: 'نجوم مكتسبة', lostW: 'نجوم مخصومة', pagesW: 'صفحات القرآن', prayersW: 'الصلوات', streakW: 'أيام متتالية',
    reminder: 'تذكير يومي', remAt: 'وقت التذكير', on: 'تشغيل', off: 'إيقاف', remBlocked: 'الإشعارات محظورة. اسمح بها لتطبيق بطل النجوم من إعدادات الهاتف.',
    remTitle: '⭐ مهامك بانتظارك!', remText: 'يا {0}، أنجز مهام اليوم لتكسب نجومك!',
    backup: 'النسخ الاحتياطي', backupBtn: 'حفظ ملف نسخة احتياطية', restoreBtn: 'استعادة من ملف نسخة احتياطية', backupSub: 'احفظ الملف في مكان آمن (Google Drive أو البريد) حتى لا تضيع النجوم.',

    upTo: 'حتى 5', rateQ: 'ما مدى جودة الإنجاز؟ اختر من 1 إلى 5 نجوم', rated: 'حصلت على {0} نجوم!',
    restoreSure: 'استبدال كل البيانات الحالية بهذه النسخة؟', restoreBad: 'هذا الملف ليس نسخة احتياطية من بطل النجوم.', restored: 'تمت الاستعادة!', saved: 'تم حفظ النسخة الاحتياطية!', saveFail: 'تعذّر حفظ النسخة الاحتياطية.',
  },
};
const TASK_ICONS = ['quran', 'homework', '🕌', '🤲', '📚', '🧮', '🎨', '🧹', '🛏️', '🦷', '🏃', '💤'];
const REWARD_ICONS = ['🍦', '🛝', '🎁', '🎮', '🍕', '🚲', '📱', '🎬', '⚽', '🍫', '🧸', '💵'];
const PRAYER_ICONS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const KID_COLORS = ['#7B3FE4', '#F0508F', '#1E8FF0', '#FF7A1A', '#12AFA0', '#1FB65A'];
const SVG = { lock: ic('lock'), home: ic('home'), journey: ic('journey'), rewards: ic('rewards'), games: ic('game'), videos: ic('film'), check: ic('check'), x: ic('x') }; // icons.js

const KEY = 'starhero';
const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const today = () => ymd(new Date());
let db = null, st = null;
try { db = migrate(JSON.parse(localStorage.getItem(KEY) || 'null'), today()); } catch (e) { db = null; }
const use = () => { st = db ? db.kids[db.cur] || db.kids[0] : null; };
use();
const ui = { tab: 'home', parent: false, ptab: 'approve', pin: null, parties: {}, picker: false, shake: false,
  lang: (navigator.language || '').startsWith('ar') ? 'ar' : 'en' };
const lang = () => db ? db.lang : ui.lang;
const t = (k, ...a) => { const v = T[lang()][k]; return typeof v === 'string' ? v.replace(/\{(\d)\}/g, (_, i) => a[i]) : v; };
// Mission/reward icons are modern icons in a coloured tile (icons.js); game art like the chest stays a picture.
const icon = i => /^[a-z]+$/.test(i) && !ICONS[i] ? `<img class="ico" src="${i}.webp" alt="">` : `<span class="ico">${ic(i)}</span>`;
const star = '<img class="s" src="star.webp" alt="">';
const pagesText = n => lang() === 'ar' ? (n === 1 ? 'صفحة واحدة' : n === 2 ? 'صفحتان' : n <= 10 ? `${n} صفحات` : `${n} صفحة`) : n === 1 ? '1 page' : `${n} pages`;
// The animated hero: the full-body picture (cape included) plus CSS moves and sparkles. mood = happy | cheer | sad
const hero = (mood, cls = '', style = '') => `<div class="hero3d ${mood} ${cls}" style="${style}">${window.Extras ? Extras.decor() : ''}<img class="body" src="hero-body.webp" alt=""><span class="fx"></span></div>`; // decor: dress-up (extras.js)
const avatar = k => `<b class="av" style="--k:${KID_COLORS[(k.id - 1) % KID_COLORS.length]}">${esc([...k.name][0] || '?')}</b>`;

function save() {
  localStorage.setItem(KEY, JSON.stringify(db));
  if (window.Extras) Extras.saved(); // home-screen widget
  if (!window.Android) return;
  // Tell the phone whether a reminder is still needed today, and when to send it.
  // A failure here must never block the tap that triggered the save.
  try {
    const d = today(), [h, m] = db.reminder.time.split(':').map(Number);
    Android.status(db.kids.every(k => handledToday(k, d)) ? d : '');
    Android.reminder(db.reminder.on, h, m, t('remTitle'), t('remText', db.kids.map(k => k.name).join(t('sep'))));
  } catch (e) { console.warn('reminder sync failed', e); }
}

let ac;
function tune(notes) { // tiny synth, no audio files
  try {
    ac = ac || new AudioContext();
    notes.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain(), at = ac.currentTime + i * .1;
      o.type = 'triangle'; o.frequency.value = f; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(.18, at); g.gain.exponentialRampToValueAtTime(.001, at + .3);
      o.start(at); o.stop(at + .32);
    });
  } catch (e) { /* no sound is fine */ }
}

// ---------- child screens ----------
// Status pill on a mission card: to do -> waiting for parent -> done (or missed).
const STATUS = { todo: ['play', 'todoL'], pending: ['wait', 'waiting'], done: ['done', 'done'], missed: ['missed', 'missedL'] };
const status = s => `<span class="status ${s}">${ic(STATUS[s][0])}${t(STATUS[s][1])}</span>`;

// What the child sees on a mission: "up to 5 stars" until the parent rates it, then the stars they got.
const chip = (task, day) => {
  const r = day[task.id] === 'done' && day['s' + task.id];
  return r ? `<span class="chip rated" dir="ltr" aria-label="${t('rated', r)}">${Array.from({ length: RATING }, (_, k) => `<img class="s ${k < r ? '' : 'off'}" src="star.webp" alt="">`).join('')}</span>`
    : `<span class="chip">${star} ${t('upTo')}</span>`;
};

// A mission card: icon, title, status, reward, then what the child can do now (Start / Complete / Undo, or tick prayers).
function mission(task, i, day) {
  const s = day[task.id] || 'todo', prayer = task.type === 'prayer', ps = day['p' + task.id] || [];
  const note = prayer ? (s === 'todo' && !ps.some(Boolean) ? t('tapPrayers') : t('prayersOf', ps.filter(Boolean).length))
    : [task.pages > 0 ? pagesText(task.pages) : '', task.target].filter(Boolean).map(esc).join(' · ');
  const acts = prayer
    ? `<div class="pr">${t('prayers').map((n, k) => `<button class="${ps[k] ? 'on' : ''}" data-a="pray" data-id="${task.id}" data-k="${k}" ${s === 'done' || s === 'missed' ? 'disabled' : ''}>
        ${ic(ps[k] ? 'check' : PRAYER_ICONS[k])}<small>${n}</small></button>`).join('')}</div>`
    : s === 'todo' ? `<div class="acts">${guarded(task) && (!window.Study || Study.useGuard()) ? `<button class="act start" data-a="guard" data-id="${task.id}">${ic('camera')}${t('start')}</button>` : window.Study ? Study.startBtn(task) : ''}
        <button class="act go" data-a="mark" data-id="${task.id}">${ic('check')}${t('complete')}</button></div>`
    : s === 'pending' ? `<div class="acts wait"><small>${t('waitNote')}</small><button class="act undo" data-a="mark" data-id="${task.id}">${ic('undo')}${t('undo')}</button></div>`
    : '';
  return `<div class="mission c${i % 6} ${s}" style="--i:${i}">
    <div class="mhead">${icon(task.icon)}
      <span class="txt"><b>${esc(task.title)}</b>${note ? `<small>${note}</small>` : ''}</span>
      ${status(s)}${window.Plus ? Plus.sayBtn(task.title) : ''}</div>
    <div class="mfoot">${chip(task, day)}</div>
    ${acts}
  </div>`;
}
// Focus Guard (monitor.js) is offered for Quran and homework-type missions.
const guarded = x => window.Guard && (Guard.canQuran(x) || ['homework', '📚', '🧮'].includes(x.icon));

function oopsText() {
  const c = st.consequence;
  return `<b>${t('oops')}</b><p>${t('missed', esc([...new Set(c.titles)].join(t('sep'))))}</p>
    ${c.lost ? `<p>${t('lost', c.lost)}</p>` : ''}${c.text ? `<p class="cons">${esc(c.text)}</p>` : ''}<small>${t('fix')}</small>`;
}

const quranCard = () => !st.tasks.some(x => x.pages > 0) ? '' : `<div class="qcard">
  ${icon('quran')}<div><b>${t('qJourney')}</b>
  <div class="bar"><i style="width:${st.quran.page / QURAN_PAGES * 100}%"></i></div>
  <small>${t('pageOf', st.quran.page, QURAN_PAGES)}</small></div>
  ${st.quran.khatmas ? `<span class="badge">${ic('trophy')} ${t('khatmas', st.quran.khatmas)}</span>` : ''}</div>`;

function home() {
  const d = today(), due = dueTasks(st, d), day = st.days[d] || {};
  const n = due.filter(x => full(st, d, x)).length, all = due.length > 0 && n === due.length;
  return `<div class="scroll homev">
  <header class="sky">
    <i class="cloud k1"></i><i class="cloud k2"></i><i class="cloud k3"></i>
    <div class="top"><div><h1>${t('hi', esc(st.name))}</h1><p>${t(all ? 'allDone' : st.consequence ? 'sorry' : 'ready')}</p></div>
      <div class="tops">${db.kids.length > 1 ? `<button class="round" data-a="picker" aria-label="${t('who')}">${avatar(st)}</button>` : ''}
      ${window.Badges ? `<button class="round medal" data-a="album" aria-label="${t('album')}">${ic('medal')}</button>` : ''}
      <button class="round" data-a="lock" aria-label="${t('parent')}">${SVG.lock}</button></div></div>
    <div class="hero">
      <div class="mascot">${hero(st.consequence ? 'sad' : all ? 'cheer' : 'happy')}</div>
      <div class="stat">
        <small>${t('stars')}</small>
        <div class="big"><img class="spin" src="star.webp" alt=""><b>${st.stars}</b></div>
        <div class="bar"><i style="width:${due.length ? n / due.length * 100 : 0}%"></i></div>
        <small>${t('progress', n, due.length)}</small>
        <div class="fire">${ic('fire')} ${t('streak', st.streak)}</div>
      </div>
    </div>
  </header>
  <main class="sheet">
    ${window.Extras ? Extras.homeTop() : ''}
    ${window.More ? More.homeTop() : ''}
    ${window.Plus ? Plus.homeTop() : ''}
    ${st.consequence ? `<div class="oops">${hero('sad')}<div>${oopsText()}</div></div>` : ''}
    <h2>${t('today')}</h2>
    ${due.length ? due.map((x, i) => mission(x, i, day)).join('') : `<div class="empty">${t('rest')}</div>`}
    ${quranCard()}
    ${window.More ? More.homeCards() : ''}
    ${window.Extras ? Extras.homeDeeds() : ''}
  </main></div>`;
}

// ---------- journey: 3 planets x 30 days, a treasure every 7 days ----------
const PLANET_LOOK = [
  { name: ['Green World', 'العالم الأخضر'], g: ['#8BE36A', '#3FAE3A'], dark: '#2C8A3A', road: '#F3D9A0', edge: '#B98A4C', deco: 'tree', glow: '#9BF08A' },
  { name: ['Jungle Safari', 'غابة السفاري'], g: ['#7FE07A', '#1FA36A'], dark: '#146B47', road: '#F3D9A0', edge: '#B98A4C', deco: 'tree', glow: '#9BF08A' },
  { name: ['Alien Planet', 'كوكب الفضائيين'], g: ['#E3B8FF', '#9B6BF2'], dark: '#5B33B8', road: '#F1E9FF', edge: '#8E7CD9', deco: 'tree', glow: '#D9B8FF' },
];
const planetName = k => PLANET_LOOK[k].name[lang() === 'ar' ? 1 : 0];
const W = 400, H = 2133; // SVG world size (= 3 painted tiles of 400x711); nodes are placed in % of it
const PAINTED = { 0: 'green-map', 1: 'jungle-map', 2: 'alien-map' }; // painted map images (400x2133 shape); a planet without one is drawn in SVG
const NODE_AT = i => [Math.round(200 + 112 * Math.sin(i * .62 + .4)), Math.round(H - 130 - i * (H - 470) / (PLANET_DAYS - 1))]; // day i+1
const rnd = seed => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; // repeatable "random" scenery
const smooth = pts => pts.map((q, i) => {
  if (!i) return `M${q}`;
  const a = pts[i - 2] || pts[i - 1], b = pts[i - 1], c = pts[i + 1] || q, f = n => Math.round(n * 10) / 10;
  return `C${f(b[0] + (q[0] - a[0]) / 6)},${f(b[1] + (q[1] - a[1]) / 6)} ${f(q[0] - (c[0] - b[0]) / 6)},${f(q[1] - (c[1] - b[1]) / 6)} ${q}`;
}).join(' ');
const DECO = {
  tree: L => `<ellipse cy="20" rx="20" ry="6" fill="#000" opacity=".15"/><rect x="-4" y="0" width="8" height="20" rx="3" fill="#8B5A2B"/><circle cy="-8" r="20" fill="${L.dark}"/><circle cx="-7" cy="-14" r="12" fill="${L.g[0]}"/><circle cx="8" cy="-4" r="7" fill="${L.g[0]}" opacity=".7"/>`,
  cactus: L => `<ellipse cy="16" rx="18" ry="5" fill="#000" opacity=".15"/><rect x="-7" y="-30" width="14" height="46" rx="7" fill="#3FA34D"/><rect x="-21" y="-16" width="9" height="20" rx="4.5" fill="#3FA34D"/><rect x="-21" y="-2" width="16" height="7" rx="3.5" fill="#3FA34D"/><rect x="12" y="-24" width="9" height="18" rx="4.5" fill="#3FA34D"/><rect x="5" y="-10" width="16" height="7" rx="3.5" fill="#3FA34D"/><rect x="-3" y="-26" width="3" height="38" rx="1.5" fill="#7BD38A" opacity=".7"/><circle cy="-31" r="4" fill="#FF6FA8"/>`,
  crystal: L => `<ellipse cy="12" rx="20" ry="5" fill="#000" opacity=".12"/><polygon points="0,-38 13,-8 7,12 -7,12 -13,-8" fill="#B79CFF"/><polygon class="gl" points="0,-38 13,-8 0,-2" fill="#fff" opacity=".55"/><polygon points="16,-18 24,-2 20,12 12,12 9,-2" fill="#7FD0FF"/><polygon class="gl" points="16,-18 24,-2 16,0" fill="#fff" opacity=".5"/>`,
};

// Alien Planet: little flying saucers crossing the sky, twinkling stars and rising bubbles.
const aliens = r => {
  const ufos = [[40, 0, '#FF8FC8'], [150, 7, '#7FE3FF'], [260, 14, '#B6FF7A']].map(([y, d, c]) => `<g transform="translate(-50 ${y})"><g class="bird" style="animation-delay:-${d}s;animation-duration:16s"><g class="ufo">
    <ellipse cy="-5" rx="9" ry="7" fill="#BFF4FF" opacity=".9"/><ellipse rx="19" ry="6" fill="#C9D3E6"/><ellipse rx="19" ry="2.5" cy="1.5" fill="${c}"/>
    ${[-11, 0, 11].map((x, i) => `<circle class="tw" cx="${x}" cy="1.5" r="1.8" fill="#FFF59A" style="animation-delay:-${i * .3}s;animation-duration:.9s"/>`).join('')}</g></g></g>`).join('');
  const stars = Array.from({ length: 24 }, () => `<circle class="tw" cx="${(r() * W) | 0}" cy="${(r() * 260) | 0}" r="${(1 + r() * 1.6).toFixed(1)}" fill="#fff" style="animation-delay:-${(r() * 3).toFixed(1)}s"/>`).join('');
  const bubbles = Array.from({ length: 16 }, (_, i) => `<circle class="bub" cx="${(30 + r() * 340) | 0}" cy="${(500 + i * 100 + r() * 60) | 0}" r="${(3 + r() * 5).toFixed(1)}" fill="#BFF4FF" fill-opacity=".35" stroke="#fff" stroke-opacity=".8" stroke-width="1" style="animation-delay:-${(r() * 6).toFixed(1)}s;animation-duration:${(5 + r() * 4).toFixed(1)}s"/>`).join('');
  return stars + ufos + bubbles;
};

// Living things on a painted map: birds (parrots in the jungle) crossing the sky and butterflies over the grass.
const life = (r, k) => {
  if (k === 2) return aliens(r);
  const birds = [[30, 0], [190, 9]].map(([y, d]) => `<g transform="translate(-40 ${y + 60})"><g class="bird" style="animation-delay:-${d}s">${[0, 18, 30].map((x, i) => `<path class="wing" style="animation-delay:-${i * .2}s" d="M${x} ${i * 7} q6 -6 12 0 q6 -6 12 0" fill="none" stroke="${k === 1 ? ['#E8452C', '#1E8FF0', '#FFB400'][i] : '#3B3355'}" stroke-width="${k === 1 ? 3 : 2.4}" stroke-linecap="round"/>`).join('')}</g></g>`).join('');
  const flies = Array.from({ length: 9 }, (_, i) => {
    const c = ['#FF7AB6', '#FFD23F', '#7FD0FF', '#B58BFF'][i % 4], x = (40 + r() * 320) | 0, y = (420 + i * 190 + r() * 80) | 0;
    return `<g transform="translate(${x} ${y})"><g class="fly" style="animation-delay:-${(r() * 8).toFixed(1)}s"><g class="flap" style="animation-delay:-${(r()).toFixed(2)}s"><ellipse cx="-5" rx="5.5" ry="7" fill="${c}"/><ellipse cx="5" rx="5.5" ry="7" fill="${c}"/><rect x="-1" y="-6" width="2" height="12" rx="1" fill="#3B3355"/></g></g></g>`;
  }).join('');
  return birds + flies;
};

function planetSvg(k, done) {
  const L = PLANET_LOOK[k], r = rnd(97 + k * 31), pts = Array.from({ length: PLANET_DAYS }, (_, i) => NODE_AT(i));
  const others = [0, 1, 2].filter(x => x !== k);
  const orb = (x, y, rad, j) => `<g transform="translate(${x} ${y})"><g class="bob" style="animation-delay:-${j * 2}s"><circle r="${rad}" fill="url(#o${j})"/>${j === 1 ? `<ellipse rx="${rad * 1.7}" ry="${rad * .45}" fill="none" stroke="#FFE3A8" stroke-width="3" opacity=".8" transform="rotate(-18)"/>` : ''}</g></g>`;
  const stars = Array.from({ length: 46 }, () => `<circle cx="${(r() * W) | 0}" cy="${(r() * 300) | 0}" r="${(r() * 1.6 + .4).toFixed(1)}" fill="#fff" opacity="${(r() * .6 + .3).toFixed(2)}" class="tw" style="animation-delay:-${(r() * 3).toFixed(1)}s;animation-duration:${(1.6 + r() * 2.4).toFixed(1)}s"/>`).join('');
  // things that move: fireflies on the green planet, blowing sand on the desert, snow on the crystal one
  const parts = Array.from({ length: 34 }, () => `<circle class="pt ${L.deco}" cx="${(r() * W) | 0}" cy="${(380 + r() * (H - 420)) | 0}" r="${(1.5 + r() * 2.5).toFixed(1)}" style="animation-delay:-${(r() * 6).toFixed(1)}s;animation-duration:${(3.5 + r() * 4).toFixed(1)}s"/>`).join('');
  const cloud = (x, y, sc, d) => `<g transform="translate(${x} ${y}) scale(${sc})"><g class="drift" style="animation-delay:-${d}s"><ellipse rx="34" ry="11" fill="#fff" opacity=".75"/><circle cx="-10" cy="-8" r="13" fill="#fff" opacity=".75"/><circle cx="10" cy="-11" r="16" fill="#fff" opacity=".75"/></g></g>`;
  let deco = '';
  for (let y = 380, side = 0; y < H - 40; y += 64 + r() * 30, side ^= 1) {
    const x = side ? 330 + r() * 50 : 18 + r() * 50, sc = (.8 + r() * .5).toFixed(2);
    deco += `<g transform="translate(${x | 0} ${y | 0}) scale(${sc})"><g class="sway" style="animation-delay:-${(r() * 3).toFixed(1)}s">${DECO[L.deco](L)}</g></g>`;
    if (r() < .55) deco += `<ellipse cx="${(side ? 18 + r() * 40 : 340 + r() * 40) | 0}" cy="${(y + 30) | 0}" rx="${(10 + r() * 14) | 0}" ry="${(4 + r() * 4) | 0}" fill="${L.dark}" opacity=".25"/>`;
  }
  const road = smooth(pts);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1140"/><stop offset="1" stop-color="#2B2178"/></linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L.g[0]}"/><stop offset=".5" stop-color="${L.g[1]}"/><stop offset="1" stop-color="${L.dark}"/></linearGradient>
      ${PLANET_LOOK.map((P, j) => `<radialGradient id="o${j}" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="${P.g[0]}"/><stop offset=".7" stop-color="${P.g[1]}"/><stop offset="1" stop-color="${P.dark}"/></radialGradient>`).join('')}
    </defs>
    ${PAINTED[k] ? `${k === 2 ? '' : cloud(70, 70, .9, 8) + cloud(280, 120, .7, 26)}${life(r, k)}` : `
    <rect width="${W}" height="340" fill="url(#sky)"/>${stars}
    <g transform="translate(40 40)"><line class="shoot" x2="46" y2="16" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>
    <g transform="translate(150 20)"><line class="shoot" x2="36" y2="12" stroke="#fff" stroke-width="2" stroke-linecap="round" style="animation-delay:3.5s"/></g>
    ${orb(70, 120, 30, others[0])}${orb(335, 80, 20, others[1])}
    <path d="M-20 360 Q200 190 420 360 L420 ${H} L-20 ${H} Z" fill="url(#ground)"/>
    <path class="glow" d="M-20 360 Q200 190 420 360" fill="none" stroke="${L.glow}" stroke-width="10" opacity=".55"/>
    ${cloud(60, 300, .8, 5)}${cloud(260, 330, .6, 22)}
    ${deco}
    <path d="${road}" fill="none" stroke="${L.edge}" stroke-width="40" stroke-linecap="round"/>
    <path d="${road}" fill="none" stroke="${L.road}" stroke-width="30" stroke-linecap="round"/>
    <path class="flow" d="${road}" fill="none" stroke="${L.edge}" stroke-width="4" stroke-dasharray="2 22" stroke-linecap="round" opacity=".6"/>`}
    ${done ? `<path class="trail" d="${road}" pathLength="${PLANET_DAYS - 1}" fill="none" stroke="#FFD23F" stroke-width="12" stroke-linecap="round" stroke-dasharray="${done} 999" style="--n:${done}"/>` : ''}
    ${parts}
  </svg>`;
}

function journey() {
  const pos = journeyPos(st.steps), k = ui.world ?? pos.planet;
  const done = k < pos.planet ? PLANET_DAYS : k === pos.planet ? pos.day : 0, locked = k > pos.planet;
  const pct = ([x, y]) => `left:${x / W * 100}%;top:${y / H * 100}%`;
  const next = (Math.floor(done / PRIZE_EVERY) + 1) * PRIZE_EVERY;
  const goal = next >= PLANET_DAYS ? PLANET_DAYS : next; // after the last chest (day 28) the next goal is the trophy on day 30
  const nodes = Array.from({ length: PLANET_DAYS }, (_, i) => {
    const day = i + 1, at = NODE_AT(i), state = (day <= done ? 'done' : day === done + 1 && !locked ? 'now' : '') + (day === goal && !locked && day > done ? ' next' : '');
    if (day === PLANET_DAYS) return `<div class="node goal ${state}" style="${pct(at)};--i:${i}">${ic('trophy')}</div>`;
    if (day % PRIZE_EVERY === 0) return `<div class="prize ${state}" style="${pct(at)};--i:${i}"><img src="chest.webp" alt="">${state.startsWith('done') ? `<i>${ic('check')}</i>` : ''}<b>${day}</b></div>`;
    return `<div class="node ${state}" style="${pct(at)};--i:${i}"><b>${day}</b>${state.startsWith('done') ? star : ''}</div>`;
  }).join('');
  const nowAt = !locked && done < PLANET_DAYS ? NODE_AT(done) : null;
  const hint = locked ? `${ic('lock')}<span>${t('locked', planetName(k - 1))}</span>`
    : done >= PLANET_DAYS ? `${ic('trophy')}<span>${t('planetComplete')}</span>`
    : `${goal === PLANET_DAYS ? ic('trophy') : icon('chest')}<span><small>${t('dayOf', done, PLANET_DAYS)}</small>${t((goal === PLANET_DAYS ? 'toGoal' : 'toPrize') + (goal - done === 1 ? '1' : goal - done === 2 ? '2' : ''), goal - done)}</span>`;
  // the hint is a small bubble on the road: next to today's step, the trophy (planet done) or day 1 (locked)
  const tipAt = locked ? NODE_AT(0) : NODE_AT(Math.min(done, PLANET_DAYS - 1));
  // the three planets float in the sky at the end of the road; tap one to open it
  const gates = PLANET_LOOK.map((P, j) => `<button class="gate ${j === k ? 'on' : ''} ${j > pos.planet ? 'locked' : ''}" data-a="world" data-id="${j}" style="left:${[20, 50, 80][j]}%;--d:-${j * .9}s">
      <i class="orb p${j}"></i>${j > pos.planet ? `<em>${ic('lock')}</em>` : ''}<b>${P.name[lang() === 'ar' ? 1 : 0]}</b></button>`).join('');
  return `<div class="scroll space">
    <div class="world ${locked ? 'locked' : ''} ${PAINTED[k] ? 'painted' : ''}">${PAINTED[k] ? `<img class="paint" src="${PAINTED[k]}.webp" alt="">` : ''}${planetSvg(k, Math.min(done, PLANET_DAYS - 1))}${nodes}
      ${nowAt ? hero('happy', 'walker', pct(nowAt)) : ''}
      <div class="roadtip ${tipAt[0] > 200 ? 'l' : 'r'}" style="${pct(tipAt)}">${hint}</div>
      <div class="gates">${gates}</div>
    </div>
  </div>
  <div class="jtop">
    ${window.Ambience ? `<button class="sndbtn" data-a="snd" aria-label="sound">${Ambience.muted() ? '🔇' : '🔊'}</button>` : '<i></i>'}
    ${window.Plus ? Plus.storyBtn() : ''}
    ${pos.round ? `<div class="roundtag">${t('round', pos.round + 1)}</div>` : ''}
    <div class="pill">${star}<b>${st.stars}</b></div>
  </div>`;
}

function rewards() {
  const got = st.requests.filter(q => q.status === 'granted').slice(-6).reverse();
  return `<div class="scroll shop">
    <header class="shophead"><div><h1>${t('shop')}</h1><p>${t('shopSub')}</p></div><div class="pill">${star}<b>${st.stars}</b></div></header>
    <div class="grid">${st.rewards.map((r, i) => {
      const asked = st.requests.some(q => q.rewardId === r.id && q.status === 'pending'), can = st.stars >= r.cost;
      return `<div class="reward c${(i + 1) % 6}" style="--i:${i}">
        <div class="tile">${icon(r.icon)}</div><b>${esc(r.title)}</b>
        <div class="costbar"><i style="width:${asked ? 100 : Math.min(100, st.stars / r.cost * 100)}%"></i><span>${r.cost} ${star}</span></div>
        <button class="btn ${asked ? 'wait' : can ? 'go' : 'off'}" data-a="ask" data-id="${r.id}" ${asked || !can ? 'disabled' : ''}>
          ${asked ? ic('wait') + ' ' + t('asked') : can ? t('ask') : t('need', r.cost - st.stars) + ' ' + star}</button>
      </div>`;
    }).join('') || `<div class="empty">${t('noRewards')}</div>`}</div>
    ${got.length ? `<h2>${t('myRewards')}</h2><div class="got">${got.map(q => `<span>${icon(q.icon)} ${esc(q.title)}</span>`).join('')}</div>` : ''}
    ${window.More ? More.jar() : ''}
    ${window.Plus ? Plus.rewards() : ''}
    ${window.Extras ? Extras.shop() : ''}
  </div>`;
}

const tabs = () => `<nav class="tabs">${['home', 'journey', 'rewards', ...(window.Games ? ['games'] : []), 'videos'].map(k =>
  `<button class="${ui.tab === k ? 'on' : ''}" data-a="tab" data-id="${k}">${SVG[k]}<span>${t(k)}</span></button>`).join('')}</nav>`;

function party() {
  const p = ui.parties[st.id], conf = Array.from({ length: 46 }, (_, i) =>
    `<i style="left:${Math.random() * 100}%;--c:${['#FFD23F', '#FF5D8F', '#3EC1FF', '#7BE052', '#B07CFF', '#FF9838'][i % 6]};--d:${(Math.random() * 1.2).toFixed(2)}s;--r:${Math.random() * 720 | 0}deg"></i>`).join('');
  return `<div class="overlay party"><div class="confetti">${conf}</div>
    <div class="pop"><div class="rays"></div>${p.khatma || p.chest ? `<img class="jump" src="${p.khatma ? 'quran' : 'chest'}.webp" alt="">` : hero('cheer', 'jump')}
      <h1>${t('great')}</h1>
      ${p.stars ? `<p class="gain">${t('earned', p.stars)} ${star}</p>` : ''}
      ${p.complete ? `<p>🔥 ${t('dayDone', st.streak)}</p>` : ''}
      ${p.khatma ? `<p>🏆 ${t('khatma', p.khatma)}</p>` : ''}
      ${p.planet ? `<p>🪐 ${t('planetDone', planetName(p.planet.done), p.planet.bonus)}</p>` : ''}
      ${p.chest ? `<p>${t('chest', p.chest)}</p>` : ''}
      ${p.gifts.map(g => `<p>🎉 ${t('gift', esc(g))}</p>`).join('')}
      <button class="btn go" data-a="${p.chest ? 'toShop' : 'closeParty'}">${t('yay')}</button></div></div>`;
}

const oops = () => `<div class="overlay sadbg"><div class="pop">${hero('sad', 'droop')}${oopsText()}
  <button class="btn go" data-a="closeOops">${t('ok')}</button></div></div>`;

// Kid switcher, sorted by stars for a little friendly competition.
const picker = () => `<div class="overlay" data-a="closePicker"><div class="pop who"><h2>${t('who')}</h2>
  ${db.kids.map((k, i) => [k, i]).sort((a, b) => b[0].stars - a[0].stars).map(([k, i], r) => `<button class="kid ${i === db.cur ? 'on' : ''}" data-a="pick" data-id="${i}">
    ${avatar(k)}<span class="txt"><b>${esc(k.name)}</b><small>${ic('fire')} ${t('streak', k.streak)}</small></span>
    <span class="medal">${['🥇', '🥈', '🥉'][r] || ''}</span><span class="pill">${star}<b>${k.stars}</b></span></button>`).join('')}</div></div>`;

// ---------- parent screens ----------
function pinpad() {
  return `<div class="overlay pinbg"><div class="pop ${ui.shake ? 'shake' : ''}"><h2>${t('pinAsk')}</h2>
    <div class="dots">${[0, 1, 2, 3].map(i => `<i class="${i < ui.pin.length ? 'f' : ''}"></i>`).join('')}</div>
    <div class="keys" dir="ltr">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-a="key" data-id="${n}">${n}</button>`).join('')}
      <button data-a="pinClose" class="soft">${SVG.x}</button><button data-a="key" data-id="0">0</button><button data-a="key" data-id="del" class="soft">⌫</button></div></div></div>`;
}

const field = (label, f, val, attrs = '') => `<label><span>${label}</span><input data-f="${f}" value="${esc(val)}" ${attrs}></label>`;
const num = (label, f, val, min, max) => field(label, f, val, `type="number" inputmode="numeric" min="${min}" max="${max}"`);
const select = (f, val, opts) => `<select data-f="${f}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${v === val ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
const dayName = day => day === today() ? t('todayW') : parse(day).toLocaleDateString(lang(), { weekday: 'long', day: 'numeric', month: 'short' });

function pApprove() {
  const pend = pending(st), reqs = st.requests.filter(q => q.status === 'pending');
  const xrows = window.Extras ? Extras.approveRows() : ''; // good deeds and fasting (extras.js)
  return `${window.Plus ? Plus.approveRows() : ''}${!pend.length && !reqs.length && !xrows ? `<div class="empty">${t('nothing')}</div>` : ''}
    ${pend.length ? `<h3>${t('toApprove')}</h3>` + pend.map(({ day, task }) => {
      const g = (st.days[day] || {})['g' + task.id];
      const extra = task.type === 'prayer' ? t('prayersOf', prayed(st, day, task.id)) : [task.pages > 0 ? pagesText(task.pages) : '', task.target, g ? Guard.summary(g, lang()) : ''].filter(Boolean).map(esc).join(' · ');
      return `<div class="row pend">${icon(task.icon)}
      <span class="txt"><b>${esc(task.title)}</b><small>${dayName(day)}${extra ? ' · ' + extra : ''}</small></span>
      ${window.Extras ? Extras.photoTag(day, task) : ''}
      <button class="no" data-a="reject" data-id="${task.id}" data-day="${day}" aria-label="${t('notNow')}">${SVG.x}</button>
      <small class="rateq">${t('rateQ')}</small>
      <span class="rate" dir="ltr">${Array.from({ length: RATING }, (_, k) => `<button data-a="approve" data-id="${task.id}" data-day="${day}" data-r="${k + 1}" aria-label="${t('rated', k + 1)}">
        <span>${star.repeat(k + 1)}</span><b>${k + 1}</b></button>`).join('')}</span></div>`;
    }).join('') : ''}
    ${xrows ? (pend.length ? '' : `<h3>${t('toApprove')}</h3>`) + xrows : ''}
    ${reqs.length ? `<h3>${t('reqs')}</h3>` + reqs.map(q => `<div class="row">${icon(q.icon)}
      <span class="txt"><b>${esc(q.title)}</b><small>${q.cost}⭐</small></span>
      <button class="yes wide" data-a="grant" data-id="${q.id}">${t('give')}</button>
      <button class="no wide" data-a="decline" data-id="${q.id}">${t('notNow')}</button></div>`).join('') : ''}
    ${st.consequence ? `<h3>${t('active')}</h3><div class="row"><span class="txt"><b>${esc(st.consequence.text || t('oops'))}</b>
      <small>${esc([...new Set(st.consequence.titles)].join(t('sep')))} · −${st.consequence.lost}⭐</small></span>
      <button class="no wide" data-a="clearCons">${t('clear')}</button></div>` : ''}
    <h3>${t('adjust')}</h3><div class="row adj"><small>${t('adjustSub', st.stars)}</small>
      <div>${[-5, -1, 1, 5].map(n => `<button class="${n < 0 ? 'no' : 'yes'} wide" data-a="adj" data-id="${n}">${n > 0 ? '+' : ''}${n}</button>`).join('')}</div></div>`;
}

function pTasks() {
  const icons = TASK_ICONS.map(i => [i, T[lang()][i] || i]);
  return st.tasks.map(x => `<div class="edit"><div class="line">${select(`task.${x.id}.icon`, x.icon, icons)}${field(t('title'), `task.${x.id}.title`, x.title, 'maxlength="30"')}</div>
    ${x.type === 'prayer' ? `<small class="hintx">${t('prayers').join(t('sep'))}</small>` : field(t('target'), `task.${x.id}.target`, x.target, 'maxlength="40"')}
    ${x.icon === 'quran' ? num(t('pagesDay'), `task.${x.id}.pages`, x.pages || 0, 0, 604) : ''}
    ${window.Study ? Study.minsField(x) : ''}
    <div class="line">
      <div class="week">${t('days').map((n, i) => `<button class="${x.days.includes(i) ? 'on' : ''}" data-a="day" data-id="${x.id}" data-d="${i}">${n}</button>`).join('')}</div></div>
    <button class="link" data-a="delTask" data-id="${x.id}">${t('del')}</button></div>`).join('') +
    `<button class="add" data-a="addTask">${t('addTask')}</button>` +
    (st.tasks.some(x => x.type === 'prayer') ? '' : `<button class="add" data-a="addPrayer">${t('addPrayer')}</button>`) +
    (window.Plus ? Plus.tests() : ''); // school tests (plus.js)
}

function pRewards() {
  const icons = REWARD_ICONS.map(i => [i, i]);
  return st.rewards.map(r => `<div class="edit"><div class="line">${select(`reward.${r.id}.icon`, r.icon, icons)}${field(t('title'), `reward.${r.id}.title`, r.title, 'maxlength="30"')}</div>
    <div class="line">${num(t('cost'), `reward.${r.id}.cost`, r.cost, 1, 9999)}</div>
    <button class="link" data-a="delReward" data-id="${r.id}">${t('del')}</button></div>`).join('') +
    `<button class="add" data-a="addReward">${t('addReward')}</button>`;
}

function pReport() {
  const r = report(st, today());
  const cell = c => c.s === 'off' ? '' : c.n !== null && c.n && c.n < PRAYERS && c.s !== 'missed' ? `<em>${c.n}/5</em>`
    : { done: '✅', missed: '❌', pending: '⏳', todo: '·' }[c.s];
  return `${window.Share ? `<button class="btn sharebtn" data-a="shareReport">${ic('share')} ${t('shareRep')}</button>` : ''}${window.Extras ? Extras.certButton() : ''}${window.More ? More.report() : ''}<h3>${t('week')}</h3>
    <div class="tiles">
      <div><b dir="ltr">${r.full}/7</b><small>${t('fullDays')}</small></div>
      <div class="up"><b dir="ltr">${r.plus ? '+' + r.plus : 0}</b><small>${t('earnedW')}</small></div>
      <div class="down"><b dir="ltr">${r.minus ? '−' + r.minus : 0}</b><small>${t('lostW')}</small></div>
      ${st.tasks.some(x => x.pages > 0) ? `<div><b>${r.pages}</b><small>${t('pagesW')}</small></div>` : ''}
      ${st.tasks.some(x => x.type === 'prayer') ? `<div><b dir="ltr">${r.prayers}/35</b><small>${t('prayersW')}</small></div>` : ''}
      <div><b>${ic('fire')} ${st.streak}</b><small>${t('streakW')}</small></div>
    </div>
    <div class="table"><table>
      <tr><th></th>${r.days.map(d => `<th>${t('days')[parse(d).getDay()]}<small>${parse(d).getDate()}</small></th>`).join('')}</tr>
      ${r.rows.map(row => `<tr><td>${icon(row.task.icon)}</td>${row.cells.map(c => `<td class="${c.s}">${cell(c)}</td>`).join('')}</tr>`).join('')}
    </table></div>
    ${window.Guard ? Guard.report(st, lang()) : ''}
    ${quranCard()}`;
}

function pSettings() {
  let blocked = false;
  try { blocked = db.reminder.on && window.Android && !Android.canNotify(); } catch (e) { /* unknown: don't warn */ }
  return `<h3>${t('children')}</h3><div class="edit">${field(t('childName'), 'st.0.name', st.name, 'maxlength="20"')}
      ${db.kids.length > 1 ? `<button class="link" data-a="delKid">${t('del')} ${esc(st.name)}</button>` : ''}</div>
    <button class="add" data-a="addKid">${t('addKid')}</button>
    <h3>${t('reminder')}</h3><div class="edit"><div class="line">
      <div class="seg grow">${[[true, 'on'], [false, 'off']].map(([v, k]) => `<button class="${db.reminder.on === v ? 'on' : ''}" data-a="rem" data-id="${v}">${t(k)}</button>`).join('')}</div>
      ${field(t('remAt'), 'rem.0.time', db.reminder.time, 'type="time" dir="ltr"')}</div>
      ${blocked ? `<p class="warn">${t('remBlocked')}</p>` : ''}</div>
    ${window.Prayers ? `<h3>${t('prayRem')}</h3><div class="edit"><div class="seg grow">${[[true, 'on'], [false, 'off']].map(([v, k]) => `<button class="${prayerCfg().on === v ? 'on' : ''}" data-a="prayOn" data-id="${v}">${t(k)}</button>`).join('')}</div>
      <label><span>${t('prayCity')}</span>${select('prayer.0.city', prayerCfg().city, Prayers.CITIES.map(c => [c[0], lang() === 'ar' ? c[2] : c[1]]))}</label>
      <small class="hintx">${Prayers.times(prayerCfg().city, new Date()).map((d, k) => `${t('prayers')[k]} ${d.toLocaleTimeString(lang(), { hour: 'numeric', minute: '2-digit' })}`).join(' · ')}</small></div>` : ''}
    <h3>${t('rules')}</h3><div class="edit">${num(t('penStars'), 'pen.0.stars', st.penalty.stars, 0, 99)}
      ${field(t('penText'), 'pen.0.text', st.penalty.text, 'maxlength="60"')}
      ${num(t('chestBonus'), 'st.0.chestBonus', st.chestBonus, 0, 999)}
      ${num(t('planetBonus'), 'st.0.planetBonus', st.planetBonus ?? 30, 0, 9999)}
      ${num(t('khatmaBonus'), 'st.0.khatmaBonus', st.khatmaBonus, 0, 9999)}
      ${num(t('quranNow'), 'quran.0.page', st.quran.page, 0, QURAN_PAGES - 1)}</div>
    <h3>${t('backup')}</h3><div class="edit"><small class="hintx">${t('backupSub')}</small>
      <button class="btn" data-a="backup">💾 ${t('backupBtn')}</button><button class="btn off" data-a="restore">📂 ${t('restoreBtn')}</button></div>
    <h3>${t('lang')} · ${t('newPin')}</h3><div class="edit"><div class="line">
      <label><span>${t('lang')}</span>${select('db.0.lang', db.lang, [['en', 'English'], ['ar', 'العربية']])}</label>
      ${field(t('pin'), 'db.0.pin', db.pin, 'type="tel" inputmode="numeric" maxlength="4" dir="ltr"')}</div></div>
    ${window.Study ? Study.settings() : ''}
    ${window.Plus ? Plus.settings() : ''}
    ${window.More ? More.settings() : ''}
    ${window.Extras ? Extras.settings() : ''}
    <button class="link danger" data-a="reset">${t('reset')}</button>`;
}

function parentZone() {
  const waiting = k => pending(k).length + k.requests.filter(q => q.status === 'pending').length + (window.Extras ? Extras.pendingCount(k) : 0) + (window.Plus ? Plus.pendingCount(k) : 0);
  const body = { approve: pApprove, tasks: pTasks, rewards: pRewards, report: pReport, settings: pSettings }[ui.ptab]();
  return `<div class="parent"><header><h1>${t('parent')}</h1><button class="btn go" data-a="exit">${t('exit')}</button></header>
    ${db.kids.length > 1 ? `<div class="kidbar">${db.kids.map((k, i) => `<button class="${i === db.cur ? 'on' : ''}" data-a="pkid" data-id="${i}">${avatar(k)}<span>${esc(k.name)}</span>${waiting(k) ? `<em>${waiting(k)}</em>` : ''}</button>`).join('')}</div>` : ''}
    <nav>${['approve', 'tasks', 'rewards', 'report', 'settings'].map(k => `<button class="${ui.ptab === k ? 'on' : ''}" data-a="ptab" data-id="${k}">${t(k)}${k === 'approve' && waiting(st) ? `<em>${waiting(st)}</em>` : ''}</button>`).join('')}</nav>
    <div class="scroll">${body}</div></div>`;
}

function onboarding() {
  return `<div class="scroll onboard"><i class="cloud k1"></i><i class="cloud k2"></i>
    <img class="logo" src="logo.webp" alt="${t('app')}"><h1 class="brand">${t('app')}</h1>
    <div class="pop"><h1>${t('welcome')}</h1><p>${t('setup')}</p>
      <div class="seg">${[['en', 'English'], ['ar', 'العربية']].map(([k, l]) => `<button class="${ui.lang === k ? 'on' : ''}" data-a="olang" data-id="${k}">${l}</button>`).join('')}</div>
      <label><span>${t('childName')}</span><input id="oname" maxlength="20"></label>
      <label><span>${t('pin')}</span><input id="opin" type="tel" inputmode="numeric" maxlength="4" dir="ltr"></label>
      <p class="err" id="oerr"></p>
      <button class="btn go" data-a="start">${t('start')}</button></div></div>`;
}

let shown = '';
function render() {
  // Same screen re-rendered (a tap, a digit): keep the scroll position and don't replay entrance animations.
  const unseen = st && st.consequence && !st.consequence.seen;
  const overlay = !db || ui.parent ? '' : ui.pin !== null ? 'pin' : ui.picker ? 'picker' : unseen ? 'oops' : ui.parties[st.id] ? 'party' : '';
  const key = !db ? 'onboard' : ui.parent ? 'parent-' + ui.ptab + db.cur : ui.tab + overlay + db.cur + (ui.tab === 'journey' ? 'w' + ui.world : '');
  const old = app.querySelector('.scroll'), top = old ? old.scrollTop : 0, same = key === shown;
  shown = key;
  app.classList.toggle('still', same);
  document.documentElement.lang = lang();
  document.documentElement.dir = lang() === 'ar' ? 'rtl' : 'ltr';
  app.innerHTML = !db ? onboarding()
    : ui.parent ? parentZone()
    : ({ home, journey, rewards, games: () => Games.page() }[ui.tab]()) + tabs() + (overlay ? { pin: pinpad, picker, oops, party }[overlay]() : '');
  const now = app.querySelector('.scroll');
  if (same && now) now.scrollTop = top;
  if (window.Extras) Extras.after(app); // homework photos, parent voice cheer
  if (window.More) More.after(app); // play-time limit
  if (window.Plus) Plus.after(app); // love note, pet hatching
  // a sticker just earned (badges.js) is celebrated once, on the child's screens with nothing else on top
  if (db && !ui.parent && !overlay && window.Badges) setTimeout(() => Badges.check(st, lang()), 400);
  // planet sounds (ambience.js) only on the Journey tab
  if (window.Ambience) { if (db && !ui.parent && ui.tab === 'journey') Ambience.play(ui.world ?? journeyPos(st.steps).planet); else Ambience.stop(); }
  if (same) return;
  if (now && ui.tab === 'journey') { // show today's step (or the start of a planet)
    const n = app.querySelector('.world .now') || app.querySelector('.world .node');
    if (n) now.scrollTop = n.offsetTop - now.clientHeight / 2;
  }
}

// ---------- actions ----------
const cheer = ev => {
  const p = ui.parties[st.id] || (ui.parties[st.id] = { stars: 0, complete: false, chest: 0, khatma: 0, gifts: [] });
  p.stars += ev.stars || 0; p.complete = p.complete || !!ev.complete; p.chest += ev.chest || 0; p.khatma += ev.khatma || 0;
  if (ev.planet) p.planet = ev.planet;
  if (ev.gift) p.gifts.push(ev.gift);
};
// Ask in the in-app modal (dialog.js), then act, save and redraw. Returns false so the click itself doesn't redraw.
const later = (opts, fn) => { dialog(opts).then(v => { if (!v) return; fn(v); if (db) save(); render(); }); return false; };
const drop = (list, id, msg) => later({ icon: 'missed', text: msg, ok: t('del'), danger: true }, () => { st[list] = st[list].filter(x => x.id !== id); });
const pick = i => { db.cur = +i; use(); };

const actions = {
  tab: id => {
    if (id === 'videos') { try { sessionStorage.setItem('sh-nosplash', '1'); } catch (e) { /* */ } save(); location.href = 'videos.html'; return false; } // its own page (videos.js)
    ui.tab = id; ui.world = null;
  },
  world: id => { ui.world = +id; },
  snd: () => { Ambience.toggle(); },
  mark: id => {
    mark(st, today(), +id); tune([660]);
    if ((st.days[today()] || {})[id] === 'pending' && window.celebrate) celebrate(); // Complete (not Undo): cheer + vibrate (celebrate.js)
  },
  album: () => { Badges.open(st, lang()); return false; },
  shareReport: () => { Share.report(st, lang()); return false; },
  prayOn: id => { db.prayer = Object.assign(prayerCfg(), { on: id === 'true' }); if (db.prayer.on && window.Android) try { Android.askNotify(); } catch (e) { /* old app */ } syncPrayers(); },
  guard: id => { Guard.open(st, st.tasks.find(x => x.id === +id), lang()); return false; },
  pray: (id, el) => { markPrayer(st, today(), +id, +el.dataset.k); tune([523 + 60 * el.dataset.k]); },
  ask: id => { if (requestReward(st, +id, today())) tune([523, 784]); },
  picker: () => ui.picker = true,
  closePicker: (id, el, e) => { if (e.target === el) ui.picker = false; else return false; }, // tap outside the card
  pick: id => { pick(id); ui.picker = false; ui.tab = 'home'; },
  pkid: id => pick(id),
  lock: () => ui.pin = '',
  pinClose: () => ui.pin = null,
  key: id => {
    ui.shake = false;
    ui.pin = id === 'del' ? ui.pin.slice(0, -1) : ui.pin + id;
    if (ui.pin.length < 4) return;
    if (ui.pin === db.pin) { ui.pin = null; ui.parent = true; ui.ptab = 'approve'; } else { ui.pin = ''; ui.shake = true; }
  },
  exit: () => { ui.parent = false; ui.tab = 'home'; if (ui.parties[st.id]) tune([523, 659, 784, 1047]); },
  closeParty: () => { delete ui.parties[st.id]; },
  toShop: () => { delete ui.parties[st.id]; ui.tab = 'rewards'; },
  closeOops: () => { st.consequence.seen = true; },
  ptab: id => ui.ptab = id,
  approve: (id, el) => { const ev = approve(st, el.dataset.day, +id, +el.dataset.r); if (ev) cheer(ev); },
  reject: (id, el) => reject(st, el.dataset.day, +id, today()),
  grant: id => { const q = st.requests.find(q => q.id === +id); answerReward(st, +id, true, today()); cheer({ gift: q.title }); },
  decline: id => answerReward(st, +id, false, today()),
  clearCons: () => { st.consequence = null; },
  adj: id => adjust(st, today(), +id),
  day: (id, el) => { const x = st.tasks.find(x => x.id === +id), d = +el.dataset.d; x.days = x.days.includes(d) ? x.days.filter(n => n !== d) : x.days.concat(d); },
  addTask: () => st.tasks.push({ id: st.nextId++, icon: '📚', title: t('newTask'), target: '', stars: 2, days: [0, 1, 2, 3, 4, 5, 6], since: today() }),
  addPrayer: () => st.tasks.push(prayerTask(st.nextId++, lang() === 'ar', today())),
  addReward: () => st.rewards.push({ id: st.nextId++, icon: '🎁', title: t('newReward'), cost: 50 }),
  delTask: id => drop('tasks', +id, t('sure')),
  delReward: id => drop('rewards', +id, t('sure')),
  addKid: () => later({ icon: 'smiley', title: t('kidName'), input: { max: 20 }, ok: t('start') }, v => {
    const name = v.trim().slice(0, 20);
    if (name) { addKid(db, name, today()); pick(db.kids.length - 1); }
  }),
  delKid: () => later({ icon: 'missed', text: t('delKidSure', st.name), ok: t('del'), danger: true }, () => { db.kids.splice(db.cur, 1); pick(0); }),
  rem: id => {
    db.reminder.on = id === 'true';
    if (db.reminder.on && window.Android) Android.askNotify();
  },
  backup: () => {
    const json = JSON.stringify(db), name = `star-hero-backup-${today()}.json`;
    if (window.Android) Android.backup(json, name);
    else { // plain browser (testing)
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = name; a.click();
    }
    return false;
  },
  restore: () => {
    if (window.Android) Android.restore();
    else { const i = document.createElement('input'); i.type = 'file'; i.accept = '.json,application/json'; i.onchange = () => i.files[0].text().then(onRestoreFile); i.click(); }
    return false;
  },
  reset: () => later({ icon: 'missed', text: t('resetSure'), ok: t('del'), danger: true }, () => { localStorage.removeItem(KEY); db = null; use(); ui.parent = false; }),
  olang: id => ui.lang = id,
  start: () => {
    const name = document.getElementById('oname').value.trim(), pin = document.getElementById('opin').value;
    if (!name || !/^\d{4}$/.test(pin)) { document.getElementById('oerr').textContent = t('bad'); return false; }
    db = newDb(ui.lang); db.pin = pin; addKid(db, name, today()); use();
  },
};
if (window.Games) Games.install(actions); // 2.4: simple and puzzle games, opened with stars
if (window.Extras) Extras.install(actions); // homework photo before Complete, dress-up, good deeds, Ramadan, cheers, backup
if (window.Study) Study.install(actions); // 2.3: study timer with warrior rests
if (window.Plus) Plus.install(actions); // 2.2: pet, routines, tests, read-aloud, stories, ideas, love notes, star statement
if (window.More) More.install(actions); // 2.1: second parent PIN, hifz, quiz, books, jar, mood, make-it-right, play-time limit

// Focus Guard finished well: keep its summary for the parent and send the mission for approval.
window.guardDone = (id, sum) => {
  const d = dayOf(st, today());
  d['g' + id] = sum;
  if (!d[id]) { mark(st, today(), id); if (window.celebrate) celebrate(); }
  save(); render();
};

// Called by the Android side after the file pickers.
const tell = (text, icon) => dialog({ text, icon, cancel: null });
window.onBackupDone = ok => tell(ok ? t('saved') : t('saveFail'), ok ? 'done' : 'missed');
window.onRestoreFile = async text => {
  let data = null;
  try { data = migrate(JSON.parse(text), today()); } catch (e) { /* not JSON */ }
  if (!valid(data)) return tell(t('restoreBad'), 'missed');
  if (!await dialog({ icon: 'missed', text: t('restoreSure'), danger: true })) return;
  db = data; db.cur = 0; use();
  ui.parent = false; ui.tab = 'home'; ui.parties = {};
  db.kids.forEach(k => rollover(k, today()));
  save(); render();
  tell(t('restored'), 'done');
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const keep = { oname: 0, opin: 0 }; // onboarding text survives a language switch
  for (const k in keep) { const i = document.getElementById(k); if (i) keep[k] = i.value; }
  if (actions[el.dataset.a](el.dataset.id, el, e) === false) return;
  if (db) save();
  render();
  for (const k in keep) { const i = document.getElementById(k); if (i && keep[k]) i.value = keep[k]; }
});

// Parent form fields save on change: data-f="kind.id.key"
document.addEventListener('change', e => {
  const el = e.target, f = el.dataset.f;
  if (!f) return;
  const [kind, id, key] = f.split('.');
  const obj = { task: () => st.tasks.find(x => x.id === +id), reward: () => st.rewards.find(x => x.id === +id), pen: () => st.penalty,
    quran: () => st.quran, rem: () => db.reminder, db: () => db, st: () => st, prayer: () => (db.prayer = prayerCfg()) }[kind]();
  let v = el.value.trim();
  if (el.type === 'number') v = Math.min(+el.max, Math.max(+el.min, parseInt(v, 10) || 0));
  const bad = (key === 'pin' && !/^\d{4}$/.test(v)) || ((key === 'title' || key === 'name') && !v) || (key === 'time' && !/^\d\d:\d\d$/.test(v));
  if (!bad) { obj[key] = v; save(); if (kind === 'prayer') syncPrayers(); }
  if (bad || el.tagName === 'SELECT' || el.type === 'number') render(); // show the corrected value / new icon / new language
});

// Android back button (called from MainActivity). true = handled here.
window.onBack = () => {
  if (!db) return false;
  if (ui.pin !== null) ui.pin = null;
  else if (ui.picker) ui.picker = false;
  else if (!ui.parent && st.consequence && !st.consequence.seen) st.consequence.seen = true;
  else if (ui.parties[st.id] && !ui.parent) delete ui.parties[st.id];
  else if (ui.parent) actions.exit();
  else if (ui.tab !== 'home') ui.tab = 'home';
  else return false;
  save(); render();
  return true;
};

// Prayer reminders (prayers.js): settings live in db.prayer; Android gets the next week of adhan times.
const prayerCfg = () => Object.assign({ on: false, city: 'cairo' }, db.prayer);
// T[...].prayTitle raw: its {0} is the prayer name, filled in per adhan by prayers.js (t() would fill it with nothing).
const syncPrayers = () => { if (window.Prayers && db) Prayers.sync(prayerCfg(), t('prayers'), T[lang()].prayTitle, t('prayText', db.kids.map(k => k.name).join(t('sep')))); };

function wake() { // on start and every time the app comes back to the screen
  if (db) { db.kids.forEach(k => rollover(k, today())); save(); syncPrayers(); } // tops up next week's adhan alarms
  if (st && st.consequence && !st.consequence.seen) tune([330, 262]);
  if (!document.activeElement || !document.activeElement.dataset.f) render(); // don't steal a field the parent is typing in
}
document.addEventListener('visibilitychange', () => document.hidden || wake());
wake();
