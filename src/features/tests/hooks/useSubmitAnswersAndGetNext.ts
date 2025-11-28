import { useMutation } from '@tanstack/react-query';
import { submitAnswersAndGetNext } from '@/services/testsService';
import { useTestAttemptStore } from '@/store/useTestAttemptStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  SubmitAnswersAndGetNextRequest,
  SubmitAnswersAndGetNextResponse,
} from '@/types/tests.types';
import { AppError } from '@/types/errors.types';
import { useTestResultStore } from '@/store/useTestResultStore';
import getErrorDetails from '@/utils/getErrorDetails';

/**
 * React Query hook to submit answers for current page and get next questions
 * Updates context with new questions and progress
 */
export function useSubmitAnswersAndGetNext() {
  const setCurrentPage = useTestAttemptStore((s) => s.setCurrentPage);
  const setQuestions = useTestAttemptStore((s) => s.setQuestions);
  const setProgress = useTestAttemptStore((s) => s.setProgress);
  const setShowSubmitButton = useTestAttemptStore((s) => s.setShowSubmitButton);
  const { setTestResult } = useTestResultStore();
  const router = useRouter();
  const updateQuestionMap = useTestAttemptStore((s) => s.updateQuestionMap);

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
          setShowSubmitButton(data.data.showSubmitButton);
          // if (currentPage < totalPages - 1) {
          setCurrentPage(data.data.nextQuestions[0].displayNumber);
          // }

          // Update questionId -> displayNumber map for newly fetched questions
          updateQuestionMap(
            data.data.nextQuestions.map((q) => ({
              id: q.id,
              displayNumber: q.displayNumber,
            })),
          );
        }
      } else if ('finished' in data && data.finished) {
        // Third variant: incomplete response - just redirect
        // Backend returns partial data without full test/answers details
        router.push('/tests/ended');
        toast.success('Test submitted successfully');
      }
    },
    onError: (err) => {
      const message = getErrorDetails(err);
      toast.error(message);
    },
  });
}
