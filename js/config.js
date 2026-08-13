/* ============================================================
   CONFIG — ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR PARA OS DADOS
   ============================================================

   REGRA DO PROJETO: nenhum número foi inventado.

   Os números do CICLO DA ÁGUA e do DESPERDÍCIO já foram pesquisados
   e ficam junto das suas fontes — no index.html e em js/waste.js.
   O que sobra aqui é o que ainda depende da equipe.
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
     2) DISPONIBILIDADE DE ÁGUA NO PLANETA
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
     3) MENSAGENS DA TORNEIRA INTERATIVA (marcos em segundos)
     --------------------------------------------------------- */
  mensagensTorneira: [
    { aos: 0,  texto: 'A torneira está aberta. A água já começou a correr.' },
    { aos: 10, texto: 'Dez segundos. Parece pouco — mas é o tempo médio de muitas tarefas com a torneira aberta.' },
    { aos: 30, texto: 'Meio minuto. Esse é o tempo de ensaboar as mãos ou escovar os dentes sem fechar a torneira.' },
    { aos: 60, texto: 'Um minuto inteiro. Repetido várias vezes ao dia, todos os dias, o volume acumulado é significativo.' },
    { aos: 120, texto: 'Dois minutos. Um vazamento faz exatamente isso — só que sem parar, 24 horas por dia.' }
  ]
};
