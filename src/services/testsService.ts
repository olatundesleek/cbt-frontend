import axios from '@/lib/axios';
import {
  TestsResponse,
  StartTestSessionRequest,
  StartTestSessionResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  SubmitTestSessionResponse,
  SubmitAnswersAndGetNextRequest,
  SubmitAnswersAndGetNextResponse,
  SubmitAnswersAndGetPreviousRequest,
  SubmitAnswersAndGetPreviousResponse,
  FetchQuestionsByNumberResponse,
  RegisteredCoursesResponse,
  AdminTestsResponse,
  CreateTestRequest,
  CreateTestResponse,
} from '@/types/tests.types';
import type { PaginationParams } from '@/types/pagination.types';
import api from '@/lib/axios';

export const testsServices = {
  getTests: async (params?: PaginationParams): Promise<TestsResponse> => {
    const response = await axios.get('/tests', {
      withCredentials: true,
      params,
    });
    return response.data;
  },

  getRegisteredCourses: async (): Promise<RegisteredCoursesResponse> => {
    const response = await axios.get('/courses');
    return response.data;
  },

  getAdminTests: async (
    params?: PaginationParams,
  ): Promise<AdminTestsResponse> => {
    const response = await axios.get('/tests', { params });
    return response.data;
  },
  createTest: async (data: CreateTestRequest): Promise<CreateTestResponse> => {
    const response = await axios.post('/tests', data);
    return response.data;
  },
  updateTest: async (
    testId: number | string,
    data: CreateTestRequest,
  ): Promise<CreateTestResponse> => {
    const response = await axios.patch(`/tests/${testId}`, data);
    return response.data;
  },
  deleteTest: async (testId: number | string) => {
    const response = await axios.delete(`/tests/${testId}`);
    return response.data;
  },
  endAllTestSessions: async () => {
    const response = await api.post('/sessions/end-all-sessions');
    return response.data;
  },
};

export const startTestSession = async ({
  testId,
}: StartTestSessionRequest): Promise<StartTestSessionResponse> => {
  const response = await axios.post(`/sessions/start/${testId}`);
  return response.data;
};

export const submitAnswer = async (
  sessionId: string | number,
  data: SubmitAnswerRequest,
): Promise<SubmitAnswerResponse> => {
  const response = await axios.post(`/testSessions/${sessionId}/answers`, data);
  return response.data;
};

export const submitTestSession = async (
  sessionId: string | number,
): Promise<SubmitTestSessionResponse> => {
  const response = await axios.post(`/sessions/${sessionId}/finish`);
  return response.data;
};

export const submitAnswersAndGetNext = async (
  data: SubmitAnswersAndGetNextRequest,
): Promise<SubmitAnswersAndGetNextResponse> => {
  const response = await axios.post('/sessions/questions-next/answer', data);
  return response.data;
};

export const submitAnswersAndGetPrevious = async (
  data: SubmitAnswersAndGetPreviousRequest,
): Promise<SubmitAnswersAndGetPreviousResponse> => {
  const response = await axios.post(
    '/sessions/questions-previous/answer',
    data,
  );
  return response.data;
};

// export const getTestSession = async (
//   sessionId: string | number,
// ): Promise<StartTestSessionResponse> => {
//   const response = await axios.get(`sessions/testSessions/${sessionId}`);
//   return response.data;
// };

export const fetchQuestionsByNumber = async (
  sessionId: number | string,
  questionNumber: number,
): Promise<FetchQuestionsByNumberResponse> => {
  const response = await axios.get(
    `/sessions/${sessionId}/questions/${questionNumber}`,
  );
  return response.data;
};
