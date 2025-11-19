import { FetchQuestionsByNumberResponse } from './../../../types/tests.types';
import { useMutation } from '@tanstack/react-query';
import { fetchQuestionsByNumber } from '@/services/testsService';
import { useTestAttemptStore } from '@/store/useTestAttemptStore';
import toast from 'react-hot-toast';
import { AppError } from '@/types/errors.types';

/**
 * Hook to fetch a pair of questions containing a specific question number.
 * Backend returns a pair and metadata (index, total, answered map, finished flag).
 */
export function useFetchQuestionsByNumber(sessionId: number | string) {
  const answers = useTestAttemptStore((s) => s.answers);
  const setQuestions = useTestAttemptStore((s) => s.setQuestions);
  const setProgress = useTestAttemptStore((s) => s.setProgress);
  const setCurrentPage = useTestAttemptStore((s) => s.setCurrentPage);
  const setAnswers = useTestAttemptStore((s) => s.setAnswers);
  const setShowSubmitButton = useTestAttemptStore((s) => s.setShowSubmitButton);

  return useMutation<FetchQuestionsByNumberResponse, AppError, number>({
    mutationFn: (questionNumber: number) =>
      fetchQuestionsByNumber(sessionId, questionNumber),
    onSuccess: (response, questionNumber) => {
      if (response.success && response.data) {
        const { nextQuestions, progress, finished, showSubmitButton } =
          response.data;

        // Update question pair
        setQuestions(nextQuestions);

        // Update progress counts directly from payload
        setProgress({
          answeredCount: progress.answeredCount,
          total: progress.total,
        });

        // Merge any returned selectedOption into the answers map
        const merged: Record<number, string> = { ...answers };
        nextQuestions.forEach((q) => {
          if (typeof q.selectedOption === 'string' && q.selectedOption) {
            merged[q.id] = q.selectedOption;
          }
        });
        setAnswers(merged);

        // Update submit visibility
        setShowSubmitButton(showSubmitButton || finished);

        // Compute current page from the requested question number
        if (typeof questionNumber === 'number') {
          setCurrentPage(
            Math.ceil(questionNumber) || nextQuestions[0].displayNumber,
          );
        }
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
