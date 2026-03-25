import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { animeService } from '@/services/jikan/anime.service';
import { useDebounce } from '@/hooks/useDebounce';
import { QUERY_KEYS } from '@/utils/constants';
import type { AnimeSearchParams } from '@/types';

export function useAnimeSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page') ?? '1');
  const status = (searchParams.get('status') as AnimeSearchParams['status']) ?? undefined;
  const order_by = (searchParams.get('order_by') as AnimeSearchParams['order_by']) ?? undefined;
  const genres = searchParams.get('genres') ?? undefined;

  const debouncedQ = useDebounce(q);

  const params: AnimeSearchParams = {
    q: debouncedQ || undefined,
    page,
    limit: 24,
    status,
    order_by,
    genres,
    sfw: true,
  };

  const query = useQuery({
    queryKey: [QUERY_KEYS.ANIME_SEARCH, params],
    queryFn: () => animeService.search(params),
    enabled: !!(debouncedQ || status || order_by || genres),
  });

  function setParam(key: string, value: string | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      // Reset page when changing filters (not when changing page itself)
      if (key !== 'page') next.delete('page');
      return next;
    });
  }

  return {
    // Data
    animes: query.data?.data,
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    // Params
    q,
    page,
    status,
    order_by,
    genres,
    // Setters
    setQ: (value: string) => setParam('q', value || undefined),
    setPage: (value: number) => setParam('page', String(value)),
    setStatus: (value: string | undefined) => setParam('status', value),
    setOrderBy: (value: string | undefined) => setParam('order_by', value),
    setGenres: (value: string | undefined) => setParam('genres', value),
  };
}
