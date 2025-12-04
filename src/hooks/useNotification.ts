import { notificationService } from '@/services/notificationService';
import { AppError } from '@/types/errors.types';
import type {
  NotificationsListResponse,
  Notification,
  CreateNotificationPayload,
} from '@/types/notification.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useNotification() {
  const query = useQuery<NotificationsListResponse, AppError>({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });

  return query;
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Notification,
    AppError,
    CreateNotificationPayload
  >({
    mutationKey: ['create-notification'],
    mutationFn: notificationService.createNotification,

    onSuccess: (data) => {
      // Invalidate and refetch
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },

    onError: (err) => {
      toast.error(getErrorDetails(err));
    },
  });

  return mutation;
}
