import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface ImportEntry {
  mal_id: number;
  title: string;
  image_url: string;
  score: number | null;
  episodes: number | null;
  status: string;
  user_score: number | null;
  current_episode: number | null;
  added_at: string;
  updated_at: string;
}

export function useImportList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entries: ImportEntry[]): Promise<number> => {
      const { data } = await backendApi.post('/list/import', { entries });
      return data.imported;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_LIST] });
    },
  });
}
