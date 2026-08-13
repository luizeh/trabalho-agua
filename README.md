# ÁGUA — Cada gota conta

Site interativo para trabalho escolar sobre água: importância, tipos, ciclo,
desperdício, poluição, reutilização e preservação.

Site estático — **não precisa instalar nada**. Basta abrir `index.html` no navegador.

---

## Como abrir

**Opção 1 — direto:** dê duplo clique em `index.html`.

**Opção 2 — servidor local (recomendado para apresentar):**
extensão *Live Server* do VS Code → botão direito em `index.html` → *Open with Live Server*.

---

## Estrutura

```
trabalho-agua/
├─ index.html              página completa (HTML semântico + ícones SVG)
├─ assets/images/          fotos: tipos de água, ciclo da água e a casa do desperdício
├─ css/
│  ├─ global.css           cores, tipografia, layout base
│  ├─ components.css       header, hero, cards, timeline, simulador...
│  ├─ animations.css       animações, modo sem água, reduced-motion
│  ├─ interactions.css     microinterações e classes reutilizáveis
│  └─ responsive.css       desktop, tablet, celular e impressão
└─ js/
   ├─ config.js            ★ DADOS PESQUISADOS E NOMES — edite aqui
   ├─ navigation.js        header, menu mobile, seção ativa, scroll suave
   ├─ animations.js        reveal por scroll, parallax, partículas, abas
   ├─ svg-interactions.js  parallax local, ripple, toque, draw-svg
   ├─ water-link.js        gota central e ligações de "a água está em tudo"
   ├─ water-types.js       blocos, imagens e caminhos de "tipos de água"
   ├─ water-cycle.js       ciclo da água: etapas, painel, percurso e reprodução
   ├─ water-cards.js       expansão dos cards (tipos de água e "está em tudo")
   ├─ waste.js             desperdício: casa com hotspots, cards e projeções
   ├─ faucet.js            torneira interativa
   ├─ simulator.js         simulador de consumo
   ├─ availability.js      esfera de disponibilidade de água
   ├─ water-mode.js        modo "como seria sem água?"
   └─ main.js              inicializa tudo
```

### Como as animações são organizadas

O JavaScript **só adiciona e remove classes**; as animações ficam no CSS.
Classes reutilizáveis em `interactions.css`: `.interactive-icon`, `.glow-hover`,
`.click-feedback`, `.ripple-host`, `.reveal-drop`, `.reveal-grow`, `.reveal-slide`,
`.reveal-scale`, `.draw-svg`. Estados: `.is-open`, `.is-selected`, `.is-active`,
`.is-lit`, `.is-visible`, `.is-touched`, `.is-closing`, `.is-reached`.

Como `<use>` cria shadow DOM, seletores externos não alcançam as partes internas
dos ícones. A ponte são **custom properties** (`--ico-play`, `--ico-glow`,
`--ico-rot`, `--ico-x/y`, `--ico-scale`), que atravessam por herança: os cards as
definem no hover e o `<style>` dentro do sprite SVG as consome.

---

## O que você precisa editar

### 1. Nomes dos integrantes → `index.html`

Procure por `EDITE AQUI OS NOMES DOS INTEGRANTES` (perto do fim do arquivo) e
troque os textos da lista:

```html
<li>Nome do integrante 1</li>
```

### 2. Fontes da pesquisa → `index.html`

Logo abaixo, na coluna **Fontes**. Coloque apenas fontes realmente consultadas:

```html
<li><a href="https://..." target="_blank" rel="noopener">ANA — título do material</a></li>
```

### 3. Imagens dos tipos de água → `assets/images/`

A seção **Tipos de Água** usa três fotos, uma por bloco:

```
assets/images/
├─ azul.png     01 Água Azul    (cachoeira, rio e lago)
├─ verde.png    02 Água Verde   (árvore em campo úmido)
└─ cinza.png    03 Água Cinza   (casa com tubulações de reúso)
```

Para trocar uma delas, substitua o arquivo mantendo o mesmo nome — o site
usa a nova imagem sem precisar de nenhuma alteração no código.

Cada moldura tem um formato diferente, então cada foto é recortada de um
jeito. Isso é controlado por `--foco` em `css/components.css`:

| Bloco | Moldura | O que aparece | `--foco` |
|---|---|---|---|
| Azul | retrato, à esquerda, altura toda | terço esquerdo: a cachoeira e o rio | `left center` |
| Verde | deitada, à direita, no topo | a copa e a árvore inteira | `40% top` |
| Cinza | deitada, à direita, no topo | o corte da casa, sem a cidade | `left top` |

