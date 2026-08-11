/* ============================================================
   FAUCET — torneira interativa

   Estados (classes no .faucet-stage, o CSS cuida das animações):
     (nenhuma)    fechada
     .is-open     registro girado, jato forte, gotas, ondas
     .is-closing  jato afina → última gota → ondulação → para

   O contador é demonstrativo. Litros só aparecem se a vazão real
   estiver preenchida em js/config.js, sempre com a fonte.
   ============================================================ */

window.AGUA_FAUCET = (function () {
  'use strict';

  var CICLO = 120;            // segundos usados como referência da barra
  var FECHAMENTO = 900;       // duração da sequência de fechamento (ms)

  var stage, hit, btn, label, timeEl, bar, msg, litersEl, resetBtn, pool, hint;
  var seconds = 0, timer = null, closingTimer = null, open = false;

  function init() {
    stage    = document.getElementById('faucetStage');
    hit      = document.getElementById('faucetHit');
    btn      = document.getElementById('faucetToggle');
    label    = document.getElementById('faucetToggleLabel');
    timeEl   = document.getElementById('faucetTime');
    bar      = document.getElementById('faucetBar');
    msg      = document.getElementById('faucetMsg');
    litersEl = document.getElementById('faucetLiters');
    resetBtn = document.getElementById('faucetReset');
    hint     = document.getElementById('faucetHint');
    if (!stage || !btn) return;

    pool = stage.querySelector('#faucet-pool');

    btn.addEventListener('click', toggle);
    if (hit) hit.addEventListener('click', toggle);          // clicar na própria torneira
    if (resetBtn) resetBtn.addEventListener('click', reset);

    initMouseReflex();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && open) pause();
      else if (!document.hidden && open) resume();
    });

    render();
  }

  /* ------------------------------------------------------------
     Reflexo metálico acompanha o mouse (bem discreto: até 3px)
     ------------------------------------------------------------ */
  function initMouseReflex() {
    if (!hit) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var frame = null;

    hit.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || frame) return;
      frame = window.requestAnimationFrame(function () {
        var r = hit.getBoundingClientRect();
        var nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        var ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        stage.style.setProperty('--tap-hx', (nx * 3).toFixed(2) + 'px');
        stage.style.setProperty('--tap-hy', (ny * 3).toFixed(2) + 'px');
        frame = null;
      });
    });

    hit.addEventListener('pointerleave', function () {
      stage.style.removeProperty('--tap-hx');
      stage.style.removeProperty('--tap-hy');
    });
  }

  /* ------------------------------------------------------------
     Abrir / fechar
     ------------------------------------------------------------ */
  function toggle() { open ? close() : openTap(); }

  function openTap() {
    open = true;
    window.clearTimeout(closingTimer);

    stage.classList.remove('is-closing');
    stage.classList.add('is-open');
    setPressed(true);
    label.textContent = 'Fechar torneira';
    if (hint) hint.textContent = 'A água está correndo — toque para fechar';

    msg.classList.remove('is-alert');
    resume();
    setMessage(seconds);
  }

  function close() {
    open = false;
    setPressed(false);
    label.textContent = 'Abrir torneira';
    if (hint) hint.textContent = 'Toque na torneira para abrir';
    pause();

    // fluxo forte → fluxo fino → última gota → fim
    stage.classList.remove('is-open');
    stage.classList.add('is-closing');
    closingTimer = window.setTimeout(function () {
      stage.classList.remove('is-closing');
    }, FECHAMENTO);

    if (seconds > 0) {
      msg.classList.remove('is-alert');
      msg.textContent = 'Torneira fechada. Desperdício evitado a partir de agora — ' +
                        'foram ' + formatTime(seconds) + ' com a água correndo.';
    }
  }

  function setPressed(estado) {
    btn.setAttribute('aria-pressed', String(estado));
    if (hit) hit.setAttribute('aria-pressed', String(estado));
  }

  function resume() {
    if (timer) return;
    timer = window.setInterval(function () {
      seconds++;
      render();
      setMessage(seconds);
    }, 1000);
  }

  function pause() {
    window.clearInterval(timer);
    timer = null;
  }

  function reset() {
    close();
    seconds = 0;
    render();
    msg.classList.remove('is-alert');
    msg.textContent = 'A torneira está fechada. Cada segundo fechada é água preservada.';
  }

  /* ---------- Mensagens por marco de tempo ---------- */
  function setMessage(sec) {
    var lista = (window.AGUA && window.AGUA.mensagensTorneira) || [];
    var atual = null;
    lista.forEach(function (m) { if (sec >= m.aos) atual = m; });
    if (!atual) return;
    if (msg.textContent !== atual.texto) msg.textContent = atual.texto;
    msg.classList.toggle('is-alert', sec >= 60);
  }

  /* ---------- Contador, barra e nível da cuba ---------- */
  function render() {
    timeEl.textContent = formatTime(seconds);

    var pct = Math.min((seconds / CICLO) * 100, 100);
    bar.style.width = pct.toFixed(1) + '%';

    if (pool) {
      var altura = Math.min((seconds / CICLO) * 46, 46);
      pool.setAttribute('height', altura.toFixed(1));
      pool.setAttribute('y', (407 - altura).toFixed(1));
    }

    renderLiters();
  }

  /* ---------- Litros: só com dado + fonte preenchidos ---------- */
  function renderLiters() {
    if (!litersEl) return;
    var v = window.AGUA && window.AGUA.vazoes && window.AGUA.vazoes.torneira;

    if (!v || v.valor === null || v.valor === undefined) {
      litersEl.hidden = true;
      return;
    }

    var litros = (seconds / 60) * v.valor;
    litersEl.hidden = false;
    litersEl.textContent = 'Equivalente a aproximadamente ' + litros.toFixed(1) + ' L' +
      ' (vazão de ' + v.valor + ' ' + (v.unidade || 'L/min') + ')' +
      (v.fonte ? ' — fonte: ' + v.fonte : '');
  }

  function formatTime(total) {
    var m = Math.floor(total / 60);
    var s = total % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  return { init: init };
})();
