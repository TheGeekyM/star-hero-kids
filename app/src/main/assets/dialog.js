// In-app modal that replaces the phone's plain confirm()/prompt()/alert() boxes, styled like the rest of the app.
// dialog({ text, title, icon, ok, cancel, danger, input }) -> Promise:
//   confirm: true/false · alert (cancel: null): true · input: the typed text, or null when cancelled.
// It sits outside #app (and above Focus Guard), so app.js re-renders never close it. The back button closes it.
(() => {
  const L = () => (document.documentElement.lang === 'ar'
    ? { ok: 'حسناً', cancel: 'إلغاء' } : { ok: 'OK', cancel: 'Cancel' });
  const esc = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  let open = null; // { el, done, back }

  function close(value) {
    if (!open) return;
    const { el, done, back } = open;
    open = null;
    window.onBack = back;
    el.classList.add('out');
    setTimeout(() => el.remove(), 180);
    done(value);
  }

  window.dialog = (o = {}) => new Promise(done => {
    if (open) close(o.input ? null : false); // one at a time
    const l = L(), cancel = o.cancel === undefined ? l.cancel : o.cancel;
    const el = document.createElement('div');
    el.className = 'dlg';
    el.innerHTML = `<div class="dlg-card ${o.danger ? 'danger' : ''}" role="dialog" aria-modal="true">
      ${o.icon && typeof ic === 'function' ? `<div class="dlg-ic">${ic(o.icon)}</div>` : ''}
      ${o.title ? `<h2>${esc(o.title)}</h2>` : ''}
      ${o.text ? `<p>${esc(o.text)}</p>` : ''}
      ${o.input ? `<input class="dlg-in" ${o.input.pin ? 'type="password" inputmode="numeric" maxlength="4" dir="ltr" autocomplete="off"' : `maxlength="${o.input.max || 40}"`}>` : ''}
      <div class="dlg-btns">${cancel ? `<button class="dlg-b no" data-v="0">${esc(cancel)}</button>` : ''}
        <button class="dlg-b yes" data-v="1">${esc(o.ok || l.ok)}</button></div></div>`;
    document.body.appendChild(el);
    open = { el, done, back: window.onBack };
    window.onBack = () => { close(o.input ? null : false); return true; };
    const input = el.querySelector('.dlg-in');
    const answer = yes => close(o.input ? (yes ? input.value : null) : !!yes);
    el.addEventListener('click', e => {
      if (e.target === el && cancel) return answer(false); // tap outside the card
      const b = e.target.closest('[data-v]');
      if (b) answer(b.dataset.v === '1');
    });
    if (input) {
      input.addEventListener('keydown', e => { if (e.key === 'Enter') answer(true); });
      setTimeout(() => input.focus(), 60);
    }
  });
})();
