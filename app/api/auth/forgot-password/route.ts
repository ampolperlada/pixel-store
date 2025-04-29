// app/api/auth/forgot-password/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase'; // Use alias path if configured in tsconfig.json
import { randomUUID } from 'crypto';

// POST /api/auth/forgot-password
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email: string = body.email;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, email')
      .eq('email', email)
      .single();

    // Always return success regardless of whether the user exists, for security
    if (userError || !user) {
      return NextResponse.json({ success: true });
    }

    // Generate token and expiration
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    // Store token
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.user_id,
        token,
        expires_at: expiresAt.toISOString()
      });

    if (tokenError) {
      console.error('Error creating password reset token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create password reset token' },
        { status: 500 }
      );
    }

    // For development/debugging
    const resetLink = `https://yourdomain.com/reset-password?token=${token}`;
    console.log(`Password reset link for ${email}: ${resetLink}`);

    // TODO: Send email using email service (e.g., SendGrid, Resend, AWS SES, etc.)
    // await sendPasswordResetEmail(user.email, resetLink);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
