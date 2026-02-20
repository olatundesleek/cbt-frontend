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

  downloadStudentResultCourses: async (
    format: 'pdf' | 'excel',
    params?: PaginationParams,
  ) => {
    const query = new URLSearchParams();
    query.append('format', format);
    Object.entries(params ?? {})
      .filter(
        ([key, value]) =>
          // key !== 'limit' &&
          // key !== 'page' &&
          // key !== 'search' &&
          value !== undefined,
      )
      .forEach(([key, value]) => {
        query.append(key, String(value));
      });

    const url = `${
      process.env.NEXT_PUBLIC_API_URL
    }/results/student/courses/download?${query.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // 🔥 REQUIRED for Firefox to send cookies
    });

    if (!response.ok) {
      throw new Error('Failed to download result');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `results`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  downloadAdminResults: async (
    format: 'pdf' | 'excel',
    params?: PaginationParams,
  ) => {
    const query = new URLSearchParams();
    query.append('format', format);
    Object.entries(params ?? {})
      .filter(
        ([key, value]) =>
          // key !== 'limit' && key !== 'page' &&
          value !== undefined,
      )
      .forEach(([key, value]) => {
        query.append(key, String(value));
      });

    const url = `${
      process.env.NEXT_PUBLIC_API_URL
    }/results/download?${query.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to download result');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `student-results`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
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
    const response = await api.get(`results/session/${sessionId}`);
    return response.data as AdminSingleResultResponse;
  },
};
