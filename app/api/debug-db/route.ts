// app/api/debug-db/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET() {
  try {
    // Test query for the specific user
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', 10);

    if (error) {
      throw new Error(error.message); // Convert to Error object
    }

    return NextResponse.json({ 
      success: true,
      user: data 
    });
  } catch (error) {
    // Proper error type handling
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    console.error('Debug DB error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: errorMessage 
    }, { status: 500 });
  }
}