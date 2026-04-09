import { useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi, markLoggedOut } from '@/services/backendApi';
import { QUERY_KEYS } from '@/utils/constants';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      markLoggedOut();
      await backendApi.post('/auth/logout');
    },
    onSettled: () => {
      queryClient.setQueryData([QUERY_KEYS.AUTH_USER], null);
      queryClient.removeQueries();
    },
  });
}
