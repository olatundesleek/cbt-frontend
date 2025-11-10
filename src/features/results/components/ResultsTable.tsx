import React from 'react';

export interface TestResult {
  course: string;
  title: string;
  type: string;
  date: string;
  score: number | null;
  status: string;
}

interface ResultsTableProps {
  results: TestResult[];
}

const getStatusClass = (status: string) => {
  const s = status?.toUpperCase();
  if (s === 'PASSED') return 'bg-green-100 text-green-700 border-green-200';
  if (s === 'FAILED') return 'bg-red-100 text-red-700 border-red-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => (
  <table className='w-full text-left border-separate border-spacing-y-2 rounded'>
    <thead className='bg-gray-400'>
      <tr className='text-gray-500 text-sm'>
        <th className='px-6 py-3 font-semibold text-gray-700'>Course</th>
        <th className='px-6 py-3 font-semibold text-gray-700'>Test Title</th>
        <th className='px-6 py-3 font-semibold text-gray-700'>Type</th>
        <th className='px-6 py-3 font-semibold text-gray-700'>Date</th>
        <th className='px-6 py-3 font-semibold text-gray-700'>Score</th>
        <th className='px-6 py-3 font-semibold text-gray-700'>Status</th>
      </tr>
    </thead>
    <tbody>
      {results.map((result, idx) => (
        <tr key={idx} className='bg-white rounded shadow-sm'>
          <td className='font-semibold px-6 py-4'>{result.course}</td>
          <td className='px-6 py-4 text-gray-600'>{result.title}</td>
          <td className='px-6 py-4 text-gray-600'>{result.type}</td>
          <td className='px-6 py-4 text-gray-600'>{result.date}</td>
          <td className='px-6 py-4 text-gray-600'>
            {result.score === null || result.score === undefined
              ? '-'
              : `${result.score}`}
          </td>
          <td className='px-6 py-4'>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                result.status,
              )}`}
            >
              {result.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ResultsTable;
