'use client';

import NotificationCard from '@/components/feedback/NotificationCard';

// 🧠 Dummy Data (replace with API data later)
const notifications = [
  {
    id: 1,
    message: 'Your test on Web Development starts in 30 minutes.',
    time: '10 mins ago',
    type: 'alert' as const,
  },
  {
    id: 2,
    message: 'You successfully submitted your Data Analysis test.',
    time: '2 hours ago',
    type: 'success' as const,
  },
  {
    id: 3,
    message: 'New test schedule available for Networking.',
    time: '1 day ago',
    type: 'info' as const,
  },
];

export default function NotificationsSection() {
  return (
    <section className='space-y-4 p-2 bg-gray-50 rounded-xl shadow-sm border border-gray-100'>
      <div className='space-y-3'>
        {notifications.map((note) => (
          <NotificationCard
            key={note.id}
            message={note.message}
            time={note.time}
            type={note.type}
          />
        ))}
      </div>
    </section>
  );
}
