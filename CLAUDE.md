# Anime Tracker — CLAUDE.md

Projeto pessoal de portfólio: catálogo e rastreador de animes consumindo a Jikan API (MyAnimeList unofficial).

## Comandos

```bash
# Frontend
npm run dev       # servidor de desenvolvimento (Vite, porta 5173)
npm run build     # build de produção (tsc -b && vite build)
npm run lint      # ESLint
npx tsc --noEmit  # type-check sem build

# Backend
cd server && npm run dev   # servidor Express (porta 3001, tsx watch)
cd server && npm run build # build de produção (tsc)
```

## Stack (versões instaladas)

| Lib | Versão |
|---|---|
| React | 19.2 |
| Vite | 8.0 |
| TypeScript | 5.9 |
| React Router DOM | 7.13 |
| TanStack Query | 5.95 |
| Zustand | 5.0 |
| Axios | 1.13 |
| Tailwind CSS | **v4** (não v3) |
| Lucide React | 1.6 |

### Backend (server/)

| Lib | Versão |
|---|---|
| Express | 4.21 |
| Mongoose | 8.9 |
| bcryptjs | 2.4 |
| jsonwebtoken | 9.0 |
| Zod | 3.24 |
| cookie-parser | 1.4 |

## Decisões Arquiteturais Importantes

### Tailwind CSS v4 — diferente do v3
- Sem `tailwind.config.ts` — configuração é CSS-first
- Plugin via `@tailwindcss/vite` no `vite.config.ts` (não PostCSS)
- `index.css` usa `@import "tailwindcss"` (não as três diretivas do v3)
- Dark mode configurado com `@custom-variant dark (&:where(.dark, .dark *))` no `index.css`
- A classe `dark` deve ser aplicada no `<html>` pelo `themeStore`

### Path Alias
- `@/` → `src/` configurado em `vite.config.ts` (resolve.alias) **e** `tsconfig.app.json` (paths)
- Usar sempre `@/` nos imports, nunca caminhos relativos entre features

### Roteamento
- React Router DOM v7 — usa `createBrowserRouter` + `RouterProvider`
- Todas as rotas aninhadas sob `RootLayout` via `<Outlet />`
- Filtros de busca via `useSearchParams()` (parâmetros na URL)

### Estado Global
- **Zustand** com `persist` middleware — somente para preferências de UI (`themeStore`, `languageStore`)
- `themeStore` → key `'anime-tracker-theme'`
- `languageStore` → key `'anime-tracker-language'`
- **Lista do usuário** → MongoDB via API backend (não mais localStorage)

### Backend + Autenticação
- Backend em `/server` — Express + Mongoose + MongoDB Atlas
- JWT com httpOnly cookies: access token (15min) + refresh token (7d, path `/api/auth/refresh`)
- `SameSite=Strict`, `Secure` em produção — imune a XSS
- Frontend usa `backendApi.ts` (Axios) com interceptor 401→refresh automático
- `AuthContext` provê `user`, `isAuthenticated`, `isLoading` para toda a app
- Rota `/my-list` protegida por `ProtectedRoute` — redireciona para `/login` se não autenticado
- Lista do usuário persistida na collection `animelistentries` com compound index `{ user, mal_id }`
- Hooks TanStack Query (`useMyList`, `useAddToList`, `useUpdateEntry`, `useRemoveFromList`) substituem o antigo `myListStore`
- `vite.config.ts` tem proxy dev: `/api` → `http://localhost:3001`
- `server/.env` requer: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `node-cron` para job agendado de alertas de episódios

### API — Jikan v4
- Base URL: `https://api.jikan.moe/v4`
- Rate limit: 3 req/s e 60 req/min — interceptor em `api.ts` faz retry automático no 429
- Sempre usar `.webp.image_url`, fallback `.jpg.image_url`
- Verificar `trailer.youtube_id !== null` antes de renderizar o embed

### React Query
- `staleTime: 5min`, `gcTime: 10min`, `retry: 1`, `refetchOnWindowFocus: false`
- `QUERY_KEYS` centralizados em `src/utils/constants.ts`

## Estrutura de Pastas

