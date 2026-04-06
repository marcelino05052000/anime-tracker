import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

interface VoteData {
  commentId: string;
  value: 1 | -1;
  malId: number;
  parentId?: string | null;
}

interface RemoveVoteData {
  commentId: string;
  malId: number;
  parentId?: string | null;
}

export function useVoteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, value }: VoteData) => {
      await backendApi.post(`/comments/${commentId}/vote`, { value });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, variables.malId] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENT_REPLIES, variables.parentId] });
      }
    },
  });
}

export function useRemoveVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: RemoveVoteData) => {
      await backendApi.delete(`/comments/${commentId}/vote`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, variables.malId] });
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENT_REPLIES, variables.parentId] });
      }
    },
  });
}