Se a foto nova tiver outro enquadramento, ajuste o `--foco` correspondente
(mesmos valores de `object-position`: horizontal e depois vertical).
Mais detalhes em `assets/images/LEIA-ME.txt`.

Se um arquivo faltar, o bloco mostra um espaço reservado com o nome
esperado em vez de uma imagem quebrada.

### 3b. Imagens do ciclo da água → `assets/images/water-cycle/`

**Estas já estão prontas — você não precisa mexer.** Ficam assim:

```
assets/images/water-cycle/
├─ cycle-landscape.webp     paisagem ao fundo da seção (2000×1120)
├─ cycle-river.webp         cartão "Um ciclo essencial" (1000×700)
└─ stages/                  uma foto por etapa (1280×800)
   ├─ cloud.webp  rain.webp  river.webp  capture.webp
   ├─ water-treatment.webp  home.webp  sewage.webp
   └─ sewage-treatment.webp  return.webp
```

Todas são fotografias reais, de bancos com **licença livre** (Wikimedia Commons
e Flickr, em CC BY, CC BY-SA ou CC0), recortadas e convertidas para WebP.
Nenhuma tem marca d'água, texto ou logotipo.

> **Os créditos são obrigatórios.** As licenças CC BY e CC BY-SA exigem citar o
> autor. A lista completa já está no rodapé do site, em *Créditos das
> fotografias*. Se trocar alguma foto, atualize o crédito correspondente.

Para trocar uma foto, substitua o arquivo mantendo o mesmo nome e a mesma
proporção (16:10 nas etapas). Os caminhos ficam em `js/water-cycle.js`, na
lista `ETAPAS`.

### 3c. Textos e etapas do ciclo → `js/water-cycle.js`

As nove etapas **não estão repetidas no HTML**: a timeline, os números do
percurso e o painel são gerados a partir da lista `ETAPAS`, no começo do
arquivo. Cada etapa tem:

```js
{
  n: 4, titulo: 'Captação', icone: 'i-intake', ico: 'captacao',
  imagem: IMG + 'capture.webp',
  alt: '...',            // descrição da foto para leitores de tela
  curta: '...',          // frase curta embaixo do círculo
  texto: '...',          // parágrafo do painel
  fatos: [ ['Rótulo', 'valor'], ... ]
}
```

Para corrigir um texto, edite ali — a interface toda acompanha.

### 3d. Imagem da casa → `assets/images/waste/waste-house.webp`

Foto real (1600×1000, 16:10) de uma casa modernista, com licença livre.
**A proporção 16:10 importa:** as posições dos pontos luminosos são
porcentagens da imagem, definidas em `js/waste.js`. Se trocar a foto por
outra de proporção diferente, os pontos saem do lugar — ajuste o `x`/`y`
de `PONTOS` no mesmo arquivo.

### 4. Dados numéricos → `js/config.js`

> **Nenhum número foi inventado neste projeto.** Enquanto os campos estiverem
> `null`, o site funciona em modo demonstrativo: mostra proporções, animações e
> comparações, mas **não exibe litros nem porcentagens**.

> **Exceção já resolvida:** os três dados da faixa final do *ciclo da água*
> (2,5% · 2,1 bilhões · 44,8%) foram pesquisados e estão no HTML, cada um com
> instituição, publicação, ano e link no botão **fonte**. Eles não dependem de
> `js/config.js`.

Assim que a equipe pesquisar os dados, preencha em `js/config.js` — o site passa
a exibir os valores automaticamente, **sempre junto da fonte**.

**Vazões** (usadas na torneira interativa e no simulador):

```js
vazoes: {
  chuveiro:  { valor: 12, unidade: 'L/min', fonte: 'ANA (2023)' },
  torneira:  { valor: null, unidade: 'L/min', fonte: null },
  mangueira: { valor: null, unidade: 'L/min', fonte: null }
}
```

**Disponibilidade de água no planeta:**

```js
disponibilidade: {
  fonte: 'UNESCO — WWDR',
  etapas: [
    { rotulo: 'Toda a água do planeta', percentual: 100 },
    ...
  ]
}
```

Onde buscar: **ONU**, **ANA (Agência Nacional de Águas)**, **UNESCO**,
companhias de saneamento, órgãos ambientais e o material fornecido pelo professor.

### 5. Dados do desperdício → `js/waste.js`

Os seis hábitos e os cinco pontos da casa ficam em `PONTOS` e `CARDS`, no
começo do arquivo. Cada card já traz o número pesquisado, a premissa do
cálculo e a fonte com link — **não há nada a preencher**. As projeções de
30 dias e 1 ano são calculadas a partir do valor da fonte, nunca fixas.

