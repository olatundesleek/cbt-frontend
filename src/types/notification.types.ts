export type NotificationType =
  | 'GENERAL'
  | 'STUDENT'
  | 'TEACHER'
  | 'CLASS'
  | 'COURSE';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  classId: number | null;
  courseId: number | null;
  createdById: number;
  createdAt: string;
}

/**
 * Payload used when creating a notification from the frontend.
 * classId and courseId are optional and only required depending on `type`.
 */
export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  classId?: number | null;
  courseId?: number | null;
}

// The notifications GET endpoint returns an array of Notification objects.
export type NotificationsListResponse = {
  success: boolean;
  message: string;
  data: Notification[];
};
