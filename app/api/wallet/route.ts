// app/api/wallet/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; // Updated import path

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' }, // Fixed syntax - added curly braces
      { status: 400 }
    );
  }

  try {
    const wallet = await prisma.user_wallets.findFirst({
      where: { 
        user_id: Number(userId),
        is_connected: true 
      },
      select: { 
        wallet_address: true 
      }
    });

    return NextResponse.json({
      walletAddress: wallet?.wallet_address || null
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { message: 'Failed to fetch wallet' },
      { status: 500 }
    );
  }
}