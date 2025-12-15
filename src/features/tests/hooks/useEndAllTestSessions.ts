import { useMutation } from '@tanstack/react-query';
import { testsServices } from '@/services/testsService';
import toast from 'react-hot-toast';
import getErrorDetails from '@/utils/getErrorDetails';

export default function useEndAllTestSessions() {
  return useMutation({
    mutationFn: testsServices.endAllTestSessions,
    onSuccess: (data) => {
      toast.success(data?.message || 'All test sessions ended successfully');
    },
    onError: (error) => {
      toast.error(getErrorDetails(error));
    },
  });
}
