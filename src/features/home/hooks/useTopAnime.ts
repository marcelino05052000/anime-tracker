import { useQuery } from '@tanstack/react-query';
import { animeService } from '@/services/jikan/anime.service';
import { QUERY_KEYS } from '@/utils/constants';

export function useTopAnime(page: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.TOP_ANIME, page],
    queryFn: () => animeService.getTop(page),
    placeholderData: (previousData) => previousData,
  });
}
