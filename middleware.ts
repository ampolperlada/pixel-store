// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname, search } = request.nextUrl;
  
  // Define protected routes
  const protectedRoutes = ['/create', '/explore'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (!token && isProtected) {
    // Construct the callback URL with both pathname and search params
    const callbackUrl = `${pathname}${search}`;
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create', '/create/:path*', '/explore', '/explore/:path*'],
};