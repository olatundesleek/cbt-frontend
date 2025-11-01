// components/RecentResultsTable.tsx
'use client';

import React from 'react';

interface Result {
  subject: string;
  score: string;
  date: string;
  status: 'passed' | 'failed';
}

interface RecentResultsTableProps {
  results?: Result[];
}

const RecentResultsTable: React.FC<RecentResultsTableProps> = ({ results }) => {
  const data = results || [
    {
      subject: 'Data Analysis',
      score: '86%',
      date: 'Oct 28',
      status: 'passed',
    },
    {
      subject: 'Web Development',
      score: '72%',
      date: 'Oct 25',
      status: 'passed',
    },
    { subject: 'Networking', score: '48%', date: 'Oct 20', status: 'failed' },
  ];

  return (
    <div className='w-full overflow-x-auto rounded-xl shadow-sm border border-gray-100 bg-white'>
      <table className='min-w-full text-sm text-left'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 font-semibold text-gray-700 '>Subject</th>
            <th className='px-6 py-3 font-semibold text-gray-700 '>Score</th>
            <th className='px-6 py-3 font-semibold text-gray-700 '>Date</th>
            <th className='px-6 py-3 font-semibold text-gray-700 '>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((result, index) => (
            <tr
              key={index}
              className='border-t border-gray-100 hover:bg-gray-50 transition-colors'
            >
              <td className='px-6 py-4 text-gray-900 font-medium'>
                {result.subject}
              </td>
              <td className='px-6 py-4 text-gray-600 '>{result.score}</td>
              <td className='px-6 py-4 text-gray-600 '>{result.date}</td>
              <td className='px-6 py-4'>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    result.status === 'passed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {result.status.charAt(0).toUpperCase() +
                    result.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentResultsTable;
