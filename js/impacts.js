/* ============================================================
   POLUIÇÃO E IMPACTOS
   · os seis impactos vivem em IMPACTOS; os cards e o conteúdo
     expandido são gerados a partir dessa lista
   · "Ver mais" abre dentro do próprio card, com altura animada
   · nenhum dado repete números já usados em outras seções
   ============================================================ */

window.AGUA_IMPACTOS = (function () {
  'use strict';

  var IMG = 'assets/images/impacts/';

  var IMPACTOS = [
    {
      id: 'ecossistemas', destaque: true, icone: 'i-fish', accent: 'cyan',
      titulo: 'Ecossistemas',
      imagem: IMG + 'ecossistemas.webp',
      alt: 'Rio serpenteando por um vale de mata fechada, com nuvens baixas sobre as montanhas.',
      resumo: 'Quando a qualidade da água muda, todo o equilíbrio do ambiente muda junto.',
      texto: 'Ambientes de água doce são sensíveis a qualquer alteração química. Uma mudança na ' +
             'quantidade de oxigênio, de nutrientes ou de matéria orgânica muda quem consegue viver ' +
             'ali — e isso se propaga por toda a cadeia alimentar do rio.',
      valor: '56%', unidade: '',
      dado: 'dos corpos d\'água monitorados no mundo foram classificados com boa qualidade ambiental. ' +
            'Quatro pontos a menos do que em 2020.',
      fonte: 'UN-Water e PNUMA — Progress on Ambient Water Quality (2024)',
      contexto: 'Indicador 6.3.2 dos Objetivos de Desenvolvimento Sustentável, com dados de 120 países.',
      url: 'https://www.unwater.org/publications/progress-ambient-water-quality-2024-update'
    },
    {
      id: 'abastecimento', icone: 'i-supply', accent: 'blue',
      titulo: 'Abastecimento',
      imagem: IMG + 'abastecimento.webp',
      alt: 'Represa de abastecimento de água cercada por mata.',
      resumo: 'Manancial poluído exige tratamento mais complexo e mais caro.',
      texto: 'A água que abastece as cidades sai de rios e represas. Quanto mais poluído o manancial, ' +
             'mais etapas e mais produtos o tratamento precisa para chegar ao padrão de potabilidade — ' +
             'e parte do esgoto que volta sem tratamento cai justamente nesses mananciais.',
      valor: '44%', unidade: '',
      dado: 'do esgoto doméstico gerado no mundo ainda não recebe tratamento seguro antes de voltar ao ambiente.',
      fonte: 'UN-Water — indicador ODS 6.3.1 (2024)',
      contexto: 'Dado global. O percentual brasileiro de coleta de esgoto aparece na seção do ciclo da água.',
      url: 'https://www.unwater.org/publications/progress-wastewater-treatment-2024-update'
    },
    {
      id: 'saude', icone: 'i-health', accent: 'ice',
      titulo: 'Saúde ambiental',
      imagem: IMG + 'saude.webp',
      alt: 'Rio urbano com espuma e resíduos acumulados nas margens.',
      resumo: 'Água contaminada e falta de saneamento adoecem — e matam.',
      texto: 'A relação entre qualidade da água e saúde é direta. Água imprópria, saneamento precário e ' +
             'falta de condições de higiene respondem por uma parcela grande das doenças diarreicas e ' +
             'de infecções que poderiam ser evitadas.',
      valor: '1,4 milhão', unidade: '',
      dado: 'de mortes por ano são atribuídas a água, saneamento e higiene inadequados. Só as doenças ' +
            'diarreicas respondem por mais de um milhão delas.',
      fonte: 'OMS — Burden of disease attributable to unsafe WASH (2023)',
      contexto: 'Estimativa referente a 2019, cobrindo 183 países. Quase 90% dessas mortes ocorrem em países de renda baixa e média-baixa.',
      url: 'https://www.who.int/publications/i/item/9789240075610'
    },
    {
      id: 'agricultura', icone: 'i-wheat', accent: 'green',
      titulo: 'Agricultura',
      imagem: IMG + 'agricultura.webp',
      alt: 'Pivô de irrigação girando sobre uma plantação de milho.',
      resumo: 'É o maior uso da água doce — e também uma fonte de contaminação.',
      texto: 'A irrigação com água contaminada leva poluentes para o solo e para o alimento. No caminho ' +
             'inverso, fertilizantes e defensivos arrastados pela chuva chegam aos rios e alimentam a ' +
             'proliferação de algas, que consome o oxigênio da água.',
      valor: '70%', unidade: '',
      dado: 'de toda a água doce retirada no mundo vai para a agricultura — de longe o maior uso.',
      fonte: 'FAO — AQUASTAT',
      contexto: 'Retirada de água (captação), não consumo. A participação varia muito entre países.',
      url: 'https://www.fao.org/aquastat/en/'
    },
    {
      id: 'biodiversidade', icone: 'i-bio', accent: 'green',
      titulo: 'Biodiversidade',
      imagem: IMG + 'biodiversidade.webp',
      alt: 'Peixe de água doce nadando sobre o leito de pedras de um rio.',
      resumo: 'A água doce é o ambiente que mais perdeu vida no último meio século.',
      texto: 'Espécies de água doce vivem em ambientes pequenos e conectados: quando um trecho de rio é ' +
             'poluído ou barrado, populações inteiras ficam isoladas. Poluição e perda de hábitat estão ' +
             'entre as principais pressões sobre esses animais.',
      valor: '85%', unidade: '',
      dado: 'foi a queda média das populações de espécies de água doce monitoradas entre 1970 e 2020 — ' +
            'a maior entre todos os ambientes.',
      fonte: 'WWF — Living Planet Report (2024)',
      contexto: 'O índice acompanha a variação média do tamanho das populações monitoradas, não o número de espécies extintas.',
      url: 'https://www.wwf.org.uk/sites/default/files/2024-10/living-planet-report-2024.pdf'
    },
    {
      id: 'producao', icone: 'i-gear', accent: 'cyan',
      titulo: 'Produção',
      imagem: IMG + 'producao.webp',
      alt: 'Efluente industrial escuro sendo despejado por galerias em um corpo d\'água.',
      resumo: 'A indústria depende da água — e devolve o que usou.',
      texto: 'Quase toda atividade produtiva usa água: para resfriar, lavar, diluir ou como matéria-prima. ' +
             'O que volta é efluente, e a qualidade desse retorno decide se o rio continua servindo para ' +
             'quem está mais abaixo.',
      valor: '38%', unidade: '',
      dado: 'das águas residuais industriais recebem tratamento seguro, entre os países que reportaram esse dado.',
      fonte: 'UN-Water — indicador ODS 6.3.1 (2024)',
      contexto: 'Base pequena: apenas 22 países reportaram o dado industrial, então o número não vale como média mundial.',
      url: 'https://www.unwater.org/publications/progress-wastewater-treatment-2024-update'
    }
  ];

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var el = {};

  function init() {
    var raiz = document.getElementById('impactos');
    if (!raiz) return;
    el.grade = raiz.querySelector('[data-impactos]');
    if (!el.grade) return;

    montar();
  }

  function montar() {
    var frag = document.createDocumentFragment();

    IMPACTOS.forEach(function (im, i) {
      var art = document.createElement('article');
      art.className = 'imp' + (im.destaque ? ' imp-destaque' : '');
      art.setAttribute('data-impacto', im.id);
      art.setAttribute('data-accent', im.accent);
      art.style.setProperty('--i', i);

      art.innerHTML =
        '<div class="imp-media">' +
          '<img src="' + im.imagem + '" alt="' + im.alt + '" loading="lazy" decoding="async">' +
          '<span class="imp-veu" aria-hidden="true"></span>' +
        '</div>' +
        '<div class="imp-corpo">' +
          '<span class="imp-ico interactive-icon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24"><use href="#' + im.icone + '"/></svg></span>' +
          '<h3 class="imp-titulo">' + im.titulo + '</h3>' +
          '<p class="imp-resumo">' + im.resumo + '</p>' +
          '<button type="button" class="imp-btn" aria-expanded="false" aria-controls="imp-mais-' + im.id + '">' +
            '<span>Ver mais</span>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron"/></svg>' +
          '</button>' +
          '<div class="imp-mais" id="imp-mais-' + im.id + '">' +
            '<div class="imp-mais-inner">' +
              '<p class="imp-texto">' + im.texto + '</p>' +
              '<p class="imp-dado"><strong>' + im.valor + '</strong> ' + im.dado + '</p>' +
              '<p class="imp-fonte"><span>Fonte:</span> ' + im.fonte + '. ' + im.contexto +
                ' <a href="' + im.url + '" target="_blank" rel="noopener">Saiba mais</a></p>' +
            '</div>' +
          '</div>' +
        '</div>';

      frag.appendChild(art);
    });

    el.grade.appendChild(frag);
    ligar();
  }

  /* ------------------------------------------------------------
     "Ver mais": altura animada de 0 até a altura real do conteúdo.
     Sem isso a abertura fica seca; com uma altura fixa, quebraria
     em telas estreitas — por isso a medida é feita na hora.
     ------------------------------------------------------------ */
  function ligar() {
    Array.prototype.forEach.call(el.grade.querySelectorAll('.imp'), function (art) {
      var btn = art.querySelector('.imp-btn');
      var painel = art.querySelector('.imp-mais');
      var rotulo = btn.querySelector('span');

      btn.addEventListener('click', function () {
        var aberto = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!aberto));
        art.classList.toggle('is-open', !aberto);
        rotulo.textContent = aberto ? 'Ver mais' : 'Ver menos';
        altura(painel, !aberto);
      });
    });

    // ao redimensionar, quem está aberto precisa remedir
    window.addEventListener('resize', function () {
      Array.prototype.forEach.call(el.grade.querySelectorAll('.imp.is-open .imp-mais'), function (p) {
        p.style.height = p.firstElementChild.offsetHeight + 'px';
      });
    });
  }

  function altura(painel, abrir) {
    var alvo = painel.firstElementChild.offsetHeight;

    if (reduce.matches) {
      painel.style.height = abrir ? 'auto' : '0px';
      return;
    }

    if (abrir) {
      painel.style.height = alvo + 'px';
      // depois da transição, "auto" deixa o conteúdo crescer sozinho
      painel.addEventListener('transitionend', function fim(e) {
        if (e.propertyName !== 'height') return;
        painel.style.height = 'auto';
        painel.removeEventListener('transitionend', fim);
      });
    } else {
      // de "auto" não há transição: fixa a altura atual antes de fechar
      painel.style.height = alvo + 'px';
      void painel.offsetHeight;
      painel.style.height = '0px';
    }
  }

  return { init: init };
})();
