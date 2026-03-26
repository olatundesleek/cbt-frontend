'use client';

import { useMemo, useRef } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const numbers = Array.from({ length: total }, (_, i) => i + 1);
  const questionMap = useTestAttemptStore((s) => s.questionMap);
  const questions = useTestAttemptStore((s) => s.questions);

  const handleScrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Normalize answered entries into a flat set of numeric ids / tokens.
  const answeredIds = useMemo(() => {
    const ids = new Set<number>();

    answered.forEach((entry) => {
      if (typeof entry === 'number' && !Number.isNaN(entry)) {
        ids.add(entry);
        return;
      }
      const s = String(entry || '');
      const matches = s.match(/\d+/g);
      if (matches) matches.map(Number).forEach((n) => ids.add(n));
    });

    return ids;
  }, [answered]);

  const resolvedQuestionMap = useMemo(() => {
    const map = new Map<number, number>();

    // Seed from persisted/question map in store.
    Object.entries(questionMap || {}).forEach(([questionId, displayNumber]) => {
      const qid = Number(questionId);
      if (!Number.isNaN(qid) && typeof displayNumber === 'number') {
        map.set(qid, displayNumber);
      }
    });

    // Ensure currently loaded page questions are always represented.
    questions.forEach((q) => {
      map.set(q.id, q.displayNumber);
    });

    return map;
  }, [questionMap, questions]);

  const answeredDisplayNumbers = useMemo(() => {
    const set = new Set<number>();

    answeredIds.forEach((qid) => {
      const mappedDisplayNumber = resolvedQuestionMap.get(qid);
      if (mappedDisplayNumber !== undefined) {
        set.add(mappedDisplayNumber);
      } else {
        // Fallback for cases where answer keys are already display numbers.
        set.add(qid);
      }
    });

    return set;
  }, [answeredIds, resolvedQuestionMap]);

  return (
    <div
      className='bg-white rounded-2xl p-4 shadow-sm h-[85vh] overflow-scroll'
      ref={scrollContainerRef}
    >
      <div className='grid grid-cols-5 gap-2 mb-2'>
        {numbers.map((num) => {
          const isAnswered = answeredDisplayNumbers.has(num);
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
      <button
        onClick={handleScrollToTop}
        className='w-full text-center text-xs text-primary-600 hover:text-primary-800 hover:underline py-2 transition-colors cursor-pointer'
      >
        ↑ Scroll to Top
      </button>
    </div>
  );
}


