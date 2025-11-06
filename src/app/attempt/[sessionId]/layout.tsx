'use client';

import { TestProvider } from '@/context/TestContext';
import '@/app/globals.css'; // ensure global styles still apply

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TestProvider>{children}</TestProvider>;
}
