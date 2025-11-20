import axios from '@/lib/axios';
import { AdminStudentsResponse } from '../types/students.types';

export const studentsServices = {
  getAdminStudents: async (): Promise<AdminStudentsResponse> => {
    const response = await axios.get('/students');
    return response.data;
  },
};
