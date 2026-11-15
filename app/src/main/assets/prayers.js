// Prayer-time reminders, calculated on the phone (adhan library, lib/adhan.js) for the city the parent picks.
// The next 7 days of adhan times are handed to Android (Prayers.java), which shows a notification at each one.
// ponytail: only 7 days are scheduled ahead; opening the app tops them up, so a phone left unopened for a week goes quiet.
const Prayers = (() => {
  const A = typeof adhan !== 'undefined' ? adhan : require('./lib/adhan.js');
  // [key, English, Arabic, lat, lng, method]  method = adhan.CalculationMethod name used in that country
  const CITIES = [
    ['cairo', 'Cairo', 'القاهرة', 30.0444, 31.2357, 'Egyptian'], ['giza', 'Giza', 'الجيزة', 30.0131, 31.2089, 'Egyptian'],
    ['alexandria', 'Alexandria', 'الإسكندرية', 31.2001, 29.9187, 'Egyptian'], ['mansoura', 'Mansoura', 'المنصورة', 31.0409, 31.3785, 'Egyptian'],
    ['tanta', 'Tanta', 'طنطا', 30.7865, 31.0004, 'Egyptian'], ['zagazig', 'Zagazig', 'الزقازيق', 30.5877, 31.502, 'Egyptian'],
    ['portsaid', 'Port Said', 'بورسعيد', 31.2653, 32.3019, 'Egyptian'], ['ismailia', 'Ismailia', 'الإسماعيلية', 30.5965, 32.2715, 'Egyptian'],
    ['suez', 'Suez', 'السويس', 29.9668, 32.5498, 'Egyptian'], ['faiyum', 'Faiyum', 'الفيوم', 29.3084, 30.8428, 'Egyptian'],
    ['benisuef', 'Beni Suef', 'بني سويف', 29.0661, 31.0994, 'Egyptian'], ['minya', 'Minya', 'المنيا', 28.0871, 30.7618, 'Egyptian'],
    ['asyut', 'Asyut', 'أسيوط', 27.1783, 31.1859, 'Egyptian'], ['sohag', 'Sohag', 'سوهاج', 26.5591, 31.6957, 'Egyptian'],
    ['qena', 'Qena', 'قنا', 26.1551, 32.716, 'Egyptian'], ['luxor', 'Luxor', 'الأقصر', 25.6872, 32.6396, 'Egyptian'],
    ['aswan', 'Aswan', 'أسوان', 24.0889, 32.8998, 'Egyptian'], ['hurghada', 'Hurghada', 'الغردقة', 27.2579, 33.8116, 'Egyptian'],
    ['sharm', 'Sharm El-Sheikh', 'شرم الشيخ', 27.9158, 34.33, 'Egyptian'],
    ['makkah', 'Makkah', 'مكة المكرمة', 21.3891, 39.8579, 'UmmAlQura'], ['madinah', 'Madinah', 'المدينة المنورة', 24.5247, 39.5692, 'UmmAlQura'],
    ['riyadh', 'Riyadh', 'الرياض', 24.7136, 46.6753, 'UmmAlQura'], ['jeddah', 'Jeddah', 'جدة', 21.4858, 39.1925, 'UmmAlQura'],
    ['dammam', 'Dammam', 'الدمام', 26.4207, 50.0888, 'UmmAlQura'], ['dubai', 'Dubai', 'دبي', 25.2048, 55.2708, 'Dubai'],
    ['abudhabi', 'Abu Dhabi', 'أبوظبي', 24.4539, 54.3773, 'Dubai'], ['kuwait', 'Kuwait City', 'الكويت', 29.3759, 47.9774, 'Kuwait'],
    ['doha', 'Doha', 'الدوحة', 25.2854, 51.531, 'Qatar'], ['manama', 'Manama', 'المنامة', 26.2285, 50.586, 'MuslimWorldLeague'],
    ['muscat', 'Muscat', 'مسقط', 23.588, 58.3829, 'MuslimWorldLeague'], ['amman', 'Amman', 'عمّان', 31.9454, 35.9284, 'MuslimWorldLeague'],
    ['jerusalem', 'Al-Quds', 'القدس', 31.7683, 35.2137, 'MuslimWorldLeague'], ['gaza', 'Gaza', 'غزة', 31.5017, 34.4668, 'MuslimWorldLeague'],
    ['beirut', 'Beirut', 'بيروت', 33.8938, 35.5018, 'MuslimWorldLeague'], ['damascus', 'Damascus', 'دمشق', 33.5138, 36.2765, 'MuslimWorldLeague'],
    ['baghdad', 'Baghdad', 'بغداد', 33.3152, 44.3661, 'MuslimWorldLeague'], ['khartoum', 'Khartoum', 'الخرطوم', 15.5007, 32.5599, 'Egyptian'],
    ['tripoli', 'Tripoli', 'طرابلس', 32.8872, 13.1913, 'MuslimWorldLeague'], ['tunis', 'Tunis', 'تونس', 36.8065, 10.1815, 'MuslimWorldLeague'],
    ['algiers', 'Algiers', 'الجزائر', 36.7538, 3.0588, 'MuslimWorldLeague'], ['casablanca', 'Casablanca', 'الدار البيضاء', 33.5731, -7.5898, 'MuslimWorldLeague'],
    ['istanbul', 'Istanbul', 'إسطنبول', 41.0082, 28.9784, 'Turkey'], ['karachi', 'Karachi', 'كراتشي', 24.8607, 67.0011, 'Karachi'],
    ['lahore', 'Lahore', 'لاهور', 31.5204, 74.3587, 'Karachi'], ['kualalumpur', 'Kuala Lumpur', 'كوالالمبور', 3.139, 101.6869, 'Singapore'],
    ['jakarta', 'Jakarta', 'جاكرتا', -6.2088, 106.8456, 'Singapore'], ['london', 'London', 'لندن', 51.5074, -0.1278, 'MoonsightingCommittee'],
    ['paris', 'Paris', 'باريس', 48.8566, 2.3522, 'MuslimWorldLeague'], ['berlin', 'Berlin', 'برلين', 52.52, 13.405, 'MuslimWorldLeague'],
    ['newyork', 'New York', 'نيويورك', 40.7128, -74.006, 'NorthAmerica'], ['toronto', 'Toronto', 'تورونتو', 43.6532, -79.3832, 'NorthAmerica'],
  ];
  const KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const city = key => CITIES.find(c => c[0] === key) || CITIES[0];

  // The five adhan times (Date objects) for a city on a given day.
  function times(key, day) {
    const c = city(key), p = new A.PrayerTimes(new A.Coordinates(c[3], c[4]), day, A.CalculationMethod[c[5]]());
    return KEYS.map(k => p[k]);
  }
  // Every adhan from `from` for `days` days: [{t (ms), k (0-4)}], only future ones.
  function upcoming(key, from, days) {
    const out = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
      times(key, d).forEach((t, k) => { if (t.getTime() > from.getTime()) out.push({ t: t.getTime(), k }); });
    }
    return out;
  }
  // Hand the next week to Android. names: the five prayer names; title/text: '{0}' = prayer name.
  function sync(cfg, names, title, text) {
    if (typeof window === 'undefined' || !window.Android || !Android.prayers) return;
    const list = cfg && cfg.on ? upcoming(cfg.city, new Date(), 7).map(x => ({ t: x.t, title: title.replace('{0}', names[x.k]), text: text.replace('{0}', names[x.k]) })) : [];
    try { Android.prayers(JSON.stringify(list)); } catch (e) { /* old app without prayer alarms */ }
  }
  return { CITIES, KEYS, times, upcoming, sync };
})();
if (typeof window !== 'undefined') window.Prayers = Prayers; // a top-level const is not on window by itself
if (typeof module !== 'undefined') module.exports = Prayers;

