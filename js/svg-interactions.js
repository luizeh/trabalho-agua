/* ============================================================
   SVG INTERACTIONS — comportamentos genéricos reutilizáveis
   Regra: o JS mexe em CLASSES e custom properties.
   As animações ficam no CSS (interactions.css).
   ============================================================ */

window.AGUA_SVG = (function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var noHover = window.matchMedia('(hover: none)');

  function init() {
    initLocalParallax();
    initRipple();
    initTouchStates();
    initTypedReveal();
    initDrawSvg();
  }

  /* ------------------------------------------------------------
     1) Parallax local: camadas do SVG seguem o mouse até ~5px
     ------------------------------------------------------------ */
  function initLocalParallax() {
    if (reduce.matches) return;

    document.querySelectorAll('.house-stage, .eco-art').forEach(function (stage) {
      var layers = Array.prototype.slice.call(stage.querySelectorAll('.art-layer'));
      if (!layers.length) return;

      var frame = null;

      stage.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        if (frame) return;
        frame = window.requestAnimationFrame(function () {
          var r = stage.getBoundingClientRect();
          // -1 … 1 a partir do centro
          var nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
          var ny = ((e.clientY - r.top) / r.height - 0.5) * 2;

          layers.forEach(function (layer) {
            var depth = parseFloat(layer.getAttribute('data-depth')) || 1;
            // teto de 5px, como pede o plano
            var amp = Math.min(depth, 5);
            layer.style.setProperty('--lx', (nx * amp).toFixed(2) + 'px');
            layer.style.setProperty('--ly', (ny * amp * 0.6).toFixed(2) + 'px');
          });
          frame = null;
        });
      });

      stage.addEventListener('pointerleave', function () {
        layers.forEach(function (layer) {
          layer.style.removeProperty('--lx');
          layer.style.removeProperty('--ly');
        });
      });
    });
  }

  /* ------------------------------------------------------------
     2) Ripple — apenas em CTAs e controles marcados
     ------------------------------------------------------------ */
  function initRipple() {
    if (reduce.matches) return;

    document.addEventListener('pointerdown', function (e) {
      var host = e.target.closest('.ripple-host');
      if (!host) return;

      var rect = host.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 2;

      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';

      host.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 650);
    });
  }

  /* ------------------------------------------------------------
     3) Equivalente de hover para toque
     Em telas sem mouse, tocar num card ativa o mesmo estado visual.
     ------------------------------------------------------------ */
  function initTouchStates() {
    if (!noHover.matches) return;

    var alvos = '.card, .action, .waste-visual';

    document.addEventListener('pointerdown', function (e) {
      var el = e.target.closest(alvos);

      document.querySelectorAll('.is-touched').forEach(function (prev) {
        if (prev !== el) prev.classList.remove('is-touched');
      });

      if (el) el.classList.add('is-touched');
    }, { passive: true });
  }

  /* ------------------------------------------------------------
     4) Entradas específicas por tipo de objeto
     Cada elemento entra do jeito que combina com o que representa.
     ------------------------------------------------------------ */
  function initTypedReveal() {
    var alvos = document.querySelectorAll(
      '.reveal-drop, .reveal-grow, .reveal-slide, .reveal-scale'
    );
    if (!alvos.length) return;

    if (!('IntersectionObserver' in window) || reduce.matches) {
      alvos.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------
     5) Draw SVG — traçado desenhado ao entrar na tela
     Mede o comprimento real de cada path para o dash ficar exato.
     ------------------------------------------------------------ */
  function initDrawSvg() {
    var alvos = document.querySelectorAll('.draw-svg');
    if (!alvos.length) return;

    alvos.forEach(function (svg) {
      svg.querySelectorAll('path').forEach(function (path) {
        if (typeof path.getTotalLength !== 'function') return;
        var len = Math.ceil(path.getTotalLength());
        if (len) path.style.setProperty('--draw-len', len);
      });
    });

    if (!('IntersectionObserver' in window) || reduce.matches) {
      alvos.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  return { init: init };
})();
