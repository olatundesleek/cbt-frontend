import { useMutation } from '@tanstack/react-query';
import { submitAnswer } from '@/services/testsService';
import { SubmitAnswerRequest, SubmitAnswerResponse } from '@/types/tests.types';
import { AppError } from '@/types/errors.types';
import toast from 'react-hot-toast';

/**
 * React Query hook to submit an answer for a test session
 */
export function useSubmitAnswer(sessionId: string | number) {
  return useMutation<SubmitAnswerResponse, AppError, SubmitAnswerRequest>({
    mutationFn: (data: SubmitAnswerRequest) => submitAnswer(sessionId, data),
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
