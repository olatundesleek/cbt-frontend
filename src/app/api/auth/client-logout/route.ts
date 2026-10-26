import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Delete cookies
    cookieStore.delete('token');
    cookieStore.delete('role');

    // Send response
    const res = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    res.cookies.set('token', '', { path: '/', expires: new Date(0) });
    res.cookies.set('role', '', { path: '/', expires: new Date(0) });

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error while logging out' },
      { status: 500 },
    );
  }
}
