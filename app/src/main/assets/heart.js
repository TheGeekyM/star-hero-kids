// Star Hero 2.15: Hero heart. Manners, values and giving:
// a kindness garden the parent grows ("caught being good"), "What would a hero do?" choices, the value of the week,
// a daily secret kindness mission, duas & manners cards, "Be the teacher" voice lessons, the bedtime review and a charity jar.
// Loaded before app.js; uses its globals (db, st, ui, t, lang, save, render, today, dialog, ic, tune, esc, dayName ...)
// and logic.js (gain, spend, dayOf, parse) only when called. Kid data: st.hh, parent settings: db.hh, bedtime answers: days[d].refl.
// app.js hooks: Heart.install(actions), card() in home(), approveRows()/pendingCount() in the parent's approve page,
// report() in pReport(), settings() in pSettings(), after(app) in render().
const Heart = (() => {
  const L = {
    en: {
      title: 'Hero heart', close: 'Close', garden: 'Kindness garden', gEmpty: 'Your kindness garden is waiting for its first flower 🌱', gCount: '{0} flowers',
      gSub: 'A flower grows when your parents see you being good, and for every secret mission and value challenge you do.',
      t_value: 'Value of the week', t_choice: 'What would a hero do?', t_secret: 'Secret mission', t_duas: 'Duas', t_teach: 'Be the teacher', t_refl: 'Bedtime review', t_sadaqa: 'Charity jar',
      popGood: '{0} saw you {1}! A new flower grew in your garden 🌷', yourParent: 'Your parent',
      chTry: 'Hmm… think again. What would a hero do?', chYes: 'Yes! That is what a hero does! +1⭐', chYes0: 'Yes! That is what a hero does!', chNext: 'A new question comes tomorrow.',
      vChal: "Today's challenge", vDid: 'I did it! ✅', vDone: 'Done today! 🌸', vGoal: 'Do the challenge on 4 days this week to win the {0} medal.',
      vWait: 'Your parents will give you the medal soon!', vGot: 'You won the {0} medal! 🏅', vNo: 'No medal this week. Try again next week!', vMedals: 'My medals',
      sClosed: 'A secret envelope is waiting for you today!', sOpen: 'Open it', sDid: 'I did it!', sWait: 'Waiting for your parents to check ⏳', sDone: 'Mission complete! +2⭐ 🎉', sTomorrow: 'A new secret mission comes tomorrow.',
      dKnow: 'I know it by heart!', dWait: 'Say it to your parents to get 3⭐ ⏳', dGot: 'You know it! ⭐', dBack: 'All duas', dSay: 'Listen', dLearned: '{0} of {1} learned',
      tSub: 'Pick something you learned and explain it like a real teacher. Your parents will listen to your lesson.', tBtn: '🎙️ Teach a lesson', tQ: 'What will you teach?', tGo: 'Start',
      tRec: 'Recording… {0}', tStop: 'Stop', tNoMic: 'The microphone is not available.', tLessons: 'My lessons', tFull: 'Wait until your parents listen to your lessons.',
      r1: 'What good thing did you do today?', r2: 'What will you do better tomorrow?', r3: 'What are you thankful to Allah for?', rStep: '{0} of 3',
      rNight: 'Good night, {0}! Well done for thinking about your day 🌙',
      qSub: 'Give some of your stars. When the jar is full, your parents give {0} for you.', qGive: 'Give {0}⭐', qFull: 'Your jar is full! Your parents will give it for you 💝',
      qGifts: 'You have given charity {0} times! 🌟', qThanks: 'Your charity was given: {0}. May Allah reward you! 💝', giftDef: 'a meal for someone in need',
      pGood: 'Caught being good', pGoodSub: 'Tap when you see {0} being good. A flower grows in the garden and {0} gets 1⭐.', pGrew: '{0} flowers so far',
      pSecret: 'Secret mission', pDua: 'Dua: {0}', pDuaSub: 'Ask {0} to say it to you', pTeach: 'Lesson: {0}', pListen: '▶ Listen',
      pValue: '{0} medal', pValueSub: 'Did the challenge on {0} days this week', pJar: 'Charity jar is full ({0}⭐)', pJarSub: 'Give {0} for {1}, then tap ✓',
      sOn: 'Hero heart (manners and values)', sGoal: 'Charity jar size (stars)', sGift: 'What you give when it is full',
      rChoices: 'Hero choices: {0} answered, {1} right the first time', rChose: 'chose', rDiary: 'Bedtime diary', rDuas: 'Duas learned: {0}', rMedals: 'Medals: {0}', rGifts: 'Charity given: {0} times', none: 'Nothing yet',
    },
    ar: {
      title: 'قلب البطل', close: 'إغلاق', garden: 'حديقة الأخلاق', gEmpty: 'حديقة أخلاقك تنتظر أول زهرة 🌱', gCount: '{0} زهرة',
      gSub: 'تنبت زهرة عندما يراك والداك تفعل الخير، ومع كل مهمة سرية وتحدٍّ للخُلق تنجزه.',
      t_value: 'خُلق الأسبوع', t_choice: 'ماذا يفعل البطل؟', t_secret: 'المهمة السرية', t_duas: 'الأدعية', t_teach: 'كن المعلّم', t_refl: 'محاسبة النفس', t_sadaqa: 'صندوق الصدقة',
      popGood: 'رآك {0} وأنت {1}! نبتت زهرة جديدة في حديقتك 🌷', yourParent: 'والداك',
      chTry: 'همم… فكّر مرة أخرى. ماذا يفعل البطل؟', chYes: 'أحسنت! هذا ما يفعله البطل! +1⭐', chYes0: 'أحسنت! هذا ما يفعله البطل!', chNext: 'سؤال جديد غداً.',
      vChal: 'تحدّي اليوم', vDid: 'فعلتها! ✅', vDone: 'أنجزته اليوم! 🌸', vGoal: 'أنجز التحدي في 4 أيام هذا الأسبوع لتفوز بوسام {0}.',
      vWait: 'سيعطيك والداك الوسام قريباً!', vGot: 'فزت بوسام {0}! 🏅', vNo: 'لا وسام هذا الأسبوع. حاول في الأسبوع القادم!', vMedals: 'أوسمتي',
      sClosed: 'ظرف سري ينتظرك اليوم!', sOpen: 'افتحه', sDid: 'فعلتها!', sWait: 'بانتظار أن يتأكد والداك ⏳', sDone: 'أنجزت المهمة! +2⭐ 🎉', sTomorrow: 'مهمة سرية جديدة غداً.',
      dKnow: 'أحفظه غيباً!', dWait: 'قله لوالديك لتحصل على 3⭐ ⏳', dGot: 'أنت تحفظه! ⭐', dBack: 'كل الأدعية', dSay: 'استمع', dLearned: 'حفظت {0} من {1}',
      tSub: 'اختر شيئاً تعلّمته واشرحه كأنك معلّم حقيقي. سيستمع والداك إلى درسك.', tBtn: '🎙️ اشرح درساً', tQ: 'ماذا ستشرح؟', tGo: 'ابدأ',
      tRec: 'جارٍ التسجيل… {0}', tStop: 'إيقاف', tNoMic: 'الميكروفون غير متاح.', tLessons: 'دروسي', tFull: 'انتظر حتى يستمع والداك إلى دروسك.',
      r1: 'ما الشيء الطيب الذي فعلته اليوم؟', r2: 'ماذا ستفعل أفضل غداً؟', r3: 'على ماذا تشكر الله اليوم؟', rStep: '{0} من 3',
      rNight: 'تصبح على خير يا {0}! أحسنت حين فكّرت في يومك 🌙',
      qSub: 'تبرّع ببعض نجومك. عندما يمتلئ الصندوق يتصدّق والداك عنك بـ{0}.', qGive: 'تبرّع بـ{0}⭐', qFull: 'امتلأ صندوقك! سيتصدّق به والداك عنك 💝',
      qGifts: 'تصدّقت {0} مرات! 🌟', qThanks: 'وصلت صدقتك: {0}. جزاك الله خيراً! 💝', giftDef: 'وجبة لمحتاج',
      pGood: 'رأيته يفعل الخير', pGoodSub: 'اضغط عندما ترى {0} يفعل الخير. تنبت زهرة في حديقته ويحصل على نجمة.', pGrew: '{0} زهرة حتى الآن',
      pSecret: 'المهمة السرية', pDua: 'دعاء: {0}', pDuaSub: 'اطلب من {0} أن يقوله لك', pTeach: 'درس: {0}', pListen: '▶ استمع',
      pValue: 'وسام {0}', pValueSub: 'أنجز التحدي {0} أيام هذا الأسبوع', pJar: 'امتلأ صندوق الصدقة ({0}⭐)', pJarSub: 'تصدّق بـ{0} عن {1} ثم اضغط ✓',
      sOn: 'قلب البطل (الأخلاق والقيم)', sGoal: 'حجم صندوق الصدقة (نجوم)', sGift: 'ما تتصدّق به عندما يمتلئ',
      rChoices: 'اختيارات البطل: أجاب {0}، الصحيح من أول مرة {1}', rChose: 'اختار', rDiary: 'دفتر محاسبة النفس', rDuas: 'الأدعية المحفوظة: {0}', rMedals: 'الأوسمة: {0}', rGifts: 'الصدقات: {0} مرات', none: 'لا شيء بعد',
    },
  };
  const tx = (k, ...a) => { const v = (L[lang()] || L.en)[k] ?? L.en[k] ?? k; return typeof v === 'string' ? v.replace(/\{(\d)\}/g, (_, i) => a[i]) : v; };
  const AR = () => lang() === 'ar';
  const cfg = () => db.hh || (db.hh = { on: true, goal: 30, gift: '' });
  const H = (kid = st) => kid.hh || (kid.hh = { g: [], pop: [], ch: {}, v: {}, vb: [], sec: {}, du: {}, te: [], sq: { n: 0, gifts: 0 } });
  const dn = d => Math.round(parse(d).getTime() / 864e5);
  const week = d => Math.floor((dn(d) - dn('2026-01-03')) / 7); // the week starts on Saturday
  const sb = s => window.Plus ? Plus.sayBtn(s) : '';
  const say = (s, lg) => window.Plus && Plus.say(s, lg);
  const party = () => { if (window.celebrate) celebrate(); };
  const goal = () => cfg().goal || 30;
  const giftText = () => cfg().gift || tx('giftDef');
  const parentName = () => { const m = db.m || {}; return (ui.who === 2 ? m.n2 : m.n1) || ''; };

  // ---------------------------------------------------------------- content
  // [key, flower, en name, en "saw you …", ar name, ar "وأنت …"]
  const VIRT = [
    ['honest', '🌻', 'Honest', 'telling the truth', 'صادق', 'تقول الصدق'],
    ['kind', '🌷', 'Kind', 'being kind', 'رحيم', 'تتعامل بلطف ورحمة'],
    ['help', '🌼', 'Helpful', 'helping others', 'يساعد', 'تساعد غيرك'],
    ['polite', '🌸', 'Polite words', 'using polite words', 'كلامه مؤدب', 'تتكلم بأدب'],
    ['patient', '🍀', 'Patient', 'being patient', 'صبور', 'تصبر ولا تغضب'],
    ['share', '🌺', 'Shared', 'sharing', 'كريم يشارك', 'تشارك غيرك'],
    ['respect', '🌹', 'Respectful', 'respecting elders', 'يحترم الكبار', 'تحترم الكبار'],
    ['sorry', '💮', 'Said sorry', 'saying sorry', 'يعتذر', 'تعتذر عن خطئك'],
  ];
  const vName = v => v[AR() ? 4 : 2];
  const flower = w => (VIRT.find(v => v[0] === w) || VIRT[1])[1];

  // "What would a hero do?": e/a = [question, [3 answers], why, reference], b = the hero's answer
  const SC = [
    { b: 1, e: ['Your friend says: "Let me copy your homework!"', ["Let him copy, he's my friend", 'Help him understand it so he can do it himself', 'Laugh at him'], "Copying doesn't help him learn, and it isn't honest. Helping him understand is real friendship.", '"Help one another in goodness and piety, and do not help one another in sin." (Al-Ma\'idah 5:2)'],
      a: ['صديقك يقول: «دعني أنقل واجبك!»', ['أتركه ينقل، فهو صديقي', 'أساعده ليفهم الدرس ويحلّه بنفسه', 'أضحك عليه'], 'النقل لا يعلّمه شيئاً وليس من الصدق. أن تساعده ليفهم هو الصداقة الحقيقية.', '«وتعاونوا على البر والتقوى ولا تعاونوا على الإثم والعدوان» (المائدة: 2)'] },
    { b: 1, e: ['You find some money on the floor at school.', ['Keep it, nobody saw', 'Give it to the teacher to find its owner', 'Leave it there'], 'Allah always sees us. A hero gives things back to their owners.', '"Allah commands you to return trusts to their owners." (An-Nisa 4:58)'],
      a: ['وجدت نقوداً على الأرض في المدرسة.', ['آخذها، لم يرني أحد', 'أعطيها للمعلّم ليجد صاحبها', 'أتركها مكانها'], 'الله يرانا دائماً. البطل يعيد الأشياء إلى أصحابها.', '«إن الله يأمركم أن تؤدوا الأمانات إلى أهلها» (النساء: 58)'] },
    { b: 1, e: ['Some kids are making fun of a new boy in class.', ['Join in so they like me', 'Stand by him and tell the teacher', 'Just walk away'], 'A hero protects people who are being hurt and never joins in.', '"A Muslim is the brother of a Muslim: he does not wrong him or let him down." (Muslim)'],
      a: ['بعض الأطفال يسخرون من ولد جديد في الصف.', ['أشاركهم ليحبوني', 'أقف بجانبه وأخبر المعلّم', 'أمشي بعيداً فقط'], 'البطل يحمي من يتعرّض للأذى ولا يشارك فيه أبداً.', '«المسلم أخو المسلم، لا يظلمه ولا يخذله» (رواه مسلم)'] },
    { b: 0, e: ['You broke a cup by accident and nobody saw.', ['Tell mum the truth and say sorry', 'Hide the pieces', 'Say the cat did it'], 'Telling the truth takes courage, and that is what makes a real hero.', '"Always be truthful, for truthfulness leads to goodness." (Bukhari & Muslim)'],
      a: ['كسرت كوباً بالخطأ ولم يرك أحد.', ['أخبر أمي بالحقيقة وأعتذر', 'أخبّئ القطع', 'أقول إن القطة كسرته'], 'قول الحقيقة يحتاج شجاعة، وهذا ما يجعلك بطلاً حقيقياً.', '«عليكم بالصدق، فإن الصدق يهدي إلى البر» (متفق عليه)'] },
    { b: 2, e: ['Your little sister grabs your toy.', ['Hit her so she learns', 'Shout as loud as I can', 'Stay calm and ask her kindly, or share'], 'Real strength is staying calm when you are angry.', '"The strong one is not the one who wrestles others down, but the one who controls himself when angry." (Bukhari & Muslim)'],
      a: ['أختك الصغيرة أخذت لعبتك.', ['أضربها لتتعلم', 'أصرخ بأعلى صوتي', 'أهدأ وأطلبها بلطف أو نتشارك'], 'القوة الحقيقية أن تهدأ عندما تغضب.', '«ليس الشديد بالصُّرَعة، إنما الشديد الذي يملك نفسه عند الغضب» (متفق عليه)'] },
    { b: 0, e: ['Mum calls you while you are playing a game.', ['Go to her right away', "Pretend I didn't hear", 'Say "wait!" and keep playing'], 'Answering your parents quickly is one of the deeds Allah loves most.', '"And be good to your parents." (Al-Isra 17:23)'],
      a: ['أمك تناديك وأنت تلعب.', ['أذهب إليها فوراً', 'أتظاهر أني لم أسمع', 'أقول «انتظري!» وأكمل اللعب'], 'أن تلبّي نداء والديك بسرعة من أحب الأعمال إلى الله.', '«وبالوالدين إحساناً» (الإسراء: 23)'] },
    { b: 1, e: ['You see a thirsty cat on a hot day.', ['Chase it away', 'Put out some water for it', 'Ignore it'], 'Being kind to animals is a good deed that Allah rewards.', '"There is a reward for kindness to every living thing." (Bukhari & Muslim)'],
      a: ['رأيت قطة عطشانة في يوم حار.', ['أطردها', 'أضع لها ماءً', 'أتجاهلها'], 'الرحمة بالحيوان عمل طيب يجزي الله عليه.', '«في كل كبدٍ رطبةٍ أجر» (متفق عليه)'] },
    { b: 1, e: ['An old neighbour is carrying heavy bags up the stairs.', ['Run past her', 'Offer to carry a bag', 'Watch and wait'], 'Heroes respect and help older people.', '"He is not one of us who does not show mercy to our young and respect to our elders." (At-Tirmidhi)'],
      a: ['جارتكم الكبيرة تحمل أكياساً ثقيلة على الدرج.', ['أركض وأتجاوزها', 'أعرض أن أحمل كيساً عنها', 'أتفرّج وأنتظر'], 'البطل يحترم الكبار ويساعدهم.', '«ليس منا من لم يرحم صغيرنا ويوقّر كبيرنا» (رواه الترمذي)'] },
    { b: 0, e: ['You lost a race to your friend.', ['Say "well done!" to the winner', 'Say he cheated', 'Cry and stop playing'], 'Be happy for your friend, just like you would want him to be happy for you.', '"None of you truly believes until he loves for his brother what he loves for himself." (Bukhari & Muslim)'],
      a: ['خسرت سباقاً أمام صديقك.', ['أقول للفائز «أحسنت!»', 'أقول إنه غشّ', 'أبكي وأتوقف عن اللعب'], 'افرح لصديقك كما تحب أن يفرح لك.', '«لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه» (متفق عليه)'] },
    { b: 1, e: ['The adhan calls for prayer during your favourite cartoon.', ['Finish the cartoon first, then maybe pray', 'Pause it and go pray', 'Turn the sound up'], 'Prayer comes first. The cartoon will wait for you!', '"Prayer is prescribed for the believers at fixed times." (An-Nisa 4:103)'],
      a: ['أذّن المؤذن وأنت تشاهد كرتونك المفضل.', ['أكمل الكرتون ثم ربما أصلي', 'أوقفه وأذهب لأصلي', 'أرفع الصوت'], 'الصلاة أولاً، والكرتون سينتظرك!', '«إن الصلاة كانت على المؤمنين كتاباً موقوتاً» (النساء: 103)'] },
    { b: 1, e: ['A kid says something rude to you.', ['Say something ruder back', 'Answer with a kind word and walk away calmly', 'Push him'], 'A hero answers bad words with good ones.', '"And speak good words to people." (Al-Baqarah 2:83)'],
      a: ['ولد قال لك كلاماً سيئاً.', ['أرد بكلام أسوأ', 'أرد بكلمة طيبة وأبتعد بهدوء', 'أدفعه'], 'البطل يرد على الكلام السيئ بكلام طيب.', '«وقولوا للناس حُسناً» (البقرة: 83)'] },
    { b: 1, e: ["You promised to give your friend's book back today, but you want to read it more.", ["Keep it, he won't mind", 'Give it back as I promised', 'Say I forgot it'], 'Heroes keep their promises.', '"And keep your promises, you will be asked about them." (Al-Isra 17:34)'],
      a: ['وعدت صديقك أن تعيد كتابه اليوم، لكنك تريد أن تقرأه أكثر.', ['أحتفظ به، لن يمانع', 'أعيده كما وعدت', 'أقول إني نسيته'], 'البطل يفي بوعده.', '«وأوفوا بالعهد إن العهد كان مسؤولاً» (الإسراء: 34)'] },
    { b: 1, e: ["You're full but there is food left on your plate.", ['Throw it in the bin', 'Save it for later and take less next time', 'Play with it'], 'Food is a blessing from Allah, so we never waste it.', '"Eat and drink, but do not waste." (Al-A\'raf 7:31)'],
      a: ['شبعت وبقي طعام في صحنك.', ['أرميه في السلة', 'أحفظه لوقت لاحق وآخذ أقل في المرة القادمة', 'ألعب به'], 'الطعام نعمة من الله فلا نرميه أبداً.', '«وكلوا واشربوا ولا تسرفوا» (الأعراف: 31)'] },
    { b: 1, e: ['You see your friend in the morning at school.', ['Wait for him to say hello first', 'Say "As-salamu alaykum" first, with a smile', 'Look away'], 'The best one is the one who says salam first.', '"Spread the greeting of salam among you." (Muslim)'],
      a: ['رأيت صديقك صباحاً في المدرسة.', ['أنتظره ليسلّم أولاً', 'أبدأه بـ«السلام عليكم» مع ابتسامة', 'أنظر بعيداً'], 'خيرنا من يبدأ بالسلام.', '«أفشوا السلام بينكم» (رواه مسلم)'] },
    { b: 0, e: ['Your teacher helped you fix a mistake.', ['Say "Thank you, teacher!"', 'Say nothing', 'Say I knew it already'], 'Thanking people is part of thanking Allah.', '"Whoever does not thank people does not thank Allah." (Abu Dawud & At-Tirmidhi)'],
      a: ['ساعدك معلّمك في تصحيح خطأ.', ['أقول «شكراً يا أستاذ!»', 'لا أقول شيئاً', 'أقول كنت أعرف ذلك'], 'شكر الناس من شكر الله.', '«من لا يشكر الناس لا يشكر الله» (رواه أبو داود والترمذي)'] },
    { b: 2, e: ['You see a bottle lying on the path in the park.', ['Kick it', "Leave it, it's not mine", 'Pick it up and put it in the bin'], 'Keeping the path clean for others is a charity.', '"Removing something harmful from the path is charity." (Bukhari & Muslim)'],
      a: ['رأيت زجاجة على الممر في الحديقة.', ['أركلها', 'أتركها، ليست لي', 'ألتقطها وأضعها في السلة'], 'تنظيف الطريق للناس صدقة.', '«وتُميط الأذى عن الطريق صدقة» (متفق عليه)'] },
  ];

  // value of the week: w = the garden flower, e/a = [name, story, reference, [3 daily challenges]]
  const VAL = [
    { w: 'honest', e: ['Honesty', 'Before he became a prophet, the people of Makkah called Muhammad ﷺ "the Truthful, the Trustworthy". Even people who disagreed with him trusted him with their precious things.', '"Always be truthful, for truthfulness leads to goodness." (Bukhari & Muslim)', ["Tell the truth, even when it's hard", 'Keep safe something someone trusted you with', 'Tell your parents one true thing about your day']],
      a: ['الصدق', 'قبل أن يصبح نبياً، كان أهل مكة يسمّون محمداً ﷺ «الصادق الأمين»، وحتى من خالفوه كانوا يتركون عنده أغلى أشيائهم.', '«عليكم بالصدق، فإن الصدق يهدي إلى البر» (متفق عليه)', ['قل الصدق حتى لو كان صعباً', 'احفظ شيئاً ائتمنك عليه أحد', 'أخبر والديك بشيء صادق عن يومك']] },
    { w: 'kind', e: ['Mercy', 'A thirsty man found a well and drank. Then he saw a dog panting with thirst. He filled his shoe with water and gave it to the dog, and Allah thanked him and forgave him.', '"The merciful are shown mercy by the Most Merciful." (Abu Dawud & At-Tirmidhi)', ['Be gentle with a younger child', 'Put out water or food for a bird or a cat', 'Comfort someone who is sad']],
      a: ['الرحمة', 'وجد رجل عطشان بئراً فشرب، ثم رأى كلباً يلهث من العطش، فملأ حذاءه ماءً وسقى الكلب، فشكر الله له وغفر له.', '«الراحمون يرحمهم الرحمن» (رواه أبو داود والترمذي)', ['كن لطيفاً مع طفل أصغر منك', 'ضع ماءً أو طعاماً لطائر أو قطة', 'واسِ شخصاً حزيناً']] },
    { w: 'respect', e: ['Being good to parents', 'A companion asked the Prophet ﷺ which deed Allah loves most. He said: "Prayer on time." "Then what?" He said: "Being good to your parents."', '"And be good to your parents." (Al-Isra 17:23)', ['Do what your parents ask the first time', 'Help with a job at home without being asked', "Kiss your parents' hands and make dua for them"]],
      a: ['بر الوالدين', 'سأل صحابيٌّ النبي ﷺ: أي العمل أحب إلى الله؟ قال: «الصلاة على وقتها». قال: ثم أي؟ قال: «بر الوالدين».', '«وبالوالدين إحساناً» (الإسراء: 23)', ['نفّذ ما يطلبه والداك من أول مرة', 'ساعد في عمل في البيت دون أن يُطلب منك', 'قبّل يد والديك وادعُ لهما']] },
    { w: 'honest', e: ['Keeping promises', 'When the Prophet ﷺ left Makkah, he asked Ali to stay behind and give back everything people had left with him, even to people who were hurting him.', '"And keep your promises, you will be asked about them." (Al-Isra 17:34)', ['Keep a promise you made', 'Give back something you borrowed', 'Be on time for something today']],
      a: ['الوفاء بالوعد', 'عندما هاجر النبي ﷺ من مكة، ترك علياً ليعيد الأمانات إلى أصحابها، حتى لمن كانوا يؤذونه.', '«وأوفوا بالعهد إن العهد كان مسؤولاً» (الإسراء: 34)', ['أوفِ بوعد قطعته', 'أعد شيئاً استعرته', 'كن في الموعد في شيء اليوم']] },
    { w: 'patient', e: ['Patience', 'Prophet Ayyub was sick for a long time and lost a lot, but he never complained. He kept praising Allah, and Allah healed him and gave him back even more.', '"Allah is with those who are patient." (Al-Baqarah 2:153)', ['Wait for your turn without complaining', 'When you feel angry, stay calm and say "A\'udhu billah"', 'Keep trying at something hard']],
      a: ['الصبر', 'مرض النبي أيوب عليه السلام مدة طويلة وفقد الكثير، لكنه لم يشتكِ أبداً وظل يحمد الله، فشفاه الله وأعطاه أكثر مما فقد.', '«إن الله مع الصابرين» (البقرة: 153)', ['انتظر دورك دون تذمّر', 'إذا غضبت فاهدأ وقل «أعوذ بالله من الشيطان الرجيم»', 'استمر في محاولة شيء صعب']] },
    { w: 'polite', e: ['Thankfulness', 'When Prophet Sulayman heard a little ant warning her friends, he smiled and said: "My Lord, help me to be thankful for Your blessings."', '"If you are grateful, I will surely give you more." (Ibrahim 14:7)', ['Say "Alhamdulillah" after eating', 'Thank someone who helped you', 'Tell your family 3 things you are thankful for']],
      a: ['الشكر', 'عندما سمع النبي سليمان عليه السلام نملة صغيرة تحذّر صديقاتها، تبسّم وقال: «ربِّ أوزعني أن أشكر نعمتك».', '«لئن شكرتم لأزيدنّكم» (إبراهيم: 7)', ['قل «الحمد لله» بعد الأكل', 'اشكر شخصاً ساعدك', 'أخبر أهلك بثلاثة أشياء تشكر الله عليها']] },
    { w: 'help', e: ['Cleanliness', 'The Prophet ﷺ loved being clean and smelling nice. He used the siwak to clean his teeth many times every day.', '"Cleanliness is half of faith." (Muslim)', ['Brush your teeth morning and night', 'Tidy your room', 'Wash your hands before eating']],
      a: ['النظافة', 'كان النبي ﷺ يحب النظافة والرائحة الطيبة، وكان يستعمل السواك لينظّف أسنانه مرات كثيرة كل يوم.', '«الطُّهور شطر الإيمان» (رواه مسلم)', ['نظّف أسنانك صباحاً ومساءً', 'رتّب غرفتك', 'اغسل يديك قبل الأكل']] },
    { w: 'share', e: ['Generosity', 'When the Muslims moved to Madinah with nothing, the people of Madinah (the Ansar) happily shared their homes and their food with them.', '"They give others preference over themselves, even when they are in need." (Al-Hashr 59:9)', ['Share a snack', 'Lend a toy to someone', 'Put a coin in a charity box']],
      a: ['الكرم', 'عندما هاجر المسلمون إلى المدينة ولم يكن معهم شيء، شاركهم الأنصار بيوتهم وطعامهم بكل فرح.', '«ويؤثرون على أنفسهم ولو كان بهم خصاصة» (الحشر: 9)', ['شارك وجبتك الخفيفة', 'أعِر لعبة لغيرك', 'ضع قطعة نقود في صندوق الصدقة']] },
    { w: 'sorry', e: ['Forgiveness', 'When the Prophet ﷺ came back to Makkah as the winner, he forgave the people who had hurt him for years and told them: "Go, you are free."', '"Let them forgive and overlook. Would you not love Allah to forgive you?" (An-Nur 24:22)', ['Forgive someone who upset you', 'Say sorry when you make a mistake', "Don't stay angry, smile again"]],
      a: ['العفو', 'عندما عاد النبي ﷺ إلى مكة منتصراً، عفا عن الذين آذوه سنوات طويلة وقال لهم: «اذهبوا فأنتم الطلقاء».', '«وليعفوا وليصفحوا ألا تحبون أن يغفر الله لكم» (النور: 22)', ['سامح شخصاً أزعجك', 'اعتذر عندما تخطئ', 'لا تبقَ غاضباً، وابتسم من جديد']] },
    { w: 'respect', e: ['Humility', 'The Prophet ﷺ helped his family at home and mended his own shoes, even though he was the leader of everyone.', '"No one humbles himself for Allah but Allah raises him." (Muslim)', ["Don't show off, let others shine too", 'Play with someone who is left out', 'Do a small job nobody likes doing']],
      a: ['التواضع', 'كان النبي ﷺ يساعد أهله في البيت ويصلح نعله بنفسه، مع أنه قائد الناس جميعاً.', '«وما تواضع أحد لله إلا رفعه الله» (رواه مسلم)', ['لا تتفاخر، ودع غيرك يتألق أيضاً', 'العب مع من لا يلعب معه أحد', 'قم بعمل صغير لا يحب أحد أن يقوم به']] },
    { w: 'help', e: ['Helping each other', 'Dhul-Qarnayn helped a people build a great wall to protect them. He told them: "Help me with your strength", and together they built it.', '"Help one another in goodness and piety." (Al-Ma\'idah 5:2)', ['Help set or clear the table', 'Finish something together with a brother, sister or friend', 'Help a classmate who is stuck']],
      a: ['التعاون', 'ساعد ذو القرنين قوماً على بناء سدّ عظيم يحميهم، وقال لهم: «فأعينوني بقوة»، فبنوه معاً.', '«وتعاونوا على البر والتقوى» (المائدة: 2)', ['ساعد في تجهيز السفرة أو رفعها', 'أنجز شيئاً مع أخيك أو صديقك', 'ساعد زميلاً لم يفهم الدرس']] },
    { w: 'polite', e: ['Kind words', 'The Prophet ﷺ always smiled at people and spoke gently. He taught us that even a smile is a charity.', '"A good word is charity." (Bukhari & Muslim)', ['Say "please" and "thank you" all day', 'Say something nice to 3 people', 'Smile at everyone you meet']],
      a: ['الكلمة الطيبة', 'كان النبي ﷺ يبتسم في وجوه الناس ويتكلم بلطف، وعلّمنا أن الابتسامة صدقة.', '«والكلمة الطيبة صدقة» (متفق عليه)', ['قل «من فضلك» و«شكراً» طوال اليوم', 'قل كلاماً جميلاً لثلاثة أشخاص', 'ابتسم في وجه كل من تقابله']] },
  ];

  const SECRET = [
    ['Help set the table without being asked', 'ساعد في تجهيز السفرة دون أن يطلب منك أحد'],
    ['Say "thank you" to 3 people today', 'قل «شكراً» لثلاثة أشخاص اليوم'],
    ['Make your bed and tidy your room as a surprise', 'رتّب سريرك وغرفتك كمفاجأة'],
    ['Draw a picture for mum or dad', 'ارسم رسمة لأمك أو أبيك'],
    ['Say something really nice to someone', 'امدح شخصاً بكلام جميل'],
    ['Let your brother or sister choose the game', 'دع أخاك أو أختك يختار اللعبة'],
    ['Be the first to say salam to everyone at home', 'ابدأ كل من في البيت بالسلام'],
    ['Help carry the shopping bags', 'ساعد في حمل أكياس المشتريات'],
    ['Make dua for your parents in your prayer', 'ادعُ لوالديك في صلاتك'],
    ['Put your shoes and clothes in their place', 'ضع حذاءك وملابسك في مكانها'],
    ['Bring a glass of water to someone in your family', 'أحضر كوب ماء لأحد أفراد أسرتك'],
    ['Share your favourite snack', 'شارك وجبتك المفضلة'],
    ['Call or hug your grandparents', 'اتصل بجدك أو جدتك أو عانقهما'],
    ['Help a friend with something hard', 'ساعد صديقك في شيء صعب'],
    ['Water the plants', 'اسقِ النباتات'],
    ['Say only kind words all day', 'لا تقل إلا كلاماً طيباً طوال اليوم'],
    ['Pick up litter you see and put it in the bin', 'التقط القمامة التي تراها وضعها في السلة'],
    ['Say "Alhamdulillah" for 5 blessings', 'قل «الحمد لله» على خمس نِعَم'],
    ["Tidy up the toys, even ones you didn't play with", 'رتّب الألعاب حتى التي لم تلعب بها'],
    ['Recite a short surah to someone in your family', 'اقرأ سورة قصيرة على أحد أفراد أسرتك'],
  ];

  // duas & manners: e = picture, w = [en, ar] when, d = the dua (Arabic), m = its meaning in English
  const DUAS = [
    { e: '🍽️', w: ['Before eating', 'قبل الأكل'], d: 'بسم الله', m: 'In the name of Allah.' },
    { e: '😋', w: ['After eating', 'بعد الأكل'], d: 'الحمد لله الذي أطعمني هذا ورزقنيه من غير حولٍ مني ولا قوة', m: 'Praise be to Allah who fed me this and gave it to me, without any power or strength from me.' },
    { e: '🛏️', w: ['Before sleeping', 'قبل النوم'], d: 'باسمك اللهم أموت وأحيا', m: 'In Your name, O Allah, I die and I live.' },
    { e: '🌅', w: ['Waking up', 'عند الاستيقاظ'], d: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور', m: 'Praise be to Allah who gave us life after He made us sleep, and to Him we return.' },
    { e: '👕', w: ['Getting dressed', 'عند لبس الثوب'], d: 'الحمد لله الذي كساني هذا ورزقنيه من غير حولٍ مني ولا قوة', m: 'Praise be to Allah who dressed me in this and gave it to me, without any power or strength from me.' },
    { e: '🚪', w: ['Leaving home', 'عند الخروج من البيت'], d: 'بسم الله، توكلت على الله، ولا حول ولا قوة إلا بالله', m: 'In the name of Allah, I trust in Allah, and there is no power and no strength except with Allah.' },
    { e: '🏠', w: ['Coming home', 'عند دخول البيت'], d: 'بسم الله ولجنا، وبسم الله خرجنا، وعلى ربنا توكلنا', m: 'In the name of Allah we come in, in the name of Allah we go out, and in our Lord we trust. (Then say salam.)' },
    { e: '🚻', w: ['Going to the toilet', 'عند دخول الخلاء'], d: 'اللهم إني أعوذ بك من الخُبث والخبائث', m: 'O Allah, I seek refuge in You from all evil and evil ones.' },
    { e: '🧼', w: ['Leaving the toilet', 'عند الخروج من الخلاء'], d: 'غُفرانك', m: 'I ask for Your forgiveness.' },
    { e: '🤧', w: ['When you sneeze', 'عند العطاس'], d: 'الحمد لله\nيرحمك الله\nيهديكم الله ويصلح بالكم', m: 'You say: "Alhamdulillah". Others say: "May Allah have mercy on you". You answer: "May Allah guide you and set your affairs right".' },
    { e: '🚗', w: ['Riding in the car', 'عند ركوب السيارة'], d: 'سبحان الذي سخّر لنا هذا وما كنا له مقرنين، وإنا إلى ربنا لمنقلبون', m: 'Glory be to Him who made this useful for us, we could not have done it ourselves, and to our Lord we will return.' },
    { e: '🕌', w: ['Entering the mosque', 'عند دخول المسجد'], d: 'اللهم افتح لي أبواب رحمتك', m: 'O Allah, open for me the doors of Your mercy.' },
    { e: '👣', w: ['Leaving the mosque', 'عند الخروج من المسجد'], d: 'اللهم إني أسألك من فضلك', m: 'O Allah, I ask You for Your bounty.' },
    { e: '🌧️', w: ['When it rains', 'عند نزول المطر'], d: 'اللهم صيّباً نافعاً', m: 'O Allah, make it a helpful rain.' },
    { e: '📚', w: ['Before studying', 'قبل المذاكرة'], d: 'ربِّ زدني علماً', m: 'My Lord, increase me in knowledge. (Ta-Ha 20:114)' },
    { e: '😤', w: ['When you feel angry', 'عند الغضب'], d: 'أعوذ بالله من الشيطان الرجيم', m: 'I seek refuge in Allah from the accursed Shaytan.' },
    { e: '👪', w: ['For your parents', 'للوالدين'], d: 'ربِّ ارحمهما كما ربّياني صغيراً', m: 'My Lord, have mercy on them as they raised me when I was small. (Al-Isra 17:24)' },
  ];

  // bedtime review: [picture, en, ar] for each of the 3 questions
  const REFL = [
    [['🤝', 'I helped someone', 'ساعدت أحداً'], ['🕌', 'I prayed on time', 'صليت في وقتها'], ['📚', 'I studied well', 'ذاكرت جيداً'], ['💬', 'I said kind words', 'قلت كلاماً طيباً'], ['🍪', 'I shared', 'شاركت غيري'], ['😊', 'I made someone smile', 'أسعدت أحداً']],
    [['⏰', 'Be on time', 'ألتزم بالوقت'], ['😌', 'Stay calm', 'أهدأ ولا أغضب'], ['🙋', 'Listen to my parents', 'أسمع كلام والديّ'], ['📖', 'Read more Quran', 'أقرأ قرآناً أكثر'], ['🧹', 'Tidy my things', 'أرتّب أغراضي'], ['🗣️', 'Say sorry quickly', 'أعتذر بسرعة']],
    [['👨‍👩‍👦', 'My family', 'عائلتي'], ['🍽️', 'Food', 'الطعام'], ['💪', 'Being healthy', 'الصحة'], ['🧒', 'My friends', 'أصدقائي'], ['🏠', 'My home', 'بيتي'], ['🕋', 'Islam', 'الإسلام'], ['🎓', 'My school', 'مدرستي'], ['🌞', 'A fun day', 'يوم جميل']],
  ];
  const reflText = (q, k) => { const o = REFL[q][k]; return o ? `${o[0]} ${o[AR() ? 2 : 1]}` : ''; };

  // ---------------------------------------------------------------- rules
  function bloom(w, kid = st) { const g = H(kid).g; g.push([w, today()]); if (g.length > 300) g.splice(0, g.length - 300); }
  function todayChoice() { // [day, scenario, solved]: new ones first, then they come round again
    const h = H();
    if (!h.cd || h.cd[0] !== today()) { const next = SC.findIndex((_, i) => !(i in h.ch)); h.cd = [today(), next >= 0 ? next : dn(today()) % SC.length, 0]; }
    return h.cd;
  }
  const valNow = () => { const wk = week(today()); return { wk, i: wk % VAL.length }; };
  const valCur = h => h.v.wk === valNow().wk ? h.v : { days: [] };
  const valPending = h => h.v.wk === valNow().wk && h.v.days.length >= 4 && !h.v.s;
  const secretIdx = () => (dn(today()) * 7 + st.id) % SECRET.length;
  const teachKey = (kid, id) => `teach-${kid.id}-${id}`;
  const pendingCount = (kid = st) => {
    if (cfg().on === false) return 0;
    const h = H(kid);
    return (h.sec.s === 'p') + Object.values(h.du).filter(v => v === 'p').length + h.te.filter(x => x.s === 'p').length + valPending(h) + (h.sq.n >= goal());
  };

  // ---------------------------------------------------------------- Home card
  const TILES = [['value', '🏅'], ['choice', '🦸'], ['secret', '✉️'], ['duas', '📿'], ['teach', '🎓'], ['refl', '🌙'], ['sadaqa', '💝']];
  function dot(k) {
    const h = H();
    return k === 'value' ? !valCur(h).days.includes(today()) : k === 'choice' ? !todayChoice()[2] : k === 'secret' ? h.sec.d !== today()
      : k === 'refl' ? new Date().getHours() >= 17 && !(st.days[today()] || {}).refl : false;
  }
  const bed = (g, n) => g.slice(-n).map((x, i) => `<span style="--i:${i % 20}">${flower(x[0])}</span>`).join('');
  function card() {
    if (cfg().on === false) return '';
    const g = H().g;
    return `<section class="xcard hcard"><div class="xcard-h"><span class="xbig-ic">💖</span><b>${tx('title')}</b></div>
      <button class="hbed" data-a="hOpen" data-id="garden" aria-label="${tx('garden')}">${g.length ? bed(g, 16) + `<em>${tx('gCount', g.length)}</em>` : `<small>${tx('gEmpty')}</small>`}</button>
      <div class="htiles">${TILES.map(([k, e]) => `<button data-a="hOpen" data-id="${k}"><span>${e}</span><b>${tx('t_' + k)}</b>${dot(k) ? '<i></i>' : ''}</button>`).join('')}</div></section>`;
  }

  // ---------------------------------------------------------------- sheets (drawn on top of Home after each render)
  function gardenSheet() {
    const g = H().g, counts = VIRT.map(v => [v, g.filter(x => x[0] === v[0]).length]).filter(x => x[1]);
    return `<div class="hbed big">${g.length ? bed(g, 150) : '<span>🌱</span>'}</div><p class="hwhy">${tx('gSub')}</p>
      ${counts.length ? `<div class="xchips">${counts.map(([v, n]) => `<span class="xchip">${v[1]} ${esc(vName(v))} × ${n}</span>`).join('')}</div>` : ''}`;
  }
  function choiceSheet() {
    const h = H(), [, id, ok] = todayChoice(), s = SC[id], [q, opts, why, ref] = AR() ? s.a : s.e, wrong = ui.hWrong || [];
    const order = [0, 1, 2].map(i => (i + id) % 3); // the hero's answer is not always in the same place
    return `<div class="hq">${esc(q)}</div>${sb(q)}
      <div class="hopts">${order.map(i => `<button class="${ok && i === s.b ? 'yes' : wrong.includes(i) ? 'no' : ''}" data-a="hPick" data-id="${i}" ${ok || wrong.includes(i) ? 'disabled' : ''}>${esc(opts[i])}</button>`).join('')}</div>
      ${ok ? `<div class="hok">${tx(h.ch[id] === s.b ? 'chYes' : 'chYes0')}</div><p class="hwhy">${esc(why)}</p><p class="href">${esc(ref)}</p>${sb(why + ' ' + ref)}<small class="hnote">${tx('chNext')}</small>`
        : wrong.length ? `<div class="hhmm">${tx('chTry')}</div>` : ''}`;
  }
  function medals(h) {
    const n = {};
    for (const i of h.vb) n[i] = (n[i] || 0) + 1;
    const k = Object.keys(n);
    return k.length ? `<b>${tx('vMedals')}</b><div class="xchips">${k.map(i => `<span class="xchip">🏅 ${esc(VAL[i][AR() ? 'a' : 'e'][0])}${n[i] > 1 ? ' ×' + n[i] : ''}</span>`).join('')}</div>` : '';
  }
  function valueSheet() {
    const h = H(), v = VAL[valNow().i], [n, story, ref, ch] = AR() ? v.a : v.e, cur = valCur(h), did = cur.days.includes(today()), c = ch[dn(today()) % 3];
    return `<div class="hval-n">${flower(v.w)} ${esc(n)}</div><p class="hstory">${esc(story)}</p><p class="href">${esc(ref)}</p>${sb(story + ' ' + ref)}
      <div class="hchal"><small>${tx('vChal')}</small><b>${esc(c)}</b>${did ? `<em>${tx('vDone')}</em>` : `<button class="btn go" data-a="hVal">${tx('vDid')}</button>`}</div>
      <div class="hdots">${[0, 1, 2, 3, 4, 5, 6].map(i => `<i class="${i < cur.days.length ? 'on' : ''}"></i>`).join('')}</div>
      <small class="hnote">${cur.s === 'y' ? tx('vGot', esc(n)) : cur.s === 'n' ? tx('vNo') : cur.days.length >= 4 ? tx('vWait') : tx('vGoal', esc(n))}</small>${medals(h)}`;
  }
  function secretSheet() {
    const s = H().sec;
    if (s.d !== today()) return `<button class="henv" data-a="hSecret" aria-label="${tx('sOpen')}">✉️</button><b class="hq">${tx('sClosed')}</b><button class="btn go" data-a="hSecret">${tx('sOpen')}</button>`;
    const m = SECRET[s.i][AR() ? 1 : 0];
    return `<div class="henv open">💌</div><div class="hq">${esc(m)}</div>${sb(m)}
      ${s.s === 'open' ? `<button class="btn go" data-a="hSecretDid">${tx('sDid')}</button>` : s.s === 'p' ? `<div class="hhmm">${tx('sWait')}</div>` : `<div class="hok">${tx('sDone')}</div><small class="hnote">${tx('sTomorrow')}</small>`}`;
  }
  function duasSheet() {
    const h = H(), w = d => esc(d.w[AR() ? 1 : 0]);
    if (ui.hDua == null) return `<small class="hnote">${tx('dLearned', DUAS.filter((_, i) => h.du[i] === 'y').length, DUAS.length)}</small>
      <div class="hduas">${DUAS.map((d, i) => `<button data-a="hDua" data-id="${i}"><span>${d.e}</span><b>${w(d)}</b>${h.du[i] === 'y' ? '<i>⭐</i>' : h.du[i] === 'p' ? '<i>⏳</i>' : ''}</button>`).join('')}</div>`;
    const i = ui.hDua, d = DUAS[i], s = h.du[i];
    return `<button class="link hback" data-a="hDua" data-id="-1">${AR() ? '›' : '‹'} ${tx('dBack')}</button>
      <div class="hdua-e">${d.e}</div><b class="hq">${w(d)}</b>
      <p class="hdua" dir="rtl" lang="ar">${esc(d.d).replace(/\n/g, '<br>')}</p>${AR() ? '' : `<p class="hwhy">${esc(d.m)}</p>`}
      <button class="btn off" data-a="hSayAr" data-t="${esc(d.d)}">🔊 ${tx('dSay')}</button>
      ${s === 'y' ? `<div class="hok">${tx('dGot')}</div>` : s === 'p' ? `<div class="hhmm">${tx('dWait')}</div>` : `<button class="btn go" data-a="hKnow" data-id="${i}">${tx('dKnow')}</button>`}`;
  }
  function teachSheet() {
    const te = H().te.slice(-6).reverse();
    return `<div class="henv open">🎓</div><p class="hwhy">${tx('tSub')}</p><button class="btn go" data-a="hTeach">${tx('tBtn')}</button>
      ${te.length ? `<b>${tx('tLessons')}</b><div class="xchips">${te.map(x => `<span class="xchip">${x.s === 'y' ? '⭐' : x.s === 'n' ? '🔁' : '⏳'} ${esc(x.w)}</span>`).join('')}</div>` : ''}`;
  }
  function reflSheet() {
    const done = (st.days[today()] || {}).refl;
    if (done) return `<div class="henv open">🌙</div><div class="hok">${tx('rNight', esc(st.name))}</div><div class="xchips">${done.map((k, q) => `<span class="xchip">${esc(reflText(q, k))}</span>`).join('')}</div>`;
    const q = (ui.hR || []).length, ask = tx('r' + (q + 1));
    return `<small class="hnote">${tx('rStep', q + 1)}</small><div class="hq">${ask}</div>${sb(ask)}
      <div class="hduas">${REFL[q].map((o, i) => `<button data-a="hRefl" data-id="${i}"><span>${o[0]}</span><b>${esc(o[AR() ? 2 : 1])}</b></button>`).join('')}</div>`;
  }
  function sadaqaSheet() {
    const q = H().sq, full = q.n >= goal();
    return `<div class="hjar"><i style="height:${Math.min(100, q.n / goal() * 100)}%"></i><span>💝</span></div><b class="hjar-n" dir="ltr">${q.n} / ${goal()} ⭐</b>
      <p class="hwhy">${tx('qSub', esc(giftText()))}</p>
      ${full ? `<div class="hok">${tx('qFull')}</div>` : `<div class="line">${[1, 5].map(n => `<button class="btn go" data-a="hGive" data-id="${n}" ${st.stars < 1 ? 'disabled' : ''}>${tx('qGive', n)}</button>`).join('')}</div>`}
      ${q.gifts ? `<small class="hnote">${tx('qGifts', q.gifts)}</small>` : ''}`;
  }
  const SHEETS = { garden: [gardenSheet, '🌷', 'garden'], value: [valueSheet, '🏅', 't_value'], choice: [choiceSheet, '🦸', 't_choice'], secret: [secretSheet, '✉️', 't_secret'],
    duas: [duasSheet, '📿', 't_duas'], teach: [teachSheet, '🎓', 't_teach'], refl: [reflSheet, '🌙', 't_refl'], sadaqa: [sadaqaSheet, '💝', 't_sadaqa'] };
  function sheet() {
    const [fn, e, k] = SHEETS[ui.heart];
    return `<div class="xpick hsheet" data-a="hBack"><div class="xpick-card"><button class="hx" data-a="hClose" aria-label="${tx('close')}">${ic('x')}</button><h2>${e} ${tx(k)}</h2>${fn()}</div></div>`;
  }

  // ---------------------------------------------------------------- "Be the teacher": a voice lesson for the parent
  async function recordVoice(max) {
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return null; }
    if (!window.MediaRecorder) { stream.getTracks().forEach(x => x.stop()); return null; }
    return new Promise(ok => {
      const rec = new MediaRecorder(stream), chunks = [], el = document.createElement('div');
      let left = max;
      el.className = 'xrec'; el.innerHTML = `<div class="xrec-card"><i class="xdot"></i><b></b><button class="btn go">${tx('tStop')}</button></div>`;
      document.body.appendChild(el);
      const label = el.querySelector('b'), tick = () => { label.textContent = tx('tRec', left); };
      tick();
      const timer = setInterval(() => { if (--left <= 0 && rec.state === 'recording') rec.stop(); tick(); }, 1000);
      el.querySelector('button').onclick = () => rec.state === 'recording' && rec.stop();
      rec.ondataavailable = e => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        clearInterval(timer); stream.getTracks().forEach(x => x.stop()); el.remove();
        const fr = new FileReader();
        fr.onload = () => ok(fr.result); fr.onerror = () => ok(null);
        fr.readAsDataURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
      };
      rec.start();
    });
  }
  async function teach() {
    const kid = st, h = H(kid);
    if (h.te.filter(x => x.s === 'p').length >= 3) return dialog({ icon: 'missed', text: tx('tFull'), cancel: null });
    const w = ((await dialog({ icon: 'sparkle', title: tx('tQ'), input: { max: 30 }, ok: tx('tGo') })) || '').trim();
    if (!w) return;
    const url = await recordVoice(90);
    if (!url) return dialog({ icon: 'missed', text: tx('tNoMic'), cancel: null });
    const id = Date.now() % 1e9;
    if (window.Extras) await Extras.putPhoto(teachKey(kid, id), { day: today(), url }); // kept with the homework photos (3 weeks)
    h.te.push({ id, d: today(), w: w.slice(0, 30), s: 'p' });
    if (h.te.length > 20) h.te.splice(0, h.te.length - 20);
    party(); save(); render();
  }
  const listen = id => window.Extras && Extras.getPhoto(teachKey(st, id)).then(v => { if (v && v.url) new Audio(v.url).play().catch(() => {}); });

  // ---------------------------------------------------------------- parent: caught being good + approvals
  const row = (e, title, sub, k, id, only) => `<div class="row pend"><span class="ico xemo">${e}</span><span class="txt"><b>${title}</b><small>${sub}</small></span>
    ${only ? '' : `<button class="no" data-a="hYes" data-k="${k}" data-id="${id}" data-v="0" aria-label="${t('notNow')}">${ic('x')}</button>`}<button class="yes" data-a="hYes" data-k="${k}" data-id="${id}" data-v="1" aria-label="OK">${ic('check')}</button></div>`;
  function approveRows() {
    if (cfg().on === false) return '';
    const h = H(), rows = [], name = esc(st.name);
    if (h.sec.s === 'p') rows.push(row('✉️', tx('pSecret'), esc(SECRET[h.sec.i][AR() ? 1 : 0]), 'sec', 0));
    for (const i in h.du) if (h.du[i] === 'p') rows.push(row(DUAS[i].e, tx('pDua', esc(DUAS[i].w[AR() ? 1 : 0])), tx('pDuaSub', name), 'dua', i));
    for (const x of h.te) if (x.s === 'p') rows.push(row('🎓', tx('pTeach', esc(x.w)), `<button class="link" data-a="hListen" data-id="${x.id}">${tx('pListen')}</button>`, 'teach', x.id));
    if (valPending(h)) rows.push(row('🏅', tx('pValue', esc(VAL[h.v.i][AR() ? 'a' : 'e'][0])), tx('pValueSub', h.v.days.length), 'val', 0));
    if (h.sq.n >= goal()) rows.push(row('💝', tx('pJar', goal()), tx('pJarSub', esc(giftText()), name), 'jar', 0, true));
    return `<div class="edit hgood"><b>🌷 ${tx('pGood')}</b><small class="hintx">${tx('pGoodSub', name)}</small>
      <div class="hgood-g">${VIRT.map(v => `<button data-a="hGood" data-id="${v[0]}"><span>${v[1]}</span>${esc(vName(v))}</button>`).join('')}</div>
      <small class="hintx">${tx('pGrew', h.g.length)}</small></div>${rows.join('')}`;
  }
  function decide(k, id, yes) {
    const h = H(), d = today();
    if (k === 'sec') { if (yes) { h.sec.s = 'd'; gain(st, d, 2, ['secret']); bloom('help'); } else h.sec.s = 'open'; }
    else if (k === 'dua') { if (yes) { h.du[id] = 'y'; gain(st, d, 3, ['dua', DUAS[id].w[AR() ? 1 : 0]]); } else delete h.du[id]; }
    else if (k === 'teach') {
      const x = h.te.find(x => x.id === +id);
      if (!x) return;
      x.s = yes ? 'y' : 'n';
      if (yes) gain(st, d, 3, ['teach', x.w]);
      if (window.Extras) Extras.putPhoto(teachKey(st, x.id), null);
    } else if (k === 'val') { h.v.s = yes ? 'y' : 'n'; if (yes) { h.vb.push(h.v.i); gain(st, d, 5, ['value', VAL[h.v.i][AR() ? 'a' : 'e'][0]]); } }
    else if (k === 'jar' && h.sq.n >= goal()) { h.sq.n -= goal(); h.sq.gifts++; h.sq.thank = giftText(); }
    tune(yes ? [659, 784, 1047] : [392]);
  }

  // ---------------------------------------------------------------- parent report + settings
  function report() {
    if (cfg().on === false) return '';
    const h = H(), ids = Object.keys(h.ch), right = ids.filter(i => h.ch[i] === SC[i].b).length, lg = AR() ? 'a' : 'e';
    const counts = VIRT.map(v => [v, h.g.filter(x => x[0] === v[0]).length]).filter(x => x[1]);
    const diary = Object.keys(st.days).filter(d => st.days[d].refl).sort().slice(-7).reverse();
    return `<h3>💖 ${tx('title')}</h3><div class="edit hrep">
      <b>🌷 ${tx('garden')}: ${h.g.length}</b>${counts.length ? `<div class="xchips">${counts.map(([v, n]) => `<span class="xchip">${v[1]} ${esc(vName(v))} × ${n}</span>`).join('')}</div>` : ''}
      <b>🦸 ${tx('rChoices', ids.length, right)}</b>${ids.slice(-6).reverse().map(i => { const s = SC[i][lg], good = h.ch[i] === SC[i].b;
        return `<small class="hintx">${good ? '✅' : '🤔'} ${esc(s[0])}${good ? '' : ` · ${tx('rChose')}: «${esc(s[1][h.ch[i]])}»`}</small>`; }).join('')}
      <b>🌙 ${tx('rDiary')}</b>${diary.length ? diary.map(d => `<small class="hintx">${dayName(d)}: ${st.days[d].refl.map((k, q) => esc(reflText(q, k))).join(' · ')}</small>`).join('') : `<small class="hintx">${tx('none')}</small>`}
      <b>📿 ${tx('rDuas', Object.values(h.du).filter(v => v === 'y').length)} · 🏅 ${tx('rMedals', h.vb.length)} · 💝 ${tx('rGifts', h.sq.gifts)}</b></div>`;
  }
  const settings = () => `<h3>💖 ${tx('sOn')}</h3><div class="edit"><div class="seg grow">${[[1, t('on')], [0, t('off')]].map(([v, l]) => `<button class="${(cfg().on !== false) === !!v ? 'on' : ''}" data-a="hOn" data-id="${v}">${l}</button>`).join('')}</div>
    <label><span>💝 ${tx('sGoal')}</span><input type="number" inputmode="numeric" min="5" max="500" data-hf="goal" value="${goal()}"></label>
    <label><span>🎁 ${tx('sGift')}</span><input maxlength="40" data-hf="gift" value="${esc(cfg().gift || '')}" placeholder="${esc(tx('giftDef'))}"></label></div>`;
  document.addEventListener('change', e => {
    const k = e.target.dataset.hf;
    if (!k) return;
    const v = e.target.value.trim();
    if (k === 'goal') cfg().goal = Math.min(500, Math.max(5, parseInt(v, 10) || 30));
    else cfg().gift = v.slice(0, 40);
    save(); setTimeout(render);
  });

  // ---------------------------------------------------------------- actions
  const ACT = {
    hOpen: id => { ui.heart = id; ui.hDua = null; ui.hWrong = []; ui.hR = null; if (id === 'choice') todayChoice(); tune([660, 880]); },
    hClose: () => { ui.heart = null; },
    hBack: (id, el, e) => { if (e.target === el) ui.heart = null; else return false; }, // tap outside the card
    hPick: id => {
      const h = H(), cd = todayChoice(), s = SC[cd[1]], i = +id;
      if (cd[2]) return false;
      const first = !(cd[1] in h.ch);
      if (first) h.ch[cd[1]] = i;
      if (i === s.b) { cd[2] = 1; ui.hWrong = []; if (first) gain(st, today(), 1, ['choice']); tune([784, 988, 1175]); party(); }
      else { (ui.hWrong = ui.hWrong || []).push(i); tune([330, 262]); }
    },
    hVal: () => {
      const h = H(), { wk, i } = valNow();
      if (h.v.wk !== wk) h.v = { wk, i, days: [], s: '' };
      if (h.v.days.includes(today())) return false;
      h.v.days.push(today()); bloom(VAL[i].w); tune([659, 784, 1047]); party();
    },
    hSecret: () => { const h = H(); if (h.sec.d !== today()) h.sec = { d: today(), s: 'open', i: secretIdx() }; tune([523, 784, 1047]); },
    hSecretDid: () => { const s = H().sec; if (s.d === today() && s.s === 'open') { s.s = 'p'; party(); } },
    hDua: id => { ui.hDua = +id < 0 ? null : +id; tune([660]); },
    hSayAr: (id, el) => { say(el.dataset.t, 'ar'); return false; },
    hKnow: id => { const h = H(); if (!h.du[id]) { h.du[id] = 'p'; tune([659, 784]); } },
    hTeach: () => { teach(); return false; },
    hRefl: id => {
      const r = ui.hR = (ui.hR || []).concat(+id);
      if (r.length < 3) return tune([523 + 100 * r.length]);
      dayOf(st, today()).refl = r; ui.hR = null;
      gain(st, today(), 1, ['refl']); party();
      say(tx('rNight', st.name));
    },
    hGive: id => {
      const q = H().sq, n = Math.min(+id, goal() - q.n, st.stars);
      if (n <= 0) return false;
      spend(st, today(), n, ['sadaqa']); q.n += n; tune([523, 659, 784]);
      if (q.n >= goal()) party();
    },
    hOn: id => { cfg().on = id === '1'; },
    hGood: id => {
      const v = VIRT.find(x => x[0] === id);
      if (!v) return false;
      bloom(id); gain(st, today(), 1, ['kind', vName(v)]); H().pop.push({ w: id, from: parentName() }); tune([784, 1047]);
    },
    hYes: (id, el) => decide(el.dataset.k, id, el.dataset.v === '1'),
    hListen: id => { listen(+id); return false; },
  };

  function install(actions) {
    Object.assign(actions, ACT);
    // the back button closes an open sheet first (app.js sets window.onBack after the add-ons are installed)
    document.addEventListener('DOMContentLoaded', () => {
      const back = window.onBack;
      window.onBack = () => {
        if (!db || !ui.heart || ui.parent) return back();
        if (ui.heart === 'duas' && ui.hDua != null) ui.hDua = null; else ui.heart = null;
        render(); return true;
      };
    });
  }

  // after every render: the open sheet goes on top of Home; then "caught being good" and charity thank-yous pop up once
  let last = '';
  function after(root) {
    if (!db || ui.parent || ui.pin !== null || ui.tab !== 'home') { ui.heart = null; last = ''; return; }
    if (ui.heart && SHEETS[ui.heart]) {
      const key = ui.heart + ui.hDua + (ui.hR || []).length;
      root.insertAdjacentHTML('beforeend', sheet());
      const el = root.querySelector('.hsheet'), c = el.firstElementChild;
      if (last.startsWith(ui.heart)) el.classList.add('still'); // same sheet: no pop-in animation again
      if (key === last) c.scrollTop = ui.hTop || 0; else ui.hTop = 0;
      last = key;
      c.onscroll = () => { ui.hTop = c.scrollTop; };
      return;
    }
    last = '';
    if (cfg().on === false || root.querySelector('.overlay') || document.querySelector('.dlg')) return;
    const h = H(), p = h.pop.shift();
    if (p) {
      const v = VIRT.find(x => x[0] === p.w) || VIRT[1];
      save(); party();
      dialog({ icon: 'sparkle', text: tx('popGood', p.from || tx('yourParent'), v[AR() ? 5 : 3]), cancel: null });
    } else if (h.sq.thank) {
      const g = h.sq.thank;
      h.sq.thank = ''; save(); party();
      dialog({ icon: 'sparkle', text: tx('qThanks', g), cancel: null });
    }
  }

  return { install, card, approveRows, pendingCount, report, settings, after, tx, SC, VAL, DUAS };
})();
window.Heart = Heart;
