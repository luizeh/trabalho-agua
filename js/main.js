/* ============================================================
   MAIN — inicializa todos os módulos do site
   ============================================================ */

(function () {
  'use strict';

  var modulos = [
    'AGUA_NAV',
    'AGUA_ANIM',
    'AGUA_SVG',
    'AGUA_LINK',
    'AGUA_TIMELINE',
    'AGUA_CARDS',
    'AGUA_FAUCET',
    'AGUA_HOUSE',
    'AGUA_SIM',
    'AGUA_AVAIL',
    'AGUA_MODE'
  ];

  function start() {
    modulos.forEach(function (nome) {
      var mod = window[nome];
      if (!mod || typeof mod.init !== 'function') return;
      try {
        mod.init();
      } catch (erro) {
        // um módulo com problema não pode derrubar o restante da página
        console.error('[água] falha ao iniciar ' + nome, erro);
      }
    });

    preencherDadosPesquisados();
    document.body.classList.add('is-ready');
  }

  /* ------------------------------------------------------------
     Preenche os cards de desperdício com os dados de config.js.
     Enquanto não houver dado, o card mantém o aviso "a inserir".
     ------------------------------------------------------------ */
  function preencherDadosPesquisados() {
    var dados = (window.AGUA && window.AGUA.desperdicio) || [];
    var slots = document.querySelectorAll('#desperdicio [data-source-slot]');

    slots.forEach(function (slot, i) {
      var item = dados[i];
      if (!item || !item.texto) return;

      slot.classList.add('is-filled');
      slot.innerHTML = '';

      var valor = document.createElement('span');
      valor.setAttribute('data-value', '');
      valor.textContent = item.texto;
      slot.appendChild(valor);

      if (item.fonte) {
        var fonte = document.createElement('em');
        fonte.textContent = ' — ' + item.fonte;
        slot.appendChild(fonte);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
