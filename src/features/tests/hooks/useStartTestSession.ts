import { useMutation } from '@tanstack/react-query';
import { startTestSession } from '@/services/testsService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTestAttempt } from '../context/TestAttemptContext';

/**
 * React Query hook to start a test session
 * Stores session data in context and routes to attempt page
 */
export function useStartTestSession() {
  const { replace } = useRouter();
  const { setSession, setQuestions, setProgress } = useTestAttempt();

  return useMutation({
    mutationFn: startTestSession,
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Store session data in context
        setSession(data.data.session);
        setQuestions(data.data.questions);
        setProgress(data.data.progress);

        // Route to /attempt/[sessionId]

        replace(`/attempt/${data.data.session.id}`);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
