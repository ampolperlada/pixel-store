// app/api/debug/user-tables/route.ts
import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  
  if (!username) {
    return NextResponse.json({ error: 'Username parameter required' }, { status: 400 });
  }
  
  const tables = [
    'users',
    'auth_users',
    'auth.users',
    'user_accounts',
    'profiles'
  ];
  
  const results: Record<string, any> = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('username', username)
        .maybeSingle();
      
      if (error) {
        results[table] = { error: error.message };
      } else {
        results[table] = { 
          found: !!data,
          // Only include non-sensitive data
          data: data ? {
            id: data.id || data.user_id || data.uuid,
            username: data.username,
            has_password: !!data.password_hash,
            email_exists: !!data.email,
            created_at: data.created_at
          } : null
        };
      }
    } catch (e: any) {
      results[table] = { error: e.message };
    }
  }
  
  return NextResponse.json({
    message: 'User table lookup results',
    username,
    results
  });
}