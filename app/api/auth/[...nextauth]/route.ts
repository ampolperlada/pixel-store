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
        if (!credentials?.username?.trim() || !credentials?.password) {
          throw new Error('Username and password are required');
        }
      
        const usernameInput = credentials.username.trim();
        const passwordInput = credentials.password.trim();
      
        if (!isDatabaseHealthy) {
          throw new Error('Database service unavailable');
        }
      
        try {
          // 1. Fetch user by username
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', usernameInput)
            .single();
      
          console.log('[DEBUG] Username looked for:', usernameInput);
          console.log('[DEBUG] Supabase user found:', user);
      
          if (error || !user) {
            console.error('[DB] User lookup error:', error);
            throw new Error('Invalid username or password');
          }
      
          if (!user.password_hash.startsWith('$2a$') && !user.password_hash.startsWith('$2b$')) {
            throw new Error('Invalid password hash format');
          }
      
          const isValidPassword = await bcrypt.compare(
            passwordInput,
            user.password_hash
          );
      
          console.log('[DEBUG] Password valid?', isValidPassword);
      
          if (!isValidPassword) {
            throw new Error('Invalid username or password');
          }
      
          return {
            id: user.user_id,
            name: user.username,
            email: user.email, // still provide email for NextAuth compatibility
            image: user.avatar_url ?? null
          };
      
        } catch (err) {
          console.error('[Authorize][Failure]', err);
          throw new Error('Invalid username or password');
        }
      }
      
    })
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
    error: '/login?error=1'
  }

  
});
function debug(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args);
  }
}

export { handler as GET, handler as POST };
