// components/RecentResultsTable.tsx
'use client';

import React from 'react';

interface Result {
  subject: string;
  score: string;
  date: string;
  status: 'passed' | 'failed' | 'null';
}

interface RecentResultsTableProps {
  results?: Result[];
}

const RecentResultsTable: React.FC<RecentResultsTableProps> = ({ results }) => {
  const hasResults = results && results.length > 0;

  return (
    <div className='w-full overflow-x-auto rounded-xl shadow-sm border border-gray-100 bg-white'>
      <table className='min-w-full text-sm text-left'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 font-semibold text-gray-700'>Subject</th>
            <th className='px-6 py-3 font-semibold text-gray-700'>Score</th>
            <th className='px-6 py-3 font-semibold text-gray-700'>Date</th>
            <th className='px-6 py-3 font-semibold text-gray-700'>Status</th>
          </tr>
        </thead>
        <tbody>
          {hasResults ? (
            results.map((result, index) => (
              <tr
                key={index}
                className='border-t border-gray-100 hover:bg-gray-50 transition-colors'
              >
                <td className='px-6 py-4 text-gray-900 font-medium'>
                  {result.subject}
                </td>
                <td className={`px-6 py-4 text-gray-600 `}>
                  <span
                    className={`capitalize px-3 py-1 text-xs font-medium rounded-full ${
                      result.score.toLowerCase() === 'unreleased' ||
                      result.score.toLowerCase() === 'null'
                        ? 'bg-gray-300 text-gray-500'
                        : parseInt(result.score) >= 50
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {result.score}
                  </span>
                </td>
                <td className='px-6 py-4 text-gray-600'>{result.date}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      result.status.toLowerCase() === 'passed'
                        ? 'bg-green-100 text-green-700'
                        : result.status.toLowerCase() === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-300 text-gray-500'
                    }`}
                  >
                    {result.status.charAt(0).toUpperCase() +
                      result.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className='px-6 py-12 text-center'>
                <div className='flex flex-col items-center justify-center space-y-2'>
                  <svg
                    className='w-12 h-12 text-gray-300'
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
                  <p className='text-gray-600 font-medium'>No results yet</p>
                  <p className='text-sm text-gray-500'>
                    Your test results will appear here once you complete a test
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentResultsTable;
