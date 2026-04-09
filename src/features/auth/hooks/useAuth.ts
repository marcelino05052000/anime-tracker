import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export function useAuth() {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH_USER],
    queryFn: async (): Promise<AuthUser> => {
      const { data } = await backendApi.get('/auth/me');
      return data.user;
    },
    retry: false,
    staleTime: Infinity,
  });
}
