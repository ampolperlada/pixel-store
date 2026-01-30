import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { NextAuthOptions } from 'next-auth';

// Create an admin client that bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
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
          console.log('[Auth] Trying case-insensitive username search');
          let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .ilike('username', usernameInput);
      
          if (error) throw error;
          
          if (!users || users.length === 0) {
            console.log('[Auth] Trying exact username match');
            const { data: exactMatch } = await supabase
              .from('users')
              .select('*')
              .eq('username', credentials.username.trim());
            
            users = exactMatch;
          }
      
          if (!users || users.length !== 1) {
            console.log('[Auth] User not found or multiple users found');
            throw new Error('Invalid credentials');
          }
      
          const user = users[0];
          console.log('[Auth] User found:', { 
            id: user.user_id,
            username: user.username 
          });
      
          if (!user.password_hash) {
            console.error('[Auth] No password hash found');
            throw new Error('Invalid credentials');
          }
      
          const isValid = await bcrypt.compare(passwordInput, user.password_hash);
          console.log('[Auth] Password comparison result:', isValid);
          
          if (!isValid) throw new Error('Invalid credentials');
          
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
          }
      
          const { data: walletData, error: walletError } = await supabase
            .from('user_wallets')
            .select('wallet_address, is_connected')
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
            walletAddress: walletData?.wallet_address || null,
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
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
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
        session.user.walletAddress = token.walletAddress as string || null;
        session.user.isWalletConnected = token.isWalletConnected as boolean || false;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.walletAddress = (user as any).walletAddress || null;
        token.isWalletConnected = (user as any).isWalletConnected || false;
        
        if ((user as any).rememberMe === false) {
          token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
        }
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        
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
      
      if (account?.provider === 'google') {
        try {
          const updateResult = await supabaseAdmin
            .from('users')
            .update({ 
              last_login_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('email', user.email);
            
          console.log('[Auth] Social login update result:', JSON.stringify(updateResult));
          
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_id')
            .eq('email', user.email)
            .maybeSingle();
            
          if (!userError && userData) {
            const { data: walletData, error: walletError } = await supabase
              .from('user_wallets')
              .select('wallet_address, is_connected')
              .eq('user_id', userData.user_id)
              .maybeSingle();
              
            if (!walletError && walletData) {
              (user as any).walletAddress = walletData.wallet_address;
              (user as any).isWalletConnected = walletData.is_connected;
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
    error: '/login'
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60
      }
    }
  },
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };