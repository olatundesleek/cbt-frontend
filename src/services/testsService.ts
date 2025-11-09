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
} from '@/types/tests.types';

export const testsServices = {
  getTests: async (): Promise<TestsResponse> => {
    const response = await axios.get('/tests', {
      withCredentials: true,
    });
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
