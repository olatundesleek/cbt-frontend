import { TestStatus } from '@/lib/constants';
import Button from '@/components/ui/Button';
import { FaRegClock } from 'react-icons/fa';
import { TiStopwatch } from 'react-icons/ti';
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
import { useTestStore } from '@/store/useTestStore';

interface AvailableTestCardProps {
  id: number;
  title: string;
  status: TestStatus;
  duration: string;
  totalQuestions: number;
  description: string;
  attemptsAllowed: number;
  progress?: 'not-started' | 'in-progress' | null;
  sessionId: number | null;
}
export default function AvailableTestCard({
  id,
  title,
  status,
  duration,
  totalQuestions,
  description,
  attemptsAllowed,
  sessionId,
  progress,
}: AvailableTestCardProps) {
  const { push } = useRouter();

  const { setSelectedTest } = useTestStore();

  const computeStatusClass = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return '';
    }
  };

  const handleViewTest = () => {
    setSelectedTest({
      title,
      status,
      duration,
      totalQuestions,
      description,
      id: id,
      attemptsAllowed,
      sessionId,
      progress,
    });
    push(`/tests/${id}/summary`);
  };

  return (
    <div className='w-full border border-neutral-200 rounded-lg p-4 space-y-4'>
      <div className='flex justify-between items-start'>
        <div>
          <h2 className='text-lg font-semibold'>{description}</h2>
          <p className='text-neutral-500'>{title}</p>
        </div>
        <span
          className={`capitalize px-4 text-sm rounded-2xl ${computeStatusClass()}`}
        >
          {status === 'scheduled' ? 'upcoming' : status}
        </span>
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex flex-1 gap-4 items-center text-neutral-500'>
          {/* Duration and questions */}
          <p className='flex justify-between items-center gap-2'>
            <span>
              <FaRegClock />
            </span>
            <span>{duration} mins</span>
          </p>
          <p className='flex justify-between items-center gap-2'>
            <span>
              <TiStopwatch />
            </span>
            <span>{totalQuestions} questions</span>
          </p>
        </div>

        <div>
          {status === 'active' ? (
            <Button
              label={sessionId ? 'Resume Test' : 'View Test'}
              onClick={handleViewTest}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
