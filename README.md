# Pokédex — DIAW

Aplicação web desenvolvida como Atividade 03 da disciplina de **Desenvolvimento e Integração de Aplicações Web**, do curso de Engenharia de Software da **PUC Minas**.

O projeto permite explorar os **151 Pokémon** presentes no conjunto de dados, consultar seus atributos e conhecer os **12 treinadores** e suas respectivas equipes.

## Aplicação publicada

Acesse a Pokédex: [pokedex-diaw.vercel.app](https://pokedex-diaw.vercel.app/)

## Integrantes

- [Abner Almeida](https://github.com/abneralmeidacord)
- [Guilherme Miranda Presot](https://github.com/gpresot)

## Funcionalidades

- Abertura animada da Pokédex, com opção de pular a animação.
- Catálogo com pesquisa por nome ou ID, filtro por tipo e ordenação por ID.
- Limpeza de filtros e mensagens para pesquisas sem resultados.
- Modal de consulta rápida com tipos e atributos base.
- Ficha do Pokémon com atributos e navegação para o anterior e o próximo.
- Consulta dos treinadores associados a um Pokémon.
- Listagem de treinadores com pesquisa por nome, insígnias e prévia da equipe.
- Página da equipe de cada treinador, com links para as fichas dos integrantes.
- Mensagens para Pokémon e treinadores não encontrados.
- Layouts adaptáveis para celular, tablet e desktop.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React e React DOM | Componentes, estado e renderização da interface |
| TypeScript | Tipagem dos dados, serviços e componentes |
| Vite | Servidor de desenvolvimento e build de produção |
| Motion | Animação de abertura da Pokédex |
| CSS | Estilos por componente, layouts responsivos e variáveis compartilhadas |
| ESLint | Análise estática do código |

As versões das dependências estão registradas em `package.json` e `package-lock.json`.

## Instalação e execução

### Requisitos

- Node.js **22.12 ou superior**; recomenda-se Node.js 24 LTS.
- npm.
- Git, caso o projeto seja obtido por clonagem.
- Internet para instalar as dependências e carregar os recursos externos.

### Passo a passo

```bash
git clone https://github.com/abneralmeidacord/Pokedex-DIAW.git
cd Pokedex-DIAW
npm ci
npm run dev
```

Se o projeto foi baixado em ZIP, extraia-o e abra o terminal na pasta que contém `package.json`. Depois execute `npm ci` e `npm run dev`.

Acesse a URL informada no terminal, normalmente **http://localhost:5173**. Caso a porta esteja ocupada, utilize a porta indicada pelo Vite.

Não é necessário configurar `.env`, banco de dados, chave de API ou servidor backend.

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm ci` | Instala as dependências conforme o lockfile |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run lint` | Executa a análise estática com ESLint |
| `npm run build` | Verifica os tipos com TypeScript e gera o build em `dist/` |
| `npm run preview` | Serve o build localmente para conferência |

Para conferir a versão de produção:

```bash
npm run lint
npm run build
npm run preview
```

O preview normalmente fica disponível em **http://localhost:4173**. Para hospedagem estática, publique o conteúdo da pasta `dist/`.

## Estrutura do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `src/App.tsx` | Navegação por hash, título da página e gerenciamento de foco entre telas |
| `src/pages/` | Home, catálogo, ficha do Pokémon, treinadores e equipes |
| `src/components/` | Componentes reutilizáveis e seus respectivos arquivos CSS |
| `src/services/pokedexService.ts` | Consulta aos dados locais e relações entre Pokémon e treinadores |
| `src/data/pokedex-data.json` | Conjunto de dados disponibilizado pelo professor |
| `src/types/` | Tipos dos dados e da navegação |
| `src/utils/` | Filtros, rotas e funções de apresentação |
| `src/hooks/` | Hook de preferência por movimento reduzido |
| `src/styles/` | Estilos globais e variáveis de cores, fontes e espaçamentos |
| `src/assets/` | Imagens e ícones importados pelos componentes |
| `public/` | Arquivos públicos, incluindo as imagens do dispositivo Pokédex |

## Rotas

A navegação utiliza o hash da URL, sem React Router.

| Rota | Página |
| --- | --- |
| `#inicio` | Abertura da Pokédex |
| `#catalogo` | Catálogo de Pokémon |
| `#pokemon/25` | Exemplo de ficha do Pikachu |
| `#treinadores` | Lista de todos os treinadores |
| `#treinadores?pokemon=25` | Treinadores que possuem Pikachu na equipe |
| `#treinadores/1` | Exemplo de equipe de treinador |

## Dados e recursos visuais

Os registros e as relações entre Pokémon e treinadores são consultados a partir de `src/data/pokedex-data.json`. **Os fluxos de consulta não dependem de uma API externa.**

- **Dados:** [JSON disponibilizado pelo professor João Paulo Aramuni](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json).
- **Imagens externas dos Pokémon:** [PokeAPI — sprites/official-artwork](https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/official-artwork), carregadas por ID. Quando indisponíveis, a interface exibe uma alternativa textual.
- **Elementos visuais locais:** arquivos incluídos em `src/assets/figma/` e `public/assets/imgs/`. A ficha do Bulbasaur utiliza uma imagem local.
- **Retratos dos treinadores:** representação pela inicial do nome quando não há imagem cadastrada.
- **Tipografia:** Outfit, Inter e Roboto Mono, carregadas pelo Google Fonts, com fontes de sistema como alternativa.
- **Abertura animada:** componente adaptado do [PokedexCover disponibilizado pelo professor](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/Pokedex/src/components/PokedexCover).

As imagens externas e as fontes precisam de internet para carregar; os dados permanecem locais. Pokémon e seus elementos visuais pertencem aos respectivos titulares. Este projeto tem finalidade acadêmica.

## Acessibilidade e responsividade

A interface foi adaptada para celular, tablet e desktop, com ajustes nos grids, textos, imagens e espaçamentos.

Os recursos de acessibilidade incluem:

- Navegação por teclado e foco visível.
- Rótulos nos campos de pesquisa.
- Link para pular ao conteúdo principal.
- Indicação da página atual e atualização do título ao navegar.
- Fechamento do modal por Escape, botão ou clique no fundo.
- Contenção do foco no modal e retorno ao controle de origem ao fechar.
- Respeito à preferência por movimento reduzido.
- Opção de acessar o catálogo sem a animação de abertura.

## Referências do projeto

- [Aplicação publicada na Vercel](https://pokedex-diaw.vercel.app/)

- [Repositório](https://github.com/abneralmeidacord/Pokedex-DIAW)
- [Protótipo no Figma](https://www.figma.com/design/H2jIAVXPU3I3Z3LqlvQHJ9/Pokedex?node-id=9-5)
- [Referência visual do catálogo](https://www.figma.com/design/H2jIAVXPU3I3Z3LqlvQHJ9/Pokedex?node-id=9-129)
- [Planejamento das entregas](https://github.com/users/abneralmeidacord/projects/5)
