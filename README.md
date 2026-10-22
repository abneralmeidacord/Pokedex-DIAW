# Pokédex DIAW

Atividade 03 da disciplina de Desenvolvimento e Integração de Aplicações Web da PUC Minas: uma Pokédex desenvolvida com React, Vite e TypeScript.

## Estado do projeto

A etapa 01 prepara a organização, as variáveis de CSS, a tipografia e as configurações de desenvolvimento. A etapa 02 implementa a abertura estática da Home e a navegação entre início, catálogo e treinadores. O catálogo contém o container vazio para os cards da etapa 03, e treinadores possui a estrutura inicial.

- [Issue 01 — Setup](https://github.com/abneralmeidacord/Pokedex-DIAW/issues/1)
- [Planejamento em 12 entregas](https://github.com/users/abneralmeidacord/projects/5)
- [Protótipo no Figma](https://www.figma.com/design/H2jIAVXPU3I3Z3LqlvQHJ9/Pokedex?node-id=9-5)

## Requisitos

- Node.js compatível com as dependências do projeto. Ambiente usado na validação: Node.js 22.14.0 e npm 11.3.0.
- npm e acesso à internet para instalar as dependências pela primeira vez.

## Instalação e execução

Na pasta do projeto, instale as versões registradas no lockfile:

```sh
npm ci
```

Inicie o servidor de desenvolvimento:

```sh
npm run dev
```

Abra o endereço informado no terminal, normalmente `http://localhost:5173`. Se a porta estiver ocupada, o Vite informará outra porta.

## Verificações

```sh
npm run lint
npm run build
```

O build verifica os tipos com TypeScript e gera os arquivos de produção em `dist/`. Para conferir o resultado localmente após o build:

```sh
npm run preview
```

O endereço padrão do preview é `http://localhost:4173`.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `src/main.tsx` | Inicialização do React e importação dos estilos gerais |
| `index.html` | Metadados em português e carregamento das fontes |
| `src/App.tsx` | Navegação por hash, títulos por página e foco após troca de tela |
| `src/components/Header/` | Marca e espaço opcional para navegação, com props tipadas e CSS próprio |
| `src/components/Button/` | Botão reutilizável com variantes, ícone opcional e atributos nativos tipados |
| `src/pages/Home/` | Composição estática da Home e estilos exclusivos |
| `src/styles/variables.css` | Tokens compartilhados de cores, fontes, espaçamentos, raios e sombra |
| `src/styles/global.css` | Reset, tipografia semântica, mídia, formulários e foco visível |
| `src/assets/` | Arquivos importados pelo código |
| `public/` | Arquivos públicos servidos diretamente, como o favicon |

O JSON está em src/data/pokedex-data.json. Criar serviços e modelos dos dados nas próximas etapas, conforme necessário.

## Convenções de estilos e tipos

- Manter cada CSS específico junto ao seu componente: por exemplo, `Header.tsx` e `Header.css`.
- Importar esse CSS no próprio componente. Evitar estilos de componentes no arquivo global.
- Reutilizar os tokens de `variables.css`: `var(--color-ink)`, `var(--space-24)` e `var(--radius-16)`, por exemplo.
- Usar Outfit nos títulos, Inter na interface e `var(--font-mono)` nos IDs dos Pokémon. Elementos `code`, `pre`, `kbd` e `samp` também recebem Roboto Mono.
- As três fontes são carregadas pelo Google Fonts em `index.html`, com `display=swap`. Esse carregamento precisa de internet; se falhar, as fontes de sistema definidas nos tokens mantêm a leitura. Não há dependência npm adicional para as fontes.
- Preservar o foco visível e usar botões e links semânticos nas próximas telas.
- Manter o TypeScript em modo estrito e tipar os dados e as props sem recorrer a `any`.

## Dados e referências

As próximas etapas utilizarão o [JSON disponibilizado pelo professor](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json), preservando seus registros e relações. O catálogo não será limitado aos exemplos ilustrados no Figma.

Os valores base de cores, tipografia e espaçamento seguem o [catálogo no Figma](https://www.figma.com/design/H2jIAVXPU3I3Z3LqlvQHJ9/Pokedex?node-id=9-129). Fontes: [Outfit](https://fontsource.org/fonts/outfit), [Inter](https://fontsource.org/fonts/inter) e [Roboto Mono](https://fontsource.org/fonts/roboto-mono). As fontes das imagens de Pokémon e treinadores deverão ser documentadas quando esses arquivos forem adicionados.

## Abertura estática e navegação — etapa 02

- Rotas: `#inicio`, `#catalogo` e `#treinadores`, sem nova dependência. A marca retorna ao início; links de navegação identificam a página atual com `aria-current`.
- Button aceita props nativas tipadas, `variant` e `endIcon`. Com `href`, renderiza um link; para ações, um botão com `type="button"` por padrão.
- Home aceita `catalogHref`. Abrir Pokédex e o dispositivo abrem imediatamente o catálogo.
- Home e Header preservam a composição personalizada do projeto, com sombra no Header e sem os itens numerados ou o link Entrar sem animação. O dispositivo exibe apenas `public/assets/imgs/pokedex-closed.png`, sem trocar a imagem no hover ou foco. A imagem `pokedex-open.png` permanece disponível para a etapa de animações.
- O limite da integração impediu consultar os demais frames. Catálogo e treinadores têm apenas a estrutura inicial desta etapa. O grid vazio do catálogo está preparado para a etapa 03.
- CSS por componente, hover, foco visível, link Pular para o conteúdo, título por rota e foco no conteúdo ao navegar. Histórico, links diretos e recarregamento funcionam.
- O JSON em `src/data/pokedex-data.json` foi preservado.

Validação realizada: build, lint, navegação com mouse e Tab/Enter, foco, voltar/avançar, links diretos e abertura imediata. Conferidas larguras de 320 a 1440 px, carregamento das imagens do dispositivo e ausência de erros no console do build de produção.

O commit será feito manualmente pelo desenvolvedor após sua validação:

```sh
git commit -m "feat: cria componentes base e abertura estatica da Pokedex"
```
