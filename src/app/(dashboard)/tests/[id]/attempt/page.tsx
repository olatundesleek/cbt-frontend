// app/(student)/tests/[id]/page.tsx
import { redirect } from 'next/navigation';

interface Params {
  params: { sessionId: string; id: string };
}

export default function Page({ params }: Params) {
  redirect(`/tests/${params.id}/attempt/${params.sessionId}`);
}
