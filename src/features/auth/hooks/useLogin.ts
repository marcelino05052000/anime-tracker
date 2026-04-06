import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';
import type { AuthUser } from './useAuth';

interface LoginData {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData): Promise<AuthUser> => {
      const res = await backendApi.post('/auth/login', data);
      return res.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData([QUERY_KEYS.AUTH_USER], user);
    },
  });
}
