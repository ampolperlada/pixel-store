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

    // Try both tables - first profiles, then auth.users
    let { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', username)
      .single();

    if (error || !data) {
      // Fallback to auth.users if not found in profiles
      const { data: authData, error: authError } = await supabase
        .from('users') // or whatever your auth table is called
        .select('email')
        .eq('username', username)
        .single();

      if (authError) throw authError;
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
        code: error.code 
      },
      { status: 500 }
    );
  }
}