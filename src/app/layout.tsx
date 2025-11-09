import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { SocketProvider } from '@/context/SocketContext';
import { TestAttemptProvider } from '@/features/tests/context/TestAttemptContext';
import { TestResultProvider } from '@/features/tests/context/TestResultContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CBT Exam Platform',
  description: 'A modern computer-based testing platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          <SocketProvider>
            <TestAttemptProvider>
              <TestResultProvider>{children}</TestResultProvider>
            </TestAttemptProvider>
            <ToastProvider />
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
