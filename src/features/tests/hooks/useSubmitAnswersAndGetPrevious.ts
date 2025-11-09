import { useMutation } from '@tanstack/react-query';
import { submitAnswersAndGetPrevious } from '@/services/testsService';
import { useTestAttempt } from '../context/TestAttemptContext';
import toast from 'react-hot-toast';

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

  return useMutation({
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
    onError: (error: unknown) => {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Failed to load previous questions';
      toast.error(message);
    },
  });
}
