// Weekly report as a picture, shared through the phone's share menu (WhatsApp, etc.). Nothing goes to a server:
// we draw it on a canvas here and Android (MainActivity.shareImage + ShareProvider) hands the PNG to the chosen app.
// Uses app.js / logic.js globals: report(), today(), t(), st, and Focus Guard's stats when present.
const Share = (() => {
  const L = {
    en: { title: 'Weekly report', made: 'Made with Star Hero ⭐', focus: 'Focus minutes', acc: 'Quran words right', perDay: 'Stars earned each day', msg: "{0}'s week on Star Hero" },
    ar: { title: 'التقرير الأسبوعي', made: 'صُنع ببطل النجوم ⭐', focus: 'دقائق التركيز', acc: 'كلمات القرآن الصحيحة', perDay: 'النجوم المكتسبة كل يوم', msg: 'أسبوع {0} في بطل النجوم' },
  };
  const img = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
  const round = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };

  async function draw(kid, lang) {
    const l = L[lang] || L.en, ar = lang === 'ar', W = 1080, H = 1350, r = report(kid, today());
    const g = window.Guard && typeof ML !== 'undefined' ? ML.week(Guard.stats(kid).log, today()) : { min: 0, total: 0, right: 0 };
    try { await document.fonts.load('800 40px Baloo'); } catch (e) { /* system font then */ }
    const cv = Object.assign(document.createElement('canvas'), { width: W, height: H }), c = cv.getContext('2d');
    c.direction = ar ? 'rtl' : 'ltr';
    const F = (size, w = 800) => `${w} ${size}px Baloo, system-ui, sans-serif`;
    const X = x => ar ? W - x : x; // mirror x for Arabic
    // background: candy gradient with confetti dots
    const bg = c.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#FF9E5E'); bg.addColorStop(.55, '#FF5E8A'); bg.addColorStop(1, '#8B5CF6');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(255,255,255,.18)';
    for (let y = 20; y < H; y += 44) for (let x = (y / 44 % 2) * 22 + 20; x < W; x += 44) { c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); }
    // header
    const hero = await img('hero-body.webp');
    if (hero) c.drawImage(hero, ar ? 50 : W - 270, 40, 220, 220 * hero.height / hero.width);
    c.fillStyle = '#fff'; c.textAlign = 'start';
    c.font = F(44); c.fillText(l.title, X(64), 110);
    c.font = F(84); c.fillText(kid.name, X(64), 205);
    const d0 = new Date(r.days[0] + 'T12:00'), d1 = new Date(r.days[6] + 'T12:00'), fmt = d => d.toLocaleDateString(lang, { day: 'numeric', month: 'short' });
    c.font = F(36, 700); c.fillText(`${fmt(d0)} – ${fmt(d1)}`, X(64), 262);
    // tiles
    const tiles = [[`${r.full}/7`, t('fullDays'), '#22B85A'], [`+${r.plus}`, t('earnedW'), '#E39B00'], [`${kid.streak}`, t('streakW'), '#FF6A3D']];
    if (kid.tasks.some(x => x.type === 'prayer')) tiles.push([`${r.prayers}/35`, t('prayersW'), '#7B3FE4']);
    if (kid.tasks.some(x => x.pages > 0)) tiles.push([`${r.pages}`, t('pagesW'), '#12AFA0']);
    if (g.min) tiles.push([`${g.min}`, l.focus, '#1E8FF0']);
    if (g.total) tiles.push([`${Math.round(g.right / g.total * 100)}%`, l.acc, '#F0508F']);
    const tw = 300, th = 190, gap = 30, x0 = (W - 3 * tw - 2 * gap) / 2;
    tiles.slice(0, 6).forEach(([v, label, col], i) => {
      const x = x0 + (i % 3) * (tw + gap), y = 360 + Math.floor(i / 3) * (th + gap), xx = ar ? W - x - tw : x;
      c.fillStyle = 'rgba(40,0,90,.25)'; round(c, xx, y + 10, tw, th, 36); c.fill();
      c.fillStyle = '#fff'; round(c, xx, y, tw, th, 36); c.fill();
      c.textAlign = 'center'; c.fillStyle = col; c.font = F(76); c.fillText('\u200E' + v, xx + tw / 2, y + 100); // LRM: '+46' stays '+46' in Arabic
      c.fillStyle = '#4A4370'; c.font = F(30, 700); c.fillText(label, xx + tw / 2, y + 150, tw - 30);
    });
    // stars per day
    const cy = 840, ch = 330;
    c.fillStyle = 'rgba(255,255,255,.95)'; round(c, 60, cy, W - 120, ch + 100, 40); c.fill();
    c.textAlign = 'start'; c.fillStyle = '#4A4370'; c.font = F(34); c.fillText(l.perDay, X(100), cy + 62);
    const per = r.days.map(d => (kid.days[d] || {})._p || 0), top = Math.max(1, ...per), bw = 90, bx0 = (W - 7 * bw - 6 * 34) / 2;
    per.forEach((v, i) => {
      const k = ar ? 6 - i : i, x = bx0 + k * (bw + 34), h = Math.max(8, v / top * (ch - 120)), y = cy + ch - h + 20;
      const gr = c.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#FFD45C'); gr.addColorStop(1, '#FF9E3B');
      c.fillStyle = gr; round(c, x, y, bw, h, 18); c.fill();
      c.textAlign = 'center'; c.fillStyle = '#6B4300'; c.font = F(30); if (v) c.fillText(v, x + bw / 2, y - 12);
      c.fillStyle = '#7A7598'; c.font = F(28, 700); c.fillText(new Date(r.days[i] + 'T12:00').toLocaleDateString(lang, { weekday: 'short' }), x + bw / 2, cy + ch + 70);
    });
    c.textAlign = 'center'; c.fillStyle = '#fff'; c.font = F(34, 700); c.fillText(l.made, W / 2, H - 22);
    return { png: cv.toDataURL('image/png'), msg: l.msg.replace('{0}', kid.name) };
  }

  // Any PNG data URL -> the phone's share menu. name: lowercase letters, digits and dashes + '.png' (Android checks it).
  function image(png, name, text) {
    if (window.Android && Android.shareImage) Android.shareImage(png.split(',')[1], name, text || '');
    else { const a = document.createElement('a'); a.href = png; a.download = name; a.click(); } // plain browser (testing)
  }
  async function report_(kid, lang) {
    const { png, msg } = await draw(kid, lang);
    image(png, `star-hero-${today()}.png`, msg);
    return png;
  }
  return { report: report_, draw, image };
})();
window.Share = Share; // a top-level const is not on window by itself
