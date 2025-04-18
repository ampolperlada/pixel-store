// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!
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
    captchaToken // Add this to receive the token from frontend
  } = body

  // Basic validations
  if (!username || !email || !password || !agreedToTerms) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Email format validation
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  // Verify reCAPTCHA token
  if (!captchaToken) {
    return NextResponse.json({ error: 'CAPTCHA verification required' }, { status: 400 });
  }

  try {
    // Verify reCAPTCHA with Google
    const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    });

    const recaptchaData = await recaptchaRes.json();
    
    if (!recaptchaData.success) {
      return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
    }

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