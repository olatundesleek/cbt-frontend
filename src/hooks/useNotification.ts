import { notificationService } from '@/services/notificationService';
import { AppError } from '@/types/errors.types';
import type {
  NotificationsListResponse,
  Notification,
  CreateNotificationPayload,
} from '@/types/notification.types';
import { PaginationParams } from '@/types/pagination.types';
import getErrorDetails from '@/utils/getErrorDetails';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useNotification(params?: PaginationParams) {
  const query = useQuery<NotificationsListResponse, AppError>({
    queryKey: ['notifications', params],
    queryFn: () => notificationService.getNotifications(params),
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

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ message: string }, AppError, number>({
    mutationKey: ['delete-notification'],
    mutationFn: notificationService.deleteNotification,

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

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Notification,
    AppError,
    { id: number; payload: CreateNotificationPayload }
  >({
    mutationKey: ['update-notification'],
    mutationFn: ({ id, payload }) =>
      notificationService.updatNotification(id, payload),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications =
        queryClient.getQueryData<NotificationsListResponse>(['notifications']);

      if (previousNotifications) {
        queryClient.setQueryData<NotificationsListResponse>(
          ['notifications'],
          (old) => {
            if (old) {
              const updated = {
                ...old,
                data: {
                  ...old.data,
                  data: old.data.data.map((note) =>
                    note.id === variables.id
                      ? { ...note, ...variables.payload }
                      : note,
                  ),
                },
              } as NotificationsListResponse;
              return updated;
            }
            return old;
          },
        );
      }

      return { previousNotifications };
    },

    onError: (
      err: AppError,
      variables: { id: number; payload: CreateNotificationPayload },
      context: unknown,
    ) => {
      // rollback to previous cache state
      const typedContext = context as
        | { previousNotifications: NotificationsListResponse }
        | undefined;
      if (typedContext?.previousNotifications) {
        queryClient.setQueryData<NotificationsListResponse>(
          ['notifications'],
          typedContext.previousNotifications,
        );
      }
      toast.error(getErrorDetails(err));
    },
    onSettled: () => {
      // ensure server state is reflected
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  return mutation;
}