'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

export default function Calendar() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const today = new Date();

  return (
    <div className='bg-white rounded-2xl shadow-sm p-4 mt-6 w-full lg:w-80'>
      {/* <div className='max-h-[200px] overflow-y-auto'> */}
      <DayPicker
        mode='single'
        selected={selected}
        onSelect={setSelected}
        defaultMonth={today}
        modifiers={{ today }}
        modifiersStyles={{
          today: {
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '50%',
          },
        }}
        className='text-xs! w-full! mx-auto!'
        styles={{
          caption: {
            color: '#374151',
            fontWeight: 600,
            marginBottom: '0.5rem',
          },
          table: { width: '100%' },
        }}
      />

      <div>
        {/* Next Exam Date */}
        <p className='text-xs'>Next Test: Web Development - in 12 days</p>
      </div>
      {/* </div> */}
    </div>
  );
}
