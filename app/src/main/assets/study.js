// Study timer (2.3): "Start" on a mission runs study periods with rests in between, as long as the parent set.
// At every rest a voice says the parent's sentence (default "<name> حانت لحظة استراحة المحارب"), or plays the parent's own recording.
// Focus Guard (monitor.js) uses the same study/rest lengths and voices. Settings live in db.t; minutes per mission in task.mins.
// Uses app.js / logic.js globals (db, st, lang, save, render, today, dialog, ic, esc, tune, hero) and ML.schedule only when called.
// app.js hooks: Study.install(actions), startBtn() in mission(), useGuard() picks Focus Guard or this timer, minsField() in pTasks(), settings() in pSettings().
const Study = (() => {
  const L = {
    en: {
      start: 'Start', study: 'Study time 📚', rest: 'Warrior rest ☕', restTip: 'Stretch, drink water, breathe 💧', left: 'left', of: 'Period {0} of {1}',
      pause: 'Pause', go: 'Go on', done: 'I finished!', stop: 'Stop the timer?', stopOk: 'Stop', finished: 'Time is up! Great work 💪', more: 'Not yet',
      back: '{0}, back to work, hero! 💪', bravo: 'Well done {0}! Time is up.',
      timer: 'Study timer', timerSub: 'Start on a mission runs study periods with a rest in between. The voice speaks when a rest starts.',
      block: 'Study period (minutes)', restM: 'Rest (minutes)', phrase: 'Words when a rest starts', hear: '🔊 Hear it', rec: '🎙️ Record it in your voice', recDel: 'Use the phone voice again',
      recording: 'Recording… {0}', stopRec: 'Stop', noMic: 'The microphone is not available.', recOk: 'Your voice will play at every rest.',
      guard: 'Start on Quran and homework opens', guardCam: 'Focus Guard (camera)', guardTimer: 'Study timer', mins: '⏱️ Timer minutes (0 = no timer)',
    },
    ar: {
      start: 'ابدأ', study: 'وقت المذاكرة 📚', rest: 'استراحة المحارب ☕', restTip: 'تمدّد واشرب ماءً وتنفّس بهدوء 💧', left: 'متبقٍ', of: 'الفترة {0} من {1}',
      pause: 'إيقاف مؤقت', go: 'تابع', done: 'أنهيت!', stop: 'إيقاف المؤقت؟', stopOk: 'إيقاف', finished: 'انتهى الوقت! عمل رائع 💪', more: 'ليس بعد',
      back: 'يلا يا {0}، نرجع للمذاكرة يا بطل! 💪', bravo: 'أحسنت يا {0}! انتهى الوقت.',
      timer: 'مؤقت المذاكرة', timerSub: 'زر ابدأ في المهمة يشغّل فترات مذاكرة بينها استراحة. يتكلم الصوت عند بداية كل استراحة.',
      block: 'فترة المذاكرة (دقائق)', restM: 'الاستراحة (دقائق)', phrase: 'الجملة عند بداية الاستراحة', hear: '🔊 استمع', rec: '🎙️ سجّلها بصوتك', recDel: 'العودة لصوت الهاتف',
      recording: 'جارٍ التسجيل… {0}', stopRec: 'إيقاف', noMic: 'الميكروفون غير متاح.', recOk: 'سيُسمع صوتك عند كل استراحة.',
      guard: 'زر ابدأ في القرآن والواجب يفتح', guardCam: 'الحارس (الكاميرا)', guardTimer: 'مؤقت المذاكرة', mins: '⏱️ دقائق المؤقت (0 = بدون مؤقت)',
    },
  };
  const tx = (k, ...a) => ((L[lang()] || L.en)[k] ?? L.en[k] ?? k).replace(/\{(\d)\}/g, (_, i) => a[i]);
  const cfg = () => db.t || (db.t = { block: 20, rest: 5, phrase: '', guard: true });
  const blocks = () => db ? [Math.max(1, cfg().block || 20), Math.max(0, cfg().rest ?? 5)] : [20, 5];
  const minsOf = task => task.type === 'prayer' ? 0 : task.mins ?? (task.icon === 'quran' ? 15 : 30);
  const phrase = () => (cfg().phrase || '{name} حانت لحظة استراحة المحارب').replace(/\{name\}/g, st ? st.name : '');

  // ---------------------------------------------------------------- voices
  const VKEY = 'starhero-restvoice';
  const recorded = () => { try { return localStorage.getItem(VKEY); } catch (e) { return null; } };
  function speak(text) {
    const lg = /[؀-ۿ]/.test(text) ? 'ar' : 'en';
    try {
      if (window.Android && Android.speak) return Android.speak(text, lg);
      if (window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lg === 'ar' ? 'ar' : 'en-US'; speechSynthesis.speak(u); }
    } catch (e) { /* no voice */ }
  }
  const buzz = p => { try { if (window.Android && Android.vibrate) Android.vibrate(p); } catch (e) { /* no buzz */ } };
  function restVoice() {
    tune([523, 659, 784, 1047]); buzz('200,100,200');
    const own = recorded();
    setTimeout(() => { if (own) { try { new Audio(own).play().catch(() => speak(phrase())); } catch (e) { speak(phrase()); } } else speak(phrase()); }, 700);
  }
  const backVoice = () => { tune([784, 659, 523, 784]); buzz('120,80,120'); setTimeout(() => speak(tx('back', st.name)), 600); };
  const doneVoice = () => { tune([523, 659, 784, 1047, 1319]); buzz('70,50,70,50,180'); setTimeout(() => speak(tx('bravo', st.name)), 700); };

  // ---------------------------------------------------------------- the timer screen
  let T = null; // { task, kid, plan, seg, end, paused, left, el, iv, over }
  const fmt = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  function open(task) {
    const [b, r] = blocks();
    const plan = ML.schedule(minsOf(task), b, r);
    const el = document.createElement('div');
    el.className = 'stimer';
    document.body.appendChild(el);
    T = { task, kid: st, plan, seg: 0, end: Date.now() + plan[0].ms, paused: false, left: 0, el, over: false, back: window.onBack };
    window.onBack = () => { ask(); return true; };
    try { if (window.Android && Android.keepAwake) Android.keepAwake(true); } catch (e) { /* screen may sleep */ }
    el.addEventListener('click', click);
    T.iv = setInterval(tick, 250);
    tune([659, 784]); draw();
  }
  function close() {
    if (!T) return;
    clearInterval(T.iv); T.el.remove(); window.onBack = T.back;
    try { if (window.Android && Android.keepAwake) Android.keepAwake(false); } catch (e) { /* */ }
    T = null;
  }
  // ponytail: the timer lives only while the app is open (the screen is kept awake); it is not restored after the app is closed
  function tick() {
    if (!T || T.paused || T.over) return;
    if (Date.now() < T.end) return draw(true);
    if (++T.seg >= T.plan.length) { T.over = true; doneVoice(); return draw(); }
    T.end = Date.now() + T.plan[T.seg].ms;
    if (T.plan[T.seg].rest) restVoice(); else backVoice();
    draw();
  }
  function draw(light) {
    const seg = T.plan[T.seg] || T.plan.at(-1), left = T.paused ? T.left : T.end - Date.now(), rest = !T.over && seg.rest;
    const pct = T.over ? 1 : 1 - Math.max(0, left) / seg.ms, studies = T.plan.filter(x => !x.rest).length, nth = T.plan.slice(0, T.seg + 1).filter(x => !x.rest).length;
    if (light && T.el.querySelector('.st-time')) { // just the clock and the ring, once a second is plenty
      T.el.querySelector('.st-time').textContent = fmt(left);
      T.el.querySelector('.st-ring circle.p').style.strokeDashoffset = String(565.5 * (1 - pct));
      return;
    }
    T.el.className = `stimer ${rest ? 'rest' : 'study'} ${T.over ? 'over' : ''}`;
    T.el.innerHTML = `<div class="st-card">
      <div class="st-head"><span class="st-ico">${icon(T.task.icon)}</span><b>${esc(T.task.title)}</b><button class="st-x" data-s="stop" aria-label="${tx('stopOk')}">${ic('x')}</button></div>
      <h2>${T.over ? tx('finished') : tx(rest ? 'rest' : 'study')}</h2>
      ${rest ? `<p class="st-tip">${tx('restTip')}</p>` : T.over ? '' : `<small class="st-of">${tx('of', nth, studies)}</small>`}
      <div class="st-ring"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" class="b"/><circle cx="100" cy="100" r="90" class="p" style="stroke-dashoffset:${565.5 * (1 - pct)}"/></svg>
        <div class="st-mid">${T.over ? hero('cheer', 'st-hero') : rest ? '<span class="st-cup">🧃</span>' : hero('happy', 'st-hero')}${T.over ? '' : `<span class="st-time" dir="ltr">${fmt(left)}</span><small>${tx('left')}</small>`}</div></div>
      <div class="st-dots">${T.plan.map((x, i) => `<i class="${x.rest ? 'r' : ''} ${i < T.seg || T.over ? 'd' : i === T.seg ? 'n' : ''}"></i>`).join('')}</div>
      <div class="st-btns">${T.over ? '' : `<button class="btn off" data-s="pause">${T.paused ? '▶ ' + tx('go') : '⏸ ' + tx('pause')}</button>`}
        <button class="btn go" data-s="done">${ic('check')} ${tx('done')}</button></div>
      ${T.over ? `<button class="link" data-s="more">${tx('more')}</button>` : ''}</div>`;
  }
  let A = null; // app.js actions (for Complete, which may ask for a homework photo first)
  function finishTask() {
    const { task, kid } = T;
    close();
    if (st !== kid || (st.days[today()] || {})[task.id]) return render();
    if (A.mark(String(task.id), document.body, null) !== false) { save(); render(); }
  }
  function ask() { dialog({ icon: 'wait', text: tx('stop'), ok: tx('stopOk'), danger: true }).then(v => v && (close(), render())); }
  function click(e) {
    const b = e.target.closest('[data-s]');
    if (!b || !T) return;
    e.stopPropagation();
    const s = b.dataset.s;
    if (s === 'stop') ask();
    else if (s === 'done') finishTask();
    else if (s === 'more') { close(); render(); }
    else if (s === 'pause') {
      if (T.paused) { T.end = Date.now() + T.left; T.paused = false; } else { T.left = T.end - Date.now(); T.paused = true; }
      tune([600]); draw();
    }
  }

  // ---------------------------------------------------------------- parent: recording the rest sentence
  async function record() {
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return dialog({ icon: 'missed', text: tx('noMic'), cancel: null }); }
    if (!window.MediaRecorder) { stream.getTracks().forEach(x => x.stop()); return dialog({ icon: 'missed', text: tx('noMic'), cancel: null }); }
    const rec = new MediaRecorder(stream), chunks = [], el = document.createElement('div');
    el.className = 'xrec'; el.innerHTML = `<div class="xrec-card"><i class="xdot"></i><b></b><button class="btn go">${tx('stopRec')}</button></div>`;
    document.body.appendChild(el);
    let left = 8;
    const label = el.querySelector('b'), show = () => { label.textContent = tx('recording', left); };
    show();
    const timer = setInterval(() => { if (--left <= 0 && rec.state === 'recording') rec.stop(); show(); }, 1000);
    el.querySelector('button').onclick = () => rec.state === 'recording' && rec.stop();
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      clearInterval(timer); stream.getTracks().forEach(x => x.stop()); el.remove();
      const fr = new FileReader();
      fr.onload = () => { try { localStorage.setItem(VKEY, fr.result); } catch (e) { /* too big: phone voice stays */ } render(); dialog({ icon: 'done', text: tx('recOk'), cancel: null }); };
      fr.readAsDataURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
    };
    rec.start();
  }

  // ---------------------------------------------------------------- hooks
  const startBtn = task => minsOf(task) ? `<button class="act start" data-a="sTimer" data-id="${task.id}">${ic('wait')}${tx('start')}</button>` : '';
  const useGuard = () => !db || cfg().guard !== false;
  const minsField = x => x.type === 'prayer' ? '' : `<label><span>${tx('mins')}</span><input data-f="task.${x.id}.mins" type="number" inputmode="numeric" min="0" max="240" value="${minsOf(x)}"></label>`;
  const seg = (a, opts, val) => `<div class="seg grow">${opts.map(([v, l]) => `<button class="${String(val) === String(v) ? 'on' : ''}" data-a="${a}" data-id="${v}">${l}</button>`).join('')}</div>`;
  function settings() {
    const c = cfg(), [b, r] = blocks();
    return `<h3>⏱️ ${tx('timer')}</h3><div class="edit"><small class="hintx">${tx('timerSub')}</small>
      <div class="line"><label><span>${tx('block')}</span><input data-sf="block" type="number" inputmode="numeric" min="1" max="120" value="${b}"></label>
        <label><span>${tx('restM')}</span><input data-sf="rest" type="number" inputmode="numeric" min="0" max="60" value="${r}"></label></div>
      <label><span>${tx('phrase')}</span><input data-sf="phrase" maxlength="80" dir="auto" value="${esc(phrase())}"></label>
      <div class="line"><button class="btn off" data-a="sHear">${tx('hear')}</button>${recorded() ? `<button class="btn off" data-a="sRecDel">${tx('recDel')}</button>` : `<button class="btn off" data-a="sRec">${tx('rec')}</button>`}</div>
      <label><span>${tx('guard')}</span>${seg('sGuard', [[1, tx('guardCam')], [0, tx('guardTimer')]], c.guard === false ? 0 : 1)}</label></div>`;
  }
  document.addEventListener('change', e => {
    const f = e.target.dataset.sf;
    if (!f || !db) return;
    const v = e.target.value.trim(), c = cfg();
    if (f === 'phrase') c.phrase = v.slice(0, 80).split(st.name).join('{name}'); // the child's name follows whichever child is on screen
    else c[f] = Math.min(+e.target.max, Math.max(+e.target.min, parseInt(v, 10) || 0));
    save(); setTimeout(render);
  });
  const ACT = {
    sTimer: id => { const task = st.tasks.find(x => x.id === +id); if (task && minsOf(task)) open(task); return false; },
    sHear: () => { restVoice(); return false; },
    sRec: () => { record(); return false; },
    sRecDel: () => { try { localStorage.removeItem(VKEY); } catch (e) { /* */ } },
    sGuard: id => { cfg().guard = id === '1'; },
  };
  function install(actions) { A = actions; Object.assign(actions, ACT); }

  return { install, startBtn, useGuard, minsField, settings, blocks, minsOf, restVoice, backVoice, doneVoice, phrase, tx };
})();
window.Study = Study;
