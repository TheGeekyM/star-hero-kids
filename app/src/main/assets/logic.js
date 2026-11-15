// Pure game rules. No DOM here, so `node logic.js` runs the self-check at the bottom.
// Saved data ("db"): { v: 2, lang, pin, cur, nextKid, reminder, kids: [kid, ...] }. Each kid has its own missions, rewards and stars.
// Journey: every full day is one step. 3 planets x 30 days, a treasure chest every 7 days on each planet.
const PLANETS = 3, PLANET_DAYS = 30, PRIZE_EVERY = 7;
// Where a number of steps puts the child: planet 0..2, day 0..29 done on it, round (after all 3 planets it starts again).
const journeyPos = steps => ({ planet: Math.floor(steps / PLANET_DAYS) % PLANETS, day: steps % PLANET_DAYS, round: Math.floor(steps / (PLANETS * PLANET_DAYS)) });
const QURAN_PAGES = 604;  // pages in the standard Madani mushaf
const PRAYERS = 5;

const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };

const dueTasks = (st, day) => st.tasks.filter(t => t.days.includes(parse(day).getDay()) && t.since <= day);
const dayOf = (st, day) => st.days[day] || (st.days[day] = {});
const prayed = (st, day, id) => ((st.days[day] || {})['p' + id] || []).filter(Boolean).length;
const full = (st, day, t) => (st.days[day] || {})[t.id] === 'done' && (t.type !== 'prayer' || prayed(st, day, t.id) === PRAYERS);

// Every star change goes through here so the weekly report can add them up per day.
function gain(st, day, n) {
  if (!n) return;
  st.stars += n;
  const d = dayOf(st, day);
  if (n > 0) d._p = (d._p || 0) + n; else d._m = (d._m || 0) - n;
}

const prayerTask = (id, ar, today) => ({ id, icon: '🕌', type: 'prayer', title: ar ? 'الصلوات الخمس' : 'Five daily prayers', target: '', stars: 5, days: [0, 1, 2, 3, 4, 5, 6], since: today });

function newKid(lang, today, name) {
  const ar = lang === 'ar';
  const school = ar ? [0, 1, 2, 3, 4] : [1, 2, 3, 4, 5];
  return {
    id: 0, name, stars: 0, streak: 0, best: 0, steps: 0, lastDay: today, nextId: 10,
    tasks: [
      { id: 1, icon: 'quran', title: ar ? 'ورد القرآن' : 'Quran recitation', target: '', pages: 1, stars: 3, days: [0, 1, 2, 3, 4, 5, 6], since: today },
      prayerTask(6, ar, today),
      { id: 2, icon: 'homework', title: ar ? 'الواجب المدرسي' : 'Homework', target: '', stars: 3, days: school, since: today },
    ],
    rewards: [
      { id: 3, icon: '🍦', title: ar ? 'آيس كريم' : 'Ice cream', cost: 30 },
      { id: 4, icon: '🛝', title: ar ? 'نزهة في الحديقة' : 'Trip to the park', cost: 60 },
      { id: 5, icon: '🎁', title: ar ? 'لعبة جديدة' : 'A new toy', cost: 150 },
    ],
    requests: [], days: {}, consequence: null, chestBonus: 10, planetBonus: 30, khatmaBonus: 50, quran: { page: 0, khatmas: 0 },
    penalty: { stars: 2, text: ar ? 'لا شاشات اليوم' : 'No screen time today' },
  };
}

const newDb = lang => ({ v: 2, lang, pin: '', cur: 0, nextKid: 1, reminder: { on: false, time: '17:00' }, kids: [] });
function addKid(db, name, today) {
  const k = newKid(db.lang, today, name);
  k.id = db.nextKid++;
  db.kids.push(k);
  return k;
}

