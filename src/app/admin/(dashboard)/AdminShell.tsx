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
import { GiGraduateCap, GiTeacher } from 'react-icons/gi';
import { IoIosSettings } from 'react-icons/io';
import { BiNotepad, BiPause, BiUser } from 'react-icons/bi';
import { FiTarget } from 'react-icons/fi';

const adminRoutes: { path: string; label: string; icon: ReactNode }[] = [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: <AiFillHome size={20} />,
  },
  {
    path: '/admin/classes',
    label: 'Classes',
    icon: <GiGraduateCap size={20} />,
  },
  {
    path: '/admin/courses',
    label: 'Courses',
    icon: <BiPause size={20} />,
  },
  {
    path: '/admin/students',
    label: 'Students',
    icon: <BiUser size={20} />,
  },
  {
    path: '/admin/teachers',
    label: 'Teachers',
    icon: <GiTeacher size={20} />,
  },
  {
    path: '/admin/settings',
    label: 'System Settings',
    icon: <IoIosSettings size={20} />,
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
 * AdminShell
 * Client shell for admin-specific interactive UI.
 * This component contains client-only hooks and interactive pieces
 * (sidebar, topbar, data fetching) and is intended to be rendered
 * by a server-side layout after reading the httpOnly role cookie.
 */
export default function AdminShell({
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
  } = useDashboard<AdminDashboardData>();

  useEffect(() => {
    if (!dashboardData) return;

    const data = dashboardData.data as
      | AdminDashboardData
      | TeacherDashboardData
      | Record<string, unknown>;

    let displayName = { firstname: '--', lastname: '--' };

    if ('adminName' in data && (data as AdminDashboardData).adminName) {
      displayName = (data as AdminDashboardData).adminName;
    } else if (
      'teacherName' in data &&
      (data as TeacherDashboardData).teacherName
    ) {
      displayName = (data as TeacherDashboardData).teacherName;
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
        adminRoutes={adminRoutes}
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
              Florintech CBT Admin Portal &#9400; {new Date().getFullYear()}
            </small>
          </div>
        </section>
      )}
    </main>
  );
}
