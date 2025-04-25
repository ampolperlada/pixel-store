// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname, search } = request.nextUrl;

  // Only protect /explore (server redirect), let /create handle it client-side
  const protectedRoutes = ['/explore'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (!token && isProtected) {
    const callbackUrl = `${pathname}${search}`;
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/explore', '/explore/:path*'], // removed /create
};
