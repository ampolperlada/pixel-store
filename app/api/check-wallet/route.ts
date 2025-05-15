// app/api/check-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    // Get the wallet address from the request body
    const body = await req.json();
    const { walletAddress } = body;
    
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
    
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Check if this wallet is already connected to any account
    const { data: existingWallets, error: walletCheckError } = await supabase
      .from('user_wallets')
      .select('user_id')
      .eq('wallet_address', normalizedWalletAddress);
    
    if (walletCheckError) {
      console.error('Error checking wallet in user_wallets:', walletCheckError);
      
      // Try an alternative check method
      const { data: altExistingWallets, error: altWalletCheckError } = await supabase
        .from('users')
        .select('user_id, username')
        .eq('wallet_address', normalizedWalletAddress);
        
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
            isConnected: true,
            message: 'Wallet already connected to another account',
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
          isConnected: true,
          message: 'Wallet already connected to another account',
          conflictingUser: conflictingUser?.username || 'another user'
        },
        { status: 409 }
      );
    }
    
    // If we get here, the wallet is not connected to any account
    return NextResponse.json(
      { 
        isConnected: false,
        message: 'Wallet is available for connection'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error checking wallet status:', error instanceof Error ? {
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