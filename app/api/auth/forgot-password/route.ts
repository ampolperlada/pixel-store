// app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase'; // Adjust the import path as necessary
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // First check if the user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, email')
      .eq('email', email)
      .single();
    
    if (userError || !user) {
      // For security reasons, don't tell the client whether the email exists or not
      // Just return success either way
      return NextResponse.json({ success: true });
    }
    
    // Generate a token and store it in the password_reset_tokens table
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour
    
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.user_id,
        token: token,
        expires_at: expiresAt.toISOString()
      });
    
    if (tokenError) {
      console.error('Error creating password reset token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create password reset token' },
        { status: 500 }
      );
    }
    
    // Here you would send an email with a link like:
    // https://yourdomain.com/reset-password?token={token}
    // In a real application, you would use a service like SendGrid, AWS SES, etc.
    
    // Log for development purposes
    console.log(`Password reset link for ${email}: https://yourdomain.com/reset-password?token=${token}`);
    
    // For production, you'd replace the above with actual email sending code:
    // await sendPasswordResetEmail(user.email, token);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}