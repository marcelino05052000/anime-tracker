import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface DeleteCommentData {
  commentId: string;
  malId: number;
  parentId?: string | null;
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: DeleteCommentData) => {
      await backendApi.delete(`/comments/${commentId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, variables.malId] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENT_REPLIES, variables.parentId] });
      }
    },
  });
}
