'use client';

type TimerProps = {
  remainingSeconds: number | null;
};

export default function Timer({ remainingSeconds }: TimerProps) {
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (remainingSeconds == null) {
    return <p className='font-semibold'>--:--</p>;
  }

  return <p className='font-semibold'>{formatTime(remainingSeconds)}</p>;
}

//progresstimer elapse
// 'use client';
// import { useEffect, useState } from 'react';

// type TimerProps = {
//   duration: number; // total seconds for the exam (e.g. 45*60 + 32)
//   onProgress?: (percent: number) => void; // callback to notify progress (0-100)
//   onExpire?: () => void;
// };

// export default function Timer({ duration, onProgress, onExpire }: TimerProps) {
//   const [timeLeft, setTimeLeft] = useState<number>(duration);

//   useEffect(() => {
//     // initialize progress callback
//     onProgress?.(Math.round(((duration - timeLeft) / duration) * 100));

//     const id = setInterval(() => {
//       setTimeLeft((t) => {
//         const next = t > 0 ? t - 1 : 0;
//         // const percent = Math.round(((duration - next) / duration) * 100);
//         // onProgress?.(percent);
//         const percentRemaining = Math.round((timeLeft / duration) * 100);
//         onProgress?.(percentRemaining);

//         if (next === 0) {
//           onExpire?.();
//           clearInterval(id);
//         }
//         return next;
//       });
//     }, 1000);

//     return () => clearInterval(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [duration]); // only set up once per duration

//   const formatTime = (sec: number) => {
//     const m = Math.floor(sec / 60);
//     const s = sec % 60;
//     return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
//   };

//   return (
//     <div className='flex flex-col items-start'>
//       <div className='font-semibold text-gray-800'>{formatTime(timeLeft)}</div>
//     </div>
//   );
// }
