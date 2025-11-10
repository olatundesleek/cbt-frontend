import ActivitiesSection from '@/features/dashboard/components/ActivitiesSection';
import React, { useEffect, useState } from 'react';

interface PerformanceSummaryProps {
  averageScore: number;
  passRate: number;
  totalTests: number;
  recentActivity: string[];
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  averageScore,
  passRate,
  totalTests,
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
      <button className='bg-primary-600 text-white w-full py-2 rounded mb-4'>
        Download Report
      </button>
      <div>
        {/* <div className='font-semibold mb-2 text-sm'>Recent Activity</div>
      <ul className='list-disc pl-5 text-sm text-gray-700'>
        {recentActivity.map((activity, idx) => (
          <li key={idx}>{activity}</li>
        ))}
      </ul> */}
        <ActivitiesSection />
      </div>
    </aside>
  );
};

export default PerformanceSummary;
