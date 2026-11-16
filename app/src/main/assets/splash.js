// Opening show, once per app start: the hero flies in like a superhero in front of red stage curtains,
// lands with a sparkle and a fanfare, flies off, and the curtains open on the app. Tap to skip.
// Self-contained: its own styles and its own sounds (Web Audio, no files). Silent when the sound is muted (🔇).
(() => {
  try { if (sessionStorage.getItem('sh-nosplash')) { sessionStorage.removeItem('sh-nosplash'); return; } } catch (e) { /* show it */ } // back from the videos page
  let lang = (navigator.language || '').startsWith('ar') ? 'ar' : 'en';
  try { const db = JSON.parse(localStorage.getItem('starhero') || 'null'); if (db && db.lang) lang = db.lang; } catch (e) { /* first start */ }
  let quiet = false;
  try { quiet = localStorage.getItem('starhero-sound') === 'off'; } catch (e) { /* sound on */ }
  const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const css = `
#splash { position: fixed; inset: 0; z-index: 2147483000; overflow: hidden; background: transparent; font-family: Baloo, system-ui, sans-serif; transition: opacity .4s; }
#splash.gone { opacity: 0; pointer-events: none; }
.sp-curtain { position: absolute; top: 0; bottom: 0; width: 51%; z-index: 2;
  background: linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,.35)),
    linear-gradient(rgba(255,255,255,.08), rgba(0,0,0,.25)),
    repeating-linear-gradient(90deg, #6E0A17 0, #A8172C 12px, #D5304A 21px, #A8172C 30px, #6E0A17 42px);
  animation: spOpenL 1.15s cubic-bezier(.65,0,.3,1) 2.8s forwards; }
.sp-curtain.l { left: 0; transform-origin: 0 0; }
.sp-curtain.r { right: 0; transform-origin: 100% 0; animation-name: spOpenR; }
.sp-curtain::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 22px;
  background: repeating-linear-gradient(90deg, #F2C14E 0 5px, #C8901F 5px 8px); box-shadow: 0 -4px 0 #FFD872; }
@keyframes spOpenL { 60% { transform: translateX(-70%) skewX(-7deg); } to { transform: translateX(-104%) skewX(-3deg); } }
@keyframes spOpenR { 60% { transform: translateX(70%) skewX(7deg); } to { transform: translateX(104%) skewX(3deg); } }
.sp-valance { position: absolute; top: 0; left: 0; right: 0; height: 11vh; z-index: 3;
  background: linear-gradient(#7E0D1C, #C42640 70%, #A01A30); box-shadow: 0 6px 14px rgba(0,0,0,.4);
  animation: spLift .8s ease-in 3.05s forwards; }
.sp-valance::before { content: ''; position: absolute; left: 0; right: 0; bottom: -20px; height: 22px;
  background: radial-gradient(circle at 50% 0, #A01A30 0 15px, #F2C14E 15px 19px, transparent 19.5px) 0 0 / 40px 22px repeat-x; }
@keyframes spLift { to { transform: translateY(-140%); } }
.sp-glow { position: absolute; z-index: 4; left: 50%; top: 46%; width: 120vw; height: 120vw; margin: -60vw; border-radius: 50%; pointer-events: none;
  background: radial-gradient(rgba(255,236,170,.55), rgba(255,200,90,.18) 35%, transparent 65%); animation: spPulse 2.4s ease-in-out infinite, spFade .5s 2.9s forwards; }
@keyframes spPulse { 50% { opacity: .65; } }
@keyframes spFade { to { opacity: 0; } }
.sp-hero { position: absolute; z-index: 6; left: 50%; top: 45%; width: min(46vw, 230px); pointer-events: none;
  transform: translate(-50%, -50%) translate(-95vw, 38vh) rotate(78deg) scale(.6);
  animation: spFly 2.1s cubic-bezier(.3,.7,.35,1) .25s forwards, spUp .75s cubic-bezier(.55,0,.8,.4) 2.45s forwards; }
.sp-hero img { display: block; width: 100%; filter: drop-shadow(0 14px 18px rgba(0,0,0,.45)); position: relative; z-index: 1; }
@keyframes spFly {
  0% { transform: translate(-50%, -50%) translate(-95vw, 38vh) rotate(78deg) scale(.6); }
  55% { transform: translate(-50%, -50%) translate(6vw, -4vh) rotate(72deg) scale(1); }
  68% { transform: translate(-50%, -50%) translate(0, -2vh) rotate(-6deg) scale(1.1); }
  80%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(0) scale(1); } }
@keyframes spUp {
  from { transform: translate(-50%, -50%) translate(0, 0) rotate(0) scale(1); }
  25% { transform: translate(-50%, -50%) translate(0, 3vh) rotate(0) scale(.97); }
  to { transform: translate(-50%, -50%) translate(4vw, -130vh) rotate(-8deg) scale(.8); } }
.sp-lines { position: absolute; left: 10%; right: 10%; top: 55%; height: 140%; z-index: 0;
  background: repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 3px, transparent 3px 16px);
  -webkit-mask: linear-gradient(#000, transparent); mask: linear-gradient(#000, transparent);
  opacity: 0; animation: spLines 2.1s .25s; }
@keyframes spLines { 5%, 50% { opacity: .9; } 62%, 100% { opacity: 0; } }
.sp-burst { position: absolute; z-index: 5; left: 50%; top: 45%; width: 90vw; height: 90vw; margin: -45vw; border-radius: 50%; pointer-events: none;
  background: repeating-conic-gradient(rgba(255,226,122,.8) 0 9deg, transparent 9deg 18deg);
  -webkit-mask: radial-gradient(#000 25%, transparent 68%); mask: radial-gradient(#000 25%, transparent 68%);
  transform: scale(0); opacity: 0; animation: spBurst 1.4s ease-out 1.6s forwards; }
@keyframes spBurst { 0% { transform: scale(.2) rotate(0); opacity: 1; } 100% { transform: scale(1.4) rotate(60deg); opacity: 0; } }
.sp-title { position: absolute; z-index: 7; left: 0; right: 0; bottom: 17vh; text-align: center; font-size: 46px; font-weight: 800; color: #FFE27A; letter-spacing: .5px;
  text-shadow: 0 3px 0 #C77F00, 0 6px 0 #7A3D00, 0 10px 20px rgba(0,0,0,.5); transform: scale(0); animation: spTitle .6s cubic-bezier(.34,1.56,.64,1) 1.65s forwards, spFade .4s 2.85s forwards; }
@keyframes spTitle { to { transform: scale(1); } }
.sp-spark { position: absolute; z-index: 5; color: #FFF3B0; font-size: 22px; opacity: 0; text-shadow: 0 0 10px #FFE27A; animation: spTw 1.1s ease-in-out infinite; }
@keyframes spTw { 0%, 100% { opacity: 0; transform: scale(.3) rotate(0); } 50% { opacity: 1; transform: scale(1.1) rotate(90deg); } }
#splash.skip .sp-hero, #splash.skip .sp-title, #splash.skip .sp-burst, #splash.skip .sp-spark, #splash.skip .sp-glow { display: none; }
#splash.skip .sp-curtain { animation-delay: 0s; animation-duration: .8s; }
#splash.skip .sp-valance { animation-delay: .15s; }
`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  const el = document.createElement('div');
  el.id = 'splash';
  el.innerHTML = `<div class="sp-curtain l"></div><div class="sp-curtain r"></div><div class="sp-valance"></div>
    <div class="sp-glow"></div><div class="sp-burst"></div>
    ${Array.from({ length: 12 }, (_, i) => `<i class="sp-spark" style="left:${8 + (i * 37) % 84}%;top:${18 + (i * 23) % 58}%;animation-delay:${(1.6 + (i % 6) * .17).toFixed(2)}s">✦</i>`).join('')}
    <div class="sp-hero"><i class="sp-lines"></i><img src="hero-fly.webp" alt=""></div>
    <div class="sp-title">${lang === 'ar' ? 'بطل النجوم' : 'Star Hero'}</div>`;
  document.body.appendChild(el);

  let done = false;
  const finish = after => setTimeout(() => {
    if (done) return; done = true;
    el.classList.add('gone'); setTimeout(() => { el.remove(); style.remove(); }, 450);
  }, after);

  // ---- sounds: whoosh in, sparkle + fanfare, whoosh up, curtain swish ----
  let ac;
  function sounds(skip) {
    if (quiet) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
    } catch (e) { return; }
    const out = ac.createGain(); out.gain.value = .55; out.connect(ac.destination);
    const t0 = ac.currentTime + .05;
    const buf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const whoosh = (at, dur, f1, f2, vol) => {
      const n = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      n.buffer = buf; n.loop = true; f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(f1, at); f.frequency.exponentialRampToValueAtTime(f2, at + dur);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + dur * .45); g.gain.exponentialRampToValueAtTime(.0001, at + dur);
      n.connect(f); f.connect(g); g.connect(out); n.start(at); n.stop(at + dur + .05);
    };
    const note = (at, hz, dur, vol, type = 'triangle') => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.value = hz;
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .02); g.gain.setValueAtTime(vol, at + dur * .6); g.gain.exponentialRampToValueAtTime(.0001, at + dur);
      o.connect(g); g.connect(out); o.start(at); o.stop(at + dur + .05);
    };
    if (skip) { // only the curtain swish
      whoosh(t0, .9, 200, 900, .35); [1046.5, 1318.5, 1568].forEach((hz, i) => note(t0 + .2 + i * .09, hz, .7, .05, 'sine'));
      return;
    }
    whoosh(t0 + .25, 1.3, 250, 2600, .5);                                   // flying in
    [1568, 2093, 2637, 3136].forEach((hz, i) => note(t0 + 1.55 + i * .06, hz, .5, .05, 'sine')); // sparkle
    [[523.3, 0], [659.3, .12], [784, .24], [1046.5, .36]].forEach(([hz, at]) => {      // ta-da-da-DAA
      note(t0 + 1.62 + at, hz, at === .36 ? .9 : .22, .12); note(t0 + 1.62 + at, hz / 2, at === .36 ? .9 : .22, .06, 'sawtooth');
    });
    whoosh(t0 + 2.45, .8, 400, 3200, .45);                                  // blasting off
    whoosh(t0 + 2.8, 1.1, 180, 800, .3);                                    // curtains
    [1046.5, 1318.5, 1568, 2093].forEach((hz, i) => note(t0 + 3.1 + i * .09, hz, .8, .045, 'sine'));
  }

  if (still) { finish(300); return; }
  sounds(false);
  finish(3950);
  el.addEventListener('click', () => { // tap to skip: straight to the curtains
    if (el.classList.contains('skip') || done) return;
    el.classList.add('skip');
    if (ac) ac.close().catch(() => {}); ac = null;
    sounds(true);
    finish(950);
  });
})();
