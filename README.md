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
├─ assets/images/          fotos dos tipos de água (azul, verde, cinza)
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
   ├─ timeline.js          gota no scroll + etapas clicáveis
   ├─ water-cards.js       expansão dos cards (tipos de água e "está em tudo")
   ├─ faucet.js            torneira interativa
   ├─ waste-house.js       casa do desperdício
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

### 4. Dados numéricos → `js/config.js`

> **Nenhum número foi inventado neste projeto.** Enquanto os campos estiverem
> `null`, o site funciona em modo demonstrativo: mostra proporções, animações e
> comparações, mas **não exibe litros nem porcentagens**.

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

**Cards de desperdício** (na mesma ordem em que aparecem na seção):

```js
desperdicio: [
  { chave: 'banho', texto: 'até 135 L em um banho de 15 minutos', fonte: 'SABESP' },
  ...
]
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

### 5. Textos da casa do desperdício → `js/config.js`

Objeto `comodos` — banheiro, cozinha, lavanderia, jardim e garagem.

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
| Timeline do ciclo | *O caminho de uma gota* | gota percorre as 9 etapas no scroll; clicar destaca a etapa e revela um detalhe |
| Torneira interativa | *A torneira aberta* | hover inclina e move o reflexo; clique gira o registro, abre o jato, gotas e ondas; fechar afina o jato até a última gota |
| Casa do desperdício | *A casa do desperdício* | passar o mouse acende o cômodo (chuveiro pinga, máquina gira, planta balança); clicar abre um painel junto ao ponto |
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
- Ícones e ilustrações em SVG inline; as únicas imagens são as três dos
  tipos de água, com `loading="lazy"` (carregam só quando você chega nelas)
- Partículas em canvas com densidade limitada, pausadas fora da tela e com a aba oculta
- Scroll usando `requestAnimationFrame` e `IntersectionObserver`
