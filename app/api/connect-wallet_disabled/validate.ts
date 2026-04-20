// api/connect-wallet/validate.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

/**
 * This validation endpoint checks if a wallet address is already registered to another user
 * without actually connecting it, which allows for pre-validation before wallet connection
 */
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
    
    // Check if wallet is already connected to a user
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
    if (existingWallet) {
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
    
    // Wallet is available for connection
    return NextResponse.json(
      { 
        success: true,
        message: 'Wallet is available for connection',
        walletAddress: normalizedWalletAddress
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error validating wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}