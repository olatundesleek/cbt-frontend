'use client';

import GlobalProviders from '@/components/GlobalProviders';
import '@/app/globals.css'; // ensure global styles still apply

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GlobalProviders>{children}</GlobalProviders>;
}
