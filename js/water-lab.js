/* ============================================================
   LABORATÓRIO DA ÁGUA — torneira e chuveiro no mesmo motor
   · toda conta passa por litros(vazaoLporMin, segundos)
   · o tempo simulado é independente do tempo real: avançar
     30 dias não finge que o usuário ficou 30 dias na página
   · vazões e vazamentos vêm de js/config.js, com fonte
   ============================================================ */

window.AGUA_LAB = (function () {
  'use strict';

  var MIN = 60, HORA = 3600, DIA = 86400;
  var MES = 30 * DIA;    // a simulação chama "mês" 30 dias, e mostra isso escrito
  var ANO = 365 * DIA;

  /* ---------- conversões: uma base só, litros por minuto ---------- */
  function litros(lpm, segundos) { return lpm * (segundos / MIN); }
  function lpmDeLitrosPorDia(ld) { return ld / (24 * MIN); }   // L/dia -> L/min

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cfg = window.AGUA || {};
  var el = {};

  /* Estados por equipamento. "lpm" é resolvido no init a partir do config,
     para que nenhum número fique escrito duas vezes. */
  var EQUIPAMENTOS = {
    torneira: {
      rotulo: 'Torneira',
      art: 'faucetArt',
      estados: [
        { id: 'fechada', rotulo: 'Fechada', lpm: 0,
          msg: 'A torneira está fechada. Cada segundo fechada é água preservada.' },
        { id: 'gota', rotulo: 'Pingando', fonteVaz: 'gota',
          msg: 'Uma gota atrás da outra, sem parar. Parece pouco em um minuto — veja o que dá em um dia.' },
        { id: 'filete', rotulo: 'Em filete', fonteVaz: 'filete',
          msg: 'Um fio fino de água correndo dia e noite. É o vazamento que ninguém percebe na conta.' },
        { id: 'aberta', rotulo: 'Aberta', fonteVaz: 'torneira',
          msg: 'A torneira está aberta. Enquanto ela ficar assim, a água não para de correr.' }
      ]
    },
    chuveiro: {
      rotulo: 'Chuveiro',
      art: 'showerArt',
      estados: [
        { id: 'fechada', rotulo: 'Desligado', lpm: 0,
          msg: 'O chuveiro está desligado.' },
        { id: 'gota', rotulo: 'Pingando', fonteVaz: 'gota',
          msg: 'Chuveiro mal fechado: pinga o dia inteiro, inclusive quando não há ninguém em casa.' },
        { id: 'aberta', rotulo: 'Ligado', fonteVaz: 'chuveiro',
          msg: 'O chuveiro está ligado. Cada minuto a mais no banho se soma direto ao volume.' }
      ]
    }
  };

  /* Presets de avanço por tipo de estado: gotejamento pede dias, banho pede minutos. */
  var SKIPS = {
    aberta:  [['+1 min', MIN], ['+5 min', 5 * MIN], ['+10 min', 10 * MIN], ['+30 min', 30 * MIN]],
    banho:   [['+1 min', MIN], ['+5 min', 5 * MIN], ['+10 min', 10 * MIN], ['+15 min', 15 * MIN]],
    vaza:    [['+1 hora', HORA], ['+1 dia', DIA], ['+7 dias', 7 * DIA], ['+30 dias', 30 * DIA]]
  };

  var PROJ_ABERTA = [['1 min', MIN], ['5 min', 5 * MIN], ['15 min', 15 * MIN],
                     ['1 hora', HORA], ['1 dia', DIA]];
  var PROJ_VAZA   = [['1 hora', HORA], ['1 dia', DIA], ['30 dias', MES], ['1 ano', ANO]];

  var BANHOS = [5, 10, 15, 20, 30];

  /* ---------- estado único da experiência ---------- */
  var st = {
    equipamento: 'torneira',
    estado: 'fechada',
    segundos: 0,      // tempo SIMULADO
    rodando: true,    // relógio correndo (só conta com vazão > 0)
    tick: null
  };

  function equip() { return EQUIPAMENTOS[st.equipamento]; }

  function estadoAtual() {
    var e = equip().estados;
    for (var i = 0; i < e.length; i++) if (e[i].id === st.estado) return e[i];
    return e[0];
  }

  /* vazão em L/min do estado atual, resolvida a partir do config */
  function vazao() {
    var e = estadoAtual();
    if (e.lpm === 0) return 0;
    var v = e.fonteVaz;
    if (v === 'torneira' || v === 'chuveiro') {
      var f = (cfg.vazoes || {})[v];
      return f && f.valor ? f.valor : 0;
    }
    var vz = (cfg.vazamentos || {})[v];
    return vz && vz.valor ? lpmDeLitrosPorDia(vz.valor) : 0;
  }

  /* a fonte que corresponde à vazão atual, para o botão ⓘ */
  function fonte() {
    var e = estadoAtual();
    if (e.lpm === 0) return null;
    var v = e.fonteVaz;
    if (v === 'torneira' || v === 'chuveiro') return (cfg.vazoes || {})[v];
    return (cfg.vazamentos || {})[v];
  }

  function ehVazamento() {
    var e = estadoAtual();
    return e.fonteVaz === 'gota' || e.fonteVaz === 'filete';
  }

  /* ---------- formatação ---------- */
  function n(v, casas) {
    return v.toLocaleString('pt-BR', { minimumFractionDigits: casas || 0,
                                       maximumFractionDigits: casas || 0 });
  }

  function litrosTexto(l) {
    if (l >= 1000) return n(Math.round(l));
    if (l >= 100) return n(l, 0);
    return n(l, 1);
  }

  function tempoTexto(s) {
    if (s < HORA) {
      var m = Math.floor(s / MIN), seg = Math.floor(s % MIN);
      return (m < 10 ? '0' : '') + m + ':' + (seg < 10 ? '0' : '') + seg;
    }
    if (s < DIA) {
      var h = Math.floor(s / HORA), mm = Math.floor((s % HORA) / MIN);
      return h + 'h' + (mm < 10 ? '0' : '') + mm;
    }
    var d = s / DIA;
    return n(d, d < 10 ? 1 : 0) + (d >= 2 ? ' dias' : ' dia');
  }

  /* ---------- início ---------- */
  function init() {
    var raiz = document.getElementById('lab');
    if (!raiz) return;

    el.raiz = raiz;
    el.palco = document.getElementById('labStage');
    el.hit = document.getElementById('labHit');
    el.hint = document.getElementById('labHint');
    el.estados = document.getElementById('labStates');
    el.tempo = document.getElementById('labTime');
    el.tempoSub = document.getElementById('labTimeSub');
    el.litros = document.getElementById('labLiters');
    el.litrosSub = document.getElementById('labLitersSub');
    el.anuncio = document.getElementById('labAnuncio');
    el.barra = document.getElementById('labBar');
    el.msg = document.getElementById('labMsg');
    el.skips = document.getElementById('labSkips');
    el.banho = document.getElementById('labBanho');
    el.banhos = document.getElementById('labBanhos');
    el.qtd = document.getElementById('labQtd');
    el.unid = document.getElementById('labUnid');
    el.add = document.getElementById('labAdd');
    el.play = document.getElementById('labPlay');
    el.playLabel = document.getElementById('labPlayLabel');
    el.reset = document.getElementById('labReset');
    el.projs = document.getElementById('labProjs');
    el.projTitle = document.getElementById('labProjTitle');
    el.equiv = document.getElementById('labEquiv');
    el.flowText = document.getElementById('labFlowText');
    el.detalhe = document.getElementById('labDetalhe');
    el.abas = Array.prototype.slice.call(raiz.querySelectorAll('[data-lab-device]'));

    if (!el.palco || !el.estados) return;

    ligarAbas();
    montarBanhos();
    ligarControles();
    trocarEquipamento('torneira', true);
    iniciarRelogio();
  }

  /* ---------- equipamento ---------- */
  function ligarAbas() {
    el.abas.forEach(function (b, i) {
      b.addEventListener('click', function () {
        trocarEquipamento(b.getAttribute('data-lab-device'));
      });
      b.addEventListener('keydown', function (e) {
        var d = null;
        if (e.key === 'ArrowRight') d = (i + 1) % el.abas.length;
        if (e.key === 'ArrowLeft') d = (i - 1 + el.abas.length) % el.abas.length;
        if (d === null) return;
        e.preventDefault();
        trocarEquipamento(el.abas[d].getAttribute('data-lab-device'));
        el.abas[d].focus();
      });
    });
  }

  function trocarEquipamento(id, inicial) {
    if (!EQUIPAMENTOS[id]) return;
    st.equipamento = id;
    st.estado = 'fechada';
    st.segundos = 0;
    st.rodando = true;

    el.abas.forEach(function (b) {
      var on = b.getAttribute('data-lab-device') === id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });

    // só a arte do equipamento escolhido fica visível
    Object.keys(EQUIPAMENTOS).forEach(function (k) {
      var art = document.getElementById(EQUIPAMENTOS[k].art);
      if (art) art.classList.toggle('is-on', k === id);
    });

    montarEstados();
    aplicar(inicial);
  }

  /* ---------- estados ---------- */
  function montarEstados() {
    el.estados.innerHTML = '';
    equip().estados.forEach(function (e) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lab-state';
      b.textContent = e.rotulo;
      b.setAttribute('data-estado', e.id);
      b.setAttribute('aria-pressed', String(e.id === st.estado));
      b.addEventListener('click', function () { setEstado(e.id); });
      el.estados.appendChild(b);
    });
  }

  function setEstado(id) {
    st.estado = id;
    st.segundos = 0;      // cada estado começa a própria contagem
    st.rodando = true;
    aplicar();
  }

  /* clicar no desenho percorre os estados na ordem */
  function proximoEstado() {
    var lista = equip().estados;
    var i = 0;
    for (var k = 0; k < lista.length; k++) if (lista[k].id === st.estado) i = k;
    setEstado(lista[(i + 1) % lista.length].id);
  }

  /* ---------- controles ---------- */
  function ligarControles() {
    if (el.hit) el.hit.addEventListener('click', proximoEstado);

    if (el.add) el.add.addEventListener('click', function () {
      var q = parseFloat(el.qtd.value);
      var u = parseFloat(el.unid.value);
      if (!isFinite(q) || q <= 0) return;
      avancar(q * u);
    });

    if (el.play) el.play.addEventListener('click', function () {
      st.rodando = !st.rodando;
      rotularPlay();
    });

    if (el.reset) el.reset.addEventListener('click', function () {
      st.estado = 'fechada';
      st.segundos = 0;
      st.rodando = true;
      aplicar();
    });
  }

  function montarBanhos() {
    if (!el.banhos) return;
    BANHOS.forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = m + ' min';
      b.addEventListener('click', function () {
        st.segundos = m * MIN;      // define o tempo, não soma
        st.rodando = false;         // congela para leitura
        aplicar();
        pulsar();
      });
      el.banhos.appendChild(b);
    });
  }

  function montarSkips() {
    el.skips.innerHTML = '';
    var lista;
    if (ehVazamento()) lista = SKIPS.vaza;
    else if (st.equipamento === 'chuveiro') lista = SKIPS.banho;
    else lista = SKIPS.aberta;

    lista.forEach(function (par) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = par[0];
      b.disabled = vazao() === 0;
      b.addEventListener('click', function () { avancar(par[1]); });
      el.skips.appendChild(b);
    });
  }

  function avancar(segundos) {
    if (vazao() === 0) return;
    st.segundos += segundos;
    aplicar();
    pulsar();
  }

  /* pequeno pulso no número, para o salto não passar despercebido */
  function pulsar() {
    if (reduce.matches || !el.litros) return;
    el.litros.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }],
      { duration: 360, easing: 'cubic-bezier(.22,.61,.36,1)' }
    );
  }

  /* ---------- relógio: 1 segundo real = 1 segundo simulado ---------- */
  function iniciarRelogio() {
    if (st.tick) window.clearInterval(st.tick);
    st.tick = window.setInterval(function () {
      if (!st.rodando || vazao() === 0) return;
      st.segundos += 1;
      aplicar(false, true);
    }, 1000);
  }

  function rotularPlay() {
    if (!el.play) return;
    var parado = !st.rodando;
    el.play.setAttribute('aria-pressed', String(parado));
    if (el.playLabel) el.playLabel.textContent = parado ? 'Continuar' : 'Pausar';
  }

  /* ---------- desenha tudo a partir do estado ---------- */
  function aplicar(inicial, soRelogio) {
    var e = estadoAtual();
    var lpm = vazao();
    var total = litros(lpm, st.segundos);

    el.palco.setAttribute('data-state', st.estado);

    Array.prototype.forEach.call(el.estados.children, function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-estado') === st.estado));
    });

    if (el.tempo) el.tempo.textContent = tempoTexto(st.segundos);
    if (el.litros) el.litros.innerHTML = litrosTexto(total) + ' <small>L</small>';

    // o leitor de tela só é avisado em mudanças deliberadas (troca de estado,
    // salto de tempo, reinício) — nunca na contagem segundo a segundo
    if (!soRelogio && el.anuncio) {
      el.anuncio.textContent = lpm === 0
        ? estadoAtual().rotulo + '. Nenhum consumo.'
        : estadoAtual().rotulo + '. ' + tempoTexto(st.segundos) + ', ' +
          litrosTexto(total) + ' litros.';
    }

    if (el.tempoSub) {
      el.tempoSub.textContent = lpm === 0 ? 'Nada correndo agora.'
        : (st.rodando ? 'Correndo em tempo real.' : 'Simulação pausada.');
    }
    if (el.litrosSub) {
      el.litrosSub.textContent = lpm === 0 ? '' : 'a ' + n(lpm, lpm < 1 ? 2 : 1) + ' L/min';
    }

    if (el.barra) {
      // a barra enche em 5 minutos de água corrente; para vazamento, em 1 dia
      var alvo = ehVazamento() ? DIA : 5 * MIN;
      el.barra.style.width = Math.min(st.segundos / alvo, 1) * 100 + '%';
    }

    if (el.msg && !soRelogio) el.msg.textContent = mensagem(e, lpm);

    if (el.hint) {
      el.hint.textContent = lpm === 0
        ? 'Toque no equipamento para trocar de estado'
        : 'Toque de novo para mudar o estado';
    }

    if (!soRelogio) {
      montarSkips();
      montarProjecoes(lpm);
      atualizarFonte(lpm);
      if (el.banho) el.banho.hidden = !(st.equipamento === 'chuveiro' && st.estado === 'aberta');
      rotularPlay();
    }

    atualizarEquivalencia(total);
  }

  function mensagem(e, lpm) {
    if (lpm === 0) return e.msg;
    if (st.equipamento === 'torneira' && st.estado === 'aberta') {
      var marcos = cfg.mensagensTorneira || [];
      var texto = e.msg;
      for (var i = 0; i < marcos.length; i++) {
        if (st.segundos >= marcos[i].aos) texto = marcos[i].texto;
      }
      return texto;
    }
    return e.msg;
  }

  /* ---------- projeções ---------- */
  function montarProjecoes(lpm) {
    if (!el.projs) return;
    el.projs.innerHTML = '';
    if (lpm === 0) {
      if (el.projTitle) el.projTitle.textContent = 'Neste ritmo';
      var li = document.createElement('li');
      li.innerHTML = '<span>Parado</span><strong>0 L</strong>';
      el.projs.appendChild(li);
      return;
    }

    if (el.projTitle) el.projTitle.textContent = 'Neste ritmo — ' + estadoAtual().rotulo.toLowerCase();
    var lista = ehVazamento() ? PROJ_VAZA : PROJ_ABERTA;
    lista.forEach(function (par) {
      var item = document.createElement('li');
      var s = document.createElement('span');
      s.textContent = par[0];
      var f = document.createElement('strong');
      f.textContent = litrosTexto(litros(lpm, par[1])) + ' L';
      item.appendChild(s);
      item.appendChild(f);
      el.projs.appendChild(item);
    });
  }

  /* ---------- equivalência visual ---------- */
  function atualizarEquivalencia(total) {
    if (!el.equiv) return;
    if (total < 2) { el.equiv.hidden = true; return; }
    el.equiv.hidden = false;

    var txt;
    if (total >= 1000) {
      txt = '≈ <strong>' + n(total / 1000, 1) + '</strong> caixas d\'água de 1.000 L';
    } else if (total >= 20) {
      txt = '≈ <strong>' + n(total / 10, 1) + '</strong> baldes de 10 L';
    } else {
      txt = '≈ <strong>' + n(total / 2, 1) + '</strong> garrafas de 2 L';
    }
    el.equiv.innerHTML = txt + ' — comparação apenas para dar escala ao volume.';
  }

  /* ---------- vazão e fonte ---------- */
  function atualizarFonte(lpm) {
    var f = fonte();
    if (!el.flowText) return;

    if (!f || lpm === 0) {
      el.flowText.textContent = 'Escolha um estado para ver a vazão considerada.';
      if (el.detalhe) el.detalhe.textContent = 'A vazão real muda com a pressão da rede, o modelo e a abertura.';
      return;
    }

    var base = ehVazamento()
      ? 'Simulação considerando <strong>' + n(f.valor) + ' ' + f.unidade + '</strong>' +
        ' (' + n(lpm, 2) + ' L/min).'
      : 'Simulação considerando <strong>' + n(f.valor, f.valor % 1 ? 1 : 0) + ' ' + f.unidade + '</strong>.';
    el.flowText.innerHTML = base;

    if (el.detalhe) {
      el.detalhe.innerHTML =
        '<strong>Fonte:</strong> ' + f.fonte + '<br>' + f.detalhe +
        '<br><strong>Observação:</strong> a vazão real varia com a pressão da rede, o modelo do ' +
        'equipamento e o quanto se abre o registro.' +
        (f.url ? '<br><a href="' + f.url + '" target="_blank" rel="noopener">ver a página</a>' : '');
    }
  }

  /* exposto para os testes de cálculo */
  return {
    init: init,
    _litros: litros,
    _lpmDeLitrosPorDia: lpmDeLitrosPorDia
  };
})();
