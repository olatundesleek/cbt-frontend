'use client';

import { PiNotepadFill } from 'react-icons/pi';
import Button from '@/components/ui/Button';
import { useTestStore } from '@/store/useTestStore';
import { useRouter } from 'next/navigation';
import { TestType } from '@/lib/constants';

interface TestCardProps {
  id: number;
  title: string;
  course: string;
  totalQuestions: number;
  durationMinutes: number;
  testStatus: 'active' | 'scheduled' | 'completed';
  progressStatus: 'not-started' | 'in-progress' | 'completed' | null;
  description?: string;
  attemptsAllowed: number;
  sessionId: number | null;
  testType: TestType;
}

export default function DashboardTestCard({
  id,
  title,
  course,
  totalQuestions,
  durationMinutes,
  testStatus,
  progressStatus,
  description = '',
  attemptsAllowed,
  sessionId,
  testType,
}: TestCardProps) {
  const { push } = useRouter();
  const setSelectedTest = useTestStore((s) => s.setSelectedTest);

  const handleViewTest = () => {
    setSelectedTest({
      id,
      title: title,
      status: testStatus,
      duration: durationMinutes.toString(),
      totalQuestions,
      description,
      attemptsAllowed,
      sessionId: sessionId,
      progress: progressStatus,
      type: testType,
    });
    push(`/tests/${id}/summary`);
  };

  const statusColorClass =
    testStatus === 'active'
      ? 'bg-green-600'
      : testStatus === 'scheduled'
      ? 'bg-yellow-500'
      : 'bg-gray-400';

  return (
    <div className='w-full min-w-[300px] p-4 space-y-4 bg-card rounded-lg shadow-md border border-neutral-200'>
      <div className='flex gap-2 items-center'>
        <span className='text-primary-600'>
          <PiNotepadFill size={40} />
        </span>
        <span className='w-full'>
          <h1 className='text-lg'>{title}</h1>
          <span className='flex justify-between w-full'>
            <p className='text-neutral-700 font-extralight text-xs'>
              Course: {course} {testType ? `(${testType})` : ''}
            </p>
            <p className='text-neutral-700 font-extralight text-xs'>
              Total Questions: {totalQuestions}
            </p>
          </span>
        </span>
      </div>

      {/* Status and progress status info */}
      <div>
        <div className='flex gap-2 items-center mb-2'>
          <div className='flex gap-2 items-center'>
            <span className={`w-3 h-3 rounded-full ${statusColorClass}`}></span>
            <p className='capitalize'>
              {testStatus.toLowerCase() === 'scheduled'
                ? 'upcoming'
                : testStatus.toLowerCase()}
            </p>
          </div>
          <span>|</span>
          <p className='text-neutral-700 font-extralight text-xs'>
            {durationMinutes} minutes
          </p>
        </div>
        <p className='capitalize flex justify-between text-neutral-700 font-extralight text-xs'>
          <span className='text-neutral-800 font-normal text-base'>
            Progress
          </span>
          <span>
            {progressStatus ? progressStatus.replace('-', ' ') : 'Not Started'}
          </span>
        </p>
      </div>

      <Button
        label={sessionId !== null ? 'Resume Test' : 'View Test'}
        onClick={handleViewTest}
      />
    </div>
  );
}
