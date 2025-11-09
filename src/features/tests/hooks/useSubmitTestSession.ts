import { useMutation } from '@tanstack/react-query';
import { submitTestSession } from '@/services/testsService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTestResult } from '../context/TestResultContext';

/**
 * React Query hook to submit/end a test session
 */
export function useSubmitTestSession(sessionId: string | number) {
  const router = useRouter();
  const { setTestResult } = useTestResult();

  return useMutation({
    mutationFn: () => submitTestSession(sessionId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Store the test result in context
        setTestResult(response.data);
        // Redirect to test ended page
        router.push(`/tests/ended`);
      }
    },
    onError: (err: unknown) => {
      const message =
        typeof err === 'object' && err && 'message' in err
          ? String((err as { message?: string }).message)
          : 'Failed to submit test';
      toast.error(message);
    },
  });
}
