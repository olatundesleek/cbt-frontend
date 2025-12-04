import api from '@/lib/axios';
import type {
  NotificationsListResponse,
  Notification,
  CreateNotificationPayload,
} from '@/types/notification.types';

export const notificationService = {
  getNotifications: async (): Promise<NotificationsListResponse> => {
    const response = await api.get('/notification');
    return response.data as NotificationsListResponse;
  },

  createNotification: async (
    payload: CreateNotificationPayload,
  ): Promise<Notification> => {
    const response = await api.post('/notification', payload);
    return response.data as Notification;
  },
};
