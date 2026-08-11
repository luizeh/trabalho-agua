/* ============================================================
   AVAILABILITY — esfera de água diminuindo conforme o scroll
   As porcentagens só aparecem se forem preenchidas em
   js/config.js (com a respectiva fonte).
   ============================================================ */

window.AGUA_AVAIL = (function () {
  'use strict';

  /* Escalas visuais das quatro etapas.
     São proporções de APRESENTAÇÃO, não dados científicos:
     servem para transmitir a ideia de redução progressiva.
     Quando os percentuais reais forem preenchidos em config.js,
     eles passam a ser exibidos como texto ao lado da esfera. */
  var ESCALAS = [1, 0.62, 0.3, 0.14];

  function init() {
    var section = document.getElementById('disponibilidade');
    var sphere  = document.getElementById('availSphere');
    var caption = document.getElementById('availCaption');
    var pctSlot = document.getElementById('availPct');
    if (!section || !sphere) return;

    var steps = Array.prototype.slice.call(document.querySelectorAll('#availSteps li'));
    var dados = (window.AGUA && window.AGUA.disponibilidade) || { etapas: [] };
    var ticking = false;
    var atual = -1;

    function update() {
      var rect = section.getBoundingClientRect();
      var total = section.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      var progress = total > 0 ? scrolled / total : 0;

      var index = Math.min(Math.floor(progress * ESCALAS.length), ESCALAS.length - 1);

      // interpolação suave entre a escala atual e a próxima
      var local = (progress * ESCALAS.length) - index;
      var from = ESCALAS[index];
      var to = ESCALAS[Math.min(index + 1, ESCALAS.length - 1)];
      var scale = from + (to - from) * Math.min(local, 1);

      sphere.style.transform = 'scale(' + Math.max(scale, 0.08).toFixed(3) + ')';

      if (index !== atual) {
        atual = index;
        steps.forEach(function (li, i) { li.classList.toggle('is-active', i === index); });

        var etapa = dados.etapas[index] || {};
        var rotulo = etapa.rotulo || (steps[index] && steps[index].querySelector('h3').textContent);
        caption.textContent = rotulo;

        renderPercent(etapa);
      }

      ticking = false;
    }

    function renderPercent(etapa) {
      if (!pctSlot) return;
      if (etapa && etapa.percentual !== null && etapa.percentual !== undefined) {
        pctSlot.textContent = etapa.percentual + '%' + (dados.fonte ? ' — fonte: ' + dados.fonte : '');
      } else {
        pctSlot.textContent = '';
      }
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  }

  return { init: init };
})();
