# AniTracker

Anime catalogue and tracker consuming the [Jikan API](https://jikan.moe/) (unofficial MyAnimeList wrapper). Portfolio project built with React 19, TypeScript, and Tailwind CSS v4.

## Features

- **Home** — current season anime and top anime listings
- **Search** — search by title with status and sorting filters; parameters persisted in the URL
- **Details** — backdrop banner, poster, score, rank, synopsis, YouTube trailer, and full metadata
- **My List** — add anime to your personal list with watch status, current episode, and score; data saved in `localStorage`
- **Theme** — light/dark mode with persistence across sessions
- **Notifications** — daily episode alerts for anime in your watching list; bell badge in header and dedicated notifications timeline
- **Forum** — per-anime discussion forum with posts, comments, votes, and moderation; home page with recent, popular, and episode discussion sections; automatic episode discussion threads created via cron job; role-based moderation (pin, lock, delete)
- **Internationalization** — UI in English and Brazilian Portuguese; synopsis auto-translated via MyMemory API; fields like status, season, rating, duration, and genres also translated

## Stack

| Technology | Version | Usage |
|---|---|---|
| React | 19.2 | UI |
| TypeScript | 5.9 | Static typing (strict mode) |
| Vite | 8.0 | Build tool |
| Tailwind CSS | **v4** | Styling (CSS-first, no config file) |
| React Router DOM | 7.13 | SPA routing |
| TanStack Query | 5.95 | Data fetching and caching |
| Zustand | 5.0 | Global state with persistence |
| Axios | 1.13 | HTTP client with automatic retry on rate limit |
| Lucide React | 1.6 | Icons |

## Routes

| Route | Description |
|---|---|
| `/` | Home — seasonal and top anime |
| `/search` | Search with filters |
| `/anime/:id` | Anime details |
| `/my-list` | User's personal list |
| `/notifications` | Episode alerts (protected) |
| `/forum` | Forum home — recent, popular, episode discussions |
| `/forum/post/:postId` | Forum post with comments |
| `/forum/new` | Create new post (protected) |
| `/forum/anime/:malId` | Forum posts for a specific anime |

## Installation

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── ui/          # Primitives: Button, Badge, Skeleton, Spinner, Modal
│   └── layout/      # Header, RootLayout
├── features/        # Business domains
│   ├── home/        # useSeasonalAnime, useTopAnime, AnimeCard, AnimeGrid, SeasonalSection, TopAnimeSection
│   ├── search/      # useAnimeSearch, SearchFilters, Pagination
│   ├── anime-details/ # useAnimeDetails, AnimeBanner, AnimeInfo, GenreBadges, YouTubeEmbed, AddToListModal
│   ├── my-list/     # MyListTabs, MyListCard, EditStatusModal
│   ├── notifications/ # useUnreadCount, useNotifications, useMarkAsRead, NotificationCard
│   └── forum/       # ForumSubNav, ForumPostCard, ForumCommentCard, AnimeSearchSelect, hooks (CRUD, votes, mod)
├── hooks/           # useDebounce, useTheme, useI18n
├── i18n/            # translations.ts (EN/PT-BR), animeFieldTranslations.ts
├── pages/           # Feature composition only — no logic
├── router/          # createBrowserRouter
├── services/
│   ├── api.ts       # Axios instance with 429 retry
│   └── jikan/       # anime.service.ts
├── store/           # myListStore, themeStore, languageStore (Zustand + persist)
├── types/           # TypeScript interfaces (anime, api, user)
└── utils/           # constants.ts (QUERY_KEYS, WATCH_STATUSES)
```

## Technical Decisions

- **Tailwind v4** — CSS-first config via `@import "tailwindcss"` and Vite plugin; dark mode with `@custom-variant dark`
- **URL filters** — `useSearchParams` keeps search state shareable and compatible with browser back/forward
- **Rate limit** — Axios interceptor auto-retries with 1s delay on 429 (Jikan: 3 req/s, 60 req/min)
- **Path alias** — `@/` maps to `src/` in both Vite and TypeScript
- **Persistence** — Zustand `persist` middleware saves list, theme, and language to `localStorage`
- **Episode tracking** — when marking an anime as "completed", the current episode field auto-fills with the total
- **i18n without a library** — lightweight system using `as const` object + Zustand store + `useI18n()` hook; type-safe via type derived from `typeof translations['en']`
- **Synopsis translation** — MyMemory API (free, no key required); long synopses split into ≤450 char chunks; `staleTime: Infinity` prevents re-translation on navigation
- **Field translation** — static mappings in `animeFieldTranslations.ts` for status, season, rating, duration, and ~70 genres/themes/demographics

---

# AniTracker (PT-BR)

Catálogo e rastreador de animes consumindo a [Jikan API](https://jikan.moe/) (wrapper não-oficial do MyAnimeList). Projeto de portfólio construído com React 19, TypeScript e Tailwind CSS v4.

## Funcionalidades

- **Home** — listagem de animes da temporada atual e top animes
- **Busca** — pesquisa por título com filtros de status e ordenação; parâmetros persistidos na URL
- **Detalhes** — banner com backdrop, poster, score, rank, sinopse, trailer do YouTube e metadados completos
- **Minha Lista** — adicione animes à sua lista pessoal com status de watch, episódio atual e nota; dados salvos no `localStorage`
- **Tema** — modo claro/escuro com persistência entre sessões
- **Notificações** — alertas diários de episódios para animes na sua lista de assistindo; badge de sino no header e timeline dedicada de notificações
- **Fórum** — fórum de discussão por anime com posts, comentários, votos e moderação; home com seções de recentes, populares e discussões de episódios; threads automáticas de discussão de episódio via cron job; moderação com roles (fixar, trancar, excluir)
- **Internacionalização** — interface em Inglês e Português (Brasil); sinopse traduzida automaticamente via MyMemory API; campos como status, temporada, classificação, duração e gêneros também traduzidos

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
| `/notifications` | Alertas de episódios (protegida) |
| `/forum` | Home do fórum — recentes, populares, discussões de episódios |
| `/forum/post/:postId` | Post do fórum com comentários |
| `/forum/new` | Criar novo post (protegida) |
| `/forum/anime/:malId` | Posts do fórum de um anime específico |

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
│   ├── my-list/     # MyListTabs, MyListCard, EditStatusModal
│   ├── notifications/ # useUnreadCount, useNotifications, useMarkAsRead, NotificationCard
│   └── forum/       # ForumSubNav, ForumPostCard, ForumCommentCard, AnimeSearchSelect, hooks (CRUD, votos, mod)
├── hooks/           # useDebounce, useTheme, useI18n
├── i18n/            # translations.ts (EN/PT-BR), animeFieldTranslations.ts
├── pages/           # Composição de features (sem lógica)
├── router/          # createBrowserRouter
├── services/
│   ├── api.ts       # Instância Axios com retry no 429
│   └── jikan/       # anime.service.ts
├── store/           # myListStore, themeStore, languageStore (Zustand + persist)
├── types/           # Interfaces TypeScript (anime, api, user)
└── utils/           # constants.ts (QUERY_KEYS, WATCH_STATUSES)
```

## Decisões técnicas

- **Tailwind v4** — configuração CSS-first via `@import "tailwindcss"` e plugin Vite; dark mode com `@custom-variant dark`
- **Filtros na URL** — `useSearchParams` mantém estado de busca compartilhável e compatível com back/forward do browser
- **Rate limit** — interceptor Axios faz retry automático com 1s de delay ao receber 429 (Jikan: 3 req/s, 60 req/min)
- **Path alias** — `@/` aponta para `src/` em Vite e TypeScript
- **Persistência** — Zustand com `persist` middleware salva lista, tema e idioma no `localStorage`
- **Rastreamento de episódios** — ao marcar um anime como "completed", o campo de episódio atual é preenchido automaticamente com o total
- **i18n sem biblioteca** — sistema leve com objeto `as const` + Zustand store + hook `useI18n()`; type-safe via tipo derivado de `typeof translations['en']`
- **Tradução de sinopse** — MyMemory API (gratuita, sem chave); sinopses longas divididas em chunks de 450 chars por limite da API; cache infinito para evitar retradução
- **Tradução de campos** — mapeamento estático em `animeFieldTranslations.ts` para status, temporada, classificação, duração e ~70 gêneros/temas/demografias
