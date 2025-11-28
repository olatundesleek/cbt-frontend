import { useMutation } from '@tanstack/react-query';
import { submitAnswersAndGetPrevious } from '@/services/testsService';
import { useTestAttemptStore } from '@/store/useTestAttemptStore';
import toast from 'react-hot-toast';
import {
  SubmitAnswersAndGetPreviousRequest,
  SubmitAnswersAndGetPreviousResponse,
} from '@/types/tests.types';
import { AppError } from '@/types/errors.types';
import getErrorDetails from '@/utils/getErrorDetails';

/**
 * React Query hook to submit answers for current page and get previous questions
 * Updates context with new questions and progress
 */
export function useSubmitAnswersAndGetPrevious() {
  const currentPage = useTestAttemptStore((s) => s.currentPage);
  const setCurrentPage = useTestAttemptStore((s) => s.setCurrentPage);
  const setQuestions = useTestAttemptStore((s) => s.setQuestions);
  const setProgress = useTestAttemptStore((s) => s.setProgress);
  const setShowSubmitButton = useTestAttemptStore((s) => s.setShowSubmitButton);
  const updateQuestionMap = useTestAttemptStore((s) => s.updateQuestionMap);

  return useMutation<
    SubmitAnswersAndGetPreviousResponse,
    AppError,
    SubmitAnswersAndGetPreviousRequest
  >({
    mutationFn: submitAnswersAndGetPrevious,
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Update questions with previous batch
        setQuestions(data.data.previousQuestions);
        // Update progress
        setProgress(data.data.progress);
        // Update submit button visibility
        setShowSubmitButton(data.data.showSubmitButton);
        // Decrement page after successful fetch
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }

        updateQuestionMap(
          data.data.previousQuestions.map((q) => ({
            id: q.id,
            displayNumber: q.displayNumber,
          })),
        );
      }
    },
    onError: (err) => {
      const message = getErrorDetails(err);
      toast.error(message);
    },
  });
}
