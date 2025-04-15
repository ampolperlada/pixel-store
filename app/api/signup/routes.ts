// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use SERVICE KEY here
const TABLE = 'users'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    username,
    email,
    password, 
    wallet_address,
    agreedToTerms,
    profile_image_url,
  } = body

  // Basic validations
  if (!username || !email || !password || !agreedToTerms) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Check if user already exists
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=email&email=eq.${encodeURIComponent(email)}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const existingUser = await checkRes.json();
    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        username,
        email,
        password_hash: hashedPassword,
        wallet_address: wallet_address || null,
        agreed_to_terms: agreedToTerms,
        profile_image_url: profile_image_url || null,
        created_at: new Date().toISOString(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'Signup failed' }, { status: res.status });
    }

    return NextResponse.json({ message: 'Signup successful', user: data[0] }, { status: 201 });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}