import axios from '@/lib/axios';
import { AdminStudentsResponse } from '../types/students.types';

export const studentsServices = {
  getAdminStudents: async (): Promise<AdminStudentsResponse> => {
    const response = await axios.get('/students');
    return response.data;
  },
  assignClass: async (
    studentId: string | number,
    payload: { username: string; studentId: string | number; classId: number },
  ) => {
    const response = await axios.post(
      `/students/${studentId}/assign-class`,
      payload,
    );
    return response.data;
  },
  changePassword: async (
    studentId: string | number,
    payload: { newPassword: string; confirmPassword: string },
  ) => {
    const response = await axios.patch(
      `/change-user-password/${studentId}`,
      payload,
    );
    return response.data;
  },
  deleteUser: async (studentId: string | number) => {
    const response = await axios.delete(`/delete-user/${studentId}`);
    return response.data;
  },
};
