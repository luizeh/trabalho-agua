/* ============================================================
   DESPERDÍCIO DE ÁGUA — a casa e os hábitos
   · PONTOS (áreas da casa) e CARDS (hábitos) são a única fonte
     de dados; a interface toda é gerada a partir deles
   · setAtivo(id) é o único caminho para mudar de estado: ele
     acerta card, hotspot, detalhe, projeção e fonte de uma vez
   · nada aqui depende de scroll
   ============================================================ */

window.AGUA_WASTE = (function () {
  'use strict';

  /* Áreas marcadas sobre a foto. x/y são porcentagens da imagem
     (1600 × 1000), então acompanham qualquer tamanho de tela. */
  var PONTOS = [
    { id: 'banheiro',   rotulo: 'Banheiro',    x: 30, y: 43 },
    { id: 'cozinha',    rotulo: 'Cozinha',     x: 60, y: 64 },
    { id: 'lavanderia', rotulo: 'Lavanderia',  x: 70, y: 67 },
    { id: 'externa',    rotulo: 'Área externa', x: 83, y: 67 },
    { id: 'jardim',     rotulo: 'Jardim',      x: 16, y: 86 }
  ];

  /* Todos os números vêm das fontes citadas em "fonte". Nenhum foi estimado.
     "vezesPorDia" existe só para deixar a premissa da projeção explícita. */
  var CARDS = [
    {
      id: 'banho', ponto: 'banheiro', icone: 'i-shower',
      titulo: 'Banho demorado',
      resumo: 'Cada minuto a mais no chuveiro se soma direto ao volume do banho.',
      valor: 120, unidade: 'L', contexto: 'em um banho de 20 minutos',
      premissa: 'A Caesb considera um chuveiro de 3 a 6 litros por minuto — a vazão muda conforme o modelo e a pressão.',
      vezesPorDia: 1, premissaProjecao: 'um banho por dia',
      comparacao: { piorRotulo: 'Banho de 20 min', pior: 120, melhorRotulo: 'Banho de 5 min', melhor: 30 },
      dica: 'Reduzir o banho de 20 para 5 minutos economiza cerca de 90 litros por banho.',
      fonte: {
        org: 'Caesb — Companhia de Saneamento Ambiental do Distrito Federal',
        titulo: 'Dicas de economia de água',
        detalhe: 'Banho de 20 minutos: 120 L. Banho de 5 minutos (ideal): 30 L.',
        url: 'https://www.caesb.df.gov.br/dicas-de-economia-de-agua/'
      }
    },
    {
      id: 'torneira', ponto: 'banheiro', icone: 'i-faucet',
      titulo: 'Torneira aberta',
      resumo: 'Deixar a água correndo enquanto escova os dentes gasta quase tudo à toa.',
      valor: 18, unidade: 'L', contexto: 'a cada escovação com a torneira aberta',
      premissa: 'Valor por escovação, comparado ao mesmo hábito abrindo e fechando a torneira.',
      vezesPorDia: 1, premissaProjecao: 'uma escovação por dia',
      comparacao: { piorRotulo: 'Torneira aberta', pior: 18, melhorRotulo: 'Abrindo e fechando', melhor: 2 },
      dica: 'Fechar a torneira enquanto escova economiza 16 litros a cada vez.',
      fonte: {
        org: 'Caesb — Companhia de Saneamento Ambiental do Distrito Federal',
        titulo: 'Dicas de economia de água',
        detalhe: 'Escovar os dentes com a torneira aberta: 18 L. Abrindo e fechando: 2 L.',
        url: 'https://www.caesb.df.gov.br/dicas-de-economia-de-agua/'
      }
    },
    {
      id: 'vazamento', ponto: 'lavanderia', icone: 'i-leak',
      titulo: 'Vazamentos',
      resumo: 'Um vazamento não tem pausa: escorre nos dois turnos e no fim de semana.',
      valor: 46, unidade: 'L', contexto: 'por dia em uma torneira mal fechada',
      premissa: 'Vazamento contínuo, sem interrupção — por isso a projeção é direta.',
      vezesPorDia: 1, premissaProjecao: 'vazamento contínuo',
      extra: 'Com uma abertura de 1 mm, o fiozinho de água chega a 2.068 litros em 24 horas.',
      dica: 'Feche bem os registros e observe o hidrômetro com tudo fechado: se girar, há vazamento.',
      fonte: {
        org: 'WWF-Brasil, com base no Idec',
        titulo: 'Economize água na sua casa',
        detalhe: 'Torneira mal fechada: 46 L em um dia. Abertura de 1 mm: 2.068 L em 24 horas.',
        url: 'https://www.wwf.org.br/?4080/'
      }
    },
    {
      id: 'mangueira', ponto: 'externa', icone: 'i-hose',
      titulo: 'Mangueira',
      resumo: 'Lavar calçada e carro com mangueira usa água tratada em tarefa que dispensa.',
      valor: 120, unidade: 'L', contexto: 'de água tratada para lavar a calçada',
      premissa: 'Volume por lavagem de calçada com mangueira, segundo a Caesb.',
      vezesPorDia: 1, premissaProjecao: 'uma lavagem por dia',
      dica: 'Vassoura na calçada e balde no carro trocam esse volume por quase nada.',
      fonte: {
        org: 'Caesb — Companhia de Saneamento Ambiental do Distrito Federal',
        titulo: 'Dicas de economia de água',
        detalhe: 'Lavar a calçada com mangueira: 120 L de água tratada.',
        url: 'https://www.caesb.df.gov.br/dicas-de-economia-de-agua/'
      }
    },
    {
      id: 'cozinha', ponto: 'cozinha', icone: 'i-kitchen',
      titulo: 'Na cozinha',
      resumo: 'Lavar a louça com a torneira correndo é o maior gasto isolado da casa.',
      valor: 240, unidade: 'L', contexto: 'lavando a louça com a torneira correndo',
      premissa: 'Comparado à mesma louça lavada abrindo e fechando a torneira.',
      vezesPorDia: 1, premissaProjecao: 'uma louça por dia',
      comparacao: { piorRotulo: 'Torneira correndo', pior: 240, melhorRotulo: 'Abrindo e fechando', melhor: 70 },
      dica: 'Raspe os restos, ensaboe tudo com a torneira fechada e enxágue de uma vez: 170 litros a menos.',
      fonte: {
        org: 'Caesb — Companhia de Saneamento Ambiental do Distrito Federal',
        titulo: 'Dicas de economia de água',
        detalhe: 'Louça com a torneira correndo: 240 L. Abrindo e fechando: 70 L.',
        url: 'https://www.caesb.df.gov.br/dicas-de-economia-de-agua/'
      }
    },
    {
      id: 'externas', ponto: 'jardim', icone: 'i-garden',
      titulo: 'Áreas externas',
      resumo: 'Regar no calor do meio-dia manda boa parte da água embora por evaporação.',
      valor: 186, unidade: 'L', contexto: 'regando o jardim por 10 minutos',
      premissa: 'Volume por rega de 10 minutos; a economia depende do método e do horário.',
      vezesPorDia: 1, premissaProjecao: 'uma rega por dia',
      dica: 'Regar no início da manhã ou no fim da tarde evapora menos — dá para economizar 96 litros.',
      fonte: {
        org: 'WWF-Brasil, com base no Idec',
        titulo: 'Economize água na sua casa',
        detalhe: 'Regar jardins e plantas por 10 minutos: 186 L, com economia possível de 96 L.',
        url: 'https://www.wwf.org.br/?4080/'
      }
    }
  ];

  var el = {};
  var ativo = null;

  function fmt(n) {
    return n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  }

  /* ------------------------------------------------------------
     Início
     ------------------------------------------------------------ */
  function init() {
    var raiz = document.getElementById('desperdicio');
    if (!raiz) return;

    el.raiz = raiz;
    el.mapa = raiz.querySelector('[data-waste-spots]');
    el.grade = raiz.querySelector('[data-waste-cards]');
    el.legenda = raiz.querySelector('[data-waste-legend]');
    if (!el.mapa || !el.grade) return;

    montarPontos();
    montarCards();
    setAtivo('banho');   // estado inicial visível, como pede o plano
  }

  /* ------------------------------------------------------------
     Hotspots sobre a foto
     ------------------------------------------------------------ */
  function montarPontos() {
    var frag = document.createDocumentFragment();

    PONTOS.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wh-spot';
      b.style.left = p.x + '%';
      b.style.top = p.y + '%';
      b.setAttribute('data-ponto', p.id);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Ver o desperdício no ambiente: ' + p.rotulo);
      b.innerHTML = '<span class="wh-spot-dot" aria-hidden="true"></span>' +
                    '<span class="wh-spot-nome">' + p.rotulo + '</span>';

      b.addEventListener('click', function () {
        // um ambiente pode ter mais de um hábito: abre o primeiro dele
        var card = CARDS.filter(function (c) { return c.ponto === p.id; })[0];
        if (card) setAtivo(card.id);
      });

      frag.appendChild(b);
    });

    el.mapa.appendChild(frag);
    el.pontos = Array.prototype.slice.call(el.mapa.querySelectorAll('.wh-spot'));
  }

  /* ------------------------------------------------------------
     Cards dos hábitos
     ------------------------------------------------------------ */
  function montarCards() {
    var frag = document.createDocumentFragment();

    CARDS.forEach(function (c, i) {
      var art = document.createElement('article');
      art.className = 'wc';
      art.setAttribute('data-card', c.id);
      art.style.setProperty('--i', i);

      var cab = document.createElement('button');
      cab.type = 'button';
      cab.className = 'wc-head';
      cab.setAttribute('aria-expanded', 'false');
      cab.setAttribute('aria-controls', 'wc-mais-' + c.id);
      cab.innerHTML =
        '<span class="wc-ico interactive-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24"><use href="#' + c.icone + '"/></svg></span>' +
        '<span class="wc-titulo">' + c.titulo + '</span>' +
        '<span class="wc-resumo">' + c.resumo + '</span>' +
        '<span class="wc-valor"><strong>' + fmt(c.valor) + '</strong>' +
          '<span class="wc-unidade">' + c.unidade + '</span>' +
          '<span class="wc-contexto">' + c.contexto + '</span></span>';

      cab.addEventListener('click', function () { setAtivo(c.id); });
      cab.addEventListener('mouseenter', function () { realce(c.ponto, true); });
      cab.addEventListener('mouseleave', function () { realce(c.ponto, false); });
      cab.addEventListener('focus', function () { realce(c.ponto, true); });
      cab.addEventListener('blur', function () { realce(c.ponto, false); });

      var mais = document.createElement('div');
      mais.className = 'wc-mais';
      mais.id = 'wc-mais-' + c.id;
      mais.hidden = true;
      mais.appendChild(detalhe(c));

      art.appendChild(cab);
      art.appendChild(mais);
      frag.appendChild(art);
    });

    el.grade.appendChild(frag);
    el.cards = Array.prototype.slice.call(el.grade.querySelectorAll('.wc'));
  }

  /* Conteúdo expandido: comparação, projeção, dica e fonte */
  function detalhe(c) {
    var box = document.createElement('div');
    box.className = 'wc-box';
    var html = '';

    if (c.comparacao) {
      var cp = c.comparacao;
      var pct = Math.round((cp.melhor / cp.pior) * 100);
      html += '<div class="wc-comp">' +
        '<div class="wc-comp-linha">' +
          '<span class="wc-comp-rot">' + cp.piorRotulo + '</span>' +
          '<span class="wc-comp-barra"><i style="width:100%"></i></span>' +
          '<span class="wc-comp-num">' + fmt(cp.pior) + ' L</span>' +
        '</div>' +
        '<div class="wc-comp-linha is-bom">' +
          '<span class="wc-comp-rot">' + cp.melhorRotulo + '</span>' +
          '<span class="wc-comp-barra"><i style="width:' + pct + '%"></i></span>' +
          '<span class="wc-comp-num">' + fmt(cp.melhor) + ' L</span>' +
        '</div>' +
        '<p class="wc-comp-eco">Diferença: <strong>' + fmt(cp.pior - cp.melhor) + ' L</strong> a cada vez.</p>' +
      '</div>';
    }

    // projeção calculada a partir do valor da fonte — nada fixo no código
    var dia = c.valor * (c.vezesPorDia || 1);
    html += '<div class="wc-proj">' +
      '<p class="wc-proj-premissa">Repetindo <strong>' + c.premissaProjecao + '</strong>:</p>' +
      '<ul class="wc-proj-lista">' +
        '<li><span>1 dia</span><strong>' + fmt(dia) + ' L</strong></li>' +
        '<li><span>30 dias</span><strong>' + fmt(dia * 30) + ' L</strong></li>' +
        '<li><span>1 ano</span><strong>' + fmt(dia * 365) + ' L</strong></li>' +
      '</ul></div>';

    if (c.extra) html += '<p class="wc-extra">' + c.extra + '</p>';
    html += '<p class="wc-dica"><span aria-hidden="true">→</span> ' + c.dica + '</p>';
    html += '<p class="wc-premissa">' + c.premissa + '</p>';
    html += '<p class="wc-fonte"><strong>Fonte:</strong> ' + c.fonte.org +
            ' — <em>' + c.fonte.titulo + '</em>. ' + c.fonte.detalhe +
            ' <a href="' + c.fonte.url + '" target="_blank" rel="noopener">ver a página</a></p>';

    box.innerHTML = html;
    return box;
  }

  /* ------------------------------------------------------------
     Estado único: um card ativo, com o ambiente correspondente
     ------------------------------------------------------------ */
  function setAtivo(id) {
    var card = CARDS.filter(function (c) { return c.id === id; })[0];
    if (!card) return;
    ativo = id;

    el.cards.forEach(function (art) {
      var on = art.getAttribute('data-card') === id;
      art.classList.toggle('is-active', on);
      var cab = art.querySelector('.wc-head');
      var mais = art.querySelector('.wc-mais');
      cab.setAttribute('aria-expanded', String(on));
      mais.hidden = !on;
    });

    el.pontos.forEach(function (b) {
      var on = b.getAttribute('data-ponto') === card.ponto;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    if (el.legenda) {
      var ponto = PONTOS.filter(function (p) { return p.id === card.ponto; })[0];
      el.legenda.textContent = ponto ? ponto.rotulo + ' — ' + card.titulo : card.titulo;
    }
  }

  /* realce temporário (hover/foco no card acende o ponto na foto) */
  function realce(pontoId, on) {
    if (!el.pontos) return;
    el.pontos.forEach(function (b) {
      if (b.getAttribute('data-ponto') !== pontoId) return;
      b.classList.toggle('is-hover', on);
    });
  }

  return { init: init };
})();
