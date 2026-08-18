/* ============================================================
   CONFIG — DADOS PESQUISADOS E SUAS FONTES
   ============================================================

   REGRA DO PROJETO: nenhum número foi inventado. Todo valor aqui
   veio de uma companhia de saneamento ou de um órgão público, e
   guarda junto a instituição, o ano e o link.

   Onde ficam os outros dados:
     · ciclo da água ....... index.html (faixa da seção "O caminho de uma gota")
     · desperdício ......... js/waste.js (lista CARDS)
     · torneira/chuveiro ... aqui, em "vazoes" e "vazamentos"
     · disponibilidade ..... js/availability.js (lista ETAPAS, dados do USGS)
   ============================================================ */

window.AGUA = {

  /* ---------------------------------------------------------
     1) VAZÕES — laboratório da torneira/chuveiro e simulador
     A vazão real muda com pressão, modelo e abertura; estes são
     valores de referência das próprias companhias.
     --------------------------------------------------------- */
  vazoes: {
    chuveiro: {
      valor: 6, unidade: 'L/min',
      fonte: 'Caesb (2025)',
      detalhe: 'A Caesb indica de 3 a 6 L/min numa chuverada. A simulação usa 6 L/min, ' +
               'o mesmo valor que sustenta a conta da própria Caesb: 20 minutos de banho = 120 litros.',
      url: 'https://www.caesb.df.gov.br/dicas-importantes-da-caesb-para-um-consumo-de-agua-mais-consciente/'
    },
    torneira: {
      valor: 11, unidade: 'L/min',
      fonte: 'SAAE Salto (2024)',
      detalhe: 'O SAAE de Salto (SP) usa "a vazão normal de 11 litros por minuto" para a torneira. ' +
               'Outras companhias citam de 12 a 20 L/min conforme a pressão da rede.',
      url: 'https://saaesalto.sp.gov.br/2024/10/07/dicas-para-voce-economizar-agua-usando-bem-sempre-tem/'
    },
    mangueira: {
      valor: 18.6, unidade: 'L/min',
      fonte: 'Agência SP, com dados da Sabesp (2024)',
      detalhe: 'Derivado da referência publicada: 15 minutos de mangueira lavando a calçada = 279 litros, ' +
               'ou seja 18,6 L/min.',
      url: 'https://www.agenciasp.sp.gov.br/louca-banho-e-mangueira-veja-gestos-simples-que-economizam-centenas-de-litros-de-agua/'
    }
  },

  /* ---------------------------------------------------------
     2) VAZAMENTOS — cenários de gotejamento, em litros por dia
     --------------------------------------------------------- */
  vazamentos: {
    gota: {
      valor: 48, unidade: 'L/dia',
      rotulo: 'Gotejando',
      fonte: 'Caesb (2025)',
      detalhe: '"Uma torneira apenas gotejando desperdiça 48 litros por dia."',
      url: 'https://www.caesb.df.gov.br/dicas-importantes-da-caesb-para-um-consumo-de-agua-mais-consciente/'
    },
    filete: {
      valor: 180, unidade: 'L/dia',
      rotulo: 'Em filete',
      fonte: 'Caesb (2025)',
      detalhe: '"Se a água fluir em forma de filete, desperdiça de 180 a 750 litros por dia." ' +
               'A simulação usa o piso da faixa, 180 L/dia.',
      url: 'https://www.caesb.df.gov.br/dicas-importantes-da-caesb-para-um-consumo-de-agua-mais-consciente/'
    }
  },

  /* ---------------------------------------------------------
     3) MENSAGENS DO LABORATÓRIO (marcos em segundos simulados)
     --------------------------------------------------------- */
  mensagensTorneira: [
    { aos: 0,  texto: 'A água já começou a correr.' },
    { aos: 10, texto: 'Dez segundos. Parece pouco — mas é o tempo médio de muitas tarefas com a torneira aberta.' },
    { aos: 30, texto: 'Meio minuto: o tempo de ensaboar as mãos ou escovar os dentes sem fechar a torneira.' },
    { aos: 60, texto: 'Um minuto inteiro. Repetido várias vezes ao dia, todos os dias, o volume acumulado pesa.' },
    { aos: 300, texto: 'Cinco minutos correndo. É mais do que um banho inteiro no tempo recomendado.' },
    { aos: 900, texto: 'Quinze minutos. A esta altura já se foi mais água do que uma pessoa bebe em meses.' }
  ]
};
