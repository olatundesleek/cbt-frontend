import React, { useEffect, useState } from 'react';
import RegisteredCoursesSection from '@/features/tests/components/RegisteredCoursesSection';
import DownloadResults from '@/features/results/components/DownloadResults';
import type { PaginationParams } from '@/types/pagination.types';

interface PerformanceSummaryProps {
  averageScore: number;
  passRate: number;
  totalTests: number;
  downloadParams?: PaginationParams;
  // recentActivity: string[];
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  averageScore,
  passRate,
  totalTests,
  downloadParams,
  //   recentActivity,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Trigger animation when averageScore changes
    const timer = setTimeout(() => {
      setAnimatedScore(averageScore);
    }, 100);

    return () => clearTimeout(timer);
  }, [averageScore]);

  return (
    <aside className='bg-white rounded-lg shadow p-6 w-full lg:max-w-xs'>
      <h2 className='text-lg font-semibold mb-4'>Performance Summary</h2>
      <div className='flex items-center gap-4 mb-4'>
        <div className='relative w-16 h-16'>
          {(() => {
            // Use full circle progress to correctly represent 0-100%
            const R = 15.9155; // radius used in original path
            const C = 2 * Math.PI * R; // circumference ~ 100
            const progress = Math.max(0, Math.min(100, animatedScore));
            const dash = (progress / 100) * C;
            const isPerfect = progress === 100;
            const isLow = progress < 30;
            return (
              <svg viewBox='0 0 36 36' className='w-full h-full'>
                {/* Background circle */}
                <circle
                  cx='18'
                  cy='18'
                  r={R}
                  className={
                    isPerfect
                      ? 'text-green-200'
                      : isLow
                      ? 'text-red-200'
                      : 'text-blue-200'
                  }
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                />
                {/* Progress circle */}
                <circle
                  cx='18'
                  cy='18'
                  r={R}
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeDasharray={`${dash} ${C}`}
                  strokeDashoffset='0'
                  className={`${
                    isPerfect
                      ? 'text-green-600'
                      : isLow
                      ? 'text-red-600'
                      : 'text-primary-600'
                  } transition-[stroke-dasharray] duration-1000 ease-out -rotate-90 origin-center`}
                />
              </svg>
            );
          })()}
          <span
            className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${
              averageScore === 100
                ? 'text-green-600'
                : averageScore < 30
                ? 'text-red-600'
                : 'text-primary-600'
            }`}
          >
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
      {/* Download */}
      <DownloadResults params={downloadParams} />
      <div className='mt-4'>
        {/* <ActivitiesSection /> */}
        <RegisteredCoursesSection />
      </div>
    </aside>
  );
};

export default PerformanceSummary;
