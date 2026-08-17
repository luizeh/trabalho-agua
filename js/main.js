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
    'AGUA_TIPOS',
    'AGUA_CICLO',
    'AGUA_CARDS',
    'AGUA_LAB',
    'AGUA_WASTE',
    'AGUA_IMPACTOS',
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

    document.body.classList.add('is-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
