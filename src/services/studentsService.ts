import {
  AdminStudentsResponse,
  AssignToClassResponse,
} from '../types/students.types';
import api from '@/lib/axios';

export const studentsServices = {
  getAdminStudents: async (): Promise<AdminStudentsResponse> => {
    const response = await api.get('/students');
    return response.data;
  },
  assignClass: async (
    studentId: string | number,
    payload: { classId: number },
  ): Promise<AssignToClassResponse> => {
    const response = await api.post(
      `/students/${studentId}/assign-class`,
      payload,
    );
    return response.data;
  },
};
