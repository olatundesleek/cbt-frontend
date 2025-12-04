'use client';

import NotificationCard from '@/components/feedback/NotificationCard';
import type { Notification as NotificationType } from '@/types/notification.types';

interface NotificationsSectionProps {
  notifications?: NotificationType[];
}

export default function NotificationsSection({
  notifications = [],
}: NotificationsSectionProps) {
  const hasNotifications = notifications && notifications.length > 0;

  return (
    <section className='space-y-4 p-2 bg-gray-50 rounded-xl shadow-sm border border-gray-100'>
      {hasNotifications ? (
        <div className='space-y-3'>
          {notifications.map((note) => (
            <NotificationCard
              key={note.id}
              message={note.message}
              time={new Date(note.createdAt).toLocaleString()}
              type='info'
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-8 px-4'>
          <svg
            className='w-12 h-12 text-gray-300 mb-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
            />
          </svg>
          <p className='text-gray-600 font-medium'>No notifications</p>
          <p className='text-sm text-gray-500 text-center mt-1'>
            You&apos;re all caught up!
          </p>
        </div>
      )}
    </section>
  );
}
