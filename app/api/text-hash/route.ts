// Temporary test route - app/api/test-hash/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { password, hash } = await request.json();
  const isValid = await bcrypt.compare(password, hash);
  return NextResponse.json({ isValid });
}