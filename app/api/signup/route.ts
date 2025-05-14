// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!
const USERS_TABLE = 'users'
const WALLETS_TABLE = 'user_wallets'

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

    // Check for existing user (both username and email)
    try {
      // Use proper query parameters
      const checkUrl = new URL(`${SUPABASE_URL}/rest/v1/${USERS_TABLE}`);
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

    // Initialize Supabase client for transactions
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Create the user
   try {
  // Validate wallet address format if provided
  if (wallet_address && !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
    return NextResponse.json(
      { error: 'Invalid wallet address format' }, 
      { status: 400 }
    );
  }

  // IMPORTANT: Remove wallet_address from users table data
  const userData = {
    username: username.trim(),
    email,
    password_hash: hashedPassword,
    agreed_to_terms: agreedToTerms,
    profile_image_url: profile_image_url || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_google_account: isGoogleSignup || false,
    // wallet_address removed from here
  };

  console.log('Creating user with data:', {
    ...userData,
    password_hash: '[REDACTED]'
  });

  // Create user in the users table first
  const { data: newUser, error: userError } = await supabase
    .from(USERS_TABLE)
    .insert(userData)
    .select('*')
    .single();
  
  if (userError) {
    console.error('Error creating user in Supabase:', userError);
    return NextResponse.json(
      { 
        error: 'Failed to create user account', 
        details: userError.message 
      }, 
      { status: 400 }
    );
  }

  // If wallet address is provided, add it to user_wallets table
  let walletConnected = false;
  if (wallet_address && newUser.user_id) {
    const walletData = {
      user_id: newUser.user_id,
      wallet_address: wallet_address.toLowerCase(),
      is_connected: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Attempting to connect wallet with data:', {
      ...walletData,
      wallet_address: wallet_address.toLowerCase() // Log the exact wallet address being inserted
    });

    const { data: walletResult, error: walletError } = await supabase
      .from(WALLETS_TABLE)
      .insert(walletData)
      .select('*')
      .single();

    if (walletError) {
      console.error('Error adding wallet to user_wallets:', walletError);
      // Don't fail the entire signup just because wallet connection failed
      // We can notify the user they'll need to connect their wallet later
    } else {
      console.log('Wallet connected successfully:', walletResult);
      walletConnected = true;
      
      // IMPORTANT: Update the user record to reference this wallet
      const { error: updateError } = await supabase
        .from(USERS_TABLE)
        .update({ wallet_address: wallet_address.toLowerCase() })
        .eq('user_id', newUser.user_id);
        
      if (updateError) {
        console.error('Error updating user with wallet address:', updateError);
      }
    }
  }

  console.log('User created successfully:', newUser);

  // Return user data without sensitive information
  const { password_hash, ...safeUserData } = newUser;

  return NextResponse.json(
    { 
      message: 'Signup successful', 
      user: {
        ...safeUserData,
        wallet_address: wallet_address?.toLowerCase() || null // Include wallet_address in response
      },
      walletConnected,
      isGoogleSignup,
      // Include this flag so the client knows to sign in the user
      autoSignIn: true
    }, 
    { status: 201 }
  );

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