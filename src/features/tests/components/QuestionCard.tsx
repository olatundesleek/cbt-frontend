import MathHtmlRenderer from '@/components/mathHtmlRenderer';
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
      <h2 className='font-medium mb-4 w-full max-w-full flex items-start gap-1'>
        {/* Q{displayNumber}. {question.question}Q{displayNumber}.{' '} */}
        <span className='shrink-0'>{`Q${displayNumber}.`}</span>
        <div className='min-w-0 flex-1 wrap-break-word'>
          <MathHtmlRenderer html={question.question} />
        </div>
      </h2>

      <div className='space-y-2 mb-4'>
        {question.options.map((opt) => (
          <label
            key={opt}
            className='flex items-start gap-2 cursor-pointer min-w-0'
          >
            <input
              type='radio'
              name={`q-${question.id}`}
              value={opt}
              checked={selected === opt}
              onChange={() => onSelect(opt)}
              className='cursor-pointer mt-1 shrink-0'
            />
            {/* <span>{opt}</span> */}
            <span className='min-w-0 wrap-break-word'>
              <MathHtmlRenderer html={opt} />
            </span>
          </label>
        ))}
      </div>

      <label className='flex items-center gap-2 text-sm cursor-pointer mb-4'>
        <input
          type='checkbox'
          checked={marked}
          onChange={onMark}
          className='cursor-pointer'
        />
        Mark for Review
      </label>
      <div className='flex items-center gap-3 w-[60%] min-w-[600px] mb-4'>
        {/* <div className='flex items-center gap-2 border w-4/5'> */}
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
            aria-label='View instructions'
            title='View instructions'
          >
            View Instructions{' '}
            <LuFileText className='w-4 h-4 text-primary-700' />
          </button>
        )}
      </div>
      {/* </div> */}
    </div>
  );
}
