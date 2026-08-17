/* ============================================================
   REUTILIZAÇÃO — o sistema de água de chuva da casa
   · as seis etapas vivem em ETAPAS; os pontos sobre a foto, a
     lista e o painel são gerados a partir dela
   · x/y são porcentagens da imagem (1536 × 1024), então os
     pontos acompanham qualquer largura de tela
   · a referência técnica é a ABNT NBR 15527:2019
   ============================================================ */

window.AGUA_REUSO = (function () {
  'use strict';

  var NBR = {
    fonte: 'ABNT NBR 15527:2019 — Aproveitamento de água de chuva de coberturas para fins não potáveis',
    url: 'https://www.abntcatalogo.com.br/norma.aspx?ID=422133'
  };

  var ETAPAS = [
    {
      id: 'captacao', n: 1, rotulo: 'Captação', icone: 'i-roof',
      x: 42, y: 12,
      titulo: 'A chuva encontra o telhado',
      texto: 'O telhado é a área de captação. Quanto maior a cobertura e mais intensa a chuva, ' +
             'maior o volume que chega ao sistema — descontadas as perdas por evaporação e pelo ' +
             'próprio escoamento.',
      valor: '100 L', selo: 'Conta direta',
      dado: 'é o que 1 mm de chuva rende em 100 m² de telhado, antes das perdas: 1 mm sobre 1 m² ' +
            'equivale a 1 litro.',
      contexto: 'O volume aproveitável sai dessa conta multiplicada pelo coeficiente de escoamento ' +
                'da cobertura, como prevê a norma.',
      fonte: NBR.fonte, url: NBR.url
    },
    {
      id: 'calhas', n: 2, rotulo: 'Calhas', icone: 'i-supply',
      x: 33, y: 42,
      titulo: 'As calhas conduzem a água',
      texto: 'Calhas e condutores levam a água do telhado até o sistema. É aqui que folhas, galhos ' +
             'e poeira entram junto — por isso o percurso precisa de grades e telas antes de qualquer ' +
             'armazenamento.',
      valor: 'Telas', selo: 'Antes do tanque',
      dado: 'e grades removem os sólidos grosseiros ainda no percurso, antes que cheguem ao reservatório.',
      contexto: 'Sem essa retenção, a matéria orgânica se acumula no fundo do tanque e piora a qualidade da água.',
      fonte: NBR.fonte, url: NBR.url
    },
    {
      id: 'filtro', n: 3, rotulo: 'Filtragem', icone: 'i-treatment',
      x: 48, y: 63,
      titulo: 'A primeira água é descartada',
      texto: 'A chuva que cai primeiro lava o telhado e carrega a sujeira acumulada. Essa parcela ' +
             'inicial é separada e descartada, e só depois a água segue para o reservatório.',
      valor: 'Escoamento inicial', selo: 'Descarte',
      dado: 'é o nome dessa primeira parcela. A norma exige que o sistema tenha um dispositivo para ' +
            'descartá-la.',
      contexto: 'É o passo que mais muda a qualidade final da água armazenada.',
      fonte: NBR.fonte, url: NBR.url
    },
    {
      id: 'reservatorio', n: 4, rotulo: 'Reservação', icone: 'i-tank',
      x: 32, y: 72,
      titulo: 'A água fica guardada no escuro',
      texto: 'O reservatório precisa ser fechado, protegido da luz e da entrada de animais. Luz e calor ' +
             'favorecem a proliferação de algas e micro-organismos; o escuro mantém a água estável por ' +
             'mais tempo.',
      valor: '4 parâmetros', selo: 'Controle',
      dado: 'de qualidade para uso não potável: Escherichia coli, turbidez, pH e cloro residual.',
      contexto: 'Os limites de cada um estão na norma, e variam conforme o uso pretendido.',
      fonte: NBR.fonte, url: NBR.url
    },
    {
      id: 'distribuicao', n: 5, rotulo: 'Distribuição', icone: 'i-faucet',
      x: 58, y: 66,
      titulo: 'Uma rede separada da potável',
      texto: 'A água de chuva sai do reservatório por uma tubulação própria, identificada e sem nenhuma ' +
             'ligação com a rede de água potável. A separação é o que impede que uma água contamine a outra.',
      valor: 'Sem conexão cruzada', selo: 'Regra',
      dado: 'entre as duas redes. Os pontos de uso não potável precisam ser sinalizados.',
      contexto: 'É a exigência de segurança mais importante do sistema — e a mais fácil de errar numa instalação improvisada.',
      fonte: NBR.fonte, url: NBR.url
    },
    {
      id: 'reuso', n: 6, rotulo: 'Reutilização', icone: 'i-garden',
      x: 58, y: 82,
      titulo: 'Onde essa água pode ser usada',
      texto: 'A água de chuva atende bem os usos que não exigem água potável. Cada litro usado assim é ' +
             'um litro de água tratada que fica disponível para beber, cozinhar e tomar banho.',
      valor: '7 usos', selo: 'Previstos na norma',
      dado: 'não potáveis: descarga sanitária, irrigação de gramados e plantas, lavagem de veículos, ' +
            'de calçadas, de ruas e de pátios, além de espelhos d\'água e usos industriais.',
      contexto: 'Beber, cozinhar e higiene pessoal ficam de fora: para esses usos a água precisa ser potável.',
      fonte: NBR.fonte, url: NBR.url
    }
  ];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var el = {};
  var ativo = 0;

  function init() {
    var raiz = document.getElementById('reutilizacao');
    if (!raiz) return;

    el.raiz = raiz;
    el.pontos = raiz.querySelector('[data-reuso-pontos]');
    el.trilha = raiz.querySelector('[data-reuso-trilha]');
    el.painel = raiz.querySelector('[data-reuso-painel]');
    if (!el.pontos || !el.painel || !el.trilha) return;

    el.num = raiz.querySelector('[data-reuso-num]');
    el.titulo = raiz.querySelector('[data-reuso-titulo]');
    el.texto = raiz.querySelector('[data-reuso-texto]');
    el.selo = raiz.querySelector('[data-reuso-selo]');
    el.valor = raiz.querySelector('[data-reuso-valor]');
    el.dado = raiz.querySelector('[data-reuso-dado]');
    el.contexto = raiz.querySelector('[data-reuso-contexto]');
    el.fonte = raiz.querySelector('[data-reuso-fonte]');

    montarPontos();
    montarTrilha();
    setEtapa(0, true);
  }

  /* ------------------------------------------------------------
     Pontos luminosos sobre a foto
     ------------------------------------------------------------ */
  function montarPontos() {
    var frag = document.createDocumentFragment();

    ETAPAS.forEach(function (e, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ru-ponto';
      b.style.left = e.x + '%';
      b.style.top = e.y + '%';
      b.style.setProperty('--i', i);
      b.setAttribute('data-etapa', e.id);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Etapa ' + e.n + ': ' + e.rotulo);
      b.innerHTML = '<span class="ru-ponto-dot" aria-hidden="true"></span>' +
                    '<span class="ru-ponto-nome">' + e.n + '. ' + e.rotulo + '</span>';
      b.addEventListener('click', function () { setEtapa(i); });
      frag.appendChild(b);
    });

    el.pontos.appendChild(frag);
    el.listaPontos = Array.prototype.slice.call(el.pontos.querySelectorAll('.ru-ponto'));
  }

  /* trilha embaixo da foto: o mesmo percurso, navegável e sem depender de hover */
  function montarTrilha() {
    var frag = document.createDocumentFragment();

    ETAPAS.forEach(function (e, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ru-passo';
      b.setAttribute('data-etapa', e.id);
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="ru-passo-ico interactive-icon" aria-hidden="true">' +
                      '<svg viewBox="0 0 24 24"><use href="#' + e.icone + '"/></svg></span>' +
                    '<span class="ru-passo-nome">' + e.rotulo + '</span>';

      b.addEventListener('click', function () { setEtapa(i); });
      b.addEventListener('keydown', function (ev) {
        var d = null;
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') d = (i + 1) % ETAPAS.length;
        if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') d = (i - 1 + ETAPAS.length) % ETAPAS.length;
        if (ev.key === 'Home') d = 0;
        if (ev.key === 'End') d = ETAPAS.length - 1;
        if (d === null) return;
        ev.preventDefault();
        setEtapa(d);
        el.listaPassos[d].focus();
      });

      // passar o mouse no passo acende o ponto correspondente na foto
      b.addEventListener('mouseenter', function () { realce(e.id, true); });
      b.addEventListener('mouseleave', function () { realce(e.id, false); });
      b.addEventListener('focus', function () { realce(e.id, true); });
      b.addEventListener('blur', function () { realce(e.id, false); });

      frag.appendChild(b);
    });

    el.trilha.appendChild(frag);
    el.listaPassos = Array.prototype.slice.call(el.trilha.querySelectorAll('.ru-passo'));
  }

  function realce(id, on) {
    el.listaPontos.forEach(function (p) {
      if (p.getAttribute('data-etapa') === id) p.classList.toggle('is-hover', on);
    });
  }

  /* ------------------------------------------------------------
     Estado único: a etapa selecionada
     ------------------------------------------------------------ */
  function setEtapa(i, inicial) {
    if (i < 0 || i >= ETAPAS.length) return;
    ativo = i;
    var e = ETAPAS[i];

    el.listaPontos.forEach(function (p, k) {
      p.classList.toggle('is-active', k === i);
      p.setAttribute('aria-pressed', String(k === i));
    });
    el.listaPassos.forEach(function (p, k) {
      p.classList.toggle('is-active', k === i);
      p.setAttribute('aria-pressed', String(k === i));
      p.tabIndex = k === i ? 0 : -1;
      // os passos já percorridos ficam acesos, dando a leitura do caminho
      p.classList.toggle('is-feito', k < i);
    });

    el.raiz.setAttribute('data-etapa-ativa', e.id);

    // troca de conteúdo com um respiro, em vez de trocar seco
    if (!inicial && !reduce.matches) {
      el.painel.classList.remove('is-fresh');
      void el.painel.offsetWidth;
      el.painel.classList.add('is-fresh');
    }

    if (el.num) el.num.textContent = (e.n < 10 ? '0' : '') + e.n;
    if (el.titulo) el.titulo.textContent = e.titulo;
    if (el.texto) el.texto.textContent = e.texto;
    if (el.selo) el.selo.textContent = e.selo;
    if (el.valor) el.valor.textContent = e.valor;
    if (el.dado) el.dado.textContent = e.dado;
    if (el.contexto) el.contexto.textContent = e.contexto;
    if (el.fonte) {
      el.fonte.innerHTML = '<span>Fonte:</span> ' + e.fonte +
        ' <a href="' + e.url + '" target="_blank" rel="noopener">Consultar a norma</a>';
    }
  }

  return { init: init };
})();
