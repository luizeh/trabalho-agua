/* ============================================================
   WATER MODE — "Como seria sem água?"
   Retira gradualmente a cor, o brilho e o movimento da página.
   ============================================================ */

window.AGUA_MODE = (function () {
  'use strict';

  var overlay, restoreBtn, toggles, lastFocus = null;

  function init() {
    overlay    = document.getElementById('nowaterOverlay');
    restoreBtn = document.getElementById('restoreWater');
    toggles    = Array.prototype.slice.call(document.querySelectorAll('[data-water-toggle]'));
    if (!overlay || !toggles.length) return;

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.body.classList.contains('no-water') ? restore() : drain(btn);
      });
    });

    if (restoreBtn) restoreBtn.addEventListener('click', restore);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) restore();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('no-water')) restore();
    });
  }

  function drain(origin) {
    lastFocus = origin || document.activeElement;
    document.body.classList.add('no-water');
    setLabels('Restaurar água', 'true');

    overlay.hidden = false;
    // força reflow para a transição de opacidade acontecer
    void overlay.offsetWidth;
    overlay.classList.add('is-visible');

    if (restoreBtn) restoreBtn.focus({ preventScroll: true });
  }

  function restore() {
    document.body.classList.remove('no-water');
    setLabels('Como seria sem água?', 'false');

    overlay.classList.remove('is-visible');
    window.setTimeout(function () { overlay.hidden = true; }, 500);

    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  function setLabels(text, pressed) {
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-pressed', pressed);
      var label = btn.querySelector('[data-water-label]');
      if (label) label.textContent = text;
    });
  }

  return { init: init };
})();
