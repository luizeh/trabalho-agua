/* ============================================================
   WATER CARDS — expansão dos cards de tipos de água
   O fluxo da Água Cinza acompanha a aba selecionada,
   para nunca mostrar um conceito junto da definição errada.
   ============================================================ */

window.AGUA_CARDS = (function () {
  'use strict';

  function init() {
    initToggles();
    initGreyFlowSync();
  }

  /* ------------------------------------------------------------
     Botão "ver o percurso" — disclosure acessível
     ------------------------------------------------------------ */
  function initToggles() {
    document.querySelectorAll('.type-toggle').forEach(function (btn) {
      var painel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!painel) return;

      var rotulo = btn.querySelector('span');
      var textoFechado = rotulo ? rotulo.textContent : '';

      btn.addEventListener('click', function () {
        var aberto = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!aberto));
        painel.hidden = aberto;
        if (rotulo) rotulo.textContent = aberto ? textoFechado : 'Recolher';
      });
    });
  }

  /* ------------------------------------------------------------
     Água Cinza: o fluxo exibido segue a aba ativa
     ------------------------------------------------------------ */
  function initGreyFlowSync() {
    var flow = document.getElementById('flow-cinza');
    if (!flow) return;

    var variantes = Array.prototype.slice.call(flow.querySelectorAll('[data-for]'));
    var abas = document.querySelectorAll('#tab-pegada, #tab-residual');
    if (!variantes.length || !abas.length) return;

    function sync() {
      var ativa = document.querySelector('.tab-btn[aria-selected="true"]');
      // id "tab-pegada" → chave "pegada"
      var chave = ativa ? ativa.id.replace('tab-', '') : 'pegada';
      variantes.forEach(function (v) {
        v.hidden = v.getAttribute('data-for') !== chave;
      });
    }

    abas.forEach(function (aba) {
      aba.addEventListener('click', sync);
      aba.addEventListener('keyup', sync);
    });

    sync();
  }

  return { init: init };
})();
