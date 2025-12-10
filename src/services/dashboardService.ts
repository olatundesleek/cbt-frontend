import api from "@/lib/axios";
import type { PaginationParams } from '@/types/pagination.types';
import {
  AllClassesResponse,
  AllCoursesResponse,
  AllQuestionBankResponse,
  AllTeachersResponse,
  DashboardResponse,
  QuestionsInBank,
} from '@/types/dashboard.types';

export const dashboardServices = {
  // you don't need to statically include withCredentials. its already part of the axios api config
  getDashboard: async <T = unknown>(): Promise<DashboardResponse<T>> => {
    const response = await api.get('/dashboard');
    return response.data as DashboardResponse<T>;
  },

  getAllClasses: async (
    params?: PaginationParams,
  ): Promise<AllClassesResponse> => {
    const response = await api.get('/class', { params });
    return response.data;
  },

  getAllTeacher: async (
    params?: PaginationParams,
  ): Promise<AllTeachersResponse> => {
    const response = await api.get('/teachers', { params });
    return response.data;
  },

  getAllCourses: async (
    params?: PaginationParams,
  ): Promise<AllCoursesResponse> => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getAllQuestionBank: async (
    params?: PaginationParams,
  ): Promise<AllQuestionBankResponse> => {
    const response = await api.get('/question-banks', { params });
    return response.data;
  },

  getQuestionsInBank: async (bankId: string): Promise<QuestionsInBank[]> => {
    const response = await api.get(`/question-banks/${bankId}/questions`);
    return response.data.data;
  },

  deleteQuestion: async (questionId: string) => {
    const response = await api.delete(`/question/${questionId}`);
    return response.data.data;
  },

  getQuestionsTemplate: () => '/question/upload/template',

  uploadQuestions: async (formData: FormData) => {
    const response = await api.post('/question/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
