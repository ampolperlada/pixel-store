import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/app/lib/resend';
import { supabase } from '../../../lib/supabase'; // Adjust the import path as necessary
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    // Check for Resend API key
    if (!resend) {
      console.error('Resend API key is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('user_id, username')
      .eq('email', email)
      .limit(1);

    if (userError) {
      console.error('Database error:', userError);
      return NextResponse.json(
        { message: 'Error checking user' },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      // Don't reveal that the email doesn't exist for security reasons
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link' },
        { status: 200 }
      );
    }

    const user = users[0];
    
    // Generate token and expiry
    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token valid for 1 hour
    
    // Store reset token in database
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.user_id,
        token: token,
        expires_at: expires.toISOString(),
        created_at: new Date().toISOString()
      });

    if (tokenError) {
      console.error('Error saving token:', tokenError);
      return NextResponse.json(
        { message: 'Error generating reset token' },
        { status: 500 }
      );
    }

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset</h1>
        <p>Hello ${user.username},</p>
        <p>Someone requested a password reset for your account. If this was you, click the link below to reset your password. If you didn't request this, you can ignore this email.</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
      `
    });

    if (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { message: 'Error sending email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Password reset link sent' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}