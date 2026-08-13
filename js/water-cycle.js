/* ============================================================
   CICLO DA ÁGUA — "O caminho de uma gota"
   · as nove etapas vivem em ETAPAS; a timeline, o percurso e o
     painel são gerados a partir dessa lista (nada é duplicado no HTML)
   · a etapa ativa é o único estado: só muda por interação explícita
     (clique, teclado, percurso, anterior/próximo ou reprodução).
     O scroll NÃO mexe na timeline — ele só faz o parallax da paisagem.
   ============================================================ */

window.AGUA_CICLO = (function () {
  'use strict';

  var IMG = 'assets/images/water-cycle/stages/';

  var ETAPAS = [
    {
      n: 1, titulo: 'Nuvem', icone: 'i-cloud', ico: 'nuvem',
      imagem: IMG + 'cloud.webp',
      alt: 'Nuvens cumulus se formando contra o céu azul.',
      curta: 'Evapora e condensa, formando as nuvens.',
      texto: 'A água evapora de oceanos, rios, lagos e do solo, e as plantas devolvem vapor pela ' +
             'transpiração. Ao subir, esse vapor encontra ar mais frio, condensa em torno de partículas ' +
             'suspensas na atmosfera e forma as gotículas que compõem as nuvens.',
      fatos: [
        ['Processo', 'Evaporação e transpiração — em conjunto, evapotranspiração'],
        ['Energia', 'É o calor do Sol que movimenta esta etapa']
      ]
    },
    {
      n: 2, titulo: 'Chuva', icone: 'i-rain', ico: 'chuva',
      imagem: IMG + 'rain.webp',
      alt: 'Chuva caindo sobre uma superfície de água, formando ondas.',
      curta: 'Retorna à superfície como precipitação.',
      texto: 'Dentro da nuvem, as gotículas crescem ao se juntarem umas às outras. Quando ficam pesadas ' +
             'demais para permanecer suspensas, caem em forma de precipitação — chuva, neve ou granizo, ' +
             'conforme a temperatura ao longo da queda.',
      fatos: [
        ['Formas', 'Chuva, neve, granizo e orvalho'],
        ['Importância', 'É a etapa que renova a água doce disponível nos continentes']
      ]
    },
    {
      n: 3, titulo: 'Rio', icone: 'i-river', ico: 'rio',
      imagem: IMG + 'river.webp',
      alt: 'Córrego de água corrente descendo entre pedras cobertas de musgo.',
      curta: 'Escoa pelo terreno e alimenta os rios.',
      texto: 'Parte da água que chega ao solo escoa pela superfície até córregos, rios e lagos. Outra parte ' +
             'infiltra e recarrega os aquíferos, que voltam a alimentar os rios lentamente nos períodos ' +
             'sem chuva.',
      fatos: [
        ['Dois caminhos', 'Escoamento superficial e infiltração no solo'],
        ['Atenção', 'Solo impermeabilizado infiltra menos e agrava as enchentes']
      ]
    },
    {
      n: 4, titulo: 'Captação', icone: 'i-intake', ico: 'captacao',
      imagem: IMG + 'capture.webp',
      alt: 'Torre de captação de água em um reservatório.',
      curta: 'É retirada do manancial.',
      texto: 'A água destinada ao abastecimento é retirada de mananciais — rios, represas ou poços — por ' +
             'estruturas de captação, e segue por adutoras até a estação de tratamento.',
      fatos: [
        ['Mananciais', 'Superficiais (rios e represas) ou subterrâneos (poços)'],
        ['Qualidade', 'Quanto mais preservado o manancial, mais simples e barato o tratamento']
      ]
    },
    {
      n: 5, titulo: 'Tratamento', icone: 'i-treatment', ico: 'tratamento',
      imagem: IMG + 'water-treatment.webp',
      alt: 'Tanques de decantação de uma estação de tratamento de água.',
      curta: 'Fica potável na estação de tratamento.',
      texto: 'Na estação de tratamento de água, o processo costuma passar por coagulação, floculação, ' +
             'decantação, filtração e desinfecção, até que a água atenda ao padrão de potabilidade exigido ' +
             'para o consumo humano.',
      fatos: [
        ['Etapas', 'Coagulação, floculação, decantação, filtração e desinfecção'],
        ['Padrão', 'No Brasil, a potabilidade segue a Portaria GM/MS nº 888/2021']
      ]
    },
    {
      n: 6, titulo: 'Casa', icone: 'i-home', ico: 'casa',
      imagem: IMG + 'home.webp',
      alt: 'Água corrente saindo de uma torneira de pia.',
      curta: 'Chega às torneiras e é usada no dia a dia.',
      texto: 'Depois de tratada, a água passa por reservatórios e pela rede de distribuição até chegar às ' +
             'torneiras. Em casa, ela é usada para beber, cozinhar, na higiene pessoal e na limpeza.',
      fatos: [
        ['Detalhe', 'Toda a água que chega pela rede é potável — inclusive a da descarga'],
        ['Escolha', 'É nesta etapa que o consumo consciente faz diferença']
      ]
    },
    {
      n: 7, titulo: 'Esgoto', icone: 'i-sewer', ico: 'esgoto',
      imagem: IMG + 'sewage.webp',
      alt: 'Tubulação de rede coletora de esgoto assentada em vala.',
      curta: 'Vira esgoto e segue pela rede coletora.',
      texto: 'Depois do uso, a água se transforma em esgoto e segue pela rede coletora até a estação de ' +
             'tratamento. Onde não existe rede, o esgoto vai para soluções individuais, como fossas — ou é ' +
             'lançado sem tratamento em rios e córregos.',
      fatos: [
        ['Sem rede', 'Usam-se fossas sépticas, nem sempre construídas de forma adequada'],
        ['Impacto', 'O esgoto sem tratamento é a principal fonte de poluição dos rios urbanos']
      ]
    },
    {
      n: 8, titulo: 'Tratamento', icone: 'i-treatment', ico: 'tratamento',
      imagem: IMG + 'sewage-treatment.webp',
      alt: 'Tanques circulares de uma estação de tratamento de esgoto vistos de cima.',
      curta: 'Passa pela estação de tratamento de esgoto.',
      texto: 'Na estação de tratamento de esgoto, o efluente passa por etapas preliminares, primárias e ' +
             'biológicas que removem sólidos, matéria orgânica e parte dos nutrientes antes de a água ser ' +
             'devolvida ao ambiente.',
      fatos: [
        ['Etapas', 'Preliminar, primária e secundária (biológica)'],
        ['Objetivo', 'Reduzir a carga orgânica para o rio conseguir se recuperar']
      ]
    },
    {
      n: 9, titulo: 'Retorno', icone: 'i-leaf', ico: 'retorno',
      imagem: IMG + 'return.webp',
      alt: 'Rio corrente cercado por vegetação densa.',
      curta: 'Volta ao ambiente e o ciclo recomeça.',
      texto: 'Tratada, a água é devolvida a um corpo receptor — rio, lago ou mar. Dali ela volta a evaporar ' +
             'e o ciclo recomeça. O ciclo nunca para: o que muda é a qualidade da água que devolvemos a ele.',
      fatos: [
        ['Destino', 'O corpo receptor: um rio, um lago ou o oceano'],
        ['Ciclo', 'A água não acaba — mas pode ficar imprópria para uso']
      ]
    }
  ];

  var INTERVALO = 3000;   // reprodução automática (item entre 2,5s e 3,5s)

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var el = {};
  var atual = 0;               // índice da etapa ativa — o único estado da seção
  var tocando = null;
  var camadaAtiva = 0;

  function dois(n) { return n < 10 ? '0' + n : String(n); }

  /* ------------------------------------------------------------
     Início
     ------------------------------------------------------------ */
  function init() {
    var raiz = document.getElementById('ciclo');
    if (!raiz) return;

    el.raiz = raiz;
    el.cena = raiz.querySelector('[data-cycle-scene]');
    el.foto = raiz.querySelector('[data-cycle-photo]');
    el.gota = raiz.querySelector('[data-cycle-drop]');
    el.lista = raiz.querySelector('[data-cycle-steps]');
    el.trilho = raiz.querySelector('[data-cycle-track]');
    el.viajante = raiz.querySelector('[data-cycle-travel]');
    el.percurso = raiz.querySelector('[data-cycle-dots]');
    el.painel = raiz.querySelector('#ciclo-painel');
    el.figura = raiz.querySelector('[data-cycle-figure]');
    el.numero = raiz.querySelector('[data-cycle-step]');
    el.titulo = raiz.querySelector('[data-cycle-title]');
    el.texto = raiz.querySelector('[data-cycle-text]');
    el.fatos = raiz.querySelector('[data-cycle-facts]');
    el.anterior = raiz.querySelector('[data-cycle-prev]');
    el.proximo = raiz.querySelector('[data-cycle-next]');
    el.play = raiz.querySelector('[data-cycle-play]');

    if (!el.lista || !el.figura) return;

    montarEtapas();
    montarPercurso();
    montarCamadas();
    ligarControles();
    ligarCena();
    ligarRevelacao();

    selecionar(0, true);
  }

  /* ------------------------------------------------------------
     Montagem da timeline a partir de ETAPAS
     ------------------------------------------------------------ */
  function montarEtapas() {
    var frag = document.createDocumentFragment();

    ETAPAS.forEach(function (etapa, i) {
      var li = document.createElement('li');
      li.className = 'ct-step';
      li.setAttribute('role', 'presentation');
      li.setAttribute('data-ico', etapa.ico);
      li.style.setProperty('--i', i);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ct-btn';
      btn.id = 'ct-etapa-' + etapa.n;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('aria-controls', 'ciclo-painel');
      btn.tabIndex = -1;
      btn.innerHTML =
        '<span class="ct-num">' + dois(etapa.n) + '</span>' +
        '<span class="ct-ico interactive-icon">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + etapa.icone + '"/></svg>' +
        '</span>' +
        '<span class="ct-nome">' + etapa.titulo + '</span>';

      var desc = document.createElement('p');
      desc.className = 'ct-curta';
      desc.textContent = etapa.curta;

      li.appendChild(btn);
      li.appendChild(desc);
      frag.appendChild(li);
    });

    el.lista.appendChild(frag);
    el.botoes = Array.prototype.slice.call(el.lista.querySelectorAll('.ct-btn'));
    el.passos = Array.prototype.slice.call(el.lista.querySelectorAll('.ct-step'));
  }

  function montarPercurso() {
    if (!el.percurso) return;
    var frag = document.createDocumentFragment();

    ETAPAS.forEach(function (etapa, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ct-dot';
      b.textContent = dois(etapa.n);
      b.setAttribute('aria-label', 'Etapa ' + etapa.n + ' — ' + etapa.titulo);
      b.addEventListener('click', function () { pausar(); selecionar(i); });
      frag.appendChild(b);
    });

    el.percurso.appendChild(frag);
    el.pontos = Array.prototype.slice.call(el.percurso.querySelectorAll('.ct-dot'));
  }

  /* duas camadas de imagem para o cruzamento suave entre etapas */
  function montarCamadas() {
    el.camadas = [];
    for (var i = 0; i < 2; i++) {
      var img = document.createElement('img');
      img.className = 'ct-foto';
      img.decoding = 'async';
      img.loading = 'lazy';
      img.alt = '';
      el.figura.appendChild(img);
      el.camadas.push(img);
    }
  }

  /* ------------------------------------------------------------
     Seleção de etapa
     ------------------------------------------------------------ */
  function selecionar(i, inicial) {
    if (i < 0 || i >= ETAPAS.length) return;
    atual = i;
    var etapa = ETAPAS[i];

    el.passos.forEach(function (passo, k) {
      passo.classList.toggle('is-active', k === i);
      var btn = el.botoes[k];
      btn.setAttribute('aria-selected', String(k === i));
      btn.tabIndex = k === i ? 0 : -1;
    });

    if (el.pontos) {
      el.pontos.forEach(function (ponto, k) {
        ponto.classList.toggle('is-active', k === i);
        if (k === i) ponto.setAttribute('aria-current', 'true');
        else ponto.removeAttribute('aria-current');
      });
    }

    // o painel é rotulado pela aba ativa, como manda o padrão de tablist
    if (el.painel) el.painel.setAttribute('aria-labelledby', el.botoes[i].id);

    if (el.numero) el.numero.textContent = 'Etapa ' + dois(etapa.n);
    if (el.titulo) el.titulo.textContent = etapa.titulo;
    if (el.texto) el.texto.textContent = etapa.texto;

    if (el.fatos) {
      el.fatos.innerHTML = '';
      etapa.fatos.forEach(function (par) {
        var li = document.createElement('li');
        var dt = document.createElement('strong');
        dt.textContent = par[0];
        var dd = document.createElement('span');
        dd.textContent = par[1];
        li.appendChild(dt);
        li.appendChild(dd);
        el.fatos.appendChild(li);
      });
    }

    trocarImagem(etapa, inicial);

    if (el.anterior) el.anterior.disabled = i === 0;
    if (el.proximo) el.proximo.disabled = i === ETAPAS.length - 1;

    // a linha e a gota sempre acompanham a etapa ativa — nada mais as move
    progresso(i / (ETAPAS.length - 1), i + 1);

    precarregar(i + 1);
    precarregar(i - 1);
  }

  function trocarImagem(etapa, inicial) {
    if (!el.camadas) return;
    var proxima = el.camadas[(camadaAtiva + 1) % 2];
    var anterior = el.camadas[camadaAtiva];

    function aplicar() {
      proxima.classList.add('is-on');
      anterior.classList.remove('is-on');
      camadaAtiva = (camadaAtiva + 1) % 2;
      el.figura.classList.remove('is-loading');
    }

    if (proxima.getAttribute('src') === etapa.imagem) { aplicar(); return; }

    el.figura.classList.add('is-loading');
    proxima.alt = etapa.alt;
    proxima.src = etapa.imagem;

    if (inicial) proxima.loading = 'eager';

    if (proxima.complete) aplicar();
    else {
      proxima.onload = aplicar;
      proxima.onerror = aplicar;   // um arquivo faltando não pode travar o painel
    }
  }

  function precarregar(i) {
    if (i < 0 || i >= ETAPAS.length) return;
    var img = new Image();
    img.src = ETAPAS[i].imagem;
  }

  /* ------------------------------------------------------------
     Linha de progresso e gota que viaja
     ------------------------------------------------------------ */
  function progresso(p, acesas) {
    p = Math.min(Math.max(p, 0), 1);
    if (el.trilho) {
      el.trilho.style.setProperty('--ct-p', p.toFixed(4));
      el.trilho.style.setProperty('--ct-w', el.trilho.clientWidth + 'px');
    }
    el.passos.forEach(function (passo, k) {
      passo.classList.toggle('is-reached', k < acesas);
    });
  }

  /* O scroll só cuida da paisagem (parallax e luz). A etapa ativa, a linha e
     a gota não dependem dele — mudam apenas em selecionar(). */
  function ligarCena() {
    var pendente = false;

    function medir() {
      cenaNoScroll();
      pendente = false;
    }

    window.addEventListener('scroll', function () {
      if (!pendente) { window.requestAnimationFrame(medir); pendente = true; }
    }, { passive: true });

    // o trilho muda de largura ao redimensionar: a gota precisa reposicionar
    window.addEventListener('resize', function () {
      progresso(atual / (ETAPAS.length - 1), atual + 1);
      medir();
    });

    medir();
  }

  /* parallax discreto e leve ganho de luz conforme a seção é percorrida */
  function cenaNoScroll() {
    if (reduce.matches || !el.cena) return;
    var r = el.cena.getBoundingClientRect();
    var vh = window.innerHeight;
    if (r.bottom < -200 || r.top > vh + 200) return;

    var centro = (r.top + r.height / 2 - vh / 2) / vh;   // -1 .. 1
    var visivel = Math.min(Math.max(1 - Math.abs(centro), 0), 1);

    if (el.foto) {
      el.foto.style.setProperty('--ct-shift', (centro * -14).toFixed(1) + 'px');
      el.foto.style.setProperty('--ct-zoom', (1.06 - visivel * 0.06).toFixed(3));
      el.foto.style.setProperty('--ct-luz', (0.82 + visivel * 0.18).toFixed(3));
    }
    if (el.gota) el.gota.style.setProperty('--ct-shift', (centro * -26).toFixed(1) + 'px');
  }

  /* ------------------------------------------------------------
     Controles: clique, teclado, anterior/próximo e reprodução
     ------------------------------------------------------------ */
  function ligarControles() {
    el.botoes.forEach(function (btn, i) {
      btn.addEventListener('click', function () { pausar(); selecionar(i); });
      btn.addEventListener('keydown', function (e) {
        var destino = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = (i + 1) % ETAPAS.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') destino = (i - 1 + ETAPAS.length) % ETAPAS.length;
        if (e.key === 'Home') destino = 0;
        if (e.key === 'End') destino = ETAPAS.length - 1;
        if (destino === null) return;
        e.preventDefault();
        pausar();
        selecionar(destino);
        el.botoes[destino].focus();
      });
    });

    if (el.anterior) el.anterior.addEventListener('click', function () {
      pausar(); selecionar(atual - 1);
    });
    if (el.proximo) el.proximo.addEventListener('click', function () {
      pausar(); selecionar(atual + 1);
    });
    if (el.play) el.play.addEventListener('click', function () {
      tocando ? pausar() : reproduzir();
    });
  }

  function reproduzir() {
    if (atual === ETAPAS.length - 1) selecionar(0);
    rotular(true);

    tocando = window.setInterval(function () {
      if (atual >= ETAPAS.length - 1) { pausar(); return; }
      selecionar(atual + 1);
    }, INTERVALO);
  }

  function pausar() {
    if (!tocando) return;
    window.clearInterval(tocando);
    tocando = null;
    rotular(false);
  }

  function rotular(ativo) {
    if (!el.play) return;
    el.play.classList.toggle('is-playing', ativo);
    el.play.setAttribute('aria-pressed', String(ativo));
    var texto = el.play.querySelector('[data-cycle-play-label]');
    if (texto) texto.textContent = ativo ? 'Pausar' : 'Reproduzir percurso';
  }

  /* ------------------------------------------------------------
     Entrada da seção: a cena aparece por partes
     ------------------------------------------------------------ */
  function ligarRevelacao() {
    if (!el.cena) return;

    if (!('IntersectionObserver' in window) || reduce.matches) {
      el.cena.classList.add('is-in');
      return;
    }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        el.cena.classList.add('is-in');
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.16 });
    obs.observe(el.cena);

    // com a seção ainda a caminho, já busca as duas primeiras imagens
    var perto = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      precarregar(0);
      precarregar(1);
      perto.disconnect();
    }, { rootMargin: '500px 0px' });
    perto.observe(el.raiz);
  }

  return { init: init };
})();
