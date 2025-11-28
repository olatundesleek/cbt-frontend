import { useMutation } from '@tanstack/react-query';
// import { studentsServices } from '@/services/studentsService';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AppError } from '@/types/errors.types';
import type { ChangePasswordResponse } from '@/types/auth.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { authService } from '@/services/authService';

type Payload = { newPassword: string; confirmPassword: string };

export default function useChangeStudentPassword() {
  return useMutation<
    ChangePasswordResponse,
    AppError,
    { studentId: string | number; payload: Payload }
  >({
    mutationFn: async ({ studentId, payload }) => {
      return authService.changePassword(studentId, payload);
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Password updated');
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (err: unknown) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
}
