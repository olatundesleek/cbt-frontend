import ActivitiesSection from '@/features/dashboard/components/ActivitiesSection';
import React, { useEffect, useState } from 'react';
import useDownloadResult from '../hook/useDownloadResult';
import { Button, SpinnerMini } from '@/components/ui';
import RegisteredCoursesSection from '@/features/tests/components/RegisteredCoursesSection';

interface PerformanceSummaryProps {
  averageScore: number;
  passRate: number;
  totalTests: number;
  // recentActivity: string[];
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  averageScore,
  passRate,
  totalTests,
  //   recentActivity,
}) => {
  const { mutate: downloadResult, isPending: isDownloadingResults } =
    useDownloadResult();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');

  useEffect(() => {
    // Trigger animation when averageScore changes
    const timer = setTimeout(() => {
      setAnimatedScore(averageScore);
    }, 100);

    return () => clearTimeout(timer);
  }, [averageScore]);

  const handleDownloadResult = function () {
    downloadResult(format);
  };

  return (
    <aside className='bg-white rounded-lg shadow p-6 w-full max-w-xs'>
      <h2 className='text-lg font-semibold mb-4'>Performance Summary</h2>
      <div className='flex items-center gap-4 mb-4'>
        <div className='relative w-16 h-16'>
          <svg viewBox='0 0 36 36' className='w-full h-full'>
            <path
              className='text-blue-200'
              d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            />
            <path
              className='text-primary-600 transition-all duration-1000 ease-out'
              d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeDasharray={`${animatedScore}, 100`}
            />
          </svg>
          <span className='absolute inset-0 flex items-center justify-center text-xl font-bold text-primary-600'>
            {averageScore}%
          </span>
        </div>
        <div>
          <div className='text-sm text-gray-500'>Average score</div>
          <div className='text-lg font-semibold'>{averageScore}%</div>
        </div>
      </div>
      <div className='mb-4'>
        <div className='flex justify-between text-sm mb-2'>
          <span>Pass Rate</span>
          <span>{passRate}%</span>
        </div>
        <div className='flex justify-between text-sm mb-2'>
          <span>Total Tests</span>
          <span>{totalTests}</span>
        </div>
      </div>
      <select
        className='border border-neutral-300 py-1.5 px-2 rounded text-neutral-700 mb-4 w-full text-sm'
        title='Download format'
        name='format'
        id='format'
        value={format}
        onChange={(e) => setFormat(e.target.value as 'pdf' | 'excel')}
      >
        <option value='' disabled>
          Select download format
        </option>
        <option value='pdf'>PDF</option>
        <option value='excel'>EXCEL</option>
      </select>
      <Button onClick={handleDownloadResult} disabled={isDownloadingResults}>
        {isDownloadingResults ? (
          <>
            Downloading <SpinnerMini />
          </>
        ) : (
          `Download Report as ${format.toUpperCase()}`
        )}
      </Button>
      <div className='mt-4'>
        {/* <ActivitiesSection /> */}
        <RegisteredCoursesSection />
      </div>
    </aside>
  );
};

export default PerformanceSummary;
