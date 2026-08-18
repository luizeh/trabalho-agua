/* ============================================================
   QUANTA ÁGUA TEMOS — a esfera como visualização dos dados
   · as quatro etapas vivem em ETAPAS; a lista da esquerda, os
     indicadores em órbita e a faixa de baixo saem todos dela
   · a altura da água NÃO é proporcional ao percentual: é o
     volume da calota esférica que precisa bater com ele, senão
     2,5% pareceria um terço da esfera
   · nada aqui depende do scroll — a seção só muda quando o
     usuário escolhe uma etapa
   ============================================================ */

window.AGUA_AVAIL = (function () {
  'use strict';

  var USGS = {
    fonte: 'USGS — How Much Water is There on Earth? (2019)',
    url: 'https://www.usgs.gov/special-topics/water-science-school/science/how-much-water-there-earth'
  };

  /* A parcela potável não está na tabela do USGS: quem publica esse recorte
     é o Bureau of Reclamation, que desconta da água doce o que está congelado,
     poluída demais ou fundo demais para valer o custo de extrair. */
  var USBR = {
    fonte: 'US Bureau of Reclamation — Water Facts: Worldwide Water Supply',
    url: 'https://www.usbr.gov/mp/arwec/water-facts-ww-water-sup.html'
  };

  var ETAPAS = [
    {
      id: 'total', n: 1, pct: 100, icone: 'i-globe',
      rotulo: 'Toda a água do planeta',
      curto: 'Água total',
      texto: 'Oceanos, geleiras, rios, lagos, atmosfera e água subterrânea somados — tudo ' +
             'o que existe de água na Terra, em qualquer estado.',
      dado: '1,386 bilhão de km³',
      complemento: 'é o volume estimado de toda a água do planeta. É desse total que saem ' +
                   'todas as porcentagens desta seção.',
      img: 'assets/images/sphere/01-total.webp',
      alt: 'A Terra vista do espaço, com o oceano Pacífico ocupando quase todo o disco visível',
      fonte: USGS.fonte, url: USGS.url
    },
    {
      id: 'salgada', n: 2, pct: 96.54, icone: 'i-globe',
      rotulo: 'A maior parte é salgada',
      curto: 'Água salgada',
      texto: 'Quase tudo está nos oceanos, mares e baías. É água imprópria para beber, para ' +
             'a agricultura e para a maior parte dos usos industriais.',
      dado: '96,54%',
      complemento: 'do total está nos oceanos, mares e baías. Somando a água subterrânea e os ' +
                   'lagos salgados, a parcela salgada passa de 97%.',
      img: 'assets/images/sphere/02-salgada.webp',
      alt: 'Oceano Atlântico aberto ao amanhecer, com o horizonte sob um céu nublado',
      fonte: USGS.fonte, url: USGS.url
    },
    {
      id: 'doce', n: 3, pct: 2.5, icone: 'i-cloud',
      rotulo: 'Uma pequena parcela é doce',
      curto: 'Água doce',
      texto: 'Toda a água doce do planeta cabe nesses 2,5%. E a maior parte dela não está ' +
             'líquida: está congelada nas geleiras e calotas polares.',
      dado: '68,7%',
      complemento: 'de toda a água doce está congelada em geleiras, calotas polares e neve ' +
                   'permanente. Outros 30,1% estão no subsolo.',
      img: 'assets/images/sphere/03-doce.webp',
      alt: 'Bloco de gelo à deriva no mar, com montanhas nevadas ao fundo',
      fonte: USGS.fonte, url: USGS.url
    },
    {
      id: 'potavel', n: 4, pct: 0.5, icone: 'i-drop',
      rotulo: 'A água potável é uma fração mínima',
      curto: 'Água potável',
      texto: 'Nem toda água doce serve para beber. Tirando a que está congelada, a poluída ' +
             'demais e a que está funda demais para valer o custo de extrair, sobra muito pouco.',
      dado: '0,5%',
      complemento: 'de toda a água da Terra é água doce disponível — a parcela de onde sai ' +
                   'tudo o que bebemos. E nem ela chega potável: precisa ser captada e tratada ' +
                   'antes de sair na torneira.',
      img: 'assets/images/sphere/04-potavel.webp',
      alt: 'Copo de vidro cheio de água gelada, coberto de gotas de condensação',
      fonte: USBR.fonte, url: USBR.url
    }
  ];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var el = {};
  var ativo = 0;
  var numAnim = 0;

  /* estado do desenho: alvo e valor corrente, para tudo animar junto */
  var alvo = { nivel: 1, incX: 0, incY: 0 };
  var atual = { nivel: 1, incX: 0, incY: 0 };
  var bolhas = [];
  var loop = 0;
  var visivel = false;

  function init() {
    var raiz = document.getElementById('disponibilidade');
    if (!raiz) return;

    el.raiz = raiz;
    el.palco = raiz.querySelector('[data-esf-palco]');
    el.bola = raiz.querySelector('[data-esf-bola]');
    el.agua = raiz.querySelector('[data-esf-agua]');
    el.canvas = raiz.querySelector('[data-esf-bolhas]');
    el.lista = raiz.querySelector('[data-esf-lista]');
    el.pontos = raiz.querySelector('[data-esf-pontos]');
    el.faixa = raiz.querySelector('[data-esf-faixa]');
    if (!el.palco || !el.bola || !el.agua || !el.lista) return;

    el.num = raiz.querySelector('[data-esf-num]');
    el.rotulo = raiz.querySelector('[data-esf-rotulo]');
    el.dado = raiz.querySelector('[data-esf-dado]');
    el.complemento = raiz.querySelector('[data-esf-complemento]');
    el.fonte = raiz.querySelector('[data-esf-fonte]');
    el.marca = raiz.querySelector('[data-esf-marca]');
    el.anuncio = raiz.querySelector('[data-esf-anuncio]');

    montarLista();
    montarPontos();
    montarFaixa();
    ligarMouse();
    ligarCanvas();

    setEtapa(0, true);
  }

  /* ------------------------------------------------------------
     Da fração de volume para a altura da água
     Numa esfera, a calota de altura t (0..1 do diâmetro) vale
     t²(3−2t) do volume. Queremos o caminho inverso: dado o
     percentual, qual altura desenhar. Três passos de Newton
     resolvem com folga.
     ------------------------------------------------------------ */
  function alturaPorVolume(f) {
    if (f >= 1) return 1;
    if (f <= 0) return 0;
    var t = Math.cbrt(f);                       // chute inicial razoável
    for (var i = 0; i < 12; i++) {
      var erro = t * t * (3 - 2 * t) - f;
      var deriv = 6 * t * (1 - t);
      if (Math.abs(deriv) < 1e-9) break;
      t -= erro / deriv;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
    }
    return t;
  }

  /* ------------------------------------------------------------
     Lista da esquerda, indicadores em órbita e faixa de baixo
     ------------------------------------------------------------ */
  function montarLista() {
    var frag = document.createDocumentFragment();

    ETAPAS.forEach(function (e, i) {
      var li = document.createElement('li');
      li.className = 'esf-passo';
      li.setAttribute('data-etapa', e.id);

      li.innerHTML =
        '<button type="button" class="esf-passo-btn" aria-pressed="false">' +
          '<span class="esf-passo-n">' + e.n + '</span>' +
          '<span class="esf-passo-txt">' +
            '<span class="esf-passo-tit">' + e.rotulo + '</span>' +
            '<span class="esf-passo-sub">' + e.texto + '</span>' +
          '</span>' +
          '<span class="esf-passo-pct">' + fmt(e.pct) + '%</span>' +
        '</button>';

      var b = li.querySelector('button');
      b.addEventListener('click', function () { setEtapa(i); });
      b.addEventListener('mouseenter', function () { setEtapa(i); });
      b.addEventListener('focus', function () { setEtapa(i); });
      b.addEventListener('keydown', function (ev) { navegar(ev, i); });

      frag.appendChild(li);
      el.passos = el.passos || [];
    });

    el.lista.appendChild(frag);
    el.passos = Array.prototype.slice.call(el.lista.querySelectorAll('.esf-passo'));
    el.botoes = Array.prototype.slice.call(el.lista.querySelectorAll('.esf-passo-btn'));
  }

  function navegar(ev, i) {
    var d = null;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') d = (i + 1) % ETAPAS.length;
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') d = (i - 1 + ETAPAS.length) % ETAPAS.length;
    if (ev.key === 'Home') d = 0;
    if (ev.key === 'End') d = ETAPAS.length - 1;
    if (d === null) return;
    ev.preventDefault();
    setEtapa(d);
    el.botoes[d].focus();
  }

  /* os quatro pontos que orbitam a esfera: o mesmo controle, em forma de ícone */
  function montarPontos() {
    if (!el.pontos) return;
    var frag = document.createDocumentFragment();

    ETAPAS.forEach(function (e, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'esf-ponto';
      b.style.setProperty('--i', i);
      b.setAttribute('data-etapa', e.id);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', e.rotulo + ' — ' + fmt(e.pct) + '% do total');
      b.innerHTML = '<span class="esf-ponto-ico interactive-icon" aria-hidden="true">' +
                      '<svg viewBox="0 0 24 24"><use href="#' + e.icone + '"/></svg></span>' +
                    '<span class="esf-ponto-dica">' + e.curto + '</span>';

      b.addEventListener('click', function () { setEtapa(i); });
      b.addEventListener('mouseenter', function () { setEtapa(i); });
      b.addEventListener('focus', function () { setEtapa(i); });
      frag.appendChild(b);
    });

    el.pontos.appendChild(frag);
    el.listaPontos = Array.prototype.slice.call(el.pontos.querySelectorAll('.esf-ponto'));
  }

  /* faixa de baixo: o resumo da redução, também clicável */
  function montarFaixa() {
    if (!el.faixa) return;
    var frag = document.createDocumentFragment();

    ETAPAS.forEach(function (e, i) {
      if (i > 0) {
        var seta = document.createElement('span');
        seta.className = 'esf-seta';
        seta.setAttribute('aria-hidden', 'true');
        seta.innerHTML = '<svg viewBox="0 0 24 24"><use href="#i-chevron"/></svg>';
        frag.appendChild(seta);
      }

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'esf-marco';
      b.setAttribute('data-etapa', e.id);
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML =
        '<span class="esf-marco-foto">' +
          '<img src="' + e.img + '" alt="' + e.alt + '" width="520" height="520" ' +
               'loading="lazy" decoding="async">' +
        '</span>' +
        '<span class="esf-marco-txt">' +
          '<span class="esf-marco-nome">' + e.curto + '</span>' +
          '<span class="esf-marco-pct">' + fmt(e.pct) + '%</span>' +
        '</span>';

      b.addEventListener('click', function () { setEtapa(i); });
      b.addEventListener('mouseenter', function () { setEtapa(i); });
      b.addEventListener('focus', function () { setEtapa(i); });
      frag.appendChild(b);
    });

    el.faixa.appendChild(frag);
    el.marcos = Array.prototype.slice.call(el.faixa.querySelectorAll('.esf-marco'));
  }

  /* ------------------------------------------------------------
     Estado único: a etapa escolhida
     ------------------------------------------------------------ */
  function setEtapa(i, inicial) {
    if (i < 0 || i >= ETAPAS.length) return;
    if (!inicial && i === ativo) return;

    var antes = ETAPAS[ativo] ? ETAPAS[ativo].pct : 100;
    ativo = i;
    var e = ETAPAS[i];

    el.raiz.setAttribute('data-etapa-ativa', e.id);
    alvo.nivel = alturaPorVolume(e.pct / 100);

    marcar(el.passos, i, 'esf-passo-btn');
    marcar(el.listaPontos, i, null);
    marcar(el.marcos, i, null);

    if (el.botoes) {
      el.botoes.forEach(function (b, k) { b.tabIndex = k === i ? 0 : -1; });
    }

    if (el.rotulo) el.rotulo.textContent = e.curto;
    if (el.dado) el.dado.textContent = e.dado;
    if (el.complemento) el.complemento.textContent = e.complemento;
    if (el.fonte) {
      el.fonte.innerHTML = '<span>Fonte:</span> <a href="' + e.url +
        '" target="_blank" rel="noopener">' + e.fonte + '</a>';
    }
    if (el.marca) el.marca.hidden = e.id !== 'potavel';

    animarNumero(antes, e.pct, inicial);

    // leitores de tela recebem o resumo, não a contagem inteira
    if (el.anuncio && !inicial) {
      el.anuncio.textContent = e.rotulo + ': ' + fmt(e.pct) + '% de toda a água do planeta.';
    }

    if (reduce.matches) {
      atual.nivel = alvo.nivel;
      aplicarNivel();
    } else {
      acordar();
    }
  }

  function marcar(lista, i, seletorFilho) {
    if (!lista) return;
    lista.forEach(function (n, k) {
      var on = k === i;
      n.classList.toggle('is-active', on);
      var botao = seletorFilho ? n.querySelector('.' + seletorFilho) : n;
      if (botao && botao.setAttribute) botao.setAttribute('aria-pressed', String(on));
    });
  }

  /* ------------------------------------------------------------
     O número central, contado em vez de trocado
     ------------------------------------------------------------ */
  function animarNumero(de, para, inicial) {
    if (!el.num) return;
    if (numAnim) { cancelAnimationFrame(numAnim); numAnim = 0; }

    if (inicial || reduce.matches) {
      el.num.textContent = fmt(para) + '%';
      return;
    }

    var t0 = 0, dur = 700, casas = casasDe(para);
    function passo(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var s = 1 - Math.pow(1 - p, 3);              // desacelera no fim
      el.num.textContent = fmt(de + (para - de) * s, casas) + '%';
      if (p < 1) numAnim = requestAnimationFrame(passo);
      else { numAnim = 0; el.num.textContent = fmt(para) + '%'; }
    }
    numAnim = requestAnimationFrame(passo);
  }

  /* 100 · 96,54 · 2,5 · 0,008 — no formato daqui e sem zeros à toa.
     Arredondar por faixa de grandeza transformaria 96,54 em 97. */
  function fmt(v, casas) {
    return v.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: casas === undefined ? 3 : casas
    });
  }

  /* quantas casas o valor de destino precisa: e nelas que a contagem roda,
     senao o numero fica tremendo entre 3 e 0 decimais no meio do caminho */
  function casasDe(v) {
    if (v >= 100) return 0;
    if (v >= 10) return 2;
    if (v >= 1) return 1;
    return 3;
  }

  /* ------------------------------------------------------------
     Inclinação conforme o mouse — poucos graus, nunca perseguindo
     ------------------------------------------------------------ */
  function ligarMouse() {
    if (reduce.matches) return;

    el.palco.addEventListener('pointermove', function (ev) {
      if (ev.pointerType === 'touch') return;     // no toque a inclinação atrapalha
      var r = el.palco.getBoundingClientRect();
      var dx = (ev.clientX - r.left) / r.width - 0.5;
      var dy = (ev.clientY - r.top) / r.height - 0.5;
      alvo.incY = Math.max(-1, Math.min(1, dx * 2)) * 7;    // graus
      alvo.incX = Math.max(-1, Math.min(1, dy * 2)) * -5;
      acordar();
    });

    el.palco.addEventListener('pointerleave', function () {
      alvo.incY = 0;
      alvo.incX = 0;
      acordar();
    });

    el.palco.addEventListener('pointerenter', function (ev) {
      if (ev.pointerType !== 'touch') el.bola.classList.add('is-perto');
    });
    el.palco.addEventListener('pointerleave', function () {
      el.bola.classList.remove('is-perto');
    });
  }

  /* ------------------------------------------------------------
     Bolhas no canvas — só rodam com a seção à vista
     ------------------------------------------------------------ */
  function ligarCanvas() {
    if (!el.canvas || reduce.matches) return;
    el.ctx = el.canvas.getContext('2d');

    for (var i = 0; i < 22; i++) bolhas.push(novaBolha(Math.random()));

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (ents) {
        visivel = ents[0].isIntersecting;
        if (visivel) acordar();
      }, { threshold: 0 }).observe(el.palco);
    } else {
      visivel = true;
    }

    window.addEventListener('resize', dimensionar);
    dimensionar();
    acordar();
  }

  function novaBolha(y) {
    return {
      x: Math.random(),
      y: y === undefined ? 1 : y,               // 1 = fundo, 0 = superfície
      r: 1 + Math.random() * 2.6,
      v: 0.0009 + Math.random() * 0.0022,
      o: 0.16 + Math.random() * 0.34,
      f: Math.random() * Math.PI * 2            // fase do bamboleio
    };
  }

  function dimensionar() {
    if (!el.canvas) return;
    var r = el.canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.canvas.width = Math.max(1, Math.round(r.width * dpr));
    el.canvas.height = Math.max(1, Math.round(r.height * dpr));
    el.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    el.cw = r.width;
    el.ch = r.height;
  }

  function desenharBolhas(t) {
    if (!el.ctx || !el.cw) return;
    var ctx = el.ctx;
    ctx.clearRect(0, 0, el.cw, el.ch);

    // as bolhas só existem dentro da água; o resto da esfera fica vazio
    var topo = el.ch * (1 - atual.nivel);

    for (var i = 0; i < bolhas.length; i++) {
      var b = bolhas[i];
      b.y -= b.v;
      if (b.y < 0) { bolhas[i] = novaBolha(1); continue; }

      var y = topo + (el.ch - topo) * b.y;
      var x = b.x * el.cw + Math.sin(t / 900 + b.f) * 5;
      if (y < topo) continue;

      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(190, 240, 255, ' + b.o.toFixed(3) + ')';
      ctx.fill();
    }
  }

  /* ------------------------------------------------------------
     Um único rAF para nível, inclinação e bolhas
     ------------------------------------------------------------ */
  function acordar() {
    if (loop || reduce.matches) return;
    loop = requestAnimationFrame(quadro);
  }

  function quadro(t) {
    loop = 0;

    // aproximação exponencial: chega rápido e desacelera sozinha
    atual.nivel += (alvo.nivel - atual.nivel) * 0.075;
    atual.incX += (alvo.incX - atual.incX) * 0.09;
    atual.incY += (alvo.incY - atual.incY) * 0.09;

    aplicarNivel();
    el.bola.style.setProperty('--rx', atual.incX.toFixed(2) + 'deg');
    el.bola.style.setProperty('--ry', atual.incY.toFixed(2) + 'deg');

    if (visivel) desenharBolhas(t);

    var parado = Math.abs(alvo.nivel - atual.nivel) < 0.0004 &&
                 Math.abs(alvo.incX - atual.incX) < 0.05 &&
                 Math.abs(alvo.incY - atual.incY) < 0.05;

    // as bolhas nunca param enquanto a seção estiver à vista
    if (!parado || visivel) loop = requestAnimationFrame(quadro);
  }

  function aplicarNivel() {
    // sem piso, 0,008% daria menos de 2px: a lâmina precisa caber junto
    // com a linha de superfície para continuar legível
    var h = Math.max(atual.nivel, 0.014);
    el.agua.style.height = (h * 100).toFixed(3) + '%';
  }

  return { init: init };
})();
