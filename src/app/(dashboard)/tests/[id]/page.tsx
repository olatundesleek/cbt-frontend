'use client';
import { useTest } from '@/context/TestContext';
// app/(student)/tests/[id]/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  const { selectedTest } = useTest();

  if (!selectedTest) redirect(`/tests`);

  redirect(`/tests/${selectedTest.id}/summary`);
}
