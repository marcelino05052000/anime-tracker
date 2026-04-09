import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface VoteData {
  postId: string;
  commentId: string;
  value: 1 | -1;
  parentId?: string | null;
}

interface RemoveVoteData {
  postId: string;
  commentId: string;
  parentId?: string | null;
}

export function useVoteForumComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId, value }: VoteData) => {
      await backendApi.post(`/forum/${postId}/comments/${commentId}/vote`, { value });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_COMMENTS, variables.postId] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_COMMENT_REPLIES, variables.parentId] });
      }
    },
  });
}

export function useRemoveForumVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId }: RemoveVoteData) => {
      await backendApi.delete(`/forum/${postId}/comments/${commentId}/vote`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_COMMENTS, variables.postId] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_COMMENT_REPLIES, variables.parentId] });
      }
    },
  });
}
