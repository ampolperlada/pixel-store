import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!
const TABLE = 'users'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      username,
      email,
      password, 
      wallet_address,
      agreedToTerms,
      profile_image_url,
      captchaToken,
      isGoogleSignup = false // New field to identify Google signups
    } = body

    console.log('Signup request received:', { username, email, isGoogleSignup });

    // Basic validations (skip password check for Google signup)
    if (!username || !email || (!isGoogleSignup && !password) || !agreedToTerms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Verify reCAPTCHA token only for regular signups
    if (!isGoogleSignup && !captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA verification required' }, { status: 400 });
    }

    // Verify reCAPTCHA for regular signups
    if (!isGoogleSignup && captchaToken) {
      try {
        const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
        });

        const recaptchaData = await recaptchaRes.json();
        
        if (!recaptchaData.success) {
          console.error('CAPTCHA verification failed:', recaptchaData);
          return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
        }
      } catch (error) {
        console.error('Error verifying CAPTCHA:', error);
        return NextResponse.json({ error: 'Error verifying CAPTCHA' }, { status: 500 });
      }
    }

    // Check if user already exists
    try {
      const checkUrl = new URL(`${SUPABASE_URL}/rest/v1/${TABLE}`);
      checkUrl.searchParams.append('select', 'email');
      checkUrl.searchParams.append('email', 'eq.' + email);
      
      const checkRes = await fetch(checkUrl.toString(), {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!checkRes.ok) {
        console.error('Error checking existing user:', await checkRes.text());
        return NextResponse.json({ error: 'Error checking existing user' }, { status: 500 });
      }

      const existingUser = await checkRes.json();
      if (existingUser && existingUser.length > 0) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
      return NextResponse.json({ error: 'Error checking existing user' }, { status: 500 });
    }

    // For Google signup, generate a random password if not provided
    let hashedPassword;
    try {
      hashedPassword = password 
        ? await bcrypt.hash(password, 10)
        : await bcrypt.hash(Math.random().toString(36).slice(2) + Date.now().toString(36), 10);
    } catch (error) {
      console.error('Error hashing password:', error);
      return NextResponse.json({ error: 'Error creating user credentials' }, { status: 500 });
    }

    // Create the user
    try {
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
          is_google_account: isGoogleSignup || false,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error creating user in Supabase:', errorText);
        return NextResponse.json({ 
          error: 'Failed to create user account', 
          details: errorText 
        }, { status: res.status });
      }

      const data = await res.json();
      console.log('User created successfully:', data);

      return NextResponse.json({ 
        message: 'Signup successful', 
        user: data[0],
        isGoogleSignup // Return this to frontend
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }

  } catch (err) {
    console.error('Signup process error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}