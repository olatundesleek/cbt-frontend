import { studentsServices } from '@/services/studentsService';
import { useQuery } from '@tanstack/react-query';
import { AdminStudentsResponse } from '../../../types/students.types';

export function useAdminStudents() {
  const queryResponse = useQuery<AdminStudentsResponse>({
    queryFn: studentsServices.getAdminStudents,
    queryKey: ['adminStudents'],
  });

  return queryResponse;
}
