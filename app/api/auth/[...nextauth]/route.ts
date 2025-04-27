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

let isDatabaseHealthy = true; // Assume healthy at startup
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
    
        try {
          // Looking at your schema, let's try the correct table
          console.log('[Authorize] Looking up user:', usernameInput);
          
          // Try the main users table first
          let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', usernameInput)
            .maybeSingle();
          
          // Debug logging
          console.log('[Authorize] Username lookup result:', user ? 'Found' : 'Not found');
          
          if (error) {
            console.error('[Authorize] User lookup error:', error);
            throw new Error('Database error during authentication');
          }
    
          if (!user) {
            console.error('[Authorize] User not found with username:', usernameInput);
            throw new Error('Invalid username or password');
          }
    
          // Check if the password_hash field exists
          if (!user.password_hash) {
            console.error('[Authorize] No password hash found for user');
            throw new Error('Account exists but cannot be accessed with password');
          }
    
          // Validate password hash format
          if (
            !(
              user.password_hash.startsWith('$2a$') ||
              user.password_hash.startsWith('$2b$') ||
              user.password_hash.startsWith('$2y$')
            )
          ) {
            console.error('[Authorize] Invalid password hash format');
            throw new Error('Invalid account configuration');
          }
    
          // Validate password match
          const isValidPassword = await bcrypt.compare(passwordInput, user.password_hash);
          console.log('[Authorize] Password valid?', isValidPassword);
    
          if (!isValidPassword) {
            throw new Error('Invalid username or password');
          }
    
          // Identify the correct ID field based on your schema
          const userId = user.id || user.user_id || user.uuid;
          
          return {
            id: userId,
            name: user.username || user.name || usernameInput,
            email: user.email || null,
            image: user.avatar_url || user.avatar || null
          };
    
        } catch (err) {
          console.error('[Authorize] Exception:', err);
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
    error: '/login?error=CredentialsSignin'
  }
});

function debug(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args);
  }
}

export { handler as GET, handler as POST };
