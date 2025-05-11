// app/api/connect-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    // Verify Supabase session first
    const { data: { session: supabaseSession }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !supabaseSession) {
      console.log('No valid Supabase session found');
      return NextResponse.json(
        { success: false, message: 'Invalid session' },
        { status: 401 }
      );
    }

    // Then verify NextAuth session
    const nextAuthSession = await getServerSession(authOptions);
    console.log('Session received:', nextAuthSession ? 'valid' : 'invalid');

    if (!nextAuthSession?.user?.id) {
      console.log('No authenticated user found in session');
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get the request payload
    const body = await req.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { success: false, message: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const userId = nextAuthSession.user.id;

    // Check if wallet is already connected to another user
    const { data: existingUserWithWallet, error: walletCheckError } = await supabase
      .from('user_wallets')
      .select('user_id')
      .eq('wallet_address', walletAddress)
      .neq('user_id', userId)
      .maybeSingle();

    if (walletCheckError) {
      console.error('Error checking wallet availability:', walletCheckError);
      return NextResponse.json(
        { success: false, message: 'Database error while checking wallet availability' },
        { status: 500 }
      );
    } 
    
    if (existingUserWithWallet) {
      return NextResponse.json(
        { success: false, message: 'This wallet is already connected to another account' },
        { status: 409 }
      );
    }

    // Check if user already has a wallet connection
    const { data: existingWallet, error: fetchError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing wallet:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Database error while checking user wallet' },
        { status: 500 }
      );
    }

    let result;

    if (existingWallet) {
      result = await supabase
        .from('user_wallets')
        .update({
          wallet_address: walletAddress,
          is_connected: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      result = await supabase
        .from('user_wallets')
        .insert({
          user_id: userId,
          wallet_address: walletAddress,
          is_connected: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }

    if (result.error) {
      console.error('Error connecting wallet:', result.error);
      return NextResponse.json(
        { success: false, message: 'Failed to connect wallet', error: result.error.message },
        { status: 500 }
      );
    }

    // Update user record if possible
    const userUpdateResult = await supabase
      .from('users')
      .update({
        wallet_address: walletAddress,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (userUpdateResult.error) {
      console.error('Error updating user record:', userUpdateResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        walletAddress: walletAddress,
        isConnected: true,
        userId: userId
      }
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}