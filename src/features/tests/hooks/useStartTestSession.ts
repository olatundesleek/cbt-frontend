import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { startTestSession } from '@/services/testsService';
import { type AppError } from '@/types/errors.types';
import type {
  StartTestSessionRequest,
  StartTestSessionResponse,
} from '@/types/tests.types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTestAttemptStore } from '@/store/useTestAttemptStore';
import getErrorDetails from '@/utils/getErrorDetails';

/**
 * React Query hook to start a test session
 * Stores session data in context and routes to attempt page
 */
export function useStartTestSession(): UseMutationResult<
  StartTestSessionResponse,
  AppError,
  StartTestSessionRequest
> {
  const { replace } = useRouter();
  const answers = useTestAttemptStore((s) => s.answers);
  const setSession = useTestAttemptStore((s) => s.setSession);
  const setQuestions = useTestAttemptStore((s) => s.setQuestions);
  const setProgress = useTestAttemptStore((s) => s.setProgress);
  const setStudent = useTestAttemptStore((s) => s.setStudent);
  const setCourse = useTestAttemptStore((s) => s.setCourse);
  const setCurrentPage = useTestAttemptStore((s) => s.setCurrentPage);
  const setAnswers = useTestAttemptStore((s) => s.setAnswers);
  const updateQuestionMap = useTestAttemptStore((s) => s.updateQuestionMap);

  return useMutation<
    StartTestSessionResponse,
    AppError,
    StartTestSessionRequest
  >({
    mutationFn: startTestSession,
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Store session data in context
        setSession(data.data.session);
        setQuestions(data.data.questions);
        setProgress(data.data.progress);
        setStudent(data.data.student);
        setCourse(data.data.course);
        setCurrentPage(data.data.questions[0].displayNumber);

        // Merge any returned selectedOption into the answers map
        const merged: Record<number, string> = { ...answers };
        data.data.questions.forEach((q) => {
          if (typeof q.selectedOption === 'string' && q.selectedOption) {
            merged[q.id] = q.selectedOption;
          }
        });
        setAnswers(merged);

        // Populate question id -> displayNumber map for navigator
        updateQuestionMap(
          data.data.questions.map((q) => ({
            id: q.id,
            displayNumber: q.displayNumber,
          })),
        );

        // Route to /attempt/[sessionId]

        replace(
          `/attempt/${data.data.session.id}?testId=${data.data.session.testId}`,
        );
      }
    },
    onError: (err) => {
      const message = getErrorDetails(err);
      toast.error(message);
    },
  });
}


