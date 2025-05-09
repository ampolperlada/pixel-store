import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextAuthOptions } from 'next-auth';

// Create an admin client that bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || (() => { throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined'); })(),
  process.env.SUPABASE_SERVICE_ROLE_KEY || (() => { throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined'); })(),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database health check
async function checkDatabaseHealth() {
  try {
    const { data, error } = await supabase.rpc('health');
    if (error) throw error;
    console.log('[HealthCheck] Database is healthy');
    return true;
  } catch (error) {
    console.error('[HealthCheck] Database check failed:', error);
    return false;
  }
}

let isDatabaseHealthy = true;
const refreshHealthStatus = async () => {
  isDatabaseHealthy = await checkDatabaseHealth();
};
refreshHealthStatus();
setInterval(refreshHealthStatus, 5 * 60 * 1000);

// Export authOptions as a separate variable so it can be imported elsewhere
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile'
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' }
      },
      async authorize(credentials) {
        console.log('[Auth] Authorization started');
        
        if (!credentials?.username?.trim() || !credentials?.password) {
          console.log('[Auth] Missing credentials');
          throw new Error('Username and password are required');
        }
      
        const usernameInput = credentials.username.trim().toLowerCase();
        const passwordInput = credentials.password.trim();
        const rememberMe = credentials.rememberMe === 'true';
      
        try {
          // 1. Find user (case-insensitive search)
          console.log('[Auth] Trying case-insensitive username search');
          let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .ilike('username', usernameInput);
      
          if (error) throw error;
          
          // 2. If no results, try with exact match
          if (!users || users.length === 0) {
            console.log('[Auth] Trying exact username match');
            const { data: exactMatch } = await supabase
              .from('users')
              .select('*')
              .eq('username', credentials.username.trim());
            
            users = exactMatch;
          }
      
          // 3. Verify we found exactly one user
          if (!users || users.length !== 1) {
            console.log('[Auth] User not found or multiple users found');
            throw new Error('Invalid credentials');
          }
      
          const user = users[0];
          console.log('[Auth] User found:', { 
            id: user.user_id,
            username: user.username 
          });
      
          // 4. Verify password
          if (!user.password_hash) {
            console.error('[Auth] No password hash found');
            throw new Error('Invalid credentials');
          }
      
          const isValid = await bcrypt.compare(passwordInput, user.password_hash);
          console.log('[Auth] Password comparison result:', isValid);
          
          if (!isValid) throw new Error('Invalid credentials');
          
          // 5. Update last_login_at with explicit timestamp using admin client
          const updateResult = await supabaseAdmin
            .from('users')
            .update({ 
              last_login_at: new Date().toISOString(),
              updated_at: new Date().toISOString() 
            })
            .eq('user_id', user.user_id);
            
          console.log('[Auth] Update query result:', JSON.stringify(updateResult));
          
          if (updateResult.error) {
            console.error('[Auth] Failed to update last_login_at:', updateResult.error);
            throw new Error('Login timestamp update failed');
          }
      
          console.log('[Auth] Updated last_login_at for user:', user.user_id);
      
          // Fetch wallet connection information, if any
          const { data: walletData, error: walletError } = await supabase
            .from('user_wallets')
            .select('wallet_adress, is_connected') // Changed from wallet_address to wallet_adress
            .eq('user_id', user.user_id)
            .maybeSingle();
          
          console.log('[Auth] Wallet data for user:', walletData);
          
          if (walletError) {
            console.error('[Auth] Error fetching wallet data:', walletError);
          }
      
          return {
            id: user.user_id.toString(),
            name: user.username,
            email: user.email,
            rememberMe: rememberMe,
            walletAddress: walletData?.wallet_adress || null, // Changed from wallet_address to wallet_adress
            isWalletConnected: walletData?.is_connected || false
          };
      
        } catch (err) {
          console.error('[Auth] Full error:', err);
          throw new Error('Authentication failed');
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days by default
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days by default
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // Add wallet information to the session
        session.user.walletAddress = token.walletAddress as string || null;
        session.user.isWalletConnected = token.isWalletConnected as boolean || false;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        
        // Save wallet information in the token
        token.walletAddress = (user as any).walletAddress || null;
        token.isWalletConnected = (user as any).isWalletConnected || false;
        
        // Set custom token expiry based on rememberMe
        if ((user as any).rememberMe === false) {
          // If not "remember me", set to 1 day instead of 30
          token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
        }
      }

      // Handle session updates
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        
        // Update wallet information if provided in the session update
        if (session.user.walletAddress !== undefined) {
          token.walletAddress = session.user.walletAddress;
        }
        if (session.user.isWalletConnected !== undefined) {
          token.isWalletConnected = session.user.isWalletConnected;
        }
      }

      return token;
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', {
        userId: user.id,
        provider: account?.provider,
        isNewUser
      });
      
      // Update last_login_at for social logins too
      if (account?.provider === 'google') {
        try {
          // First update the user's login timestamp
          const updateResult = await supabaseAdmin
            .from('users')
            .update({ 
              last_login_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('email', user.email);
            
          console.log('[Auth] Social login update result:', JSON.stringify(updateResult));
          
          if (updateResult.error) {
            console.error('[Auth] Failed to update last_login_at for social login:', updateResult.error);
          } else {
            console.log('[Auth] Updated last_login_at for social login user:', user.email);
          }
          
          // Now fetch wallet information for the Google user
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_id')
            .eq('email', user.email)
            .maybeSingle();
            
          if (userError || !userData) {
            console.error('[Auth] Error finding user by email:', userError);
          } else {
            // Fetch wallet connection data
            const { data: walletData, error: walletError } = await supabase
              .from('user_wallets')
              .select('wallet_adress, is_connected') // Changed from wallet_address to wallet_adress
              .eq('user_id', userData.user_id)
              .maybeSingle();
              
            if (walletError) {
              console.error('[Auth] Error fetching wallet data for Google user:', walletError);
            } else if (walletData) {
              // Add wallet data to the user object (will be used in JWT)
              (user as any).walletAddress = walletData.wallet_adress; // Changed from wallet_address to wallet_adress
              (user as any).isWalletConnected = walletData.is_connected;
              
              console.log('[Auth] Added wallet data to Google user:', {
                walletAddress: walletData.wallet_adress, // Changed from wallet_address to wallet_adress
                isConnected: walletData.is_connected
              });
            }
          }
        } catch (err) {
          console.error('[Auth] Error updating last_login_at for social login:', err);
        }
      }
    },
    async signOut({ token, session }) {
      console.log('User signed out:', { userId: token?.sub });
    }
  },
  pages: {
    signIn: '/login',
    error: '/login?error=CredentialsSignin'
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    }
  },
  theme: {
    colorScheme: "auto",
    logo: "/logo.png",
  },
  debug: process.env.NODE_ENV === 'development'
};

// Use the extracted authOptions in the handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };