/* ============================================================
   WATER LINK — seção "A água está em tudo"
   A gota é a fonte comum: as três linhas nascem nela e vão até
   Vida, Indústria e Cotidiano.

   Regra do projeto: o JS só mexe em CLASSES e custom properties.
   As animações ficam em animations.css / interactions.css.
   ============================================================ */

window.AGUA_LINK = (function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function init() {
    var palco = document.querySelector('.eco-stage');
    if (!palco) return;

    medirLigacoes(palco);
    ligarEntrada(palco);
    ligarDestaques(palco);
  }

  /* ------------------------------------------------------------
     1) Comprimento real de cada traçado
     Com o valor exato o desenho de entrada termina junto com a
     transição, e a luz que percorre a linha sai na ponta certa.
     ------------------------------------------------------------ */
  function medirLigacoes(palco) {
    palco.querySelectorAll('.eco-line').forEach(function (linha) {
      var traco = linha.querySelector('.eco-trace');
      if (!traco || typeof traco.getTotalLength !== 'function') return;

      var comprimento = Math.ceil(traco.getTotalLength());
      if (!comprimento) return;

      linha.style.setProperty('--len', comprimento);
      // a luz tem 16 unidades: precisa sair completamente da ponta
      linha.style.setProperty('--flow-end', -(comprimento + 16));
    });
  }

  /* ------------------------------------------------------------
     2) Entrada encadeada e economia fora da tela
     .is-live      → dispara a sequência (título, gota, linhas, cards)
     .is-onscreen  → só com a seção visível as animações contínuas rodam
     ------------------------------------------------------------ */
  function ligarEntrada(palco) {
    if (!('IntersectionObserver' in window) || reduce.matches) {
      palco.classList.add('is-live');
      return;
    }

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) palco.classList.add('is-live');
        palco.classList.toggle('is-onscreen', entry.isIntersecting);
      });
    }, { threshold: 0.08 }).observe(palco);
  }

  /* ------------------------------------------------------------
     3) Destaque das ligações
     Card em foco → acende só a linha dele; a gota acende as três.
     ------------------------------------------------------------ */
  function ligarDestaques(palco) {
    var linhas = Array.prototype.slice.call(palco.querySelectorAll('.eco-line'));
    var alvos = Array.prototype.slice.call(palco.querySelectorAll('[data-lights]'));
    if (!alvos.length) return;

    function acender(chave) {
      palco.setAttribute('data-lit', chave);
      linhas.forEach(function (linha) {
        var propria = linha.getAttribute('data-link') === chave;
        linha.classList.toggle('is-lit', chave === 'all' || propria);
      });
    }

    function apagar() {
      palco.removeAttribute('data-lit');
      linhas.forEach(function (linha) { linha.classList.remove('is-lit'); });
    }

    alvos.forEach(function (alvo) {
      var chave = alvo.getAttribute('data-lights');

      alvo.addEventListener('pointerenter', function () { acender(chave); });
      alvo.addEventListener('pointerleave', apagar);
      alvo.addEventListener('focusin', function () { acender(chave); });

      // sair para o botão "ver mais" de dentro do card não apaga a ligação
      alvo.addEventListener('focusout', function (e) {
        if (!alvo.contains(e.relatedTarget)) apagar();
      });
    });

    // no toque, tocar fora do palco apaga
    document.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('[data-lights]')) apagar();
    }, { passive: true });
  }

  return { init: init };
})();
