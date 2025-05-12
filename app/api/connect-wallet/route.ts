// app/api/connect-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    // Get token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      );
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Verify the session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session' },
        { status: 401 }
      );
    }
    
    // Get the wallet address from the request body
    const { walletAddress } = await req.json();
    
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
    
    // Check if this wallet is already connected to another account
    const { data: existingWallets, error: walletCheckError } = await supabase
      .from('users')
      .select('user_id, username')
      .eq('wallet_address', walletAddress.toLowerCase())
      .neq('user_id', user.id);
    
    if (walletCheckError) {
      console.error('Error checking wallet:', walletCheckError);
      return NextResponse.json(
        { error: 'Error checking wallet availability' },
        { status: 500 }
      );
    }
    
    if (existingWallets && existingWallets.length > 0) {
      return NextResponse.json(
        { 
          error: 'This wallet is already connected to another account',
          conflictingUser: existingWallets[0].username
        },
        { status: 409 }
      );
    }
    
    // Update the user's wallet address
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        wallet_address: walletAddress.toLowerCase(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('Error updating user wallet:', updateError);
      return NextResponse.json(
        { error: 'Failed to connect wallet to account' },
        { status: 500 }
      );
    }
    
    // Also handle the user_wallets table if it exists in your schema
    try {
      // First check if there's an existing wallet entry
      const { data: existingUserWallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();
      
      if (existingUserWallet) {
        // Update existing wallet connection
        await supabase
          .from('user_wallets')
          .update({
            is_connected: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUserWallet.id);
      } else {
        // Create new wallet connection
        await supabase
          .from('user_wallets')
          .insert({
            user_id: user.id,
            wallet_address: walletAddress.toLowerCase(),
            is_connected: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
    } catch (walletTableError) {
      // Don't fail the whole operation if this part has an issue
      console.error('Error managing user_wallets table:', walletTableError);
    }
    
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
    console.error('Error connecting wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}