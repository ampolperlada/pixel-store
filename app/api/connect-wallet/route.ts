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


export async function DELETE(req: NextRequest) {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log(`Disconnecting wallet for user ${userId}`);

    // Update the wallet record to mark it as disconnected
    const { error } = await supabase
      .from('user_wallets')
      .update({
        is_connected: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error disconnecting wallet:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to disconnect wallet' },
        { status: 500 }
      );
    }

    // The session will need to be refreshed on the client side
    return NextResponse.json({
      success: true,
      message: 'Wallet disconnected successfully',
      data: {
        isConnected: false
      }
    });
  } catch (error) {
    console.error('Wallet disconnection error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get wallet connection status
export async function GET(req: NextRequest) {
  try {
    // Get the user's session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get the wallet connection status
    const { data, error } = await supabase
      .from('user_wallets')
      .select('wallet_address, is_connected')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching wallet status:', error);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        walletAddress: data?.wallet_address || null,
        isConnected: data?.is_connected || false
      }
    });
  } catch (error) {
    console.error('Error getting wallet status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}