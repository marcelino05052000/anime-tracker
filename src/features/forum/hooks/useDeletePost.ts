import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      await backendApi.delete(`/forum/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POSTS] });
    },
  });
}
