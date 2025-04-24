// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/create', '/explore'];

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!token && isProtected) {
    // Save the original URL as a callback
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create/:path*', '/explore/:path*'],
};