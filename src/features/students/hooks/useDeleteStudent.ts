import { useMutation } from '@tanstack/react-query';
import { studentsServices } from '@/services/studentsService';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { errorLogger } from '@/lib/axios';
import { AppError } from '@/types/errors.types';

export default function useDeleteStudent() {
  return useMutation<unknown, AppError, { studentId: string | number }>({
    mutationFn: async ({ studentId }) => {
      return studentsServices.deleteUser(studentId);
    },
    onSuccess: () => {
      toast.success('Student deleted');
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (err: AppError) => {
      errorLogger(err);
    },
  });
}
