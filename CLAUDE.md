# Anime Tracker — CLAUDE.md

Projeto pessoal de portfólio: catálogo e rastreador de animes consumindo a Jikan API (MyAnimeList unofficial).

## Comandos

```bash
npm run dev       # servidor de desenvolvimento
npm run build     # build de produção (tsc -b && vite build)
npm run lint      # ESLint
npx tsc --noEmit  # type-check sem build
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
- **Zustand** com `persist` middleware — dados salvos no `localStorage` automaticamente
- `myListStore` → key `'anime-tracker-my-list'`
- `themeStore` → key `'anime-tracker-theme'`

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
│   ├── api.ts       # Instância Axios
│   └── jikan/       # Funções de fetch (anime.service.ts, genres.service.ts)
├── store/           # Zustand stores (myListStore, themeStore)
├── types/           # Interfaces TypeScript (anime, api, user) + barrel index.ts
└── utils/           # constants.ts, formatters.ts
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
| `/my-list` | Minha Lista | `MyListPage.tsx` |
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

### Fase 7 — Polish e Deploy
- [ ] Scroll to top, responsividade, meta tags
- [ ] Deploy Vercel (automático) ou Netlify (`_redirects: /* /index.html 200`)
