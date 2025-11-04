import Link from 'next/link';
import React from 'react';

export default function Logo() {
  return (
    <Link
      href={'/dashboard'}
      className='text-primary-900 shadow text-2xl font-black'
    >
      CBT TEST
    </Link>
  );
}
