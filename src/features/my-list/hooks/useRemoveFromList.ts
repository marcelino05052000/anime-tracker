import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

export function useRemoveFromList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mal_id: number) => {
      await backendApi.delete(`/list/${mal_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_LIST] });
    },
  });
}