```
src/
├── components/
│   ├── ui/          # Primitivos reutilizáveis (Button, Badge, Modal, Skeleton…)
│   └── layout/      # Header, Footer, RootLayout
├── features/        # Domínios de negócio (home, search, anime-details, my-list)
│   └── [feature]/
│       ├── components/
│       └── hooks/
├── hooks/           # Hooks globais (useDebounce, useTheme)
├── pages/           # Somente composição de features — sem lógica
├── router/          # createBrowserRouter
├── services/
│   ├── api.ts         # Instância Axios — Jikan API
│   ├── backendApi.ts  # Instância Axios — Backend API (com refresh interceptor)
│   └── jikan/         # Funções de fetch (anime.service.ts, genres.service.ts)
├── store/             # Zustand stores (themeStore, languageStore)
├── types/             # Interfaces TypeScript (anime, api, user) + barrel index.ts
└── utils/             # constants.ts, formatters.ts

server/
├── src/
│   ├── index.ts          # Express bootstrap
│   ├── config/env.ts     # dotenv + zod validation
│   ├── middleware/        # auth, validate, errorHandler
│   ├── models/           # User, AnimeListEntry (Mongoose)
│   ├── routes/           # auth.routes, list.routes
│   ├── controllers/      # auth.controller, list.controller
│   └── types/            # Express augmentation
├── package.json
└── tsconfig.json
```

## Convenções de Código

- Componentes: `PascalCase`, função nomeada com `export default`
- Hooks: `camelCase` com prefixo `use`
- Arquivos de tipo: sufixo `.types.ts`
- Imports de tipos: sempre `import type { ... }`
- Não usar `any` — projeto em strict mode (`noUnusedLocals`, `noUnusedParameters`)
- Páginas (`/pages`) são apenas composição — lógica fica nos hooks de feature

## Rotas

| Rota | Página | Componente |
|---|---|---|
| `/` | Home | `HomePage.tsx` |
| `/search` | Busca | `SearchPage.tsx` |
| `/anime/:id` | Detalhes | `AnimeDetailsPage.tsx` |
| `/login` | Login | `LoginPage.tsx` |
| `/register` | Cadastro | `RegisterPage.tsx` |
| `/my-list` | Minha Lista (protegida) | `MyListPage.tsx` |
| `/notifications` | Notificações (protegida) | `NotificationsPage.tsx` |
| `/forum` | Forum Home | `ForumHomePage.tsx` |
| `/forum/post/:postId` | Forum Post | `ForumPostPage.tsx` |
| `/forum/new` | New Forum Post (protegida) | `ForumNewPostPage.tsx` |
| `/forum/anime/:malId` | Forum do Anime | `ForumAnimePage.tsx` |
| `*` | Not Found | `NotFoundPage.tsx` |

## Estado do Projeto

### Fase 1 — Fundação ✅ Concluída
- Projeto criado com Vite + React + TypeScript
- Todas as dependências instaladas
- Tailwind v4 configurado
- Path alias `@/` configurado
- Estrutura de pastas criada
- `src/types/` completo (anime, api, user, index)
- `src/utils/constants.ts` criado
- `src/services/api.ts` + `src/services/jikan/anime.service.ts` criados
- `main.tsx` com QueryClient configurado
- `App.tsx` → `AppRouter` → `RootLayout` com Outlet
- Pages placeholder criadas
- `tsc --noEmit` passa sem erros

### Fase 2 — Estado Global e Layout ✅ Concluída
- `src/store/myListStore.ts` — `addToList`, `removeFromList`, `updateStatus`, `updateScore`, `updateEpisode`, `isInList`
- `src/store/themeStore.ts` — `theme: 'light' | 'dark'`, `toggleTheme()`
- `src/hooks/useTheme.ts` — aplica `.dark` no `<html>`; chamado em `App.tsx`
- `src/components/layout/Header.tsx` — navbar sticky, links, toggle tema
- UI primitivos: `Button`, `Badge`, `Skeleton`, `Spinner`, `Modal`

### Fase 3 — Home Page ✅ Concluída
- `useSeasonalAnime`, `useTopAnime`
- `AnimeCard`, `AnimeCardSkeleton`, `AnimeGrid`
- `SeasonalSection`, `TopAnimeSection`

### Fase 4 — Busca e Filtros ✅ Concluída
- `useDebounce` (global em `src/hooks/`)
- `useAnimeSearch` — URL params via `useSearchParams`, debounce no `q`
- `SearchFilters`, `Pagination`

### Fase 5 — Detalhes do Anime ✅ Concluída
- `useAnimeDetails` — lê `:id` via `useParams`
- `AnimeBanner`, `AnimeInfo`, `GenreBadges`, `YouTubeEmbed`
- `AddToListModal` — add/update/remove; campo de episódio com auto-fill

### Fase 6 — Minha Lista ✅ Concluída
- `MyListTabs`, `MyListCard`, `EditStatusModal`
- `MyListCard` exibe progresso de episódios (`Ep X / Y`)

