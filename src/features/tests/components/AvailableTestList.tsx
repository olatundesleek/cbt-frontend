'use client';

import { useState } from 'react';
import AvailableTestCard from './AvailableTestCard';
import { FaSearch } from 'react-icons/fa';
import { TestStatus } from '@/lib/constants';
import { Test } from '@/types/tests.types';

interface AvailableTestListProps {
  tests?: Test[];
}

export default function AvailableTestList({ tests = [] }: AvailableTestListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'active' | 'upcoming' | 'completed'
  >('all');

  // Transform API tests to match component structure
  const transformedTests = tests.map((test) => ({
    id: test.id,
    title: test.course.title,
    status: test.testState as 'active' | 'upcoming' | 'completed',
    duration: test.duration.toString(),
    totalQuestions: test.bank._count.questions,
    description: test.title,
    attemptsAllowed: test.attemptsAllowed,
  }));

  const filteredTests = transformedTests.filter((test) => {
    const matchesSearch = test.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || test.status === filter;
    return matchesSearch && matchesFilter;
  });

  const hasTests = tests.length > 0;

  return (
    <div className='space-y-8 w-2xl'>
      {/* 🔍 Search + Filter */}
      <div className='flex flex-col sm:flex-row items-center gap-4'>
        <div className='flex w-full border rounded-lg overflow-hidden shadow-sm border-neutral-200'>
          <div className='flex items-center px-3 bg-gray-50'>
            <FaSearch className='text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search tests...'
            className='flex-1 px-3 py-2 outline-none text-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            title='Filter Tests'
            value={filter}
            onChange={(e) => setFilter(e.target.value as TestStatus)}
            className='border-l px-3 py-2 text-sm bg-white outline-none cursor-pointer border-neutral-200'
          >
            <option value='all'>All</option>
            <option value='active'>Active</option>
            <option value='upcoming'>Upcoming</option>
            <option value='completed'>Completed</option>
          </select>
        </div>
      </div>

      {/* 🧠 Test Lists */}
      {hasTests ? (
        <div className='space-y-8'>
          {['active', 'upcoming', 'completed'].map((category) => {
            const tests = filteredTests.filter((t) => t.status === category);
            if (!tests.length && filter !== 'all') return null;

            return (
              <div key={category}>
                <h2 className='text-xl font-semibold capitalize mb-4 text-gray-700 pb-2'>
                  {category} Tests
                </h2>
                {tests.length > 0 ? (
                  <div className='grid gap-4'>
                    {tests.map((test) => (
                      <AvailableTestCard
                        id={test.id}
                        key={test.id}
                        title={test.title}
                        status={test.status}
                        duration={test.duration}
                        totalQuestions={test.totalQuestions}
                        description={test.description}
                        attemptsAllowed={test.attemptsAllowed}
                      />
                    ))}
                  </div>
                ) : (
                  <div className='border border-neutral-200 rounded-lg p-8 text-center'>
                    <p className='text-neutral-600'>No {category} tests</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className='border border-neutral-200 rounded-lg p-12 text-center'>
          <svg
            className='w-16 h-16 text-gray-300 mx-auto mb-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          <p className='text-gray-600 font-medium text-lg'>
            No tests available
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Check back later for new tests
          </p>
        </div>
      )}
    </div>
  );
}
