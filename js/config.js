/* ============================================================
   CONFIG — ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR PARA OS DADOS
   ============================================================

   REGRA DO PROJETO: nenhum número foi inventado.
   Enquanto "valor" estiver como null, o site funciona em modo
   DEMONSTRATIVO (mostra proporções, não litros).

   Assim que a equipe pesquisar os dados em fontes confiáveis
   (ONU, ANA, UNESCO, SABESP, órgãos ambientais, material do
   professor), basta preencher "valor" e "fonte" abaixo — o site
   passa a exibir os litros automaticamente, sempre com a fonte.

   Exemplo de preenchimento:
     chuveiro: { valor: 12, unidade: 'L/min', fonte: 'ANA (2023)' }
   ============================================================ */

window.AGUA = {

  /* ---------------------------------------------------------
     1) VAZÕES — usadas na torneira interativa e no simulador
     --------------------------------------------------------- */
  vazoes: {
    chuveiro:  { valor: null, unidade: 'L/min', fonte: null },
    torneira:  { valor: null, unidade: 'L/min', fonte: null },
    mangueira: { valor: null, unidade: 'L/min', fonte: null }
  },

  /* ---------------------------------------------------------
     2) DADOS DOS CARDS DE DESPERDÍCIO
     A ordem segue a ordem dos cards na seção "Desperdício".
     Preencha "texto" com o dado pesquisado e "fonte" com a
     referência. Ex.: texto: 'até 135 L em um banho de 15 min'
     --------------------------------------------------------- */
  desperdicio: [
    { chave: 'banho',     texto: null, fonte: null },
    { chave: 'torneira',  texto: null, fonte: null },
    { chave: 'vazamento', texto: null, fonte: null },
    { chave: 'mangueira', texto: null, fonte: null },
    { chave: 'cozinha',   texto: null, fonte: null },
    { chave: 'externa',   texto: null, fonte: null }
  ],

  /* ---------------------------------------------------------
     3) DISPONIBILIDADE DE ÁGUA NO PLANETA
     Preencha as porcentagens pesquisadas. Se ficarem null, o
     site mostra apenas a redução visual, sem números.
     --------------------------------------------------------- */
  disponibilidade: {
    fonte: null,
    etapas: [
      { rotulo: 'Toda a água do planeta',            percentual: null },
      { rotulo: 'A maior parte é salgada',           percentual: null },
      { rotulo: 'Uma pequena parcela é doce',        percentual: null },
      { rotulo: 'A parcela acessível é ainda menor', percentual: null }
    ]
  },

  /* ---------------------------------------------------------
     4) CONTEÚDO DA CASA DO DESPERDÍCIO (texto livre, sem números)
     --------------------------------------------------------- */
  comodos: {
    banheiro: {
      titulo: 'Banheiro',
      texto: 'É onde a maior parte da água de uma residência costuma ser utilizada.',
      itens: [
        'Banhos longos consomem água tratada continuamente.',
        'Torneira aberta ao escovar os dentes ou fazer a barba.',
        'Vazamentos na descarga e nas conexões passam despercebidos.'
      ],
      solucao: 'Reduzir o tempo de banho e fechar a torneira ao ensaboar já muda o resultado do mês.'
    },
    cozinha: {
      titulo: 'Cozinha',
      texto: 'Pequenos ajustes na rotina reduzem bastante o consumo.',
      itens: [
        'Lavar a louça com a torneira aberta o tempo todo.',
        'Descongelar alimentos em água corrente.',
        'Enxaguar louça sem retirar os restos de comida antes.'
      ],
      solucao: 'Raspar a louça antes, ensaboar tudo com a torneira fechada e enxaguar de uma vez.'
    },
    lavanderia: {
      titulo: 'Lavanderia',
      texto: 'O uso pouco eficiente da máquina multiplica o consumo.',
      itens: [
        'Acionar a máquina de lavar com pouca roupa.',
        'Deixar a torneira do tanque aberta enquanto ensaboa.',
        'Descartar a água do enxágue que poderia ser reaproveitada.'
      ],
      solucao: 'Juntar roupa até completar a capacidade e reaproveitar a água do enxágue na limpeza.'
    },
    jardim: {
      titulo: 'Jardim',
      texto: 'A irrigação inadequada faz a água evaporar antes de ser aproveitada.',
      itens: [
        'Regar nos horários mais quentes do dia.',
        'Irrigar em excesso, além do que o solo consegue reter.',
        'Deixar de aproveitar a água da chuva para a rega.'
      ],
      solucao: 'Regar no início da manhã ou no fim da tarde e aproveitar a água da chuva armazenada.'
    },
    garagem: {
      titulo: 'Garagem',
      texto: 'A lavagem de veículos e calçadas é um ponto crítico de desperdício.',
      itens: [
        'Lavar o carro com mangueira ligada continuamente.',
        'Usar mangueira para varrer calçadas e quintais.',
        'Não utilizar balde, pano ou vassoura como alternativa.'
      ],
      solucao: 'Trocar a mangueira por balde e pano no carro, e por vassoura na calçada.'
    }
  },

  /* ---------------------------------------------------------
     5) MENSAGENS DA TORNEIRA INTERATIVA (marcos em segundos)
     --------------------------------------------------------- */
  mensagensTorneira: [
    { aos: 0,  texto: 'A torneira está aberta. A água já começou a correr.' },
    { aos: 10, texto: 'Dez segundos. Parece pouco — mas é o tempo médio de muitas tarefas com a torneira aberta.' },
    { aos: 30, texto: 'Meio minuto. Esse é o tempo de ensaboar as mãos ou escovar os dentes sem fechar a torneira.' },
    { aos: 60, texto: 'Um minuto inteiro. Repetido várias vezes ao dia, todos os dias, o volume acumulado é significativo.' },
    { aos: 120, texto: 'Dois minutos. Um vazamento faz exatamente isso — só que sem parar, 24 horas por dia.' }
  ]
};
