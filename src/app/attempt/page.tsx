// app/(student)/tests/[id]/page.tsx
import { redirect } from 'next/navigation';

interface Params {
  params: { sessionId: string };
}

export default function Page({ params }: Params) {
  redirect(`/attempt/${params.sessionId}`);
}
