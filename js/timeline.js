/* ============================================================
   TIMELINE — o caminho de uma gota
   · a gota percorre a linha conforme o scroll
   · cada etapa é clicável e revela um detalhe (disclosure)
   ============================================================ */

window.AGUA_TIMELINE = (function () {
  'use strict';

  function init() {
    var timeline = document.getElementById('timeline');
    if (!timeline) return;

    var steps = Array.prototype.slice.call(timeline.querySelectorAll('.tl-step'));
    initScroll(timeline, steps);
    initSelection(timeline, steps);
  }

  /* ------------------------------------------------------------
     Progresso pelo scroll: linha, gota e etapas acendendo
     ------------------------------------------------------------ */
  function initScroll(timeline, steps) {
    var fill = document.getElementById('timelineFill');
    var drop = document.getElementById('timelineDrop');
    if (!fill || !drop) return;

    var ticking = false;

    function update() {
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight;

      var start = vh * 0.85;
      var end = vh * 0.28;
      var raw = (start - rect.top) / (start - end + rect.height * 0.4);
      var progress = Math.min(Math.max(raw, 0), 1);

      fill.style.width = (progress * 100).toFixed(2) + '%';
      drop.style.left = (progress * 100).toFixed(2) + '%';

      var reached = Math.round(progress * steps.length);
      steps.forEach(function (step, i) {
        step.classList.toggle('is-reached', i < reached);
      });

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------
     Seleção por clique: a etapa cresce, as outras recuam
     ------------------------------------------------------------ */
  function initSelection(timeline, steps) {
    var lista = document.getElementById('timelineSteps');
    if (!lista) return;

    var botoes = steps.map(function (step) { return step.querySelector('.tl-btn'); });

    function close(step) {
      var btn = step.querySelector('.tl-btn');
      var more = document.getElementById(btn.getAttribute('aria-controls'));
      step.classList.remove('is-selected');
      btn.setAttribute('aria-expanded', 'false');
      if (more) more.hidden = true;
    }

    function toggle(step) {
      var btn = step.querySelector('.tl-btn');
      var more = document.getElementById(btn.getAttribute('aria-controls'));
      var aberto = btn.getAttribute('aria-expanded') === 'true';

      steps.forEach(close);

      if (!aberto) {
        step.classList.add('is-selected');
        btn.setAttribute('aria-expanded', 'true');
        if (more) more.hidden = false;
      }

      lista.classList.toggle('has-selection', !aberto);
    }

    botoes.forEach(function (btn, i) {
      if (!btn) return;

      btn.addEventListener('click', function () { toggle(steps[i]); });

      // setas navegam entre as etapas
      btn.addEventListener('keydown', function (e) {
        var proximo = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') proximo = botoes[(i + 1) % botoes.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') proximo = botoes[(i - 1 + botoes.length) % botoes.length];
        if (!proximo) return;
        e.preventDefault();
        proximo.focus();
      });
    });

    // clicar fora limpa a seleção
    document.addEventListener('click', function (e) {
      if (e.target.closest('.timeline')) return;
      if (!lista.classList.contains('has-selection')) return;
      steps.forEach(close);
      lista.classList.remove('has-selection');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !lista.classList.contains('has-selection')) return;
      steps.forEach(close);
      lista.classList.remove('has-selection');
    });
  }

  return { init: init };
})();
