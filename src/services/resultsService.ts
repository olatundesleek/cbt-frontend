import api from '@/lib/axios';
import type { AdminSingleResultResponse } from '@/types/results.types';
import {
  getAllResultAdminResponse,
  StudentResultCoursesResponse,
  // StudentResultDownloadResponse,
} from '@/types/results.types';

export const resultsServices = {
  getStudentResultCourses: async (): Promise<StudentResultCoursesResponse> => {
    const response = await api.get('/results/student/courses', {
      withCredentials: true,
    });

    return (response.data?.data ??
      response.data) as StudentResultCoursesResponse;
  },

  downloadStudentResultCourses: async (format: 'pdf' | 'excel') => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/results/student/courses/download?format=${format}`,
      '_blank',
    );
  },

  getAllResultAdmin: async (): Promise<getAllResultAdminResponse> => {
    const response = await api.get('/results');

    return response.data;
  },
  updateResultVisibility: async (testId: number, showResult: boolean) => {
    const response = await api.patch(`results/test/${testId}/release`, {
      showResult,
    });

    return response.data;
  },
  getTestBySessionId: async (
    sessionId: number,
  ): Promise<AdminSingleResultResponse> => {
    const response = await api.get(`results/test/${sessionId}`);
    return response.data as AdminSingleResultResponse;
  },
};
