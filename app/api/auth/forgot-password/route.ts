// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/app/lib/resend';
import { supabase } from '@/app/lib/supabase'; // Adjust import path as needed
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
        created_at: new Date().toISOString(),
        used: false
      });

    if (tokenError) {
      console.error('Error saving token:', tokenError);
      return NextResponse.json(
        { message: 'Error generating reset token' },
        { status: 500 }
      );
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development';
    const ownerEmail = 'ampolperlada@gmail.com'; // Your verified email with Resend
    
    // In development, log the token and reset URL for testing, and only attempt to send to the verified email
    if (isDev) {
      console.log('=========== PASSWORD RESET INFO ===========');
      console.log(`Reset token: ${token}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('==========================================');
      
      if (email !== ownerEmail) {
        console.log(`[DEV MODE] In development, can only send emails to verified email (${ownerEmail})`);
        console.log(`Password reset requested for: ${email}`);
        
        // Return success even though we didn't send the email
        return NextResponse.json(
          { message: 'Password reset link generated (Dev mode - check server logs)' },
          { status: 200 }
        );
      }
    }
    
    // Email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0ea5e9; margin-bottom: 20px;">Password Reset</h2>
        
        <p>Hello ${user.username},</p>
        
        <p>Someone requested a password reset for your account. If this was you, click the link below to reset your password. If you didn't request this, you can ignore this email.</p>
        
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #0ea5e9, #2563eb); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: medium;">Reset Your Password</a>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This link will expire in 1 hour.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        
        <p style="color: #6b7280; font-size: 12px;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
        <p style="color: #6b7280; font-size: 12px; word-break: break-all;">${resetUrl}</p>
      </div>
    `;
    
    // Send email
    try {
      const { data: emailResult, error: emailError } = await resend.emails.send({
        from: 'onboarding@resend.dev', // Use Resend's default sender during development
        to: email,
        subject: 'Reset Your Password',
        html: emailHtml
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        
        // In development, return success even if email failed, since we logged the URL
        if (isDev) {
          return NextResponse.json(
            { message: 'Password reset link generated (check server logs)' },
            { status: 200 }
          );
        }
        
        return NextResponse.json(
          { message: 'Error sending email' },
          { status: 500 }
        );
      }
    } catch (emailErr) {
      console.error('Email exception:', emailErr);
      
      // In development, return success even if email failed, since we logged the URL
      if (isDev) {
        return NextResponse.json(
          { message: 'Password reset link generated (check server logs)' },
          { status: 200 }
        );
      }
      
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