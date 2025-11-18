'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import AdminSidebar from '@/components/sidebar';
import AdminTopBar from '@/components/topbar';
import useDashboard from '@/features/dashboard/queries/useDashboard';
import type {
  AdminDashboardData,
  TeacherDashboardData,
} from '@/types/dashboard.types';
import { errorLogger } from '@/lib/axios';
import { useUserStore } from '@/store/useUserStore';
import { SpinnerMini } from '@/components/ui';
import { AiFillHome } from 'react-icons/ai';
import { BiNotepad, BiUser } from 'react-icons/bi';
import { FiTarget } from 'react-icons/fi';

const teacherRoutes: { path: string; label: string; icon: ReactNode }[] = [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: <AiFillHome size={20} />,
  },
  {
    path: '/admin/tests',
    label: 'Tests',
    icon: <BiNotepad size={20} />,
  },
  {
    path: '/admin/results',
    label: 'Results',
    icon: <AiFillHome size={20} />,
  },
  {
    path: '/admin/question-bank',
    label: 'Question Bank',
    icon: <FiTarget size={20} />,
  },
  {
    path: '/admin/profile',
    label: 'Profile',
    icon: <BiUser size={20} />,
  },
];
/**
 * TeacherShell
 * Client shell for teacher-specific interactive UI.
 * This is a client component and should be rendered from a server layout
 * that has already validated the role cookie.
 */
export default function TeacherShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setName } = useUserStore();
  const { setRole } = useUserStore();

  const {
    data: dashboardData,
    isLoading: isDashboardDataLoading,
    error: dashboardDataError,
  } = useDashboard<TeacherDashboardData>();

  console.log(dashboardData);

  useEffect(() => {
    if (!dashboardData) return;

    const data = dashboardData.data as
      | TeacherDashboardData
      | AdminDashboardData
      | Record<string, unknown>;

    let displayName = { firstname: '--', lastname: '--' };

    if ('teacherName' in data && (data as TeacherDashboardData).teacherName) {
      displayName = (data as TeacherDashboardData).teacherName;
    } else if ('adminName' in data && (data as AdminDashboardData).adminName) {
      displayName = (data as AdminDashboardData).adminName;
    }

    setName(displayName || { firstname: '--', lastname: '--' });
  }, [dashboardData, setName]);

  useEffect(() => {
    if (role) setRole(role);
  }, [role, setRole]);

  if (dashboardDataError) {
    errorLogger(dashboardDataError);
  }

  return (
    <main className='relative flex flex-row items-stretch min-h-screen bg-primary-50 max-w-400 w-full mx-auto'>
      {/* side bar */}
      <AdminSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        adminRoutes={teacherRoutes}
      />

      {isDashboardDataLoading ? (
        <div className='w-full p-4'>
          <SpinnerMini color='#0c4a6e' />
        </div>
      ) : (
        <section className='relative flex-1 flex flex-col gap-4 w-full'>
          <AdminTopBar setIsOpen={setIsOpen} />

          <div className='flex-1 w-full p-4'>{children}</div>

          <div className='flex items-center justify-center w-full'>
            <small>
              Florintech CBT Teacher Portal &#9400; {new Date().getFullYear()}
            </small>
          </div>
        </section>
      )}
    </main>
  );
}
