// middleware.ts - DISABLED FOR DEMO
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// BYPASS ALL AUTH - Allow all routes for demo
export async function middleware(request: NextRequest) {
  // Just let everything through
  return NextResponse.next();
}

// Disable the matcher so it doesn't run
export const config = {
  matcher: [],
};