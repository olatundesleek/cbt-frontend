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
  answered: number[];
  marked: number[];
}) {
  const numbers = Array.from({ length: total }, (_, i) => i + 1);


  return (
    <div className='bg-white rounded-2xl p-4 shadow-sm h-[85vh] overflow-scroll'>
      <div className='grid grid-cols-5 gap-2 mb-2'>
        {numbers.map((num) => {
          const isAnswered = answered.includes(num);
          const isMarked = marked.includes(num);
          const isCurrent = num === current;

          let bg = 'bg-gray-100';
          if (isCurrent) bg = 'bg-blue-100 border border-blue-600';
          if (isAnswered) bg = 'bg-green-100';
          if (isMarked) bg = 'bg-yellow-100';

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