// Upgrade data saved by version 1 (one child, no prayers/Quran tracker). Returns null for anything unrecognisable.
function migrate(data, today) {
  if (!data || typeof data !== 'object') return null;
  if (data.v === 2) return data;
  if (typeof data.stars !== 'number' || !Array.isArray(data.tasks)) return null;
  const db = newDb(data.lang === 'ar' ? 'ar' : 'en');
  db.pin = data.pin;
  const kid = data;
  delete kid.pin; delete kid.lang;
  kid.id = db.nextKid++;
  kid.quran = { page: 0, khatmas: 0 };
  kid.khatmaBonus = 50;
  for (const t of kid.tasks) if (t.icon === 'quran') {
    t.pages = 1;
    if (t.target === '1 page' || t.target === 'صفحة واحدة') t.target = ''; // now shown from `pages`
  }
  kid.tasks.splice(1, 0, prayerTask(kid.nextId++, db.lang === 'ar', today));
  if (kid.consequence) kid.consequence.seen = true;
  db.kids.push(kid);
  return db;
}
const valid = db => !!db && db.v === 2 && /^\d{4}$/.test(db.pin) && Array.isArray(db.kids) && db.kids.length > 0 &&
  db.kids.every(k => typeof k.stars === 'number' && Array.isArray(k.tasks) && Array.isArray(k.rewards) && k.days && typeof k.days === 'object');

function applyPenalty(st, titles, day) {
  const lost = Math.min(st.stars, titles.length * st.penalty.stars);
  gain(st, day, -lost);
  st.streak = 0;
  const c = st.consequence || { titles: [], lost: 0 };
  st.consequence = { titles: c.titles.concat(titles), lost: c.lost + lost, text: st.penalty.text, seen: false };
}

// Close every day since the app was last opened: anything due and never marked is missed.
// Prayers that were only partly ticked go to the parent instead, who can give partial stars.
function rollover(st, today) {
  if (st.lastDay >= today) return false;
  let any = false;
  // ponytail: looks back 30 days at most; a longer absence is forgiven rather than wiping the child out.
  let d = st.lastDay < addDays(today, -30) ? addDays(today, -30) : st.lastDay;
  for (; d < today; d = addDays(d, 1)) {
    const day = dayOf(st, d), missed = [];
    for (const t of dueTasks(st, d)) {
      if (day[t.id]) continue;
      if (t.type === 'prayer' && prayed(st, d, t.id)) day[t.id] = 'pending';
      else { day[t.id] = 'missed'; missed.push(t.title); }
    }
    if (missed.length) { applyPenalty(st, missed, d); any = true; }
  }
  st.lastDay = today;
  return any;
}

// Child side: toggle "I did it" (only until the parent decides).
function mark(st, day, id) {
  const d = dayOf(st, day);
  if (!d[id]) d[id] = 'pending'; else if (d[id] === 'pending') delete d[id];
}
// Child side, prayers: tick one of the five. All five ticked = sent to the parent.
function markPrayer(st, day, id, i) {
  const d = dayOf(st, day);
  if (d[id] === 'done' || d[id] === 'missed') return;
  const p = d['p' + id] || (d['p' + id] = [0, 0, 0, 0, 0]);
  p[i] = p[i] ? 0 : 1;
  if (prayed(st, day, id) === PRAYERS) d[id] = 'pending'; else delete d[id];
}

