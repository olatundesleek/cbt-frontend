import api from '@/lib/axios';
import type { AdminSingleResultResponse } from '@/types/results.types';
import {
  getAllResultAdminResponse,
  StudentResultCoursesResponse,
  // StudentResultDownloadResponse,
} from '@/types/results.types';
import type { PaginationParams } from '@/types/pagination.types';

export const resultsServices = {
  getStudentResultCourses: async (
    params?: PaginationParams,
  ): Promise<StudentResultCoursesResponse> => {
    const response = await api.get('/results/student/courses', {
      withCredentials: true,
      params,
    });

    return (response.data?.data ??
      response.data) as StudentResultCoursesResponse;
  },

  // downloadStudentResultCourses: async (format: 'pdf' | 'excel') => {
  //   window.open(
  //     `${process.env.NEXT_PUBLIC_API_URL}/results/student/courses/download?format=${format}`);
  // },

  downloadStudentResultCourses: async (format: 'pdf' | 'excel') => {
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/results/student/courses/download?format=${format}`;

    // 1. Create a temporary anchor element
    const link = document.createElement('a');

    // 2. Set the href to the download endpoint
    link.href = downloadUrl;

    // 3. Set the 'download' attribute (optional, suggests a filename to the browser)
    // This attribute hints to the browser that this is a download link.
    // The actual filename is usually determined by the server's Content-Disposition header.
    link.setAttribute('download', `student-results.${format}`);

    // 4. Append link to body (necessary for Firefox to work properly)
    document.body.appendChild(link);

    // 5. Simulate a click on the link
    link.click();

    // 6. Clean up: remove the link from the document
    document.body.removeChild(link);
  },

  getAllResultAdmin: async (
    params?: PaginationParams,
  ): Promise<getAllResultAdminResponse> => {
    const response = await api.get('/results', { params });

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
