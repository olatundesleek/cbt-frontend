import { useMutation } from '@tanstack/react-query';
import { submitAnswersAndGetNext } from '@/services/testsService';
import { useTestAttempt } from '../context/TestAttemptContext';
import { useTestResult } from '../context/TestResultContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

/**
 * React Query hook to submit answers for current page and get next questions
 * Updates context with new questions and progress
 */
export function useSubmitAnswersAndGetNext() {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    setQuestions,
    setProgress,
    setshowSubmitButton,
  } = useTestAttempt();
  const { setTestResult } = useTestResult();
  const router = useRouter();

  return useMutation({
    mutationFn: submitAnswersAndGetNext,
    onSuccess: (data) => {
      if (data.success && data.data) {
        if (data.data.finished && 'data' in data.data) {
          // Finished: store result and redirect
          setTestResult(data.data.data);
          router.push('/tests/ended');
        } else {
          // Not finished: update questions and progress
          setQuestions(data.data.nextQuestions);
          setProgress(data.data.progress);
          setshowSubmitButton(data.data.showSubmitButton);
          if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
          }
        }
      }
    },
    onError: (error: unknown) => {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Failed to submit answers';
      toast.error(message);
    },
  });
}
