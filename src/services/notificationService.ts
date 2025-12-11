import api from '@/lib/axios';
import type {
  NotificationsListResponse,
  Notification,
  CreateNotificationPayload,
} from '@/types/notification.types';
import { PaginationParams } from '@/types/pagination.types';

export const notificationService = {
  getNotifications: async (
    params?: PaginationParams,
  ): Promise<NotificationsListResponse> => {
    const response = await api.get('/notification', { params });
    return response.data as NotificationsListResponse;
  },

  createNotification: async (
    payload: CreateNotificationPayload,
  ): Promise<Notification> => {
    const response = await api.post('/notification', payload);
    return response.data as Notification;
  },

  updatNotification: async (
    id: number,
    payload: CreateNotificationPayload,
  ): Promise<Notification> => {
    const response = await api.patch(`/notification/${id}`, payload);
    return response.data as Notification;
  },

  deleteNotification: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/notification/${id}`);
    return response.data as { message: string };
  },
};
