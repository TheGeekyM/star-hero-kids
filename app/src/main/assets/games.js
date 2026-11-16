// Star Hero 2.4: simple and puzzle games on their own tab. Each game is opened once with a few stars, then plays forever.
// Uses app.js globals (st, lang, save, render, today, spend, dialog, tune, hero, esc) only when called.
// app.js hooks: a Games tab (Games.page()), Games.install(actions). `node games.js` runs the rule checks at the bottom.
const Games = (() => {
  const L = {
    en: {
      games: 'Games', gamesSub: 'Open a game once with your stars, then play it any time!', simple: 'Simple games', puzzle: 'Puzzle games',
      play: 'Play', need: 'Need {0} more', buyQ: 'Open "{0}" for {1} stars? You can play it forever after.', buy: 'Open it',
      win: 'You did it! 🎉', again: 'Play again', close: 'Close',
      pop: 'Pop the stars', popHow: 'Tap the stars before they fly away!', popEnd: 'You popped {0} stars!',
      memory: 'Memory match', memoryHow: 'Find the pairs', moves: 'Moves: {0}',
      simon: 'Copy the colors', simonHow: 'Watch the colors, then tap them in the same order', watch: 'Watch…', yourTurn: 'Your turn!', level: 'Level {0}', simEnd: 'You reached level {0}!',
      slide: 'Slide puzzle', slideHow: 'Slide the numbers into order 1 to 8',
      ttt: 'X and O', tttHow: 'Get 3 ⭐ in a row before Star Hero does', tttWin: 'You won! 🎉', tttLose: 'Star Hero won this time!', tttDraw: "It's a draw!",
      lights: 'Light the stars', lightsHow: 'A tap flips a star and its neighbours. Light them all!',
      brain: 'Brain games', qOf: '{0} of {1}', score: '{0} of {1} right!', best: 'Best: {0}', copyEnd: 'You copied all {0} pictures!', levelsEnd: 'You finished all {0} levels!',
      math: 'Quick math', mathHow: 'Pick the right answer',
      odd: 'Odd one out', oddHow: 'Find the one that is different',
      pattern: 'What comes next?', patternHow: 'Find the rule and pick what comes next',
      clock: 'Tell the time', clockHow: 'What time does the clock show?',
      make10: 'Make 10', make10How: 'Tap two numbers that add up to 10',
      copy: 'Copy the picture', copyHow: 'Make your grid look like the small picture',
      sudoku: 'Mini sudoku', sudokuHow: 'Tap a box to change its number. Each row, column and square needs 1, 2, 3 and 4',
      maze: 'Star maze', mazeHow: 'Use the arrows to take the hero to the star',
      hanoi: 'Tower move', hanoiHow: 'Move the whole tower to the right peg. A big ring can never go on a small one',
      sort: 'Color sort', sortHow: 'Tap a tube, then another, to move a ball. Put each color in its own tube',
      shadow: 'Shadow match', shadowHow: 'Which picture made this shadow?',
      pipes: 'Water pipes', pipesHow: 'Tap a pipe to turn it. Connect them all so the water reaches every pipe',
      learn: 'Learn & earn ⭐', free: 'Free · earn ⭐', record: 'New record!', capHit: 'You got all your game stars for today 🌟', loading: 'Getting ready…', loadFail: 'This game could not load.',
      ayah: 'Ayah order', ayahHow: 'Tap the words of the ayah in the right order', ayahEnd: 'You put {0} ayat in order!',
      letters: 'Letter sounds', lettersHow: 'Listen, then tap the letter you heard', listen: 'Listen again',
      firstT: 'Missions first! 💪', firstP: 'Finish your missions for today and the games open. {0} left.', toMissions: 'Go to my missions',
      sOn: 'Games tab', sFirst: 'Missions first: games and videos open after today\'s missions (prayers don\'t count)',
      sCap: 'Stars per day from Learn & earn games', sHide: 'Tap a game to hide or show it', on: 'On', off: 'Off',
      rMin: 'Minutes of games (last 7 days)', rTop: 'Played most', rPlays: 'Played: {0}', rNone: 'No games played yet.',
    },
    ar: {
      games: 'الألعاب', gamesSub: 'افتح اللعبة مرة واحدة بنجومك، ثم العب بها متى شئت!', simple: 'ألعاب بسيطة', puzzle: 'ألعاب الألغاز',
      play: 'العب', need: 'تحتاج {0} أخرى', buyQ: 'هل تفتح "{0}" مقابل {1} نجوم؟ ستبقى لك للأبد.', buy: 'افتحها',
      win: 'أحسنت! 🎉', again: 'العب مرة أخرى', close: 'إغلاق',
      pop: 'فرقع النجوم', popHow: 'المس النجوم قبل أن تطير!', popEnd: 'فرقعت {0} نجمة!',
      memory: 'لعبة الذاكرة', memoryHow: 'جد الأزواج المتشابهة', moves: 'المحاولات: {0}',
      simon: 'قلّد الألوان', simonHow: 'شاهد الألوان ثم المسها بنفس الترتيب', watch: 'شاهد…', yourTurn: 'دورك!', level: 'المستوى {0}', simEnd: 'وصلت إلى المستوى {0}!',
      slide: 'لغز الأرقام', slideHow: 'حرّك الأرقام لترتّبها من 1 إلى 8',
      ttt: 'إكس أو', tttHow: 'ضع 3 ⭐ في صف قبل بطل النجوم', tttWin: 'فزت! 🎉', tttLose: 'فاز بطل النجوم هذه المرة!', tttDraw: 'تعادل!',
      lights: 'أضئ النجوم', lightsHow: 'كل لمسة تقلب النجمة وجيرانها. أضئها كلها!',
      brain: 'ألعاب الذكاء', qOf: '{0} من {1}', score: 'أجبت {0} من {1} صحيحة!', best: 'الأفضل: {0}', copyEnd: 'نسخت كل الصور الـ{0}!', levelsEnd: 'أنهيت كل المستويات الـ{0}!',
      math: 'حساب سريع', mathHow: 'اختر الإجابة الصحيحة',
      odd: 'المختلف', oddHow: 'جد الشكل المختلف',
      pattern: 'ماذا بعد؟', patternHow: 'اكتشف القاعدة واختر ما يأتي بعدها',
      clock: 'كم الساعة؟', clockHow: 'كم الساعة التي تشير إليها العقارب؟',
      make10: 'كوّن 10', make10How: 'المس رقمين مجموعهما 10',
      copy: 'انسخ الصورة', copyHow: 'اجعل شبكتك مثل الصورة الصغيرة',
      sudoku: 'سودوكو صغير', sudokuHow: 'المس المربع لتغيّر رقمه. كل صف وعمود ومربع يحتاج 1 و2 و3 و4',
      maze: 'متاهة النجمة', mazeHow: 'استخدم الأسهم لتوصل البطل إلى النجمة',
      hanoi: 'نقل البرج', hanoiHow: 'انقل البرج كله إلى العمود الأخير. لا تضع حلقة كبيرة فوق صغيرة',
      sort: 'رتّب الألوان', sortHow: 'المس أنبوباً ثم آخر لتنقل كرة. ضع كل لون في أنبوبه',
      shadow: 'طابق الظل', shadowHow: 'أي صورة صنعت هذا الظل؟',
      pipes: 'أنابيب الماء', pipesHow: 'المس الأنبوب لتديره. صِل الأنابيب كلها حتى يصل الماء إلى كل أنبوب',
      learn: 'تعلّم واربح ⭐', free: 'مجانية · اربح ⭐', record: 'رقم قياسي جديد!', capHit: 'حصلت على كل نجوم الألعاب لهذا اليوم 🌟', loading: 'نجهّز…', loadFail: 'تعذّر تحميل اللعبة.',
      ayah: 'رتّب الآية', ayahHow: 'المس كلمات الآية بالترتيب الصحيح', ayahEnd: 'رتّبت {0} آيات!',
      letters: 'أصوات الحروف', lettersHow: 'استمع ثم المس الحرف الذي سمعته', listen: 'استمع مرة أخرى',
      firstT: 'المهام أولاً! 💪', firstP: 'أنهِ مهام اليوم فتُفتح الألعاب. باقي {0}.', toMissions: 'اذهب إلى مهامي',
      sOn: 'تبويب الألعاب', sFirst: 'المهام أولاً: تُفتح الألعاب والفيديو بعد مهام اليوم (الصلوات لا تُحسب)',
      sCap: 'النجوم اليومية من ألعاب تعلّم واربح', sHide: 'المس اللعبة لتخفيها أو تظهرها', on: 'تشغيل', off: 'إيقاف',
      rMin: 'دقائق الألعاب (آخر 7 أيام)', rTop: 'الأكثر لعباً', rPlays: 'لُعبت: {0}', rNone: 'لم يلعب أي لعبة بعد.',
    },
  };
  const tx = (k, ...a) => ((L[lang()] || L.en)[k] ?? L.en[k] ?? k).replace(/\{(\d)\}/g, (_, i) => a[i]);
  // Costs start small and grow; one-time unlock. Only the free Learn & earn games give stars, up to the parent's daily cap.
  // rec: what the best score is: 'high' (more is better) or 'low' (fewer moves is better)
  const GAMES = [
    { id: 'ayah', kind: 'learn', icon: '📖', cost: 0, earn: true }, { id: 'letters', kind: 'learn', icon: '🔤', cost: 0, earn: true, rec: 'high' },
    { id: 'pop', kind: 'simple', icon: '🌟', cost: 3, rec: 'high' }, { id: 'memory', kind: 'simple', icon: '🃏', cost: 5, rec: 'low' }, { id: 'simon', kind: 'simple', icon: '🎨', cost: 8, rec: 'high' },
    { id: 'math', kind: 'brain', icon: '➕', cost: 6, rec: 'high' }, { id: 'odd', kind: 'brain', icon: '🔍', cost: 6, rec: 'high' }, { id: 'pattern', kind: 'brain', icon: '🔴', cost: 8, rec: 'high' },
    { id: 'clock', kind: 'brain', icon: '🕒', cost: 10, rec: 'high' }, { id: 'make10', kind: 'brain', icon: '🔟', cost: 10, rec: 'low' }, { id: 'copy', kind: 'brain', icon: '🖼️', cost: 12 },
    { id: 'shadow', kind: 'brain', icon: '🌑', cost: 8, rec: 'high' },
    { id: 'slide', kind: 'puzzle', icon: '🧩', cost: 10, rec: 'low' }, { id: 'ttt', kind: 'puzzle', icon: '❌', cost: 12 }, { id: 'lights', kind: 'puzzle', icon: '💡', cost: 15, rec: 'low' },
    { id: 'sudoku', kind: 'puzzle', icon: '🔢', cost: 14 }, { id: 'maze', kind: 'puzzle', icon: '🌀', cost: 16, rec: 'low' }, { id: 'hanoi', kind: 'puzzle', icon: '🗼', cost: 18 },
    { id: 'sort', kind: 'puzzle', icon: '🧪', cost: 20 }, { id: 'pipes', kind: 'puzzle', icon: '🚰', cost: 22, rec: 'low' },
  ];
  const KINDS = ['learn', 'simple', 'brain', 'puzzle'];

  // ---------------------------------------------------------------- parent settings (db.gm), records (kid.gstats), the missions-first rule
  const cfg = () => db.gm || (db.gm = { on: true, first: false, cap: 3, hide: [] });
  const stats = (id, kid = st) => { const g = kid.gstats || (kid.gstats = {}); return g[id] || (g[id] = { p: 0, w: 0 }); }; // p plays, w wins, b best
  const better = (rec, v, best) => best === undefined || (rec === 'low' ? v < best : v > best);
  const canEarn = (cap, got) => (got || 0) < cap;
  // today's missions the child hasn't finished; prayers don't count (all 5 only end at night), sent-for-approval counts as finished
  const missionsLeft = (kid, day) => dueTasks(kid, day).filter(t => t.type !== 'prayer' && !['pending', 'done'].includes((kid.days[day] || {})[t.id])).length;

  // ---------------------------------------------------------------- pure rules (checked at the bottom)
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const winner = b => { for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]; return b.includes('') ? '' : 'draw'; };
  const aiMove = (b, rnd = Math.random) => { // win, else block, else centre, else random: beatable on purpose
    const free = b.map((v, i) => v ? -1 : i).filter(i => i >= 0);
    for (const who of ['O', 'X']) for (const i of free) { const t = b.slice(); t[i] = who; if (winner(t) === who) return i; }
    return !b[4] ? 4 : free[rnd() * free.length | 0];
  };
  const near = (i, n) => [i - n, i + n, i % n ? i - 1 : -1, (i + 1) % n ? i + 1 : -1].filter(j => j >= 0 && j < n * n);
  const slideMove = (t, i) => { const z = t.indexOf(0); if (!near(z, 3).includes(i)) return false; [t[z], t[i]] = [t[i], t[z]]; return true; };
  const slideDone = t => t.every((v, i) => v === (i + 1) % 9);
  const slideNew = (rnd = Math.random) => { // random legal moves from solved, so it can always be solved
    const t = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let last = -1;
    while (slideDone(t) || last < 0) for (let k = 0; k < 60; k++) { const z = t.indexOf(0), o = near(z, 3).filter(j => j !== last); const j = o[rnd() * o.length | 0]; slideMove(t, j); last = z; }
    return t;
  };
  const press = (g, i, n = 3) => { for (const j of [i, ...near(i, n)]) g[j] = 1 - g[j]; };
  const lightsNew = (rnd = Math.random) => { // random presses from all-lit, so it can always be solved
    const g = Array(9).fill(1);
    while (g.every(Boolean)) for (let k = 0; k < 4; k++) press(g, rnd() * 9 | 0);
    return g;
  };
  const shuffle = (a, rnd = Math.random) => { for (let i = a.length - 1; i > 0; i--) { const j = rnd() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const ri = n => Math.random() * n | 0, pick = a => a[ri(a.length)];
  const choose = (right, wrong) => { // 3 options: the right one and 2 different wrong ones
    const w = shuffle([...new Set(wrong.filter(x => x !== right))]).slice(0, 2), opts = shuffle([right, ...w]);
    return { opts, right: opts.indexOf(right) };
  };

  // mini sudoku 4x4: shuffle a solved grid (digits, rows in a band, bands, columns, stacks), then empty 8 boxes
  const sudokuOk = c => {
    const ok = idx => idx.map(i => c[i]).sort().join() === '1,2,3,4';
    for (let k = 0; k < 4; k++) if (!ok([0, 1, 2, 3].map(j => k * 4 + j)) || !ok([0, 1, 2, 3].map(j => j * 4 + k)) || !ok([0, 1, 4, 5].map(j => (k >> 1) * 8 + (k & 1) * 2 + j))) return false;
    return true;
  };
  const peers = i => { const r = i >> 2, c = i & 3, b = (r >> 1) * 8 + (c >> 1) * 2; return [...[0, 1, 2, 3].map(j => r * 4 + j), ...[0, 1, 2, 3].map(j => j * 4 + c), ...[0, 1, 4, 5].map(j => b + j)].filter(j => j !== i); };
  const clash = (c, i) => !!c[i] && peers(i).some(j => c[j] === c[i]);
  const sudokuNew = (rnd = Math.random) => {
    const d = shuffle([1, 2, 3, 4], rnd), two = () => rnd() < .5 ? [0, 1] : [1, 0];
    const perm = () => { const [s, t] = rnd() < .5 ? [0, 2] : [2, 0], p = two(), q = two(); return [s + p[0], s + p[1], t + q[0], t + q[1]]; };
    let g = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]].map(r => r.map(v => d[v - 1]));
    if (rnd() < .5) g = g[0].map((_, c) => g.map(r => r[c]));
    const R = perm(), C = perm(), sol = R.flatMap(r => C.map(c => g[r][c])), cells = sol.slice();
    shuffle([...Array(16).keys()], rnd).slice(0, 8).forEach(i => { cells[i] = 0; });
    return { sol, cells };
  };

  // maze: depth-first carving, so every box is reachable. open[i] bits: 1 up, 2 right, 4 down, 8 left
  const DIRS = n => [[-n, 1, 4], [1, 2, 8], [n, 4, 1], [-1, 8, 2]];
  const mazeNew = (n, rnd = Math.random) => {
    const open = Array(n * n).fill(0), seen = new Set([0]), stack = [0];
    while (stack.length) {
      const c = stack[stack.length - 1];
      const nb = DIRS(n).filter(([d]) => { const j = c + d; return j >= 0 && j < n * n && !seen.has(j) && (Math.abs(d) === n || (j / n | 0) === (c / n | 0)); });
      if (!nb.length) { stack.pop(); continue; }
      const [d, b, o] = nb[rnd() * nb.length | 0];
      open[c] |= b; open[c + d] |= o; seen.add(c + d); stack.push(c + d);
    }
    return open;
  };

  // tower move (Tower of Hanoi) and color sort: pegs/tubes are arrays, bottom first
  const hanoiOk = (p, a, b) => a !== b && p[a].length > 0 && (!p[b].length || p[b][p[b].length - 1] > p[a][p[a].length - 1]);
  const CAP = 4;
  const sortOk = (t, a, b) => a !== b && t[a].length > 0 && t[b].length < CAP && (!t[b].length || t[b][t[b].length - 1] === t[a][t[a].length - 1]);
  const sortDone = t => t.every(x => !x.length || (x.length === CAP && x.every(v => v === x[0])));
  const sortSolvable = t0 => { // depth-first search with a visited set; ponytail: node cap keeps it instant, a capped puzzle is just re-dealt
    const seen = new Set(), stack = [t0];
    while (stack.length && seen.size < 20000) {
      const t = stack.pop(), key = t.map(x => x.join('')).sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      if (sortDone(t)) return true;
      for (let a = 0; a < t.length; a++) for (let b = 0; b < t.length; b++) if (sortOk(t, a, b)) { const u = t.map(x => x.slice()); u[b].push(u[a].pop()); stack.push(u); }
    }
    return false;
  };
  const sortNew = (colors, rnd = Math.random) => {
    let t;
    do {
      const balls = shuffle([...Array(colors)].flatMap((_, k) => Array(CAP).fill(k)), rnd);
      t = [...Array(colors)].map((_, k) => balls.slice(k * CAP, k * CAP + CAP)).concat([[], []]);
    } while (sortDone(t) || !sortSolvable(t));
    return t;
  };
  // water pipes: a maze (a tree through every box) with each piece turned at random; solved when every pipe end meets another
  const rot = m => ((m << 1) | (m >> 3)) & 15; // a quarter turn clockwise: up -> right -> down -> left
  const wet = (g, n) => { // boxes the water reaches from the tap in box 0, through pipe ends that meet
    const seen = new Set([0]), q = [0];
    while (q.length) { const c = q.pop(); for (const [d, b, o] of DIRS(n)) { const j = c + d; if (g[c] & b && j >= 0 && j < n * n && (Math.abs(d) === n || (j / n | 0) === (c / n | 0)) && g[j] & o && !seen.has(j)) { seen.add(j); q.push(j); } } }
    return seen;
  };
  const pipesDone = (g, n) => wet(g, n).size === n * n && g.every((m, c) => DIRS(n).every(([d, b, o]) => { const j = c + d; return !(m & b) || (j >= 0 && j < n * n && (Math.abs(d) === n || (j / n | 0) === (c / n | 0)) && g[j] & o); }));
  const pipesNew = (n, rnd = Math.random) => {
    const g = mazeNew(n, rnd);
    do for (let i = 0; i < g.length; i++) for (let k = rnd() * 4 | 0; k > 0; k--) g[i] = rot(g[i]); while (pipesDone(g, n));
    return g;
  };
  const make10New = () => shuffle([...Array(8)].flatMap(() => { const a = 1 + ri(9); return [a, 10 - a]; }));

  // question makers for the 10-question brain games: { q, opts, right, cols }
  const ODD = [['🐶', '🐱'], ['🍎', '🍅'], ['😀', '😃'], ['🐟', '🐠'], ['🚗', '🚕'], ['⭐', '🌟'], ['🐻', '🐨'], ['🌲', '🌳'], ['🍋', '🍌'], ['🐸', '🐢'], ['🌙', '🌛'], ['🏀', '⚽']];
  const SHAPES = ['🐘', '🦒', '🐇', '🦋', '🐢', '✈️', '🚲', '🎸', '🍐', '🦀', '🐙', '⛵', '🦕', '🐓', '🌵', '🏠', '🐪', '🦉', '🍄', '🚀'];
  const COLORS = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'];
  const pad2 = m => String(m).padStart(2, '0');
  // Arabic letters and their names (the name is what the phone says out loud)
  const LETTERS = [['ا', 'ألف'], ['ب', 'باء'], ['ت', 'تاء'], ['ث', 'ثاء'], ['ج', 'جيم'], ['ح', 'حاء'], ['خ', 'خاء'], ['د', 'دال'], ['ذ', 'ذال'], ['ر', 'راء'],
    ['ز', 'زاي'], ['س', 'سين'], ['ش', 'شين'], ['ص', 'صاد'], ['ض', 'ضاد'], ['ط', 'طاء'], ['ظ', 'ظاء'], ['ع', 'عين'], ['غ', 'غين'], ['ف', 'فاء'],
    ['ق', 'قاف'], ['ك', 'كاف'], ['ل', 'لام'], ['م', 'ميم'], ['ن', 'نون'], ['ه', 'هاء'], ['و', 'واو'], ['ي', 'ياء']];
  const speak = text => { // always Arabic, whatever the app language
    try {
      if (window.Android && Android.speak) return Android.speak(text, 'ar');
      if (window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'ar'; u.rate = .8; speechSynthesis.speak(u); }
    } catch (e) { /* no voice */ }
  };
  let QURAN = null;
  const loadQuran = async () => QURAN || (QURAN = ML.parseQuran(await (await fetch('quran/quran-simple.txt')).text()));
  const ayaText = (s, a) => { const x = QURAN[s][a - 1]; return s === 1 || a !== 1 ? x : x.split(' ').slice(4).join(' '); }; // the 4-word basmala sits inside ayah 1 (as in more.js)
  const suraName = s => window.Guard && Guard.suraName ? Guard.suraName(s, 'ar') : String(s);
  let reciter = null;
  const recite = (s, a) => { // recitation audio ships for Al-Fatiha and suras 67-114
    if (s !== 1 && s < 67) return;
    try { if (reciter) reciter.pause(); reciter = new Audio(`quran/audio/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`); reciter.play().catch(() => {}); } catch (e) { /* no sound */ }
  };
  const ASK = {
    letters: () => {
      const o = shuffle(LETTERS.slice()).slice(0, 4); // 4 letters, the first one is said
      const opts = shuffle(o.map(x => x[0]));
      return { q: `<button class="gsay" data-g="say">🔊 ${tx('listen')}</button>`, say: o[0][1], opts: opts.map(x => `<span lang="ar">${x}</span>`), right: opts.indexOf(o[0][0]), cols: 2 };
    },
    shadow: () => { const o = shuffle(SHAPES.slice()).slice(0, 3); return { q: `<span class="gshadow">${o[0]}</span>`, ...choose(o[0], o.slice(1)) }; },
    math: n => {
      const max = n < 5 ? 10 : 20, plus = n < 3 || Math.random() < .5;
      let a = 1 + ri(max), b = 1 + ri(max);
      if (!plus && b > a) [a, b] = [b, a];
      const ans = plus ? a + b : a - b;
      return { q: `<span dir="ltr">${a} ${plus ? '+' : '−'} ${b} = ?</span>`, ...choose(ans, [ans + 1, ans - 1, ans + 2, ans - 2, ans + 10].filter(x => x >= 0)) };
    },
    odd: n => {
      const [a, b] = shuffle(pick(ODD).slice()), size = n < 4 ? 9 : 16, opts = Array(size).fill(a), right = ri(size);
      opts[right] = b;
      return { q: '', opts, right, cols: size === 9 ? 3 : 4 };
    },
    pattern: n => {
      if (n % 2 === 0) { // colors: AB, AAB, ABC, ABB repeated
        const unit = pick([[0, 1], [0, 0, 1], [0, 1, 2], [0, 1, 1], [0, 1, 2, 2]]), c = shuffle(COLORS.slice()).slice(0, 3), len = 6 + ri(2);
        const seq = [...Array(len + 1)].map((_, k) => c[unit[k % unit.length]]);
        return { q: seq.slice(0, len).join(' ') + ' ❓', ...choose(seq[len], c) };
      }
      const s = 1 + ri(10), d = 1 + ri(n < 5 ? 3 : 5), ans = s + 4 * d; // numbers that grow by the same step
      return { q: [0, 1, 2, 3].map(k => s + k * d).join(' ') + ' ❓', ...choose(ans, [ans + 1, ans - 1, ans + d, ans - d].filter(x => x > 0)) };
    },
    clock: n => {
      const h = 1 + ri(12), m = n < 4 ? 0 : n < 7 ? pick([0, 30]) : pick([0, 15, 30, 45]), f = (h, m) => `${h}:${pad2(m)}`;
      const hand = (deg, len, w, c) => { const r = deg * Math.PI / 180; return `<line x1="50" y1="50" x2="${50 + len * Math.sin(r)}" y2="${50 - len * Math.cos(r)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
      const face = `<svg class="gclk" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#7B3FE4" stroke-width="4"/>${[...Array(12)].map((_, i) => {
        const r = (i + 1) * Math.PI / 6; return `<text x="${50 + 35 * Math.sin(r)}" y="${53.5 - 35 * Math.cos(r)}" text-anchor="middle" font-size="10" font-weight="800" fill="#2B2350">${i + 1}</text>`; }).join('')}
        ${hand((h % 12) * 30 + m / 2, 21, 5, '#2B2350')}${hand(m * 6, 33, 3, '#E5484D')}<circle cx="50" cy="50" r="3.5" fill="#2B2350"/></svg>`;
      return { q: face, ...choose(f(h, m), [f(h % 12 + 1, m), f((h + 10) % 12 + 1, m), f(h, (m + 30) % 60), f(h, (m + 15) % 60)]) };
    },
  };

  // ---------------------------------------------------------------- the games: each returns { view(), tap(k, i) }; tap returning false skips the redraw
  const PLAY = {
    pop(api) {
      let score = 0, left = 20;
      const field = () => api.el.querySelector('.gfield'), stat = () => api.el.querySelector('.gstat');
      api.every(() => { // a new star every 0.7 s, each lives 1.6 s
        const f = field(); if (!f || left <= 0) return;
        const b = document.createElement('button');
        b.className = 'gpop'; b.dataset.g = 'pop'; b.textContent = '⭐';
        b.style.cssText = `left:${8 + Math.random() * 76}%;top:${6 + Math.random() * 76}%`;
        f.appendChild(b); api.later(() => b.remove(), 1600);
      }, 700);
      api.every(() => { if (left <= 0) return; left--; const s = stat(); if (s) s.textContent = `⭐ ${score} · ⏱ ${left}`; if (!left) api.win(tx('popEnd', score), true, score); }, 1000);
      return {
        view: () => `<p class="gstat">⭐ ${score} · ⏱ ${left}</p><div class="gfield"></div>`,
        tap: (k, i, b) => { if (k !== 'pop' || left <= 0) return false; score++; tune([880 + score * 20]); b.remove(); stat().textContent = `⭐ ${score} · ⏱ ${left}`; return false; },
      };
    },
    memory(api) {
      const cards = shuffle([...'🐱🦁🐸🚀🍎🌙', ...'🐱🦁🐸🚀🍎🌙']), up = [], got = new Set();
      let moves = 0, busy = false;
      return {
        view: () => `<p class="gstat">${tx('moves', moves)}</p><div class="ggrid g4">${cards.map((c, i) => {
          const open = up.includes(i) || got.has(i);
          return `<button class="gtile ${open ? 'gup' : ''} ${got.has(i) ? 'gok' : ''}" data-g="m" data-i="${i}">${open ? c : '?'}</button>`; }).join('')}</div>`,
        tap: (k, i) => {
          if (busy || up.includes(i) || got.has(i)) return false;
          up.push(i); tune([660]);
          if (up.length < 2) return;
          moves++;
          if (cards[up[0]] === cards[up[1]]) { up.forEach(j => got.add(j)); up.length = 0; tune([660, 990]); if (got.size === cards.length) api.win(tx('moves', moves), true, moves); return; }
          busy = true; api.later(() => { up.length = 0; busy = false; api.draw(); }, 800);
        },
      };
    },
    simon(api) {
      const NOTE = [392, 523, 659, 784], seq = [];
      let lit = -1, at = 0, watching = true;
      const show = () => { // play the sequence, one pad every 0.6 s
        watching = true; at = 0; seq.push(Math.random() * 4 | 0); api.draw();
        seq.forEach((p, k) => {
          api.later(() => { lit = p; tune([NOTE[p]]); api.draw(); }, 700 + k * 600);
          api.later(() => { lit = -1; if (k === seq.length - 1) watching = false; api.draw(); }, 1100 + k * 600);
        });
      };
      api.later(show, 0);
      return {
        view: () => `<p class="gstat">${tx('level', seq.length)} · ${tx(watching ? 'watch' : 'yourTurn')}</p>
          <div class="ggrid g2 gsimon">${NOTE.map((_, p) => `<button class="gpad c${p} ${lit === p ? 'lit' : ''}" data-g="s" data-i="${p}" ${watching ? 'disabled' : ''}></button>`).join('')}</div>`,
        tap: (k, p) => {
          if (watching) return false;
          tune([NOTE[p]]); lit = p; api.later(() => { lit = -1; api.draw(); }, 250);
          if (seq[at] !== p) { tune([330, 262]); watching = true; return api.win(tx('simEnd', seq.length), seq.length > 3, seq.length); }
          if (++at === seq.length) { watching = true; api.later(show, 700); }
        },
      };
    },
    slide(api) {
      const t = slideNew();
      let moves = 0;
      return {
        view: () => `<p class="gstat">${tx('moves', moves)}</p><div class="ggrid g3">${t.map((v, i) => v ? `<button class="gtile gup gnum" data-g="t" data-i="${i}">${v}</button>` : '<span class="gtile gblank"></span>').join('')}</div>`,
        tap: (k, i) => { if (!slideMove(t, i)) return false; moves++; tune([520]); if (slideDone(t)) api.win(tx('moves', moves), true, moves); },
      };
    },
    ttt(api) {
      const b = Array(9).fill('');
      let wait = false;
      const end = () => { const w = winner(b); if (w) api.win(tx(w === 'X' ? 'tttWin' : w === 'O' ? 'tttLose' : 'tttDraw'), w === 'X'); return !!w; };
      return {
        view: () => `<div class="ggrid g3">${b.map((v, i) => `<button class="gtile gup gxo" data-g="x" data-i="${i}">${v === 'X' ? '⭐' : v === 'O' ? '🌙' : ''}</button>`).join('')}</div>`,
        tap: (k, i) => {
          if (wait || b[i]) return false;
          b[i] = 'X'; tune([660]);
          if (end()) return;
          wait = true;
          api.later(() => { b[aiMove(b)] = 'O'; tune([440]); wait = false; api.draw(); end(); }, 500);
        },
      };
    },
    lights(api) {
      const g = lightsNew();
      let moves = 0;
      return {
        view: () => `<p class="gstat">${tx('moves', moves)}</p><div class="ggrid g3">${g.map((v, i) => `<button class="gtile glight ${v ? 'gon' : ''}" data-g="l" data-i="${i}">${v ? '⭐' : '☆'}</button>`).join('')}</div>`,
        tap: (k, i) => { press(g, i); moves++; tune([g[i] ? 880 : 440]); if (g.every(Boolean)) api.win(tx('moves', moves), true, moves); },
      };
    },
    // 10 questions; a wrong answer shows the right one for a second
    ...Object.fromEntries(Object.keys(ASK).map(id => [id, api => {
      const N = 10;
      let n = 0, score = 0, q = ASK[id](0), bad = -1;
      if (q.say) api.later(() => speak(q.say), 300);
      return {
        view: () => `<p class="gstat">${tx('qOf', n + 1, N)} · ⭐ ${score}</p>${q.q ? `<div class="gq">${q.q}</div>` : ''}
          <div class="ggrid g${q.cols || 3}">${q.opts.map((o, i) => `<button class="gtile gup gopt ${bad < 0 ? '' : i === q.right ? 'gok' : i === bad ? 'gbad' : ''}" data-g="r" data-i="${i}">${o}</button>`).join('')}</div>`,
        tap: (k, i) => {
          if (k === 'say') { speak(q.say); return false; }
          if (bad >= 0) return false;
          const next = () => { bad = -1; if (++n === N) return api.win(tx('score', score, N), score >= N / 2, score); q = ASK[id](n); if (q.say) api.later(() => speak(q.say), 300); };
          if (i === q.right) { score++; tune([660, 990]); return next(); }
          tune([330, 262]); bad = i; api.later(() => { next(); if (n < N) api.draw(); }, 1100);
        },
      };
    }])),
    make10(api) {
      const nums = make10New(), gone = new Set();
      let sel = -1, moves = 0;
      return {
        view: () => `<p class="gstat">${tx('moves', moves)}</p><div class="ggrid g4">${nums.map((v, i) => gone.has(i) ? '<span class="gtile gblank"></span>'
          : `<button class="gtile gup gnum ${sel === i ? 'gsel' : ''}" data-g="t" data-i="${i}">${v}</button>`).join('')}</div>`,
        tap: (k, i) => {
          if (sel < 0 || sel === i) { sel = sel === i ? -1 : i; tune([520]); return; }
          moves++;
          if (nums[sel] + nums[i] === 10) { gone.add(sel); gone.add(i); tune([660, 990]); if (gone.size === nums.length) api.win(tx('moves', moves), true, moves); }
          else tune([330, 262]);
          sel = -1;
        },
      };
    },
    copy(api) {
      const N = 5;
      let n = 0, tgt, mine;
      const next = () => { tgt = Array(16).fill(0); while (tgt.filter(Boolean).length < 4 + n) tgt[ri(16)] = 1; mine = Array(16).fill(0); };
      next();
      return {
        view: () => `<p class="gstat">${tx('qOf', n + 1, N)}</p><div class="ggrid g4 gtarget">${tgt.map(v => `<i class="${v ? 'gon' : ''}"></i>`).join('')}</div>
          <div class="ggrid g4">${mine.map((v, i) => `<button class="gtile gcp ${v ? 'gon' : ''}" data-g="c" data-i="${i}"></button>`).join('')}</div>`,
        tap: (k, i) => {
          mine[i] ^= 1; tune([mine[i] ? 660 : 440]);
          if (mine.join() !== tgt.join()) return;
          if (++n === N) return api.win(tx('copyEnd', N));
          tune([660, 880, 1320]); next();
        },
      };
    },
    sudoku(api) {
      const { cells } = sudokuNew(), given = cells.map(Boolean);
      return {
        view: () => `<div class="ggrid g4 gsudoku">${cells.map((v, i) => `<button class="gtile gup gnum ${((i >> 3) + ((i & 3) >> 1)) % 2 ? '' : 'gbx'} ${given[i] ? 'gfix' : ''} ${clash(cells, i) ? 'gbad' : ''}" data-g="u" data-i="${i}" ${given[i] ? 'disabled' : ''}>${v || ''}</button>`).join('')}</div>`,
        tap: (k, i) => { cells[i] = (cells[i] + 1) % 5; tune([440 + cells[i] * 110]); if (sudokuOk(cells)) api.win(tx('win')); },
      };
    },
    maze(api) {
      const SIZES = [5, 6, 7];
      let lv = 0, n, open, pos, moves = 0;
      const next = () => { n = SIZES[lv]; open = mazeNew(n); pos = 0; };
      next();
      const ARROWS = ['⬆️', '➡️', '⬇️', '⬅️'];
      return {
        view: () => `<p class="gstat">${tx('level', lv + 1)} · ${tx('moves', moves)}</p>
          <div class="gmaze" style="grid-template-columns:repeat(${n},1fr)">${open.map((o, i) => `<span style="border-width:${[1, 2, 4, 8].map(b => o & b ? 0 : 2).join('px ')}px">${i === pos ? '🦸' : i === n * n - 1 ? '⭐' : ''}</span>`).join('')}</div>
          <div class="garrows">${[3, 0, 2, 1].map(d => `<button class="gtile gup" data-g="mv" data-i="${d}">${ARROWS[d]}</button>`).join('')}</div>`,
        tap: (k, d) => {
          const [step, bit] = DIRS(n)[d];
          if (!(open[pos] & bit)) { tune([200]); return false; }
          pos += step; moves++; tune([600]);
          if (pos !== n * n - 1) return;
          if (++lv === SIZES.length) return api.win(tx('levelsEnd', SIZES.length), true, moves);
          tune([660, 880, 1320]); next();
        },
      };
    },
    hanoi(api) {
      const COL = ['', '#E5484D', '#FFC531', '#1FB65A', '#1E8FF0'];
      let rings = 3, pegs, held = -1, moves = 0;
      const next = () => { pegs = [[...Array(rings)].map((_, i) => rings - i), [], []]; held = -1; moves = 0; };
      next();
      return {
        view: () => `<p class="gstat">${tx('level', rings - 2)} · ${tx('moves', moves)} · ${tx('best', 2 ** rings - 1)}</p>
          <div class="gpegs">${pegs.map((p, k) => `<button class="gpeg ${held === k ? 'gsel' : ''}" data-g="h" data-i="${k}">${p.map(r => `<i style="width:${22 + r * 18}%;background:${COL[r]}"></i>`).join('')}</button>`).join('')}</div>`,
        tap: (k, i) => {
          if (held < 0) { if (!pegs[i].length) return false; held = i; tune([520]); return; }
          if (hanoiOk(pegs, held, i)) { pegs[i].push(pegs[held].pop()); moves++; tune([660]); } else if (held !== i) tune([330, 262]);
          held = -1;
          if (pegs[2].length < rings) return;
          if (++rings > 4) return api.win(tx('levelsEnd', 2));
          tune([660, 880, 1320]); next();
        },
      };
    },
    ayah(api) {
      const N = 5;
      let n = 0, q = null, got = 0, used = new Set(), bad = -1, busy = false;
      const pool = () => { const m = window.More ? More.memorised() : []; return m.length ? m : [1, ...Array.from({ length: 22 }, (_, i) => 93 + i)]; };
      const next = () => { // a random ayah of 3 to 8 words from the surahs the child knows (or the short ones)
        for (let t = 0; t < 300 && (!q || q.n !== n); t++) {
          const s = pick(pool()), a = 1 + ri(QURAN[s].length), w = ayaText(s, a).split(' ');
          if (w.length >= 3 && w.length <= 8 && new Set(w).size > 1) q = { n, s, a, w, tiles: shuffle(w.map((_, i) => i)) };
        }
        if (!q || q.n !== n) q = { n, s: 112, a: 1, w: ayaText(112, 1).split(' '), tiles: shuffle([0, 1, 2, 3]) };
        got = 0; used = new Set();
      };
      loadQuran().then(() => { next(); api.draw(); }, () => api.win(tx('loadFail'), false));
      return {
        view: () => !q ? `<p class="gstat">${tx('loading')}</p>` : `<p class="gstat">${tx('qOf', n + 1, N)} · <span lang="ar">سورة ${suraName(q.s)}</span></p>
          <div class="gayah" lang="ar" dir="rtl">${q.w.slice(0, got).map(esc).join(' ')} ${got < q.w.length ? '<span class="gslot">…</span>' : ''}</div>
          <div class="gwords" lang="ar" dir="rtl">${q.tiles.map(i => used.has(i) ? '' : `<button class="gword ${bad === i ? 'gbad' : ''}" data-g="w" data-i="${i}">${esc(q.w[i])}</button>`).join('')}</div>`,
        tap: (k, i) => {
          if (!q || busy) return false;
          if (q.w[i] !== q.w[got]) { bad = i; tune([330, 262]); api.later(() => { bad = -1; api.draw(); }, 500); return; } // compare words, so a repeated word is fine
          used.add(i); got++; tune([520 + got * 60]);
          if (got < q.w.length) return;
          busy = true; tune([660, 880, 1320]); recite(q.s, q.a);
          api.later(() => { busy = false; if (++n === N) return api.win(tx('ayahEnd', N)); next(); api.draw(); }, 1600);
        },
      };
    },
    pipes(api) {
      const SIZES = [3, 4, 5];
      let lv = 0, n = SIZES[0], g = pipesNew(n), moves = 0;
      const pipe = (m, w, src) => `<svg viewBox="0 0 40 40">${[[1, '20,20 20,0'], [2, '20,20 40,20'], [4, '20,20 20,40'], [8, '20,20 0,20']].filter(([b]) => m & b)
        .map(([, p]) => `<polyline points="${p}" stroke="${w ? '#1E8FF0' : '#B9B3CF'}" stroke-width="9" stroke-linecap="round"/>`).join('')}<circle cx="20" cy="20" r="${src ? 10 : 6}" fill="${src ? '#7B3FE4' : w ? '#1E8FF0' : '#B9B3CF'}"/></svg>`;
      return {
        view: () => { const w = wet(g, n); return `<p class="gstat">${tx('level', lv + 1)} · ${tx('moves', moves)}</p>
          <div class="ggrid gpipes" style="grid-template-columns:repeat(${n},1fr)">${g.map((m, i) => `<button class="gtile gpipe" data-g="p" data-i="${i}">${pipe(m, w.has(i), !i)}</button>`).join('')}</div>`; },
        tap: (k, i) => {
          g[i] = rot(g[i]); moves++; tune([500 + (wet(g, n).size * 40)]);
          if (!pipesDone(g, n)) return;
          if (++lv === SIZES.length) return api.win(tx('levelsEnd', SIZES.length), true, moves);
          tune([660, 880, 1320]); n = SIZES[lv]; g = pipesNew(n);
        },
      };
    },
    sort(api) {
      const BALL = ['#E5484D', '#1E8FF0', '#FFC531', '#1FB65A'];
      let colors = 3, t = sortNew(colors), held = -1, moves = 0;
      return {
        view: () => `<p class="gstat">${tx('level', colors - 2)} · ${tx('moves', moves)}</p>
          <div class="gtubes">${t.map((x, k) => `<button class="gtube ${held === k ? 'gsel' : ''}" data-g="o" data-i="${k}">${x.map(c => `<i style="background:${BALL[c]}"></i>`).join('')}</button>`).join('')}</div>`,
        tap: (k, i) => {
          if (held < 0) { if (!t[i].length) return false; held = i; tune([520]); return; }
          if (sortOk(t, held, i)) { t[i].push(t[held].pop()); moves++; tune([660]); } else if (held !== i) tune([330, 262]);
          held = -1;
          if (!sortDone(t)) return;
          if (++colors > 4) return api.win(tx('levelsEnd', 2));
          tune([660, 880, 1320]); t = sortNew(colors); moves = 0;
        },
      };
    },
  };

  // ---------------------------------------------------------------- full-screen player
  function open(id) {
    const info = GAMES.find(x => x.id === id), el = document.createElement('div'), back = window.onBack;
    el.className = 'xpick gplay';
    document.body.appendChild(el);
    let timers = [], game = null, done = null;
    const stop = () => { timers.forEach(x => { clearTimeout(x); clearInterval(x); }); timers = []; };
    const api = {
      el,
      later: (fn, ms) => timers.push(setTimeout(fn, ms)),
      every: (fn, ms) => timers.push(setInterval(fn, ms)),
      draw: () => {
        if (!el.firstChild) el.innerHTML = '<div class="xpick-card gbox"></div>'; // the card stays, so its pop-in plays once
        el.firstChild.innerHTML = `<div class="ghead"><b>${info.icon} ${tx(id)}</b><button class="gclose" data-g="close" aria-label="${tx('close')}">✕</button></div>
          ${done ? `<div class="gdone">${hero(done.happy ? 'cheer' : 'happy', 'ghero')}<h2>${done.happy ? tx('win') : ''}</h2><p class="gstat">${esc(done.msg)}</p>
            ${done.rec ? `<p class="grec">🏆 ${tx('record')}</p>` : ''}${done.earned ? `<p class="mbig">+${done.earned} ${star}</p>` : done.capped ? `<small class="ghow">${tx('capHit')}</small>` : ''}
            <button class="btn go" data-g="again">${tx('again')}</button></div>`
          : `<small class="ghow">${tx(id + 'How')}</small>${game.view()}`}`;
      },
      win: (msg, happy = true, val) => { // val: this game's score for the record (see GAMES rec)
        stop(); done = { msg, happy };
        const s = stats(id);
        if (happy) s.w++;
        if (info.rec && val !== undefined && better(info.rec, val, s.b)) { done.rec = s.b !== undefined; s.b = val; }
        if (info.earn && happy) {
          const d = dayOf(st, today());
          if (canEarn(cfg().cap, d._g)) { d._g = (d._g || 0) + 1; gain(st, today(), 1, ['game', tx(id)]); done.earned = 1; } else done.capped = true;
        }
        save();
        if (happy && window.celebrate) celebrate();
        api.later(api.draw, 600); return false;
      },
    };
    const t0 = Date.now();
    stats(id).p++; save();
    const start = () => { stop(); done = null; game = PLAY[id](api); api.draw(); };
    const close = () => {
      stop(); clearInterval(lock); el.remove(); window.onBack = back;
      if (reciter) reciter.pause();
      const d = dayOf(st, today()); d._gm = Math.round(((d._gm || 0) + (Date.now() - t0) / 60000) * 10) / 10; // minutes played, for the parent report
      save(); render(); // shows the new best on the game's tile
    };
    window.onBack = () => { close(); return true; };
    const lock = setInterval(() => { if (document.querySelector('.mlock')) close(); }, 3000); // play-time limit (more.js) closes games too
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-g]');
      if (!b || b.disabled) return;
      e.stopPropagation();
      const k = b.dataset.g;
      if (k === 'close') return close();
      if (k === 'again') return start();
      if (!done && game.tap(k, +b.dataset.i, b) !== false && !done) api.draw();
    });
    start();
  }

  // ---------------------------------------------------------------- Games tab
  const owned = () => st.games || (st.games = []);
  const has = x => !x.cost || owned().includes(x.id);
  const locked = () => cfg().first ? missionsLeft(st, today()) : 0;
  function page() {
    const left = locked(), shown = GAMES.filter(x => !cfg().hide.includes(x.id));
    return `<div class="scroll shop gpage">
      <header class="shophead"><div><h1>${tx('games')}</h1><p>${tx('gamesSub')}</p></div><div class="pill">${star}<b>${st.stars}</b></div></header>
      ${left ? `<section class="gcard glock">${hero('happy', 'ghero')}<h2>${tx('firstT')}</h2><p class="msub">${tx('firstP', left)}</p>
        <button class="btn go" data-a="tab" data-id="home">${tx('toMissions')}</button></section>`
      : KINDS.map(kind => shown.filter(x => x.kind === kind)).filter(l => l.length).map(list => `<section class="gcard ${list[0].kind === 'learn' ? 'glearn' : ''}"><h3>${tx(list[0].kind)}</h3><div class="xgrid">${list.map(x => {
        const own = has(x), can = st.stars >= x.cost, b = stats(x.id).b;
        return `<button class="xitem ${own ? 'own' : ''}" data-a="${own ? 'gPlay' : 'gBuy'}" data-id="${x.id}" ${!own && !can ? 'disabled' : ''}>
          <span class="xart gart">${own ? x.icon : '🔒'}</span><b>${tx(x.id)}</b>
          <small>${!x.cost && b === undefined ? tx('free') : own ? `▶ ${tx('play')}${b !== undefined ? ` · 🏆 ${b}` : ''}` : can ? `${x.cost} ⭐` : tx('need', x.cost - st.stars) + ' ⭐'}</small></button>`;
      }).join('')}</div></section>`).join('')}</div>`;
  }

  // ---------------------------------------------------------------- parent zone: settings and report
  const seg = (k, opts, val) => `<div class="seg grow">${opts.map(([v, l]) => `<button class="${String(val) === String(v) ? 'on' : ''}" data-a="gSet" data-id="${k}:${v}">${l}</button>`).join('')}</div>`;
  function settings() {
    const c = cfg(), onOff = [[1, tx('on')], [0, tx('off')]];
    return `<h3>🎮 ${tx('games')}</h3><div class="edit">
      <small class="hintx">${tx('sOn')}</small>${seg('on', onOff, c.on === false ? 0 : 1)}
      <small class="hintx">${tx('sFirst')}</small>${seg('first', onOff, c.first ? 1 : 0)}
      <small class="hintx">${tx('sCap')}</small>${seg('cap', [[0, tx('off')], [1, '1'], [3, '3'], [5, '5']], c.cap)}
      <small class="hintx">${tx('sHide')}</small><div class="xchips">${GAMES.map(x => `<button class="xchip ${c.hide.includes(x.id) ? 'gdim' : ''}" data-a="gHide" data-id="${x.id}">${x.icon} ${tx(x.id)}</button>`).join('')}</div></div>`;
  }
  function report() {
    const days = [...Array(7)].map((_, k) => addDays(today(), k - 6)), mins = days.map(d => Math.round((st.days[d] || {})._gm || 0)), max = Math.max(10, ...mins);
    const top = GAMES.filter(x => stats(x.id).p).sort((a, b) => stats(b.id).p - stats(a.id).p).slice(0, 3);
    return `<h3>🎮 ${tx('rMin')}</h3><div class="gbars">${days.map((d, k) => `<div><b>${mins[k]}</b><i style="height:${mins[k] / max * 100}%"></i><small>${parse(d).toLocaleDateString(lang(), { weekday: 'short' })}</small></div>`).join('')}</div>
      <h3>${tx('rTop')}</h3>${top.length ? top.map(x => { const s = stats(x.id); return `<p class="gtoprow"><span>${x.icon} ${tx(x.id)}</span><small>${tx('rPlays', s.p)}${s.b !== undefined ? ` · 🏆 ${s.b}` : ''}</small></p>`; }).join('') : `<p class="hintx">${tx('rNone')}</p>`}`;
  }

  const ACT = {
    gPlay: id => { const x = GAMES.find(g => g.id === id); if (x && has(x) && !locked()) open(id); return false; },
    gSet: v => { const [k, n] = v.split(':'); cfg()[k] = k === 'cap' ? +n : n === '1'; },
    gHide: id => { const h = cfg().hide, i = h.indexOf(id); if (i < 0) h.push(id); else h.splice(i, 1); },
    gBuy: id => {
      const x = GAMES.find(g => g.id === id);
      if (!x || owned().includes(id) || st.stars < x.cost) return false;
      dialog({ icon: 'gift', text: tx('buyQ', tx(id), x.cost), ok: tx('buy') }).then(v => {
        if (!v || st.stars < x.cost || owned().includes(id)) return;
        spend(st, today(), x.cost, ['game', tx(id)]); owned().push(id);
        if (window.celebrate) celebrate();
        save(); render(); open(id);
      });
      return false;
    },
  };
  const install = actions => Object.assign(actions, ACT);

  const on = () => cfg().on !== false;
  return { page, install, settings, report, on, _: { canEarn, better, missionsLeft, winner, aiMove, slideNew, slideMove, slideDone, lightsNew, press, sudokuNew, sudokuOk, clash, mazeNew, DIRS, hanoiOk, sortNew, sortOk, sortDone, sortSolvable, make10New, ASK, rot, wet, pipesDone, pipesNew } };
})();

if (typeof window !== 'undefined') window.Games = Games;
else { // node games.js: rule checks
  global.lang = () => 'en'; // app.js global
  const assert = require('assert'), { winner, aiMove, slideNew, slideMove, slideDone, lightsNew, press } = Games._;
  assert.strictEqual(winner(['X', 'X', 'X', '', '', '', '', '', '']), 'X');
  assert.strictEqual(winner(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), 'draw');
  assert.strictEqual(aiMove(['O', 'O', '', 'X', 'X', '', '', '', '']), 2, 'takes the win');
  assert.strictEqual(aiMove(['X', 'X', '', '', 'O', '', '', '', '']), 2, 'blocks');
  for (let k = 0; k < 200; k++) {
    const t = slideNew();
    assert.ok(!slideDone(t) && t.slice().sort().join() === '0,1,2,3,4,5,6,7,8');
    let inv = 0; const v = t.filter(Boolean); for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) if (v[i] > v[j]) inv++;
    assert.strictEqual(inv % 2, 0, 'solvable');
    const g = lightsNew(); assert.ok(!g.every(Boolean));
  }
  const s = [1, 2, 3, 4, 5, 6, 7, 0, 8]; assert.ok(slideMove(s, 8) && slideDone(s)); assert.ok(!slideMove(s, 0));
  const g = Array(9).fill(1); press(g, 4); assert.deepStrictEqual(g, [1, 0, 1, 0, 0, 0, 1, 0, 1]); press(g, 2); assert.deepStrictEqual(g, [1, 1, 0, 0, 0, 1, 1, 0, 1]);
  const G = Games._;
  for (let k = 0; k < 200; k++) {
    const { sol, cells } = G.sudokuNew();
    assert.ok(G.sudokuOk(sol), 'sudoku solution valid'); assert.strictEqual(cells.filter(v => !v).length, 8);
    assert.ok(cells.every((v, i) => !G.clash(cells, i)), 'givens never clash');
    const n = 5 + k % 3, open = G.mazeNew(n), seen = new Set([0]), q = [0]; // every box reachable, walls match on both sides
    while (q.length) { const c = q.pop(); G.DIRS(n).forEach(([d, b, o]) => { if (open[c] & b) { assert.ok(open[c + d] & o); if (!seen.has(c + d)) { seen.add(c + d); q.push(c + d); } } }); }
    assert.strictEqual(seen.size, n * n);
    const nums = G.make10New(); assert.strictEqual(nums.length, 16); assert.ok(nums.every(v => v >= 1 && v <= 9));
    for (const id of Object.keys(G.ASK)) { const r = G.ASK[id](k % 10); assert.strictEqual(new Set(r.opts.map(String)).size, id === 'odd' ? 2 : id === 'letters' ? 4 : 3, id); assert.ok(r.right >= 0 && r.right < r.opts.length, id); }
    const m = G.ASK.math(k % 10), [a, op, b] = m.q.replace(/<[^>]+>/g, '').split(' ');
    assert.strictEqual(m.opts[m.right], op === '+' ? +a + +b : a - b, 'math answer');
  }
  for (let k = 0; k < 20; k++) { const t = G.sortNew(3 + k % 2); assert.ok(!G.sortDone(t) && t.length === 5 + k % 2 && t.flat().length === (3 + k % 2) * 4); }
  assert.ok(G.sortDone([[0, 0, 0, 0], [], [1, 1, 1, 1]]) && !G.sortDone([[0, 0, 0, 1], [1, 1, 1], [0]]));
  assert.ok(G.sortOk([[0, 1], [1]], 0, 1) && !G.sortOk([[0, 1], [0]], 0, 1) && !G.sortOk([[1], [1, 1, 1, 1]], 0, 1));
  assert.ok(G.hanoiOk([[3, 2, 1], [], []], 0, 1) && !G.hanoiOk([[3, 2], [1], []], 0, 1) && !G.hanoiOk([[], [1], []], 0, 2));
  for (let k = 0; k < 100; k++) {
    const seeded = seed => () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646; // same seed, same maze
    const n = 3 + k % 3, solved = G.mazeNew(n, seeded(k + 1)), g = G.pipesNew(n, seeded(k + 1));
    assert.ok(G.pipesDone(solved, n), 'an unturned maze is a solved pipe board');
    assert.ok(!G.pipesDone(g, n) && g.every((m, i) => [0, 1, 2, 3].some(r => { let x = solved[i]; for (let j = 0; j < r; j++) x = G.rot(x); return x === m; })), 'pieces are only turned');
  }
  assert.strictEqual(G.rot(1), 2); assert.strictEqual(G.rot(8), 1); assert.strictEqual(G.rot(5), 10);
  assert.ok(!G.pipesDone([2, 8, 0, 0], 2), 'unconnected boxes are not solved');
  // records, star cap, missions first (dueTasks comes from logic.js)
  assert.ok(G.better('low', 5, 7) && !G.better('low', 8, 7) && G.better('high', 8, 7) && !G.better('high', 7, 7) && G.better('high', 0, undefined));
  assert.ok(G.canEarn(3, 0) && G.canEarn(3, 2) && !G.canEarn(3, 3) && !G.canEarn(0, undefined) && G.canEarn(1, undefined));
  const vm = require('vm'); vm.runInThisContext(require('fs').readFileSync(__dirname + '/logic.js', 'utf8')); global.dueTasks = vm.runInThisContext('dueTasks');
  const all = [0, 1, 2, 3, 4, 5, 6], kid = { days: {}, tasks: [{ id: 1, days: all, since: '2026-01-01' }, { id: 2, days: all, since: '2026-01-01' }, { id: 3, type: 'prayer', days: all, since: '2026-01-01' }] };
  const day = '2026-11-16';
  assert.strictEqual(G.missionsLeft(kid, day), 2, 'prayers never count');
  kid.days[day] = { 1: 'pending' }; assert.strictEqual(G.missionsLeft(kid, day), 1, 'waiting for approval counts as finished');
  kid.days[day][2] = 'done'; assert.strictEqual(G.missionsLeft(kid, day), 0);
  kid.tasks.forEach(t => { t.days = [1]; }); assert.strictEqual(G.missionsLeft(kid, '2026-11-17'), 0, 'rest day is open'); // Nov 17 2026 is a Tuesday
  console.log('games.js ok');
}
