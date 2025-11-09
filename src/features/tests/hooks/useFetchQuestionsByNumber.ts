import { useMutation } from '@tanstack/react-query';
import { fetchQuestionsByNumber } from '@/services/testsService';
import { useTestAttempt } from '../context/TestAttemptContext';
import toast from 'react-hot-toast';

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

  return useMutation({
    mutationFn: (questionNumber: number) =>
      fetchQuestionsByNumber(sessionId, questionNumber),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const {
          questions,
          total,
          answered,
          finished,
          showSubmitButton,
          index,
        } = response.data;
        // Update question pair
        setQuestions(questions);
        // Update progress counts (answeredCount from answered array length)
        setProgress({
          answeredCount: answered.filter((a) => a.isAnswered).length,
          total,
        });
        // Merge previous answers into answers state
        const merged: Record<number, string> = { ...answers };
        answered.forEach((a) => {
          if (a.previousAnswer) {
            merged[a.questionId] = a.previousAnswer;
          }
        });
        setAnswers(merged);
        // Update submit visibility if finished
        setshowSubmitButton(showSubmitButton || finished);
        // Set current page based on 1-based index -> page = Math.floor((index - 1)/2)
        setCurrentPage(Math.floor((index - 1) / 2));
      }
    },
    onError: (error: unknown) => {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Failed to fetch questions';
      toast.error(message);
    },
  });
}
