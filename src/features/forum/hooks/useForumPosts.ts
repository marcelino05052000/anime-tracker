import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { ForumPost, ForumCategory, ForumPostSort } from '@/types';

interface UseForumPostsParams {
  page?: number;
  limit?: number;
  category?: ForumCategory;
  mal_id?: number;
  sort?: ForumPostSort;
}

interface ForumPostsResponse {
  posts: ForumPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useForumPosts(params: UseForumPostsParams = {}) {
  const { page = 1, limit = 10, category, mal_id, sort = 'recent' } = params;

  return useQuery({
    queryKey: [QUERY_KEYS.FORUM_POSTS, { page, limit, category, mal_id, sort }],
    queryFn: async (): Promise<ForumPostsResponse> => {
      const { data } = await backendApi.get('/forum', {
        params: { page, limit, category, mal_id, sort },
      });
      return data;
    },
  });
}
