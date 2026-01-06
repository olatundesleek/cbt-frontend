import { LuFileText, LuImage } from 'react-icons/lu';

type QuestionShape = {
  id: number;
  question: string;
  options: string[];
  imageUrl?: string | null;
  comprehensionText?: string | null;
};

type Props = {
  question: QuestionShape;
  selected?: string;
  onSelect: (option: string) => void;
  onMark: () => void;
  marked: boolean;
  displayNumber: number;
  onOpenResource?: (type: 'diagram' | 'comprehension', content: string) => void;
};

export default function QuestionCard({
  question,
  displayNumber,
  selected,
  onSelect,
  onMark,
  marked,
  onOpenResource,
}: Props) {
  return (
    <div className='relative'>
      <div className='mb-4 flex items-start justify-between gap-3'>
        <h2 className='font-medium flex-1'>
          Q{displayNumber}. {question.question}
        </h2>
        <div className='flex items-center gap-2 pt-1 absolute right-0 top-0 flex-col'>
          {!!question.imageUrl && (
            <button
              type='button'
              onClick={() =>
                question.imageUrl &&
                onOpenResource?.('diagram', question.imageUrl)
              }
              className='group p-1.5 rounded-full bg-primary-50 hover:bg-primary-100 border border-primary-200 cursor-pointer w-full flex items-center justify-center gap-2'
              aria-label='View diagram'
              title='View diagram'
            >
              View Diagram <LuImage className='w-4 h-4 text-primary-700' />
            </button>
          )}
          {!!question.comprehensionText && (
            <button
              type='button'
              onClick={() =>
                question.comprehensionText &&
                onOpenResource?.('comprehension', question.comprehensionText)
              }
              className='group p-1.5 rounded-full bg-primary-50 hover:bg-primary-100 border border-primary-200 w-full flex items-center justify-center gap-2 cursor-pointer'
              aria-label='View comprehension'
              title='View comprehension'
            >
              View Instructions{' '}
              <LuFileText className='w-4 h-4 text-primary-700' />
            </button>
          )}
        </div>
      </div>
      <div className='space-y-2 mb-4'>
        {question.options.map((opt) => (
          <label key={opt} className='flex items-center gap-2 cursor-pointer'>
            <input
              type='radio'
              name={`q-${question.id}`}
              value={opt}
              checked={selected === opt}
              onChange={() => onSelect(opt)}
              className='cursor-pointer'
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      <label className='flex items-center gap-2 mb-6 text-sm cursor-pointer'>
        <input
          type='checkbox'
          checked={marked}
          onChange={onMark}
          className='cursor-pointer'
        />
        Mark for Review
      </label>
    </div>
  );
}
