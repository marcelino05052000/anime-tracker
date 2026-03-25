# Anime Tracker — Guia Arquitetural

## Stack Tecnológica

| Lib | Versão | Uso |
|---|---|---|
| React | 19.2 | UI |
| TypeScript | 5.9 | Tipagem estática (strict mode) |
| Vite | 8.0 | Build tool |
| Tailwind CSS | **v4** | Estilização (CSS-first, sem config file) |
| React Router DOM | 7.13 | Roteamento SPA |
| TanStack Query | 5.95 | Cache e fetching de dados |
| Zustand | 5.0 | Estado global com persistência |
| Axios | 1.13 | Cliente HTTP com retry no rate limit |
| Lucide React | 1.6 | Ícones |

---

## 1. Estrutura de Pastas

```
src/
├── components/
│   ├── ui/              # Button, Badge, Modal, Skeleton, Spinner
│   └── layout/          # Header, RootLayout
├── features/
│   ├── home/
│   │   ├── components/  # AnimeCard, AnimeCardSkeleton, AnimeGrid, SeasonalSection, TopAnimeSection
│   │   └── hooks/       # useSeasonalAnime.ts, useTopAnime.ts
│   ├── search/
│   │   ├── components/  # SearchFilters.tsx, Pagination.tsx
│   │   └── hooks/       # useAnimeSearch.ts
│   ├── anime-details/
│   │   ├── components/  # AnimeBanner, AnimeInfo, GenreBadges, YouTubeEmbed, AddToListModal
│   │   └── hooks/       # useAnimeDetails.ts, useTranslatedSynopsis.ts
│   └── my-list/
│       ├── components/  # MyListTabs, MyListCard, EditStatusModal
│       └── hooks/       # (sem hooks próprios — usa store diretamente)
├── hooks/               # useDebounce.ts, useTheme.ts, useI18n.ts
├── i18n/                # translations.ts, animeFieldTranslations.ts
├── pages/               # HomePage, SearchPage, AnimeDetailsPage, MyListPage, NotFoundPage
├── router/              # index.tsx — createBrowserRouter
├── services/
│   ├── api.ts           # Instância Axios com interceptor de retry
│   └── jikan/           # anime.service.ts
├── store/               # myListStore.ts, themeStore.ts, languageStore.ts
├── types/               # anime.types.ts, api.types.ts, user.types.ts, index.ts
└── utils/               # constants.ts, formatters.ts
```

---

## 2. Tailwind CSS v4

**Diferenças críticas em relação ao v3:**
- Sem `tailwind.config.ts` — configuração é CSS-first
- Plugin via `@tailwindcss/vite` no `vite.config.ts` (não PostCSS)
- `index.css` usa `@import "tailwindcss"` (não as três diretivas `@tailwind base/components/utilities`)
- Dark mode configurado com `@custom-variant dark (&:where(.dark, .dark *))` no `index.css`
- A classe `dark` é aplicada no `<html>` pelo `useTheme` hook

---

## 3. Axios — api.ts

```typescript
// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 10000,
});

// Retry automático no rate limit (429) — Jikan: 3 req/s, 60 req/min
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api.request(error.config);
    }
    return Promise.reject(error);
  },
);
```

---

## 4. React Query — configuração global

