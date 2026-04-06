import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import type { UserListEntry } from '@/types';

export interface ApiListEntry extends Omit<UserListEntry, 'added_at' | 'updated_at'> {
  _id: string;
  user: string;
  added_at: string;
  updated_at: string;
}

export function useMyList() {
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [QUERY_KEYS.MY_LIST],
    queryFn: async (): Promise<ApiListEntry[]> => {
      const { data } = await backendApi.get('/list');
      return data.entries;
    },
    enabled: isAuthenticated,
  });
}
