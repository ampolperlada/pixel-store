// app/api/connect-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    // Log request for debugging
    console.log('Connect wallet API called');
    
    // Get the request payload
    const body = await req.json().catch(error => {
      console.error('Error parsing request body:', error);
      return {};
    });
    
    const { walletAddress } = body;

    // Validate wallet address exists
    if (!walletAddress) {
      console.log('Wallet address missing in request');
      return NextResponse.json(
        { success: false, message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate wallet address format (simple check for ethereum address)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      console.log('Invalid wallet address format:', walletAddress);
      return NextResponse.json(
        { success: false, message: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Get user from session
    const session = await getServerSession(authOptions);
    console.log('Session received:', session ? 'valid' : 'invalid');

    if (!session?.user?.id) {
      console.log('No authenticated user found in session');
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log(`Connecting wallet for user ${userId}: ${walletAddress}`);

    // Check if the wallet is already connected to another user
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
      console.log('Wallet already connected to another user:', existingUserWithWallet.user_id);
      return NextResponse.json(
        { success: false, message: 'This wallet is already connected to another account' },
        { status: 409 }
      );
    }

    // First check if the user_wallets table exists
    const { error: tableCheckError } = await supabase
      .from('user_wallets')
      .select('count(*)', { count: 'exact', head: true });
    
    // If the table doesn't exist, we need to handle this gracefully
    let tableNeedsCreation = false;
    if (tableCheckError && tableCheckError.message.includes('does not exist')) {
      console.log('user_wallets table does not exist, will create it');
      tableNeedsCreation = true;
    } else if (tableCheckError) {
      console.error('Error checking user_wallets table:', tableCheckError);
      return NextResponse.json(
        { success: false, message: 'Database error while checking tables' },
        { status: 500 }
      );
    }

    // Create the table if it doesn't exist (for development purposes)
    if (tableNeedsCreation) {
      // You would typically handle this in a migration script
      // This is just a placeholder for development
      console.log('Creating user_wallets table');
      // Note: In a real app, don't create tables on-the-fly like this
      return NextResponse.json(
        { success: false, message: 'Database setup required. Please run migrations.' },
        { status: 500 }
      );
    }

    // Check if a wallet connection already exists for this user
    const { data: existingWallet, error: fetchError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && !fetchError.message.includes('does not exist')) {
      console.error('Error checking existing wallet:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Database error while checking user wallet' },
        { status: 500 }
      );
    }

    let result;

    // Update or insert the wallet connection
    if (existingWallet) {
      console.log('Updating existing wallet connection');
      result = await supabase
        .from('user_wallets')
        .update({
          wallet_address: walletAddress,
          is_connected: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      console.log('Creating new wallet connection');
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

    // Check if the users table exists and has the wallet_address column
    const { error: usersTableCheckError } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact', head: true });
    
    // Only update the users table if it exists and doesn't have errors
    if (!usersTableCheckError) {
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
        // Continue execution but log the issue
        console.log('User record not updated, but wallet connection successful');
      }
    } else {
      console.log('Skipping users table update - table may not exist or have wallet_address column');
    }

    console.log('Wallet connected successfully');
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