import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { token, role } = await req.json();

    if (!token || !role)
      return NextResponse.json(
        { success: false, message: 'No token or role provided' },
        { status: 400 },
      );

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    const isProd = process.env.NODE_ENV === 'production';
    console.log(process.env.NODE_ENV === 'production');

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });

    response.cookies.set('role', role.toLowerCase(), {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to set auth cookie' },
      { status: 500 },
    );
  }
}

export async function GET() {
  console.log('GET /api/auth/set-auth-cookie reached');
  return NextResponse.json({ message: 'ok' });
}
