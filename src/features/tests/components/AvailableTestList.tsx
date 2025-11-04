'use client';

import { useState } from 'react';
import AvailableTestCard from './AvailableTestCard';
import { FaSearch } from 'react-icons/fa';
import { TestStatus } from '@/lib/constants';

interface Test {
  id: number;
  title: string;
  status: 'active' | 'upcoming' | 'completed';
  duration: string;
  totalQuestions: number;
  description: string;
}

const dummyTests: Test[] = [
  {
    id: 1,
    title: 'Math Test',
    status: 'active',
    duration: '30',
    totalQuestions: 10,
    description: 'Test your math skills and problem-solving ability.',
  },
  {
    id: 2,
    title: 'Science Test',
    status: 'upcoming',
    duration: '45',
    totalQuestions: 15,
    description: 'Prepare to test your science knowledge.',
  },
  {
    id: 3,
    title: 'History Test',
    status: 'completed',
    duration: '60',
    totalQuestions: 20,
    description: 'Explore the past with our history test.',
  },
  {
    id: 4,
    title: 'English Grammar',
    status: 'active',
    duration: '25',
    totalQuestions: 12,
    description: 'Sharpen your grammar and vocabulary skills.',
  },
  {
    id: 5,
    title: 'Data Analysis',
    status: 'upcoming',
    duration: '50',
    totalQuestions: 18,
    description: 'Evaluate your analytical thinking and data handling.',
  },
];

export default function AvailableTestList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'active' | 'upcoming' | 'completed'
  >('all');

  const filteredTests = dummyTests.filter((test) => {
    const matchesSearch = test.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || test.status === filter;
    return matchesSearch && matchesFilter;
  });

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
      <div className='space-y-8'>
        {['active', 'upcoming', 'completed'].map((category) => {
          const tests = filteredTests.filter((t) => t.status === category);
          if (!tests.length && filter !== 'all') return null;

          return (
            <div key={category}>
              <h2 className='text-xl font-semibold capitalize mb-4 text-gray-700 pb-2'>
                {category} Tests
              </h2>
              <div className='grid gap-4 '>
                {tests.map((test) => (
                  <AvailableTestCard
                    id={test.id}
                    key={test.id}
                    title={test.title}
                    status={test.status}
                    duration={test.duration}
                    totalQuestions={test.totalQuestions}
                    description={test.description}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