```typescript
// src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 min
      gcTime: 1000 * 60 * 10,       // 10 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**QUERY_KEYS** centralizados em `src/utils/constants.ts`:
```typescript
export const QUERY_KEYS = {
  SEASONAL: 'seasonal-anime',
  TOP_ANIME: 'top-anime',
  ANIME_SEARCH: 'anime-search',
  ANIME_DETAILS: 'anime-details',
} as const;
```

---

## 5. Estado Global — Zustand Stores

### myListStore

Persist key: `'anime-tracker-my-list'`

Actions: `addToList`, `removeFromList`, `updateStatus`, `updateScore`, `updateEpisode`, `isInList`

State: `list: Record<number, UserListEntry>` (indexado por `mal_id`)

### themeStore

Persist key: `'anime-tracker-theme'`

State: `theme: 'light' | 'dark'`; Action: `toggleTheme()`

Hook `useTheme` aplica/remove a classe `dark` no `document.documentElement` via `useEffect`.

### languageStore

Persist key: `'anime-tracker-language'`

State: `language: 'en' | 'pt-BR'`; Action: `setLanguage(lang)`

---

## 6. i18n

Sistema leve sem biblioteca externa. Funciona com:
1. `src/i18n/translations.ts` — objeto `as const` com chaves `en` e `pt-BR`
2. `languageStore` — persiste a língua selecionada no `localStorage`
3. Hook `useI18n()` — retorna `{ t, language, setLanguage }`

```typescript
// src/hooks/useI18n.ts
export function useI18n() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  return { t: translations[language], language, setLanguage };
}
```

O tipo `Translations` é derivado de `typeof translations['en']`, garantindo type-safety sem duplicação.

### Tradução de sinopse (MyMemory API)

Hook `useTranslatedSynopsis` em `src/features/anime-details/hooks/`:
- Ativado apenas quando `language === 'pt-BR'` e sinopse existe
- Sinopses longas divididas em chunks de ≤450 chars (limite da API), por fronteira de sentença
- Requisições em paralelo com `Promise.all`
- `staleTime: Infinity` — tradução nunca expira; `gcTime: 1h`

### Tradução de campos de metadados

`src/i18n/animeFieldTranslations.ts` — funções puras com mapeamento estático:
- `translateAnimeStatus(value, lang)` — 3 valores possíveis
- `translateAnimeSeason(season, lang)` — spring/summer/fall/winter
- `translateAnimeRating(value, lang)` — 6 classificações MAL
- `translateDuration(value, lang)` — substituição de strings (per ep → por ep, etc.)
- `translateGenreName(name, lang)` — ~70 gêneros, temas e demografias

Todas retornam o valor original quando `lang !== 'pt-BR'`.

---

## 7. Roteamento

```typescript
// src/router/index.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'anime/:id', element: <AnimeDetailsPage /> },
      { path: 'my-list', element: <MyListPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
```

Filtros de busca persistidos via `useSearchParams()` — permite links compartilháveis e compatibilidade com back/forward do browser.

---

## 8. Tipagens (src/types/)

### UserListEntry

```typescript
export interface UserListEntry {
  mal_id: number;
  title: string;
  image_url: string;
  score: number | null;           // score global do anime (Jikan)
  episodes: number | null;        // total de episódios
  status: WatchStatus;
  user_score: number | null;      // nota pessoal do usuário (1–10)
  current_episode: number | null; // episódio atual
  added_at: string;               // ISO date string
  updated_at: string;
}
```

### Anime (campos relevantes)

- Imagens: preferir `images.webp.image_url`, fallback para `images.jpg.image_url`
- Trailer: verificar `trailer.youtube_id !== null` antes de renderizar embed
- `season`: vem em lowercase da API (`spring`, `summer`, `fall`, `winter`)
- `status`: `'Finished Airing' | 'Currently Airing' | 'Not yet aired'`

---

## 9. Convenções de Código

- Componentes: `PascalCase`, `export default function NomeComponente`
- Hooks: `camelCase` com prefixo `use`
- Imports de tipo: sempre `import type { ... }` (`verbatimModuleSyntax` ativo)
- Nunca usar `any` — projeto em strict mode (`noUnusedLocals`, `noUnusedParameters`)
- Imports sempre via `@/` — nunca caminhos relativos entre features
- Páginas em `/pages` são apenas composição — lógica fica nos hooks de feature

---

## 10. Modal e Portal

`Modal.tsx` usa `createPortal` para renderizar em `document.body`. Isso quebra a herança de CSS do `RootLayout`, então cores de texto devem ser declaradas explicitamente no `<h2>` do título e no botão de fechar (ex: `text-zinc-900 dark:text-zinc-100`).

---

## 11. Notas de Deploy

| Plataforma | Configuração |
|---|---|
| Vercel | Detecta Vite automaticamente — zero config |
| Netlify | Requer arquivo `public/_redirects`: `/* /index.html 200` |

`npm run build` executa `tsc -b && vite build`. Verificar `npx tsc --noEmit` antes do deploy.
