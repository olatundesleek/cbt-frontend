import { useMutation } from '@tanstack/react-query';
import { studentsServices } from '@/services/studentsService';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { errorLogger } from '@/lib/axios';
import { AppError } from '@/types/errors.types';

type AssignPayload = {
  username: string;
  studentId: string | number;
  classId: number;
};

export default function useAssignClass() {
  return useMutation<
    unknown,
    AppError,
    { studentId: string | number; payload: AssignPayload }
  >({
    mutationFn: async (vars) => {
      const { studentId, payload } = vars;
      return studentsServices.assignClass(studentId, payload);
    },
    onSuccess: () => {
      toast.success('Assigned to class');
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (err: AppError) => {
      errorLogger(err);
    },
  });
}
