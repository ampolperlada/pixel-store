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
          // 1. First try with case-insensitive search
          console.log('[Auth] Trying case-insensitive username search');
          let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .ilike('username', `%${usernameInput}%`);
      
          if (error) throw error;
          
          // 2. If no results, try direct ID lookup (temporary debug)
          if (!users || users.length === 0) {
            console.log('[Auth] Trying direct ID lookup for debugging');
            const { data: debugUser } = await supabase
              .from('users')
              .select('*')
              .eq('user_id', 10);
            console.log('[Auth] Debug user lookup result:', debugUser);
            users = debugUser;
          }
      
          // 3. Verify we found exactly one user
          if (!users || users.length !== 1) {
            console.log('[Auth] User not found or multiple users found');
            throw new Error('Invalid credentials');
          }
      
          const user = users[0];
          console.log('[Auth] User found:', { 
            id: user.user_id,
            username: user.username 
          });
      
          // 4. Verify password
          if (!user.password_hash) {
            console.error('[Auth] No password hash found');
            throw new Error('Invalid credentials');
          }
      
          const isValid = await bcrypt.compare(passwordInput, user.password_hash);
          console.log('[Auth] Password comparison result:', isValid);
          
          if (!isValid) throw new Error('Invalid credentials');
          
          // 5. Update last_login_at timestamp
          const { error: updateError } = await supabase
            .from('users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('user_id', user.user_id);
            
          if (updateError) {
            console.error('[Auth] Failed to update last_login_at:', updateError);
          } else {
            console.log('[Auth] Updated last_login_at for user:', user.user_id);
          }
      
          return {
            id: user.user_id.toString(),
            name: user.username,
            email: user.email,
            rememberMe: rememberMe
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
    maxAge: 30 * 24 * 60 * 60, // 30 days by default
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days by default
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        
        // Set custom token expiry based on rememberMe
        if ((user as any).rememberMe === false) {
          // If not "remember me", set to 1 day instead of 30
          token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
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
      
      // Update last_login_at for social logins too
      if (account?.provider === 'google') {
        try {
          const { error } = await supabase
            .from('users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('email', user.email);
            
          if (error) {
            console.error('[Auth] Failed to update last_login_at for social login:', error);
          } else {
            console.log('[Auth] Updated last_login_at for social login user:', user.email);
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
    error: '/login?error=CredentialsSignin'
  },
  // Additional recommended configuration
  theme: {
    colorScheme: "auto",
    logo: "/logo.png", // Add your logo path
  },
  useSecureCookies: process.env.NODE_ENV === 'production'
});

export { handler as GET, handler as POST };