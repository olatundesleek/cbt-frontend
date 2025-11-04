import Calender from '@/components/ui/Calender';
import ExamTips from '@/features/dashboard/components/ExamTips';
import NotificationsSection from '@/components/feedback/NotificationSection';
import RecentResultsTable from '@/features/results/components/RecentResultsTable';
import DashboardTestCard from '@/features/dashboard/components/DashboardTestCard';

export default function StudentDashboardPage() {
  return (
    <div className='grid grid-cols-1 md:flex gap-6'>
      <div className='space-y-8 flex-1'>
        {/* <h1 className='text-2xl font-semibold'>Welcome to Student Dashboard</h1> */}
        {/* Student Info and welcome */}
        <div className='space-y-2'>
          <h1 className='text-3xl font-semibold'>Welcome back, Olatunde 👋</h1>
          <p className='font-light'>Ready to ace your next test today?</p>
        </div>

        <div className='space-y-4'>
          <h1 className='text-2xl'>Active and upcoming tests</h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            <DashboardTestCard
              testName='Web Development'
              testStatus='active'
              totalQuestions={60}
              durationMinutes={60}
              progressStatus='not-started'
            />
            <DashboardTestCard
              testName='Web Development'
              testStatus='active'
              totalQuestions={60}
              durationMinutes={60}
              progressStatus='not-started'
            />
          </div>
        </div>

        <div className='space-y-4'>
          {/* Recent Results */}
          <h1 className='text-2xl'>Recent Results</h1>
          <RecentResultsTable />
          <div className='w-full flex justify-center'>
            <button className='rounded p-2 bg-primary-50 text-primary-900 cursor-pointer'>
              View all results
            </button>
          </div>
        </div>
      </div>

      {/* Notifications and calender */}

      <div className='w-68 space-y-6 border-neutral-200 pl-2 md:border-l'>
        {/* Notification */}
        <div className='space-y-2'>
          <h1 className='text-2xl'>Notifications</h1>

          {/* Dummy notifications */}
          <NotificationsSection />
        </div>

        {/* Exam Tips */}
        <ExamTips />

        <div>
          {/* Calender */}
          <Calender />
        </div>
      </div>
    </div>
  );
}
