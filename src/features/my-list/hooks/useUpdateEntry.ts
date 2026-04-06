import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { WatchStatus } from '@/utils/constants';

interface UpdateEntryData {
  mal_id: number;
  status?: WatchStatus;
  user_score?: number | null;
  current_episode?: number | null;
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mal_id, ...updates }: UpdateEntryData) => {
      const { data } = await backendApi.patch(`/list/${mal_id}`, updates);
      return data.entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_LIST] });
    },
  });
}
