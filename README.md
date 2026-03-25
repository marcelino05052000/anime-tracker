# AniTracker

Catálogo e rastreador de animes consumindo a [Jikan API](https://jikan.moe/) (wrapper não-oficial do MyAnimeList). Projeto de portfólio construído com React 19, TypeScript e Tailwind CSS v4.

## Funcionalidades

- **Home** — listagem de animes da temporada atual e top animes
- **Busca** — pesquisa por título com filtros de status e ordenação; parâmetros persistidos na URL
- **Detalhes** — banner com backdrop, poster, score, rank, sinopse, trailer do YouTube e metadados completos
- **Minha Lista** — adicione animes à sua lista pessoal com status de watch, episódio atual e nota; dados salvos no `localStorage`
- **Tema** — modo claro/escuro com persistência entre sessões

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19.2 | UI |
| TypeScript | 5.9 | Tipagem estática (strict mode) |
| Vite | 8.0 | Build tool |
| Tailwind CSS | **v4** | Estilização (CSS-first, sem config file) |
| React Router DOM | 7.13 | Roteamento SPA |
| TanStack Query | 5.95 | Cache e fetching de dados |
| Zustand | 5.0 | Estado global com persistência |
| Axios | 1.13 | Cliente HTTP com retry automático no rate limit |
| Lucide React | 1.6 | Ícones |

## Rotas

| Rota | Descrição |
|---|---|
| `/` | Home — animes da temporada e top animes |
| `/search` | Busca com filtros |
| `/anime/:id` | Detalhes de um anime |
| `/my-list` | Lista pessoal do usuário |

## Instalação e uso

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificação de tipos
npx tsc --noEmit

# Lint
npm run lint
```

## Estrutura do projeto

```
src/
├── components/
│   ├── ui/          # Primitivos: Button, Badge, Skeleton, Spinner, Modal
│   └── layout/      # Header, RootLayout
├── features/        # Domínios de negócio
│   ├── home/        # useSeasonalAnime, useTopAnime, AnimeCard, AnimeGrid, SeasonalSection, TopAnimeSection
│   ├── search/      # useAnimeSearch, SearchFilters, Pagination
│   ├── anime-details/ # useAnimeDetails, AnimeBanner, AnimeInfo, GenreBadges, YouTubeEmbed, AddToListModal
│   └── my-list/     # MyListTabs, MyListCard, EditStatusModal
├── hooks/           # useDebounce, useTheme
├── pages/           # Composição de features (sem lógica)
├── router/          # createBrowserRouter
├── services/
│   ├── api.ts       # Instância Axios com retry no 429
│   └── jikan/       # anime.service.ts
├── store/           # myListStore, themeStore (Zustand + persist)
├── types/           # Interfaces TypeScript (anime, api, user)
└── utils/           # constants.ts (QUERY_KEYS, WATCH_STATUSES)
```

## Decisões técnicas

- **Tailwind v4** — configuração CSS-first via `@import "tailwindcss"` e plugin Vite; dark mode com `@custom-variant dark`
- **Filtros na URL** — `useSearchParams` mantém estado de busca compartilhável e compatível com back/forward do browser
- **Rate limit** — interceptor Axios faz retry automático com 1s de delay ao receber 429 (Jikan: 3 req/s, 60 req/min)
- **Path alias** — `@/` aponta para `src/` em Vite e TypeScript
- **Persistência** — Zustand com `persist` middleware salva lista e tema no `localStorage`
- **Rastreamento de episódios** — ao marcar um anime como "completed", o campo de episódio atual é preenchido automaticamente com o total
