import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { animeService } from '@/services/jikan/anime.service';
import { QUERY_KEYS } from '@/utils/constants';

export function useAnimeDetails() {
  const { id } = useParams<{ id: string }>();
  const malId = Number(id);

  return useQuery({
    queryKey: [QUERY_KEYS.ANIME_DETAILS, malId],
    queryFn: () => animeService.getById(malId),
    enabled: !isNaN(malId) && malId > 0,
  });
}
