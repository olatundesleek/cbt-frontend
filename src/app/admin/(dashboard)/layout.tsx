import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from './AdminShell';
import TeacherShell from './TeacherShell';

/**
 * Server layout for admin/teacher dashboard.
 * Reads the httpOnly `role` cookie and renders the appropriate client shell.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value?.toLowerCase();

  // If there's no role available server-side, redirect to admin login.
  if (!role) {
    redirect('/admin/login');
  }

  // If role is unexpected, redirect to root (or you can choose another page).
  if (role !== 'admin' && role !== 'teacher') {
    redirect('/');
  }

  return role === 'teacher' ? (
    <TeacherShell role={role}>{children}</TeacherShell>
  ) : (
    <AdminShell role={role}>{children}</AdminShell>
  );
}
