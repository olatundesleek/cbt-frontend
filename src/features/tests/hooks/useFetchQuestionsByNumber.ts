import { FetchQuestionsByNumberResponse } from './../../../types/tests.types';
import { useMutation } from '@tanstack/react-query';
import { fetchQuestionsByNumber } from '@/services/testsService';
import { useTestAttempt } from '../context/TestAttemptContext';
import toast from 'react-hot-toast';
import { AppError } from '@/types/errors.types';

/**
 * Hook to fetch a pair of questions containing a specific question number.
 * Backend returns a pair and metadata (index, total, answered map, finished flag).
 */
export function useFetchQuestionsByNumber(sessionId: number | string) {
  const {
    answers,
    setQuestions,
    setProgress,
    setCurrentPage,
    setAnswers,
    setshowSubmitButton,
  } = useTestAttempt();

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
        setshowSubmitButton(showSubmitButton || finished);

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
