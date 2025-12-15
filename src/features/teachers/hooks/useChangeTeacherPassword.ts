import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AppError } from '@/types/errors.types';
import type { ChangePasswordResponse } from '@/types/auth.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { authService } from '@/services/authService';

type Payload = { newPassword: string; confirmPassword: string };

export default function useChangeTeacherPassword() {
  return useMutation<
    ChangePasswordResponse,
    AppError,
    { teacherId: string | number; payload: Payload }
  >({
    mutationFn: async ({ teacherId, payload }) => {
      return authService.changePassword(teacherId, payload);
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Password updated');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
    onError: (err: unknown) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
}
