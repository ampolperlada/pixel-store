// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

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
      wallet_address, // This is now properly handled
      agreedToTerms,
      profile_image_url,
      captchaToken,
      isGoogleSignup = false
    } = body

    console.log('Signup request received:', { 
      username, 
      email, 
      hasWallet: !!wallet_address, 
      isGoogleSignup 
    });

    // Enhanced validation
    if (!username?.trim() || !email?.trim() || (!isGoogleSignup && !password) || !agreedToTerms) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
      return NextResponse.json(
        { error: 'Username must be 3-30 characters (letters, numbers, underscores)' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      )
    }

    // Password validation for non-Google signups
    if (!isGoogleSignup) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }

      // Verify reCAPTCHA token
      if (!captchaToken) {
        return NextResponse.json(
          { error: 'CAPTCHA verification required' }, 
          { status: 400 }
        )
      }

      const sanitizeInput = (input: string) => input.trim().replace(/[^\w\s]/gi, '');
      const cleanUsername = sanitizeInput(username);

      try {
        const recaptchaRes = await fetch(
          'https://www.google.com/recaptcha/api/siteverify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
          }
        )

        const recaptchaData = await recaptchaRes.json()
        
        if (!recaptchaData.success) {
          console.error('CAPTCHA verification failed:', recaptchaData)
          return NextResponse.json(
            { error: 'CAPTCHA verification failed' }, 
            { status: 400 }
          )
        }
      } catch (error) {
        console.error('Error verifying CAPTCHA:', error)
        return NextResponse.json(
          { error: 'Error verifying CAPTCHA' }, 
          { status: 500 }
        )
      }
    }

    // Check for existing user (both username and email) - FIXED using proper query params
    try {
      // FIX: Use proper query parameters instead of string concatenation
      const checkUrl = new URL(`${SUPABASE_URL}/rest/v1/${TABLE}`);
      checkUrl.searchParams.append('select', 'username,email');
      
      // Create proper OR condition using Supabase's filter format
      const usernameCondition = `username.eq.${encodeURIComponent(username.trim())}`;
      const emailCondition = `email.eq.${encodeURIComponent(email)}`;
      checkUrl.searchParams.append('or', `(${usernameCondition},${emailCondition})`);
      
      console.log('Checking existing users with URL:', checkUrl.toString());
      
      const checkRes = await fetch(checkUrl.toString(), {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!checkRes.ok) {
        const errorText = await checkRes.text();
        console.error('Error checking existing user:', errorText);
        return NextResponse.json(
          { error: 'Error checking existing user', details: errorText }, 
          { status: 500 }
        )
      }

      const existingUsers = await checkRes.json();
      
      console.log('Existing users check result:', existingUsers);
      
      if (existingUsers && existingUsers.length > 0) {
        const existing = existingUsers[0];
        if (existing.username === username.trim()) {
          return NextResponse.json(
            { error: 'Username already taken' }, 
            { status: 409 }
          )
        }
        if (existing.email === email) {
          return NextResponse.json(
            { error: 'Email already registered' }, 
            { status: 409 }
          )
        }
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
      return NextResponse.json(
        { error: 'Error checking existing user' }, 
        { status: 500 }
      )
    }

    // Hash password (or generate random one for Google signup)
    let hashedPassword;
    try {
      if (isGoogleSignup && !password) {
        // Generate strong random password for Google accounts
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        const randomPassword = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        hashedPassword = await bcrypt.hash(randomPassword, 10);
      } else {
        // Hash the provided password
        hashedPassword = await bcrypt.hash(password, 10);
      }
      console.log('Password hashed successfully');
    } catch (error) {
      console.error('Error hashing password:', error);
      return NextResponse.json(
        { error: 'Error creating user credentials' }, 
        { status: 500 }
      )
    }

    // Create the user
    try {
      // Validate wallet address format if provided
      if (wallet_address && !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
        return NextResponse.json(
          { error: 'Invalid wallet address format' }, 
          { status: 400 }
        );
      }

      const userData = {
        username: username.trim(),
        email,
        password_hash: hashedPassword,
        wallet_address: wallet_address || null,
        agreed_to_terms: agreedToTerms,
        profile_image_url: profile_image_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_google_account: isGoogleSignup || false,
      };

      console.log('Creating user with data:', {
        ...userData,
        password_hash: '[REDACTED]'
      });

      const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error creating user in Supabase:', errorText);
        return NextResponse.json(
          { 
            error: 'Failed to create user account', 
            details: errorText 
          }, 
          { status: res.status }
        )
      }

      const data = await res.json();
      console.log('User created successfully:', data);

      // Return user data without sensitive information
      const { password_hash, ...safeUserData } = data[0];

      return NextResponse.json(
        { 
          message: 'Signup successful', 
          user: safeUserData,
          isGoogleSignup
        }, 
        { status: 201 }
      )
    } catch (error) {
      console.error('Error creating user:', error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error);
      
      return NextResponse.json(
        { error: 'Error creating user' }, 
        { status: 500 }
      )
    }

  } catch (err) {
    console.error('Signup process error:', err instanceof Error ? {
      message: err.message,
      name: err.name,
      stack: err.stack
    } : err);
    
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    )
  }
}