import { useMutation } from '@tanstack/react-query';
import { studentsServices } from '@/services/studentsService';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { errorLogger } from '@/lib/axios';
import { AppError } from '@/types/errors.types';

type Payload = { newPassword: string; confirmPassword: string };

export default function useChangeStudentPassword() {
  return useMutation<
    unknown,
    AppError,
    { studentId: string | number; payload: Payload }
  >({
    mutationFn: async ({ studentId, payload }) => {
      return studentsServices.changePassword(studentId, payload);
    },
    onSuccess: () => {
      toast.success('Password updated');
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (err: AppError) => {
      errorLogger(err);
    },
  });
}
