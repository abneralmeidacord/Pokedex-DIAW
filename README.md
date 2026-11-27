# Pokédex — DIAW

Aplicação web da disciplina de **Desenvolvimento e Integração de Aplicações Web**, do curso de Engenharia de Software da **PUC Minas**. Na Atividade 04, a interface React + Vite da Atividade 03 passou a consultar uma API Spring Boot com MongoDB.

O catálogo reúne **721 Pokémon** da Pokédex Nacional, da primeira à sexta geração (Pokémon X e Y). A Pokédex permite consultar seus atributos e conhecer os **12 treinadores** e suas equipes.

## Aplicação publicada

A versão da Atividade 04 está em [pokedex-diaw.vercel.app](https://pokedex-diaw.vercel.app/). A Vercel serve o frontend e encaminha as chamadas em `/api` para o Spring Boot no Render.

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
- Cadastro com escolha de um Pokémon como avatar, login e saída pelo cabeçalho.
- Mensagens para Pokémon e treinadores não encontrados.
- Layouts adaptáveis para celular, tablet e desktop.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React e React DOM | Componentes, estado e renderização da interface |
| TypeScript | Tipagem dos dados, serviços e componentes |
| Vite | Servidor de desenvolvimento e build de produção |
| concurrently | Inicia o frontend e o backend no mesmo terminal |
| Spring Boot, Spring Web e Maven | Backend e API REST |
| Spring Security | Sessões, proteção CSRF e hash de senhas com PBKDF2 |
| Spring Data MongoDB e MongoDB Atlas | Repositórios e persistência de dados |
| Motion | Animação de abertura da Pokédex |
| CSS | Estilos por componente, layouts responsivos e variáveis compartilhadas |
| ESLint | Análise estática do código |

O `package.json` da raiz reúne os comandos do projeto. As dependências do React ficam em `frontend/package.json`, e a instalação usa o `package-lock.json` da raiz.

## Instalação e execução

### Requisitos

- Node.js **22.12 ou superior**; recomenda-se Node.js 24 LTS.
- npm.
- JDK **17 ou superior** e Maven **3.6.3 ou superior**.
- Cluster MongoDB Atlas e usuário de banco com permissão `readWrite` no banco da Pokédex.
- Git, caso o projeto seja obtido por clonagem.
- Internet para instalar as dependências e carregar os recursos externos.

### MongoDB Atlas e backend

1. No Atlas, autorize o IP da máquina que executará a aplicação em **Network Access** e crie o usuário do banco em **Database Access**.
2. Em **Connect → Drivers**, copie a URI `mongodb+srv://` do cluster e preencha o usuário e a senha. Se a senha tiver caracteres reservados na URI, use a codificação percentual. [Guia de conexão do MongoDB Atlas](https://www.mongodb.com/docs/atlas/driver-connection/)
3. Preencha `MONGODB_URI` no arquivo `.env` da raiz usando `.env.example` como modelo. Cole a URI completa sem aspas. O nome do banco vem de `MONGODB_DATABASE` e o padrão é `pokedex`. O Git ignora o `.env`.

O backend carrega o `.env` automaticamente. Se preferir definir as variáveis no terminal, elas terão prioridade sobre os valores do arquivo.

PowerShell 7

```powershell
$env:MONGODB_URI = Read-Host 'URI do MongoDB Atlas' -MaskInput
$env:MONGODB_DATABASE = 'pokedex'
```

Bash

```bash
read -r -s -p 'URI do MongoDB Atlas: ' MONGODB_URI
export MONGODB_URI
export MONGODB_DATABASE=pokedex
```

Para popular um banco novo ou completar um catálogo existente até a sexta geração, execute a carga a partir da raiz.

```bash
mvn -f backend/pom.xml spring-boot:run "-Dspring-boot.run.profiles=seed"
```

### Frontend e backend

```bash
npm ci
npm run concurrently
```

Execute os comandos na raiz. Acesse a URL informada pelo Vite, normalmente `http://localhost:5173`. A API está em `http://localhost:8080/api/pokedex`, e o Vite encaminha as chamadas em `/api` para o backend. Pressione `Ctrl+C` no terminal para encerrar os dois serviços.

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm ci` | Instala as dependências da raiz e do frontend a partir do lockfile |
| `npm run concurrently` | Inicia o frontend e o backend juntos |
| `npm run dev` | Inicia apenas o frontend |
| `npm run dev:backend` | Inicia apenas o backend |
| `npm run lint` | Executa a análise estática com ESLint |
| `npm run build` | Verifica os tipos com TypeScript e gera o build em `frontend/dist/` |
| `npm run preview` | Serve o build localmente para conferência |

Para conferir a versão de produção:

```bash
npm run lint
npm run build
npm run preview
```

O preview normalmente fica disponível em `http://localhost:4173` e usa o mesmo proxy do ambiente de desenvolvimento. Em uma publicação, sirva o conteúdo de `frontend/dist/` e encaminhe `/api` para o backend no mesmo domínio.

## Estrutura do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `frontend/` | Aplicação React + Vite e configurações do frontend |
| `frontend/src/App.tsx` | Navegação por hash, título da página e gerenciamento de foco entre telas |
| `frontend/src/pages/` | Home, catálogo, ficha do Pokémon, treinadores e equipes |
| `frontend/src/components/` | Componentes reutilizáveis e seus respectivos arquivos CSS |
| `frontend/src/services/pokedexService.ts` | Leitura da API e consultas usadas pelas telas |
| `backend/` | Aplicação Spring Boot, modelos MongoDB, repositórios e carga inicial |
| `Script_Pokedex.sql` | Fonte da carga inicial com os 721 Pokémon, tipos, treinadores e relações |
| `frontend/src/types/` | Tipos dos dados e da navegação |
| `frontend/src/utils/` | Filtros, rotas e funções de apresentação |
| `frontend/src/hooks/` | Hook de preferência por movimento reduzido |
| `frontend/src/styles/` | Estilos globais e variáveis de cores, fontes e espaçamentos |
| `frontend/src/assets/` | Imagens e ícones importados pelos componentes |
| `frontend/public/` | Arquivos públicos, incluindo as imagens do dispositivo Pokédex |

## Rotas

A navegação utiliza o hash da URL, sem React Router.

| Rota | Página |
| --- | --- |
| `#inicio` | Abertura da Pokédex |
| `#catalogo` | Catálogo de Pokémon |
| `#pokemon/25` | Exemplo de ficha do Pikachu |
| `#perfil` | Perfil da conta e lista de Pokémon favoritos |
| `#treinadores` | Lista de todos os treinadores |
| `#treinadores?pokemon=25` | Treinadores que possuem Pikachu na equipe |
| `#treinadores/1` | Exemplo de equipe de treinador |
| `#cadastro` | Cadastro com seleção de Pokémon para a foto de perfil |
| `#login` | Login por usuário e senha |

## Contas e sessões

O cadastro grava a conta em `accounts` com nome, usuário, hash da senha e ID do Pokémon escolhido. O nome de usuário é único independentemente de maiúsculas e minúsculas. A sessão usa um cookie HTTP-only, e o catálogo pode ser acessado sem login.

| Método e rota | Operação |
| --- | --- |
| `GET /api/auth/csrf` | Obtém o token e o nome do cabeçalho para o próximo POST |
| `POST /api/auth/register` | Recebe `name`, `username`, `password` e `pokemonId` em JSON |
| `POST /api/auth/login` | Recebe `username` e `password` como dados de formulário e inicia a sessão |
| `GET /api/auth/me` | Retorna o usuário autenticado e o ID do avatar |
| `POST /api/auth/logout` | Encerra a sessão |
| `POST /api/auth/favorites/{pokemonId}` | Salva um Pokémon nos favoritos da conta autenticada |
| `DELETE /api/auth/favorites/{pokemonId}` | Remove um Pokémon dos favoritos da conta autenticada |

Os IDs favoritos ficam no documento da conta em `favoritePokemonIds`. `GET /api/auth/me` também devolve essa lista, que é carregada novamente ao iniciar sessão.

## Dados e recursos visuais

A API `GET /api/pokedex` lê as três coleções e devolve os tipos, os Pokémon com seus tipos resolvidos e os treinadores. O frontend usa os dados para pesquisa, filtro, navegação das fichas e exibição das equipes.

- O `Script_Pokedex.sql` é a fonte da carga inicial. Ele reúne os registros e vínculos originais da atividade e acrescenta as formas padrão das espécies do nº 152 ao 721, com nome, tipos e atributos base. [SQL original do professor João Paulo Aramuni](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2004%20-%20SQL%20vs%20NoSQL/Script_Pokedex.sql) · [Dados da PokéAPI](https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv)
- Imagens dos Pokémon. A carga registra a URL de cada arte pelo ID nacional. Quando a imagem está indisponível, a interface exibe uma alternativa textual. [PokéAPI Official Artwork](https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/official-artwork)
- Elementos visuais locais em `frontend/src/assets/figma/` e `frontend/public/assets/imgs/`. A ficha do Bulbasaur utiliza uma imagem local.
- **Retratos dos treinadores:** representação pela inicial do nome quando não há imagem cadastrada.
- **Tipografia:** Outfit, Inter e Roboto Mono, carregadas pelo Google Fonts, com fontes de sistema como alternativa.
- **Abertura animada:** componente adaptado do [PokedexCover disponibilizado pelo professor](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React/Pokedex/src/components/PokedexCover).

As imagens externas e as fontes precisam de internet para carregar. Pokémon e seus elementos visuais pertencem aos respectivos titulares. Este projeto tem finalidade acadêmica.

### Coleções e conferência da carga

| Coleção | Campos e relações |
| --- | --- |
| `pokemons` | `_id` da Pokédex Nacional, `name`, `stats` com seis atributos, `imageUrl` e `typeIds`, que referencia `types._id` na ordem da fonte |
| `types` | `_id` e `name`, com os IDs do SQL e o ID 18 para o tipo Fada |
| `trainers` | `_id` e `name` do SQL, contagem de insígnias em `badges` e equipe em `pokemonIds`, que referencia `pokemons._id` e preserva a ordem e as repetições do SQL |

A carga usa o `_id` numérico como chave única e insere apenas registros ausentes. Em um banco novo, são esperados 721 Pokémon, 19 tipos e 12 treinadores. Execute a carga novamente para confirmar que o log registra zero novas inserções. A execução normal do backend inicia apenas a API. Uma nova carga manual repõe registros da fonte que tiverem sido excluídos.

No **Data Explorer** do Atlas, confira Bulbasaur em `pokemons` pelo filtro `{ "_id": 1 }`. Os tipos 4 e 8 correspondem a Grass e Poison em `types`. Confira Koga em `trainers` com `{ "_id": 6 }`. O documento tem cinco insígnias e a equipe `[48, 48, 48, 49]`. O SQL deixa Mew sem relação de tipo e a carga preserva essa ausência.

No catálogo, pesquise por Sylveon ou pelo ID 700, selecione **Fada** e abra a ficha. A ficha deve exibir o tipo Fada, a imagem e os seis atributos base.

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
