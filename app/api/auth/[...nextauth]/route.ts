// app/api/auth/[...nextauth]/route.ts
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

let isDatabaseHealthy = false;
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
        try {
          // 1. Validate input
          if (!credentials?.username?.trim() || !credentials?.password) {
            console.log('[Auth] Missing credentials');
            throw new Error('Username and password are required');
          }

          // 2. Check database health
          if (!isDatabaseHealthy) {
            throw new Error('Database service unavailable');
          }

          // 3. Find user (case-sensitive exact match)
          console.log(`[Auth] Searching for user: "${credentials.username.trim()}"`);
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', credentials.username.trim())
            .maybeSingle();

          if (error || !user) {
            console.log('[Auth] User not found');
            throw new Error('Invalid credentials');
          }

          // 4. Debug password comparison
          console.log('[Auth] Comparing passwords...');
          console.log('Input password:', credentials.password);
          console.log('Stored hash:', user.password_hash);
          
          // 5. Verify password
          const isValid = await bcrypt.compare(
            credentials.password.trim(), // Important: trim whitespace
            user.password_hash
          );

          console.log('[Auth] Password match:', isValid);

          if (!isValid) {
            console.log('[Auth] Password mismatch');
            throw new Error('Invalid credentials');
          }

          // 6. Return user data
          console.log('[Auth] Authentication successful for:', user.username);
          return {
            id: user.user_id,
            email: user.email,
            name: user.username
          };

        } catch (error) {
          console.error('[Auth Error]', error);
          throw new Error('Invalid credentials');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login?error=1'
  }
});

export { handler as GET, handler as POST };