/* ============================================================
   WASTE HOUSE — casa do desperdício
   · hover no ponto acende o cômodo correspondente
   · clique abre um painel compacto ao lado do próprio ponto
   ============================================================ */

window.AGUA_HOUSE = (function () {
  'use strict';

  var hotspots = [], rooms = {}, pop, house, stage;
  var titulo, texto, lista, solucao, dica;
  var atual = null;

  function init() {
    house = document.querySelector('.house');
    stage = document.querySelector('.house-stage');
    pop   = document.getElementById('housePop');
    if (!house || !stage || !pop) return;

    hotspots = Array.prototype.slice.call(stage.querySelectorAll('.hotspot-layer .hotspot'));
    if (!hotspots.length) return;

    titulo  = document.getElementById('houseTitle');
    texto   = document.getElementById('houseText');
    lista   = document.getElementById('houseList');
    solucao = document.getElementById('houseFix');
    dica    = document.getElementById('houseHint');

    stage.querySelectorAll('.room').forEach(function (g) {
      rooms[g.getAttribute('data-room')] = g;
    });

    bind();
  }

  function bind() {
    hotspots.forEach(function (hotspot, i) {
      var chave = hotspot.getAttribute('data-room');
      hotspot.setAttribute('aria-expanded', 'false');
      hotspot.setAttribute('aria-controls', 'housePop');

      // acender o cômodo ao aproximar
      hotspot.addEventListener('pointerenter', function () { light(chave, true); });
      hotspot.addEventListener('pointerleave', function () {
        if (atual !== chave) light(chave, false);
      });
      hotspot.addEventListener('focus', function () { light(chave, true); });
      hotspot.addEventListener('blur', function () {
        if (atual !== chave) light(chave, false);
      });

      hotspot.addEventListener('click', function (e) {
        e.stopPropagation();
        atual === chave ? fechar() : abrir(hotspot, chave);
      });

      hotspot.addEventListener('keydown', function (e) {
        var proximo = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') proximo = hotspots[(i + 1) % hotspots.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') proximo = hotspots[(i - 1 + hotspots.length) % hotspots.length];
        if (!proximo) return;
        e.preventDefault();
        proximo.focus();
      });
    });

    var fechaBtn = document.getElementById('housePopClose');
    if (fechaBtn) fechaBtn.addEventListener('click', function () {
      fechar();
      if (atualHotspot()) atualHotspot().focus();
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.house-stage')) fechar();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && atual) {
        var alvo = atualHotspot();
        fechar();
        if (alvo) alvo.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (atual) posicionar(atualHotspot());
    });
  }

  function atualHotspot() {
    return hotspots.filter(function (h) {
      return h.getAttribute('data-room') === atual;
    })[0] || null;
  }

  function light(chave, ligar) {
    var room = rooms[chave];
    if (room) room.classList.toggle('is-lit', ligar);
  }

  /* ------------------------------------------------------------
     Abrir o painel junto ao ponto clicado
     ------------------------------------------------------------ */
  function abrir(hotspot, chave) {
    var dados = (window.AGUA && window.AGUA.comodos) || {};
    var info = dados[chave];
    if (!info) return;

    // fecha o anterior
    Object.keys(rooms).forEach(function (k) { light(k, false); });
    hotspots.forEach(function (h) {
      h.classList.remove('is-active');
      h.setAttribute('aria-expanded', 'false');
    });

    atual = chave;
    light(chave, true);
    hotspot.classList.add('is-active');
    hotspot.setAttribute('aria-expanded', 'true');
    house.classList.add('is-exploring');

    titulo.textContent = info.titulo;
    texto.textContent = info.texto;

    lista.innerHTML = '';
    info.itens.forEach(function (item) {
      var li = document.createElement('li');
      li.textContent = item;
      lista.appendChild(li);
    });

    solucao.textContent = info.solucao || '';

    pop.hidden = false;
    posicionar(hotspot);
  }

  function fechar() {
    if (!atual) return;
    light(atual, false);
    hotspots.forEach(function (h) {
      h.classList.remove('is-active');
      h.setAttribute('aria-expanded', 'false');
    });
    atual = null;
    pop.hidden = true;
    house.classList.remove('is-exploring');
  }

  /* ------------------------------------------------------------
     Posicionamento: acompanha o ponto sem sair do palco
     ------------------------------------------------------------ */
  function posicionar(hotspot) {
    if (!hotspot) return;

    // em telas estreitas o painel vira um bloco abaixo da ilustração
    if (window.innerWidth <= 720) {
      pop.style.position = 'static';
      pop.style.width = '';
      pop.style.left = pop.style.top = '';
      return;
    }

    pop.style.position = 'absolute';

    var palco = stage.getBoundingClientRect();
    var ponto = hotspot.getBoundingClientRect();
    var painel = pop.getBoundingClientRect();

    var px = ponto.left - palco.left + ponto.width / 2;
    var py = ponto.top - palco.top + ponto.height;

    // abre para o lado OPOSTO ao cômodo, para não cobrir o que está sendo explicado
    var room = rooms[atual];
    var paraDireita = true;
    if (room && room.getBoundingClientRect) {
      var rr = room.getBoundingClientRect();
      var centroRoom = rr.left - palco.left + rr.width / 2;
      paraDireita = centroRoom < palco.width / 2;
    }

    var left = paraDireita ? px + 22 : px - painel.width - 22;
    // se não couber do lado escolhido, usa o outro
    if (left + painel.width > palco.width - 10) left = px - painel.width - 22;
    if (left < 10) left = px + 22;
    left = Math.max(10, Math.min(left, palco.width - painel.width - 10));

    // centraliza verticalmente no ponto, sem sair do palco
    var top = py - painel.height / 2;
    top = Math.max(10, Math.min(top, palco.height - painel.height - 10));

    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    pop.style.setProperty('--pop-origin', (px - left) + 'px 0%');
  }

  return { init: init };
})();
