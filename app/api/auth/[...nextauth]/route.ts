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
          // Query the users table with the exact column names from your schema
          const { data: user, error } = await supabase
            .from('users')
            .select('user_id, username, email, password_hash')
            .eq('username', usernameInput)
            .maybeSingle(); // Use maybeSingle instead of single to prevent error when no user found
          
          console.log('[Authorize] Username input:', usernameInput);
          console.log('[Authorize] Query result:', user ? 'User found' : 'User not found');
          
          if (error) {
            console.error('[Authorize] Database error:', error);
            throw new Error('Database error during authentication');
          }
          
          if (!user) {
            console.log('[Authorize] No user found with username:', usernameInput);
            throw new Error('Invalid username or password');
          }
          
          // Verify the password hash
          const isValidPassword = await bcrypt.compare(passwordInput, user.password_hash);
          console.log('[Authorize] Password valid?', isValidPassword);
          
          if (!isValidPassword) {
            throw new Error('Invalid username or password');
          }
          
          // Return user data with correct field names from your schema
          return {
            id: user.user_id.toString(), // NextAuth expects a string ID
            name: user.username,
            email: user.email,
            // You don't have avatar_url in your users table based on the schema
            // If you need profile image, you'll need to join with another table
          };
          
        } catch (err) {
          console.error('[Authorize] Exception:', err);
          throw new Error('Invalid username or password');
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

function debug(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args);
  }
}

export { handler as GET, handler as POST };
