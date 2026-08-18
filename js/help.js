/* ============================================================
   COMO PODEMOS AJUDAR — a lâmpada e as seis atitudes
   · as atitudes vivem em ATITUDES; os cards das duas colunas
     e as linhas de conexão saem todos dessa lista
   · as linhas são desenhadas em pixels sobre o palco e
     recalculadas quando o layout muda (resize, card aberto)
   · só um card fica aberto por vez: assim as colunas nunca
     ficam com alturas muito diferentes
   ============================================================ */

window.AGUA_AJUDA = (function () {
  'use strict';

  var CAESB = {
    fonte: 'Caesb — Dicas de economia de água',
    url: 'https://www.caesb.df.gov.br/dicas-de-economia-de-agua/'
  };

  var ATITUDES = [
    {
      id: 'desperdicio', n: 1, lado: 'a', icone: 'i-faucet',
      titulo: 'Reduzir desperdícios',
      texto: 'Fechar a torneira enquanto ensaboa a louça, escova os dentes ou faz a barba. ' +
             'A água só precisa correr na hora de enxaguar.',
      img: 'assets/images/help/01-desperdicio.webp',
      alt: 'Torneira aberta com a água correndo em jato contínuo',
      valor: '240 L',
      dado: 'é o que uma lavagem de louça consome com a torneira aberta o tempo todo. ' +
            'Abrindo e fechando entre um utensílio e outro, o mesmo serviço sai por 70 L.',
      dica: 'Limpe os restos de comida a seco, com esponja ou papel, antes de molhar. ' +
            'O que resta sai com muito menos enxágue.',
      fonte: CAESB.fonte, url: CAESB.url
    },
    {
      id: 'vazamento', n: 2, lado: 'a', icone: 'i-wrench',
      titulo: 'Corrigir vazamentos',
      texto: 'Vazamento não faz barulho e nem sempre molha a parede — ele aparece na conta. ' +
             'Vale conferir de tempos em tempos, mesmo sem nenhum sinal aparente.',
      img: 'assets/images/help/02-vazamento.webp',
      alt: 'Gota de água prestes a se soltar do bico de uma torneira, em close',
      valor: '54 milhões',
      dado: 'de brasileiros poderiam ser abastecidos por um ano só com a água tratada que se ' +
            'perde antes de chegar às casas: 37,78% de tudo o que sai das estações.',
      dica: 'Feche todas as torneiras da casa e observe o hidrômetro por alguns minutos. ' +
            'Se os ponteiros continuarem girando, existe vazamento interno.',
      fonte: 'Instituto Trata Brasil e GO Associados — Estudo de Perdas de Água 2024 ' +
             '(dados do SNIS, ano-base 2022)',
      url: 'https://tratabrasil.org.br/wp-content/uploads/2024/06/Release-Perdas-de-Agua-2024.pdf'
    },
    {
      id: 'consciencia', n: 3, lado: 'a', icone: 'i-broom',
      titulo: 'Usar com consciência',
      texto: 'As tarefas de fora de casa são as que gastam mais de uma vez só. E quase sempre ' +
             'existe um jeito de fazer o mesmo serviço com muito menos água.',
      img: 'assets/images/help/03-consciencia.webp',
      alt: 'Jato de água em alta pressão lavando a lataria de um carro',
      valor: '120 L',
      dado: 'é o que se gasta para lavar a calçada com mangueira. A vassoura faz o mesmo ' +
            'trabalho antes, e sobra pouca coisa para a água terminar.',
      dica: 'Para o carro, troque a mangueira por balde e panos. Para as plantas, regue à noite: ' +
            'sem o sol, muito menos água se perde por evaporação.',
      fonte: CAESB.fonte, url: CAESB.url
    },
    {
      id: 'reuso', n: 4, lado: 'b', icone: 'i-recycle',
      titulo: 'Reutilizar quando possível',
      texto: 'Boa parte da água sai limpa da torneira e vai embora depois de um único uso. ' +
             'Só que muita coisa que fazemos em casa não precisa de água potável.',
      img: 'assets/images/help/04-reuso.webp',
      alt: 'Barril de madeira usado para guardar água, com torneira na base',
      valor: '7 a 10 L',
      dado: 'de água tratada descem pelo vaso a cada descarga — exatamente a mesma água que ' +
            'sai no copo.',
      dica: 'Deixe um balde sob o chuveiro enquanto a água esquenta e use essa água limpa na ' +
            'descarga. A do enxágue da máquina de lavar serve para o chão e a calçada.',
      fonte: CAESB.fonte, url: CAESB.url
    },
    {
      id: 'chuva', n: 5, lado: 'b', icone: 'i-roof',
      titulo: 'Aproveitar a água da chuva',
      texto: 'A chuva cai no telhado de qualquer jeito. Captada e guardada como manda a norma, ' +
             'ela dá conta dos usos que não exigem água potável.',
      img: 'assets/images/help/05-chuva.webp',
      alt: 'Reservatório de captação de água de chuva instalado ao lado de uma escola',
      valor: '1.761 mm',
      dado: 'de chuva por ano, na média do Brasil — de 500 mm no semiárido nordestino a mais de ' +
            '3.000 mm na Amazônia.',
      dica: 'A primeira água que desce lava a sujeira acumulada no telhado e precisa ser ' +
            'descartada. Só depois dela o reservatório começa a encher.',
      fonte: 'ANA — Conjuntura dos Recursos Hídricos no Brasil (média da série de 1961 a 2007)',
      url: 'https://www.gov.br/ana/pt-br/centrais-de-conteudos/publicacoes/conjuntura-dos-recursos-hidricos'
    },
    {
      id: 'pegada', n: 6, lado: 'b', icone: 'i-footprint',
      titulo: 'Conhecer a pegada hídrica',
      texto: 'A água que gastamos não é só a que sai da torneira. Ela está na comida, na roupa ' +
             'e em tudo o que precisou ser produzido antes de chegar até nós.',
      img: 'assets/images/help/06-pegada.webp',
      alt: 'Mostrador de um hidrômetro registrando o consumo de água',
      valor: '15.415 L',
      dado: 'de água por quilo de carne bovina, na média mundial. Cerca de 94% disso é água de ' +
            'chuva, absorvida pelo pasto e pelas lavouras que viram ração.',
      dica: 'Não se trata de deixar de consumir, e sim de saber o que cada escolha custou em ' +
            'água — e de não jogar fora o que já custou tanto para existir.',
      fonte: 'Mekonnen e Hoekstra (2012) — A Global Assessment of the Water Footprint of Farm ' +
             'Animal Products, Ecosystems 15:401–415',
      url: 'https://link.springer.com/article/10.1007/s10021-011-9517-8'
    }
  ];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var el = {};
  var cards = [];
  var aberto = null;   // id do card expandido, ou null
  var agendado = 0;

  function init() {
    var raiz = document.getElementById('preservacao');
    if (!raiz) return;

    el.raiz = raiz;
    el.palco = raiz.querySelector('[data-aj-palco]');
    el.linhas = raiz.querySelector('[data-aj-linhas]');
    el.lampada = raiz.querySelector('[data-aj-lampada]');
    if (!el.palco || !el.linhas || !el.lampada) return;

    el.colunas = {
      a: raiz.querySelector('[data-aj-coluna="a"]'),
      b: raiz.querySelector('[data-aj-coluna="b"]')
    };
    if (!el.colunas.a || !el.colunas.b) return;

    montarCards();
    ligarRedesenho();
    desenhar();
  }

  /* ------------------------------------------------------------
     Os seis cards, três em cada coluna
     ------------------------------------------------------------ */
  function montarCards() {
    ATITUDES.forEach(function (a, i) {
      // sem .reveal aqui: o observer de animations.js já rodou quando este
      // módulo monta os cards. A entrada vem do palco, com atraso por --i.
      var art = document.createElement('article');
      art.className = 'aj-card';
      art.setAttribute('data-atitude', a.id);
      art.setAttribute('data-lado', a.lado);
      art.style.setProperty('--i', i);

      var idDet = 'aj-det-' + a.id;
      var num = (a.n < 10 ? '0' : '') + a.n;

      art.innerHTML =
        '<button type="button" class="aj-btn" aria-expanded="false" aria-controls="' + idDet + '">' +
          '<span class="aj-media">' +
            '<img src="' + a.img + '" alt="' + a.alt + '" width="900" height="600" ' +
                 'loading="lazy" decoding="async">' +
            '<span class="aj-num">' + num + '</span>' +
          '</span>' +
          '<span class="aj-corpo">' +
            '<span class="aj-titulo">' +
              '<span class="aj-ico interactive-icon" aria-hidden="true">' +
                '<svg viewBox="0 0 24 24"><use href="#' + a.icone + '"/></svg></span>' +
              a.titulo +
            '</span>' +
            '<span class="aj-texto">' + a.texto + '</span>' +
            '<span class="aj-toggle"><span class="aj-toggle-txt">Ver o dado</span>' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron"/></svg></span>' +
          '</span>' +
        '</button>' +
        '<div class="aj-det" id="' + idDet + '" hidden>' +
          '<p class="aj-dado"><strong>' + a.valor + '</strong> ' + a.dado + '</p>' +
          '<p class="aj-dica"><span>Na prática:</span> ' + a.dica + '</p>' +
          '<p class="aj-fonte"><span>Fonte:</span> ' +
            '<a href="' + a.url + '" target="_blank" rel="noopener">' + a.fonte + '</a></p>' +
        '</div>';

      var btn = art.querySelector('.aj-btn');
      btn.addEventListener('click', function () { alternar(a.id); });
      btn.addEventListener('mouseenter', function () { acender(a.id, true); });
      btn.addEventListener('mouseleave', function () { acender(a.id, false); });
      btn.addEventListener('focus', function () { acender(a.id, true); });
      btn.addEventListener('blur', function () { acender(a.id, false); });

      el.colunas[a.lado].appendChild(art);
      cards.push({ dados: a, art: art, btn: btn, det: art.querySelector('.aj-det'), linha: null });
    });
  }

  /* ------------------------------------------------------------
     Abrir e fechar — sempre um de cada vez
     ------------------------------------------------------------ */
  function alternar(id) {
    aberto = (aberto === id) ? null : id;

    cards.forEach(function (c) {
      var on = c.dados.id === aberto;
      c.art.classList.toggle('is-open', on);
      c.btn.setAttribute('aria-expanded', String(on));
      c.det.hidden = !on;
      var txt = c.btn.querySelector('.aj-toggle-txt');
      if (txt) txt.textContent = on ? 'Fechar' : 'Ver o dado';
    });

    // a altura mudou: as linhas precisam acompanhar
    redesenhar();
  }

  /* o card em foco acende a própria linha e faz a lâmpada reagir */
  function acender(id, on) {
    cards.forEach(function (c) {
      if (c.dados.id !== id) return;
      c.art.classList.toggle('is-lit', on);
      if (c.linha) c.linha.classList.toggle('is-lit', on);
    });
    el.lampada.classList.toggle('is-reagindo', on);
  }

  /* ------------------------------------------------------------
     As linhas de conexão, em pixels sobre o palco
     ------------------------------------------------------------ */
  function desenhar() {
    var palco = el.palco.getBoundingClientRect();
    if (!palco.width || !palco.height) return;

    // quando as colunas empilham, o CSS esconde o SVG e não há o que desenhar.
    // quem decide é a folha de estilo, então não repetimos o breakpoint aqui.
    if (getComputedStyle(el.linhas).display === 'none') return;

    el.linhas.setAttribute('viewBox', '0 0 ' + Math.round(palco.width) + ' ' + Math.round(palco.height));

    var lamp = medir(el.lampada);
    var cx = lamp.x + lamp.w / 2;
    var cy = lamp.y + lamp.h / 2;
    var raio = Math.min(lamp.w, lamp.h) * 0.42;

    cards.forEach(function (c) {
      var r = medir(c.btn);
      var esq = c.dados.lado === 'a';
      var x1 = esq ? r.x + r.w : r.x;
      var y1 = r.y + r.h / 2;

      // o traço encosta na borda do bulbo, não no meio dele
      var dx = cx - x1, dy = cy - y1;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var x2 = cx - (dx / dist) * raio;
      var y2 = cy - (dy / dist) * raio;

      var mx = (x1 + x2) / 2;
      var d = 'M' + f(x1) + ',' + f(y1) + ' C' + f(mx) + ',' + f(y1) +
              ' ' + f(mx) + ',' + f(y2) + ' ' + f(x2) + ',' + f(y2);

      if (!c.linha) {
        c.linha = criarLinha(c.dados);
        el.linhas.appendChild(c.linha);
      }
      c.linha.querySelector('.aj-traco').setAttribute('d', d);
      c.linha.querySelector('.aj-pulso').setAttribute('d', d);
    });
  }

  function criarLinha(a) {
    var NS = 'http://www.w3.org/2000/svg';
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'aj-linha');
    g.setAttribute('data-atitude', a.id);

    var base = document.createElementNS(NS, 'path');
    base.setAttribute('class', 'aj-traco');
    g.appendChild(base);

    // o mesmo traçado, mas em pontilhado curto: vira o ponto de luz que caminha
    var pulso = document.createElementNS(NS, 'path');
    pulso.setAttribute('class', 'aj-pulso');
    pulso.setAttribute('pathLength', '100');   // dasharray em % do caminho
    pulso.style.setProperty('--i', a.n - 1);
    g.appendChild(pulso);

    return g;
  }

  function f(n) { return Math.round(n * 10) / 10; }

  /* Posição de layout dentro do palco, subindo pela cadeia de offsetParent.
     Diferente de getBoundingClientRect, isso ignora transform — e é o que
     queremos: a lâmpada flutua e o card sobe no hover, mas a linha continua
     ancorada no lugar de repouso, em vez de tremer junto. */
  function medir(node) {
    var x = 0, y = 0, e = node;
    while (e && e !== el.palco) {
      x += e.offsetLeft;
      y += e.offsetTop;
      e = e.offsetParent;
    }
    return { x: x, y: y, w: node.offsetWidth, h: node.offsetHeight };
  }

  /* redesenhar é caro: só uma vez por quadro */
  function redesenhar() {
    if (agendado) return;
    agendado = window.requestAnimationFrame(function () {
      agendado = 0;
      desenhar();
    });
  }

  function ligarRedesenho() {
    window.addEventListener('resize', redesenhar);

    if (window.ResizeObserver) {
      var ro = new ResizeObserver(redesenhar);
      ro.observe(el.palco);
    }

    // as imagens entram por lazy load e mudam a altura dos cards
    cards.forEach(function (c) {
      var img = c.art.querySelector('img');
      if (img && !img.complete) img.addEventListener('load', redesenhar);
    });

    // a entrada dos cards é animada: redesenha quando ela termina
    if (!reduce.matches) {
      el.palco.addEventListener('transitionend', function (ev) {
        if (ev.propertyName === 'transform') redesenhar();
      });
    }
  }

  return { init: init };
})();
