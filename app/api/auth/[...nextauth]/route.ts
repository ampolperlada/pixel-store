import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '../../../lib/supabase';

// Health check function (run once at startup)
async function checkDatabaseHealth() {
  try {
    const { data, error } = await supabase.rpc('health');
    if (error) throw error;
    console.log('Database health check:', data);
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Initialize health status
let isDatabaseHealthy = false;
checkDatabaseHealth().then(healthy => {
  isDatabaseHealthy = healthy;
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.username?.trim() || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        try {
          // Check database health
          if (!isDatabaseHealthy) {
            const recheck = await checkDatabaseHealth();
            if (!recheck) throw new Error("Service temporarily unavailable");
            isDatabaseHealthy = true;
          }

          // Case-insensitive username search (using the index we created)
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, auth_user_id')
            .ilike('username', credentials.username.trim()) // Uses the index
            .maybeSingle();

          if (userError) {
            console.error('User lookup error:', userError);
            throw new Error("Service temporarily unavailable");
          }

          if (!userData) {
            // Generic error to prevent username enumeration
            throw new Error("Invalid credentials");
          }

          if (!userData.email) {
            console.error('User missing email:', userData);
            throw new Error("Account configuration error");
          }

          // Authenticate with retry logic
          let authData = null;
          let authError = null;
          
          for (let attempt = 0; attempt < 2; attempt++) {
            const result = await supabase.auth.signInWithPassword({
              email: userData.email,
              password: credentials.password,
            });
            
            authData = result.data;
            authError = result.error;
            
            if (!authError) break;
            if (attempt === 0) await new Promise(r => setTimeout(r, 500)); // Short delay before retry
          }

          if (authError) {
            if (authError.message.includes('Invalid login credentials')) {
              throw new Error("Invalid credentials");
            }
            console.error('Auth error:', authError);
            throw new Error("Authentication service unavailable");
          }

          if (!authData?.user) {
            throw new Error("Authentication failed");
          }

          // Verify user ID consistency if using separate tables
          if (userData.auth_user_id && userData.auth_user_id !== authData.user.id) {
            console.error('ID mismatch:', {
              storedId: userData.auth_user_id,
              authId: authData.user.id
            });
            throw new Error("Account verification failed");
          }

          return {
            id: authData.user.id,
            email: authData.user.email,
            name: credentials.username.trim(),
            image: authData.user.user_metadata?.avatar_url
          };

        } catch (error) {
          console.error("Auth error:", {
            error,
            username: credentials.username,
            timestamp: new Date().toISOString()
          });
          
          // Return sanitized error messages
          if (error instanceof Error) {
            // Preserve specific auth errors
            if (error.message === "Invalid credentials") throw error;
            // Generic error for others
            throw new Error("Authentication service unavailable");
          }
          throw new Error("Unexpected error occurred");
        }
      }
    }),
  ],
  // ... (keep your existing callbacks, pages, and session config)
});

export { handler as GET, handler as POST };