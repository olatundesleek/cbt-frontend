export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/providers/toast-provider';
// import api from '@/lib/axios';
import { SystemSettingsResponse } from '@/types/settings.types';
import SystemSettingsHydrator from '@/components/layout/SystemSettingsHydrator';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

async function getSystemSettings(): Promise<SystemSettingsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/system-settings`,
    {
      cache: 'no-store',
    },
  );

  return res.json();
  // const res = await api.get('/system-settings');
  // return res.data;
}

// generateMetadata for dynamic SEO tags
export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/system-settings`,
    {
      cache: 'no-store',
    },
  ).then((r) => r.json());

  return {
    title: settings.data.appName, // Dynamically set the title
    description: settings.data.appName, // Dynamically set the description
  };
}

// export const metadata: Metadata = {
//   title: 'CBT Exam Platform',
//   description: 'A modern computer-based testing platform',
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const systemSettings = await getSystemSettings();

  return (
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>
        <SystemSettingsHydrator systemSettings={systemSettings.data} />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
