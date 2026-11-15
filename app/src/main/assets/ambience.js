// Background sounds for the journey planets, synthesised live with Web Audio (no sound files, works offline):
//   0 Green World: a soft music bed, a gentle stream, songbirds
//   1 Jungle Safari: a soft music bed, a gentle waterfall, faint insects, parrots, tropical birds, monkeys
//   2 Alien Planet: dreamy hum, bloops, twinkles, a passing flying saucer
// app.js calls Ambience.play(planet) on the Journey tab and Ambience.stop() everywhere else.
(() => {
  const KEY = 'starhero-sound';
  let ac, master, noiseBuf, cur = null, run = 0, nodes = [], timers = [];
  const isMuted = () => { try { return localStorage.getItem(KEY) === 'off'; } catch (e) { return false; } };

  const ctx = () => {
    if (!ac) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  };
  const keep = n => (nodes.push(n), n);
  const gain = v => { const g = ac.createGain(); g.gain.value = v; return g; };
  const filt = (type, f, q = 1) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
  const wire = (...n) => { for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]); return n[0]; };
  const noise = () => {
    if (!noiseBuf) {
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(); return keep(s);
  };
  const lfo = (param, rate, depth, type = 'sine') => {
    const o = ac.createOscillator(); o.type = type; o.frequency.value = rate;
    wire(o, gain(depth), param); o.start(); return keep(o);
  };
  const every = (min, max, fn) => {
    const id = run, go = () => { if (id !== run) return; fn(); timers.push(setTimeout(go, min + Math.random() * (max - min))); };
    timers.push(setTimeout(go, 400 + Math.random() * min));
  };
  // one short voice: a pitch glide with a soft envelope. steps = [[seconds, Hz], ...]
  const voice = (type, f0, steps, dur, vol, at = ac.currentTime, through = master) => {
    const o = ac.createOscillator(), g = gain(0);
    o.type = type; o.frequency.setValueAtTime(f0, at);
    steps.forEach(([t, f]) => o.frequency.linearRampToValueAtTime(f, at + t));
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .012);
    g.gain.setValueAtTime(vol, at + dur * .6); g.gain.exponentialRampToValueAtTime(.0001, at + dur);
    wire(o, g, through); o.start(at); o.stop(at + dur + .05);
  };

  // ---- beds that play all the time ----
  const stream = (level, lo, hi) => { // a gentle trickle: soft, low and smooth (no hiss)
    const f = filt('bandpass', (lo + hi) / 2, .9), g = gain(level);
    wire(noise(), filt('lowpass', hi * 1.2, .5), f, g, master);
    every(140, 320, () => {
      const t = ac.currentTime;
      f.frequency.setTargetAtTime(lo + Math.random() * (hi - lo), t, .12);
      g.gain.setTargetAtTime(level * (.75 + Math.random() * .35), t, .18);
    });
  };
  // calm music: a warm chord that slowly breathes, and now and then a few soft music-box notes
  const KEYS = { forest: [261.6, 329.6, 392, 523.3], jungle: [220, 277.2, 329.6, 440] }; // C major / A major
  const PENTA = { forest: [523.3, 587.3, 659.3, 784, 880, 1046.5], jungle: [440, 493.9, 554.4, 659.3, 740, 880] };
  const calm = key => {
    const f = filt('lowpass', 900, .5), g = gain(.009);
    wire(f, g, master); lfo(g.gain, .05, .003);
    KEYS[key].forEach((hz, i) => {
      const o = keep(ac.createOscillator()); o.type = 'sine'; o.frequency.value = hz;
      lfo(o.frequency, .13 + i * .05, .8); wire(o, gain(i === 3 ? .4 : 1), f); o.start();
    });
  };
  const musicBox = key => {
    const notes = PENTA[key], t = ac.currentTime, n = 3 + (Math.random() * 3 | 0);
    let i = Math.random() * notes.length | 0;
    for (let k = 0; k < n; k++) {
      i = Math.max(0, Math.min(notes.length - 1, i + (Math.random() < .5 ? -1 : 1)));
      voice('sine', notes[i], [], 1.4, .022, t + k * .42);
      voice('sine', notes[i] * 2, [], .6, .006, t + k * .42); // a little sparkle on top
    }
  };
  const insects = level => { // cicada buzz that swells and fades
    const o = keep(ac.createOscillator()), g = gain(level * .5);
    o.type = 'square'; o.frequency.value = 4700;
    wire(o, filt('highpass', 3800), g, master); o.start();
    lfo(g.gain, 31, level * .5); lfo(g.gain, .09, level * .5);
  };
  const hum = () => { // alien pad: two soft detuned chords through a breathing filter
    const f = filt('lowpass', 520, 3), g = gain(.05);
    wire(f, g, master); lfo(f.frequency, .06, 260); lfo(g.gain, .11, .02);
    [110, 164.8, 220.4].forEach((hz, i) => {
      const o = keep(ac.createOscillator()); o.type = i ? 'triangle' : 'sine'; o.frequency.value = hz;
      lfo(o.frequency, .2 + i * .07, 1.5); wire(o, f); o.start();
    });
  };

  // ---- creatures that call now and then ----
  const songbird = () => {
    const base = 2600 + Math.random() * 1500, n = 3 + (Math.random() * 4 | 0), t = ac.currentTime;
    for (let i = 0; i < n; i++) voice('sine', base, [[.04, base * (1.2 + Math.random() * .35)], [.09, base * .92]], .11, .045, t + i * .13);
  };
  const tweet = () => { const t = ac.currentTime; voice('sine', 4300, [[.17, 2500]], .2, .035, t); voice('sine', 4300, [[.17, 2500]], .2, .03, t + .27); };
  const parrot = () => {
    const t = ac.currentTime, f = filt('bandpass', 1500, 1.5); wire(f, master);
    voice('sawtooth', 750, [[.05, 1350], [.16, 950]], .2, .05, t, f);
    voice('sawtooth', 820, [[.05, 1450], [.14, 1000]], .18, .045, t + .26, f);
  };
  const tropical = () => { const t = ac.currentTime; for (let i = 0; i < 3; i++) voice('sine', 1600, [[.24, 720]], .3, .04, t + i * .36); };
  const monkey = () => {
    const t = ac.currentTime, f = filt('lowpass', 1800); wire(f, master);
    for (let i = 0; i < 3; i++) voice('triangle', 480, [[.09, 760]], .13, .05, t + i * .16, f);
    voice('triangle', 820, [[.2, 1300], [.32, 1000]], .36, .055, t + .52, f);
  };
  const bloop = () => voice('sine', 220 + Math.random() * 200, [[.13, 760 + Math.random() * 500]], .2, .05);
  const twinkle = () => { const t = ac.currentTime, f = 1900 + Math.random() * 1400; for (let i = 0; i < 4; i++) voice('sine', f * (1 + i * .25), [], .45, .018, t + i * .08); };
  const saucer = () => { // whirring flying saucer passing by
    const t = ac.currentTime, o = ac.createOscillator(), g = gain(0), vib = ac.createOscillator(), vg = gain(70);
    o.type = 'sine'; o.frequency.setValueAtTime(520, t); o.frequency.linearRampToValueAtTime(760, t + 1.6);
    vib.frequency.value = 9; wire(vib, vg, o.frequency);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.035, t + .5); g.gain.linearRampToValueAtTime(0, t + 1.8);
    wire(o, g, master); o.start(t); vib.start(t); o.stop(t + 1.9); vib.stop(t + 1.9);
  };

  const WORLDS = [
    () => { calm('forest'); stream(.03, 500, 1200); every(3000, 6500, () => (Math.random() < .6 ? songbird : tweet)()); every(7000, 12000, () => musicBox('forest')); },
    () => { calm('jungle'); stream(.04, 350, 900); insects(.005); every(3500, 7000, () => [parrot, tropical, monkey][Math.random() * 3 | 0]()); every(8000, 13000, () => musicBox('jungle')); },
    () => { hum(); every(1500, 3400, () => (Math.random() < .5 ? bloop : twinkle)()); every(9000, 15000, saucer); },
  ];

  const clear = () => {
    run++; timers.forEach(clearTimeout); timers = [];
    nodes.forEach(n => { try { n.stop(); } catch (e) { /* already stopped */ } try { n.disconnect(); } catch (e) { /* fine */ } });
    nodes = [];
  };

  window.Ambience = {
    muted: isMuted,
    play(k) {
      if (isMuted() || !WORLDS[k]) return this.stop();
      if (cur === k && ac && ac.state === 'running') return; // already playing this planet
      try { ctx(); } catch (e) { return; } // no Web Audio: stay quiet
      cur = k;
      const t = ac.currentTime, id = ++run;
      master.gain.cancelScheduledValues(t); master.gain.setTargetAtTime(0, t, .08);
      setTimeout(() => {
        if (id !== run) return;
        clear(); WORLDS[k]();
        master.gain.setTargetAtTime(.9, ac.currentTime, .6); // fade in
      }, 250);
    },
    stop() {
      if (cur === null) return;
      cur = null;
      if (!ac) return;
      master.gain.setTargetAtTime(0, ac.currentTime, .1);
      const id = ++run;
      setTimeout(() => { if (id === run) { clear(); ac.suspend(); } }, 500);
    },
    toggle() {
      try { localStorage.setItem(KEY, isMuted() ? 'on' : 'off'); } catch (e) { /* not saved */ }
      return !isMuted();
    },
    playing: () => cur,
  };
  // app in the background: go quiet; back on screen: carry on
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) ac.suspend(); else if (cur !== null) ac.resume();
  });
})();
