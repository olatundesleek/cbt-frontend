'use client';
import Timer from './Timer';

export default function TestAttemptSidebar({
  answered,
  total,
  marked,
}: {
  answered: number;
  total: number;
  marked: number;
}) {
  // Calculate progress percentage
  const progress = Math.round((answered / total) * 100);

  return (
    <aside className='bg-white p-6  shadow-sm w-64'>
      <div className='flex flex-col items-center mb-6'>
        <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl'>
          👤
        </div>
        <p className='font-semibold mt-3'>John Doe</p>
        <p className='text-sm text-gray-500'>Computer Architecture</p>
      </div>

      {/* Time Section */}
      <div className='mb-4'>
        <p className='text-sm text-gray-500'>Time remaining</p>
        <div className='text-2xl font-semibold text-gray-800 mt-1'>
          <Timer />
        </div>

        {/* Blue Progress Bar */}
        <div className='w-full h-2 bg-gray-200 rounded-full mt-2'>
          <div
            className='h-2 bg-blue-500 rounded-full transition-all duration-500'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className='mt-6'>
        <p className='font-semibold mb-2'>Quick Summary</p>
        <ul className='space-y-2 text-sm'>
          <li className='flex justify-between'>
            <span className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-green-500'></span>
              Answered
            </span>
            <span>{answered}</span>
          </li>
          <li className='flex justify-between'>
            <span className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-gray-300'></span>
              Unanswered
            </span>
            <span>{total - answered}</span>
          </li>
          <li className='flex justify-between'>
            <span className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-yellow-400'></span>Marked
            </span>
            <span>{marked}</span>
          </li>
        </ul>
      </div>

      {/* Submit Button */}
      <button className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold'>
        Submit Exam
      </button>

      <p className='text-xs text-gray-400 mt-3'>
        Tip: Review your answers before submitting.
      </p>
    </aside>
  );
}

//timer elapse
// 'use client';
// import { useState } from 'react';
// import Timer from './Timer';

// export default function TestAttemptSidebar({
//   answered,
//   total,
//   marked,
//   duration,
// }: {
//   answered: number;
//   total: number;
//   marked: number;
//   duration: number; // seconds, pass same value used by Timer
// }) {
//   // local progress state updated by Timer's onProgress callback
//   const [progress, setProgress] = useState<number>(0);

//   const unanswered = Math.max(total - answered, 0);

//   return (
//     <aside className='bg-white p-6 rounded-2xl shadow-sm w-64 flex flex-col'>
//       <div className='flex flex-col items-center mb-6'>
//         <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl'>
//           👤
//         </div>
//         <p className='font-semibold mt-3'>John Doe</p>
//         <p className='text-sm text-gray-500'>Computer Architecture</p>
//       </div>

//       {/* Time Section */}
//       <div className='mb-4 w-full'>
//         <p className='text-sm text-gray-500'>Time remaining</p>

//         {/* Timer displays only the formatted remaining time; progress is handled below */}
//         <div className='text-2xl font-semibold text-gray-800 mt-1'>
//           <Timer duration={duration} onProgress={(p) => setProgress(p)} />
//         </div>

//         {/* Blue Progress Bar (tracks elapsed time) */}
//         <div className='w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden'>
//           <div
//             className='h-2 bg-blue-500 rounded-full transition-all duration-500'
//             style={{ width: `${progress}%` }}
//             aria-valuenow={progress}
//             aria-valuemin={0}
//             aria-valuemax={100}
//             role='progressbar'
//           />
//         </div>
//         <div className='text-xs text-gray-500 mt-1'>{progress}% elapsed</div>
//       </div>

//       {/* Quick Summary */}
//       <div className='mt-6'>
//         <p className='font-semibold mb-2'>Quick Summary</p>
//         <ul className='space-y-2 text-sm'>
//           <li className='flex justify-between'>
//             <span className='flex items-center gap-2'>
//               <span className='w-3 h-3 rounded-full bg-green-500' /> Answered
//             </span>
//             <span>{answered}</span>
//           </li>
//           <li className='flex justify-between'>
//             <span className='flex items-center gap-2'>
//               <span className='w-3 h-3 rounded-full bg-gray-300' /> Unanswered
//             </span>
//             <span>{unanswered}</span>
//           </li>
//           <li className='flex justify-between'>
//             <span className='flex items-center gap-2'>
//               <span className='w-3 h-3 rounded-full bg-yellow-400' /> Marked
//             </span>
//             <span>{marked}</span>
//           </li>
//         </ul>
//       </div>

//       <button className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold'>
//         Submit Exam
//       </button>

//       <p className='text-xs text-gray-400 mt-3'>
//         Tip: Review your answers before submitting.
//       </p>
//     </aside>
//   );
// }
