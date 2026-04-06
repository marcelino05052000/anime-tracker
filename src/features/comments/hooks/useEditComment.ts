import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface EditCommentData {
  commentId: string;
  text: string;
  malId: number;
  parentId?: string | null;
}

export function useEditComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, text }: EditCommentData) => {
      const { data } = await backendApi.patch(`/comments/${commentId}`, { text });
      return data.comment;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, variables.malId] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENT_REPLIES, variables.parentId] });
      }
    },
  });
}
