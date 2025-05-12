// app/api/connect-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Admin client for bypassing RLS if needed
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const body = await req.json();
    const { walletAddress } = body;
    
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }
    
    // Clean the wallet address (lowercase and trim)
    const cleanedWalletAddress = walletAddress.toLowerCase().trim();
    
    // Verify wallet address format (Ethereum addresses are 42 chars including '0x')
    if (!/^0x[a-fA-F0-9]{40}$/.test(cleanedWalletAddress)) {
      return NextResponse.json({ error: 'Invalid wallet address format' }, { status: 400 });
    }
    
    // Get the user ID from the session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check if wallet is already connected to another account
    const { data: existingWallet, error: walletCheckError } = await supabase
      .from('user_wallets')
      .select('user_id')
      .eq('wallet_address', cleanedWalletAddress)
      .neq('user_id', userId)
      .maybeSingle();
    
    if (walletCheckError) {
      console.error('Error checking existing wallet:', walletCheckError);
      return NextResponse.json({ error: 'Failed to verify wallet availability' }, { status: 500 });
    }
    
    if (existingWallet) {
      return NextResponse.json({ error: 'Wallet already connected to another account' }, { status: 409 });
    }
    
    // First, check if this user already has a wallet entry
    const { data: existingEntry, error: checkError } = await supabase
      .from('user_wallets')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    let result;
    
    if (checkError) {
      console.error('Error checking existing wallet entry:', checkError);
      // Continue with insert attempt
    }
    
    if (!existingEntry) {
      // Insert new wallet entry
      result = await supabase
        .from('user_wallets')
        .insert({
          user_id: userId,
          wallet_address: cleanedWalletAddress,
          is_connected: true
        })
        .select()
        .single();
    } else {
      // Update existing wallet entry
      result = await supabase
        .from('user_wallets')
        .update({
          wallet_address: cleanedWalletAddress,
          is_connected: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
    }
    
    if (result.error) {
      console.error('Error connecting wallet:', result.error);
      return NextResponse.json({ error: 'Failed to connect wallet' }, { status: 500 });
    }
    
    // Also update the users table if it has a wallet_address field
    try {
      const userUpdateResult = await supabase
        .from('users')
        .update({
          wallet_address: cleanedWalletAddress,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (userUpdateResult.error) {
        // Just log this error but don't fail the request - users table updating is secondary
        console.warn('Non-critical error updating users table:', userUpdateResult.error);
      }
    } catch (userUpdateError) {
      console.warn('Failed to update users table:', userUpdateError);
      // Continue without failing the request
    }
    
    return NextResponse.json({ success: true, wallet: result.data }, { status: 200 });
  } catch (error) {
    console.error('Connect wallet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}