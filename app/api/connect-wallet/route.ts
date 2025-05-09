// app/api/connect-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase'; // Adjust import path as needed
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log(`Connecting wallet for user ${userId}: ${walletAddress}`);

    // Check if a wallet connection already exists for this user
    const { data: existingWallet, error: fetchError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existing wallet:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }

    let result;

    // Update or insert the wallet connection
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
        { success: false, message: 'Failed to connect wallet' },
        { status: 500 }
      );
    }

    // Also update the user's record in the database with the wallet address
    const userUpdateResult = await supabase
      .from('users')
      .update({
        wallet_address: walletAddress,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (userUpdateResult.error) {
      console.error('Error updating user with wallet:', userUpdateResult.error);
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        walletAddress: walletAddress,
        isConnected: true
      }
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}