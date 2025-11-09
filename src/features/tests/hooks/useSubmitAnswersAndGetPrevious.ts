import { useMutation } from '@tanstack/react-query';
import { submitAnswersAndGetPrevious } from '@/services/testsService';
import { useTestAttempt } from '../context/TestAttemptContext';
import toast from 'react-hot-toast';
import {
  SubmitAnswersAndGetPreviousRequest,
  SubmitAnswersAndGetPreviousResponse,
} from '@/types/tests.types';
import { AppError } from '@/types/errors.types';

/**
 * React Query hook to submit answers for current page and get previous questions
 * Updates context with new questions and progress
 */
export function useSubmitAnswersAndGetPrevious() {
  const {
    currentPage,
    setCurrentPage,
    setQuestions,
    setProgress,
    setshowSubmitButton,
  } = useTestAttempt();

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
        setshowSubmitButton(data.data.showSubmitButton);
        // Decrement page after successful fetch
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
