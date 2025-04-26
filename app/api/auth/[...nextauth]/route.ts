import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '../../../lib/supabase';

// Health check function (run once and at intervals)
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

// Initialize and keep refreshing health status every 5 minutes
let isDatabaseHealthy = false;
const refreshHealthStatus = async () => {
  isDatabaseHealthy = await checkDatabaseHealth();
};
refreshHealthStatus();
setInterval(refreshHealthStatus, 5 * 60 * 1000); // Refresh every 5 minutes

const handler = NextAuth({
  providers: [
    // Google OAuth Provider
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

    // Credentials Provider (Username/Password)
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
      
        // ✅ Declare these outside so they can be accessed in the catch block
        let userData = null;
        let authData = null;
        let authError = null;
      
        try {
          if (!isDatabaseHealthy) {
            const recheck = await checkDatabaseHealth();
            if (!recheck) throw new Error('Service temporarily unavailable');
            isDatabaseHealthy = true;
          }
      
          const { data, error: userError } = await supabase
            .from('users')
            .select('user_id, email')
            .ilike('username', credentials.username.trim())
            .maybeSingle();
      
          userData = data;
      
          if (userError) {
            console.error('[DB] User lookup error:', userError);
            throw new Error('Service temporarily unavailable');
          }
      
          if (!userData) {
            throw new Error('Invalid credentials');
          }
      
          if (!userData.email) {
            console.error('[DB] User missing email:', userData);
            throw new Error('Account configuration error');
          }
      
          // Try authenticating (with one retry on failure)
          for (let attempt = 0; attempt < 2; attempt++) {
            const result = await supabase.auth.signInWithPassword({
              email: userData.email,
              password: credentials.password
            });
      
            authData = result.data;
            authError = result.error;
      
            if (!authError && authData?.user) break;
            if (attempt === 0) await new Promise(r => setTimeout(r, 500));
          }
      
          if (!authData?.user) {
            if (authError?.message?.includes('Invalid login credentials')) {
              throw new Error('Invalid credentials');
            }
            console.error('[Auth] No user returned or unknown error:', authError);
            throw new Error('Authentication service unavailable');
          }
      
          if (userData.user_id && userData.user_id !== authData.user.id) {
            console.error('[Security] ID mismatch:', {
              storedId: userData.user_id,
              authId: authData.user.id
            });
            throw new Error('Account verification failed');
          }
      
          return {
            id: authData.user.id,
            email: authData.user.email,
            name: credentials.username.trim(),
            image: authData.user.user_metadata?.avatar_url
          };
      
        } catch (error) {
          console.error('[Auth][Failure]', {
            error,
            username: credentials.username,
            timestamp: new Date().toISOString()
          });
      
          // ✅ Debug output with declared vars
          console.log('🧪 Debug info:', {
            credentials,
            userData,
            authData,
            authError
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
