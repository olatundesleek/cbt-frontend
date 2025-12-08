'use client';

import React from 'react';
import { BiBell, BiCheckCircle } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';

interface NotificationCardProps {
  message: string;
  time: string;
  type?: 'info' | 'alert' | 'success';
}

const iconMap = {
  info: <BiBell className='w-5 h-5 text-blue-500' />,
  alert: <FiAlertCircle className='w-5 h-5 text-red-500' />,
  success: <BiCheckCircle className='w-5 h-5 text-green-500' />,
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  message,
  time,
  type = 'info',
}) => {
  return (
    <div className='flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition'>
      <div className='mt-1'>{iconMap[type]}</div>

      <div className='flex flex-col'>
        <p className='text-sm text-gray-800 first-letter:capitalize'>
          {message}
        </p>
        <span className='text-xs text-gray-500  mt-1'>{time}</span>
      </div>
    </div>
  );
};

export default NotificationCard;
