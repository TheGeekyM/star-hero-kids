// "Complete" celebration: a happy buzz plus a "Yeeeeh!" cheer. app.js calls celebrate() when a mission is completed.
(() => {
  const yay = new Audio('yay.mp3'); // loaded once, ready for the first tap
  yay.preload = 'auto';
  window.celebrate = () => {
    try {
      if (window.Android && Android.vibrate) Android.vibrate('70,50,70,50,180');
      else if (navigator.vibrate) navigator.vibrate([70, 50, 70, 50, 180]);
    } catch (e) { /* no buzz is fine */ }
    try {
      yay.currentTime = 0;
      const p = yay.play();
      if (p) p.catch(() => {}); // muted or blocked: stay quiet
    } catch (e) { /* no sound is fine */ }
  };
})();
