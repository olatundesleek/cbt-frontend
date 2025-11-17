import { useMutation } from '@tanstack/react-query';
import { submitAnswersAndGetNext } from '@/services/testsService';
import { useTestAttempt } from '../context/TestAttemptContext';
import { useTestResult } from '../context/TestResultContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  SubmitAnswersAndGetNextRequest,
  SubmitAnswersAndGetNextResponse,
} from '@/types/tests.types';
import { AppError } from '@/types/errors.types';

/**
 * React Query hook to submit answers for current page and get next questions
 * Updates context with new questions and progress
 */
export function useSubmitAnswersAndGetNext() {
  const { setCurrentPage, setQuestions, setProgress, setshowSubmitButton } =
    useTestAttempt();
  const { setTestResult } = useTestResult();
  const router = useRouter();

  return useMutation<
    SubmitAnswersAndGetNextResponse,
    AppError,
    SubmitAnswersAndGetNextRequest
  >({
    mutationFn: submitAnswersAndGetNext,
    onSuccess: (data) => {
      // Type guard: check if response has success field (first two variants)
      if ('success' in data && data.success && data.data) {
        if (data.data.finished && 'data' in data.data) {
          // Finished: store result and redirect
          setTestResult(data.data.data);
          router.push('/tests/ended');
        } else if (!data.data.finished && 'nextQuestions' in data.data) {
          // Not finished: update questions and progress
          setQuestions(data.data.nextQuestions);
          setProgress(data.data.progress);
          setshowSubmitButton(data.data.showSubmitButton);
          // if (currentPage < totalPages - 1) {
          setCurrentPage(data.data.nextQuestions[0].displayNumber);
          // }
        }
      } else if ('finished' in data && data.finished) {
        // Third variant: incomplete response - just redirect
        // Backend returns partial data without full test/answers details
        router.push('/tests/ended');
        toast.success('Test submitted successfully');
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
