import StudentDashboardHeader from '@/components/layout/StudentDashboardHeader';
import { TestProvider } from '@/context/TestContext';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TestProvider>
        <div className='min-h-screen bg-background'>
          {/* Add student dashboard header/nav here */}
          <header className='bg-primary-50 shadow'>
            <StudentDashboardHeader />
          </header>
          <main className='container mx-auto  px-4 py-8'>{children}</main>
        </div>
      </TestProvider>
    </>
  );
}
