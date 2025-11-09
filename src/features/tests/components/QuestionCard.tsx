type Props = {
  question: { id: number; question: string; options: string[] };
  selected?: string;
  onSelect: (option: string) => void;
  onMark: () => void;
  marked: boolean;
};

export default function QuestionCard({ question, selected, onSelect, onMark, marked }: Props) {
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
    </div>
  );
}
