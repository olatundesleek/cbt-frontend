import { useTestAttemptStore } from '@/store/useTestAttemptStore';

export default function QuestionNavigator({
  total,
  current,
  onSelect,
  answered,
  marked,
}: {
  total: number;
  current: number;
  onSelect: (num: number) => void;
  // answered entries can be numbers or string keys coming from Object.keys(answers).
  answered: Array<number | string>;
  marked: number[];
}) {
  const numbers = Array.from({ length: total }, (_, i) => i + 1);
  const questionMap = useTestAttemptStore((s) => s.questionMap);

  // Normalize answered entries into a flat set of numeric ids / tokens.
  const answeredIds = new Set<number>();
  answered.forEach((entry) => {
    if (typeof entry === 'number' && !Number.isNaN(entry)) {
      answeredIds.add(entry);
      return;
    }
    const s = String(entry || '');
    const matches = s.match(/\d+/g);
    if (matches) matches.map(Number).forEach((n) => answeredIds.add(n));
  });

  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm h-[85vh] overflow-scroll'>
      <div className='grid grid-cols-5 gap-2 mb-2'>
        {numbers.map((num) => {
          // A page/display-number is answered if any known question id maps to
          // this displayNumber and that id is present in the answers set.
          const isAnswered = Array.from(answeredIds).some((qid) => {
            // If questionMap knows this question id, compare its displayNumber
            if (questionMap && questionMap[qid] !== undefined) {
              return questionMap[qid] === num;
            }
            // Fallback: if answeredIds contains the display number itself
            return qid === num;
          });
          const isMarked = marked.includes(num);
          const isCurrent = num === current;

          let bg = 'bg-gray-100';
          if (isCurrent) bg = 'bg-blue-100 border border-blue-600';
          if (isAnswered) bg = 'bg-green-100';
          if (isMarked) bg = 'bg-yellow-100';
          if (isCurrent && isAnswered)
            bg = 'bg-green-100 border border-blue-600';

          return (
            <button
              key={num}
              onClick={() => onSelect(num)}
              className={`rounded-lg text-sm w-10 h-10 ${bg} hover:bg-blue-50 cursor-pointer`}
            >
              {num}
            </button>
          );
        })}
      </div>
      <p className='text-center text-xs text-gray-500'>Scroll to Top</p>
    </div>
  );
}
