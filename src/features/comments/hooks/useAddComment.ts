import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface AddCommentData {
  malId: number;
  text: string;
  parentId?: string;
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ malId, text, parentId }: AddCommentData) => {
      const { data } = await backendApi.post(`/comments/${malId}`, {
        text,
        parent_id: parentId,
      });
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
