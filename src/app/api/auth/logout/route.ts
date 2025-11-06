// import { verifyUserToken } from '@/app/_lib/auth';
// import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // try {
  //   const cookieStore = await cookies();
  //   const token = cookieStore.get('token')?.value;

  //   let userRole = 'user';

  //   if (token) {
  //     try {
  //       const payload = await verifyUserToken(token);
  //       userRole = String(payload?.role) || 'user';
  //     } catch (err) {
  //       console.error('Token invalid or expired', err);
  //     }
  //   }

  //   const res = NextResponse.json({
  //     success: true,
  //     message: 'Logged out',
  //     userRole,
  //   });

  //   cookieStore.delete('token');

  //   // res.cookies.set('token', '', {
  //   //   httpOnly: true,
  //   //   secure: process.env.NODE_ENV === 'production',
  //   //   sameSite: 'strict',
  //   //   path: '/',
  //   //   maxAge: 0,
  //   // });

  //   return res;
  // } catch (error) {
  //   console.error('Internal server Error:', error);
  //   return NextResponse.json({
  //     success: false,
  //     message: 'Error while logging out',
  //   });
  // }

  return NextResponse.json({ message: 'ok' });
}
