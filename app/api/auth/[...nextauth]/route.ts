import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../lib/supabase';

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

const handler = NextAuth({
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
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('[Auth] Authorization started');
        
        if (!credentials?.username?.trim() || !credentials?.password) {
          console.log('[Auth] Missing credentials');
          throw new Error('Username and password are required');
        }
      
        const usernameInput = credentials.username.trim();
        const passwordInput = credentials.password.trim();
      
        console.log('[Auth] Credentials received:', {
          username: usernameInput,
          password: passwordInput.substring(0, 1) + '...' // Don't log full password
        });
      
        try {
          // 1. Try direct ID lookup first (for user_id 10 - pogipogi)
          console.log('[Auth] Attempting direct user lookup');
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', 10)
            .single();
      
          if (error) {
            console.error('[Auth] Supabase error:', error);
            throw new Error('Database error');
          }
      
          console.log('[Auth] User found:', {
            id: user.user_id,
            username: user.username,
            email: user.email,
            hash: user.password_hash?.substring(0, 10) + '...'
          });
      
          // 2. Verify password hash exists
          if (!user.password_hash || user.password_hash.length < 60) {
            console.error('[Auth] Invalid hash format:', user.password_hash);
            throw new Error('Invalid password hash');
          }
      
          // 3. Compare passwords
          console.log('[Auth] Comparing passwords...');
          const isValid = await bcrypt.compare(passwordInput, user.password_hash);
          console.log('[Auth] Password comparison result:', isValid);
      
          if (!isValid) {
            throw new Error('Invalid password');
          }
      
          return {
            id: user.user_id.toString(),
            name: user.username,
            email: user.email
          };
      
        } catch (err) {
          console.error('[Auth] Full error:', {
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : 'No stack trace'
          });
          throw new Error('Authentication failed');
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login?error=CredentialsSignin'
  }
});

export { handler as GET, handler as POST };