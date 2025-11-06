import { authService } from '@/services/authService';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useLogin() {
  const { push } = useRouter();
  const {
    mutate: login,
    isPending: isLoginPending,
    isError: isLoginError,
  } = useMutation({
    mutationFn: authService.login,
    mutationKey: ['login'],
    onSuccess: (data) => {
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        push('/dashboard');
      }
    },

    onError: (err) => {
      toast.error(err.message);
      console.log(err);
    },
  });

  return { login, isLoginPending, isLoginError };
}
