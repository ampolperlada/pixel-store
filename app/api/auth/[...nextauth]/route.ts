import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'; // ✅ Needed for password checking
import { supabase } from '../../../lib/supabase';

// Health check function
async function checkDatabaseHealth() {
  try {
    const { data, error } = await supabase.rpc('health');
    if (error) throw error;
    console.log('[HealthCheck] Database is healthy:', data);
    return true;
  } catch (error) {
    console.error('[HealthCheck] Database check failed:', error);
    return false;
  }
}

// Initialize health status
let isDatabaseHealthy = false;
const refreshHealthStatus = async () => {
  isDatabaseHealthy = await checkDatabaseHealth();
};
refreshHealthStatus();
setInterval(refreshHealthStatus, 5 * 60 * 1000); // Every 5 minutes

const handler = NextAuth({
  providers: [
    // Google OAuth
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

    // Credentials (Username/Password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
     // In your NextAuth authorize function, add these additional debug steps:

async authorize(credentials) {
  if (!credentials?.username?.trim() || !credentials?.password) {
    throw new Error('Username and password are required');
  }

  let userData = null;

  try {
    if (!isDatabaseHealthy) {
      const recheck = await checkDatabaseHealth();
      if (!recheck) throw new Error('Service temporarily unavailable');
      isDatabaseHealthy = true;
    }

    // Debug: Get all usernames from the database for comparison
    const { data: allUsers, error: listError } = await supabase
      .from('users')
      .select('username')
      .limit(10);
    
    console.log('[Debug] Available usernames in database:', 
      allUsers?.map(u => `"${u.username}"`).join(', '));
    console.log('[Debug] Looking for username:', `"${credentials.username.trim()}"`);
    
    // Try using exact match instead of ilike
    console.log('[Debug] Trying exact match query');
    const { data: exactMatch, error: exactError } = await supabase
      .from('users')
      .select('user_id, email, password_hash, username')
      .eq('username', credentials.username.trim())
      .maybeSingle();
      
    console.log('[Debug] Exact match result:', exactMatch ? 'Found' : 'Not found');
    
    // Original ilike query
    console.log('[Auth] Looking up user (with ilike):', credentials.username.trim());
    const { data, error: userError } = await supabase
      .from('users')
      .select('user_id, email, password_hash, username')
      .ilike('username', credentials.username.trim())
      .maybeSingle();

    console.log('[Auth] User lookup result:', data ? 'Found' : 'Not found');

    if (userError) {
      console.error('[DB] User lookup error:', userError);
      throw new Error('Service temporarily unavailable');
    }

    // Use the exact match if available, otherwise use ilike result
    const finalUserData = exactMatch || data;
    
    if (!finalUserData) {
      console.log('[Auth] No user found with either query method');
      throw new Error('Invalid credentials');
    }

    userData = finalUserData;
    console.log('[Debug] Found user:', userData.username);

    if (!userData?.password_hash) {
      console.error('[Auth] Missing password hash for user:', userData);
      throw new Error('Account configuration error');
    }

    // Before password comparison:
    console.log('[Auth] Attempting password comparison');

    // Compare password
    const isValidPassword = await bcrypt.compare(
      credentials.password,
      userData.password_hash
    );

    // After password comparison:
    console.log('[Auth] Password comparison result:', isValidPassword ? 'Success' : 'Failed');

    // Improve error handling
    if (!isValidPassword) {
      console.log('[Auth] Password mismatch for:', userData.username);
      throw new Error('Invalid credentials');
    }

    // ✅ Login success
    return {
      id: userData.user_id,
      email: userData.email,
      name: userData.username
    };

  } catch (error) {
    console.error('[Auth][Failure]', {
      error,
      username: credentials.username,
      timestamp: new Date().toISOString()
    });

    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') throw error;
      throw new Error('Authentication service unavailable');
    }
    throw new Error('Unexpected error occurred');
  }
}
    })
  ],

  session: {
    strategy: 'jwt'
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  }
});

export { handler as GET, handler as POST };