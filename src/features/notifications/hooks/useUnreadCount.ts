import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import type { UnreadCountResponse } from '@/types';

export function useUnreadCount() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION_UNREAD_COUNT],
    queryFn: async (): Promise<number> => {
      const { data } = await backendApi.get<UnreadCountResponse>('/notifications/unread-count');
      return data.count;
    },
    enabled: isAuthenticated,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}