// Parent side: approve with a rating of 1-5 stars (how well it was done). Returns what to celebrate.
const RATING = 5;
function approve(st, day, id, rating) {
  const d = dayOf(st, day), t = st.tasks.find(t => t.id === id);
  if (!t || d[id] !== 'pending') return null;
  d[id] = 'done';
  const stars = Math.min(RATING, Math.max(1, Math.round(rating) || 1));
  d['s' + id] = stars; // shown to the child on the finished mission
  const extra = Math.max(0, Math.min(5, (d['g' + id] || {}).bonus | 0)); // Focus Guard bonus for a great session (monitor-logic.js bonus())
  gain(st, day, stars + extra);
  const ev = { stars: stars + extra, complete: false, chest: 0, khatma: 0, planet: null };
  if (t.pages > 0) {
    d['q' + id] = t.pages;
    st.quran.page += t.pages;
    if (st.quran.page >= QURAN_PAGES) {
      st.quran.page -= QURAN_PAGES; st.quran.khatmas++;
      gain(st, day, st.khatmaBonus); ev.khatma = st.khatmaBonus;
    }
  }
  if (!d._c && dueTasks(st, day).every(x => full(st, day, x))) {
    d._c = true; ev.complete = true;
    st.streak++; st.best = Math.max(st.best, st.streak); st.steps++;
    st.consequence = null; // a full day makes it right
    const pd = (st.steps - 1) % PLANET_DAYS + 1; // 1..30 on the current planet
    if (pd % PRIZE_EVERY === 0) { gain(st, day, st.chestBonus); ev.chest = st.chestBonus; }
    if (pd === PLANET_DAYS) {
      const bonus = st.planetBonus ?? 30;
      gain(st, day, bonus); ev.planet = { done: Math.floor((st.steps - 1) / PLANET_DAYS) % PLANETS, bonus };
    }
  }
  return ev;
}

function reject(st, day, id, today) {
  const d = dayOf(st, day), t = st.tasks.find(t => t.id === id);
  if (d[id] !== 'pending') return;
  delete d['p' + id]; // prayers: untick all
  if (day === today || !t) delete d[id]; // today: the child can still do it properly
  else { d[id] = 'missed'; applyPenalty(st, [t.title], day); }
}

const adjust = (st, today, n) => gain(st, today, Math.max(n, -st.stars));

// Stars are held when the child asks, and refunded if the parent says no.
function requestReward(st, id) {
  const r = st.rewards.find(r => r.id === id);
  if (!r || st.stars < r.cost || st.requests.some(q => q.rewardId === id && q.status === 'pending')) return false;
  st.stars -= r.cost;
  st.requests.push({ id: st.nextId++, rewardId: id, title: r.title, icon: r.icon, cost: r.cost, status: 'pending' });
  return true;
}
function answerReward(st, reqId, yes) {
  const q = st.requests.find(q => q.id === reqId);
  if (!q || q.status !== 'pending') return;
  q.status = yes ? 'granted' : 'declined';
  if (!yes) st.stars += q.cost;
}

// Tasks still waiting for the parent, oldest first: [{day, task}]
function pending(st) {
  const out = [];
  for (const day of Object.keys(st.days).sort())
    for (const t of st.tasks) if (st.days[day][t.id] === 'pending') out.push({ day, task: t });
  return out;
}

// Has the child done their part today (everything ticked, approved or not)? Used to skip the reminder.
const handledToday = (st, today) => dueTasks(st, today).every(t => (st.days[today] || {})[t.id]);

// Last 7 days for the parent report.
function report(st, today) {
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(addDays(today, -i));
  const r = { days, rows: [], plus: 0, minus: 0, full: 0, pages: 0, prayers: 0 };
  for (const d of days) {
    const x = st.days[d] || {};
    r.plus += x._p || 0; r.minus += x._m || 0; r.full += x._c ? 1 : 0;
    for (const t of st.tasks) {
      r.pages += x['q' + t.id] || 0;
      if (t.type === 'prayer') r.prayers += prayed(st, d, t.id);
    }
  }
  for (const t of st.tasks) {
    const cells = days.map(d => {
      if (!dueTasks(st, d).includes(t)) return { s: 'off' };
      return { s: (st.days[d] || {})[t.id] || 'todo', n: t.type === 'prayer' ? prayed(st, d, t.id) : null };
    });
    if (cells.some(c => c.s !== 'off')) r.rows.push({ task: t, cells });
  }
  return r;
}

