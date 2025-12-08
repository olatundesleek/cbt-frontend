"use client";

import useDashboard from '@/features/dashboard/queries/useDashboard';
import type {
  AdminDashboardData,
  TeacherDashboardData,
  DashboardData,
} from '@/types/dashboard.types';
import type { ReactNode } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { SpinnerMini } from '@/components/ui';
import DashboardStatCard from '@/components/ui/DashboardStatCard';
import { GiGraduateCap, GiTeacher } from 'react-icons/gi';
import { BiUser, BiNotepad } from 'react-icons/bi';
import { FiTarget } from 'react-icons/fi';
import { formatDigits } from '../../../../../utils/helpers';
import { PieChartComponent } from '@/components/charts/piechart';
import NotificationsSection from '@/components/feedback/NotificationSection';

export default function AdminDashboardPage() {
  const {
    data: dashboardData,
    isLoading: isDashboardDataLoading,
    error: dashboardError,
  } = useDashboard<AdminDashboardData | TeacherDashboardData | DashboardData>();

  const role = useUserStore((s) => s.role) ?? 'admin';

  // Error state
  if (dashboardError || !dashboardData) {
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
            {dashboardError?.details || 'Something went wrong'}
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

  const data = dashboardData?.data;

  const totalClasses = data?.classCount ?? 0;
  const totalStudents = data?.studentCount ?? 0;
  const totalTeachers =
    'teacherCount' in (data ?? {})
      ? (data as AdminDashboardData).teacherCount
      : 0;
  const totalTests = data?.testCount ?? 0;
  const totalCourses = data?.courseCount ?? 0;
  const adminCount =
    'adminCount' in (data ?? {}) ? (data as AdminDashboardData).adminCount : 0;

  const adminCards: {
    label: string;
    value: string;
    icon: ReactNode;
    variant?:
      | 'student'
      | 'teacher'
      | 'admin'
      | 'user'
      | 'course'
      | 'test'
      | 'result';
  }[] = [
    {
      label: 'Total Classes',
      value: formatDigits(totalClasses),
      icon: <GiGraduateCap size={18} />,
      variant: 'course',
    },
    {
      label: 'Total Students',
      value: formatDigits(totalStudents),
      icon: <BiUser size={18} />,
      variant: 'student',
    },
    {
      label: 'Total Teachers',
      value: formatDigits(totalTeachers),
      icon: <GiTeacher size={18} />,
      variant: 'teacher',
    },
    {
      label: 'Total Courses',
      value: formatDigits(totalCourses),
      icon: <BiNotepad size={18} />,
      variant: 'course',
    },
    {
      label: 'Total Tests',
      value: formatDigits(totalTests),
      icon: <FiTarget size={18} />,
      variant: 'test',
    },
  ];

  const teacherCards: typeof adminCards = [
    {
      label: 'Total Classes',
      value: formatDigits(totalClasses),
      icon: <GiGraduateCap size={18} />,
      variant: 'course',
    },
    {
      label: 'Total Students',
      value: formatDigits(totalStudents),
      icon: <BiUser size={18} />,
      variant: 'student',
    },
    {
      label: 'Total Tests',
      value: formatDigits(totalTests),
      icon: <FiTarget size={18} />,
      variant: 'test',
    },
    {
      label: 'Total Courses',
      value: formatDigits(totalCourses),
      icon: <BiNotepad size={18} />,
      variant: 'course',
    },
  ];

  const dashboardCards = role === 'teacher' ? teacherCards : adminCards;

  return (
    <>
      {isDashboardDataLoading ? (
        <SpinnerMini color='#0c4a6e' />
      ) : (
        <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-2 lg:col-span-2'>
            {dashboardCards.map((card) => (
              <DashboardStatCard
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
                variant={card.variant}
                className='self-start h-fit'
              />
            ))}
          </div>

          <div className='grid grid-cols-1 w-full gap-3'>
            {role === 'teacher' && (
              <div className='col-span-1 flex flex-col gap-2 bg-background rounded-xl w-full p-3'>
                <h1 className='text-2xl'>Notifications</h1>

                <NotificationsSection />
              </div>
            )}
            {role === 'admin' && (
              <div className='col-span-1 flex flex-col gap-3 bg-background rounded-xl w-full p-3'>
                <span className='text-xl text-foreground font-semibold'>
                  System Summary
                </span>

                <PieChartComponent
                  pieChartData={[
                    { name: 'student', value: totalStudents },
                    { name: 'teacher', value: totalTeachers },
                    { name: 'class', value: totalClasses },
                    { name: 'course', value: totalCourses },
                    { name: 'test', value: totalTests },
                    { name: 'admin', value: adminCount },
                  ]}
                  pieChartColors={[
                    { color: '#FFBB28', type: 'student' },
                    { color: '#00C49F', type: 'teacher' },
                    { color: '#0088FE', type: 'class' },
                    { color: '#FF8042', type: 'course' },
                    { color: '#8884D8', type: 'test' },
                    { color: '#09ff1d', type: 'admin' },
                  ]}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
