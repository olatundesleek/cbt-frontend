import api from '@/lib/axios';
import {
  StudentResultCoursesResponse,
  StudentResultDownloadResponse,
} from '@/types/results.types';

export const resultsServices = {
  getStudentResultCourses: async (): Promise<StudentResultCoursesResponse> => {
    const response = await api.get('/results/student/courses', {
      withCredentials: true,
    });

    return (response.data?.data ??
      response.data) as StudentResultCoursesResponse;
  },

  // downloadStudentResultCourses:
  //   async (): Promise<StudentResultDownloadResponse> => {
  //     const response = await api.get('/results/student/courses/download', {
  //       withCredentials: true,
  //     });

  //     return response.data;
  //   },
  downloadStudentResultCourses: async (format: 'pdf' | 'excel') => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/results/student/courses/download?format=${format}`,
      '_blank',
    );
  },
};
