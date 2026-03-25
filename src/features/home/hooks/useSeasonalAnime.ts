import { useQuery } from '@tanstack/react-query';
import { animeService } from '@/services/jikan/anime.service';
import { QUERY_KEYS } from '@/utils/constants';

export function useSeasonalAnime(page: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.SEASONAL, page],
    queryFn: () => animeService.getSeasonal(page),
    placeholderData: (previousData) => previousData,
  });
}
