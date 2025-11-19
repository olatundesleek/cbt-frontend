import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/providers/toast-provider';
// Client providers are mounted where needed (e.g. student layout)

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
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
