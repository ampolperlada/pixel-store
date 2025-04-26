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

        if (!isDatabaseHealthy) {
          throw new Error('Database service unavailable');
        }

        try {
          // 1. Verify user exists
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', credentials.username.trim())
            .single();

          if (error || !user) {
            console.error('[DB] User lookup error:', error);
            throw new Error('Invalid username or password');
          }

          // 2. Validate hash structure
          if (!user.password_hash.startsWith('$2a$') && !user.password_hash.startsWith('$2b$')) {
            throw new Error('Invalid password hash format');
          }

          // 3. Compare password
          const isValid = await bcrypt.compare(
            credentials.password.trim(),
            user.password_hash
          );

          if (!isValid) {
            throw new Error('Invalid username or password');
          }

          // 4. Return the user session object
          return {
            id: user.user_id,
            email: user.email,
            name: user.username,
            image: user.avatar_url ?? null // if you have avatar_url field
          };

        } catch (error) {
          console.error('[Authorize][Failure]', error);
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
