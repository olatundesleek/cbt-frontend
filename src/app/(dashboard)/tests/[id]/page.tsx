'use client';
import { useTestStore } from '@/store/useTestStore';
// app/(student)/tests/[id]/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  const { selectedTest } = useTestStore();

  if (!selectedTest) redirect(`/tests`);

  redirect(`/tests/${selectedTest.id}/summary`);
}
