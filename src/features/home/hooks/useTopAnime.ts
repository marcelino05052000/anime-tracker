import { useQuery } from '@tanstack/react-query';
import { animeService } from '@/services/jikan/anime.service';
import { QUERY_KEYS } from '@/utils/constants';

export function useTopAnime() {
  return useQuery({
    queryKey: [QUERY_KEYS.TOP_ANIME],
    queryFn: () => animeService.getTop(),
    select: (data) => data.data,
  });
}
