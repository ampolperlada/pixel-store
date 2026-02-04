// api/connect-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

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
    const body = await req.json();
    const { walletAddress } = body;
    
    // Input validation
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }
    
    // Normalize wallet address (lowercase)
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // 1. First check if wallet is already connected to another user
    const { data: existingWallet, error: walletCheckError } = await supabase
      .from('user_wallets')
      .select('user_id, wallet_address')
      .eq('wallet_address', normalizedWalletAddress)
      .single();
    
    if (walletCheckError && walletCheckError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is what we want
      console.error('Error checking wallet:', walletCheckError);
      return NextResponse.json(
        { error: 'Error checking wallet' },
        { status: 500 }
      );
    }
    
    // If wallet exists and belongs to another user
    if (existingWallet && existingWallet.user_id !== userId) {
      // Get the conflicting user's username
      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('user_id', existingWallet.user_id)
        .single();
      
      return NextResponse.json(
        { 
          error: 'Wallet already connected',
          message: 'This wallet is already connected to another account',
          conflictingUser: userData?.username || 'another user'
        },
        { status: 409 }
      );
    }
    
    // 2. Check if the current user already has a wallet connected
    const { data: currentUserWallet } = await supabase
      .from('user_wallets')
      .select('wallet_address, is_connected')
      .eq('user_id', userId)
      .single();
    
    // 3. Now handle the connection
    const timestamp = new Date().toISOString();
    
    if (currentUserWallet) {
      // Update existing wallet record
      const { error: updateError } = await supabaseAdmin
        .from('user_wallets')
        .update({
          wallet_address: normalizedWalletAddress,
          is_connected: true,
          updated_at: timestamp
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error updating wallet:', updateError);
        return NextResponse.json(
          { error: 'Failed to update wallet connection' },
          { status: 500 }
        );
      }
    } else {
      // Create new wallet record
      const { error: insertError } = await supabaseAdmin
        .from('user_wallets')
        .insert({
          user_id: userId,
          wallet_address: normalizedWalletAddress,
          is_connected: true,
          created_at: timestamp,
          updated_at: timestamp
        });
      
      if (insertError) {
        console.error('Error creating wallet record:', insertError);
        return NextResponse.json(
          { error: 'Failed to create wallet connection' },
          { status: 500 }
        );
      }
    }
    
    // 4. Also update the user's wallet reference in the users table
    const { error: userUpdateError } = await supabaseAdmin
      .from('users')
      .update({
        wallet_address: normalizedWalletAddress,
        updated_at: timestamp
      })
      .eq('user_id', userId);
    
    if (userUpdateError) {
      console.error('Error updating user wallet reference:', userUpdateError);
      // Don't fail the request if this update fails, just log it
    }
    
    // 5. Update session data (for NextAuth)
    session.user.walletAddress = normalizedWalletAddress;
    session.user.isWalletConnected = true;
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Wallet connected successfully',
        walletAddress: normalizedWalletAddress
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}