if (typeof module !== 'undefined' && require.main === module) {
  const assert = require('assert');
  const db = newDb('en'); db.pin = '1234';
  const st = addKid(db, 'Yusuf', '2026-11-16'); // a Monday
  const PR = 6;
  const doPrayers = (k, day) => { for (let i = 0; i < 5; i++) markPrayer(k, day, PR, i); };
  // full day -> stars, streak, step, Quran page
  mark(st, '2026-11-16', 1); mark(st, '2026-11-16', 2); doPrayers(st, '2026-11-16');
  assert.equal(st.days['2026-11-16'][PR], 'pending');
  assert.equal(approve(st, '2026-11-16', 1, 5).complete, false);
  assert.equal(approve(st, '2026-11-16', PR, 4).stars, 4);
  assert.equal(approve(st, '2026-11-16', 2, 5).complete, true);
  assert.equal(approve(st, '2026-11-16', 2, 5), null); // no double award
  assert.deepEqual([st.stars, st.streak, st.steps, st.quran.page], [14, 1, 1, 1]);
  assert.equal(st.days['2026-11-16']['s' + PR], 4);
  // not opened Tue+Wed, opened Thu: 3 tasks x 2 days missed, 2 stars each, floor at 0, streak reset
  assert.equal(rollover(st, '2026-11-19'), true);
  assert.equal(st.consequence.titles.length, 6);
  assert.deepEqual([st.stars, st.streak, st.consequence.lost, st.consequence.seen], [2, 0, 12, false]);
  assert.equal(rollover(st, '2026-11-19'), false); // idempotent
  // Saturday: homework not due
  st.lastDay = '2026-11-21'; st.consequence = null;
  rollover(st, '2026-11-22');
  assert.deepEqual(st.consequence.titles, ['Quran recitation', 'Five daily prayers']);
  // partly ticked prayers go to the parent (no penalty), who gives partial stars; that day is not "full"
  const s2 = addKid(db, 'Maryam', '2026-11-16'); s2.stars = 5;
  mark(s2, '2026-11-16', 1); mark(s2, '2026-11-16', 2);
  markPrayer(s2, '2026-11-16', PR, 0); markPrayer(s2, '2026-11-16', PR, 1); markPrayer(s2, '2026-11-16', PR, 2);
  markPrayer(s2, '2026-11-16', PR, 3); markPrayer(s2, '2026-11-16', PR, 3); // untick
  assert.equal(rollover(s2, '2026-11-17'), false);
  assert.equal(s2.days['2026-11-16'][PR], 'pending');
  approve(s2, '2026-11-16', 1, 5); approve(s2, '2026-11-16', 2, 5);
  assert.equal(approve(s2, '2026-11-16', PR, 3).stars, 3); // parent's rating for 3 of 5 prayers
  assert.equal(s2.days['2026-11-16']._c, undefined);
  // rejecting yesterday's homework costs stars; rejecting today's just reopens it
  mark(s2, '2026-11-17', 2); reject(s2, '2026-11-17', 2, '2026-11-17');
  assert.equal(s2.days['2026-11-17'][2], undefined);
  // a completed day clears the consequence; 7th step gives the chest
  s2.consequence = { titles: ['x'], lost: 1, seen: true }; s2.steps = 6;
  mark(s2, '2026-11-17', 1); mark(s2, '2026-11-17', 2); doPrayers(s2, '2026-11-17');
  approve(s2, '2026-11-17', 1, 5); approve(s2, '2026-11-17', PR, 5);
  assert.equal(approve(s2, '2026-11-17', 2, 5).chest, 10);
  assert.equal(s2.consequence, null);
  // planets: chests on days 7/14/21/28 of every planet, planet bonus on day 30, then the next planet
  const pj = addKid(db, 'Planet', '2026-11-16');
  const fullDay = (k, d) => { for (const x of dueTasks(k, d)) { if (x.type === 'prayer') [0, 1, 2, 3, 4].forEach(i => markPrayer(k, d, x.id, i)); else mark(k, d, x.id); } let ev; for (const x of dueTasks(k, d)) ev = approve(k, d, x.id, 1) || ev; return ev; };
  pj.steps = 13; assert.equal(fullDay(pj, '2026-11-16').chest, 10);           // day 14
  pj.steps = 28; let e = fullDay(pj, '2026-11-17');                            // day 29
  assert.deepEqual([e.chest, e.planet], [0, null]);
  e = fullDay(pj, '2026-11-18');                                               // day 30
  assert.deepEqual([e.chest, e.planet], [0, { done: 0, bonus: 30 }]);
  assert.deepEqual(journeyPos(pj.steps), { planet: 1, day: 0, round: 0 });
  pj.steps = 36; assert.equal(fullDay(pj, '2026-11-19').chest, 10);           // planet 2, day 7
  pj.steps = 89; assert.equal(fullDay(pj, '2026-11-20').planet.done, 2);      // last planet done
  assert.deepEqual(journeyPos(pj.steps), { planet: 0, day: 0, round: 1 });
  // khatma: finishing page 604 wraps around and pays the bonus
  s2.quran.page = 603; s2.tasks[0].pages = 2;
  mark(s2, '2026-11-18', 1);
  assert.equal(approve(s2, '2026-11-18', 1, 5).khatma, 50);
  assert.deepEqual(s2.quran, { page: 1, khatmas: 1 });
  // weekly report adds up the ledger
  const r = report(s2, '2026-11-18');
  assert.equal(r.days.length, 7);
  assert.equal(r.full, 1);
  assert.equal(r.pages, 1 + 1 + 2);
  assert.equal(r.prayers, 3 + 5);
  assert.equal(r.plus, s2.days['2026-11-16']._p + s2.days['2026-11-17']._p + s2.days['2026-11-18']._p);
  assert.equal(r.rows.find(x => x.task.id === 2).cells[6].s, 'todo');
  // rating is clamped to 1..5
  const s3 = addKid(db, 'Ali', '2026-11-16');
  mark(s3, '2026-11-16', 1); mark(s3, '2026-11-16', 2);
  assert.equal(approve(s3, '2026-11-16', 1, 9).stars, 5);
  assert.equal(approve(s3, '2026-11-16', 2, 0).stars, 1);
  // rewards: hold, refund, no overspend
  s2.stars = 40;
  assert.equal(requestReward(s2, 3), true);
  assert.equal(requestReward(s2, 3), false);
  assert.equal(requestReward(s2, 4), false);
  answerReward(s2, s2.requests[0].id, false);
  assert.equal(s2.stars, 40);
  // version-1 data upgrades into a valid db with a prayer mission added
  const v1 = { lang: 'ar', pin: '4321', name: 'Ali', stars: 7, streak: 2, best: 2, steps: 2, lastDay: '2026-11-15', nextId: 10,
    tasks: [{ id: 1, icon: 'quran', title: 'q', target: '1 page', stars: 3, days: [0], since: '2026-11-01' }], rewards: [], requests: [], days: {},
    consequence: null, chestBonus: 10, penalty: { stars: 2, text: '' } };
  const m = migrate(v1, '2026-11-16');
  assert.ok(valid(m));
  assert.deepEqual([m.lang, m.pin, m.kids[0].name, m.kids[0].tasks.length, m.kids[0].tasks[0].pages], ['ar', '4321', 'Ali', 2, 1]);
  assert.equal(m.kids[0].tasks[0].target, '');
  assert.equal(migrate(m, '2026-11-16'), m);
  assert.equal(migrate({ hello: 1 }, 'x'), null);
  assert.ok(!valid(migrate([], 'x')));
  assert.ok(valid(JSON.parse(JSON.stringify(db))));
  // Focus Guard bonus is paid on approval, on top of the rating (and capped)
  const kb = addKid(db, 'Bonus', '2026-11-16'); mark(kb, '2026-11-16', 2); kb.days['2026-11-16'].g2 = { bonus: 2 };
  assert.equal(approve(kb, '2026-11-16', 2, 3).stars, 5);
  assert.equal(kb.stars, 5);
  const kc = addKid(db, 'Big', '2026-11-16'); mark(kc, '2026-11-16', 2); kc.days['2026-11-16'].g2 = { bonus: 99 };
  assert.equal(approve(kc, '2026-11-16', 2, 1).stars, 6);
  console.log('logic ok');
}
