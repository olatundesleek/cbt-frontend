import { testsServices } from '@/services/testsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AppError } from '@/types/errors.types';
import getErrorDetails from '@/utils/getErrorDetails';

export default function useDeleteTest() {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, AppError, number | string>({
    mutationFn: (testId: number | string) => testsServices.deleteTest(testId),
    onSuccess: (data: unknown) => {
      const d = data as { message?: unknown } | undefined;
      const msg = d && typeof d.message === 'string' ? d.message : 'Test deleted';
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
    onError: (err: AppError | unknown) => {
      const message = getErrorDetails(err);
      toast.error(message || 'Failed to delete test');
    },
  });

  return mutation;
}
