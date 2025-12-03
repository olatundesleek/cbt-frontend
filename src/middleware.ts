import { NextRequest, NextResponse } from "next/server";

// Paths that don't require authentication
const publicPaths = ["/" /* "/admin/login", */];

// Paths that require admin/teacher role
// const adminPaths = ['/admin', '/admin/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check for auth token
  const authToken = request.cookies.get("token");

  //check user roles
  const role = request.cookies.get('role')?.value;

  // Allow public paths
  if (publicPaths.includes(pathname) && !authToken) {
    return NextResponse.next();
  }

  if (!authToken) {
    // Redirect to appropriate login page based on path
    return NextResponse.redirect(new URL("/", request.url));
  }

  // try {
  // Verify role for admin routes
  if (pathname.startsWith("/admin")) {
    if (role !== "admin" && role !== "teacher") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Student trying to access dashboard while logged in
  if (pathname === "/" && authToken && role === "student") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin/Teacher trying to access login while logged in
  if (pathname === "/" && authToken && role !== "student") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
  // } catch (error) {
  //   // Token verification failed
  //   console.error(error);
  //   request.cookies.delete('auth-token');
  //   request.cookies.delete('user-role');

  //   if (pathname.startsWith('/admin')) {
  //     return NextResponse.redirect(new URL('/admin/login', request.url));
  //   }
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // return NextResponse.next();
}

// Configure paths that trigger middleware
export const config = {
  /*
   * Match all request paths except:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - images folder
   * - public assets
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
