import { useMutation } from '@tanstack/react-query';
import { submitAnswer } from '@/services/testsService';
import { SubmitAnswerRequest } from '@/types/tests.types';

/**
 * React Query hook to submit an answer for a test session
 */
export function useSubmitAnswer(sessionId: string | number) {
  return useMutation({
    mutationFn: (data: SubmitAnswerRequest) => submitAnswer(sessionId, data),
  });
}
