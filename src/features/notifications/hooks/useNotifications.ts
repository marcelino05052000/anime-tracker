import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import type { NotificationsResponse } from '@/types';

export function useNotifications(page: number = 1) {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, page],
    queryFn: async (): Promise<NotificationsResponse> => {
      const { data } = await backendApi.get<NotificationsResponse>(`/notifications?page=${page}`);
      return data;
    },
    enabled: isAuthenticated,
  });
}
