import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AppError } from '@/types/errors.types';
import type { DeleteUserResponse } from '@/types/auth.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { authService } from '@/services/authService';

export default function useDeleteStudent() {
  return useMutation<
    DeleteUserResponse,
    AppError,
    { studentId: string | number }
  >({
    mutationFn: async ({ studentId }) => {
      return authService.deleteUser(studentId);
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Student deleted');
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (err: unknown) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
}
