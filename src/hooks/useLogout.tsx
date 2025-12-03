'use client';

import { authService } from '@/services/authService';
import { useUserStore } from '@/store/useUserStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useLogout() {
  const { replace } = useRouter();
  const queryClient = useQueryClient();
  const resetUser = useUserStore((state) => state.reset);

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: authService.logout,

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries();
      resetUser();
      replace('/');
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { logout, isLoggingOut };
}
