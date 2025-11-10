import api from '@/lib/axios';
import { StudentResultCoursesResponse } from '@/types/results.types';

export const resultsServices = {
  getStudentResultCourses: async (): Promise<StudentResultCoursesResponse> => {
    const response = await api.get('/results/student/courses', {
      withCredentials: true,
    });
    // Backend wraps payload as { success, message, data }
    return (response.data?.data ??
      response.data) as StudentResultCoursesResponse;
  },
};
