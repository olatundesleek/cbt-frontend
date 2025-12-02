'use client';

import { StudentProfilePage } from '@/features/profile/components';
import { useUserStore } from '@/store/useUserStore';

export default function AdminProfilePage() {
  const role = useUserStore((state) => state.role);
  return <StudentProfilePage role={role} />;
}
