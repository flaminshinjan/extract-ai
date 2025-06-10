import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED: Skip auth check to allow direct access to content page
  return NextResponse.next();

  /*
  // Skip middleware for auth, API and static routes
  if (
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Simple auth check: if they have the supabase cookie, let them through
  const cookieString = request.headers.get('cookie') || '';
  const hasAuthCookie = cookieString.includes('sb-');
  
  if (!hasAuthCookie) {
    // No auth cookie found, redirect to sign-in
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  }
  
  // User has auth cookie, allow the request
  return NextResponse.next();
  */
}

// Configure which routes require authentication
export const config = {
  matcher: [
    '/content/:path*',
    '/((?!auth|api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 