### Melhorias pós-Fase 6 ✅ Aplicadas
- `UserListEntry.current_episode: number | null` — rastreamento de episódio atual
- Auto-fill de episódios: ao marcar como "completed", preenche com o total máximo
  - `AddToListModal`: só auto-fill quando `anime.status === 'Finished Airing'`
  - `EditStatusModal`: auto-fill sempre que `entry.episodes !== null`
- `myListStore.updateEpisode(mal_id, episode)` — nova action no store
- `Modal` — cor do título corrigida (`text-zinc-900 dark:text-zinc-100`)

### Fase 7 — Backend + Autenticação ✅ Concluída
- Backend Express + Mongoose em `/server`
- MongoDB Atlas: collections `users` e `animelistentries`
- JWT httpOnly cookies (access 15min, refresh 7d)
- Endpoints: `/api/auth` (register, login, logout, refresh, me) + `/api/list` (CRUD + import)
- Frontend: `AuthContext`, `ProtectedRoute`, login/register pages
- `myListStore` (Zustand/localStorage) substituído por hooks TanStack Query
- `useMyList`, `useAddToList`, `useUpdateEntry`, `useRemoveFromList`, `useIsInList`
- `AnimeBanner` redireciona para login se não autenticado
- `Header` exibe username/logout quando autenticado, login link quando não
- `MigrationBanner` detecta dados no localStorage e oferece importação
- i18n atualizado com seção `auth` (EN + PT-BR)

### Fase 7.5 — Comentários e Reações ✅ Concluída
- Models: `Comment` (text, parent_id, edited, timestamps) + `CommentVote` (value: 1|-1, unique per user+comment)
- Endpoints: `/api/comments/:mal_id` (GET público com optional auth, POST protegido) + CRUD + vote
- `optionalAuth` middleware — inclui `user_vote` no GET se logado, sem bloquear anônimos
- Replies: 1 nível (parent_id de comentário raiz), não permite reply de reply
- Votos calculados via aggregation no GET (score = upvotes - downvotes)
- Frontend: `CommentsSection`, `CommentCard`, `CommentInput`, `CommentReplies`
- Hooks: `useComments`, `useReplies`, `useAddComment`, `useEditComment`, `useDeleteComment`, `useVoteComment`, `useRemoveVote`
- Ordenação: toggle "Mais recentes" / "Mais votados"
- Autor pode editar (marca `edited: true`) e deletar (cascade em replies + votos)
- Não logado: vê comentários, botões de ação desabilitados, link para login
- i18n: seção `comments` em EN + PT-BR
- `QUERY_KEYS.COMMENTS` e `QUERY_KEYS.COMMENT_REPLIES` adicionados

### Fase 7.6 — Alertas de Episódios ✅ Concluída
- Models: `EpisodeRelease` (cache global) + `Notification` (per-user, read/unread)
- Cron job diário (`node-cron`, 06:00 UTC) busca Jikan `/schedules/{day}`, cria releases e notificações
- Endpoints: `/api/notifications` (GET paginado, GET unread-count, PATCH :id/read, PATCH read-all)
- Frontend: bell badge no Header com polling 5min, página `/notifications` com timeline
- `NotificationCard` com link pro anime, timestamp relativo, botão marcar como lida
- Marcação individual e bulk ("marcar todas como lidas")
- i18n: seção `notifications` em EN + PT-BR
- `QUERY_KEYS.NOTIFICATIONS` e `QUERY_KEYS.NOTIFICATION_UNREAD_COUNT` adicionados

### Fase 8 — Forum ✅ Concluída
- Models: `ForumPost` (categories, tags, pinned, locked, views), `ForumComment`, `ForumCommentVote`
- `User.role` (user/moderator/admin) com `requireRole` middleware
- Endpoints: `/api/forum` (CRUD + pin/lock) + `/api/forum/:postId/comments` (CRUD + votes)
- Cron job atualizado: cria posts automáticos de discussão de episódio via Jikan episodes API
- Frontend: ForumLayout com sub-nav, ForumHomePage (seções: episódios, populares, recentes), ForumPostPage, ForumNewPostPage com AnimeSearchSelect, ForumAnimePage
- Sistema de comentários/votos independente (ForumComment/ForumCommentVote)
- Moderação: pin/lock/delete por moderadores e admins
- Botão "Forum" na página de detalhes do anime + link no Header global
- i18n: seção `forum` em EN + PT-BR
- `QUERY_KEYS.FORUM_POSTS`, `QUERY_KEYS.FORUM_POST`, `QUERY_KEYS.FORUM_COMMENTS`, `QUERY_KEYS.FORUM_COMMENT_REPLIES`

### Fase 9 — Polish e Deploy
- [ ] Scroll to top, responsividade, meta tags
- [ ] Deploy (frontend + backend)
