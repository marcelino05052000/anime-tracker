import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { ForumCategory } from '@/types';

interface CreatePostData {
  mal_id: number;
  anime_title: string;
  anime_image_url: string;
  title: string;
  body: string;
  category: ForumCategory;
  episode_number?: number;
  tags?: string[];
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const { data: res } = await backendApi.post('/forum', data);
      return res.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FORUM_POSTS] });
    },
  });
}
