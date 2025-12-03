import { authService } from '@/services/authService';
import { LoginPayload, LoginResponse } from '@/types/auth.types';
import { AppError } from '@/types/errors.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useLogin() {
  const queryClient = useQueryClient();

  const { replace } = useRouter();
  const {
    mutate: login,
    isPending: isLoginPending,
    isError: isLoginError,
  } = useMutation<LoginResponse, AppError, LoginPayload>({
    mutationFn: authService.login,
    mutationKey: ['login'],
    onSuccess: (data) => {
      if (!data.success) return;

      queryClient.invalidateQueries();

      const role = data.data.data.role;

      if (role === 'STUDENT') {
        toast.success(data.message);
        replace('/dashboard');
        return;
      }

      toast.success(data.message);
      replace('/admin/dashboard');
    },

    onError: (err) => toast.error(getErrorDetails(err)),
  });

  return { login, isLoginPending, isLoginError };
}
