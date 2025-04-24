// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/create', '/explore'];

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!token && isProtected) {
    const url = new URL(`/login`, request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create/:path*', '/explore/:path*'], // or just ['/create', '/explore'] for simple routes
};
