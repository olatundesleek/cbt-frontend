'use client';

import React from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { SocketProvider } from '@/context/SocketContext';

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <SocketProvider>{children}</SocketProvider>
    </QueryProvider>
  );
}
