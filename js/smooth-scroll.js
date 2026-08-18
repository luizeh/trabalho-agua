/* ============================================================
   ROLAGEM SUAVE — o giro da roda vira um alvo, e a página
   persegue esse alvo com amortecimento
   · só entra no mouse: touch e trackpad já têm inércia própria,
     e amortecer de novo dá sensação de atraso
   · usa window.scrollTo, ou seja, mexe na posição real de
     rolagem — sticky, âncoras e IntersectionObserver continuam
     funcionando como antes
   · prefers-reduced-motion desliga tudo
   ============================================================ */

window.AGUA_SUAVE = (function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* fração do caminho que falta percorrida a cada quadro: quanto maior,
     mais seco; quanto menor, mais arrastado */
  var AMORTECIMENTO = 0.16;

  /* abaixo disso o evento quase certamente veio de trackpad ou de um mouse
     de rolagem contínua, que já entregam movimento suave por conta própria */
  var DELTA_MINIMO = 40;

  var alvo = 0;
  var animando = 0;
  var limite = 0;

  function init() {
    if (reduce.matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    medirLimite();
    alvo = window.scrollY;

    window.addEventListener('wheel', aoRodar, { passive: false });

    // qualquer outra forma de rolar reassume o controle
    window.addEventListener('pointerdown', soltar, { passive: true });
    window.addEventListener('keydown', soltar);
    window.addEventListener('resize', function () { medirLimite(); soltar(); });

    // seções abrem e fecham conteúdo: a altura muda sem passar por resize
    if ('ResizeObserver' in window) {
      new ResizeObserver(medirLimite).observe(document.body);
    }

    reduce.addEventListener('change', function () {
      if (reduce.matches) {
        window.removeEventListener('wheel', aoRodar, { passive: false });
        soltar();
      }
    });
  }

  /* a altura da página fica em cache: lê-la dentro do wheel obrigaria o
     navegador a recalcular o layout no meio da rolagem */
  function medirLimite() {
    limite = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function aoRodar(ev) {
    if (ev.ctrlKey) return;                 // zoom do navegador
    if (ev.deltaMode !== 0) return;         // rolagem por linha ou por página: deixa nativa

    // áreas que rolam por conta própria (menu aberto, painel com overflow)
    if (ev.target && ev.target.closest && ev.target.closest('[data-rolagem-propria]')) return;

    // Enquanto já estamos deslizando, todo resíduo do mesmo giro entra no alvo,
    // inclusive os eventos pequenos que fecham o movimento — descartá-los
    // deixava a página parando alguns pixels antes do destino.
    // Parado, um delta pequeno é sinal de trackpad, que já tem inércia própria.
    if (!animando && Math.abs(ev.deltaY) < DELTA_MINIMO) return;

    ev.preventDefault();

    if (!animando) alvo = window.scrollY;
    alvo = Math.max(0, Math.min(limite, alvo + ev.deltaY));

    if (!animando) animando = window.requestAnimationFrame(quadro);
  }

  function quadro() {
    var y = window.scrollY;
    var falta = alvo - y;

    if (Math.abs(falta) < 1) {
      window.scrollTo(0, alvo);
      animando = 0;
      return;
    }

    // O navegador guarda a posição de rolagem em pixels inteiros. Um passo
    // menor que 1px não move nada, scrollY volta igual, e o laço ficaria
    // preso alguns pixels antes do destino — rodando para sempre. Perto do
    // fim, portanto, o passo mínimo é de um pixel.
    var passo = falta * AMORTECIMENTO;
    if (Math.abs(passo) < 1) passo = falta > 0 ? 1 : -1;

    window.scrollTo(0, y + passo);
    animando = window.requestAnimationFrame(quadro);
  }

  function soltar() {
    if (animando) window.cancelAnimationFrame(animando);
    animando = 0;
    alvo = window.scrollY;
  }

  return { init: init };
})();
