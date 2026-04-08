import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { ForumComment } from '@/types';

export function useForumReplies(postId: string, commentId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.FORUM_COMMENT_REPLIES, commentId],
    queryFn: async (): Promise<ForumComment[]> => {
      const { data } = await backendApi.get(`/forum/${postId}/comments/${commentId}/replies`);
      return data.replies;
    },
    enabled: !!commentId,
  });
}
