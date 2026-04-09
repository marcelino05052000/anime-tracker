import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { animeService } from '@/services/jikan/anime.service';
import { useDebounce } from '@/hooks/useDebounce';
import { QUERY_KEYS } from '@/utils/constants';
import type { AnimeSearchParams } from '@/types';

function parseOrder(order: string | undefined): { order_by?: string; sort?: string } {
  if (!order) return {};
  if (order === 'score_desc') return { order_by: 'score', sort: 'desc' };
  if (order === 'score_asc') return { order_by: 'score', sort: 'asc' };
  if (order === 'rank_asc') return { order_by: 'rank', sort: 'asc' };
  if (order === 'rank_desc') return { order_by: 'rank', sort: 'desc' };
  return { order_by: order };
}

export function useAnimeSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page') ?? '1');
  const status = (searchParams.get('status') as AnimeSearchParams['status']) ?? undefined;
  const order = searchParams.get('order') ?? undefined;
  const genres = searchParams.get('genres') ?? undefined;
  const season = searchParams.get('season') ?? undefined;

  const debouncedQ = useDebounce(q);
  const isSeasonal = season === 'current';
  const { order_by, sort } = parseOrder(order);

  const params: AnimeSearchParams = {
    q: debouncedQ || undefined,
    page,
    limit: 24,
    status: isSeasonal ? undefined : status,
    order_by: order_by as AnimeSearchParams['order_by'],
    sort: sort as AnimeSearchParams['sort'],
    genres,
    sfw: true,
  };

  const hasFilters = isSeasonal || !!(debouncedQ || status || order || genres);

  const query = useQuery({
    queryKey: isSeasonal
      ? [QUERY_KEYS.ANIME_SEARCH, 'seasonal', page, order]
      : [QUERY_KEYS.ANIME_SEARCH, debouncedQ, page, status, order, genres],
    queryFn: () =>
      isSeasonal
        ? animeService.searchSeasonal({ page, limit: 24, order_by, sort, sfw: true })
        : animeService.search(params),
    enabled: hasFilters,
    staleTime: 0,
  });

  function setParam(key: string, value: string | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== 'page') next.delete('page');
      return next;
    });
  }

  return {
    animes: query.data?.data,
    pagination: query.data?.pagination,
    isLoading: query.isLoading && !query.data,
    isError: query.isError,
    q,
    page,
    status,
    order,
    genres,
    season,
    setQ: (value: string) => setParam('q', value || undefined),
    setPage: (value: number) => setParam('page', String(value)),
    setStatus: (value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) { next.set('status', value); } else { next.delete('status'); }
        next.delete('season');
        next.delete('page');
        return next;
      });
    },
    setOrder: (value: string | undefined) => setParam('order', value),
    setGenres: (value: string | undefined) => setParam('genres', value),
    setSeason: (value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) { next.set('season', value); } else { next.delete('season'); }
        next.delete('status');
        next.delete('page');
        return next;
      });
    },
  };
}
