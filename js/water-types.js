/* ============================================================
   WATER TYPES — seção "Tipos de Água"
   Três blocos grandes: imagem, informações e o caminho da água.

   As ilustrações são imagens em assets/images/water-types/.
   Enquanto o arquivo não existir, o bloco mostra o placeholder:
   a classe .has-img só entra quando a imagem carrega de verdade,
   então nunca aparece ícone quebrado na página.

   Regra do projeto: o JS só mexe em CLASSES e custom properties.
   ============================================================ */

window.AGUA_TIPOS = (function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var PASSO = 340;   // intervalo entre as etapas no "ver o percurso"

  function init() {
    var blocos = document.querySelectorAll('.wt-block');
    if (!blocos.length) return;

    revelarImagens();
    ligarEntrada(blocos);
    ligarEtapas();
    ligarPercurso();
  }

  /* ------------------------------------------------------------
     1) Imagens: aparecem só depois de carregar
     ------------------------------------------------------------ */
  function revelarImagens() {
    document.querySelectorAll('[data-wt-img]').forEach(function (img) {
      var moldura = img.closest('.wt-media');
      if (!moldura) return;

      function pronta() { moldura.classList.add('has-img'); }

      // cache: a imagem pode já estar carregada antes deste script rodar
      if (img.complete && img.naturalWidth > 0) pronta();
      else img.addEventListener('load', pronta, { once: true });
      // se falhar, não fazemos nada: o placeholder continua no lugar
    });
  }

  /* ------------------------------------------------------------
     2) Entrada: cada bloco anima quando entra na tela
     ------------------------------------------------------------ */
  function ligarEntrada(blocos) {
    if (!('IntersectionObserver' in window) || reduce.matches) {
      blocos.forEach(function (b) { b.classList.add('is-in'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);          // anima só uma vez
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    blocos.forEach(function (b) { obs.observe(b); });
  }

  /* ------------------------------------------------------------
     3) Etapas do caminho: clicar mostra a descrição
     O hover é só CSS; aqui fica o estado escolhido, que também
     serve para o toque.
     ------------------------------------------------------------ */
  function ligarEtapas() {
    document.querySelectorAll('[data-wt-steps]').forEach(function (lista) {
      var etapas = Array.prototype.slice.call(lista.querySelectorAll('.wt-step'));
      var saida = destino(lista);
      if (!etapas.length || !saida) return;

      var padrao = saida.textContent;

      etapas.forEach(function (etapa) {
        etapa.addEventListener('click', function () {
          var jaAtiva = etapa.classList.contains('is-on');

          etapas.forEach(function (outra) {
            outra.classList.remove('is-on');
            outra.setAttribute('aria-pressed', 'false');
          });

          if (jaAtiva) {                       // clicar de novo desmarca
            saida.textContent = padrao;
            return;
          }

          etapa.classList.add('is-on');
          etapa.setAttribute('aria-pressed', 'true');
          saida.textContent = etapa.getAttribute('data-detail') || padrao;
        });
      });
    });
  }

  /* ------------------------------------------------------------
     4) "Ver o percurso": as etapas acendem uma por vez
     ------------------------------------------------------------ */
  function ligarPercurso() {
    document.querySelectorAll('[data-wt-play]').forEach(function (botao) {
      var fluxo = botao.closest('.wt-flow');
      if (!fluxo) return;

      var etapas = Array.prototype.slice.call(fluxo.querySelectorAll('.wt-step'));
      var saida = destino(fluxo);
      if (!etapas.length) return;

      var rotulo = botao.querySelector('span');
      var textoInicial = rotulo ? rotulo.textContent : '';
      var timers = [];
      var rodando = false;

      function limpar() {
        timers.forEach(window.clearTimeout);
        timers = [];
        etapas.forEach(function (e) {
          e.classList.remove('is-lit', 'is-on');
          e.setAttribute('aria-pressed', 'false');
        });
      }

      function terminar() {
        rodando = false;
        botao.setAttribute('aria-pressed', 'false');
        if (rotulo) rotulo.textContent = textoInicial;
      }

      botao.addEventListener('click', function () {
        if (rodando) {                         // clicar durante o percurso para
          limpar();
          terminar();
          return;
        }

        limpar();
        rodando = true;
        botao.setAttribute('aria-pressed', 'true');
        if (rotulo) rotulo.textContent = 'Recomeçar';

        var espera = reduce.matches ? 0 : PASSO;

        etapas.forEach(function (etapa, i) {
          timers.push(window.setTimeout(function () {
            etapa.classList.add('is-lit');
            if (saida) saida.textContent = etapa.getAttribute('data-detail') || '';
          }, i * espera));
        });

        // ao fim do percurso o botão volta ao estado inicial
        timers.push(window.setTimeout(terminar, etapas.length * espera + 500));
      });
    });
  }

  /* Onde escrever a descrição da etapa.
     Na água cinza o fluxo tem duas versões ([data-for="pegada"] e
     [data-for="residual"]) dentro do mesmo .wt-flow — por isso a busca
     começa pelo [data-for], senão as duas escreveriam no mesmo lugar. */
  function destino(el) {
    var caixa = el.closest('[data-for]') || el.closest('.wt-flow');
    return caixa ? caixa.querySelector('[data-wt-detail]') : null;
  }

  return { init: init };
})();
