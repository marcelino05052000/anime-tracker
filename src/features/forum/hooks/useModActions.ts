import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

export function useTogglePin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await backendApi.patch(`/forum/${postId}/pin`);
      return data.post;
    },
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POST, postId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POSTS] });
    },
  });
}

export function useToggleLock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await backendApi.patch(`/forum/${postId}/lock`);
      return data.post;
    },
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POST, postId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POSTS] });
    },
  });
}
