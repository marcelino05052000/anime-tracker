import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { WatchStatus } from '@/utils/constants';
import type { Anime } from '@/types';

interface AddToListData {
  anime: Anime;
  status: WatchStatus;
  user_score?: number | null;
  current_episode?: number | null;
}

export function useAddToList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ anime, status, user_score, current_episode }: AddToListData) => {
      const { data } = await backendApi.post('/list', {
        mal_id: anime.mal_id,
        title: anime.title_english ?? anime.title,
        image_url: anime.images.webp.image_url,
        score: anime.score,
        episodes: anime.episodes,
        status,
        user_score: user_score ?? null,
        current_episode: current_episode ?? null,
      });
      return data.entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_LIST] });
    },
  });
}
