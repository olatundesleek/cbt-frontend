'use client';

import Calender from '@/components/ui/Calender';
import ExamTips from '@/features/dashboard/components/ExamTips';
import NotificationsSection from '@/components/feedback/NotificationSection';
import ResultsTable from '@/features/results/components/ResultsTable';
import DashboardTestCard from '@/features/dashboard/components/DashboardTestCard';
import useDashboard from '../queries/useDashboard';
import Link from 'next/link';
import { useSystemSettingsStore } from '@/store/useSystemSettingsStore';

export default function StudentDashboardPage() {
  const {
    data: dashboardData,
    error: dashboardDataError,
    isLoading: isDashboardDataLoading,
  } = useDashboard();
  const settings = useSystemSettingsStore((state) => state.settings);

  // Loading state
  if (isDashboardDataLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center space-y-3'>
          <div className='w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto'></div>
          <p className='text-neutral-600'>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardDataError) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center space-y-3 max-w-md'>
          <div className='w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto'>
            <svg
              className='w-8 h-8 text-error-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-foreground'>
            Failed to load dashboard
          </h3>
          <p className='text-neutral-600'>
            {dashboardDataError?.details || 'Something went wrong'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Extract data
  const data = dashboardData?.data;
  const studentName = data?.studentName;
  const activeTests = data?.activeTests || [];
  const hasActiveTests = activeTests.length > 0;
  const recentResultsCourses = data?.recentResults?.courses || [];
  const studentClass = data?.className || 'N/A';

  // Transform recent results for table
  const recentResults = recentResultsCourses.flatMap((courseData) =>
    courseData.tests.map((test) => ({
      course: courseData.course.title,
      title: test.title || 'N/A',
      type: test.type || 'N/A',
      score: test.session.score,
      date: new Date(test.session.endedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: test.session.status || 'null',
    })),
  );

  return (
    <div className='grid grid-cols-1 md:flex gap-6'>
      <div className='space-y-8 flex-1 gap-8 flex flex-col'>
        {/* Student Info and welcome */}
        <div className='space-y-2 flex justify-between h-6'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-semibold'>
              Welcome back, <span className='capitalize'>{studentName}</span> 👋
            </h1>
            <p className='font-light'>Ready to ace your next test today?</p>
          </div>
          <div className='flex gap-2'>
            <span>Class:</span>
            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200'>
              {studentClass || 'N/A'}
            </span>
          </div>
        </div>

        <div className='space-y-4'>
          <h1 className='text-2xl'>Active Tests</h1>
          {hasActiveTests ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
              {activeTests.map((test) => (
                <DashboardTestCard
                  key={test.id}
                  id={test.id}
                  title={test.title}
                  course={test.course.title}
                  testStatus={test.testState || 'scheduled'}
                  totalQuestions={test.totalQuestions || 60}
                  durationMinutes={test.duration || 40}
                  progressStatus={test.progress || 'not-started'}
                  attemptsAllowed={test.attemptsAllowed || 1}
                  sessionId={test.sessionId}
                  testType={test.type}
                />
              ))}
            </div>
          ) : (
            <div className='border border-neutral-200 rounded-lg p-8 text-center'>
              <p className='text-neutral-600'>No active tests at the moment</p>
              <p className='text-sm text-neutral-500 mt-2'>
                Check back later for upcoming tests
              </p>
            </div>
          )}
        </div>

        <div className='space-y-4'>
          {/* Recent Results */}
          <h1 className='text-2xl'>Recent Results</h1>
          <ResultsTable results={recentResults.slice(0, 5)} />
          <div className='w-full flex justify-center'>
            <Link
              href={'/results'}
              className='rounded p-2 bg-primary-50 text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors'
            >
              View all results
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications and calender */}

      <div className='w-68 space-y-6 border-neutral-200 pl-2 md:border-l'>
        {/* Notification */}
        <div className='space-y-2'>
          <h1 className='text-2xl'>Notifications</h1>

          <NotificationsSection />
        </div>

        {/* Exam Tips */}
        <ExamTips />

        <div>
          {/* Calender */}
          <Calender />
        </div>

        {settings?.supportEmail && (
          <p className='text-sm text-neutral-600 text-center'>
            {settings?.supportEmail}
          </p>
        )}
      </div>
    </div>
  );
}
