import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface EditForumCommentData {
  postId: string;
  commentId: string;
  text: string;
  parentId?: string | null;
}

export function useEditForumComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId, text }: EditForumCommentData) => {
      const { data } = await backendApi.patch(`/forum/${postId}/comments/${commentId}`, { text });
      return data.comment;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_COMMENTS, variables.postId] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_COMMENT_REPLIES, variables.parentId] });
      }
    },
  });
}
