import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface EditPostData {
  postId: string;
  title?: string;
  body?: string;
  tags?: string[];
}

export function useEditPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, ...data }: EditPostData) => {
      const { data: res } = await backendApi.patch(`/forum/${postId}`, data);
      return res.post;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POST, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POSTS] });
    },
  });
}
