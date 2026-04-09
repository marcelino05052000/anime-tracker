import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { ForumPost } from '@/types';

export function useForumPost(postId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.FORUM_POST, postId],
    queryFn: async (): Promise<ForumPost> => {
      const { data } = await backendApi.get(`/forum/${postId}`);
      return data.post;
    },
    enabled: !!postId,
  });
}
