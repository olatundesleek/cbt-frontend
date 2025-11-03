// 'use client';

// import { useState } from 'react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/style.css';

// export default function Calendar() {
//   const [selected, setSelected] = useState<Date | undefined>(new Date());
//   const today = new Date();

//   return (
//     <div className='bg-white rounded-2xl shadow-sm p-4 mt-6 w-full overflow-auto'>
//       {/* <div className='max-h-[200px] overflow-y-auto'> */}
//       <DayPicker
//         mode='single'
//         selected={selected}
//         onSelect={setSelected}
//         defaultMonth={today}
//         modifiers={{ today }}
//         modifiersStyles={{
//           today: {
//             backgroundColor: '#2563eb',
//             color: 'white',
//             borderRadius: '50%',
//           },
//         }}
//         className='text-xs! w-full! mx-auto!'
//         styles={{
//           day_button: {
//             width: '10px',
//             height: '10px',
//             fontSize: '8px',
//             padding: 0,
//             margin: '2px',
//             borderRadius: '50%',
//           },
//           day: {
//             lineHeight: '10px',
//             textAlign: 'center',
//           },
//           caption: {
//             color: '#374151',
//             fontWeight: 600,
//             marginBottom: '0.5rem',
//           },
//           table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//           },
//         }}
//       />

//       <div>
//         {/* Next Exam Date */}
//         <p className='text-xs'>Next Test: Web Development - in 12 days</p>
//       </div>
//       {/* </div> */}
//     </div>
//   );
// }
// 'use client';

// import { useState } from 'react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/style.css';

// export default function Calendar() {
//   const [selected, setSelected] = useState<Date | undefined>(new Date());
//   const today = new Date();

//   return (
//     <div className='bg-white rounded-2xl shadow-sm p-4 mt-6 w-full overflow-auto'>
//       <DayPicker
//         mode='single'
//         selected={selected}
//         onSelect={setSelected}
//         defaultMonth={today}
//         modifiers={{ today }}
//         modifiersStyles={{
//           today: {
//             backgroundColor: 'red',
//             color: 'white',
//             borderRadius: '50%',
//           },
//         }}
//         styles={{
//           day_button: {
//             width: '10px',
//             height: '10px',
//             fontSize: '8px',
//             padding: 0,
//             margin: '2px',
//             borderRadius: '50%',
//           },
//           day: {
//             lineHeight: '10px',
//             textAlign: 'center',
//           },
//           caption: {
//             color: '#374151',
//             fontWeight: 600,
//             marginBottom: '0.5rem',
//           },
//           table: {
//             width: '100%',
//             borderCollapse: 'collapse',
//           },
//         }}
//       />

//       <div>
//         <p className='text-xs mt-2'>Next Test: Web Development - in 12 days</p>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

export default function Calendar() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const today = new Date();

  return (
    <div className='bg-white rounded-2xl shadow-sm p-4 mt-6 w-full overflow-auto'>
      <DayPicker
        mode='single'
        selected={selected}
        onSelect={setSelected}
        defaultMonth={today}
        modifiers={{ today }}
        modifiersStyles={{
          today: {
            borderRadius: '50%',
            fontSize: '8px',
            padding: 10,
            margin: '2px',
            lineHeight: '10px',
            textAlign: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
        styles={{
          day_button: {
            width: '10px',
            height: '10px',
            fontSize: '10px',
            padding: 10,
            margin: '2px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          day: {
            lineHeight: '10px',
            textAlign: 'center',
          },
          caption: {
            color: '#374151',
            fontWeight: 600,
            marginBottom: '0.25rem',
            fontSize: '0.75rem',
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse',
          },
          head_cell: {
            fontSize: '0.6rem',
            padding: '0',
            textAlign: 'center',
          },
        }}
      />

      <div>
        <p className='text-xs mt-2'>Next Test: Web Development - in 12 days</p>
      </div>
    </div>
  );
}
