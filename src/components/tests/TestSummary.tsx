'use client';
import React, { useMemo } from 'react';

type TestItem = {
  id: number;
  title: string;
  testState: string;
};

type Props = {
  tests?: TestItem[];
};

export default function TestSummary({ tests = [] }: Props) {
  const totals = useMemo(() => {
    const total = tests.length;
    const active = tests.filter((t) => t.testState === 'active').length;
    const scheduled = tests.filter((t) => t.testState === 'scheduled').length;
    const completed = tests.filter(
      (t) => t.testState === 'completed' || t.testState === 'ended',
    ).length;
    return { total, active, scheduled, completed };
  }, [tests]);

  return (
    <div className='w-full space-y-4'>
      <div className='bg-white rounded-md p-4 shadow-sm'>
        <h3 className='text-base font-semibold'>Test Summary</h3>
        <div className='mt-3 grid grid-cols-1  gap-3'>
          <div className='p-3 bg-slate-50 rounded flex justify-between'>
            <div className='text-sm text-slate-500'>Total</div>
            <div className='text-xl font-semibold'>{totals.total}</div>
          </div>
          <div className='p-3 bg-slate-50 rounded flex justify-between'>
            <div className='text-sm text-slate-500'>Active</div>
            <div className='text-xl font-semibold'>{totals.active}</div>
          </div>
          <div className='p-3 bg-slate-50 rounded flex justify-between'>
            <div className='text-sm text-slate-500'>Scheduled</div>
            <div className='text-xl font-semibold'>{totals.scheduled}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
