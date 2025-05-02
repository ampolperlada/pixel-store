import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { resend } from '../../../lib/resend';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    const email: string = body.email;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.warn(`No user found with email: ${email}`);
      return NextResponse.json({ success: true });
    }

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_token: token,
        reset_token_expires_at: expiresAt.toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating reset token:', updateError);
      return NextResponse.json(
        { error: 'Failed to create password reset token' },
        { status: 500 }
      );
    }

    const resetLink = `https://yourdomain.com/reset-password?token=${token}`;

    try {
      const emailResponse = await resend.emails.send({
        from: 'no-reply@onboarding.resend.dev',
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });
      console.log('Email sent successfully:', emailResponse);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}