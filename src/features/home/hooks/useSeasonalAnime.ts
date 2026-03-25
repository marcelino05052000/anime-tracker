import { useQuery } from '@tanstack/react-query';
import { animeService } from '@/services/jikan/anime.service';
import { QUERY_KEYS } from '@/utils/constants';

export function useSeasonalAnime() {
  return useQuery({
    queryKey: [QUERY_KEYS.SEASONAL],
    queryFn: () => animeService.getSeasonal(),
    select: (data) => data.data,
  });
}
