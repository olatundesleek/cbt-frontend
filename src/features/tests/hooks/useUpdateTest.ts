import { testsServices } from '@/services/testsService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CreateTestRequest, CreateTestResponse } from '@/types/tests.types';
import { AppError } from '@/types/errors.types';
import getErrorDetails from '@/utils/getErrorDetails';

export default function useUpdateTest() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateTestResponse,
    AppError,
    { id: number | string; payload: CreateTestRequest }
  >({
    mutationFn: ({ id, payload }) => testsServices.updateTest(id, payload),
    onSuccess: (data) => {
      console.log({ data });
      toast.success(data.message || 'Test updated');
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
    onError: (err: AppError | unknown) => {
      console.log(err);
      const message = getErrorDetails(err);
      toast.error(message || 'Failed to update test');
    },
  });

  return mutation;
}
