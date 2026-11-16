// Star Hero extras (1.9): hero dress-up shop, homework photo proof, parent voice cheers, Ramadan mode,
// good deeds + adhkar, Hero of the Week certificate, home-screen widget data and the weekly automatic backup.
// Loaded before app.js. It uses app.js / logic.js globals (db, st, t, lang, save, render, today, gain, cheer, dialog, ic,
// hero, report, dayOf, addDays, Prayers, Share ...) only when called, never while loading.
// app.js hooks: Extras.install(actions), decor() in hero(), shop() in rewards(), homeTop()/homeDeeds() in home(),
// approveRows()/photoTag() in pApprove(), settings() in pSettings(), certButton() in pReport(), after(app) in render(),
// saved() in save().
const Extras = (() => {
  const L = {
    en: {
      shop: 'Hero dress-up', shopSub: 'Spend stars on cool looks for your hero!', wear: 'Wear', wearing: 'Wearing', need: '{0} more',
      buyQ: 'Buy {0} for {1} stars?', buy: 'Buy', hat: 'Hats', eyes: 'Glasses', pet: 'Sidekicks', aura: 'Super powers',
      snapTitle: 'Show your homework!', snapSub: 'Take a photo of your finished homework', snap: 'Take photo', retake: 'Again', send: 'Send', cancel: 'Cancel',
      noCam: 'The camera is not available. Send without a photo?', sendNo: 'Send', photo: 'Homework photo',
      voice: 'Your voice cheers', voiceSub: 'Record short cheers (up to 8 seconds). One plays when your child sees the stars you gave.',
      rec: 'Record a cheer', stop: 'Stop', recording: 'Recording… {0}', delQ: 'Delete this cheer?', del: 'Delete', noMic: 'The microphone is not available.',
      maxVoice: 'You can keep 5 cheers. Delete one first.', cheerN: 'Cheer {0}',
      ramadan: 'Ramadan Kareem', rDay: 'Day {0} of Ramadan', iftarIn: 'Iftar in {0}', iftarNow: 'Iftar time! Bon appétit', suhoor: 'Suhoor ends at {0}',
      fastQ: 'Did you fast today?', fastFull: 'Full day', fastHalf: 'Half day', fastSent: 'Waiting for parent', fastDone: 'You fasted! {0}',
      ramadanMode: 'Ramadan mode', rAuto: 'Auto', khatma: 'Plan a Ramadan khatma', notRamadan: 'Ramadan mode is off. Turn it on first.',
      khatmaSet: 'Quran is now {0} pages a day, enough to finish the whole Quran by the end of Ramadan.', noQuran: 'Add a Quran mission first.',
      deeds: 'Good deeds today', deedBtn: 'I did a good deed!', deedQ: 'What good deed did you do?', deedMax: 'Wow, so many good deeds today! Tell your parents.',
      d_help: 'Helped my parents', d_share: 'Shared with someone', d_salam: 'Said salam first', d_kind: 'Said kind words', d_tidy: 'Tidied up', d_sadaqa: 'Gave charity',
      fastK: 'Fasting', deedK: 'Good deed', full: 'full day', half: 'half day',
      adhkar: 'Add morning & evening adhkar missions', adhkarM: 'Morning adhkar', adhkarE: 'Evening adhkar', adhkarAdded: 'Two adhkar missions were added.', adhkarHave: 'The adhkar missions are already there.',
      cert: 'Hero of the Week certificate', certTitle: 'HERO OF THE WEEK', certFor: 'This certificate is proudly given to', certFrom: 'With love, from your proud parents',
      certMsg: '{0} is our Hero of the Week! ⭐', cStars: 'Stars earned', cDays: 'Full days', cStreak: 'Day streak', cPrayers: 'Prayers', cPages: 'Quran pages', cDeeds: 'Good deeds',
      extras: 'More', photoOn: 'Ask for a homework photo', shopOn: 'Hero dress-up shop', on: 'On', off: 'Off',
      autoB: 'Weekly automatic backup', autoBSub: 'Choose a place once (Google Drive is best). The app saves a fresh backup there every week by itself.',
      autoPick: 'Choose where to save', autoNow: 'Back up now', autoLast: 'Last backup: {0}', autoNever: 'No backup yet', autoOk: 'Backup saved!',
      autoFail: 'Could not save the backup. Choose the place again.', autoPhone: 'Works in the phone app.',
    },
    ar: {
      shop: 'خزانة البطل', shopSub: 'اصرف نجومك على إطلالات رائعة لبطلك!', wear: 'البس', wearing: 'يلبسه', need: 'بقي {0}',
      buyQ: 'تشتري {0} مقابل {1} نجمة؟', buy: 'اشترِ', hat: 'القبعات', eyes: 'النظارات', pet: 'الأصدقاء', aura: 'القوى الخارقة',
      snapTitle: 'أرنا واجبك!', snapSub: 'صوّر واجبك بعد أن تنهيه', snap: 'صوّر', retake: 'مرة أخرى', send: 'أرسل', cancel: 'إلغاء',
      noCam: 'الكاميرا غير متاحة. ترسلها بدون صورة؟', sendNo: 'أرسل', photo: 'صورة الواجب',
      voice: 'تشجيع بصوتك', voiceSub: 'سجّل جملاً قصيرة للتشجيع (حتى 8 ثوانٍ). يسمع طفلك واحدة منها عندما يرى النجوم التي أعطيتها.',
      rec: 'سجّل تشجيعاً', stop: 'إيقاف', recording: 'جارٍ التسجيل… {0}', delQ: 'حذف هذا التسجيل؟', del: 'حذف', noMic: 'الميكروفون غير متاح.',
      maxVoice: 'يمكنك حفظ 5 تسجيلات. احذف واحداً أولاً.', cheerN: 'تشجيع {0}',
      ramadan: 'رمضان كريم', rDay: 'اليوم {0} من رمضان', iftarIn: 'الإفطار بعد {0}', iftarNow: 'حان وقت الإفطار! بالهناء والشفاء', suhoor: 'ينتهي السحور الساعة {0}',
      fastQ: 'هل صمت اليوم؟', fastFull: 'يوم كامل', fastHalf: 'نصف يوم', fastSent: 'بانتظار الوالدين', fastDone: 'صمت اليوم! {0}',
      ramadanMode: 'وضع رمضان', rAuto: 'تلقائي', khatma: 'خطة ختم القرآن في رمضان', notRamadan: 'وضع رمضان متوقف. شغّله أولاً.',
      khatmaSet: 'أصبح ورد القرآن {0} صفحة يومياً، وهذا يكفي لختم القرآن كاملاً قبل نهاية رمضان.', noQuran: 'أضف مهمة القرآن أولاً.',
      deeds: 'أعمال الخير اليوم', deedBtn: 'فعلت عملاً طيباً!', deedQ: 'ما العمل الطيب الذي فعلته؟', deedMax: 'ما شاء الله، أعمال خير كثيرة اليوم! أخبر والديك.',
      d_help: 'ساعدت والديّ', d_share: 'شاركت غيري', d_salam: 'بدأت بالسلام', d_kind: 'قلت كلاماً طيباً', d_tidy: 'رتّبت المكان', d_sadaqa: 'تصدّقت',
      fastK: 'الصيام', deedK: 'عمل طيب', full: 'يوم كامل', half: 'نصف يوم',
      adhkar: 'إضافة مهمتي أذكار الصباح والمساء', adhkarM: 'أذكار الصباح', adhkarE: 'أذكار المساء', adhkarAdded: 'أُضيفت مهمتا الأذكار.', adhkarHave: 'مهمتا الأذكار موجودتان بالفعل.',
      cert: 'شهادة بطل الأسبوع', certTitle: 'بطل الأسبوع', certFor: 'تُمنح هذه الشهادة بكل فخر إلى', certFrom: 'مع حبنا، من والديك الفخورين بك',
      certMsg: '{0} هو بطل الأسبوع! ⭐', cStars: 'نجوم مكتسبة', cDays: 'أيام كاملة', cStreak: 'أيام متتالية', cPrayers: 'الصلوات', cPages: 'صفحات القرآن', cDeeds: 'أعمال الخير',
      extras: 'المزيد', photoOn: 'طلب صورة للواجب', shopOn: 'متجر خزانة البطل', on: 'تشغيل', off: 'إيقاف',
      autoB: 'نسخ احتياطي أسبوعي تلقائي', autoBSub: 'اختر مكاناً مرة واحدة (Google Drive هو الأفضل). يحفظ التطبيق نسخة جديدة هناك كل أسبوع تلقائياً.',
      autoPick: 'اختر مكان الحفظ', autoNow: 'انسخ الآن', autoLast: 'آخر نسخة: {0}', autoNever: 'لا توجد نسخة بعد', autoOk: 'تم حفظ النسخة الاحتياطية!',
      autoFail: 'تعذّر حفظ النسخة. اختر المكان مرة أخرى.', autoPhone: 'تعمل داخل تطبيق الهاتف.',
    },
  };
  const tx = (k, ...a) => ((L[lang()] || L.en)[k] ?? L.en[k] ?? k).replace(/\{(\d)\}/g, (_, i) => a[i]);
  const cfg = () => db.x || (db.x = { photo: true, shop: true, ramadan: 'auto', auto: { on: false, last: 0, place: '' } });
  const DAY = 864e5;

  // ---------------------------------------------------------------- hero dress-up
  const CROWN = '<svg viewBox="0 0 100 60"><path d="M8 52 L4 14 L28 32 L50 4 L72 32 L96 14 L92 52 Z" fill="#FFC531" stroke="#C77F00" stroke-width="4" stroke-linejoin="round"/><rect x="8" y="46" width="84" height="11" rx="4" fill="#E89A00"/><circle cx="50" cy="35" r="6.5" fill="#FF4D6D"/><circle cx="27" cy="41" r="4.5" fill="#3EC1FF"/><circle cx="73" cy="41" r="4.5" fill="#7BE052"/><circle cx="4" cy="14" r="4.5" fill="#FFE27A"/><circle cx="50" cy="4" r="4.5" fill="#FFE27A"/><circle cx="96" cy="14" r="4.5" fill="#FFE27A"/></svg>';
  const SHADES = '<svg viewBox="0 0 100 34"><path d="M2 7 H98" stroke="#1B1B2F" stroke-width="5" stroke-linecap="round"/><path d="M6 7 h37 v8 a15 15 0 0 1 -15 15 h-7 a15 15 0 0 1 -15 -15 z" fill="#1B1B2F"/><path d="M57 7 h37 v8 a15 15 0 0 1 -15 15 h-7 a15 15 0 0 1 -15 -15 z" fill="#1B1B2F"/><path d="M12 11 h11 l-9 9 z M63 11 h11 l-9 9 z" fill="#fff" opacity=".55"/></svg>';
  const HEARTS = '<svg viewBox="0 0 100 34"><path d="M40 8 H60" stroke="#C2185B" stroke-width="4"/><path d="M22 32 C2 19 2 3 13 3 C18 3 22 7 22 9 C22 7 26 3 31 3 C42 3 42 19 22 32 Z M78 32 C58 19 58 3 69 3 C74 3 78 7 78 9 C78 7 82 3 87 3 C98 3 98 19 78 32 Z" fill="#FF4D8D" stroke="#C2185B" stroke-width="3"/><path d="M11 9 q3 -3 6 -1 M67 9 q3 -3 6 -1" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
  const ALIEN = '<svg viewBox="0 0 100 110"><path d="M34 22 L26 4 M66 22 L74 4" stroke="#5BC236" stroke-width="5" stroke-linecap="round"/><circle cx="26" cy="4" r="6" fill="#FF7AB6"/><circle cx="74" cy="4" r="6" fill="#FF7AB6"/><ellipse cx="50" cy="62" rx="40" ry="44" fill="#7BE052"/><ellipse cx="50" cy="70" rx="26" ry="24" fill="#A6F07F"/><circle cx="50" cy="48" r="17" fill="#fff"/><circle cx="52" cy="50" r="9" fill="#1B1B2F"/><circle cx="55" cy="46" r="3" fill="#fff"/><path d="M36 78 q14 12 28 0" stroke="#2E7D1F" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="28" cy="72" r="5" fill="#FF9EC7" opacity=".7"/><circle cx="72" cy="72" r="5" fill="#FF9EC7" opacity=".7"/></svg>';
  const ITEMS = [
    { id: 'crown', slot: 'hat', cost: 40, en: 'Golden crown', ar: 'تاج ذهبي', art: CROWN },
    { id: 'orbit', slot: 'hat', cost: 30, en: 'Star ring', ar: 'حلقة النجوم', art: '<span class="xorbit-ic">✦ ✦ ✦</span>' },
    { id: 'shades', slot: 'eyes', cost: 20, en: 'Cool shades', ar: 'نظارة شمسية', art: SHADES },
    { id: 'hearts', slot: 'eyes', cost: 20, en: 'Heart glasses', ar: 'نظارة القلوب', art: HEARTS },
    { id: 'lion', slot: 'pet', cost: 60, en: 'Leo the lion', ar: 'الأسد ليو', art: '<img src="pet-lion.webp" alt="">' },
    { id: 'twinkle', slot: 'pet', cost: 50, en: 'Twinkle the star', ar: 'النجمة لمعة', art: '<img src="star.webp" alt="">' },
    { id: 'zib', slot: 'pet', cost: 70, en: 'Zib the alien', ar: 'الفضائي زيب', art: ALIEN },
    { id: 'gold', slot: 'aura', cost: 35, en: 'Golden glow', ar: 'الهالة الذهبية', art: '<i class="xsw gold"></i>' },
    { id: 'rainbow', slot: 'aura', cost: 45, en: 'Rainbow power', ar: 'قوة قوس قزح', art: '<i class="xsw rainbow"></i>' },
    { id: 'fire', slot: 'aura', cost: 45, en: 'Fire power', ar: 'قوة النار', art: '<i class="xsw fire"></i>' },
  ];
  const SLOTS = ['hat', 'eyes', 'pet', 'aura'];
  const wear = (kid = st) => kid.wear || (kid.wear = { own: [], on: {} });
  const item = id => ITEMS.find(i => i.id === id);

  // what the hero has on, drawn over the hero picture (positions are % of the picture)
  function decor(kid = st) {
    if (!kid || !kid.wear) return '';
    const on = kid.wear.on;
    let h = '';
    if (on.aura) h += `<span class="xd xaura ${on.aura}"></span>`;
    if (on.hat === 'crown') h += `<span class="xd xcrown">${CROWN}</span>`;
    if (on.hat === 'orbit') h += `<span class="xd xorbit">${'<i>✦</i>'.repeat(6)}</span>`;
    if (on.eyes) h += `<span class="xd xeyes">${on.eyes === 'shades' ? SHADES : HEARTS}</span>`;
    if (on.pet) h += `<span class="xd xpet ${on.pet}">${item(on.pet).art}</span>`;
    return h;
  }

  function shop() {
    if (cfg().shop === false) return '';
    const w = wear(), nm = i => i[lang() === 'ar' ? 'ar' : 'en'];
    return `<section class="xshop"><div class="xshop-head">${hero('happy', 'xprev')}<div><h2>${tx('shop')}</h2><p>${tx('shopSub')}</p></div></div>
      ${SLOTS.map(slot => `<h3>${tx(slot)}</h3><div class="xgrid">${ITEMS.filter(i => i.slot === slot).map(i => {
        const own = w.own.includes(i.id), on = w.on[slot] === i.id, can = st.stars >= i.cost;
        return `<button class="xitem ${on ? 'on' : ''} ${own ? 'own' : ''}" data-a="${own ? 'xWear' : 'xBuy'}" data-id="${i.id}" ${!own && !can ? 'disabled' : ''}>
          <span class="xart ${i.slot}">${i.art}</span><b>${nm(i)}</b>
          <small>${on ? '✓ ' + tx('wearing') : own ? tx('wear') : can ? `${i.cost} ⭐` : tx('need', i.cost - st.stars) + ' ⭐'}</small></button>`;
      }).join('')}</div>`).join('')}</section>`;
  }

  // ---------------------------------------------------------------- homework photo proof
  const PHOTO_ICONS = ['homework', '📚', '🧮', 'books', 'calc'];
  const needsPhoto = task => !!task && cfg().photo !== false && task.type !== 'prayer' && PHOTO_ICONS.includes(task.icon);
  let dbp;
  const idb = () => dbp || (dbp = new Promise((ok, no) => {
    const r = indexedDB.open('starhero', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('photos');
    r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error);
  }));
  const putPhoto = (k, v) => idb().then(d => new Promise(ok => { const x = d.transaction('photos', 'readwrite'); x.objectStore('photos').put(v, k); x.oncomplete = () => ok(true); x.onerror = () => ok(false); })).catch(() => false);
  const getPhoto = k => idb().then(d => new Promise(ok => { const r = d.transaction('photos').objectStore('photos').get(k); r.onsuccess = () => ok(r.result || null); r.onerror = () => ok(null); })).catch(() => null);
  const sweepPhotos = () => idb().then(d => { // photos are only kept 3 weeks
    const cut = addDays(today(), -21), cur = d.transaction('photos', 'readwrite').objectStore('photos').openCursor();
    cur.onsuccess = e => { const c = e.target.result; if (!c) return; if (!c.value || c.value.day < cut) c.delete(); c.continue(); };
  }).catch(() => {});
  const photoKey = (kid, day, id) => `${kid.id}-${day}-${id}`;

  // full-screen camera; resolves with a JPEG data URL, 'none' (send without a photo) or null (cancelled)
  function snap() {
    return new Promise(async done => {
      let stream;
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false }); }
      catch (e) { return done(await dialog({ icon: 'camera', text: tx('noCam'), ok: tx('sendNo') }) ? 'none' : null); }
      const el = document.createElement('div');
      el.className = 'xcam';
      el.innerHTML = `<div class="xcam-top"><b>${tx('snapTitle')}</b><small>${tx('snapSub')}</small></div>
        <div class="xcam-view"><video playsinline autoplay muted></video><img alt=""></div>
        <div class="xcam-bar"><button class="xc no" data-x="cancel">${ic('x')}<span>${tx('cancel')}</span></button>
          <button class="xc big" data-x="snap">${ic('camera')}<span>${tx('snap')}</span></button>
          <button class="xc no" data-x="again">${ic('undo')}<span>${tx('retake')}</span></button>
          <button class="xc go" data-x="send">${ic('check')}<span>${tx('send')}</span></button></div>`;
      document.body.appendChild(el);
      const v = el.querySelector('video'), im = el.querySelector('img'), back = window.onBack;
      v.srcObject = stream;
      let shot = null;
      const end = val => { stream.getTracks().forEach(tr => tr.stop()); el.remove(); window.onBack = back; done(val); };
      window.onBack = () => { end(null); return true; };
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-x]');
        if (!b) return;
        e.stopPropagation();
        const x = b.dataset.x;
        if (x === 'cancel') end(null);
        else if (x === 'send' && shot) end(shot);
        else if (x === 'again') { shot = null; el.classList.remove('shot'); }
        else if (x === 'snap' && v.videoWidth) {
          const s = Math.min(1, 900 / Math.max(v.videoWidth, v.videoHeight)), c = document.createElement('canvas');
          c.width = v.videoWidth * s | 0; c.height = v.videoHeight * s | 0;
          c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
          shot = c.toDataURL('image/jpeg', .62); im.src = shot; el.classList.add('shot');
          if (typeof tune === 'function') tune([880, 1320]);
        }
      });
    });
  }
  const photoTag = (day, task) => needsPhoto(task) ? `<img class="xph" data-ph="${photoKey(st, day, task.id)}" data-a="xPhoto" alt="${tx('photo')}">` : '';
  function showPhoto(src) {
    const el = document.createElement('div');
    el.className = 'xbig'; el.innerHTML = `<img src="${src}" alt="">`;
    const back = window.onBack, close = () => { el.remove(); window.onBack = back; };
    window.onBack = () => { close(); return true; };
    el.onclick = close; document.body.appendChild(el);
  }

  // ---------------------------------------------------------------- good deeds and fasting (approved by the parent)
  const DEEDS = [['help', '🤝'], ['share', '🍪'], ['salam', '👋'], ['kind', '💬'], ['tidy', '🧹'], ['sadaqa', '💝']];
  const items = (kid, day) => { const d = dayOf(kid, day); return d.x || (d.x = []); };
  const newItem = (k, w) => { items(st, today()).push({ id: Date.now() % 1e9, k, w, s: 'pending' }); };
  const more = it => window.More && More.item(it); // 2.1 items: revision, book, make-it-right (more.js)
  const itemName = it => more(it) ? more(it).name : it.k === 'fast' ? `${tx('fastK')} · ${tx(it.w)}` : tx('d_' + it.w);
  const itemIcon = it => more(it) ? more(it).icon : it.k === 'fast' ? '🌙' : (DEEDS.find(d => d[0] === it.w) || [, '✨'])[1];
  const itemKind = it => more(it) ? more(it).kind : tx(it.k === 'fast' ? 'fastK' : 'deedK');

  function homeDeeds() {
    const list = items(st, today()).filter(i => i.k === 'deed');
    return `<section class="xcard xdeeds"><div class="xcard-h"><span class="xbig-ic">🤲</span><b>${tx('deeds')}</b></div>
      ${list.length ? `<div class="xchips">${list.map(i => `<span class="xchip ${i.s}">${itemIcon(i)} ${tx('d_' + i.w)} ${i.s === 'done' ? `<em>+${i.r}⭐</em>` : i.s === 'pending' ? '⏳' : ''}</span>`).join('')}</div>` : ''}
      <button class="btn go xdeed-btn" data-a="xDeed">${tx('deedBtn')}</button></section>`;
  }

  function approveRows() {
    const out = [];
    for (const day of Object.keys(st.days).sort()) for (const it of (st.days[day].x || [])) if (it.s === 'pending') out.push([day, it]);
    if (!out.length) return '';
    const dayName = d => d === today() ? t('todayW') : parse(d).toLocaleDateString(lang(), { weekday: 'long', day: 'numeric', month: 'short' });
    return out.map(([day, it]) => `<div class="row pend xrow"><span class="ico xemo">${itemIcon(it)}</span>
      <span class="txt"><b>${itemKind(it)}</b><small>${dayName(day)} · ${itemName(it)}</small></span>
      <button class="no" data-a="xNo" data-id="${it.id}" data-day="${day}">${ic('x')}</button>
      <small class="rateq">${t('rateQ')}</small>
      <span class="rate" dir="ltr">${[1, 2, 3, 4, 5].map(r => `<button data-a="xRate" data-id="${it.id}" data-day="${day}" data-r="${r}"><span>${star.repeat(r)}</span><b>${r}</b></button>`).join('')}</span></div>`).join('');
  }
  const pendingCount = kid => Object.values(kid.days).reduce((n, d) => n + (d.x || []).filter(i => i.s === 'pending').length, 0);

  // ---------------------------------------------------------------- Ramadan
  const hijri = (d = new Date()) => {
    for (const cal of ['islamic-umalqura', 'islamic']) {
      try {
        const p = new Intl.DateTimeFormat('en-u-ca-' + cal, { month: 'numeric', day: 'numeric' }).formatToParts(d);
        return { m: +p.find(x => x.type === 'month').value, d: +p.find(x => x.type === 'day').value };
      } catch (e) { /* next calendar */ }
    }
    return { m: 0, d: 0 };
  };
  const ramadanOn = () => { const m = cfg().ramadan; return m === 'on' || (m !== 'off' && hijri().m === 9); };
  const city = () => (typeof prayerCfg === 'function' && prayerCfg().city) || 'cairo';
  const clock = d => d.toLocaleTimeString(lang(), { hour: 'numeric', minute: '2-digit' });
  function iftarText() {
    if (!window.Prayers) return '';
    try {
      const now = new Date(), [fajr, , , maghrib] = Prayers.times(city(), now);
      if (now < maghrib) {
        const m = Math.round((maghrib - now) / 6e4), h = Math.floor(m / 60);
        return tx('iftarIn', h ? `${h}:${String(m % 60).padStart(2, '0')}` : `${m} min`);
      }
      if (now - maghrib < 45 * 6e4) return tx('iftarNow');
      return tx('suhoor', clock(Prayers.times(city(), new Date(now.getTime() + DAY))[0]));
    } catch (e) { return ''; }
  }
  function homeTop() {
    if (!ramadanOn()) return '';
    const f = items(st, today()).find(i => i.k === 'fast'), h = hijri();
    return `<section class="xcard xramadan"><span class="xlant l"></span><span class="xlant r"></span><span class="xmoon"></span>
      <div class="xr-t"><b>${tx('ramadan')}</b>${h.m === 9 ? `<small>${tx('rDay', h.d)}</small>` : ''}<span class="xiftar">${iftarText()}</span></div>
      ${f ? `<div class="xfast ${f.s}">${f.s === 'done' ? tx('fastDone', '+' + f.r + '⭐') : f.s === 'pending' ? '⏳ ' + tx('fastSent') : ''}</div>`
        : `<div class="xfastq"><span>${tx('fastQ')}</span><div><button class="btn go" data-a="xFast" data-id="full">🌙 ${tx('fastFull')}</button><button class="btn" data-a="xFast" data-id="half">⭐ ${tx('fastHalf')}</button></div></div>`}
    </section>`;
  }

  // ---------------------------------------------------------------- parent voice cheers
  const VKEY = 'starhero-voice';
  const voices = () => { try { return JSON.parse(localStorage.getItem(VKEY) || '[]'); } catch (e) { return []; } };
  const setVoices = v => { try { localStorage.setItem(VKEY, JSON.stringify(v)); return true; } catch (e) { return false; } };
  async function record() {
    if (voices().length >= 5) return dialog({ icon: 'missed', text: tx('maxVoice'), cancel: null });
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { return dialog({ icon: 'missed', text: tx('noMic'), cancel: null }); }
    if (!window.MediaRecorder) { stream.getTracks().forEach(x => x.stop()); return dialog({ icon: 'missed', text: tx('noMic'), cancel: null }); }
    const rec = new MediaRecorder(stream), chunks = [], el = document.createElement('div');
    el.className = 'xrec'; el.innerHTML = `<div class="xrec-card"><i class="xdot"></i><b></b><button class="btn go">${tx('stop')}</button></div>`;
    document.body.appendChild(el);
    let left = 8;
    const label = el.querySelector('b'), tick = () => { label.textContent = tx('recording', left); };
    tick();
    const timer = setInterval(() => { if (--left <= 0) rec.state === 'recording' && rec.stop(); tick(); }, 1000);
    el.querySelector('button').onclick = () => rec.state === 'recording' && rec.stop();
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      clearInterval(timer); stream.getTracks().forEach(x => x.stop()); el.remove();
      const fr = new FileReader();
      fr.onload = () => { const v = voices(); v.push({ id: Date.now(), url: fr.result }); setVoices(v); render(); };
      fr.readAsDataURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
    };
    rec.start();
  }
  const playVoice = url => { try { const a = new Audio(url); a.play().catch(() => {}); } catch (e) { /* no sound */ } };
  function voiceSettings() {
    const v = voices();
    return `<div class="edit"><b>${tx('voice')}</b><small class="hintx">${tx('voiceSub')}</small>
      ${v.map((c, i) => `<div class="xvoice"><button class="yes wide" data-a="xPlay" data-id="${c.id}">▶ ${tx('cheerN', i + 1)}</button><button class="link" data-a="xDelVoice" data-id="${c.id}">${tx('del')}</button></div>`).join('')}
      <button class="btn" data-a="xRec">🎙️ ${tx('rec')}</button></div>`;
  }

  // ---------------------------------------------------------------- Hero of the Week certificate
  const loadImg = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  async function certificate() {
    const ar = lang() === 'ar', W = 1080, H = 1350, r = report(st, today());
    const deeds = r.days.reduce((n, d) => n + ((st.days[d] || {}).x || []).filter(i => i.k === 'deed' && i.s === 'done').length, 0);
    try { await document.fonts.load('800 40px Baloo'); } catch (e) { /* system font */ }
    const cv = Object.assign(document.createElement('canvas'), { width: W, height: H }), c = cv.getContext('2d');
    c.direction = ar ? 'rtl' : 'ltr'; c.textAlign = 'center';
    const F = (s, w = 800) => `${w} ${s}px Baloo, system-ui, sans-serif`;
    // parchment with a gold frame
    const bg = c.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 800); bg.addColorStop(0, '#FFFBEA'); bg.addColorStop(1, '#FCE7B2');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    const gold = c.createLinearGradient(0, 0, W, H); gold.addColorStop(0, '#F7D35C'); gold.addColorStop(.5, '#C8901F'); gold.addColorStop(1, '#F7D35C');
    c.strokeStyle = gold; c.lineWidth = 28; c.strokeRect(34, 34, W - 68, H - 68);
    c.strokeStyle = '#C8901F'; c.lineWidth = 4; c.strokeRect(70, 70, W - 140, H - 140);
    const starAt = (x, y, R, col) => { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R * .45 : R; c.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } c.closePath(); c.fillStyle = col; c.fill(); };
    [[110, 110], [W - 110, 110], [110, H - 110], [W - 110, H - 110]].forEach(([x, y]) => starAt(x, y, 34, '#F2B705'));
    // ribbon title
    c.fillStyle = '#7B3FE4'; c.beginPath(); c.roundRect(160, 120, W - 320, 120, 30); c.fill();
    c.fillStyle = '#fff'; c.font = F(ar ? 76 : 68); c.fillText(tx('certTitle'), W / 2, 205);
    // the hero in a golden circle
    const hb = await loadImg('hero-body.webp');
    c.save(); c.beginPath(); c.arc(W / 2, 470, 175, 0, 7); c.fillStyle = '#BFE6FF'; c.fill(); c.clip();
    if (hb) { const s = 360 / hb.width; c.drawImage(hb, W / 2 - 180, 300, 360, hb.height * s); }
    c.restore();
    c.lineWidth = 14; c.strokeStyle = gold; c.beginPath(); c.arc(W / 2, 470, 175, 0, 7); c.stroke();
    c.fillStyle = '#6B5B3E'; c.font = F(34, 600); c.fillText(tx('certFor'), W / 2, 715);
    c.fillStyle = '#C2185B'; c.font = F(104); c.fillText(st.name, W / 2, 830);
    const range = `${parse(r.days[0]).toLocaleDateString(lang(), { day: 'numeric', month: 'long' })} – ${parse(r.days[6]).toLocaleDateString(lang(), { day: 'numeric', month: 'long', year: 'numeric' })}`;
    c.fillStyle = '#6B5B3E'; c.font = F(30, 600); c.fillText(range, W / 2, 880);
    // stats
    const stats = [[r.plus, 'cStars', '#F2B705'], [r.full + '/7', 'cDays', '#1FB65A'], [st.streak, 'cStreak', '#FF7A1A']];
    if (st.tasks.some(x => x.type === 'prayer')) stats.push([r.prayers + '/35', 'cPrayers', '#1E8FF0']);
    if (st.tasks.some(x => x.pages > 0)) stats.push([r.pages, 'cPages', '#12AFA0']);
    if (deeds) stats.push([deeds, 'cDeeds', '#F0508F']);
    const show = stats.slice(0, 4), bw = 200, gap = 22, x0 = (W - (show.length * bw + (show.length - 1) * gap)) / 2;
    show.forEach(([v, k, col], i) => {
      const x = ar ? W - (x0 + i * (bw + gap)) - bw : x0 + i * (bw + gap);
      c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x, 930, bw, 170, 26); c.fill();
      c.strokeStyle = col; c.lineWidth = 6; c.stroke();
      c.fillStyle = col; c.font = F(64); c.fillText(String(v), x + bw / 2, 1015);
      c.fillStyle = '#6B5B3E'; c.font = F(26, 700); c.fillText(tx(k), x + bw / 2, 1065);
    });
    c.fillStyle = '#7B3FE4'; c.font = F(38, 700); c.fillText(tx('certFrom') + ' ❤️', W / 2, 1185);
    starAt(140, 1172, 16, '#F2B705'); starAt(W - 140, 1172, 16, '#F2B705');
    const png = cv.toDataURL('image/png');
    if (window.Share) Share.image(png, `hero-of-the-week-${today()}.png`, tx('certMsg', st.name));
    return png;
  }

  // ---------------------------------------------------------------- weekly automatic backup (Android)
  const auto = () => cfg().auto || (cfg().auto = { on: false, last: 0, place: '' });
  function autoCheck(force) {
    if (!db || !auto().on || !window.Android || !Android.autoBackupWrite) return;
    if (!force && Date.now() - (auto().last || 0) < 7 * DAY) return;
    let ok = false;
    try { ok = Android.autoBackupWrite(JSON.stringify(db)); } catch (e) { ok = false; }
    if (ok) { auto().last = Date.now(); save(); }
    if (force) dialog({ icon: ok ? 'done' : 'missed', text: tx(ok ? 'autoOk' : 'autoFail'), cancel: null });
  }
  window.onAutoBackupPicked = (ok, place) => { // called by Android after the file picker
    if (!ok) return;
    Object.assign(auto(), { on: true, place: place || '' });
    autoCheck(true); render();
  };
  function autoSettings() {
    const a = auto(), phone = !!(window.Android && Android.autoBackupPick);
    return `<div class="edit"><b>${tx('autoB')}</b><small class="hintx">${tx('autoBSub')}</small>
      ${!phone ? `<small class="hintx">${tx('autoPhone')}</small>` : a.on ? `<small class="hintx">☁️ ${esc(a.place || '')} · ${a.last ? tx('autoLast', new Date(a.last).toLocaleDateString(lang(), { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })) : tx('autoNever')}</small>
        <div class="line"><button class="btn" data-a="xAutoNow">💾 ${tx('autoNow')}</button><button class="btn off" data-a="xAutoOff">${tx('off')}</button></div>`
        : `<button class="btn" data-a="xAutoPick">☁️ ${tx('autoPick')}</button>`}</div>`;
  }

  // ---------------------------------------------------------------- parent settings section
  const seg = (key, opts, val) => `<div class="seg grow">${opts.map(([v, l]) => `<button class="${val === v ? 'on' : ''}" data-a="xSet" data-id="${key}" data-v="${v}">${l}</button>`).join('')}</div>`;
  function settings() {
    const x = cfg();
    return `<h3>${tx('extras')}</h3>
      <div class="edit"><label><span>${tx('photoOn')}</span>${seg('photo', [['1', tx('on')], ['0', tx('off')]], x.photo === false ? '0' : '1')}</label>
        <label><span>${tx('shopOn')}</span>${seg('shop', [['1', tx('on')], ['0', tx('off')]], x.shop === false ? '0' : '1')}</label>
        <button class="btn off" data-a="xAdhkar">🤲 ${tx('adhkar')}</button></div>
      <div class="edit"><label><span>🌙 ${tx('ramadanMode')}</span>${seg('ramadan', [['auto', tx('rAuto')], ['on', tx('on')], ['off', tx('off')]], x.ramadan || 'auto')}</label>
        <button class="btn off" data-a="xKhatma">📖 ${tx('khatma')}</button></div>
      ${voiceSettings()}${autoSettings()}`;
  }
  const certButton = () => `<button class="btn go xcert" data-a="xCert">🏅 ${tx('cert')}</button>`;

  // ---------------------------------------------------------------- actions (merged into app.js actions)
  const later2 = (opts, fn) => { dialog(opts).then(v => { if (!v) return; fn(v); save(); render(); }); return false; };
  const ACT = {
    xBuy: id => {
      const i = item(id);
      if (!i || st.stars < i.cost) return false;
      return later2({ icon: 'gift', text: tx('buyQ', i[lang() === 'ar' ? 'ar' : 'en'], i.cost), ok: tx('buy') }, () => {
        if (st.stars < i.cost) return;
        const w = wear(); spend(st, today(), i.cost, ['shop', i[lang() === 'ar' ? 'ar' : 'en']]); w.own.push(i.id); w.on[i.slot] = i.id;
        if (window.celebrate) celebrate();
      });
    },
    xWear: id => { const i = item(id), w = wear(); if (!i || !w.own.includes(id)) return false; w.on[i.slot] = w.on[i.slot] === id ? null : id; if (typeof tune === 'function') tune([660, 990]); },
    xPhoto: (id, el) => { if (el.src) showPhoto(el.src); return false; },
    xDeed: () => {
      if (items(st, today()).filter(i => i.k === 'deed').length >= 8) return later2({ icon: 'smiley', text: tx('deedMax'), cancel: null }, () => {});
      const el = document.createElement('div');
      el.className = 'xpick';
      el.innerHTML = `<div class="xpick-card"><h2>${tx('deedQ')}</h2><div class="xpick-grid">${DEEDS.map(([k, e]) => `<button data-d="${k}"><span>${e}</span><b>${tx('d_' + k)}</b></button>`).join('')}</div>
        <button class="link" data-d="">${tx('cancel')}</button></div>`;
      const back = window.onBack, close = () => { el.remove(); window.onBack = back; };
      window.onBack = () => { close(); return true; };
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-d]');
        if (!b && e.target !== el) return;
        e.stopPropagation(); close();
        if (b && b.dataset.d) { newItem('deed', b.dataset.d); if (window.celebrate) celebrate(); save(); render(); }
      });
      document.body.appendChild(el);
      return false;
    },
    xFast: id => { if (!items(st, today()).some(i => i.k === 'fast')) { newItem('fast', id === 'half' ? 'half' : 'full'); if (window.celebrate) celebrate(); } },
    xRate: (id, el) => {
      const it = ((st.days[el.dataset.day] || {}).x || []).find(i => i.id === +id);
      if (!it || it.s !== 'pending') return false;
      it.s = 'done'; it.r = +el.dataset.r; gain(st, el.dataset.day, it.r, [it.k, it.k === 'book' ? it.w : '']);
      if (window.More) More.rated(it, el.dataset.day); // who approved; revision date; make-it-right clears the consequence
      if (typeof cheer === 'function') cheer({ stars: it.r });
    },
    xNo: (id, el) => { const it = ((st.days[el.dataset.day] || {}).x || []).find(i => i.id === +id); if (it && it.s === 'pending') it.s = 'no'; },
    xSet: (key, el) => { const v = el.dataset.v; cfg()[key] = key === 'ramadan' ? v : v === '1'; },
    xAdhkar: () => {
      const ar = lang() === 'ar', have = st.tasks.some(x => x.adhkar);
      if (!have) ['m', 'e'].forEach(k => st.tasks.push({ id: st.nextId++, icon: '🤲', adhkar: k, title: tx(k === 'm' ? 'adhkarM' : 'adhkarE'), target: '', stars: 2, days: [0, 1, 2, 3, 4, 5, 6], since: today() }));
      return later2({ icon: 'dua', text: tx(have ? 'adhkarHave' : 'adhkarAdded'), cancel: null }, () => {}); // saves and redraws after OK
    },
    xKhatma: () => {
      if (!ramadanOn()) return later2({ icon: 'missed', text: tx('notRamadan'), cancel: null }, () => {});
      const q = st.tasks.find(x => x.pages > 0 || x.icon === 'quran');
      if (!q) return later2({ icon: 'missed', text: tx('noQuran'), cancel: null }, () => {});
      const h = hijri(), daysLeft = Math.max(1, (h.m === 9 ? 30 - h.d + 1 : 30)), left = QURAN_PAGES - (st.quran.page || 0);
      q.pages = Math.min(604, Math.ceil(left / daysLeft));
      save(); render();
      return later2({ icon: 'quran', text: tx('khatmaSet', q.pages), cancel: null }, () => {});
    },
    xRec: () => { record(); return false; },
    xPlay: id => { const c = voices().find(v => v.id === +id); if (c) playVoice(c.url); return false; },
    xDelVoice: id => later2({ icon: 'missed', text: tx('delQ'), ok: tx('del'), danger: true }, () => setVoices(voices().filter(v => v.id !== +id))),
    xCert: () => { certificate(); return false; },
    xAutoPick: () => { if (window.Android && Android.autoBackupPick) Android.autoBackupPick(`star-hero-auto-backup.json`); return false; },
    xAutoNow: () => { autoCheck(true); return false; },
    xAutoOff: () => { auto().on = false; },
  };

  // wrap the Complete action: homework-type missions ask for a photo first
  function install(actions) {
    const mark0 = actions.mark;
    actions.mark = (id, el, e) => {
      const task = st.tasks.find(x => x.id === +id), d = st.days[today()] || {};
      if (task && !d[task.id] && needsPhoto(task)) {
        const kid = st, day = today();
        snap().then(async shot => {
          if (!shot) return;
          if (shot !== 'none') await putPhoto(photoKey(kid, day, task.id), { day, img: shot });
          if (st !== kid) return; // a different child was picked meanwhile
          mark0(id, el, e); save(); render();
        });
        return false;
      }
      return mark0(id, el, e);
    };
    Object.assign(actions, ACT);
  }

  // after every render: load photos, play a parent cheer with the celebration, keep the iftar countdown fresh
  let partyShown = false;
  function after(root) {
    root.querySelectorAll('img.xph[data-ph]').forEach(im => getPhoto(im.dataset.ph).then(p => { if (p) { im.src = p.img; im.classList.add('ok'); } else im.remove(); }));
    const party = !!root.querySelector('.party');
    if (party && !partyShown) { const v = voices(); if (v.length) setTimeout(() => playVoice(v[Math.random() * v.length | 0].url), 1400); }
    partyShown = party;
  }
  setInterval(() => { const el = document.querySelector('.xiftar'); if (el) el.textContent = iftarText(); }, 30000);

  // home-screen widget: stars, streak and today's progress of the child on screen
  let wt;
  function saved() {
    if (!window.Android || !Android.widget || !st) return;
    clearTimeout(wt);
    wt = setTimeout(() => {
      try {
        const d = today(), due = dueTasks(st, d), n = due.filter(x => full(st, d, x)).length;
        Android.widget(JSON.stringify({ name: st.name, stars: st.stars, streak: st.streak, done: n, total: due.length,
          line: lang() === 'ar' ? `🔥 ${st.streak} · ${n}/${due.length} اليوم` : `🔥 ${st.streak} · ${n}/${due.length} today` }));
      } catch (e) { /* widget is optional */ }
    }, 800);
  }

  // app opened or back on screen: weekly backup and photo clean-up
  const wake = () => { if (typeof db === 'undefined' || !db) return; autoCheck(false); sweepPhotos(); };
  document.addEventListener('visibilitychange', () => document.hidden || wake());
  setTimeout(wake, 4000);

  return { install, decor, shop, homeTop, homeDeeds, approveRows, pendingCount, photoTag, settings, certButton, after, saved,
    certificate, hijri, ramadanOn, needsPhoto, ITEMS, tx };
})();
window.Extras = Extras; // a top-level const is not on window by itself
