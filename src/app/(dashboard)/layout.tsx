'use client';

import StudentDashboardHeader from '@/components/layout/StudentDashboardHeader';
import GlobalProviders from '@/components/GlobalProviders';
import MaintenanceMode from '@/components/maintenance/MaintenanceMode';
import { useSystemSettingsStore } from '@/store/useSystemSettingsStore';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = useSystemSettingsStore((store) => store.settings);
  const isMaintenanceMode = settings?.systemStatus === 'MAINTENANCE';

  if (isMaintenanceMode) {
    return (
      <GlobalProviders>
        <MaintenanceMode />
      </GlobalProviders>
    );
  }

  return (
    <>
      <GlobalProviders>
        <div className='min-h-screen bg-background'>
          {/* Add student dashboard header/nav here */}
          <header className='bg-primary-50 shadow'>
            <StudentDashboardHeader />
          </header>
          <main className='container mx-auto  px-4 py-8'>{children}</main>
        </div>
      </GlobalProviders>
    </>
  );
}
