import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/create', '/explore'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const url = new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}