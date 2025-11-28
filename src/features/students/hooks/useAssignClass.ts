import getErrorDetails from '@/utils/getErrorDetails';
import { useMutation } from '@tanstack/react-query';
import { studentsServices } from '@/services/studentsService';
import toast from 'react-hot-toast';
import { queryClient } from '@/providers/query-provider';
import { AppError } from '@/types/errors.types';
import type { AssignToClassResponse } from '@/types/students.types';

type AssignPayload = {
  classId: number;
};

export default function useAssignClass() {
  return useMutation<
    AssignToClassResponse,
    AppError,
    { studentId: string | number; payload: AssignPayload }
  >({
    mutationFn: async (vars) => {
      const { studentId, payload } = vars;
      return studentsServices.assignClass(studentId, payload);
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Assigned to class');
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (err: unknown) => {
      const msg = getErrorDetails(err);
      toast.error(msg || 'Something went wrong');
    },
  });
}
