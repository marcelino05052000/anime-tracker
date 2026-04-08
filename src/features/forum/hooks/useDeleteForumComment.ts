import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface DeleteForumCommentData {
  postId: string;
  commentId: string;
  parentId?: string | null;
}

export function useDeleteForumComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId }: DeleteForumCommentData) => {
      await backendApi.delete(`/forum/${postId}/comments/${commentId}`);
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
