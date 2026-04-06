import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { ApiComment, CommentSort } from '@/types';

export function useComments(malId: number, sort: CommentSort = 'recent') {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, malId, sort],
    queryFn: async (): Promise<ApiComment[]> => {
      const { data } = await backendApi.get(`/comments/${malId}`, {
        params: { sort },
      });
      return data.comments;
    },
  });
}
