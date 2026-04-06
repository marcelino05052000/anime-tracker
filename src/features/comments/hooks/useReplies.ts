import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { ApiComment } from '@/types';

export function useReplies(commentId: string, enabled: boolean) {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENT_REPLIES, commentId],
    queryFn: async (): Promise<ApiComment[]> => {
      const { data } = await backendApi.get(`/comments/${commentId}/replies`);
      return data.replies;
    },
    enabled,
  });
}