if (typeof module !== 'undefined' && require.main === module) {
  const assert = require('assert');
  const hm = (d, tz) => d.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
  // Cairo, 15 Nov 2026 (Egyptian General Authority): published times 04:50 11:41 14:38 16:59 18:19
  assert.deepEqual(Prayers.times('cairo', new Date(2026, 10, 15)).map(d => hm(d, 'Africa/Cairo')), ['04:50', '11:41', '14:38', '16:59', '18:19']);
  // Makkah uses Umm al-Qura: Isha is 90 minutes after Maghrib
  const mk = Prayers.times('makkah', new Date(2026, 10, 15));
  assert.equal(Math.round((mk[4] - mk[3]) / 60000), 90);
  // a week from now: 35 adhans, or fewer today's already-passed ones, all in the future and in order
  const from = new Date(2026, 10, 15, 12, 0), up = Prayers.upcoming('cairo', from, 7);
  assert.ok(up.length >= 31 && up.length <= 35, up.length);
  assert.ok(up.every((x, i) => x.t > from.getTime() && (!i || x.t > up[i - 1].t)));
  // every city computes without errors and gives five ordered times
  for (const c of Prayers.CITIES) { const t = Prayers.times(c[0], new Date(2026, 5, 21)); assert.ok(t.every((x, i) => !i || x > t[i - 1]), c[0]); }
  console.log('prayers ok');
}
