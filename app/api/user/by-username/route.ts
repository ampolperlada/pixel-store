// app/api/user/by-username/route.ts
import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Try profiles table first with maybeSingle()
    let { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', username)
      .maybeSingle(); // Changed to maybeSingle

    if (error) {
      console.error('Profiles query error:', error);
      throw error;
    }

    // If not found in profiles, try users table
    if (!data) {
      const { data: authData, error: authError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .maybeSingle(); // Changed to maybeSingle

      if (authError) {
        console.error('Users query error:', authError);
        throw authError;
      }

      if (!authData) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      data = authData;
    }

    return NextResponse.json({ email: data.email });

  } catch (error: any) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Database query failed',
        details: error.message,
        code: error.code,
        hint: error.hint // Supabase often provides helpful hints
      },
      { status: 500 }
    );
  }
}