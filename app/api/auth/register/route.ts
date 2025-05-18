// Fixed auth/register.ts API route handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../lib/prisma'; // Adjust the import path as necessary
import { hashPassword } from '../../../components/utils/auth-utils'; // Adjust the import path as necessary

// Simple ethereum address validation function
const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/i.test(address);
};

// Define the registration schema with proper types
const registrationSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  wallet_address: z.string().nullable().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
  captchaToken: z.string().nullable().optional(),
  profile_image_url: z.string().optional(),
  isGoogleSignup: z.boolean().optional()
});

// Type for the request body
type RegistrationRequest = z.infer<typeof registrationSchema>;

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json() as RegistrationRequest;
    
    // Validate request data
    const validationResult = registrationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    const { 
      username, 
      email, 
      password, 
      wallet_address: walletAddress, 
      captchaToken,
      isGoogleSignup 
    } = validationResult.data;
    
    // Verify CAPTCHA token if not Google signup
    if (!isGoogleSignup && captchaToken) {
      // This is where you'd verify the captchaToken with Google reCAPTCHA
      // For example:
      // const captchaValid = await verifyCaptcha(captchaToken);
      // if (!captchaValid) {
      //   return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
      // }
    }
    
    // Check if username is already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existingUsername) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 });
    }
    
    // Check if email is already registered
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingEmail) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }
    
    // If wallet address is provided and valid, check if it's already linked to another account
    if (walletAddress && isValidEthereumAddress(walletAddress)) {
      const existingWallet = await prisma.wallet.findUnique({
        where: { address: walletAddress },
        include: { user: true }
      });
      
      if (existingWallet) {
        return NextResponse.json({ 
          error: 'Wallet address is already linked to another account',
          conflictingUser: existingWallet.user.username
        }, { status: 409 });
      }
    } else if (walletAddress && !isValidEthereumAddress(walletAddress)) {
      return NextResponse.json({ error: 'Invalid wallet address format' }, { status: 400 });
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create the user in a transaction to ensure wallet is linked properly
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          agreedToTerms: true,  // User has agreed to terms
          role: 'USER',         // Default role
          status: 'ACTIVE'      // Default status
        }
      });
      
      // If wallet address is provided, link it to the user
      if (walletAddress && isValidEthereumAddress(walletAddress)) {
        await tx.wallet.create({
          data: {
            address: walletAddress,
            userId: newUser.id,
            isPrimary: true,
            status: 'ACTIVE'
          }
        });
      }
      
      return newUser;
    });
    
    // Return success response without including sensitive data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        hasWallet: !!walletAddress
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}