'use client';
import React, { useMemo } from 'react';
import { Student } from '@/types/students.types';

type Props = {
  students?: Student[];
};

export default function StudentSummary({ students = [] }: Props) {
  const stats = useMemo(() => {
    const total = students.length;
    const classes = Array.from(
      new Set(students.map((s) => s.class?.className).filter(Boolean)),
    );
    const unassigned = students.filter((s) => !s.class).length;
    return { total, classesCount: classes.length, unassigned };
  }, [students]);

  return (
    <div className='w-full space-y-4'>
      <div className='bg-white rounded-md p-4 shadow-sm'>
        <h3 className='text-base font-semibold'>Student Summary</h3>
        <div className='mt-3 grid grid-cols-1 gap-3'>
          <div className='p-3 bg-slate-50 rounded flex justify-between'>
            <div className='text-sm text-slate-500'>Total Students</div>
            <div className='text-xl font-semibold'>{stats.total}</div>
          </div>
          <div className='p-3 bg-slate-50 rounded flex justify-between'>
            <div className='text-sm text-slate-500'>Classes</div>
            <div className='text-xl font-semibold'>{stats.classesCount}</div>
          </div>
          <div className='p-3 bg-slate-50 rounded flex justify-between'>
            <div className='text-sm text-slate-500'>Unassigned</div>
            <div className='text-xl font-semibold'>{stats.unassigned}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
