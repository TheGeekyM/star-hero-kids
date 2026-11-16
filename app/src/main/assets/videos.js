// Kids videos (2.5): only YouTube videos and playlists a parent added, in a locked-down player.
// Videos are closed until the child spends stars to open them: price ⭐ opens `unlock` minutes, at most `cap` minutes a day (2.12).
// Its own page (see videos.html). Settings in db.vids = { list: [{kind, id, title, thumb, ch}], price, unlock, cap, after }; today's
// time in localStorage 'starhero-video-time' = { d, sec (watched), paid (minutes opened with stars), extra (minutes a parent gave) }.
// The child can't tap anything inside YouTube: a cover sits over the player and our own buttons drive it (YT IFrame API).
(() => {
  const KEY = 'starhero', TKEY = 'starhero-video-time';
  let db = null;
  try { db = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { db = null; }
  if (!db || !db.kids || !db.kids.length) { location.replace('index.html'); return; }
  const kid = db.kids[db.cur] || db.kids[0], lang = db.lang === 'ar' ? 'ar' : 'en';
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const L = {
    en: {
      title: 'Videos', home: 'Home', left: '{0} min left', leftS: 'Less than a minute', empty: 'No videos yet. Ask your parent to add some!',
      first: 'Finish today\'s missions first, then the videos open! 🦸', toMissions: 'Go to my missions',
      up: "That's all the videos for today! 📺", upSub: 'You watched {0} minutes. Go play, read or help at home. Videos are back tomorrow!',
      closed: 'Videos are closed', closedSub: 'Open {0} minutes of videos for {1} ⭐. You have {2} ⭐.', open: 'Open {0} min for {1} ⭐', needMore: 'You need {0} more ⭐',
      buyQ: 'Spend {0} ⭐ to open {1} minutes of videos?', buy: 'Open', locked: 'Closed',
      price: 'Stars to open videos', unlock: 'Minutes for each opening', cap: 'Most video minutes a day', opened: 'Today: watched {0} min · opened {1} of {2} min',
      oneMin: '1 minute of videos left!', playlist: 'Series', channel: 'Channel', handle: 'Channel @names can\'t be added. Open the channel, tap ⋮ → Share and copy that link, or paste a playlist link.', cant: "This video can't play here.", parent: 'Parent', close: 'Close',
      pin: 'Parent PIN', pinBad: 'Wrong PIN',
      manage: 'Videos for {0}', addSub: 'Paste a YouTube link: one video, or a whole playlist (series). Only what you add here can be watched.',
      paste: 'https://www.youtube.com/…', add: '+ Add', adding: 'Checking…', badLink: 'That is not a YouTube video or playlist link.',
      suggested: 'Suggested', notFound: 'This video was not found, or its owner does not allow playing it in other apps.', have: 'Already in the list.', del: 'Delete', delQ: 'Remove "{0}"?',
      daily: 'Daily video time', minsN: '{0} min', afterQ: 'Only after today\'s missions are done', on: 'On', off: 'Off',
      watched: 'Watched today: {0} min of {1}', more15: '+15 min today', offline: 'No internet. Videos need a connection.',
    },
    ar: {
      title: 'فيديوهات', home: 'الرئيسية', left: 'بقي {0} دقيقة', leftS: 'أقل من دقيقة', empty: 'لا توجد فيديوهات بعد. اطلب من والديك إضافتها!',
      first: 'أنهِ مهام اليوم أولاً، ثم تُفتح الفيديوهات! 🦸', toMissions: 'اذهب إلى مهامي',
      closed: 'الفيديوهات مقفلة', closedSub: 'افتح {0} دقيقة من الفيديو مقابل {1} ⭐. عندك {2} ⭐.', open: 'افتح {0} دقيقة بـ {1} ⭐', needMore: 'تحتاج {0} ⭐ أخرى',
      buyQ: 'تصرف {0} ⭐ لتفتح {1} دقيقة من الفيديو؟', buy: 'افتح', locked: 'مقفلة',
      price: 'النجوم لفتح الفيديو', unlock: 'الدقائق لكل فتحة', cap: 'أقصى دقائق فيديو في اليوم', opened: 'اليوم: شوهد {0} دقيقة · فُتح {1} من {2} دقيقة',
      up: 'انتهت فيديوهات اليوم! 📺', upSub: 'شاهدت {0} دقيقة. اذهب والعب أو اقرأ أو ساعد في البيت. الفيديوهات تعود غداً!',
      oneMin: 'بقيت دقيقة واحدة من الفيديو!', playlist: 'سلسلة', channel: 'قناة', handle: 'لا يمكن إضافة القناة باسمها @. افتح القناة واضغط ⋮ ← مشاركة وانسخ ذلك الرابط، أو الصق رابط قائمة تشغيل.', cant: 'لا يمكن تشغيل هذا الفيديو هنا.', parent: 'الوالدان', close: 'إغلاق',
      pin: 'رمز الوالدين', pinBad: 'رمز خاطئ',
      manage: 'فيديوهات {0}', addSub: 'الصق رابط يوتيوب: فيديو واحد أو قائمة تشغيل كاملة (سلسلة). لا يمكن مشاهدة إلا ما تضيفه هنا.',
      paste: 'https://www.youtube.com/…', add: '+ إضافة', adding: 'جارٍ التحقق…', badLink: 'هذا ليس رابط فيديو أو قائمة تشغيل من يوتيوب.',
      suggested: 'مقترحات', notFound: 'لم يُعثر على الفيديو، أو صاحبه لا يسمح بتشغيله في تطبيقات أخرى.', have: 'موجود في القائمة بالفعل.', del: 'حذف', delQ: 'حذف "{0}"؟',
      daily: 'وقت الفيديو اليومي', minsN: '{0} دقيقة', afterQ: 'فقط بعد إنهاء مهام اليوم', on: 'تشغيل', off: 'إيقاف',
      watched: 'شوهد اليوم: {0} من {1} دقيقة', more15: '+15 دقيقة اليوم', offline: 'لا يوجد إنترنت. الفيديوهات تحتاج اتصالاً.',
    },
  };
  const tx = (k, ...a) => (L[lang][k] ?? L.en[k]).replace(/\{(\d)\}/g, (_, i) => a[i]);
  const esc = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  const day = () => ymd(new Date());
  // Official Omar & Hana Arabic playlists (channel "Omar & Hana Arabic - أناشيد و رسوم دينية للأطفال"), checked on 2026-11-16.
  const PRESETS = [
    { kind: 'playlist', id: 'PLIx29vxQ1_Wp6Am2_Qj-buEuf0B4RDnea', title: 'عمر وهنا - حلقات', thumb: 'https://i.ytimg.com/vi/Sl4hYYOi6yk/hqdefault.jpg' },
    { kind: 'playlist', id: 'PLIx29vxQ1_WrcMt8a7Lo28jJJWQAIcbvt', title: 'عمر وهنا - بدون موسيقى', thumb: 'https://i.ytimg.com/vi/ROnAjGqnETA/hqdefault.jpg' },
    { kind: 'playlist', id: 'PLIx29vxQ1_WoyPFUYURRjcqoU8I0HAx0s', title: 'عمر وهنا - أناشيد', thumb: 'https://i.ytimg.com/vi/EiQ--fzWtoc/hqdefault.jpg' },
    // more Islamic series, each from the producer's or broadcaster's own channel (checked 2026-11-16)
    { kind: 'playlist', id: 'PLJ0WU3XQoz4-4AjkrKBJTClcJxJsVF7RU', title: 'قصص الحيوان في القرآن', thumb: 'https://i.ytimg.com/vi/wHrxioBnB9o/hqdefault.jpg' }, // Cedars Art Production
    { kind: 'playlist', id: 'PLJ0WU3XQoz4_vDPS0Xlaf3E2LgUz7pJsp', title: 'قصص العجائب في القرآن', thumb: 'https://i.ytimg.com/vi/8aO-jm-3Oc0/hqdefault.jpg' }, // Cedars Art Production
    { kind: 'playlist', id: 'PL678DQfcGwUxhzY9DeIB9Kp3MHOZU-Uyj', title: 'من قصص الأنبياء', thumb: 'https://i.ytimg.com/vi/OB00NcJAULk/hqdefault.jpg' }, // ماسبيرو أطفال (Egyptian TV)
    { kind: 'playlist', id: 'PLyJtgOsBf7wwCguUAe1NjMlPhaW8eNbpY', title: 'زكي - One4kids', thumb: 'https://i.ytimg.com/vi/In1CD-pEqtw/hqdefault.jpg' }, // One4kids | العربية
    { kind: 'playlist', id: 'PLQXerpPVsEPs-Z3CyIydrelZgazEq-W1-', title: 'فواز ونورة', thumb: 'https://i.ytimg.com/vi/xZQbc3l3S1A/hqdefault.jpg' }, // iEN (Saudi Ministry of Education)
    { kind: 'playlist', id: 'PLKhm8Z5pXdOUcx5ho4DuPRtBvu8wlIkB6', title: 'جزء عمّ للأطفال - داوود', thumb: 'https://i.ytimg.com/vi/exmOpWgckZ8/hqdefault.jpg' }, // قناة داوود للأطفال
    // whole channels (every upload, newest first)
    { kind: 'playlist', ch: true, id: 'UUr3XqrfFHRy25Dcrm7RVD0w', title: 'قناة عمر وهنا', thumb: 'https://i.ytimg.com/vi/dH8jro8dSW8/hqdefault.jpg' },
    { kind: 'playlist', ch: true, id: 'UUlzEuix0DYhYTAgb1_kONpQ', title: 'قناة داوود للأطفال', thumb: 'https://i.ytimg.com/vi/5UQmIPmTKZE/hqdefault.jpg' },
    // added on the parent's request: general Egyptian kids cartoons (Bakkar, Bogy & Tamtam…), not only Islamic, some with music
    { kind: 'playlist', ch: true, id: 'UUdNDEttmojDNr1VTxBcKNIw', title: 'ماسبيرو أطفال', thumb: 'https://i.ytimg.com/vi/Op6wiVjq4GA/hqdefault.jpg' },
  ];
  const has = it => cfg().list.some(x => x.kind === it.kind && x.id === it.id);
  const cfg = () => db.vids || (db.vids = { list: [], price: 10, unlock: 15, cap: 60, after: false });
  const price = () => cfg().price ?? 10, unlockMin = () => cfg().unlock ?? 15, cap = () => cfg().cap ?? 60; // defaults for phones set up before 2.12
  const save = () => { // other parts of db may have changed in the main page meanwhile: write back only db.vids
    try { const cur = JSON.parse(localStorage.getItem(KEY)); cur.vids = db.vids; localStorage.setItem(KEY, JSON.stringify(cur)); } catch (e) { /* not saved */ }
  };
  const usage = () => { let u = null; try { u = JSON.parse(localStorage.getItem(TKEY)); } catch (e) { /* none */ } return u && u.d === day() ? Object.assign({ paid: 0, extra: 0 }, u) : { d: day(), sec: 0, paid: 0, extra: 0 }; };
  const setUsage = u => { try { localStorage.setItem(TKEY, JSON.stringify(u)); } catch (e) { /* not counted */ } };
  const seen = cfg().seeded === true ? 3 : cfg().seeded || 0; // how many presets this phone already got (2.6 had 3)
  if (seen < PRESETS.length) { // each preset arrives once; a parent who deletes one keeps it deleted
    cfg().list.push(...PRESETS.slice(seen).filter(x => !has(x)).map(x => Object.assign({}, x)));
    cfg().seeded = PRESETS.length;
    save();
  }
  const leftSec = () => { const u = usage(); return (u.paid + u.extra) * 60 - u.sec; };
  const buyable = () => Math.max(0, Math.min(unlockMin(), cap() - usage().paid)); // minutes the next opening gives (0 = daily maximum reached)
  const latest = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const myStars = () => { const d = latest(); const k = d && d.kids.find(x => x.id === kid.id); return k ? k.stars : 0; };
  async function buy() { // spend stars (logic.js spend(): it shows in the child's star statement) and open the videos
    const n = buyable();
    if (!n || myStars() < price()) return draw();
    if (!await dialog({ icon: 'star', text: tx('buyQ', price(), n), ok: tx('buy') })) return;
    const d = latest(), k = d && d.kids.find(x => x.id === kid.id);
    if (!k || k.stars < price()) return draw();
    spend(k, day(), price(), ['videos', String(n)]);
    localStorage.setItem(KEY, JSON.stringify(d)); db.kids = d.kids;
    const u = usage(); u.paid += n; setUsage(u);
    draw();
  }
  // "Missions first": this page's own switch (db.vids.after) or the app-wide one in Parent zone (db.gm.first, games.js).
  // Same rule as games.js: today's non-prayer missions done or waiting for the parent; a rest day is open.
  const firstOn = () => { const d = latest(); return !!(cfg().after || (d && d.gm && d.gm.first)); };
  const missionsOk = () => {
    try {
      const k = latest().kids.find(x => x.id === kid.id) || kid, d = day(), x = k.days[d] || {};
      return dueTasks(k, d).filter(t => t.type !== 'prayer').every(t => x[t.id] === 'pending' || x[t.id] === 'done');
    } catch (e) { return true; }
  };
  const home = () => { try { sessionStorage.setItem('sh-nosplash', '1'); } catch (e) { /* splash plays */ } location.href = 'index.html'; };

  // ---------------------------------------------------------------- links
  function parseLink(u) {
    u = (u || '').trim();
    let m;
    if ((m = u.match(/\/channel\/UC([\w-]{22})/))) return { kind: 'playlist', ch: true, id: 'UU' + m[1] }; // a whole channel = its uploads list
    if (/\/playlist\b/.test(u) && (m = u.match(/[?&]list=([\w-]{10,})/))) return { kind: 'playlist', id: m[1], ch: /^UU/.test(m[1]) || undefined };
    if ((m = u.match(/(?:[?&]v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/))) return { kind: 'video', id: m[1] };
    if ((m = u.match(/[?&]list=((?!RD)[\w-]{10,})/))) return { kind: 'playlist', id: m[1] }; // RD… are YouTube's endless auto-mixes: not allowed
    if (/^[\w-]{11}$/.test(u)) return { kind: 'video', id: u };
    return null;
  }
  const watchUrl = it => it.kind === 'playlist' ? `https://www.youtube.com/playlist?list=${it.id}` : `https://www.youtube.com/watch?v=${it.id}`;
  async function lookup(it) { // title + picture, and a check that the video exists and can be embedded
    const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl(it))}`);
    if (!r.ok) return null;
    const j = await r.json();
    return { title: String(j.title || '').replace(/^Uploads from /, '').slice(0, 90), thumb: /^https:\/\/i\d?\.ytimg\.com\//.test(j.thumbnail_url || '') ? j.thumbnail_url : '' };
  }

  // ---------------------------------------------------------------- screens
  const root = document.getElementById('v');
  let P = null; // the open player: { it, yt, big, timer }
  const timePill = () => { const s = leftSec(); return `<span class="vpill">${s >= 60 ? '⏱️ ' + tx('left', Math.floor(s / 60)) : s > 0 ? '⏱️ ' + tx('leftS') : '🔒 ' + tx('locked')}</span>`; };
  const top = () => `<header class="vtop"><button class="vround" data-v="home" aria-label="${tx('home')}">${ic('home')}</button><h1>📺 ${tx('title')}</h1>${timePill()}
    <button class="vround" data-v="parent" aria-label="${tx('parent')}">${ic('lock')}</button></header>`;
  const card = (it, i) => `<button class="vcard" data-v="play" data-i="${i}" style="--i:${i}"><span class="vthumb">${it.thumb ? `<img src="${esc(it.thumb)}" alt="" loading="lazy">` : ''}<i>▶</i>${it.kind === 'playlist' ? `<em>${it.ch ? '📺 ' + tx('channel') : '☰ ' + tx('playlist')}</em>` : ''}</span>
    <b dir="auto">${esc(it.title)}</b></button>`;
  const gate = (emoji, title, sub, btn) => `<div class="vgate"><div class="vgate-e">${emoji}</div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}${btn || ''}</div>`;
  function draw() {
    const list = cfg().list;
    let body;
    const homeBtn = `<button class="btn ${leftSec() > 0 ? 'go' : 'off'}" data-v="home">${tx('toMissions')}</button>`;
    if (firstOn() && !missionsOk()) body = gate('🦸', tx('first'), '', homeBtn);
    else if (leftSec() <= 0 && !buyable()) body = gate('🌳', tx('up'), tx('upSub', Math.round(usage().sec / 60)), homeBtn);
    else if (leftSec() <= 0) {
      const have = myStars(), n = buyable();
      body = gate('🔒', tx('closed'), tx('closedSub', n, price(), have), (have >= price() ? `<button class="btn go" data-v="buy">⭐ ${tx('open', n, price())}</button>`
        : `<button class="btn off" disabled>${tx('needMore', price() - have)}</button>`) + homeBtn);
    }
    else if (!list.length) body = gate('📺', tx('empty'), '', '');
    else body = `<div class="vgrid">${list.map(card).join('')}</div>`;
    root.innerHTML = top() + `<main class="vmain">${navigator.onLine === false ? `<p class="vwarn">${tx('offline')}</p>` : ''}${body}</main>`;
  }

  // ---------------------------------------------------------------- the player
  let api = null;
  const loadApi = () => api || (api = new Promise((ok, no) => {
    window.onYouTubeIframeAPIReady = () => ok(window.YT);
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.onerror = no; document.head.appendChild(s);
  }));
  async function open(i) {
    const it = cfg().list[i];
    if (!it || leftSec() <= 0) return draw();
    const wrap = document.createElement('div');
    wrap.className = 'vplayer';
    wrap.innerHTML = `<div class="vstage"><div id="yt"></div><div class="vshield" data-p="toggle"></div>
      <div class="vctl"><button data-p="prev" class="${it.kind === 'playlist' ? '' : 'hide'}">⏮</button><button data-p="toggle" class="vpp">▶</button><button data-p="next" class="${it.kind === 'playlist' ? '' : 'hide'}">⏭</button>
        <input type="range" min="0" max="1000" value="0" data-p="seek" dir="ltr"><span class="vtime" dir="ltr">0:00</span><button data-p="big">⛶</button></div></div>
      <div class="vbar"><b dir="auto">${esc(it.title)}</b>${timePill()}<button class="vround" data-p="close" aria-label="${tx('close')}">${ic('x')}</button></div>
      <div class="vlist"></div><div class="vmsg" hidden></div>`;
    document.body.appendChild(wrap);
    P = { it, i, wrap, yt: null, big: false, ids: null };
    if (it.kind === 'video') upNext();
    let YT;
    try { YT = await loadApi(); } catch (e) { return say(tx('offline')); }
    if (!P || P.wrap !== wrap) return;
    const vars = { controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, playsinline: 1, autoplay: 1, cc_load_policy: 0, hl: lang };
    if (it.kind === 'playlist') Object.assign(vars, { listType: 'playlist', list: it.id });
    P.yt = new YT.Player('yt', { host: 'https://www.youtube-nocookie.com', ...(it.kind === 'video' ? { videoId: it.id } : {}), playerVars: vars, // a playlist must not pass videoId at all
      events: {
        onReady: e => { e.target.playVideo(); },
        onStateChange: e => { if (!P) return; wrap.querySelector('.vpp').textContent = e.data === 1 ? '⏸' : '▶'; wrap.classList.toggle('playing', e.data === 1);
          if (it.kind === 'playlist') episodes();
          if (e.data === 0 && it.kind === 'video') close(); }, // finished: back to the list (no YouTube suggestions)
        onError: () => { if (it.kind === 'playlist' && P.yt.nextVideo) { say(tx('cant')); P.yt.nextVideo(); } else say(tx('cant')); },
      } });
  }
  // ---------------------------------------------------------------- the list under the player (like YouTube)
  // A playlist shows its episodes (tap one to play it, the one playing is marked); a single video shows the parent's other videos.
  const TCACHE = 'starhero-vtitles';
  const titles = (() => { try { return JSON.parse(localStorage.getItem(TCACHE)) || {}; } catch (e) { return {}; } })();
  const keepTitles = () => { try { const k = Object.keys(titles); if (k.length > 800) k.slice(0, k.length - 800).forEach(x => delete titles[x]); localStorage.setItem(TCACHE, JSON.stringify(titles)); } catch (e) { /* not cached */ } };
  let fetching = false;
  async function fetchTitles(ids) { // oEmbed, 4 at a time; each title lands on its row as soon as it arrives
    if (fetching) return;
    fetching = true;
    const todo = ids.filter(id => !titles[id]);
    const one = async () => {
      for (let id; (id = todo.shift());) {
        try { const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}`); titles[id] = r.ok ? String((await r.json()).title || '').slice(0, 120) : '–'; }
        catch (e) { break; }
        document.querySelectorAll(`.vep[data-id="${id}"] b`).forEach(b => { b.textContent = titles[id]; });
      }
    };
    await Promise.all([one(), one(), one(), one()]);
    keepTitles(); fetching = false;
    // channels repeat their own name in every title ("Omar & Hana Arabic | … | episode"): drop parts most episodes share
    const parts = t => t.split(/\s+[|｜]\s+/), count = {};
    ids.forEach(id => titles[id] && new Set(parts(titles[id])).forEach(x => { count[x] = (count[x] || 0) + 1; }));
    const known = ids.filter(id => titles[id]).length;
    document.querySelectorAll('.vep[data-id] b').forEach(b => {
      const t = titles[b.parentElement.dataset.id]; if (!t) return;
      const keep = parts(t).filter(x => known < 3 || count[x] < known * .6);
      b.textContent = keep.length ? keep[keep.length - 1] : t; // the episode's own name is the last part
    });
  }
  const epRow = (id, i, on) => `<button class="vep ${on ? 'on' : ''}" data-p="at" data-i="${i}" data-id="${id}"><span class="vep-n">${on ? '▶' : i + 1}</span>
    <span class="vep-t"><img src="https://i.ytimg.com/vi/${id}/mqdefault.jpg" alt="" ${i < 12 ? '' : 'loading="lazy"'}></span><b dir="auto">${esc(titles[id] || '…')}</b></button>`;
  function episodes() {
    const y = P && P.yt;
    if (!y || !y.getPlaylist) return;
    const ids = y.getPlaylist(), cur = y.getPlaylistIndex();
    if (!ids || !ids.length) return;
    const box = P.wrap.querySelector('.vlist');
    if (P.ids !== ids.join()) { // first time (or the list changed): draw it all
      P.ids = ids.join();
      box.innerHTML = `<h3>☰ ${esc(P.it.title)} <small>${cur + 1} / ${ids.length}</small></h3>` + ids.map((id, i) => epRow(id, i, i === cur)).join('');
      fetchTitles(ids);
    }
    if (P.cur !== cur) { // mark the episode playing now and bring it into view
      P.cur = cur;
      box.querySelectorAll('.vep').forEach((el, i) => { el.classList.toggle('on', i === cur); el.querySelector('.vep-n').textContent = i === cur ? '▶' : i + 1; });
      const h = box.querySelector('h3 small'); if (h) h.textContent = `${cur + 1} / ${ids.length}`;
      const on = box.querySelector('.vep.on'); if (on) box.scrollTop = on.offsetTop - box.offsetTop - 8;
      const t = P.wrap.querySelector('.vbar b'); if (t && titles[ids[cur]]) t.textContent = titles[ids[cur]];
    }
  }
  function upNext() { // a single video: the parent's other videos below it
    const box = P.wrap.querySelector('.vlist');
    box.innerHTML = cfg().list.map((x, j) => j === P.i ? '' : `<button class="vep" data-p="open" data-i="${j}"><span class="vep-t">${x.thumb ? `<img src="${esc(x.thumb)}" alt="" loading="lazy">` : ''}</span>
      <b dir="auto">${esc(x.title)}${x.kind === 'playlist' ? ` <em>☰ ${tx('playlist')}</em>` : ''}</b></button>`).join('');
  }

  function close() {
    if (!P) return;
    try { P.yt && P.yt.destroy(); } catch (e) { /* gone */ }
    P.wrap.remove(); P = null; draw();
  }
  let msgT;
  function say(text) {
    const m = P && P.wrap.querySelector('.vmsg');
    if (!m) return;
    m.textContent = text; m.hidden = false; clearTimeout(msgT); msgT = setTimeout(() => { m.hidden = true; }, 3500);
  }
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  // every second: count watching time (only while a video really plays), lock when it runs out, move the progress bar
  let saidOne = false;
  setInterval(() => {
    if (!P || !P.yt || !P.yt.getPlayerState) return;
    const playing = P.yt.getPlayerState() === 1;
    if (playing && !document.hidden) {
      const u = usage(); u.sec++; setUsage(u);
      const left = leftSec();
      P.wrap.querySelectorAll('.vpill').forEach(x => { x.outerHTML = timePill(); });
      if (left <= 60 && left > 0 && !saidOne) { saidOne = true; say(tx('oneMin')); }
      if (left <= 0) { try { P.yt.pauseVideo(); } catch (e) { /* */ } close(); return; }
    }
    try {
      const d = P.yt.getDuration() || 0, c = P.yt.getCurrentTime() || 0, r = P.wrap.querySelector('[data-p="seek"]');
      if (d && r && !r.matches(':active')) r.value = Math.round(c / d * 1000);
      P.wrap.querySelector('.vtime').textContent = d ? `${fmt(c)} / ${fmt(d)}` : '';
    } catch (e) { /* not ready */ }
  }, 1000);
  document.addEventListener('visibilitychange', () => { if (document.hidden && P && P.yt && P.yt.pauseVideo) P.yt.pauseVideo(); });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-p]');
    if (!b || !P) return;
    const k = b.dataset.p, y = P.yt, hidden = P.wrap.classList.contains('playing') && !P.wrap.classList.contains('show');
    if (hidden && b.classList.contains('vshield')) { P.wrap.classList.add('show'); clearTimeout(P.hideT); P.hideT = setTimeout(() => P && P.wrap.classList.remove('show'), 3500); return; } // first tap: just show the buttons (like YouTube)
    P.wrap.classList.add('show'); clearTimeout(P.hideT); P.hideT = setTimeout(() => P && P.wrap.classList.remove('show'), 3500);
    if (k === 'close') return close();
    if (k === 'open') { const j = +b.dataset.i; close(); return open(j); }
    if (k === 'big') { P.big = !P.big; P.wrap.classList.toggle('big', P.big); return; }
    if (!y || !y.getPlayerState) return;
    if (k === 'toggle') { if (y.getPlayerState() === 1) y.pauseVideo(); else if (leftSec() > 0) y.playVideo(); }
    else if (k === 'next') y.nextVideo(); else if (k === 'prev') y.previousVideo();
    else if (k === 'at' && leftSec() > 0) y.playVideoAt(+b.dataset.i);
  });
  document.addEventListener('change', e => {
    if (e.target.dataset.p === 'seek' && P && P.yt && P.yt.getDuration) P.yt.seekTo(P.yt.getDuration() * e.target.value / 1000, true);
  });

  // ---------------------------------------------------------------- parent
  async function askPin() {
    const v = await dialog({ icon: 'lock', title: tx('pin'), input: { pin: true } });
    if (v === null) return false;
    if (v === db.pin || (db.m && db.m.pin2 && v === db.m.pin2)) return true;
    await dialog({ icon: 'missed', text: tx('pinBad'), cancel: null });
    return false;
  }
  const pick = (key, opts, val) => `<div class="seg">${opts.map(m => `<button class="${val === m ? 'on' : ''}" data-v="set" data-k="${key}" data-m="${m}">${m}</button>`).join('')}</div>`;
  function drawParent() {
    const c = cfg(), u = usage();
    root.innerHTML = `<header class="vtop"><button class="vround" data-v="list" aria-label="${tx('close')}">${ic('x')}</button><h1>⚙️ ${tx('manage', esc(kid.name))}</h1></header>
      <main class="vmain vparent">
        <section class="vbox"><small>${tx('addSub')}</small><div class="vadd"><input id="vlink" type="url" dir="ltr" placeholder="${tx('paste')}"><button class="btn go" data-v="add">${tx('add')}</button></div><p class="vwarn" id="vaddmsg" hidden></p></section>
        <section class="vbox">${c.list.map((it, i) => `<div class="vrow">${it.thumb ? `<img src="${esc(it.thumb)}" alt="">` : '<span>📺</span>'}<b dir="auto">${esc(it.title)}${it.kind === 'playlist' ? ` <em>${it.ch ? '📺 ' + tx('channel') : '☰ ' + tx('playlist')}</em>` : ''}</b>
          <button class="link" data-v="del" data-i="${i}">${tx('del')}</button></div>`).join('') || `<small>${tx('empty')}</small>`}</section>
        ${PRESETS.some(x => !has(x)) ? `<section class="vbox"><b>⭐ ${tx('suggested')}</b>${PRESETS.map((it, i) => has(it) ? '' : `<div class="vrow"><img src="${esc(it.thumb)}" alt=""><b dir="auto">${esc(it.title)} <em>${it.ch ? '📺 ' + tx('channel') : '☰ ' + tx('playlist')}</em></b>
          <button class="btn go vsugg" data-v="preset" data-i="${i}">${tx('add')}</button></div>`).join('')}</section>` : ''}
        <section class="vbox"><b>⭐ ${tx('price')}</b>${pick('price', [5, 10, 15, 20, 30], price())}
          <b>⏱️ ${tx('unlock')}</b>${pick('unlock', [10, 15, 20, 30], unlockMin())}
          <b>📅 ${tx('cap')}</b>${pick('cap', [30, 45, 60, 90, 120], cap())}
          <small>${tx('opened', Math.round(u.sec / 60), u.paid, cap())}${u.extra ? ` · +${u.extra}` : ''}</small><button class="btn off" data-v="more">${tx('more15')}</button>
          <b>${tx('afterQ')}</b><div class="seg">${[[true, 'on'], [false, 'off']].map(([v, k]) => `<button class="${!!c.after === v ? 'on' : ''}" data-v="after" data-m="${v}">${tx(k)}</button>`).join('')}</div></section>
      </main>`;
  }
  let parentOpen = false;
  async function addLink() {
    const input = document.getElementById('vlink'), msg = document.getElementById('vaddmsg'), it = parseLink(input.value);
    const show = t => { msg.textContent = t; msg.hidden = false; };
    if (!it) return show(tx(/youtube\.com\/@/.test(input.value) ? 'handle' : 'badLink'));
    if (cfg().list.some(x => x.kind === it.kind && x.id === it.id)) return show(tx('have'));
    show(tx('adding'));
    let info = null;
    try { info = await lookup(it); } catch (e) { return show(tx('offline')); }
    if (!info) return show(tx('notFound'));
    cfg().list.unshift(Object.assign(it, info)); save(); drawParent();
  }
  root.addEventListener('click', async e => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    const k = b.dataset.v, c = cfg();
    if (k === 'home') return home();
    if (k === 'buy') return buy();
    if (k === 'play') return open(+b.dataset.i);
    if (k === 'parent') { if (await askPin()) { parentOpen = true; drawParent(); } return; }
    if (k === 'list') { parentOpen = false; return draw(); }
    if (k === 'add') return addLink();
    if (k === 'preset') { const it = PRESETS[+b.dataset.i]; if (it && !has(it)) c.list.push(Object.assign({}, it)); save(); return drawParent(); }
    if (k === 'del') { const it = c.list[+b.dataset.i]; if (it && await dialog({ icon: 'missed', text: tx('delQ', it.title), ok: tx('del'), danger: true })) { c.list.splice(+b.dataset.i, 1); save(); } return drawParent(); }
    if (k === 'set') { c[b.dataset.k] = +b.dataset.m; delete c.mins; }
    if (k === 'after') c.after = b.dataset.m === 'true';
    if (k === 'more') { const u = usage(); u.extra += 15; setUsage(u); }
    save(); drawParent();
  });
  root.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'vlink') addLink(); });

  // Android back button and coming back to the app
  window.onBack = () => {
    if (P && P.big) { P.big = false; P.wrap.classList.remove('big'); return true; }
    if (P) { close(); return true; }
    if (parentOpen) { parentOpen = false; draw(); return true; }
    home(); return true;
  };
  window.wake = () => { if (!P && !parentOpen) draw(); };
  draw();
  window.VideosTest = { parseLink }; // for the browser test
})();
