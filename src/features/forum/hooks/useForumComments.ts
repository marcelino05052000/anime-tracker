import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { ForumComment, ForumCommentSort } from '@/types';

export function useForumComments(postId: string, sort: ForumCommentSort = 'recent') {
  return useQuery({
    queryKey: [QUERY_KEYS.FORUM_COMMENTS, postId, sort],
    queryFn: async (): Promise<ForumComment[]> => {
      const { data } = await backendApi.get(`/forum/${postId}/comments`, {
        params: { sort },
      });
      return data.comments;
    },
    enabled: !!postId,
  });
}
