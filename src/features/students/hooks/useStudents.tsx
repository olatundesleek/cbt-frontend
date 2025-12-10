import { studentsServices } from '@/services/studentsService';
import { useQuery } from '@tanstack/react-query';
import type { PaginationParams } from '@/types/pagination.types';
import { AdminStudentsResponse } from '../../../types/students.types';

export function useAdminStudents(params?: PaginationParams) {
  const queryResponse = useQuery<AdminStudentsResponse>({
    queryFn: () => studentsServices.getAdminStudents(params),
    queryKey: ['adminStudents', params],
  });

  return queryResponse;
}
