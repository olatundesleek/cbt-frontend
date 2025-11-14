import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { startTestSession } from '@/services/testsService';
import type { AppError } from '@/types/errors.types';
import type {
  StartTestSessionRequest,
  StartTestSessionResponse,
} from '@/types/tests.types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTestAttempt } from '../context/TestAttemptContext';

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
  const { setSession, setQuestions, setProgress, setStudent, setCourse } =
    useTestAttempt();

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

        // Route to /attempt/[sessionId]

        replace(
          `/attempt/${data.data.session.id}?testId=${data.data.session.testId}`,
        );
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}


