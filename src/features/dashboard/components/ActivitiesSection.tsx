import { FaClipboardCheck } from 'react-icons/fa';

interface Activity {
  id: number;
  message: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    message: 'You completed Database Systems test.',
    time: '2 hours ago',
  },
  {
    id: 2,
    message: 'You submitted your Web Development assignment.',
    time: '1 day ago',
  },
  {
    id: 3,
    message: 'You started Data Analysis practice test.',
    time: '2 days ago',
  },
  { id: 4, message: 'You viewed Networking test results.', time: '4 days ago' },
];

export default function ActivitiesSection() {
  return (
    <section className='p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4'>
      <h2 className='text-lg font-semibold text-gray-700 border-b pb-2'>
        Recent Activities
      </h2>

      <div className='space-y-3'>
        {activities.map((activity) => (
          <div
            key={activity.id}
            className='flex items-start gap-3 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-3 shadow-sm'
          >
            <div className='p-2 bg-green-100 text-green-600 rounded-full'>
              <FaClipboardCheck size={18} />
            </div>
            <div>
              <h4 className='text-sm text-gray-800 font-medium'>
                {activity.message}
              </h4>
              <p className='text-xs text-gray-500'>{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
