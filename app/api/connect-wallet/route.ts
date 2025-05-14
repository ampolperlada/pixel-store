// app/api/connect-wallet/route.ts - Improved version

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    // Get token
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('Empty token');
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      );
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Log the token being used (without revealing full token)
    console.log(`Authenticating with token: ${token.substring(0, 10)}...`);
    
    // Verify the session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session', details: authError?.message },
        { status: 401 }
      );
    }
    
    console.log('Authenticated user:', user.id);
    
    // Get the wallet address from the request body
    const body = await req.json();
    const { walletAddress } = body;
    
    console.log('Received wallet connection request:', { 
      userId: user.id,
      walletAddress: walletAddress ? `${walletAddress.substring(0, 10)}...` : null 
    });
    
    // Validate wallet address
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }
    
    // Ensure wallet address format is valid (Ethereum address)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum wallet address format' },
        { status: 400 }
      );
    }
    
    const normalizedWalletAddress = walletAddress.toLowerCase();
    
    // Check if this wallet is already connected to another account
    const { data: existingWallets, error: walletCheckError } = await supabase
      .from('user_wallets')
      .select('user_id')
      .eq('wallet_address', normalizedWalletAddress)
      .neq('user_id', user.id);
    
    if (walletCheckError) {
      console.error('Error checking wallet in user_wallets:', walletCheckError);
      // Try an alternative check method
      const { data: altExistingWallets, error: altWalletCheckError } = await supabase
        .from('users')
        .select('user_id, username')
        .eq('wallet_address', normalizedWalletAddress)
        .neq('user_id', user.id);
        
      if (altWalletCheckError) {
        console.error('Error checking wallet in users table:', altWalletCheckError);
        return NextResponse.json(
          { error: 'Error checking wallet availability' },
          { status: 500 }
        );
      }
      
      if (altExistingWallets && altExistingWallets.length > 0) {
        return NextResponse.json(
          { 
            error: 'Wallet already connected to another account',
            conflictingUser: altExistingWallets[0].username
          },
          { status: 409 }
        );
      }
    } else if (existingWallets && existingWallets.length > 0) {
      // Get username of conflicting user
      const { data: conflictingUser } = await supabase
        .from('users')
        .select('username')
        .eq('user_id', existingWallets[0].user_id)
        .single();
        
      return NextResponse.json(
        { 
          error: 'This wallet is already connected to another account',
          conflictingUser: conflictingUser?.username || 'another user'
        },
        { status: 409 }
      );
    }
    
    console.log('No wallet conflicts found, proceeding with connection');
    
    // IMPORTANT: Transaction to ensure both tables are updated
    // First, add to user_wallets table
    const { data: walletEntry, error: walletInsertError } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: user.id,
        wallet_address: normalizedWalletAddress,
        is_connected: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id,wallet_address', 
        ignoreDuplicates: false 
      })
      .select()
      .single();
      
    if (walletInsertError) {
      console.error('Error inserting into user_wallets:', walletInsertError);
      return NextResponse.json(
        { error: 'Failed to register wallet connection' },
        { status: 500 }
      );
    }
    
    console.log('Wallet registered in user_wallets table:', walletEntry ? 'success' : 'failed');
    
    // Then update the user record
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        wallet_address: normalizedWalletAddress,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('Error updating user with wallet address:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user account with wallet' },
        { status: 500 }
      );
    }
    
    console.log('User updated with wallet address:', updatedUser ? 'success' : 'failed');
    
    // Return success response with user data
    const { password_hash, ...safeUserData } = updatedUser;
    
    return NextResponse.json(
      { 
        message: 'Wallet connected successfully',
        user: safeUserData
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error connecting wallet:', error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}