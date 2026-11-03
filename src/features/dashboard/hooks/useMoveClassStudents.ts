import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import getErrorDetails from '@/utils/getErrorDetails';
import { queryClient } from '@/providers/query-provider';
import { dashboardServices } from '@/services/dashboardService';

export default function useMoveClassStudents() {
  return useMutation({
    mutationFn: ({
      sourceClassId,
      destinationClassId,
    }: {
      sourceClassId: string | number;
      destinationClassId: string | number;
    }) =>
      dashboardServices.moveClassStudents(sourceClassId, destinationClassId),
    onSuccess: (data) => {
      toast.success(
        `${data.data.movedCount} ${data?.message.toLowerCase()}` ||
          'Students moved successfully',
      );
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['adminStudents'] });
    },
    onError: (error) => {
      toast.error(getErrorDetails(error) || 'Unable to move students');
    },
  });
}
