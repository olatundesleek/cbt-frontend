import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AppError } from '@/types/errors.types';
import type { DeleteUserResponse } from '@/types/auth.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { authService } from '@/services/authService';

export default function useDeleteTeacher() {
  return useMutation<
    DeleteUserResponse,
    AppError,
    { teacherId: string | number }
  >({
    mutationFn: async ({ teacherId }) => {
      return authService.deleteUser(teacherId);
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Teacher deleted');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
    onError: (err: unknown) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
}
