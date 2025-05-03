// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase'; // Adjust import path as needed
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    
    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and password are required' },
        { status: 400 }
      );
    }
    
    // Find the token and associated user
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('user_id, token')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();
      
    if (tokenError || !tokenData) {
      console.error('Token lookup error:', tokenError);
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user's password
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password_hash: hashedPassword, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', tokenData.user_id);
      
    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { message: 'Failed to update password' },
        { status: 500 }
      );
    }
    
    // Mark token as used
    const { error: tokenUpdateError } = await supabase
      .from('password_reset_tokens')
      .update({ 
        used: true 
      })
      .eq('token', token);
    
    if (tokenUpdateError) {
      console.error('Error marking token as used:', tokenUpdateError);
      // Don't return an error to the user since the password was updated successfully
    }
    
    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}