Fontes usadas: **Caesb** (banho, torneira, louça, calçada) e **WWF-Brasil,
com base no Idec** (vazamento e rega).

### 6. Definição de "água cinza"

A seção **Tipos de Água** traz **as duas definições corretas** em abas, porque o
termo muda de sentido conforme o conteúdo estudado:

- **Pegada hídrica** — volume de água necessário para diluir a carga de poluentes.
- **Águas residuais domésticas** — águas de pias, chuveiros e máquinas de lavar
  (sem os efluentes de vaso sanitário).

Se o professor usa apenas uma delas, remova a aba que não se aplica em `index.html`
(bloco `<div class="tabs" data-tabs>`).

---

## Recursos interativos

| Recurso | Onde | O que faz |
|---|---|---|
| Menu com seção ativa | topo | destaca automaticamente a seção visível |
| Logo | header | reflexo percorre a gota no hover |
| Cards | várias seções | sobem no hover e o **ícone reage** (coração pulsa, folha inclina, fábrica acende, luz da casa acende) |
| Gota central | *A água está em tudo* | três linhas saem da gota até Vida, Indústria e Cotidiano; passar o mouse na gota acende as três, passar em um card acende só a ligação dele e recua as outras |
| Ambientes | *A água está em tudo* | cada card traz uma cena própria que reage ao hover: a árvore balança e a luz do peito pulsa, as janelas da fábrica acendem e o vapor sobe, a casa acende e o tambor da máquina gira |
| Caminho da água | *Tipos de Água* | passar o mouse destaca a etapa e recua as outras; clicar mostra o que acontece nela |
| Ver o percurso | *Tipos de Água* | na Água Verde, o botão acende as seis etapas uma por vez |
| Onde ela está? | *Tipos de Água* | na Água Azul, abre a explicação de rios, lagos, reservatórios e aquíferos |
| Duas definições | *Tipos de Água* | na Água Cinza, as abas trocam o texto, as informações **e** o caminho da água |
| "Ver mais" | *A água está em tudo* | abre um parágrafo extra dentro do próprio card, sem modal |
| Ciclo da água | *O caminho de uma gota* | paisagem real ao fundo, gota central flutuando e uma linha que avança com o scroll; clicar (ou usar as setas) escolhe a etapa e troca a foto e o texto do painel |
| Percurso da gota | *O caminho de uma gota* | os números 01–09, os botões anterior/próximo e **Reproduzir percurso** navegam pelas nove etapas |
| Torneira interativa | *A torneira aberta* | hover inclina e move o reflexo; clique gira o registro, abre o jato, gotas e ondas; fechar afina o jato até a última gota |
| Casa do desperdício | *Desperdício de Água* | foto real com cinco pontos luminosos; clicar em um ponto abre o hábito correspondente, e passar o mouse num card acende o ponto na casa |
| Hábitos e projeções | *Desperdício de Água* | cada card abre com a comparação, o volume em 1 dia / 30 dias / 1 ano (calculado) e a fonte do número |
| Simulador | *Como nossos hábitos...* | 3 sliders; a caixa d'água esvazia, muda de cor e as bolhas somem |
| Esfera de disponibilidade | *Quanta água temos?* | diminui progressivamente no scroll |
| Modo sem água | header e rodapé | remove cor, brilho e movimento da página |
| Voltar ao topo | canto inferior | aparece após a primeira tela |

No celular, tudo que depende de hover tem equivalente por toque
(`@media (hover: none)` + classe `.is-touched`).

Não há quiz, pontuação, ranking, login nem cadastro.

---

## Acessibilidade

- HTML semântico (`header`, `nav`, `main`, `section`, `footer`)
- Link "pular para o conteúdo", `aria-label` nos botões e `role` nas abas
- Navegação completa por teclado, incluindo as abas, a timeline e os pontos da casa
- `:focus-visible` sempre visível
- `prefers-reduced-motion`: desliga partículas, parallax e animações complexas

## Performance

- Sem bibliotecas externas — apenas HTML, CSS e JavaScript
- Ícones e ilustrações em SVG inline; as fotos (três dos tipos de água e onze
  do ciclo) usam WebP com `loading="lazy"` — 46 KB a 397 KB cada
- A seção do ciclo pré-carrega a imagem da etapa seguinte, para a troca não piscar
- Partículas em canvas com densidade limitada, pausadas fora da tela e com a aba oculta
- Scroll usando `requestAnimationFrame` e `IntersectionObserver`
