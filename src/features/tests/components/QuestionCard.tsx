type Props = {
  question: { id: number; question: string; options: string[] };
  selected?: string;
  onSelect: (option: string) => void;
  onMark: () => void;
  marked: boolean;
  onNext: () => void;
  onPrev: () => void;
};

export default function QuestionCard({
  question,
  selected,
  onSelect,
  onMark,
  marked,
  onNext,
  onPrev,
}: Props) {
  return (
    <div>
      <h2 className='font-medium mb-4'>
        Q{question.id}. {question.question}
      </h2>
      <div className='space-y-2 mb-4'>
        {question.options.map((opt) => (
          <label key={opt} className='flex items-center gap-2'>
            <input
              type='radio'
              name={`q-${question.id}`}
              value={opt}
              checked={selected === opt}
              onChange={() => onSelect(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      <label className='flex items-center gap-2 mb-6 text-sm'>
        <input type='checkbox' checked={marked} onChange={onMark} />
        Mark for Review
      </label>

      <div className='flex justify-between'>
        <button
          onClick={onPrev}
          className='px-4 py-2 border rounded-lg hover:bg-gray-100'
        >
          Previous
        </button>
        <div className='flex gap-2'>
          <button className='px-4 py-2 border rounded-lg hover:bg-gray-100'>
            Save
          </button>
          <button
            onClick={onNext}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
