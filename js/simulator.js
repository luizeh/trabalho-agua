/* ============================================================
   SIMULATOR — comparação visual de consumo entre hábitos
   Sem pontuação e sem classificar o usuário.
   Litros só aparecem se as vazões estiverem preenchidas em
   js/config.js, sempre com a fonte.
   ============================================================ */

window.AGUA_SIM = (function () {
  'use strict';

  /* Pesos relativos usados no modo demonstrativo.
     Servem apenas para dar proporção visual entre os hábitos —
     não representam litros e não são apresentados como dado. */
  var PESO_DEMO = { shower: 1, tap: 0.55, hose: 1.4 };

  /* Referência de "caixa cheia" no modo demonstrativo:
     banho de 30 min + torneira 20 min + mangueira 30 min */
  var MAX_DEMO = 30 * PESO_DEMO.shower + 20 * PESO_DEMO.tap + 30 * PESO_DEMO.hose;

  var campos = {
    shower: { input: 'simShower', out: 'simShowerOut' },
    tap:    { input: 'simTap',    out: 'simTapOut' },
    hose:   { input: 'simHose',   out: 'simHoseOut' }
  };

  var refs = {}, water, relative, litersEl, barEls = {}, painel, bolhas;

  function init() {
    water    = document.getElementById('tankWater');
    relative = document.getElementById('simRelative');
    litersEl = document.getElementById('simLiters');
    painel   = document.querySelector('.sim');
    bolhas   = document.getElementById('tankBubbles');
    if (!water) return;

    document.querySelectorAll('[data-bar]').forEach(function (el) {
      barEls[el.getAttribute('data-bar')] = el;
    });

    Object.keys(campos).forEach(function (key) {
      var input = document.getElementById(campos[key].input);
      var out = document.getElementById(campos[key].out);
      if (!input) return;
      refs[key] = { input: input, out: out };
      input.addEventListener('input', update);
    });

    update();
  }

  function update() {
    var valores = {};
    var total = 0;

    Object.keys(refs).forEach(function (key) {
      var input = refs[key].input;
      var min = Number(input.min), max = Number(input.max);
      var value = Number(input.value);

      valores[key] = value;
      if (refs[key].out) refs[key].out.textContent = value + ' min';

      // preenchimento visual do próprio range (WebKit)
      input.style.setProperty('--fill', ((value - min) / (max - min) * 100).toFixed(1) + '%');

      total += value * PESO_DEMO[key];
    });

    // barras comparativas entre os três hábitos
    var maiorPeso = Math.max.apply(null, Object.keys(valores).map(function (k) {
      return valores[k] * PESO_DEMO[k];
    })) || 1;

    Object.keys(barEls).forEach(function (key) {
      var peso = valores[key] * PESO_DEMO[key];
      barEls[key].style.width = ((peso / maiorPeso) * 100).toFixed(1) + '%';
      // destaca o hábito que mais pesa, sem julgar o usuário
      barEls[key].classList.toggle('is-peak', peso > 0 && peso === maiorPeso);
    });

    // a caixa d'água ESVAZIA conforme o consumo aumenta
    var pct = Math.min((total / MAX_DEMO) * 100, 100);
    var restante = 100 - pct;
    water.style.height = restante.toFixed(1) + '%';
    water.classList.toggle('is-low', restante < 25);

    // o cenário inteiro responde: menos água, menos bolhas e luz mais quente
    if (painel) painel.classList.toggle('is-heavy', pct > 65);
    if (bolhas) bolhas.style.setProperty('--bubble-op', (restante / 100).toFixed(2));

    if (relative) {
      relative.textContent = pct < 1 ? 'mínimo' : Math.round(pct) + '% da referência';
    }

    renderLiters(valores);
  }

  /* ---------- Litros: só com vazões reais preenchidas ---------- */
  function renderLiters(valores) {
    if (!litersEl) return;
    var v = (window.AGUA && window.AGUA.vazoes) || {};
    var mapa = { shower: v.chuveiro, tap: v.torneira, hose: v.mangueira };

    var faltando = Object.keys(mapa).some(function (k) {
      return !mapa[k] || mapa[k].valor === null || mapa[k].valor === undefined;
    });

    if (faltando) { litersEl.hidden = true; return; }

    var litros = Object.keys(mapa).reduce(function (soma, k) {
      return soma + valores[k] * mapa[k].valor;
    }, 0);

    var fontes = Object.keys(mapa)
      .map(function (k) { return mapa[k].fonte; })
      .filter(Boolean)
      .filter(function (f, i, arr) { return arr.indexOf(f) === i; });

    litersEl.hidden = false;
    litersEl.textContent = 'Aproximadamente ' + litros.toFixed(0) + ' L' +
      (fontes.length ? ' — vazões segundo ' + fontes.join('; ') : '');
  }

  return { init: init };
})();
