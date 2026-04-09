import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface AddForumCommentData {
  postId: string;
  text: string;
  parentId?: string;
}

export function useAddForumComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, text, parentId }: AddForumCommentData) => {
      const { data } = await backendApi.post(`/forum/${postId}/comments`, {
        text,
        parent_id: parentId,
      });
      return data.comment;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_COMMENTS, variables.postId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POST, variables.postId] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_COMMENT_REPLIES, variables.parentId] });
      }
    },
  });
}
